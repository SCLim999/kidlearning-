/* ---------- game ---------- */
function reviewInfo(){const weak=[],due=[],today=dk();
  TOPICS.filter(t=>!t.only||t.only===S.lang).forEach(t=>t.words.forEach(w=>{const r=wstat(S.lang,w);if(r.c+r.w>0&&r.c<MASTER)weak.push({w,k:r.w*2-r.c});else if(r.c>=MASTER&&(!r.due||r.due<=today))due.push(w)}));
  return{weak:shuffle(weak).sort((a,b)=>b.k-a.k).map(x=>x.w),due:shuffle(due)}}
function reviewWords(){const r=reviewInfo();const a=r.weak.slice(0,6);return a.concat(r.due.slice(0,8-a.length))}
function startGame(mode,topicId0,lang0){newLook();
  if(overLimit()){showRest();return}
  resetRec();
  if(mode==='match'){const t=T(topicId0||view.topic||(G&&G.topic));const ws=shuffle(t.words).slice(0,6);
    const cards=shuffle(ws.flatMap(w=>[{w,k:'e'},{w,k:'t'}])).map((c,i)=>Object.assign(c,{i,up:false,done:false}));
    G={topic:t.id,mode,lang:lang0||S.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),cards,open:[],moves:0,qs:ws.map(w=>({w,m:'match'}))};go({name:'game'});return}
  let words,topicId;
  if(mode==='review'){words=shuffle(reviewWords());topicId='review'}
  else{const t=T(topicId0||view.topic||(G&&G.topic));topicId=t.id;words=shuffle(t.words)}
  if(!words.length){toast('还没有要复习的词哦');return}
  G={topic:topicId,mode,lang:lang0||S.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),
     qs:words.map(w=>{const pool=T(w.t).words;return {w,m:mode==='review'?pick(['listen','read']):mode,opts:shuffle([w,...shuffle(pool.filter(x=>x!==w)).slice(0,mode==='bubble'?4:3)]),missed:false,hinted:false,done:false,wrongIdx:[]}})};
  setupTiles();
  go({name:'game'});
  setTimeout(()=>{if(!G||!G.qs[G.i])return;const m=cur().m;if(m==='listen'||m==='learn'||m==='sent'||m==='dict')speakCur()},350);
}
function cur(){return G.qs[G.i]}
function sentOf(q,lang){return T(q.w.t).sent[lang](q.w)}
function curText(){const q=cur();if(q.m==='math')return q.done?q.sayAns:q.say;return q.m==='sent'?sentOf(q,q.lang||G.lang):q.w[q.lang||G.lang]}
function speakCur(){if(!G||!G.qs[G.i])return;const q=cur();speak(curText(),q.m==='math'?'zh':q.lang||G.lang)}
function setupTiles(){const q=cur();
  if(q.m==='sent'){const toks=sentOf(q,G.lang).split(' ');q.slots=toks.map(ch=>({ch,val:null,tile:null}));q.tiles=shuffle(toks.map((ch,id)=>({id,ch,used:false})))}
  else if(q.m==='spell'||q.m==='dict'){const word=q.w[q.lang||G.lang].toLowerCase();
    q.slots=[...word].map(ch=>/[a-z]/.test(ch)?{ch,val:null,tile:null}:{ch,fixed:true});
    const letters=[...word].filter(c=>/[a-z]/.test(c));if(q.m==='dict'){const abc='abcdefghijklmnoprstuwy';for(let k=0;k<2;k++)letters.push(abc[rnd(0,abc.length-1)])}
    q.tiles=shuffle(letters.map((ch,id)=>({id,ch,used:false})))}}

function gameBar(){
  return bossBar()+`<div class="gbar"><button class="btn round" data-act="quit" aria-label="离开">✕</button>
  <div class="dots">${G.qs.map((q,i)=>`<i class="${i===G.i&&!q.done?'now':q.done?(q.missed||q.hinted?'no':'ok'):''}"></i>`).join('')}</div>
  ${LOOK?`<span class="pill scenepill" title="这一轮的场景">${LOOK.scene.e} ${LOOK.scene.zh}</span>`:''}${G.combo>=2?`<span class="pill" style="background:var(--pink)">🔥 ${G.combo}</span>`:''}<span class="pill">⭐ +${G.mode==='learn'?0:G.score}</span>${fsOK()?`<button class="btn round" data-act="fs" aria-label="${fsEl()?'退出全屏':'全屏'}">${fsEl()?'<svg class="fsico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h3v8H2V7h5zM17 2h-3v8h8V7h-5zM7 22h3v-8H2v3h5zM17 22h-3v-8h8v3h-5z"/></svg>':'<svg class="fsico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 2h8v3H5v5H2zM22 2h-8v3h5v5h3zM2 22h8v-3H5v-5H2zM22 22h-8v-3h5v-5h3z"/></svg>'}</button>`:''}</div>`}

