/* ---------------- Momo 的家 (pet) ---------------- */
const SHOP=[
 {id:'cap',slot:'hat',e:'🧢',zh:'棒球帽',p:10},{id:'straw',slot:'hat',e:'👒',zh:'草帽',p:20},{id:'tophat',slot:'hat',e:'🎩',zh:'魔术帽',p:25},{id:'grad',slot:'hat',e:'🎓',zh:'博士帽',p:35},{id:'crown',slot:'hat',e:'👑',zh:'皇冠',p:60},
 {id:'bow',slot:'ear',e:'🎀',zh:'蝴蝶结',p:8},{id:'flower',slot:'ear',e:'🌸',zh:'小花',p:8},{id:'sunflower',slot:'ear',e:'🌻',zh:'向日葵',p:12},
 {id:'glasses',slot:'face',e:'👓',zh:'眼镜',p:12},{id:'shades',slot:'face',e:'🕶️',zh:'墨镜',p:18},
 {id:'balloon',slot:'hand',e:'🎈',zh:'气球',p:10},{id:'ball',slot:'hand',e:'⚽',zh:'足球',p:12},{id:'teddy',slot:'hand',e:'🧸',zh:'小熊',p:15},{id:'kite',slot:'hand',e:'🪁',zh:'风筝',p:15},
 {id:'bg-forest',slot:'bg',e:'🎋',zh:'竹林',p:20},{id:'bg-beach',slot:'bg',e:'🏖️',zh:'海边',p:25},{id:'bg-space',slot:'bg',e:'🚀',zh:'太空',p:40},{id:'bg-castle',slot:'bg',e:'🏰',zh:'城堡',p:50}];
const BGS={sky:{g:'linear-gradient(#BFE6FF,#EAF7FF)',d:['☁️','☀️','☁️']},'bg-forest':{g:'linear-gradient(#D8F5D2,#8FD48A)',d:['🎋','🌳','🎋']},'bg-beach':{g:'linear-gradient(#9FE0FF 62%,#FFE3A3 62%)',d:['🌴','☀️','🐚']},'bg-space':{g:'linear-gradient(#20235A,#4A3D8F)',d:['⭐','🪐','🌙']},'bg-castle':{g:'linear-gradient(#FFD6E7,#C9B8FF)',d:['🌈','🏰','✨']}};
const MOMO_TALK=[['Hello!','Hai!','你好！'],['I love bamboo!','Saya suka buluh!','我最爱吃竹子！'],['Let’s learn together!','Jom belajar bersama!','我们一起学习吧！'],['You are great!','Kamu hebat!','你真棒！'],['Give me a hug!','Peluk saya!','抱抱我！'],['That tickles!','Gelilah!','好痒哦，哈哈！']];
const PRAISE=[['Awesome!','en'],['Hebat!','ms'],['太厉害了！','zh']];
function pet(){return S.pet||(S.pet={owned:[],wear:{},bg:'sky',fed:0,happy:60})}
function happyNow(){const p=pet();const days=p.fed?(Date.now()-p.fed)/86400000:0;return Math.max(0,Math.min(100,Math.round(p.happy-days*25)))}
function pandaDressed(size,mood,cls){const w=pet().wear||{};const it=id=>{const x=SHOP.find(s=>s.id===id);return x?x.e:''};
  const m=mood||(happyNow()<35?'oops':'happy');
  return `<span class="momo ${cls||''}" style="width:${size}px;height:${size}px;font-size:${size}px">${panda(size,m)}${w.hat?`<span class="acc a-hat">${it(w.hat)}</span>`:''}${w.ear?`<span class="acc a-ear">${it(w.ear)}</span>`:''}${w.face?`<span class="acc a-face">${it(w.face)}</span>`:''}${w.hand?`<span class="acc a-hand">${it(w.hand)}</span>`:''}</span>`}
