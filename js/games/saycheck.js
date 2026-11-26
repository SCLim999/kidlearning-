/* ---------- 说说看 speaking check ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function normSay(t){return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z\s-]/g,'').replace(/\s+/g,' ').trim()}
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function sayMatch(alts,word){const w=normSay(word);return alts.map(normSay).some(a=>a===w||(' '+a+' ').includes(' '+w+' ')||lev(a,w)<=Math.floor(w.length/4))}
let srBusy=false;
function startSay(){if(!SR){toast('这个浏览器不能听你说话，可以用「🎤 跟读」自己听听看');return}if(srBusy)return;const q=cur(),lg=q.lang||G.lang;
  try{speechSynthesis.cancel()}catch(e){}const r=new SR();r.lang=lg==='en'?'en-GB':'ms-MY';r.maxAlternatives=5;r.interimResults=false;srBusy=true;q.sayMsg='👂 Momo 在听……大声说出来！';render();
  r.onresult=e=>{const alts=[...e.results[0]].map(x=>x.transcript);const ok=sayMatch(alts,q.w[lg]);
    q.sayMsg=ok?'✅ 说对了！Momo 听到：「'+esc(alts[0])+'」':'🤔 Momo 听到：「'+esc(alts[0]||'……')+'」，再听一次，跟着说说看～';
    if(ok){sGood();if(!q.saidOk){q.saidOk=true;const d=dayRec();d.say=(d.say||0)+1;addStars(1);touch()}burst(document.querySelector('.card'),'🗣️')}else sBad()};
  r.onerror=e=>{q.sayMsg=e.error==='not-allowed'||e.error==='service-not-allowed'?'请允许使用麦克风 🎤':'没有听到声音，再试一次吧～'};
  r.onend=()=>{srBusy=false;if(view.name==='game'&&G&&G.qs.includes(q))render()};
  try{r.start();setTimeout(()=>{if(srBusy){try{r.abort()}catch(e){}srBusy=false;if(view.name==='game'&&G&&G.qs.includes(q)){q.sayMsg='没有听到声音，再试一次吧～';render()}}},8000)}catch(e){srBusy=false;q.sayMsg='现在不能听，再试一次吧～';render()}}

function spellCheck(){
  const q=cur();if(q.slots.some(s=>!s.fixed&&!s.val))return;
  const ok=q.slots.every(s=>s.fixed||s.val===s.ch);
  if(ok)answer(true,document.getElementById('slots'));
  else{answer(false);const el=document.getElementById('slots');el.classList.add('shake');
    setTimeout(()=>{q.slots.forEach(s=>{if(!s.fixed&&s.val!==s.ch&&s.tile!=null){q.tiles.find(t=>t.id===s.tile).used=false;s.val=null;s.tile=null}});render()},450)}
}
function endGame(){
  const mins=Math.max(1,Math.round((Date.now()-G.start)/60000));
  if(G.mode==='learn'){addStars(3)}
  if(G.mode==='match'){addStars(G.moves<=8?6:G.moves<=11?5:G.moves<=14?4:3)}
  dayRec().mins+=mins;
  let pass=null;if(G.station!=null){pass=G.mode==='learn'||G.mode==='match'||G.score>=Math.ceil(G.qs.length*0.75);if(pass){const first=!adv().done[G.station];adv().done[G.station]=true;if(STATIONS[G.station].k==='boss'&&first)addStars(5)}}
  if(G.mode==='kboss'){pass=G.score>=Math.ceil(G.qs.length*0.75);const key=G.world+':'+G.ch,R=rpg(),first=!R.boss[key];if(pass){R.boss[key]=Math.max(R.boss[key]||0,G.score);if(first)addStars(5)}}
  if(G.mode==='test'){S.tests.push({d:dk(),s:G.score,n:G.qs.length});S.tests=S.tests.slice(-30)}
  S.sessions.push({t:Date.now(),topic:G.topic,mode:G.mode,lang:G.lang,score:G.mode==='learn'?null:G.score,total:G.qs.length,sec:Math.round((Date.now()-G.start)/1000)});
  S.sessions=S.sessions.slice(-300);touch();
  const earned=S.stars-G.starsBefore;const newSt=STICKERS.filter(s=>s.n>G.starsBefore&&s.n<=S.stars);
  go({name:'end',earned,newSt,mode:G.mode,score:G.score,total:G.qs.length,best:G.best||0,moves:G.moves||0,station:G.station,pass,world:G.world,ch:G.ch,missedNodes:[...new Set(G.qs.filter(q=>q.missed||q.hinted).map(q=>q.node).filter(Boolean))],newCards:cardCount()-(G.cardsBefore||0)});
  setTimeout(()=>{sGood();burst(document.querySelector('.endstar'),'🌟')},200);
}
function vEnd(){
  const v=view;const perfect=v.mode!=='learn'&&v.score===v.total;
  return `<div class="panel setup">
    ${pandaDressed(120,'happy','dance')}
    <h1 style="font-size:36px;margin-top:6px">${v.mode==='match'?'全部配对成功！🎉':perfect?'全对！满分！💯':v.mode==='learn'?'学完啦！':'完成啦！'}</h1>
    ${v.mode==='test'?(()=>{const ts=S.tests,prev=ts.length>1?ts[ts.length-2]:null;return `<p style="font-size:24px;margin:4px 0">📝 小测成绩：<b>${v.score} / ${v.total}</b>${prev?(v.score>prev.s?'　比上次进步了 '+(v.score-prev.s)+' 分！📈':v.score===prev.s?'　和上次一样，继续加油！':'　上次是 '+prev.s+' 分，下次会更好 💪'):''}</p>`})():''}
    ${v.mode==='match'?`<p style="font-size:22px;margin:4px 0">翻了 <b>${v.moves}</b> 次${v.moves<=8?'，记性超好！🧠':''}</p>`:v.mode!=='learn'?`<p style="font-size:22px;margin:4px 0">答对 <b>${v.score}</b> / ${v.total}</p>`:''}
    ${v.best>=3?`<p style="font-size:20px;margin:4px 0">🔥 最高连对 <b>${v.best}</b> ${v.mode==='match'?'对':'题'}</p>`:''}
    <div class="endstar" style="font-size:48px;font-weight:800">⭐ +${v.earned}　🎋 +${v.earned}</div>
    ${v.mode==='kboss'?(()=>{const W=WORLDS.find(x=>x.id===v.world)||WORLDS[0];return v.pass?`<div class="panel" style="background:var(--soft);border-style:dashed">👑 打败了「${esc(W.bossZh)}」！${esc(W.zh)}第 ${v.ch+1} 章完成，下一章开放了。</div>`:`<div class="panel" style="background:var(--soft);border-style:dashed">💪 ${W.boss} 还剩一点血！答对 ${Math.ceil(v.total*0.75)} 题就能打败它。${v.missedNodes&&v.missedNodes.length?'先去练练：'+v.missedNodes.map(esc).join('、'):''}</div>`})():''}
    ${v.station!=null?(v.pass?`<div class="panel" style="background:var(--soft);border-style:dashed">🗺️ 过关啦！${STATIONS[v.station].k==='boss'?'打败大魔王，得到奖杯卡片 🏆！':'下一站已经解锁'}</div>`:`<div class="panel" style="background:var(--soft);border-style:dashed">💪 差一点！答对 ${Math.ceil(v.total*0.75)} 题就能过关，再试一次吧</div>`):''}${v.newCards>0?`<div class="panel row" style="background:var(--soft);border-style:dashed;justify-content:center">📚 得到 ${v.newCards} 张新卡片！<button class="btn sky" data-act="album">去看看</button></div>`:''}${v.newSt.length?`<div class="panel" style="background:var(--soft);border-style:dashed">🎁 获得新贴纸：${v.newSt.map(s=>`<span style="font-size:40px">${s.e}</span> ${s.zh}`).join('、')}</div>`:''}
    <div class="row" style="justify-content:center;margin-top:14px">
      <button class="btn sun big" data-act="again">🔁 再玩一次</button>
      <button class="btn big" data-act="back">${v.station!=null||v.mode==='kboss'?'🗺️ 回地图':'🧩 换个玩法'}</button>
      <button class="btn big" data-act="pet">🐼 去喂 Momo</button>
      <button class="btn big" data-act="home">🏠 回首页</button></div></div>`}
