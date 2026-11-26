/* ---------- 🗺️ 学习世界: an educational RPG layer over the existing lessons ----------
   Five worlds (one per subject). Each world is split into chapters; a chapter is an island map whose stops are the
   real topics/games, coloured by the four mastery states from knowledge(). A chapter's Knowledge Boss (综合挑战) opens
   when every stop has been started and mixes questions from all of them; beating it (75% first try) gives a crown and
   opens the next chapter (a chapter also opens if every stop of the one before is practised or mastered).
   Rewards go to mastering and finishing — there are no daily-login rewards. 🎨 创作工坊 has one creative challenge per
   world; the child's works are kept in S.rpg.made. */
const WORLDS=[
  {id:'en',zh:'英语王国',sub:'English Kingdom',e:'🏰',boss:'🐉',bossZh:'单词恶龙',decor:['🏰','👑','🌲','🛡️','🌻'],sea:['⛵','🐳','🦢']},
  {id:'ms',zh:'国文甘榜',sub:'Kampung Bahasa',e:'🏡',boss:'🐊',bossZh:'河里的大鳄鱼',decor:['🏡','🌴','🐓','🌾','🛖'],sea:['🛶','🐟','🦆']},
  {id:'math',zh:'数学岛',sub:'Mathematics Island',e:'🏝️',boss:'🌋',bossZh:'算术火山',decor:['🔢','🧮','📐','🌴','🗿'],sea:['🐬','⛵','🐋']},
  {id:'sci',zh:'科学森林',sub:'Science Forest',e:'🌳',boss:'🦖',bossZh:'森林恐龙',decor:['🌳','🍄','🔬','🦋','🌲'],sea:['🐸','🦆','🛶']},
  {id:'cn',zh:'华文古镇',sub:'Chinese Culture Town',e:'🏮',boss:'🐲',bossZh:'汉字神龙',decor:['🏯','🏮','🎋','🧧','🐼'],sea:['🛶','🐟','🪷']}];
const chunk=(xs,max)=>{const n=Math.ceil(xs.length/max)||1,size=Math.ceil(xs.length/n),out=[];for(let i=0;i<xs.length;i+=size)out.push(xs.slice(i,i+size));return out};
function worldChapters(w){
  if(w==='en'||w==='ms'){const ts=BASE.filter(t=>!t.only||t.only===w);
    return [...chunk(ts.filter(t=>!t.yr&&!t.book&&!t.bm),6).map(x=>['一年级',x]),...chunk(ts.filter(t=>t.yr===2),8).map(x=>['二年级',x]),...chunk(ts.filter(t=>t.bm),7).map(x=>['课本',x])]
      .map(([lbl,ts2])=>({lbl,nodes:ts2.map(t=>({type:'w',id:t.id,lang:w,name:t.zh,e:t.icon}))}))}
  const bank={math:MG,sci:SG,cn:CG}[w],ids=Object.keys(bank);
  return [...chunk(ids.filter(g=>!bank[g].yr),7).map(x=>['一年级',x]),...chunk(ids.filter(g=>bank[g].yr),7).map(x=>['二年级',x])]
    .map(([lbl,gs])=>({lbl,nodes:gs.map(g=>({type:'g',id:g,name:bank[g].zh,e:bank[g].e}))}))}
function rpg(){return S.rpg||(S.rpg={boss:{},made:[],cdone:{}})}
function worldState(w){const K=knowledge(S),kp=n=>(K[n.type==='w'?n.lang:w].kps.find(p=>p.id===n.id)||{st:'ns'});
  const chs=worldChapters(w).map((c,i)=>{c.nodes.forEach(n=>{const p=kp(n);n.st=p.st;n.acc=p.acc});c.i=i;c.beaten=(rpg().boss[w+':'+i]||0)>0;
    c.allStarted=c.nodes.every(n=>n.st!=='ns');c.allPrac=c.nodes.every(n=>n.st==='prac'||n.st==='mast');return c});
  chs.forEach((c,i)=>{c.open=i===0||chs[i-1].beaten||chs[i-1].allPrac});
  const total=chs.reduce((a,c)=>a+c.nodes.length,0),mast=chs.reduce((a,c)=>a+c.nodes.filter(n=>n.st==='mast').length,0),crowns=chs.filter(c=>c.beaten).length;
  return {chs,total,mast,crowns}}