function vPet(){const p=pet(),h=happyNow(),bg=BGS[p.bg]||BGS.sky;
  const mood=h>=70?['Momo 好开心！谢谢你～','I’m so happy!']:h>=35?['Momo 有点饿了，喂我吃竹子好吗？','A little hungry…']:['Momo 肚子好饿……快去学习赚竹子吧 😢','So hungry…'];
  const slots=[['hat','🎩 帽子'],['ear','🎀 耳朵'],['face','👓 眼镜'],['hand','🎈 手上'],['bg','🏠 房间']];
  return bar('pet')+`<div class="panel room" style="background:${bg.g}">
    <div class="deco">${bg.d.map((d,i)=>`<span style="left:${8+i*38}%;top:${6+(i%2)*16}%">${d}</span>`).join('')}</div>
    <button class="momobtn" data-act="pat" aria-label="摸摸 Momo">${pandaDressed(190,null,'bob')}</button>
    <div class="bubble petsay" id="petsay">${mood[0]}<small>${mood[1]}　（点一下 Momo 跟它玩）</small></div>
  </div>
  <div class="panel row">
    <div style="flex:1;min-width:200px"><b>💖 开心度</b><div class="meter" style="height:18px;background:var(--soft)"><i style="width:${h}%;background:${h>=70?'var(--mint)':h>=35?'var(--sun)':'var(--bad)'}"></i></div><div class="zh" style="font-size:14px">每天喂 Momo，它就会很开心</div></div>
    <div style="text-align:center"><div style="font-size:30px;font-weight:800">🎋 ${S.bamboo||0}</div><div class="zh" style="font-size:14px">竹子（每拿 1 颗星就有 1 根）</div></div>
    <button class="btn mint big" data-act="feed" ${(S.bamboo||0)<3?'disabled':''}>🎋 喂竹子 <span style="font-size:15px">−3</span></button></div>
  <div class="panel"><h2>Momo 的商店 🛍️</h2><div class="zh" style="font-size:14px;margin:-6px 0 4px">用竹子买东西，买了以后点一下就能穿上或拿下来</div>
   ${slots.map(([sl,name])=>`<div style="font-weight:700;margin:12px 0 6px">${name}</div><div class="shop">${sl==='bg'?`<button class="item ${p.bg==='sky'?'on':''}" data-act="wear" data-v="sky"><span>☁️</span><small>${p.bg==='sky'?'用着 ✓':'天空'}</small></button>`:''}${SHOP.filter(x=>x.slot===sl).map(x=>{const own=p.owned.includes(x.id);const on=sl==='bg'?p.bg===x.id:(p.wear||{})[sl]===x.id;
     return `<button class="item ${on?'on':''} ${own?'':'lock'}" data-act="${own?'wear':'buy'}" data-v="${x.id}"><span>${x.e}</span><small>${own?(on?'用着 ✓':x.zh):'🎋 '+x.p}</small></button>`}).join('')}</div>`).join('')}
  </div>`}

/* ---------------- 翻牌配对 & 泡泡 ---------------- */
function vMatch(){const done=G.cards.filter(c=>c.done).length/2;
  return `<div class="gbar"><button class="btn round" data-act="quit" aria-label="离开">✕</button><div style="flex:1;font-weight:800">🃏 找到 ${done} / ${G.qs.length} 对　<span class="zh">翻了 ${G.moves} 次</span></div>${G.combo>=2?`<span class="pill" style="background:var(--pink)">🔥 ${G.combo}</span>`:''}</div>
  <p class="zh" style="text-align:center;margin:0 0 12px">翻开两张牌，把图片和${LANGS[G.lang].zh}单词配成一对</p>
  <div class="cards">${G.cards.map(c=>`<button class="mcard ${c.up||c.done?'up':''} ${c.done?'done':''}" data-act="card" data-v="${c.i}" ${c.done?'disabled':''} aria-label="第${c.i+1}张牌">${c.up||c.done?(c.k==='e'?`<span class="ce">${pic(c.w)}</span>`:`<span class="ct">${esc(c.w[G.lang])}</span>`):'<span class="cb">🐼</span>'}</button>`).join('')}</div>`}
function comboBadge(){return G&&G.combo>=2?`<span class="combo">🔥 连对 ${G.combo} 题！</span>`:''}