function feedbackBox(){
  const q=cur();if(!q.done)return '';const c=pick(CHEER);const first=!q.missed&&!q.hinted;const lg=q.lang||G.lang;
  return `<div class="feedback">${pandaDressed(64,"happy",G.combo>=3?"dance":"")}<div class="ft">${comboBadge()}${first?c[lg==='en'?0:1]+' '+c[2]:'答对了！下次会更快哦 💪'}
    <small>${q.m==='sent'?ico(q.w)+' '+esc(sentOf(q,lg))+(S.showZh?' ＝ '+esc(sentOf(q,'zh')):''):[ico(q.w)+' '+esc(q.w[lg]),esc(q.w[lg==='en'?'ms':'en']),S.showZh||!q.w.e?esc(q.w.zh):''].filter(x=>x.trim()).join(' = ')}</small></div>
    <button class="btn sun big" data-act="next" autofocus>${G.i<G.qs.length-1?'下一题 ▶':'看成绩 🎉'}</button></div>`}

function vGame(){
  if(G.mode==='match')return vMatch();
  if(cur().m==='math')return vMath();
  const q=cur();const w=q.w;const lg=q.lang||G.lang;const m=q.m;
  if(m==='learn'){
    return gameBar()+`<div class="stage"><div class="card" data-act="sayCur">
      <div class="prompt">${pic(w)}</div><div class="word">${esc(w[lg])}</div>
      <div class="other">${esc(w[lg==='en'?'ms':'en'])}</div>${w.e?zh(w.zh):''}${w.note?`<div class="zh" style="font-size:15px;margin-top:6px">${esc(w.note)}</div>`:''}</div>
      <div class="row" style="justify-content:center;margin-top:24px">
        <button class="btn round" data-act="prev" ${G.i===0?'disabled':''} aria-label="上一个">◀</button>
        <button class="btn sky big" data-act="sayCur">🔊 ${LANGS[lg].zh}</button>
        ${S.showZh?`<button class="btn big" data-act="sayZh">🔊 华文</button>`:''}
        <button class="btn sun round" data-act="lnext" aria-label="下一个">▶</button></div>
      <div class="row" style="justify-content:center;margin-top:18px">
        <button class="btn ${recState==='rec'?'pink':'mint'} big" data-act="rec">${recState==='rec'?'⏹ 录好了':'🎤 跟读'}</button>
        ${recUrl&&recState!=='rec'?'<button class="btn big" data-act="mine">▶ 听我的</button><button class="btn big" data-act="compare">🔁 对比</button>':''}${SR&&recState!=='rec'?`<button class="btn ${srBusy?'pink':'sun'} big" data-act="saycheck">🗣️ 说说看</button>`:''}</div>
      ${q.sayMsg?`<div class="saybox">${q.sayMsg}</div>`:''}
      <p class="zh">${recState==='rec'?'正在录音……大声念出来！':'先听一听，再按「跟读」念一次，听听自己念得像不像～'}</p></div>`}
  if(m==='bubble'){
    return gameBar()+`<div class="stage"><div class="prompt" style="font-size:84px;margin:0">${pic(w)}</div>${w.e?zh(w.zh):''}
      ${q.done?`<div class="word" style="margin:14px 0">${esc(w[lg])}</div>${feedbackBox()}`:`<p class="zh" style="margin:4px 0">戳破写着对的${LANGS[lg].zh}单词的泡泡！🫧</p>
      <div class="pond">${q.opts.map((o,i)=>{const n=q.opts.length,dur=6+((i*3+G.i)%4),delay=-(((i*2.3)+G.i*0.7)%dur);
        return `<button class="bub ${q.wrongIdx.includes(i)?'popx':''}" style="left:${3+i*(82/n)}%;--y:${8+((i*37+G.i*11)%62)}%;animation-duration:${dur}s;animation-delay:${delay.toFixed(1)}s" data-act="ans" data-v="${i}">${esc(o[lg])}</button>`}).join('')}</div>`}</div>`}
  if(m==='listen'){
    return gameBar()+`<div class="stage">
      <button class="btn sky big" data-act="sayCur" style="font-size:30px;margin:10px 0">🔊 再听一次</button>
      <p class="zh" style="margin:4px 0">听到的是哪一个？</p>
      <div class="opts">${q.opts.map((o,i)=>`<button class="opt emo ${q.done&&o===w?'right':''} ${q.wrongIdx.includes(i)?'wrong':''} ${q.reveal&&!q.done&&o===w?'glow':''}" data-act="ans" data-v="${i}" ${q.done?'disabled':''} aria-label="选项 ${i+1}">${pic(o)}</button>`).join('')}</div>
      ${tutorBox(q)}${feedbackBox()}</div>`}
  if(m==='read'){
    return gameBar()+`<div class="stage"><div class="prompt">${pic(w)}</div>${w.e?zh(w.zh):''}
      <p class="zh" style="margin:4px 0">哪一个是${LANGS[lg].zh}？</p>
      <div class="opts">${q.opts.map((o,i)=>`<button class="opt ${q.done&&o===w?'right':''} ${q.wrongIdx.includes(i)?'wrong':''} ${q.reveal&&!q.done&&o===w?'glow':''}" data-act="ans" data-v="${i}" ${q.done?'disabled':''}>${esc(o[lg])}</button>`).join('')}</div>
      ${tutorBox(q)}${feedbackBox()}</div>`}
  // spell / sent
  const wd=m==='sent'?' wd':'';
  return gameBar()+`<div class="stage">${m==='dict'&&!q.done?`<button class="btn sky big" data-act="sayCur" style="font-size:44px;margin:8px 0" aria-label="再听一次">🎧 🔊</button><p class="zh" style="margin:4px 0">听一听，把听到的${LANGS[lg].zh}单词写出来（有 2 个多出来的字母哦）</p>`:`<div class="prompt" style="font-size:96px">${pic(w)}</div>${m==='sent'?(S.showZh?`<div class="helpzh">${esc(sentOf(q,'zh'))}</div>`:''):w.e||m==='dict'?zh(w.zh):''}`}
    <div class="row" style="justify-content:center"><button class="btn sky" data-act="sayCur">🔊 ${m==='sent'?'听句子':'听一听'}</button>${q.done?'':`<button class="btn" data-act="hint">💡 提示</button><button class="btn" data-act="clear">↺ 重来</button>`}</div>
    <div class="slots" id="slots">${q.slots.map((s,i)=>s.fixed?(s.ch===' '?'<div class="slot gap"></div>':`<div class="slot f">${esc(s.ch)}</div>`):`<button class="slot${wd} ${s.val?'f':''}" data-act="unslot" data-v="${i}" aria-label="第${i+1}格">${s.val?esc(s.val):''}</button>`).join('')}</div>
    ${q.done?'':`<div class="tiles">${q.tiles.map(t=>`<button class="btn tile${wd} ${t.used?'used':''}" data-act="tile" data-v="${t.id}">${esc(t.ch)}</button>`).join('')}</div>`}
    ${feedbackBox()}</div>`}