const ROUTE=[[105,285],[172,306],[242,290],[292,245],[236,205],[160,200],[108,152],[164,108],[244,104]],BOSSAT=[330,58];
function islandPath(seed){const pts=[];for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=1+0.09*Math.sin(3*a+seed)+0.06*Math.sin(5*a+seed*2.3)+0.04*Math.sin(7*a+seed*0.7);pts.push([200+168*r*Math.cos(a),205+150*r*Math.sin(a)])}
  let d='';pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length],m=[(p[0]+q[0])/2,(p[1]+q[1])/2];d+=(i?'':'M'+((pts[27][0]+p[0])/2).toFixed(1)+' '+((pts[27][1]+p[1])/2).toFixed(1))+'Q'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' '+m[0].toFixed(1)+' '+m[1].toFixed(1)});return d+'Z'}
const NSTATE={ns:['○','未开始'],learn:['●','学习中'],prac:['★','练习中'],mast:['✓','已掌握']};
function vWorlds(){
  return bar('home')+`<div class="panel row" style="background:var(--w-sea);color:#2A2F6B"><span style="font-size:60px">🗺️</span><div style="flex:1;min-width:200px"><h1 style="font-size:32px">学习世界</h1><div style="font-weight:700">每个科目是一个世界。走完一个章节的每一站，就可以挑战知识魔王！</div></div><button class="btn" data-act="home">⬅ 回家</button></div>
  <div class="worlds">${WORLDS.map(W=>{const s=worldState(W.id);return `<button class="topic world" data-act="world" data-v="${W.id}" style="background:var(--w-land)"><div class="ic">${W.e}</div><h3>${W.zh}</h3><div class="t2">${W.sub}</div>
    <div class="foot"><div class="meter"><i style="width:${s.mast*100/(s.total||1)}%"></i></div><div class="cnt">已掌握 ${s.mast} / ${s.total} 站 · 👑 ${s.crowns} / ${s.chs.length}</div></div></button>`}).join('')}
    <button class="topic world" data-act="create" style="background:var(--s-cn)"><div class="ic">🎨</div><h3>创作工坊</h3><div class="t2">用学过的知识创造东西</div><div class="foot"><div class="cnt">${rpg().made.length} 件作品</div></div></button></div>
  <div class="panel"><p style="margin:0">🌙 学了一阵子就休息一下吧，地图不会跑掉。这里不会因为每天登录送奖励，只奖励真的学会和完成挑战。</p></div>`}