/* ---------------- 冒险地图 ---------------- */
const REGIONS=[{zh:'竹林村',e:'🎋',bg:'#D8F5D2'},{zh:'阳光海边',e:'🏖️',bg:'#FFF1C9'},{zh:'动物园',e:'🦁',bg:'#FFE0D0'},{zh:'太空站',e:'🚀',bg:'#DDD8FF'}];
const STATIONS=[
 {r:0,k:'word',topic:'school',mode:'read',lang:'en'},{r:0,k:'math',game:'count',level:1},{r:0,k:'math',game:'living',level:1},{r:0,k:'word',topic:'toys',mode:'listen',lang:'en'},
 {r:0,k:'boss',words:['school','toys'],lang:'en',games:['count','living']},
 {r:1,k:'word',topic:'pets',mode:'bubble',lang:'ms'},{r:1,k:'math',game:'add',level:1},{r:1,k:'math',game:'senses',level:1},{r:1,k:'word',topic:'lunch',mode:'match',lang:'ms'},
 {r:1,k:'boss',words:['pets','lunch'],lang:'ms',games:['add','senses']},
 {r:2,k:'word',topic:'zoo',mode:'listen',lang:'en'},{r:2,k:'math',game:'sub',level:1},{r:2,k:'math',game:'animal',level:1},{r:2,k:'word',topic:'family',mode:'read',lang:'ms'},
 {r:2,k:'boss',words:['zoo','family'],lang:'en',games:['sub','animal']},
 {r:3,k:'word',topic:'vehicles',mode:'read',lang:'en'},{r:3,k:'math',game:'make10',level:1},{r:3,k:'math',game:'magnet',level:1},{r:3,k:'word',topic:'colours',mode:'spell',lang:'en'},
 {r:3,k:'boss',words:['vehicles','colours'],lang:'ms',games:['make10','magnet']}];
function adv(){return S.adv||(S.adv={done:{}})}
function advNext(){let i=0;while(i<STATIONS.length&&adv().done[i])i++;return i}
function stLabel(st){if(st.k==='word'){const t=T(st.topic);return{e:t.icon,t:t.zh+' · '+MODES[st.mode].zh,s:LANGS[st.lang].flag+' '+LANGS[st.lang].zh}}
  if(st.k==='math'){const g=MG[st.game]||SG[st.game];return{e:g.e,t:g.zh,s:MG[st.game]?'🔢 数学':'🔬 科学'}}return{e:'👹',t:'大魔王',s:'综合挑战 · 答对 6 题过关'}}
function startStation(idx){if(overLimit()){showRest();return}const st=STATIONS[idx];
  if(st.k==='word'){view.topic=st.topic;startGame(st.mode,st.topic,st.lang)}else if(st.k==='math')startMath(st.game,st.level);else startBoss(idx);
  if(G)G.station=idx}
function startBoss(idx){newLook();const st=STATIONS[idx];const qs=[];
  st.words.forEach(tid=>{const pool=T(tid).words;shuffle(pool).slice(0,2).forEach(w=>qs.push({w,m:pick(['read','listen']),opts:shuffle([w,...shuffle(pool.filter(x=>x!==w)).slice(0,3)]),missed:false,hinted:false,done:false,wrongIdx:[]}))});
  st.games.forEach(g=>{const gm=MG[g]||SG[g];genSet(gm,1,2,g+':1').forEach(q0=>qs.push(Object.assign(q0,{m:'math',g,lvl:1,missed:false,hinted:false,done:false,hint:false,wrongIdx:[]})))});
  resetRec();G={topic:'boss:'+idx,mode:'boss',lang:st.lang,i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),qs:shuffle(qs),station:idx};
  go({name:'game'});setTimeout(()=>{if(!G||!G.qs[G.i])return;const m=cur().m;if(m==='listen'||m==='math')speakCur()},350)}
function vMap(){const nx=advNext();let html='',lastR=-1;
  STATIONS.forEach((st,i)=>{if(st.r!==lastR){lastR=st.r;const R=REGIONS[st.r];html+=`<div class="region" style="background:${R.bg}">${R.e} 第 ${st.r+1} 区：${R.zh}</div>`}
    const L=stLabel(st),state=adv().done[i]?'done':i===nx?'now':'lock';
    html+=`<div class="stn ${state} ${st.k==='boss'?'boss':''}" style="margin-left:${[0,56,96,56][i%4]}px"><button class="node" data-act="${state==='lock'?'locked':'station'}" data-v="${i}" aria-label="第 ${i+1} 站 ${L.t}">${state==='lock'?'🔒':L.e}</button><div class="sl"><b>${L.t}</b><span>${state==='done'?'⭐ 已过关（可以再玩）':state==='now'?'👉 '+L.s:L.s}</span></div></div>`});
  if(nx>=STATIONS.length)html+=`<div class="region" style="background:#FFE07A">🏆 全部通关！你是冒险大王！</div>`;
  return bar('home')+`<div class="panel row"><span style="font-size:44px">🗺️</span><div style="flex:1"><h1 style="font-size:30px">冒险地图</h1><div class="zh">一站一站往前走，答对 6 题就过关，解锁下一站。每一区最后有大魔王！</div></div><button class="btn" data-act="home">⬅ 返回</button></div><div class="panel map">${html}</div>`}

