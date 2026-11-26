/* ---------- 家长后台 parent dashboard (PIN only) ---------- */
const SNAME={en:'🔤 英文',ms:'🇲🇾 国文',math:'🔢 数学',sci:'🔬 科学',cn:'🀄 华文',world:'🌍 环游世界',map:'🗺️ 冒险地图',mist:'📒 错题本',test:'📝 小测',duel:'⚔️ 对战',other:'其他'};
const SUBCOL={en:'var(--s-en)',ms:'var(--s-ms)',math:'var(--s-math)',sci:'var(--s-sci)',cn:'var(--s-cn)',world:'var(--s-world)'};
function sessSubj(r){const t=r.topic||'';if(/^(math|sci|cn|world):/.test(t))return t.split(':')[0];if(t.startsWith('boss:')||t.startsWith('kboss:'))return 'map';if(t==='mist'||t==='test'||t==='duel'||t==='tutor')return t;if(r.lang==='en'||r.lang==='ms')return r.lang;return 'other'}
const pct=(c,t)=>t?Math.round(c*100/t):null;
function kidWeek(k,off){const ks=weekKeys(off);let stars=0,mins=0,c=0,w=0,days=0;ks.forEach(d=>{const r=k.days[d];if(!r)return;if(r.stars>0||r.secs>0)days++;stars+=r.stars||0;mins+=r.secs?Math.round(r.secs/60):(r.mins||0);c+=r.correct||0;w+=r.wrong||0});return{ks,stars,mins,acc:pct(c,c+w),days}}
function adminStats(k){const A={};
  const dv=Object.values(k.days);A.days=dv.filter(d=>d.stars>0||d.secs>0).length;A.mins=dv.reduce((a,d)=>a+(d.secs?Math.round(d.secs/60):(d.mins||0)),0);
  const tc=dv.reduce((a,d)=>a+(d.correct||0),0),tw=dv.reduce((a,d)=>a+(d.wrong||0),0);A.acc=pct(tc,tc+tw);A.answers=tc+tw;
  const last=k.sessions.reduce((a,r)=>Math.max(a,r.t),0);A.last=last?new Date(last):null;
  // per subject accuracy
  A.subj=['en','ms','math','sci','cn','world'].map(s=>{let c=0,w=0,tried=0,mast=0;
    if(s==='en'||s==='ms')Object.entries(k.words).forEach(([key,r])=>{if(key.startsWith(s+':')){c+=r.c;w+=r.w;if(r.c+r.w)tried++;if(r.c>=MASTER)mast++}});
    else Object.values(k[s]||{}).forEach(r=>{c+=r.c;w+=r.w});return{s,c,w,n:c+w,acc:pct(c,c+w),tried,mast}});
  // items for strengths / weaknesses: word topics (per language) and each game
  const items=[];const tp={};Object.entries(k.words).forEach(([key,r])=>{const [l,t]=key.split(':');const id=l+':'+t;(tp[id]=tp[id]||{l,t,c:0,w:0});tp[id].c+=r.c;tp[id].w+=r.w});
  Object.values(tp).forEach(x=>{const t=T(x.t);if(t)items.push({name:SNAME[x.l]+' · '+t.zh,c:x.c,w:x.w})});
  ['math','sci','cn','world'].forEach(s=>Object.entries(k[s]||{}).forEach(([g,r])=>{const gm=GAME(g);if(gm)items.push({name:SNAME[s]+' · '+gm.zh,c:r.c,w:r.w})}));
  items.forEach(x=>{x.n=x.c+x.w;x.acc=pct(x.c,x.n)});const enough=items.filter(x=>x.n>=6);
  A.strong=enough.filter(x=>x.acc>=80).sort((a,b)=>b.acc-a.acc||b.n-a.n).slice(0,4);A.weak=enough.filter(x=>x.acc<80).sort((a,b)=>a.acc-b.acc).slice(0,4);
  // interests: what the child chooses to play, and when
  const ss=k.sessions;A.plays=ss.length;const by={};ss.forEach(r=>{const s=sessSubj(r);by[s]=by[s]||{n:0,sec:0};by[s].n++;by[s].sec+=r.sec||0});
  A.bySubj=Object.entries(by).map(([s,v])=>({s,n:v.n,sec:v.sec})).sort((a,b)=>b.n-a.n);
  const mc={};ss.forEach(r=>{const m=MODES[r.mode];if(m&&!['math','sci','review','boss'].includes(r.mode)){mc[r.mode]=(mc[r.mode]||0)+1}else if(/^(math|sci|cn|world):/.test(r.topic)){const g=GAME(r.topic.split(':')[1]);if(g){const key='g:'+r.topic.split(':')[1];mc[key]=(mc[key]||0)+1}}});
  A.fav=Object.entries(mc).map(([k2,n])=>{const g=k2.startsWith('g:')&&GAME(k2.slice(2));return{name:g?g.e+' '+g.zh:MODES[k2].e+' '+MODES[k2].zh,n}}).sort((a,b)=>b.n-a.n).slice(0,5);
  const hb=[['🌅 早上','5–12 点',5,12],['☀️ 下午','12–18 点',12,18],['🌙 晚上','18–22 点',18,22],['🦉 很晚','22 点以后',22,29]];
  A.hours=hb.map(([n,d,a,b])=>({n,d,c:ss.filter(r=>{let h=new Date(r.t).getHours();if(h<5)h+=24;return h>=a&&h<b}).length}));
  A.weeks=[5,4,3,2,1,0].map(o=>kidWeek(k,o));
  A.hard=Object.entries(k.words).filter(([,r])=>r.w>0&&r.c<MASTER).sort((a,b)=>(b[1].w-b[1].c)-(a[1].w-a[1].c)).slice(0,10).map(([key,r])=>{const [l,t,...e]=key.split(':');const w=WMAP[t+':'+e.join(':')];return w&&w[l]?{l,w,r}:null}).filter(Boolean);
  A.tests=(k.tests||[]).slice(-6);A.mist=Object.keys(k.mist.w).length+Object.values(k.mist.m).reduce((a,n)=>a+n,0);
  A.mastered=['en','ms'].map(l=>Object.entries(k.words).filter(([key,r])=>key.startsWith(l+':')&&r.c>=MASTER).length);
  return A}
