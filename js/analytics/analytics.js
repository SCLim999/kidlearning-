/* ---------- 📐 Learning analytics: knowledge mastery, not stars ----------
   Every knowledge point is in one of four states:
   未开始 Not Started · 学习中 Learning · 练习中 Practising · 已掌握 Mastered.
   A word: no answers → ns; answered right 3 times (MASTER) and not overdue for review → mast; mastered but overdue,
   or answered right at least once and as often as wrong → prac; otherwise learn.
   A game: no answers → ns; 8+ answers at 85%+ on both 容易 and 中等 (S.lv), or 15+ at 90% without level data → mast;
   fewer than 6 answers or under 60% → learn; otherwise prac.
   A word topic counts its words: 80% mastered → mast, half practising or mastered → prac, any answers → learn.
   Retention = answers on words that were already mastered (ro right / rm wrong, kept by recordWord). */
const MSTATE=[['ns','未开始','Not Started'],['learn','学习中','Learning'],['prac','练习中','Practising'],['mast','已掌握','Mastered']];
const MSCORE={ns:0,learn:1,prac:2,mast:3};
function wordState(r,today){if(!r||r.c+r.w===0)return 'ns';if(r.c>=MASTER)return r.due&&r.due<today?'prac':'mast';return r.c>=1&&r.c>=r.w?'prac':'learn'}
function gameState(k,g){const kind=GKIND(g),r=(k[kind]||{})[g];const n=r?r.c+r.w:0;if(!n)return {st:'ns',n:0,acc:null};
  const acc=r.c/n,lv=k.lv||{},ok=x=>x&&x.c+x.w>=8&&x.c/(x.c+x.w)>=0.85,has=lv[g+':1']||lv[g+':2']||lv[g+':3'];
  const st=(ok(lv[g+':1'])&&ok(lv[g+':2']))||(!has&&n>=15&&acc>=0.9)?'mast':n<6||acc<0.6?'learn':'prac';return {st,n,acc}}
function topicKP(k,t,lang,today){const ws=t.words.filter(w=>w[lang]);const cnt={ns:0,learn:0,prac:0,mast:0};let c=0,wr=0;
  ws.forEach(w=>{const r=k.words[wkey(lang,w)];cnt[wordState(r,today)]++;if(r){c+=r.c;wr+=r.w}});const N=ws.length||1;
  const st=cnt.ns===ws.length?'ns':cnt.mast>=0.8*N?'mast':cnt.prac+cnt.mast>=0.5*N?'prac':'learn';
  return {type:'w',id:t.id,lang,name:t.zh,e:t.icon,st,cnt,N:ws.length,n:c+wr,acc:c+wr?c/(c+wr):null,score:(cnt.learn+2*cnt.prac+3*cnt.mast)/(3*N),yr:t.yr?2:t.bm?3:t.book?4:1}}
function knowledge(k){const today=dk(),subj={};
  for(const lang of ['en','ms']){const kps=BASE.filter(t=>!t.only||t.only===lang).map(t=>topicKP(k,t,lang,today));
    const words={ns:0,learn:0,prac:0,mast:0};kps.forEach(x=>MSTATE.forEach(([s])=>words[s]+=x.cnt[s]));subj[lang]={kps,words}}
  for(const kind of ['math','sci','cn','world']){const bank={math:MG,sci:SG,cn:CG,world:WG}[kind];
    subj[kind]={kps:Object.keys(bank).map(g=>{const gm=bank[g],s=gameState(k,g);return {type:'g',id:g,name:gm.zh,e:gm.e,st:s.st,n:s.n,acc:s.acc,score:MSCORE[s.st]/3,yr:gm.yr||1}})}}
  Object.values(subj).forEach(x=>{x.cnt={ns:0,learn:0,prac:0,mast:0};x.kps.forEach(p=>x.cnt[p.st]++);const st=x.kps.filter(p=>p.st!=='ns');x.started=st.length;x.score=st.length?st.reduce((a,p)=>a+p.score,0)/st.length:null});
  return subj}