/* ---------------- 卡片册 ---------------- */
function cardOn(w){return ['en','ms'].some(l=>wstat(l,w).c>=2)}
function cardCount(){let n=0;BASE.forEach(t=>t.words.forEach(w=>{if(cardOn(w))n++}));return n}
function vAlbum(){const total=BASE.reduce((a,t)=>a+t.words.length,0),n=cardCount();const bosses=STATIONS.map((s,i)=>s.k==='boss'?i:-1).filter(i=>i>=0);
  return bar('home')+`<div class="panel row"><span style="font-size:44px">📚</span><div style="flex:1"><h1 style="font-size:30px">我的卡片册</h1><div class="zh">一个词答对 2 次就能得到它的卡片。点卡片听英文、国文和华文！</div></div><span class="pill">${n} / ${total}</span><button class="btn" data-act="home">⬅ 返回</button></div>
  <div class="panel"><h2>🏆 奖杯卡片</h2><div class="album">${bosses.map((bi,k)=>{const on=adv().done[bi],R=REGIONS[STATIONS[bi].r];return `<div class="pcard trophy ${on?'':'off'}"><span class="pe">${on?R.e:'🏆'}</span><b>${on?R.zh+'勇士':'？'}</b><span>${on?'打败第 '+(k+1)+' 区大魔王':'打败第 '+(k+1)+' 区大魔王就能得到'}</span></div>`}).join('')}</div></div>
  ${BASE.map(t=>{const got=t.words.filter(cardOn).length;return `<div class="panel"><h2>${t.icon} ${t.zh} <span class="zh" style="font-size:16px">${got}/${t.words.length}${got===t.words.length?' 🏅 全套收集！':''}</span></h2><div class="album">${t.words.map(w=>cardOn(w)?`<button class="pcard" data-act="cardsay" data-t="${t.id}" data-v="${esc(w.en)}"><span class="pe">${ico(w)}</span><b>${esc(w.en)}</b><span>${esc(w.ms)}</span><span class="zh">${w.zh}</span></button>`:`<div class="pcard off"><span class="pe">${ico(w)}</span><b>？</b></div>`).join('')}</div></div>`}).join('')}`}

/* ---------------- 生活任务 ---------------- */
const MISSIONS=[['🔴','在家里找 3 样红色的东西，用英文说 red'],['🪑','数一数家里有几张椅子'],['🍎','吃水果时，用国文说出水果的名字'],['👃','闭上眼睛闻一闻，猜猜是什么食物'],['🧲','用冰箱贴的磁铁试一试，哪些东西会被吸住'],['💧','试一试纸巾和塑料袋，哪一个会吸水'],['🌱','找一棵植物，指出根、茎、叶、花'],['👨‍👩‍👧','用英文介绍家人：This is my father.'],['🔺','在家里找一样圆形、一样正方形、一样三角形的东西'],['💰','跟爸爸妈妈买东西时，帮忙数一数要付多少钱'],['🐱','学一种动物的叫声，再说出它的英文和国文名字'],['🌙','晚上看看天空，用国文说 bulan 和 bintang'],['🦷','刷牙时，慢慢从 1 数到 20'],['👟','把家里的鞋子排好，数一数有几双'],['🧸','收拾玩具，一边收一边用英文说出玩具的名字'],['🚗','坐车时，找一找路上的 bas、teksi、motosikal'],['🖐️','用英文说出 5 个身体部位，再用手指一指'],['🍚','吃饭时，用国文说 nasi、telur、air']];
function todayMissions(){let x=0;for(const c of dk())x=(x*31+c.charCodeAt(0))%233280;const ids=[];let n=0;while(ids.length<3&&n<200){n++;x=(x*9301+49297)%233280;const i=x%MISSIONS.length;if(!ids.includes(i))ids.push(i)}return ids}
function missionState(){const m=S.missions||(S.missions={date:'',done:[]});if(m.date!==dk()){m.date=dk();m.done=[]}return m}
function vMissions(){const ids=todayMissions(),m=missionState();
  return bar('home')+`<div class="panel row"><span style="font-size:44px">🏠</span><div style="flex:1"><h1 style="font-size:30px">今日生活任务</h1><div class="zh">离开屏幕，在家里动手做！完成一个有 2 颗星，明天会有新任务。</div></div><button class="btn" data-act="home">⬅ 返回</button></div>
  ${ids.map(i=>{const t=MISSIONS[i],ok=m.done.includes(i);return `<div class="panel row mission ${ok?'ok':''}"><span style="font-size:52px">${t[0]}</span><div style="flex:1;min-width:180px;font-size:21px;font-weight:700">${t[1]}</div><button class="btn round" data-act="sayL" data-l="zh" data-v="${esc(t[1])}" aria-label="读出来">🔊</button>${ok?'<span class="pill" style="background:var(--mint)">✅ 完成了</span>':`<button class="btn sun big" data-act="mdone" data-v="${i}">我做到了！</button>`}</div>`}).join('')}
  <p class="zh" style="text-align:center">💡 家长可以陪孩子一起做，做完再按「我做到了」。</p>`}