function adminSummary(k,A){const top=A.bySubj.filter(x=>SUBCOL[x.s])[0],tot=A.bySubj.reduce((a,x)=>a+x.n,0),hr=A.hours.slice().sort((a,b)=>b.c-a.c)[0];
  const lines=[];
  if(A.strong.length)lines.push('💪 强项：'+A.strong.slice(0,3).map(x=>x.name.replace(/^\S+ /,'')+'（'+x.acc+'%）').join('、'));
  if(A.weak.length)lines.push('🧩 需要帮忙：'+A.weak.slice(0,3).map(x=>x.name.replace(/^\S+ /,'')+'（'+x.acc+'%）').join('、'));
  if(top&&tot>=3)lines.push('❤️ 最常选：'+SNAME[top.s].replace(/^\S+ /,'')+'（'+Math.round(top.n*100/tot)+'% 的游戏）'+(A.fav[0]?'，最常玩「'+A.fav[0].name.replace(/^\S+ /,'')+'」':''));
  if(hr&&hr.c)lines.push('🕒 常在'+hr.n.replace(/^\S+ /,'')+'学习');
  return lines}
function abar(label,sub,val,max,txt,col){const w=max?Math.max(0,Math.min(100,val*100/max)):0;return `<div class="abar" title="${esc(label)}：${esc(txt)}"><div>${label}${sub?`<small>${sub}</small>`:''}</div><div class="tr"><i style="width:${w}%;background:${col||'var(--sky)'}"></i></div><div class="v">${txt}</div></div>`}