function vWorld(){const W=WORLDS.find(x=>x.id===view.w)||WORLDS[0],st=worldState(W.id),chs=st.chs;
  let ci=view.ch!=null&&chs[view.ch]?view.ch:Math.max(0,chs.findIndex(c=>c.open&&!c.beaten));if(!chs[ci].open)ci=0;const c=chs[ci];
  const pts=ROUTE.slice(0,c.nodes.length),next=c.nodes.findIndex(n=>n.st!=='mast'&&n.st!=='prac'),seed=W.id.length*1.7+ci*2.1;
  const path='M'+[...pts,BOSSAT].map(p=>p.join(' ')).join('L');
  const D=[[58,214],[338,168],[196,252],[286,330],[118,345],[330,300]],SEA=[[34,48],[372,372],[30,372]];
  const node=(n,i)=>{const [x,y]=pts[i],s=NSTATE[n.st];return `<g class="mnode st-${n.st}" role="button" tabindex="0" data-act="wnode" data-v="${i}" aria-label="第 ${i+1} 站：${esc(n.name)}，${s[1]}">
      <circle cx="${x}" cy="${y}" r="19" class="nb"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="18">${esc(n.e)}</text>
      ${n.st!=='ns'?`<circle cx="${x+14}" cy="${y-14}" r="8" class="nk"/><text x="${x+14}" y="${y-10}" text-anchor="middle" font-size="10" class="nkt">${s[0]}</text>`:''}
      <text x="${x}" y="${y+33}" text-anchor="middle" font-size="11" class="nl">${esc(n.name)}</text></g>`};
  const bossOpen=c.allStarted,bx=BOSSAT[0],by=BOSSAT[1];
  const map=`<svg class="wmap" viewBox="0 0 400 400" role="group" aria-label="${esc(W.zh)} 第 ${ci+1} 章地图">
    <rect width="400" height="400" class="sea"/>${[[60,120],[300,20],[330,390],[20,260],[380,240]].map(([x,y])=>`<path d="M${x} ${y} q6 -5 12 0 t12 0" class="wave"/>`).join('')}
    <ellipse cx="${bx}" cy="${by+10}" rx="44" ry="34" class="sand"/><ellipse cx="${bx}" cy="${by+8}" rx="38" ry="28" class="land"/>
    <path d="${islandPath(seed)}" class="sand" transform="translate(200 205) scale(1.05) translate(-200 -205)"/><path d="${islandPath(seed)}" class="land"/>
    ${D.map(([x,y],k)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="26" aria-hidden="true">${W.decor[k%W.decor.length]}</text>`).join('')}
    ${SEA.map(([x,y],k)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="24" aria-hidden="true">${W.sea[k%W.sea.length]}</text>`).join('')}
    <text x="368" y="36" font-size="20" aria-hidden="true">🧭</text>
    <path d="${path}" class="route"/>
    ${c.nodes.map(node).join('')}
    <g class="mnode boss ${c.beaten?'beaten':bossOpen?'open':'locked'}" role="button" tabindex="0" data-act="wboss" aria-label="知识魔王：${esc(W.bossZh)}，${c.beaten?'已经打败':bossOpen?'可以挑战':'每一站都开始以后才能挑战'}">
      <circle cx="${bx}" cy="${by}" r="25" class="nb"/><text x="${bx}" y="${by+9}" text-anchor="middle" font-size="26">${c.beaten?'👑':bossOpen?W.boss:'🔒'}</text>
      <text x="${bx}" y="${by+42}" text-anchor="middle" font-size="11" class="nl">${c.beaten?'已打败！':'知识魔王'}</text></g>
    ${next>=0?`<g class="pin" aria-hidden="true"><rect x="${pts[next][0]-24}" y="${pts[next][1]-52}" width="48" height="20" rx="10"/><text x="${pts[next][0]}" y="${pts[next][1]-38}" text-anchor="middle" font-size="12">▶ 去这里</text></g>`:''}</svg>`;
  return bar('home')+`<div class="panel row" style="background:var(--w-land);color:#2A2F6B"><span style="font-size:52px">${W.e}</span><div style="flex:1;min-width:180px"><h1 style="font-size:28px">${W.zh}</h1><div style="font-weight:700">${W.sub} · 已掌握 ${st.mast} / ${st.total} 站 · 👑 ${st.crowns}</div></div><button class="btn" data-act="worlds">⬅ 学习世界</button></div>
  <div class="ltabs">${chs.map((x,i)=>`<button class="btn ${i===ci?'sun':''}" data-act="wch" data-v="${i}" ${x.open?'':'disabled'}>${x.open?'':'🔒 '}第 ${i+1} 章 <small>${x.lbl}${x.beaten?' 👑':''}</small></button>`).join('')}</div>
  <div class="panel" style="padding:10px">${map}
   <div class="mlegend">${Object.entries(NSTATE).map(([k,v])=>`<span><i class="lg st-${k}"></i>${v[1]}</span>`).join('')}</div>
   <p class="zh" style="margin:8px 0 0;text-align:center">${c.beaten?'这一章完成了！可以再挑战魔王，或者去下一章 🎉':bossOpen?'每一站都开始了，可以挑战「'+esc(W.bossZh)+'」！':'还有 '+c.nodes.filter(n=>n.st==='ns').length+' 站没开始，每一站都玩过就能挑战知识魔王。'}</p></div>`}
/* chapter boss: 8 questions taken in turn from every stop of the chapter */
function startKBoss(w,ci){const c=worldState(w).chs[ci];if(!c||!c.allStarted)return;newLook();if(overLimit()){showRest();return}
  const qs=[],base=q=>Object.assign(q,{missed:false,hinted:false,done:false,hint:false,wrongIdx:[]});
  for(let k=0;qs.length<8&&k<24;k++){const n=c.nodes[k%c.nodes.length];
    if(n.type==='w'){const t=T(n.id),ws=t.words.filter(x=>x[n.lang]);if(ws.length>=2)qs.push(Object.assign(wordQ(pick(ws),n.lang),{node:n.name}))}
    else{const l=Math.min(2,recLevel(n.id));qs.push(base(Object.assign(genL(GAME(n.id),l),{m:'math',g:n.id,lvl:l,node:n.name})))}}
  resetRec();G={topic:'kboss:'+w+':'+ci,mode:'kboss',world:w,ch:ci,lang:w==='ms'?'ms':'en',i:0,score:0,combo:0,best:0,start:Date.now(),starsBefore:S.stars,cardsBefore:cardCount(),qs:shuffle(qs)};
  go({name:'game'});setTimeout(()=>{if(G&&G.qs[G.i]){const m=cur().m;if(m==='listen'||m==='math')speakCur()}},350)}
function bossBar(){if(!G||G.mode!=='kboss')return '';const W=WORLDS.find(x=>x.id===G.world),hit=G.qs.filter(q=>q.done&&!q.missed&&!q.hinted).length,hp=G.qs.length-hit;
  return `<div class="bossbar"><span style="font-size:34px">${W.boss}</span><b>${esc(W.bossZh)}</b><div class="hp" aria-label="魔王还有 ${hp} 点血">${G.qs.map((q,i)=>`<i class="${i<hp?'on':''}"></i>`).join('')}</div></div>`}
/* ---------- 🎨 创作工坊: creative challenges ---------- */
const MAKES=[
  {k:'house',w:'math',e:'🏠',zh:'积木小屋',d:'用乘法算一算，砌一面墙，再把房子装饰得漂漂亮亮'},
  {k:'zoo',w:'en',e:'🦁',zh:'My Zoo 我的动物园',d:'选动物、选数量，用英文介绍你的动物园'},
  {k:'plant',w:'sci',e:'🌻',zh:'植物实验室',d:'先猜一猜，再做实验：植物需要什么才会长大？'},
  {k:'kampung',w:'ms',e:'🏡',zh:'Kampung Saya 我的甘榜',d:'布置甘榜，用国文和正确的量词介绍它'},
  {k:'card',w:'cn',e:'💌',zh:'写一张贺卡',d:'选节日、选祝福语，写一张华文贺卡'}];
function saveMade(k,txt,art){const R=rpg();R.made.unshift({k,t:Date.now(),txt:String(txt).slice(0,400),art:String(art).slice(0,200)});R.made=R.made.slice(0,20);
  if(!R.cdone[k]){R.cdone[k]=1;addStars(3);toast('第一次完成这个创作！⭐ +3')}else toast('作品已经放进作品集 🖼️');touch()}
function vCreate(){const R=rpg();
  return bar('home')+`<div class="panel row" style="background:var(--s-cn);color:#2A2F6B"><span style="font-size:56px">🎨</span><div style="flex:1;min-width:200px"><h1 style="font-size:30px">创作工坊</h1><div style="font-weight:700">用学过的知识创造属于你的东西</div></div><button class="btn" data-act="worlds">⬅ 学习世界</button></div>
  <div class="worlds">${MAKES.map(m=>`<button class="topic world" data-act="make" data-v="${m.k}" style="background:var(--w-land)"><div class="ic">${m.e}</div><h3>${m.zh}</h3><div class="t2" style="white-space:normal">${m.d}</div><div class="foot"><div class="cnt">${WORLDS.find(x=>x.id===m.w).e} ${WORLDS.find(x=>x.id===m.w).zh}${R.cdone[m.k]?' · ✅ 做过了':''}</div></div></button>`).join('')}</div>
  <div class="panel"><h2>🖼️ 我的作品集</h2>${R.made.length?R.made.map(x=>{const m=MAKES.find(y=>y.k===x.k);return `<div class="tuline"><span style="font-size:30px">${m?m.e:'🎨'}</span><div class="tn"><b>${m?esc(m.zh):''}</b> <small class="zh">${fmtK(dk(new Date(x.t)))}</small><div style="font-size:20px">${esc(x.art)}</div><div class="zh" style="font-size:15px;white-space:pre-line">${esc(x.txt)}</div></div><button class="btn round" data-act="madesay" data-v="${x.t}" aria-label="读出来">🔊</button></div>`}).join(''):'<p class="zh" style="margin:0">还没有作品，选一个挑战开始创作吧！</p>'}</div>`}
const NUMEN=['zero','one','two','three','four','five'],NUMMS=['','satu','dua','tiga','empat','lima'];
const PLUR={mouse:'mice',fish:'fish',sheep:'sheep',goose:'geese'};
const plural=(w,n)=>n===1?w:PLUR[w]||(/(s|sh|ch|x)$/.test(w)?w+'es':/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':w+'s');
const ADJ=[['big','大'],['small','小'],['happy','快乐的'],['funny','好笑的']];
const KAMP=[['🏠','rumah','房子','buah'],['🌴','pokok kelapa','椰树','batang'],['🐓','ayam','鸡','ekor'],['🐈','kucing','猫','ekor'],['🐄','lembu','牛','ekor'],['🦆','itik','鸭子','ekor'],['🌺','bunga raya','大红花','kuntum'],['🛶','sampan','小船','buah']];
const CARD={occ:[['新年','🧧',['新年快乐','恭喜发财','万事如意']],['生日','🎂',['生日快乐','天天开心','快高长大']],['教师节','🍎',['教师节快乐','老师辛苦了','谢谢老师的教导']],['母亲节','💐',['母亲节快乐','妈妈辛苦了','我爱您']]],to:['爸爸','妈妈','老师','爷爷','奶奶','好朋友'],more:['身体健康','学习进步','天天快乐','心想事成']};
function vMake(){const k=view.make,m=MAKES.find(x=>x.k===k);if(!m)return vCreate();const st=view.st||(view.st={});
  const head=`<div class="panel row" style="background:var(--w-land);color:#2A2F6B"><span style="font-size:52px">${m.e}</span><div style="flex:1;min-width:180px"><h1 style="font-size:28px">${m.zh}</h1><div style="font-weight:700">${m.d}</div></div><button class="btn" data-act="create">⬅ 创作工坊</button></div>`;
  if(k==='house'){if(!st.task){st.task=1;st.rows=rnd(2,4);st.cols=rnd(3,5);st.grid=Array.from({length:6},()=>Array(8).fill(''));st.tool='🧱'}
    const g=st.grid,tools=['🧱','🟨','🟦','🚪','🪟','🔺','🌸',''];
    return bar('home')+head+`<div class="panel"><p style="font-size:20px;margin:0 0 8px">任务：从最下面开始，砌 <b>${st.rows}</b> 排墙，每排 <b>${st.cols}</b> 块（门和窗也算一块）。上面可以放屋顶 🔺 和花 🌸。</p>
     <div class="row" style="gap:6px;margin-bottom:8px">${tools.map(t=>`<button class="btn ${st.tool===t?'sun':''}" data-act="mtool" data-v="${t||'x'}" aria-label="${t||'橡皮擦'}">${t||'🧽'}</button>`).join('')}</div>
     <div class="bgrid" role="grid" aria-label="积木格子：点一格放积木">${g.map((row,r)=>row.map((cel,c)=>`<button class="bcell" data-act="mcell" data-v="${r}-${c}" aria-label="第 ${6-r} 排第 ${c+1} 格">${cel}</button>`).join('')).join('')}</div>
     <div class="row" style="justify-content:center;margin-top:10px"><button class="btn sun big" data-act="mcheck">✅ 完成了，检查一下</button><button class="btn" data-act="mreset">🔄 重来</button></div>${st.msg?`<div class="tutor"><span style="font-size:36px">🐼</span><div class="tm">${st.msg}</div></div>`:''}</div>`}
  if(k==='zoo'||k==='kampung'){const list=k==='zoo'?[...T('zoo').words,...T('pets').words.filter(w=>!/fish|mouse|frog/.test(w.en))]:KAMP.map(a=>({e:a[0],ms:a[1],zh:a[2],cl:a[3]}));st.n=st.n||{};st.adj=st.adj||{};
    const chosen=list.filter(x=>st.n[x.ms]>0),txt=k==='zoo'?zooText(chosen,st):kampText(chosen,st);
    return bar('home')+head+`<div class="panel"><p class="zh" style="margin:0 0 8px">${k==='zoo'?'点 ➕ 放动物，再选一个形容词。至少选 3 种动物。':'点 ➕ 放东西。国文要用对量词：buah、batang、ekor、kuntum。至少选 3 样。'}</p>
     <div class="mkgrid">${list.map(x=>{const n=st.n[x.ms]||0;return `<div class="mk ${n?'on':''}"><div style="font-size:40px">${x.e}</div><b>${esc(k==='zoo'?x.en:x.ms)}</b><small class="zh">${esc(x.zh)}${k==='kampung'?' · '+x.cl:''}</small>
       <div class="row" style="gap:4px;justify-content:center"><button class="btn round" data-act="mminus" data-v="${esc(x.ms)}" aria-label="少一个">➖</button><b style="min-width:20px;text-align:center">${n}</b><button class="btn round" data-act="mplus" data-v="${esc(x.ms)}" aria-label="多一个">➕</button></div>
       ${k==='zoo'&&n?`<div class="row" style="gap:3px;justify-content:center;margin-top:4px">${ADJ.map(([a,z])=>`<button class="btn ${st.adj[x.ms]===a?'sky':''}" style="font-size:13px;padding:3px 7px;min-height:32px" data-act="madj" data-v="${esc(x.ms)}|${a}">${a}</button>`).join('')}</div>`:''}</div>`}).join('')}</div>
     <div class="panel" style="background:var(--soft);margin-top:12px"><div style="font-size:26px">${chosen.map(x=>x.e.repeat(st.n[x.ms])).join(' ')||'…'}</div><p style="font-size:20px;white-space:pre-line;margin:6px 0">${esc(txt[0])}</p><p class="zh" style="white-space:pre-line;margin:0">${esc(txt[1])}</p>
     <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sky" data-act="mread" data-l="${k==='zoo'?'en':'ms'}">🔊 读出来</button><button class="btn sun big" data-act="msave" ${chosen.length>=3?'':'disabled'}>💾 放进作品集</button></div></div></div>`}
  if(k==='plant'){const F=[['water','💧','水'],['sun','☀️','阳光'],['air','🌬️','空气'],['soil','🟫','泥土'],['candy','🍬','糖果'],['music','🎵','音乐']];st.f=st.f||{water:1,sun:1,air:1,soil:1};
    const need=['water','sun','air','soil'],miss=need.filter(x=>!st.f[x]),grow=!miss.length;
    const plant=st.run?(grow?'🌻':miss.includes('water')||miss.includes('air')?'🥀':'🌱'):'🌰';
    const why={water:'没有水，植物会枯萎。',sun:'没有阳光，植物长不好，叶子会变黄。',air:'没有空气，植物活不下去。',soil:'没有泥土，植物得不到养分，也站不稳。'};
    return bar('home')+head+`<div class="panel"><p style="font-size:20px;margin:0 0 6px">Momo 想种一棵向日葵 🌻。你要给它什么？（点一下放进去或拿出来）</p>
     <div class="row" style="gap:8px;flex-wrap:wrap">${F.map(([id,e,z])=>`<button class="btn ${st.f[id]?'mint':''} big" data-act="mfactor" data-v="${id}" ${st.run?'disabled':''}>${e} ${z}</button>`).join('')}</div>
     ${!st.run?`<p style="font-size:20px;margin:14px 0 6px">先猜一猜：这样种，向日葵会长大吗？</p><div class="row" style="gap:8px"><button class="btn ${st.guess==='y'?'sun':''} big" data-act="mguess" data-v="y">👍 会</button><button class="btn ${st.guess==='n'?'sun':''} big" data-act="mguess" data-v="n">👎 不会</button></div>
       <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sun big" data-act="mrun" ${st.guess?'':'disabled'}>🧪 开始实验（过 7 天）</button></div>`
      :`<div class="panel" style="background:var(--soft);text-align:center;margin-top:12px"><div style="font-size:90px">${plant}</div><p style="font-size:20px;margin:4px 0">${grow?'7 天以后，向日葵长得又高又漂亮！':'7 天以后，向日葵长得不好……'}</p>
       <p class="zh" style="margin:4px 0">${grow?'植物需要水、阳光、空气和泥土（养分）。'+(st.f.candy||st.f.music?'糖果和音乐不是植物需要的东西哦。':''):miss.map(x=>why[x]).join('')}</p>
       <p style="margin:6px 0;font-weight:800">${(st.guess==='y')===grow?'🎯 你猜对了！':'🤔 和你猜的不一样，科学家也是这样一次次试出来的！'}</p>
       <div class="row" style="justify-content:center"><button class="btn" data-act="mreset">🔄 换个做法再试</button><button class="btn sun big" data-act="msave">💾 记录实验</button></div></div>`}</div>`}
  if(k==='card'){st.occ=st.occ==null?0:st.occ;const o=CARD.occ[st.occ];st.to=st.to||'妈妈';st.w=st.w||[o[2][0]];const txt=cardText(st);
    return bar('home')+head+`<div class="panel"><p class="zh" style="margin:0 0 6px">1. 选节日</p><div class="row" style="gap:6px">${CARD.occ.map((x,i)=>`<button class="btn ${st.occ===i?'sun':''}" data-act="mocc" data-v="${i}">${x[1]} ${x[0]}</button>`).join('')}</div>
     <p class="zh" style="margin:10px 0 6px">2. 写给谁</p><div class="row" style="gap:6px">${CARD.to.map(x=>`<button class="btn ${st.to===x?'sun':''}" data-act="mto" data-v="${x}">${x}</button>`).join('')}</div>
     <p class="zh" style="margin:10px 0 6px">3. 选祝福语（可以选几个）</p><div class="row" style="gap:6px">${[...o[2],...CARD.more].map(x=>`<button class="btn ${st.w.includes(x)?'mint':''}" data-act="mwish" data-v="${x}">${x}</button>`).join('')}</div>
     <div class="gcard"><div style="font-size:40px">${o[1]}</div><p style="font-size:24px;white-space:pre-line;margin:6px 0">${esc(txt)}</p></div>
     <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sky" data-act="mread" data-l="zh">🔊 读出来</button><button class="btn sun big" data-act="msave">💾 放进作品集</button></div></div>`}
  return vCreate()}
function zooText(ch,st){if(!ch.length)return ['Choose some animals for your zoo!','选几种动物放进你的动物园吧！'];
  const en=['Welcome to my zoo!',...ch.map(x=>{const n=st.n[x.ms],a=st.adj[x.ms];return 'I have '+NUMEN[n]+' '+(a?a+' ':'')+plural(x.en,n)+'.'})].join('\n');
  const zh=['欢迎来到我的动物园！',...ch.map(x=>{const n=st.n[x.ms],a=ADJ.find(y=>y[0]===st.adj[x.ms]);return '我有 '+n+' 只'+(a?a[1]:'')+x.zh+'。'})].join('\n');return [en,zh]}
function kampText(ch,st){if(!ch.length)return ['Pilih benda untuk kampung kamu!','选几样东西放进你的甘榜吧！'];
  const ms=['Ini kampung saya.',...ch.map(x=>{const n=st.n[x.ms];return 'Ada '+(n===1?'se'+x.cl:NUMMS[n]+' '+x.cl)+' '+x.ms+'.'})].join('\n');
  const zh=['这是我的甘榜。',...ch.map(x=>'有 '+st.n[x.ms]+' 个'+x.zh+'（量词：'+x.cl+'）。')].join('\n');return [ms,zh]}
function cardText(st){const o=CARD.occ[st.occ];return '亲爱的'+st.to+'：\n祝您'+st.w.join('，')+'！\n'+(o[0]==='教师节'?'谢谢您！\n':'')+'爱您的 '+(S.name||'我')}
function houseCheck(st){const g=st.grid,bottom=g.slice(6-st.rows),above=g.slice(0,6-st.rows),wall=x=>x&&x!=='🔺'&&x!=='🌸';
  const counts=bottom.map(r=>r.filter(wall).length),extraWall=above.some(r=>r.some(wall));
  if(counts.every(n=>n===st.cols)&&!extraWall)return {ok:true,msg:`太棒了！${st.rows} 排，每排 ${st.cols} 块：${st.rows} × ${st.cols} = <b>${st.rows*st.cols}</b> 块。你的房子盖好了 🏠`};
  const bad=counts.map((n,i)=>[n,st.rows-i]).filter(([n])=>n!==st.cols);
  return {ok:false,msg:extraWall&&!bad.length?`墙只要 ${st.rows} 排哦，上面只能放屋顶 🔺 和花 🌸。`:`第 ${bad[bad.length-1][1]} 排（从下面数）有 ${bad[bad.length-1][0]} 块，要 ${st.cols} 块。再数一数！`}}