/* ---------------- 亲子对战 ---------------- */
let D=null;
function duelOpps(){return [['👨','爸爸'],['👩','妈妈'],...Object.entries(ALL.kids).filter(([id])=>id!==ALL.cur).map(([,k])=>[k.avatar,k.name]),['🧒','朋友']]}
function vDuelSetup(){const opps=duelOpps(),sel=Math.min(view.opp||0,opps.length-1),sub=view.sub||'en';
  return bar('home')+`<div class="panel row"><span style="font-size:44px">⚔️</span><div style="flex:1"><h1 style="font-size:30px">亲子对战</h1><div class="zh">两个人用同一台平板，看谁先按对答案！</div></div><button class="btn" data-act="home">⬅ 返回</button></div>
  <div class="panel"><h2>谁来挑战 ${esc(S.name)}？</h2><div class="chips" style="margin-bottom:16px">${opps.map((o,i)=>`<button class="chip ${i===sel?'onc':''}" data-act="dopp" data-v="${i}"><span style="font-size:26px">${o[0]}</span> ${esc(o[1])}</button>`).join('')}</div>
  <h2>比什么？</h2><div class="seg">${[['en','🇬🇧 英文'],['ms','🇲🇾 国文'],['math','🔢 数学']].map(([k,l])=>`<button class="${sub===k?'on':''}" data-act="dsub" data-v="${k}">${l}</button>`).join('')}</div>
  <div style="margin-top:18px"><button class="btn sun big" data-act="dstart">开始对战 ⚔️</button></div></div>`}
function makeDuelQs(sub){const qs=[],used=new Set();for(let n=0,tries=0;n<10&&tries<200;tries++){
  if(sub==='math'){const q0=MG[pick(['count','add','sub'])].gen(1);const dk2=sigTxt(q0.title+q0.html(false))+'|'+q0.ans;if(used.has(dk2))continue;used.add(dk2);n++;qs.push({top:`<div class="mq">${q0.title}</div><div class="mview">${q0.html(false)}</div>`,opts:q0.opts,ans:q0.ans,say:q0.say,ansText:q0.sayAns,ansLang:'zh'})}
  else{const t=pick(BASE),w=pick(t.words);if(used.has(w.en))continue;used.add(w.en);n++;qs.push({top:`<div class="prompt" style="font-size:84px;margin:0">${pic(w)}</div>${w.e?zh(w.zh):''}`,opts:shuffle([w,...shuffle(t.words.filter(x=>x!==w)).slice(0,3)]).map(x=>({v:x.en,l:esc(x[sub])})),ans:w.en,say:null,ansText:w[sub],ansLang:sub})}}
  return qs}
function startDuel(){newLook();if(overLimit()){showRest();return}const opps=duelOpps(),sel=Math.min(view.opp||0,opps.length-1),sub=view.sub||'en';
  D={p:[[S.avatar,S.name],opps[sel]],sub,opp:sel,i:0,sc:[0,0],qs:makeDuelQs(sub),lock:[false,false],done:false,winner:null,over:false};go({name:'duelplay'});setTimeout(duelSay,300)}
