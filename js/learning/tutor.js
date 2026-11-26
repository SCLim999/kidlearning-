/* ---------- 🧑‍🏫 Momo 小老师: an on-device teaching assistant (no chatbot, no network) ----------
   It reads the child's own records (words, games, per-level results in S.lv, 错题本) to:
   · give graded help on a wrong answer: 1st → hint, 2nd → one wrong option taken away, 3rd → the answer glows;
   · re-teach visually after 3 first-try misses in a row (the game's 「看看里面」 figure, its how-to, or the word card);
   · recommend a level per game (recLevel) and build a 10-question personal practice round (startTutor);
   · show a report of strengths and weak spots; Momo's own messages can be read in 华文, English or BM. */
const TUTM={
  hi:{zh:'我是 Momo 小老师，我们一起加油！',en:"I'm Momo, your little teacher. Let's learn together!",ms:'Saya Cikgu Momo. Mari belajar bersama!'},
  h1:{zh:'别着急，先看看提示 💡',en:'Don’t worry, look at the hint 💡',ms:'Jangan risau, lihat petunjuk 💡'},
  h1w:{zh:'再听一次，想一想它的意思 👂',en:'Listen again and think about what it means 👂',ms:'Dengar sekali lagi dan fikir maknanya 👂'},
  h2:{zh:'Momo 帮你去掉了一个错的答案，再试一次！',en:'Momo took away one wrong answer. Try again!',ms:'Momo buang satu jawapan yang salah. Cuba lagi!'},
  h3:{zh:'对的答案在发光 ✨ 点它，记住它哦！',en:'The right answer is glowing ✨ Tap it and remember it!',ms:'Jawapan yang betul sedang bersinar ✨ Tekan dan ingat ya!'},
  w1:{zh:'差一点点！再想一想 🤔',en:'Almost! Think again 🤔',ms:'Hampir betul! Fikir lagi 🤔'},
  re:{zh:'这种题有点难，我们一起再看一次！',en:'This one is tricky. Let’s look at it together again!',ms:'Soalan ini agak susah. Mari kita lihat bersama sekali lagi!'}};
const TLANGS={zh:'华文',en:'English',ms:'BM'};
function tutorLang(){try{const v=localStorage.getItem('momo-tutor-lang');if(v in TLANGS)return v}catch(e){}return 'zh'}
function tutorLangSet(v){if(!(v in TLANGS))return;try{localStorage.setItem('momo-tutor-lang',v)}catch(e){}}
function tmsg(key){const m=Object.prototype.hasOwnProperty.call(TUTM,key)?TUTM[key]:TUTM.hi;return m[tutorLang()]}
function sayTutor(key){speak(tmsg(key),tutorLang())}
const tlangBtns=()=>`<span class="tl">${Object.keys(TLANGS).map(l=>`<button class="btn ${l===tutorLang()?'sky':''}" data-act="tlang" data-v="${l}" aria-label="Momo 用${TLANGS[l]}说">${l==='zh'?'中':l==='en'?'EN':'BM'}</button>`).join('')}</span>`;
function tutorBox(q){if(!q.tutor||q.done||(G&&G.mode==='test'))return '';
  let extra='';
  if(q.tutor==='h1w'&&q.w){const lg=q.lang||G.lang;extra=q.m==='listen'?`<br><small>💡 意思是「${esc(q.w.zh)}」</small>`:`<br><small>💡 第一个字母是「${esc(String(q.w[lg]||'').charAt(0))}」</small>`}
  return `<div class="fb try tutor" role="status"><span class="fbi" aria-hidden="true">💡</span><div class="tm">${esc(tmsg(q.tutor))}${extra}</div><button class="btn round" data-act="tsay" data-v="${q.tutor}" aria-label="读出来">🔊</button>${tlangBtns()}</div>`}
/* graded help after each wrong pick on the same question */
function tutorWrong(q){if(!G||G.mode==='test'||q.done)return;
  const isMath=q.m==='math',pickable=isMath||q.m==='listen'||q.m==='read';
  if(!pickable){q.tutor='w1';setTimeout(()=>sayTutor('w1'),450);return}
  const ai=isMath?q.opts.findIndex(o=>o.v===q.ans):q.opts.indexOf(q.w),n=q.wrongIdx.length;
  if(n<=1){q.tutor=isMath?'h1':'h1w';if(isMath&&q.lvl!==3)q.hint=true}
  else if(n===2){const left=q.opts.map((o,i)=>i).filter(i=>i!==ai&&!q.wrongIdx.includes(i));if(left.length>1){q.wrongIdx.push(pick(left));q.tutor='h2'}else{q.reveal=true;q.tutor='h3'}}
  else{q.reveal=true;q.tutor='h3'}
  setTimeout(()=>sayTutor(q.tutor),450)}
