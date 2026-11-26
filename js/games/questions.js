/* ---------- the shared question-game engine for 数学 / 科学 / 华文 / 环游世界 ----------
   GKIND/GAME look a game up across MG, SG, CG, WG; genL/genSet build rounds without repeats; recordMath keeps
   results (also per level in S.lv); startMath/vMath run a round; vMTopic is a game's page with its levels and figure. */
const GKIND=g=>MG[g]?'math':SG[g]?'sci':CG[g]?'cn':WG[g]?'world':null, GAME=g=>MG[g]||SG[g]||CG[g]||WG[g];
// One card and one year grouping for every subject page, so all subjects look the same
function gameCard([k,g]){const r=(S[GKIND(k)]||{})[k]||{c:0,w:0};
  return `<button class="topic" style="background:${g.hue}" data-act="mtopic" data-v="${k}"><div class="ic">${g.e}</div><h3>${g.zh}</h3><div class="t2">${g.d}</div><div class="foot"><div class="cnt">${r.c?'✅ 答对 '+r.c+' 题':'还没玩过'}</div></div></button>`}
const groups=(gs,card)=>gs.filter(([,xs])=>xs.length).map(([h,xs])=>`<h2 class="ghead">${h}</h2>`+xs.map(card).join('')).join('');
const byYear=(all,card)=>groups([['📗 一年级',all.filter(([,g])=>!g.yr)],['📘 二年级',all.filter(([,g])=>g.yr===2)]],card);
const LVN=['','容易','中等','困难'];
// 困难: games without their own l3 mix 容易 and 中等 questions
const genL=(g,l)=>l<3||g.l3?g.gen(l):g.gen(rnd(1,2));
const isMG=m=>m==='math'||m==='sci'||m==='cn'||m==='world';
function recordMath(g,ok,lvl){if(lvl>=1&&lvl<=3){const L=S.lv||(S.lv={}),k=g+':'+lvl,r2=L[k]||(L[k]={c:0,w:0});ok?r2.c++:r2.w++}const kind=GKIND(g);const store=S[kind]||(S[kind]={});const r=store[g]||(store[g]={c:0,w:0});const d=dayRec();if(ok){r.c++;d.correct++;const f={math:'mc',sci:'sc',cn:'cc',world:'wc'}[kind];d[f]=(d[f]||0)+1;addStars(1)}else{r.w++;d.wrong++}touch()}
/* no repeated questions: each slot takes the least-recently-seen of up to 60 candidates
   (this round's picks count as most recent), so a round has no repeats when the bank is big enough,
   repeats in small banks are spread out, and the next round avoids what was just asked. History kept in memory. */
const sigTxt=h=>String(h||'').replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu,'');
const qSig=q=>{if(q._sig)return q._sig;let v='';try{v=sigTxt(q.html(false))+'|'+(q.optsFn?q.optsFn(false):q.opts.map(o=>o.l==null?o.v:o.l)).map(sigTxt).sort().join('~')}catch(e){}
  return q._sig=String(q.say||q.title||'')+'|'+String(q.ans)+'|'+v};
const RECENT={};
function genSet(gm,level,n,key){const out=[],hist=(RECENT[key]||[]).slice();
  for(let i=0;i<n;i++){let best=null,bs=-2;
    for(let t=0;t<60;t++){const q=genL(gm,level),k=hist.indexOf(qSig(q)),sc=k<0?1e9:k;if(sc>bs){best=q;bs=sc;if(sc===1e9)break}}
    out.push(best);hist.unshift(qSig(best))}
  RECENT[key]=hist.slice(0,80);return out}
function startMath(game,level){newLook();if(overLimit()){showRest();return}resetRec();const kind=GKIND(game),g=GAME(game);
  G={topic:kind+':'+game,mode:kind,game,level,lang:'zh',i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),
     qs:genSet(g,level,level===3?10:8,game+':'+level).map(q=>Object.assign(q,{m:'math',g:game,lvl:level,missed:false,hinted:false,done:false,hint:false,wrongIdx:[]}))};
  go({name:'game'});setTimeout(speakCur,350)}
function vMath(){const q=cur();const h=q.hint||q.done;const labels=q.optsFn?q.optsFn(h):q.opts.map(o=>o.l);
  return gameBar()+`<div class="stage">${qCoach(q,'想一想，选出正确的答案',{open:CB.say('听题目')+(q.hint||q.lvl===3?'':CB.hint('mhint')),done:CB.say('听题目')})}
   <div class="qcard"><div class="mq">${q.title}</div><div class="mview">${q.html(h)}</div></div>
   <div class="opts aarea${q.wide?' wide':''}">${q.opts.map((o,i)=>`<button class="opt${q.big?' emo':''} ${q.done&&o.v===q.ans?'right':''} ${q.wrongIdx.includes(i)?'wrong':''} ${q.reveal&&!q.done&&o.v===q.ans?'glow':''}" data-act="ans" data-v="${i}" ${q.done?'disabled':''}>${labels[i]}</button>`).join('')}</div>
   ${tutorBox(q)}${q.done?fbOk(q.explain):''}
  </div>`}
function vMTopic(){const g=GAME(view.game);
  return bar('home')+`<div class="panel row" style="background:${g.hue};color:#2A2F6B"><div style="font-size:72px;line-height:1">${g.e}</div><div><h1 style="font-size:36px">${g.zh}</h1><div style="font-weight:700">${g.d}</div></div><div class="spacer"></div><button class="btn" data-act="subjpage">⬅ 返回</button></div>
  <p class="zh" style="margin:0 0 8px">🐼 Momo 推荐你玩「${LVN[recLevel(view.game)]}」${recWhy(view.game)}</p><div class="modes"><button class="btn mode ${recLevel(view.game)===1?'recmode':''}" data-act="mplay" data-v="1"><span class="e">🌱</span><b>${LVN[1]}</b><span>${g.l1}</span></button><button class="btn mode ${recLevel(view.game)===2?'recmode':''}" data-act="mplay" data-v="2"><span class="e">⭐</span><b>${LVN[2]}</b><span>${g.l2}</span></button><button class="btn mode ${recLevel(view.game)===3?'recmode':''}" data-act="mplay" data-v="3"><span class="e">🚀</span><b>${LVN[3]}</b><span>${g.l3||'容易和中等混合'} · 10 题 · 没有提示</span></button></div>
  <div class="panel" style="margin-top:18px"><h2>怎么玩？</h2><p style="margin:0">${g.how}</p></div>
  ${g.fig?`<div class="panel" style="margin-top:18px"><h2>🔍 看看里面</h2><iframe class="figframe" src="fig/${g.fig}.html" title="${g.zh}：立体图" loading="lazy"></iframe></div>`:''}`}
// fig/*.html posts its card height so the iframe fits without scrollbars
addEventListener('message',e=>{const d=e.data;if(!d||typeof d!=='object'||!d.momoFig)return;const h=Math.round(Number(d.h));if(!(h>50&&h<4000))return;document.querySelectorAll('.figframe').forEach(f=>{if(f.contentWindow===e.source)f.style.height=h+'px'})});