function retention(k){let ro=0,rm=0;const lost=[],today=dk();let due=0,mast=0;
  Object.entries(k.words).forEach(([key,r])=>{ro+=r.ro||0;rm+=r.rm||0;if(r.c>=MASTER){mast++;if(r.due&&r.due<=today)due++}
    if(r.rm){const [l,t,...e]=key.split(':');const w=WMAP[t+':'+e.join(':')];if(w&&w[l])lost.push({l,w,rm:r.rm,ro:r.ro||0})}});
  return {ro,rm,rate:pct(ro,ro+rm),lost:lost.sort((a,b)=>b.rm-a.rm).slice(0,8),due,mast}}
/* weekly (last 8) and monthly (last 6) trends: time, answers, first-try accuracy, words newly mastered (r.m) */
function trends(k){const mastDates=Object.values(k.words).map(r=>r.m).filter(Boolean),agg=ks=>{let mins=0,c=0,w=0,days=0;ks.forEach(d=>{const r=k.days[d];if(!r)return;if(r.stars>0||r.secs>0)days++;mins+=r.secs?Math.round(r.secs/60):(r.mins||0);c+=r.correct||0;w+=r.wrong||0});const set=new Set(ks);return {mins,n:c+w,acc:pct(c,c+w),days,mast:mastDates.filter(d=>set.has(d)).length}};
  const weeks=[7,6,5,4,3,2,1,0].map(o=>{const ks=weekKeys(o);return Object.assign(agg(ks),{label:o===0?'本周':fmtK(ks[0])})});
  const months=[5,4,3,2,1,0].map(o=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-o);const y=d.getFullYear(),m=d.getMonth(),ks=[];for(let i=1;i<=31;i++){const x=new Date(y,m,i);if(x.getMonth()!==m)break;ks.push(dk(x))}return Object.assign(agg(ks),{label:o===0?'本月':(m+1)+' 月'})});
  return {weeks,months}}
/* next steps for the parent: reviews due, weakest points, nearly mastered, then the next new topic or game */
function nextSteps(k,K,R){const out=[];
  if(R.due)out.push({e:'🔁',t:'复习 '+R.due+' 个到期的词',d:'学会的词隔几天要再复习，才不会忘记（英文或国文页的「今日复习」）'});
  const all=Object.entries(K).flatMap(([s,x])=>x.kps.map(p=>Object.assign({s},p)));
  all.filter(p=>p.st==='learn'&&p.n>=4).sort((a,b)=>(a.acc||0)-(b.acc||0)).slice(0,2).forEach(p=>out.push({e:'🧩',t:'多练「'+p.name+'」（'+SNAME[p.s].replace(/^\S+ /,'')+'）',d:p.type==='g'?'答对 '+Math.round(p.acc*100)+'%，建议玩「'+LVN[recLevelK(k,p.id)]+'」':'还有 '+(p.cnt.learn)+' 个词在学习中'}));
  all.filter(p=>p.st==='prac').sort((a,b)=>b.score-a.score||(b.acc||0)-(a.acc||0)).slice(0,1).forEach(p=>out.push({e:'🚀',t:'「'+p.name+'」快掌握了',d:p.type==='g'?'试试「'+LVN[recLevelK(k,p.id)]+'」':'再练 '+(p.N-p.cnt.mast)+' 个词就全部学会'}));
  const lang=k.lang==='ms'?'ms':'en',nt=K[lang].kps.filter(p=>p.st==='ns').sort((a,b)=>a.yr-b.yr)[0];
  if(nt)out.push({e:'🌱',t:'开始新主题「'+nt.name+'」（'+SNAME[lang].replace(/^\S+ /,'')+'）',d:nt.N+' 个新词'});
  for(const s of ['math','sci','cn']){const g=K[s].kps.filter(p=>p.st==='ns'&&p.yr===1)[0];if(g&&out.length<6){out.push({e:'✨',t:'试试新游戏「'+g.name+'」（'+SNAME[s].replace(/^\S+ /,'')+'）',d:'一年级'});break}}
  return out.slice(0,6)}