/* three first-try misses in a row: teach it again with a picture before going on */
function reteach(q){if(!G||view.name!=='game'||G.mode==='test'||document.querySelector('.reteach'))return;
  let body='',lang=tutorLang();
  if(q.m==='math'){const gm=GAME(q.g);if(!gm)return;
    body=gm.fig?`<p class="zh" style="margin:0 0 8px">${esc(gm.zh)}：按一按、拖一拖，看看是怎么算的 👇</p><iframe class="figframe" src="fig/${gm.fig}.html" title="${esc(gm.zh)}：立体图" style="width:100%;height:520px;border:0"></iframe>`
      :`<div style="font-size:64px">${gm.e}</div><h2 style="margin:4px 0">${esc(gm.zh)}</h2><p class="sttext">${esc(gm.how)}</p><button class="btn sky" data-rt="say" data-l="zh" data-t="${esc(gm.how)}">🔊 读给我听</button>`}
  else if(q.w){const w=q.w;body=`<div style="font-size:84px;line-height:1.1">${pic(w)}</div>
    <div class="row" style="justify-content:center;gap:8px;margin-top:8px">${['en','ms','zh'].filter(l=>w[l]).map(l=>`<button class="btn ${l==='zh'?'':'sky'} big" data-rt="say" data-l="${l}" data-t="${esc(w[l])}">🔊 ${esc(w[l])}</button>`).join('')}</div>
    <p class="zh" style="margin:10px 0 0">一起念三次：英文、国文、华文 👄</p>`}
  else return;
  const o=document.createElement('div');o.className='rest reteach';
  o.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-label="Momo 小老师"><div class="tutor" style="margin:0 0 12px">${pandaDressed(52,'teach')}<div class="tm">${esc(tmsg('re'))}</div></div><div style="text-align:center">${body}</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn sun big" data-rt="ok">我明白了，继续 ▶</button></div></div>`;
  o.addEventListener('click',e=>{const t=e.target.closest('[data-rt]');if(!t)return;if(t.dataset.rt==='ok'){sTap();o.remove()}else if(t.dataset.rt==='say')speak(t.dataset.t,t.dataset.l)});
  document.body.appendChild(o);sayTutor('re');const ok=o.querySelector('[data-rt="ok"]');if(ok)ok.focus()}
/* level suggestion from the per-level records: move up after 8+ answers at 85%+ */
function recLevel(g){const L=S.lv||{};for(const l of [1,2]){const r=L[g+':'+l];if(!r||r.c+r.w<8||r.c/(r.c+r.w)<0.85)return l}return 3}
function recWhy(g){const l=recLevel(g);return l===1?'（先从容易开始，答对多了就升级）':l===2?'（容易的已经答对很多了 👍）':'（容易和中等都很厉害了！🚀）'}
const KINDZH={math:'数学',sci:'科学',cn:'华文',world:'环游世界',en:'英文',ms:'国文'};
function tutorAnalyse(){const items=[];
  for(const kind of ['math','sci','cn','world'])Object.entries(S[kind]||{}).forEach(([g,r])=>{const gm=GAME(g),n=r.c+r.w;if(!gm||n<4)return;
    const mist=Object.entries(S.mist.m).filter(([k])=>k.split(':')[0]===g).reduce((a,[,v])=>a+v,0);
    items.push({type:'g',id:g,name:gm.zh,e:gm.e,kind,n,acc:r.c/n,mist,weak:0})});
  const per={};Object.entries(S.words).forEach(([key,r])=>{const [lang,t]=key.split(':');const tp=T(t);if(!tp)return;const k=lang+':'+t,x=per[k]||(per[k]={type:'w',lang,id:t,name:tp.zh,e:tp.icon,kind:lang,c:0,w:0,weak:0,mist:0});x.c+=r.c;x.w+=r.w;if(r.w>r.c)x.weak++});
  Object.values(per).forEach(x=>{x.n=x.c+x.w;if(x.n<4)return;x.acc=x.c/x.n;items.push(x)});
  const weak=items.filter(x=>x.acc<0.75||x.weak>=2||x.mist>=2).sort((a,b)=>a.acc-b.acc).slice(0,6);
  const strong=items.filter(x=>x.n>=8&&x.acc>=0.9&&!weak.includes(x)).sort((a,b)=>b.acc-a.acc||b.n-a.n).slice(0,5);
  return {items,weak,strong}}