function vAdmin(){const ids=Object.keys(ALL.kids),id=ALL.kids[view.kid]?view.kid:ALL.cur,k=ALL.kids[id],A=adminStats(k),sum=adminSummary(k,A);
  const maxPlay=Math.max(1,...A.bySubj.map(x=>x.n)),maxMin=Math.max(1,...A.weeks.map(w=>w.mins)),maxH=Math.max(1,...A.hours.map(h=>h.c));
  const tile=(n,l)=>`<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`;
  return bar('settings')+`<div class="adm"><div class="panel row admhead"><span style="font-size:52px">📊</span><div class="t"><h1 style="font-size:30px">家长后台</h1><div class="zh">只有输入家长密码才能看。资料只保存在这台设备上。</div></div><button class="btn" data-act="copyadmin" data-v="${esc(id)}">📋 复制摘要</button><button class="btn" data-act="settings">⬅ 返回</button></div>
  ${ids.length>1?`<div class="panel kidtabs">${ids.map(i=>`<button class="btn ${i===id?'sun':''}" data-act="adminkid" data-v="${esc(i)}">${esc(ALL.kids[i].avatar)} ${esc(ALL.kids[i].name||'?')}</button>`).join('')}</div>`:''}
  <div class="panel"><h2>${esc(k.avatar)} ${esc(k.name)} 的总览</h2><div class="stats">
    ${tile(A.days,'📅 学习天数')}${tile(A.mins,'⏱️ 总共分钟')}${tile('⭐ '+k.stars,'星星')}${tile(A.acc==null?'–':A.acc+'%','🎯 第一次就答对')}${(K0=>tile(K0.en.words.mast+' / '+K0.ms.words.mast,'🏅 已掌握的英文 / 国文词'))(knowledge(k))}${tile(A.last?fmtK(dk(A.last)):'–','🕒 最近一次')}</div></div>
  ${vAnalytics(k)}
  <div class="panel"><h2>重点发现 🔍</h2>${sum.length?`<div class="ins"><div><h3>💪 强项</h3>${A.strong.length?`<ul>${A.strong.map(x=>`<li>${esc(x.name)} — <b>${x.acc}%</b> <span class="zh">（${x.n} 题）</span></li>`).join('')}</ul>`:'<p class="zh" style="margin:0">再多玩一点就看得出来</p>'}</div>
    <div><h3>🧩 需要帮忙</h3>${A.weak.length?`<ul>${A.weak.map(x=>`<li>${esc(x.name)} — <b>${x.acc}%</b> <span class="zh">（${x.n} 题）</span></li>`).join('')}</ul>`:'<p class="zh" style="margin:0">目前没有明显的弱项 👍</p>'}</div>
    <div><h3>❤️ 兴趣</h3><ul>${A.bySubj.filter(x=>SUBCOL[x.s]).slice(0,2).map(x=>`<li>最常选 ${SNAME[x.s]}（${x.n} 次）</li>`).join('')}${A.fav.slice(0,2).map(x=>`<li>喜欢玩 ${esc(x.name)}（${x.n} 次）</li>`).join('')}</ul></div></div>
    <p class="zh" style="font-size:14px;margin:10px 0 0">强项 / 需要帮忙：至少做过 6 题的主题或游戏，按「第一次就答对」的比例排列。</p>`:'<p class="zh" style="margin:0">还没有足够的资料。孩子多玩几次以后，这里会显示强项、弱项和兴趣。</p>'}</div>
  <div class="panel"><h2>各科正确率 🎯</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">第一次就答对的比例（右边是答了几题）</div>
    ${A.subj.map(x=>abar(SNAME[x.s],x.s==='en'||x.s==='ms'?'试过 '+x.tried+' 个词 · 学会 '+x.mast:'',x.acc||0,100,x.n?x.acc+'% · '+x.n+' 题':'还没玩',SUBCOL[x.s])).join('')}</div>
  <div class="panel"><h2>兴趣：最常选的 ❤️</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">最近 ${A.plays} 次游戏里，每样玩了几次</div>
    ${A.bySubj.length?A.bySubj.map(x=>abar(SNAME[x.s]||x.s,x.sec?'约 '+Math.max(1,Math.round(x.sec/60))+' 分钟':'',x.n,maxPlay,x.n+' 次',SUBCOL[x.s]||'var(--sky)')).join(''):'<p class="zh" style="margin:0">还没有记录</p>'}
    ${A.fav.length?`<h3 style="margin:14px 0 6px">最喜欢的玩法</h3><div class="chips">${A.fav.map(x=>`<span class="chip">${esc(x.name)} · ${x.n} 次</span>`).join('')}</div>`:''}</div>
  <div class="panel"><h2>通常什么时候学习 🕒</h2>${A.hours.map(h=>abar(h.n,h.d,h.c,maxH,h.c+' 次')).join('')}</div>
  <div class="panel"><h2>最难的词 🧱</h2>${A.hard.length?`<div class="chips">${A.hard.map(x=>`<span class="chip">${LANGS[x.l].flag} ${ico(x.w)} ${esc(x.w[x.l])} <span class="zh">${esc(x.w.zh)} · 错 ${x.r.w} 对 ${x.r.c}</span></span>`).join('')}</div>`:'<p class="zh" style="margin:0">没有特别难的词 👍</p>'}
    <p class="zh" style="font-size:14px;margin:10px 0 0">📒 错题本里还有 ${A.mist} 题。${A.tests.length?'最近小测：'+A.tests.map(t=>t.s+'/'+t.n).join('、'):'还没做过每周小测。'}</p></div></div>`}
function adminText(id){const k=ALL.kids[id]||S,A=adminStats(k),K=knowledge(k),R=retention(k),NS=nextSteps(k,K,R);return `📊 ${k.name} 的学习摘要（${fmtK(dk())}）\n知识掌握：`+['en','ms','math','sci','cn','world'].map(s2=>SNAME[s2].replace(/^\S+ /,'')+' '+K[s2].cnt.mast+'/'+K[s2].kps.length).join('、')+`\n复习保持率：${R.rate==null?'–':R.rate+'%'}\n下一步：`+NS.map(x=>x.t).join('；')+`\n学习天数：${A.days} 天，共 ${A.mins} 分钟，⭐ ${k.stars}\n第一次就答对：${A.acc==null?'–':A.acc+'%'}\n已掌握的词：英文 ${K.en.words.mast}、国文 ${K.ms.words.mast}\n`+adminSummary(k,A).join('\n')+`\n各科正确率：`+A.subj.filter(x=>x.n).map(x=>SNAME[x.s].replace(/^\S+ /,'')+' '+x.acc+'%').join('、')}
function openAdmin(){if(!ALL.pin){if(!confirm('家长后台只有家长能看。请先设定一个 4 位数的家长密码。'))return;setPin();if(!ALL.pin)return;go({name:'admin',kid:ALL.cur});return}needPin(()=>go({name:'admin',kid:ALL.cur}))}