function duelSay(){const q=D&&D.qs[D.i];if(q&&q.say)speak(q.say,'zh')}
function duelNext(){if(!D||view.name!=='duelplay')return;D.i++;
  if(D.i>=D.qs.length){D.over=true;const won=D.sc[0]>D.sc[1];D.earned=3+(won?2:0);addStars(D.earned);dayRec().mins+=2;S.sessions.push({t:Date.now(),topic:'duel',mode:'duel',lang:D.sub||'',score:D.sc[0],total:D.qs.length});S.sessions=S.sessions.slice(-300);touch();render();sGood();setTimeout(()=>burst(document.querySelector('.endstar'),'🎉'),200);return}
  D.done=false;D.lock=[false,false];D.winner=null;render();duelSay()}
function vDuel(){if(D.over){const a=D.sc[0],b=D.sc[1];const title=a===b?'平手！两个都很棒 🤝':(a>b?esc(D.p[0][1]):esc(D.p[1][1]))+' 赢了！🏆';
    return `<div class="panel setup">${pandaDressed(120,'happy','dance')}<h1 style="font-size:34px">${title}</h1><p style="font-size:30px;font-weight:800;margin:6px 0">${D.p[0][0]} ${a} : ${b} ${D.p[1][0]}</p><div class="endstar" style="font-size:30px;font-weight:800">⭐ ${esc(S.name)} +${D.earned}</div>
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn sun big" data-act="dstart">🔁 再来一局</button><button class="btn big" data-act="duel">⚙️ 换对手</button><button class="btn big" data-act="home">🏠 回首页</button></div></div>`}
  const q=D.qs[D.i];
  const side=p=>`<div class="dside p${p}"><div class="dhead">${D.p[p][0]} ${esc(D.p[p][1])}<span class="dsc">${D.sc[p]}</span></div><div class="dopts">${q.opts.map((o,i)=>`<button class="opt ${D.done&&o.v===q.ans?'right':''} ${D.lock[p]?'locked':''}" data-act="dans" data-p="${p}" data-v="${i}" ${D.done||D.lock[p]?'disabled':''}>${o.l}</button>`).join('')}</div>${D.done&&D.winner===p?'<div class="dwin">⚡ 抢到了！+1</div>':''}${D.lock[p]&&!D.done?'<div class="dno">❌ 答错了，等下一题</div>':''}</div>`;
  return `<div class="gbar"><button class="btn round" data-act="dquit" aria-label="离开">✕</button><div style="flex:1;font-weight:800;text-align:center">⚔️ 第 ${D.i+1} / ${D.qs.length} 题</div>${q.say?'<button class="btn sky round" data-act="dsay" aria-label="听题目">🔊</button>':''}</div>
  <div class="stage">${q.top}</div><div class="duel">${side(0)}${side(1)}</div>`}

/* ---------------- 时间提醒 ---------------- */
function todaySecs(){return (S.days[dk()]||{}).secs||0}
function overLimit(){return S.limit>0&&todaySecs()>=(S.limit+((S.days[dk()]||{}).extra||0))*60}
function showRest(){if(document.querySelector('.rest'))return;const o=document.createElement('div');o.className='rest';
  o.innerHTML=`<div class="panel setup" style="max-width:520px">${pandaDressed(130,'happy')}<h1 style="font-size:32px">眼睛要休息啦 😴</h1><p style="font-size:20px">今天已经学习了 ${Math.round(todaySecs()/60)} 分钟，真棒！<br>去喝杯水、看看远方、动一动身体吧。</p><div class="row" style="justify-content:center"><button class="btn sun big" data-rest="ok">好的，休息一下</button><button class="btn" data-rest="parent">家长：再玩 10 分钟</button></div></div>`;
  o.addEventListener('click',e=>{const t=e.target.closest('[data-rest]');if(!t)return;
    if(t.dataset.rest==='ok'){o.remove();if(view.name!=='home')go({name:'home'})}
    else{const more=()=>{const d=dayRec();d.extra=(d.extra||0)+10;touch();o.remove();toast('已经多加 10 分钟 ⏱️')};if(ALL.pin){pinUntil=0;needPin(more);return}const a=rnd(6,9),c=rnd(6,9);const ans=prompt('家长确认：'+a+' × '+c+' = ?');if(ans!==null&&+ans===a*c)more();else if(ans!==null)toast('答案不对哦')}});
  document.body.appendChild(o);speak('眼睛要休息啦，去喝杯水吧！','zh')}
setInterval(()=>{if(document.hidden||!S.name)return;const d=dayRec();d.secs=(d.secs||0)+30;saveLocal();if(overLimit()&&!['game','duelplay','setup'].includes(view.name))showRest()},30000);