function tutorSummary(){const a=tutorAnalyse();return a.weak.length?a.weak.length+' 个地方要加油':a.items.length?'看看学习报告':'我会帮你学习'}
function vTutor(){const a=tutorAnalyse(),pc=x=>Math.round(x*100)+'%';
  const line=x=>`<div class="tuline"><span style="font-size:34px">${esc(x.e)}</span><div class="tn"><b>${esc(x.name)}</b> <small class="zh">${KINDZH[x.kind]}</small><div class="zh" style="font-size:15px">答对 ${pc(x.acc)}${x.weak?' · '+x.weak+' 个词还不熟':''}${x.mist?' · 错题本里有 '+x.mist+' 题':''}${x.type==='g'?' · 推荐：'+LVN[recLevel(x.id)]:''}</div></div><button class="btn sun" data-act="tpractice" data-v="${x.type==='g'?'g:'+x.id:'w:'+x.lang+':'+x.id}">练一练 ▶</button></div>`;
  return bar('home')+`<div class="panel row" style="background:var(--s-en);color:#2A2F6B">${pandaDressed(84,'happy')}<div style="flex:1;min-width:200px"><h1 style="font-size:30px">Momo 小老师</h1><div style="font-weight:700">我会看你的学习记录，找出你很棒的地方和要多练习的地方。</div></div><div><div class="zh" style="font-size:13px;color:#2A2F6B">Momo 说：</div>${tlangBtns()}</div></div>
  <div class="panel row"><span style="font-size:52px">🎯</span><div style="flex:1;min-width:200px"><h2 style="margin:0">今天的推荐练习</h2><div class="zh">${a.weak.length?'10 题，会多练：'+a.weak.slice(0,3).map(x=>esc(x.name)).join('、'):'10 题，从一年级的游戏里帮你挑选，难度跟着你的程度走'}</div></div><button class="btn sun big" data-act="tutorgo">开始 ▶</button></div>
  ${a.weak.length?`<div class="panel"><h2>💪 要多练习的</h2>${a.weak.map(line).join('')}</div>`:''}
  ${a.strong.length?`<div class="panel"><h2>⭐ 你很棒的</h2><div class="bag">${a.strong.map(x=>`<span class="pill">${esc(x.e)} ${esc(x.name)} ${pc(x.acc)}</span>`).join('')}</div></div>`:''}
  ${a.items.length?'':`<div class="panel"><p style="margin:0">先去玩几个游戏吧！玩得越多，Momo 越知道你哪里很棒、哪里要加油。</p></div>`}
  <div class="panel"><h2>🐼 Momo 怎么教你</h2><ul style="margin:0;padding-left:22px;line-height:1.8">
   <li>答错第 1 次：Momo 给你提示，不直接说答案</li><li>答错第 2 次：Momo 帮你去掉一个错的答案</li><li>答错第 3 次：对的答案会发光，点它、记住它</li>
   <li>连续 3 题答错：Momo 用图（例如乘法积木板）或单词卡再教你一次</li><li>每个游戏会根据你答对多少，推荐容易、中等或困难</li></ul>
   <p class="zh" style="margin:10px 0 0">这些都在这台设备上计算，不会上传到网络。</p></div>`}
/* a 10-question round from the weakest words and games, at the recommended level */
function startTutor(){newLook();if(overLimit()){showRest();return}const qs=[],a=tutorAnalyse(),base=x=>Object.assign(x,{missed:false,hinted:false,done:false,hint:false,wrongIdx:[]});
  Object.entries(S.words).filter(([,r])=>r.w>0&&r.c<MASTER).sort((x,y)=>(y[1].w-y[1].c)-(x[1].w-x[1].c)).slice(0,8).forEach(([key])=>{if(qs.length>=4)return;const [lang,t,...r]=key.split(':');const w=WMAP[t+':'+r.join(':')];if(w&&w[lang]&&T(w.t))qs.push(wordQ(w,lang))});
  const used=new Set();
  for(const x of a.weak.filter(x=>x.type==='g')){if(qs.length>=8)break;const l=recLevel(x.id);used.add(x.id);genSet(GAME(x.id),l,2,x.id+':'+l).forEach(q=>qs.push(base(Object.assign(q,{m:'math',g:x.id,lvl:l}))))}
  const fill=shuffle([...Object.keys(MG),...Object.keys(SG),...Object.keys(CG)].filter(g=>!GAME(g).yr&&!used.has(g)));
  while(qs.length<10&&fill.length){const g=fill.pop(),l=recLevel(g);qs.push(base(Object.assign(genL(GAME(g),l),{m:'math',g,lvl:l})))}
  resetRec();G={topic:'tutor',mode:'tutor',lang:S.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),qs:shuffle(qs.slice(0,10))};
  go({name:'game'});setTimeout(()=>{if(!G||!G.qs[G.i])return;const m=cur().m;if(m==='listen'||m==='math')speakCur()},350)}