function recLevelK(k,g){const L=k.lv||{};for(const l of [1,2]){const r=L[g+':'+l];if(!r||r.c+r.w<8||r.c/(r.c+r.w)<0.85)return l}return 3}
const msBar=(cnt,total)=>`<div class="msbar" role="img" aria-label="${MSTATE.map(([s,z])=>z+' '+cnt[s]).join('，')}">${MSTATE.map(([s])=>cnt[s]?`<i class="ms-${s}" style="width:${cnt[s]*100/total}%" title="${cnt[s]}"></i>`:'').join('')}</div>`;
const msChip=s=>{const m=MSTATE.find(x=>x[0]===s);return `<span class="mschip ms-${s}">${m[1]}</span>`};
function vAnalytics(k){const K=knowledge(k),R=retention(k),Tr=trends(k),steps=nextSteps(k,K,R),mode=view.trend==='m'?'months':'weeks',rows=Tr[mode],maxMin=Math.max(1,...rows.map(r=>r.mins)),maxM=Math.max(1,...rows.map(r=>r.mast));
  const subjRow=s=>{const x=K[s],tot=x.kps.length;return `<details class="kp"><summary><b>${SNAME[s]}</b> <span class="zh">已掌握 ${x.cnt.mast} / ${tot} 个知识点 · 开始了 ${x.started} 个${x.score!=null?' · 掌握度 '+Math.round(x.score*100)+'%':''}</span>${msBar(x.cnt,tot)}${x.words?`<div class="zh" style="font-size:13px;margin-top:4px">单词：${MSTATE.map(([st,z])=>z+' '+x.words[st]).join(' · ')}</div>${msBar(x.words,Object.values(x.words).reduce((a,b)=>a+b,0)||1)}`:''}</summary>
    <div class="kplist">${x.kps.filter(p=>p.st!=='ns').sort((a,b)=>MSCORE[a.st]-MSCORE[b.st]||(a.score-b.score)).map(p=>`<div class="kprow">${msChip(p.st)}<span>${esc(p.e)} ${esc(p.name)}</span><small class="zh">${p.type==='w'?'学会 '+p.cnt.mast+' / '+p.N+' 个词':p.n+' 题 · 答对 '+Math.round(p.acc*100)+'%'}</small></div>`).join('')||'<p class="zh" style="margin:6px 0">还没开始</p>'}
    ${x.cnt.ns?`<p class="zh" style="font-size:13px;margin:6px 0 0">还有 ${x.cnt.ns} 个没开始：${x.kps.filter(p=>p.st==='ns').slice(0,8).map(p=>esc(p.name)).join('、')}${x.cnt.ns>8?'……':''}</p>`:''}</div></details>`};
  const weakSubj=Object.entries(K).filter(([,x])=>x.started>=2&&x.score!=null).sort((a,b)=>a[1].score-b[1].score)[0];
  const weakKP=Object.entries(K).flatMap(([s,x])=>x.kps.map(p=>Object.assign({s},p))).filter(p=>p.n>=4&&(p.st==='learn'||(p.acc!=null&&p.acc<0.7))).sort((a,b)=>(a.acc||0)-(b.acc||0)).slice(0,6);
  return `<div class="panel"><h2>知识掌握 🧠</h2><p class="zh" style="font-size:14px;margin:-6px 0 10px">星星和答题数不等于学会。这里看每个知识点（单词主题、游戏）掌握到哪一步：${MSTATE.map(([s,z,e])=>`${msChip(s)} <small>${e}</small>`).join(' ')}</p>
    ${['en','ms','math','sci','cn','world'].map(subjRow).join('')}
    <p class="zh" style="font-size:13px;margin:10px 0 0">单词：答对 3 次算掌握，到期没复习就回到「练习中」。游戏：容易和中等都答过 8 题以上、答对 85% 以上才算掌握。</p></div>
  <div class="panel"><h2>薄弱环节 🧩</h2>${weakSubj?`<p style="margin:0 0 8px">最需要加强的科目：<b>${SNAME[weakSubj[0]]}</b>（掌握度 ${Math.round(weakSubj[1].score*100)}%）</p>`:''}
    ${weakKP.length?weakKP.map(p=>`<div class="kprow">${msChip(p.st)}<span>${esc(p.e)} ${esc(p.name)} <small class="zh">${SNAME[p.s].replace(/^\S+ /,'')}</small></span><small class="zh">${p.n} 题 · 答对 ${Math.round((p.acc||0)*100)}%</small></div>`).join(''):'<p class="zh" style="margin:0">目前没有明显的薄弱环节 👍</p>'}</div>
  <div class="panel"><h2>下一步推荐 🧭</h2>${steps.length?steps.map(x=>`<div class="kprow"><span style="font-size:26px">${x.e}</span><span><b>${esc(x.t)}</b><br><small class="zh">${esc(x.d)}</small></span></div>`).join(''):'<p class="zh" style="margin:0">先多玩几次，就会有推荐。</p>'}</div>
  <div class="panel"><h2>学习趋势 📈</h2><div class="row" style="gap:8px;margin:-4px 0 8px"><button class="btn ${mode==='weeks'?'sun':''}" data-act="trend" data-v="w">每周</button><button class="btn ${mode==='months'?'sun':''}" data-act="trend" data-v="m">每月</button></div>
    <div class="zh" style="font-size:14px">蓝色：学习分钟 · 绿色：新掌握的词</div>
    <div class="vbars" role="img" aria-label="学习趋势">${rows.map(r=>`<div class="vb" title="${r.label}：${r.mins} 分钟，${r.n} 题，正确率 ${r.acc==null?'–':r.acc+'%'}，新掌握 ${r.mast} 个词"><b>${r.mins}</b><span class="vpair"><i style="height:${r.mins*100/maxMin}%"></i><i class="mk" style="height:${r.mast*100/maxM}%"></i></span></div>`).join('')}</div>
    <div class="vlabels">${rows.map(r=>`<span>${r.label}</span>`).join('')}</div>
    <table class="ptable" style="margin-top:12px;font-size:15px"><thead><tr><th>${mode==='weeks'?'周':'月'}</th><th>天数</th><th>分钟</th><th>答题</th><th>正确率</th><th>新掌握的词</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.label}</td><td>${r.days}</td><td>${r.mins}</td><td>${r.n}</td><td>${r.acc==null?'–':r.acc+'%'}</td><td>${r.mast}</td></tr>`).join('')}</tbody></table></div>
  <div class="panel"><h2>复习保持率 🔁</h2>${R.ro+R.rm?`<p style="margin:0 0 6px;font-size:20px"><b>${R.rate}%</b> <span class="zh" style="font-size:15px">学会以后再考，还答对的比例（${R.ro} 对 / ${R.rm} 错）</span></p>`:`<p class="zh" style="margin:0 0 6px">还没有复习资料。孩子学会的词过几天再出现时，这里会显示有没有记住。</p>`}
    <p class="zh" style="font-size:14px;margin:0">学会的词：${R.mast} 个 · 今天到期要复习：${R.due} 个</p>
    ${R.lost.length?`<h3 style="margin:12px 0 6px">学会以后又忘记的词</h3><div class="chips">${R.lost.map(x=>`<span class="chip">${LANGS[x.l].flag} ${ico(x.w)} ${esc(x.w[x.l])} <span class="zh">${esc(x.w.zh)} · 忘了 ${x.rm} 次</span></span>`).join('')}</div>`:''}</div>`}
