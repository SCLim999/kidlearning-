/* ---------- 错题本 mistake notebook ---------- */
function mistAdd(q){const M=S.mist;if(q.m==='math'){if(!q.g)return;const k=q.g+':'+(q.lvl||1);M.m[k]=Math.min(5,(M.m[k]||0)+1)}
  else{M.w[wkey(q.lang||G.lang,q.w)]=Date.now();const ks=Object.keys(M.w);if(ks.length>40)ks.sort((a,b)=>M.w[a]-M.w[b]).slice(0,ks.length-40).forEach(k=>delete M.w[k])}}
function mistClear(q){const M=S.mist;if(q.m==='math'){const k=q.g+':'+(q.lvl||1);if(M.m[k]>1)M.m[k]--;else delete M.m[k]}else delete M.w[wkey(q.lang||G.lang,q.w)]}
function mistWords(){return Object.entries(S.mist.w).sort((a,b)=>b[1]-a[1]).map(([k])=>{const [lang,t,...r]=k.split(':');const w=WMAP[t+':'+r.join(':')];return w&&(w[lang])?{k,lang,w}:null}).filter(Boolean)}
function mistGames(){return Object.entries(S.mist.m).map(([k,n])=>{const [g,l]=k.split(':');return GAME(g)?{k,g,l:+l,n,gm:GAME(g)}:null}).filter(Boolean).sort((a,b)=>b.n-a.n)}
function wordQ(w,lang,m){const pool=T(w.t).words.filter(x=>x[lang]);return {w,lang,m:m||pick(['listen','read']),opts:shuffle([w,...shuffle(pool.filter(x=>x!==w)).slice(0,3)]),missed:false,hinted:false,done:false,wrongIdx:[]}}
function mathQ(g,l){return Object.assign(genL(GAME(g),l),{m:'math',g,lvl:l,missed:false,hinted:false,done:false,hint:false,wrongIdx:[]})}
function startMist(){newLook();if(overLimit()){showRest();return}const ws=mistWords().slice(0,6),gs=mistGames();const qs=ws.map(x=>wordQ(x.w,x.lang));
  let room=10-qs.length;gs.forEach(x=>{const n=Math.min(x.n,room);if(n<=0)return;room-=n;genSet(GAME(x.g),x.l,n,x.g+':'+x.l).forEach(q=>qs.push(Object.assign(q,{m:'math',g:x.g,lvl:x.l,missed:false,hinted:false,done:false,hint:false,wrongIdx:[]})))});
  if(!qs.length){toast('错题本是空的，真厉害！🎉');return}
  resetRec();G={topic:'mist',mode:'mist',lang:S.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),qs:shuffle(qs)};
  go({name:'game'});setTimeout(()=>{if(!G||!G.qs[G.i])return;const m=cur().m;if(m==='listen'||m==='math')speakCur()},350)}
function vMist(){const ws=mistWords(),gs=mistGames();
  return bar('home')+`<div class="panel row"><span style="font-size:56px">📒</span><div style="flex:1"><h1 style="font-size:30px">错题本</h1><div class="zh">答错过的题都记在这里。重做的时候第一次就答对，就会从错题本里删掉。</div></div><button class="btn" data-act="home">⬅ 返回</button></div>
  ${ws.length||gs.length?`<div class="panel row" style="justify-content:center"><button class="btn sun big" data-act="mistplay">✏️ 重做错题</button></div>`:`<div class="panel row" style="justify-content:center">${pandaDressed(90,'happy')}<b style="font-size:22px">错题本是空的，真厉害！🎉</b></div>`}
  ${ws.length?`<div class="panel"><h2>单词（${ws.length}）</h2><div class="chips">${ws.map(x=>`<button class="chip" data-act="sayL" data-l="${x.lang}" data-v="${esc(x.w[x.lang])}">${LANGS[x.lang].flag} ${ico(x.w)} ${esc(x.w[x.lang])} <span class="zh">${esc(x.w.zh)}</span></button>`).join('')}</div></div>`:''}
  ${gs.length?`<div class="panel"><h2>数学 · 科学 · 华文</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">重做时会出同一类型的新题目</div><div class="mlist">${gs.map(x=>`<button class="chip" data-act="mistgame" data-v="${x.k}">${x.gm.e} ${x.gm.zh} · ${LVN[x.l]||LVN[1]} <span class="zh">错 ${x.n} 次</span></button>`).join('')}</div></div>`:''}`}

/* ---------- 每周小测 weekly test ---------- */
function startTest(){newLook();if(overLimit()){showRest();return}const qs=[];
  const tried=l=>BASE.filter(t=>t.words.some(w=>{const r=wstat(l,w);return r.c+r.w>0}));
  ['en','ms'].forEach(l=>{const ts=tried(l).length?tried(l):BASE.filter(t=>!t.yr&&!t.book&&!t.bm);const used=new Set();for(let k=0,tries=0;k<2&&tries<50;tries++){const t=pick(ts),w=pick(t.words),key=t.id+':'+(w.k||w.en);if(used.has(key))continue;used.add(key);qs.push(wordQ(w,l));k++}});
  const pk=(o,n)=>shuffle(Object.keys(o)).slice(0,n);shuffle(Object.keys(MG).filter(k=>!MG[k].yr)).slice(0,2).forEach(g=>qs.push(mathQ(g,rnd(1,2))));shuffle(Object.keys(SG).filter(k=>!SG[k].yr)).slice(0,2).forEach(g=>qs.push(mathQ(g,1)));shuffle(Object.keys(CG).filter(k=>!CG[k].yr)).slice(0,2).forEach(g=>qs.push(mathQ(g,1)));
  resetRec();G={topic:'test',mode:'test',lang:S.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),qs:shuffle(qs)};
  go({name:'game'});setTimeout(()=>{if(!G||!G.qs[G.i])return;const m=cur().m;if(m==='listen'||m==='math')speakCur()},350)}