function answer(ok,el){
  const q=cur();if(q.done)return;const rect=el&&el.getBoundingClientRect?el.getBoundingClientRect():null;
  if(ok){q.done=true;q.tutor=null;const first=!q.missed&&!q.hinted;if(first&&(G.mode==='mist'||G.mode==='tutor'))mistClear(q);if(first){G.missRun=0;G.score++;G.combo=(G.combo||0)+1;G.best=Math.max(G.best||0,G.combo);q.m==='math'?recordMath(q.g||G.game,true,q.lvl):recordWord(q.w,true,q.lang)}else G.combo=0;
    sGood();render();burst(rect||document.querySelector('.feedback'));setTimeout(speakCur,250);
    if(G.combo>=3){setTimeout(()=>burst(document.querySelector('.feedback .momo'),'🔥'),300);if([3,5,8].includes(G.combo)){const pr=PRAISE[G.combo%3];setTimeout(()=>speak(pr[0],pr[1],true),400)}}}
  else{G.combo=0;let again=false;if(!q.missed){q.missed=true;mistAdd(q);q.m==='math'?recordMath(q.g||G.game,false,q.lvl):recordWord(q.w,false,q.lang);G.missRun=(G.missRun||0)+1;if(G.missRun>=3){G.missRun=0;again=true}}sBad();tutorWrong(q);if(again)setTimeout(()=>reteach(q),700)}
}