function vTest(){const ts=S.tests||[],wk=weekKeys(0),thisWk=ts.filter(t=>wk.includes(t.d));const best=thisWk.reduce((a,t)=>Math.max(a,t.s),-1);
  return bar('home')+`<div class="panel row"><span style="font-size:56px">📝</span><div style="flex:1"><h1 style="font-size:30px">每周小测</h1><div class="zh">10 题综合小测：英文 2 题、国文 2 题、数学 2 题、科学 2 题、华文 2 题。每个星期测一次，看看进步了多少！</div></div><button class="btn" data-act="home">⬅ 返回</button></div>
  <div class="panel row" style="justify-content:center">${best>=0?`<b style="font-size:20px">这个星期最高分：${best} / 10</b>`:'<b style="font-size:20px">这个星期还没有测过哦</b>'}<button class="btn sun big" data-act="teststart">开始小测 ▶</button></div>
  <div class="panel"><h2>以前的成绩 📈</h2>${ts.length?`<div class="bars2">${ts.slice(-10).reverse().map(t=>`<div style="font-weight:700">${fmtK(t.d)}</div><div class="mrow"><div class="meter"><i style="width:${t.s*100/t.n}%;background:var(--sky)"></i></div>${t.s} / ${t.n}</div>`).join('')}</div>`:'<p class="zh" style="margin:0">还没有成绩。</p>'}</div>`}

/* ---------- 打印贴纸表 printable sticker chart ---------- */
function vPrint(){const ks=weekKeys(view.off||0),WD=['一','二','三','四','五','六','日'];let tot=0;
  const rows=ks.map((k,i)=>{const d=S.days[k]||{};tot+=d.stars||0;return `<tr><td>${fmtK(k)}</td><td>星期${WD[i]}</td><td>${d.stars?'⭐ '+d.stars:''}</td><td>${(d.stars||0)>=S.goal?'✅':''}</td><td>${d.mins||''}</td><td class="stk"></td></tr>`}).join('');
  return bar('growth')+`<div class="panel row noprint"><button class="btn" data-act="growth">⬅ 返回</button><button class="btn" data-act="printwk" data-v="${(view.off||0)+1}">◀ 上一周</button>${view.off?`<button class="btn" data-act="printwk" data-v="${view.off-1}">下一周 ▶</button>`:''}<div class="spacer"></div><button class="btn sun big" data-act="doprint">🖨️ 打印</button></div>
  <div class="panel"><div class="row">${panda(80)}<div><h1 style="font-size:30px">${esc(S.name)} 的学习贴纸表</h1><div style="font-weight:700">${fmtK(ks[0])} – ${fmtK(ks[6])}　每日目标：${S.goal} ⭐</div></div></div>
  <table class="ptable" style="margin-top:14px"><thead><tr><th>日期</th><th>星期</th><th>星星</th><th>达标</th><th>分钟</th><th>家长贴纸</th></tr></thead><tbody>${rows}</tbody></table>
  <p style="font-size:20px;font-weight:800;margin:14px 0 0">这个星期一共 ⭐ ${tot} 颗星星！　家长签名：＿＿＿＿＿＿</p></div>`}

/* ---------- Momo 的信 weekly letter ---------- */
function letterText(){const w=weekSum(1),wt=weakTopic();
  const good=w.days>=5?'你几乎天天都来学习，Momo 好佩服你！':w.days>=3?'你很用功，Momo 很开心！':'谢谢你来陪 Momo 学习！';
  return `亲爱的 ${S.name}：

上个星期，你学习了 ${w.days} 天，拿到了 ${w.stars} 颗星星 ⭐${w.newWords?'，还新学会了 '+w.newWords+' 个词':''}。${good}

${wt?'这个星期，我们一起多练「'+wt.zh+'」好不好？':'这个星期，我们一起去冒险地图闯关好不好？'}每天学一点点，你会越来越厉害！

Momo 送你 3 根竹子 🎋，谢谢你喂我！

爱你的 Momo 🐼`}
let letterShown=false;
function maybeLetter(){if(letterShown||view.name!=='home'||!S.name)return;const wk=weekKeys(0)[0];if(S.letterWk===wk)return;
  const had=weekSum(1).days>0;S.letterWk=wk;if(had){S.bamboo=(S.bamboo||0)+3}touch();if(had)showLetter()}
function showLetter(){letterShown=true;const o=document.createElement('div');o.className='rest';const t=letterText();
  o.innerHTML=`<div class="panel setup letter"><h1 style="font-size:30px">📮 Momo 的信</h1><div style="text-align:center">${pandaDressed(90,'happy')}</div><div>${esc(t)}</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn sky big" data-l="say">🔊 念给我听</button><button class="btn sun big" data-l="ok">谢谢 Momo ❤️</button></div></div>`;
  o.addEventListener('click',e=>{const b=e.target.closest('[data-l]');if(!b)return;if(b.dataset.l==='say')speak(t.replace(/[⭐🎋🐼📮]/gu,''),'zh');else{try{speechSynthesis.cancel()}catch(x){}o.remove();render()}});document.body.appendChild(o)}
