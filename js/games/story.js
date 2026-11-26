/* ---------- 📖 彩虹岛历险记: a story painting adventure ----------
   The Rainbow Islands turned grey when 灰灰怪 took the seven knowledge stars. Each chapter is one island = one subject.
   A page tells the story; its obstacle is solved by a learning question (scored like the normal games via recordWord /
   recordMath) or by choosing the right object from the backpack. After solving, the child taps the grey things to paint
   them back. Objects collected on the way are used later, and in 「用宝物讲故事」 to make up a story of their own. */
const SOBJ={torch:['🔦','手电筒','torch','照亮了黑漆漆的山洞','lit up a dark cave'],rope:['🪢','绳子','rope','荡过了一条小河','swung across a river'],umbrella:['☂️','雨伞','umbrella','挡住了哗啦啦的大雨','kept off the heavy rain'],
 boat:['🛶','小船','boat','划过了鳄鱼河','rowed across the crocodile river'],ladder:['🪜','梯子','ladder','爬上了高高的墙','climbed over a high wall'],key:['🗝️','钥匙','key','打开了神秘的大门','opened a secret door'],
 magnet:['🧲','磁铁','magnet','把掉进水里的铁桥板吸了上来','pulled the iron bridge out of the water'],seed:['🌱','种子','seeds','在沙地上种出了一片树林','grew a forest in the sand'],lantern:['🏮','灯笼','lantern','照亮了长长的走廊','lit up a long hallway'],
 trumpet:['🎺','小喇叭','trumpet','叫醒了睡觉的大石龙','woke up the sleeping stone dragon'],compass:['🧭','指南针','compass','在大雾里找到了方向','found the way in the fog'],kite:['🪁','风筝','kite','把信送到了远方的小岛','sent a letter to a faraway island'],
 bread:['🍞','面包','bread','和新朋友一起分享','shared it with a new friend']};
const STORY=[
 {id:'c1',e:'🌲',zh:'字母森林',sub:'英文',k:'en',hue:'var(--s-en)',star:'🔴',fr:'🦊',frn:'小狐狸 Fifi',sc:[
  ['🌲🦊🪧🌲','Momo 和{n}走进字母森林。小狐狸 Fifi 哭着说：「风把英文路牌吹乱了，我找不到回家的路！」','en','路牌摆好了！Fifi 开心地送你们一个手电筒。','torch'],
  ['🪨🕳️🦇🪨','前面有一个黑漆漆的山洞，里面什么都看不见。要用哪一样东西呢？',{use:'torch',no:['bread','kite','seed'],h:'山洞太黑了，需要亮光'},'手电筒一照，山洞亮了！原来洞里住着会说英文的萤火虫。'],
  ['✨🐛🍄✨','萤火虫要考考{n}：「答对了，就送你礼物！」','en','萤火虫拍拍手，送你们一条长长的绳子。','rope'],
  ['🌳🌊🌊🌳','一条小河挡住了路，河边有一棵大树。',{use:'rope',no:['umbrella','key','seed'],h:'把东西绑在大树上，就可以荡过去'},'把绳子绑在树上，咻——荡过了小河！'],
  ['🌳🦉⭐🌳','红色的知识星挂在最高的树上。猫头鹰说：「答对最后一题，星星就是你们的！」','en2','你拿到了红色的知识星！整座森林又变回绿油油的了。']]},
 {id:'c2',e:'🏡',zh:'快乐村 Kampung Ceria',sub:'国文',k:'ms',hue:'var(--s-ms)',star:'🟠',fr:'🦌',frn:'鼠鹿 Kancil',sc:[
  ['🏡🦌🌴🏡','Momo 来到快乐村。鼠鹿 Kancil 说：「村里的人都说国文，你能帮我听懂吗？」','ms','村长笑着说 Terima kasih！还送你们一把雨伞。','umbrella'],
  ['🌧️🏡🌧️🐓','忽然下起大雨，大家都快湿透了！',{use:'umbrella',no:['torch','ladder','compass'],h:'下雨的时候用什么挡雨？'},'大家躲在伞下，一点也没淋湿。'],
  ['🏪🍌🥥🏪','巴刹的阿姨说：「帮我认一认国文的东西，就送你礼物。」','ms','阿姨送你们一只小船。','boat'],
  ['🌴🐊🌊🌴','鳄鱼河挡住了去路，水又深又宽。',{use:'boat',no:['kite','magnet','bread'],h:'要过一条很深很宽的河'},'你们划着小船过了河，鳄鱼只能眨眨眼睛。'],
  ['🌴🐒⭐🌴','橙色的知识星在椰子树上。猴子说：「最后一题！」','ms2','你拿到了橙色的知识星！快乐村又变得五颜六色了。']]},
 {id:'c3',e:'⛰️',zh:'数字山',sub:'数学',k:'math',hue:'var(--s-math)',star:'🟡',fr:'🐐',frn:'山羊 Gogo',sc:[
  ['⛰️🐐🪨⛰️','数字山好高好高。山羊 Gogo 说：「算对了，上山的路才会出现。」','math','山路出现了！Gogo 还送你们一把梯子。','ladder'],
  ['⛰️🧱🧱⛰️','前面有一道高高的墙，爬不过去！',{use:'ladder',no:['umbrella','seed','trumpet'],h:'墙很高，要往上爬'},'爬上梯子，一下子就翻过了高墙。'],
  ['🍎🌳🐐🍎','Gogo 的果园里，苹果要数清楚：','math','Gogo 送你们一把金色的钥匙。','key'],
  ['🏔️🚪🔒🏔️','山顶有一扇锁住的大门。',{use:'key',no:['rope','torch','kite'],h:'门锁住了'},'咔嚓！钥匙一转，大门开了。'],
  ['🏔️🦅⭐🏔️','黄色的知识星就在门后。老鹰说：「最后一道数学题！」','math2','你拿到了黄色的知识星！数字山上开满了花。']]},
 {id:'c4',e:'🏞️',zh:'科学湖',sub:'科学',k:'sci',hue:'var(--s-sci)',star:'🟢',fr:'🐸',frn:'青蛙博士',sc:[
  ['🏞️🐸🔬🏞️','科学湖边，青蛙博士的实验全乱了：「快来帮帮我！」','sci','实验成功了！博士送你们一块磁铁。','magnet'],
  ['🌊🌉🌊🐟','湖上的铁桥板掉进水里，桥断了！',{use:'magnet',no:['seed','bread','umbrella'],h:'桥板是铁做的'},'磁铁把铁桥板吸上来，桥修好了！'],
  ['🌱🐸🌻🌱','博士的花园需要帮忙：','sci','博士送你们一包神奇的种子。','seed'],
  ['🏜️🐇🐿️🏜️','前面是一片光秃秃的沙地，小动物没有东西吃。',{use:'seed',no:['key','compass','torch'],h:'要让这里长出植物'},'种子发芽，长成一片树林，小动物都开心了！'],
  ['💧🦢⭐💧','绿色的知识星在湖中心发光。天鹅说：「最后一题！」','sci2','你拿到了绿色的知识星！湖水又变得蓝蓝的了。']]},
 {id:'c5',e:'🏯',zh:'汉字城堡',sub:'华文',k:'cn',hue:'var(--s-cn)',star:'🔵',fr:'🐉',frn:'小龙乐乐',sc:[
  ['🏯🐉📜🏯','城堡大门上写着奇怪的字。小龙乐乐说：「认出这些字，门就会开。」','cn','大门开了！乐乐送你们一盏灯笼。','lantern'],
  ['🌙🏯🕯️🌙','天黑了，城堡的长廊好暗好暗。',{use:'lantern',no:['seed','rope','boat'],h:'走廊太暗了'},'灯笼亮起来，长廊变得暖暖的。'],
  ['📚🐉📖📚','书房里的书页都飞乱了：','cn','书排好了！你们在书架上找到一个小喇叭。','trumpet'],
  ['🐲💤🪨🐲','一只大石龙睡在路中间，打着呼噜不肯让路。',{use:'trumpet',no:['magnet','umbrella','key'],h:'要叫醒它'},'嘟嘟嘟——石龙醒了，开心地跳起舞，让开了路。'],
  ['🏯🐼⭐🏯','蓝色的知识星在城堡塔顶。乐乐说：「最后一题！」','cn2','你拿到了蓝色的知识星！城堡又闪闪发亮了。']]},
 {id:'c6',e:'⚓',zh:'世界港口',sub:'环游世界',k:'world',hue:'var(--s-world)',star:'🟣',fr:'🐦',frn:'海鸥 Lulu',sc:[
  ['⚓🚢🐦⚓','世界港口停着很多国家的船。海鸥 Lulu 说：「帮船长们找到他们的国家吧！」','world','船长们送你们一个指南针。','compass'],
  ['🌫️🛶🌫️🌊','海上起了大雾，分不清东南西北。',{use:'compass',no:['lantern','seed','bread'],h:'要知道往哪个方向走'},'指南针指着北方，你们找到了路！'],
  ['🏝️🧳🐦🏝️','小岛上的旅人问了你一个问题：','world','旅人送你们一只风筝。','kite'],
  ['🏝️🌬️🌊🏝️','要把求救信送到很远的对面小岛，可是船坏了。',{use:'kite',no:['ladder','magnet','key'],h:'风很大，可以让东西飞起来'},'风筝带着信飞过大海，朋友们收到了！'],
  ['🌍🐳⭐🌍','紫色的知识星在大鲸鱼的背上。鲸鱼说：「最后一题！」','world2','你拿到了紫色的知识星！大海又变得蓝蓝的了。']]},
 {id:'c7',e:'☁️',zh:'灰灰怪的云堡',sub:'大挑战',k:'mix',hue:'var(--s-ms)',star:'🌈',fr:'👾',frn:'灰灰怪',sc:[
  ['☁️🏰☁️🌫️','最后，大家来到灰灰怪的云堡。门口的云朵出了一道英文题：','en','云朵笑眯眯地送你们一块香香的面包。','bread'],
  ['☁️🪜☁️🌫️','通往云堡的楼梯断了一大截！',{use:'ladder',no:['bread','kite','umbrella'],h:'要往上爬'},'还好带着 Gogo 送的梯子，你们爬上了云堡！'],
  ['☁️👾🧮☁️','灰灰怪跳出来：「哼！我也会出数学题！」','math2','灰灰怪愣住了：「你……你好厉害！」'],
  ['☁️👾💧☁️','灰灰怪小声说：「我偷星星，是因为没有人跟我玩……我好孤单。」该怎么帮它呢？',{use:'bread',no:['key','compass','magnet'],h:'做一个好朋友，和别人分享'},'你把面包分给灰灰怪，它第一次笑了：「谢谢你，我们做朋友吧！」'],
  ['🌈👾⭐🌈','灰灰怪说：「答对最后一题，我就把星星全部还给你们！」','mix','七颗知识星回到天上，彩虹群岛又变得五颜六色！灰灰怪变成了彩虹怪，和大家一起玩。{n}，你是了不起的小英雄！']]}];
let ST=null;
function stDone(){return (S.story&&S.story.done)||{}}
const isObj=k=>typeof k==='string'&&Object.prototype.hasOwnProperty.call(SOBJ,k);
function stBag(){return ((S.story&&S.story.bag)||[]).filter(isObj)}
/* a learning question from one subject, in the shared {title, say, html, opts, ans, explain} shape */
function storyQ(kind,lv){
  if(kind==='mix')kind=pick(['en','ms','math','sci','cn']);
  if(kind==='en'||kind==='ms'){const ts=BASE.filter(t=>!t.yr&&!t.book&&!t.bm&&!t.custom&&!t.only),t=pick(ts),w=pick(t.words),lg=kind;
    const others=shuffle(t.words.filter(x=>pic(x)!==pic(w))).slice(0,3),listen=lv===1?Math.random()<0.5:Math.random()<0.3,nm=lg==='en'?'英文':'国文';
    return{wq:1,w,lang:lg,sayLang:listen?lg:'zh',big:true,title:listen?`听一听，这个${nm}词是哪一个？`:`读一读，这个${nm}词是哪一个？`,say:listen?w[lg]:`${w[lg]}是哪一个？`,
     html:h=>(listen?`<button class="btn sky big" data-act="stsay">🔊 再听一次</button>`:`<div style="font-size:42px;font-weight:800">${esc(w[lg])}</div>`)+(h?`<div class="hintbox">💡 它的意思是「${esc(w.zh)}」</div>`:''),
     ans:w[lg],opts:shuffle([w,...others]).map(x=>({v:x[lg],l:pic(x)})),explain:`${esc(w[lg])} ＝ ${esc(w.zh)} ${pic(w)}`}}
  const bank={math:MG,sci:SG,cn:CG,world:WG}[kind],keys=Object.keys(bank).filter(k=>!bank[k].yr&&!(bank[k].needEmoji&&!flagEmojiOK())),g=pick(keys);
  const q=genL(bank[g],lv);q.g=g;q.sayLang='zh';return q}
function stUseQ(u){const o=SOBJ[u.use];return{use:u.use,title:'要用背包里的哪一样东西？',say:'要用背包里的哪一样东西？',big:true,html:h=>h?`<div class="hintbox">💡 ${u.h}</div>`:'',ans:u.use,
  opts:shuffle([u.use,...u.no]).map(k=>({v:k,l:lab(SOBJ[k][0],SOBJ[k][1])})),explain:`用${o[1]}${o[3]}！`}}
function stScene(){const c=STORY[ST.ch],s=c.sc[ST.i],a=s[2];
  ST.q=typeof a==='object'?stUseQ(a):storyQ(a.replace('2',''),/2$/.test(a)?2:1);ST.wrong=[];ST.solved=false;ST.missed=false;ST.hint=false;ST.painted=[];
  if(typeof a==='object'&&!stBag().includes(a.use))stGive(a.use)}
function stGive(k){if(!isObj(k))return;S.story=S.story||{done:{},bag:[]};if(!S.story.bag.includes(k))S.story.bag.push(k);touch()}
function stText(t){return t.replace(/\{n\}/g,S.name||'你')}
function startStory(ch){if(overLimit()){showRest();return}if(ch>0&&!stDone()[STORY[ch-1].id])return;
  ST={ch,i:0,t0:Date.now(),ok:0,n:0};stScene();go({name:'story'});const tx=stText(STORY[ch].sc[0][1]);setTimeout(()=>speak(tx,'zh'),300)}
function stAnswer(i,el){const q=ST.q;if(ST.solved)return;const ok=q.opts[i].v===q.ans;
  if(ok){ST.solved=true;if(!q.use){ST.n++;if(!ST.missed){ST.ok++;q.wq?recordWord(q.w,true,q.lang):recordMath(q.g,true)}}
    const s=STORY[ST.ch].sc[ST.i];if(s[4])stGive(s[4]);sGood();render();burst(el||document.querySelector('.stwin'));setTimeout(()=>speak(stText(s[3])+' 点一点灰色的东西，把颜色涂回去！','zh'),250)}
  else{ST.wrong.push(i);ST.hint=true;if(!q.use&&!ST.missed){ST.missed=true;q.wq?recordWord(q.w,false,q.lang):recordMath(q.g,false)}sBad();render()}}
function stNext(){const c=STORY[ST.ch];ST.i++;
  if(ST.i>=c.sc.length){const first=!stDone()[c.id];S.story=S.story||{done:{},bag:[]};S.story.done[c.id]=1;if(first)addStars(3);
    S.sessions.push({t:Date.now(),topic:'story:'+c.id,mode:'story',lang:'zh',score:ST.ok,total:ST.n,sec:Math.round((Date.now()-ST.t0)/1000)});if(S.sessions.length>300)S.sessions.splice(0,S.sessions.length-300);touch();
    ST.end=true;ST.first=first;render();window.scrollTo(0,0);setTimeout(()=>speak(stText(stRecap(c)),'zh'),300);return}
  stScene();render();window.scrollTo(0,0);const tx=stText(c.sc[ST.i][1]);setTimeout(()=>speak(tx,'zh'),250)}
function stRecap(c){return c.sc.map(s=>s[3]).join('')}
function stArt(art){try{return [...new Intl.Segmenter('zh',{granularity:'grapheme'}).segment(art)].map(x=>x.segment)}catch(e){return art.match(/\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/gu)||[art]}}
function vStoryMap(){const d=stDone(),bag=stBag(),n=STORY.filter(c=>d[c.id]).length;
  return bar('home')+`<div class="panel row" style="background:var(--s-en)"><span style="font-size:64px">📖</span><div style="flex:1;min-width:200px"><h1 style="font-size:32px">彩虹岛历险记</h1><div style="font-weight:700">找回 ${n} / 7 颗知识星</div></div><button class="btn" data-act="home">⬅ 回家</button></div>
  <div class="panel row"><span style="font-size:52px">🐢</span><div class="sttext" style="flex:1;min-width:200px">龟爷爷说：「调皮的灰灰怪偷走了彩虹群岛的七颗知识星，岛上的颜色全都变灰了！${esc(S.name||'小朋友')}，请你和 Momo 一起出发，用学过的知识帮朋友们过难关，再把颜色涂回去吧！」</div><button class="btn round" data-act="stread" data-v="intro" aria-label="读出来">🔊</button></div>
  <div class="stmap">${STORY.map((c,i)=>{const lock=i>0&&!d[STORY[i-1].id];return `<button class="topic stisle ${d[c.id]?'':'grey'}" style="background:${c.hue}" data-act="stch" data-v="${i}" ${lock?'disabled':''}>
    <div class="ic">${lock?'🔒':c.e}</div><h3>${i+1}. ${esc(c.zh)}</h3><div class="t2">${c.fr} ${esc(c.frn)} · ${c.sub}</div><div class="cnt">${d[c.id]?c.star+' 已找回 · 再玩一次':lock?'先完成上一个岛':'▶ 出发！'}</div></button>`}).join('')}</div>
  <div class="panel"><h2>🎒 我的背包</h2>${bag.length?`<div class="bag">${bag.map(k=>`<span class="pill" title="${SOBJ[k][2]}">${SOBJ[k][0]} ${SOBJ[k][1]}</span>`).join('')}</div>`:'<p class="zh" style="margin:0">还没有宝物，去冒险找宝物吧！</p>'}
   ${bag.length>=3?`<button class="btn sun big" data-act="sttell" style="margin-top:12px">🎭 用宝物讲故事</button>`:`<p class="zh" style="margin:8px 0 0">集齐 3 样宝物，就可以用宝物讲自己的故事。</p>`}</div>
  ${n?`<div class="panel"><h2>📚 我的故事书</h2>${STORY.filter(c=>d[c.id]).map(c=>`<div class="row" style="align-items:flex-start;margin-bottom:10px"><span style="font-size:36px">${c.star}</span><div style="flex:1;min-width:200px"><b>${esc(c.zh)}</b><div class="zh">${esc(stText(stRecap(c)))}</div></div><button class="btn round" data-act="stread" data-v="${c.id}" aria-label="读出来">🔊</button></div>`).join('')}</div>`:''}`}
function vStory(){if(!ST)return vStoryMap();const c=STORY[ST.ch];
  if(ST.end)return bar('home')+`<div class="panel" style="text-align:center;background:${c.hue};color:#2A2F6B"><div style="font-size:80px">${c.star}</div><h1>${esc(c.zh)} · 完成！</h1>${ST.first?'<p style="font-weight:800;margin:0">+3 ⭐ 奖励</p>':''}<p style="margin:6px 0 0">答对 ${ST.ok} / ${ST.n} 题</p></div>
   <div class="panel"><h2>🖼️ 你画好的故事图</h2><div class="stgallery">${c.sc.map(s=>`<div class="stmini" style="background:${c.hue}">${stArt(s[0]).join('')}</div>`).join('')}</div>
   <h2 style="margin-top:14px">📖 故事</h2><p class="sttext">${esc(stText(stRecap(c)))}</p><div class="row" style="justify-content:center"><button class="btn sky" data-act="stread" data-v="${c.id}">🔊 读故事</button><button class="btn sun big" data-act="stmap">🗺️ 回地图</button></div></div>`;
  const s=c.sc[ST.i],q=ST.q,items=stArt(s[0]),all=ST.solved&&items.every((x,j)=>ST.painted.includes(j)),h=ST.hint||ST.solved;
  return `<div class="gbar"><button class="btn round" data-act="stmap" aria-label="离开">✕</button><div class="dots">${c.sc.map((x,j)=>`<i class="${j<ST.i?'ok':j===ST.i?'now':''}"></i>`).join('')}</div><span class="pill">${c.e} ${esc(c.zh)}</span></div>
  <div class="stage">
   <div class="stcanvas ${all?'lit':''}" style="--sthue:${c.hue}">${items.map((x,j)=>`<button class="stitem ${ST.painted.includes(j)?'on':ST.solved?'can':''}" data-act="stpaint" data-v="${j}" ${ST.solved&&!ST.painted.includes(j)?'':'disabled'} aria-label="涂颜色">${x}</button>`).join('')}</div>
   <div class="panel row stpage"><span style="font-size:44px">${c.fr}</span><div class="sttext" style="flex:1;min-width:200px">${esc(stText(s[1]))}</div><button class="btn round" data-act="stread" data-v="page" aria-label="读出来">🔊</button></div>
   ${q.use?`<div class="bag" style="justify-content:center;margin-bottom:6px">🎒 ${stBag().map(k=>`<span class="pill">${SOBJ[k][0]} ${SOBJ[k][1]}</span>`).join('')}</div>`:''}
   <div class="mq">${q.title}</div><div class="mview">${q.html(h)}</div>
   ${ST.solved?'':`<div class="row" style="justify-content:center;margin:6px 0"><button class="btn sky" data-act="stsay">🔊 听题目</button>${ST.hint?'':'<button class="btn" data-act="sthint">💡 提示</button>'}</div>`}
   <div class="opts">${q.opts.map((o,i)=>`<button class="opt${q.big?' emo':''} ${ST.solved&&o.v===q.ans?'right':''} ${ST.wrong.includes(i)?'wrong':''}" data-act="stans" data-v="${i}" ${ST.solved?'disabled':''}>${o.l}</button>`).join('')}</div>
   ${ST.wrong.length&&!ST.solved?`<p class="zh" style="text-align:center">😅 ${q.use?'这个好像帮不上忙，':''}再想一想，看看提示！</p>`:''}
   ${ST.solved?`<div class="feedback stwin">${pandaDressed(64,'happy',all?'dance':'')}<div class="ft">${esc(stText(s[3]))}<small>${q.explain}${s[4]?` · 🎒 得到 ${SOBJ[s[4]][0]} ${SOBJ[s[4]][1]}`:''}</small><small>${all?'🎨 画好了！':'🖌️ 点一点上面灰色的东西，把颜色涂回去！'}</small></div>${all?`<button class="btn sun big" data-act="stnext">${ST.i<c.sc.length-1?'翻下一页 ▶':'看完整的故事 🎉'}</button>`:''}</div>`:''}
  </div>`}
/* 🎭 用宝物讲故事: pick three objects in any order and Momo tells that story */
function stTell(p){const ok=p.length===3;const story=ok?[`从前，有一天，${S.name||'小朋友'}和 Momo 背着背包出发去冒险。`,...p.map((k,i)=>`${['首先','接着','最后'][i]}，他们用${SOBJ[k][1]}${SOBJ[k][3]}。`),'大家都说：「你们真聪明，又很勇敢！」'].join(''):'';
  const en=ok?[`Once upon a time, ${S.name||'a child'} and Momo went on an adventure.`,...p.map((k,i)=>`${['First','Then','At last'][i]}, they used the ${SOBJ[k][2]} and ${SOBJ[k][4]}.`),'Everyone said, “You are clever and brave!”'].join(' '):'';return [story,en]}
function vStoryTell(){const bag=stBag(),p=view.pick||[];const ok=p.length===3,[story,en]=stTell(p);
  return bar('home')+`<div class="panel row" style="background:var(--s-cn);color:#2A2F6B"><span style="font-size:56px">🎭</span><div style="flex:1"><h1 style="font-size:30px">用宝物讲故事</h1><div style="font-weight:700">按顺序点 3 样宝物，Momo 帮你把故事讲出来</div></div><button class="btn" data-act="stmap">⬅ 返回</button></div>
  <div class="panel"><div class="tellpick">${bag.map(k=>{const n=p.indexOf(k);return `<button class="btn tellobj ${n>=0?'sun':''}" data-act="sttpick" data-v="${k}" ${!ok||n>=0?'':'disabled'}><span style="font-size:44px">${SOBJ[k][0]}</span><b>${SOBJ[k][1]}</b>${n>=0?`<span class="tnum">${n+1}</span>`:''}</button>`}).join('')}</div>
   ${p.length?`<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" data-act="sttreset">🔄 重新选</button></div>`:''}</div>
  ${ok?`<div class="panel"><div class="stcanvas lit" style="--sthue:var(--s-cn)">${['🐼',...p.map(k=>SOBJ[k][0]),'⭐'].map(x=>`<span class="stitem on">${x}</span>`).join('')}</div>
   <p class="sttext">${esc(story)}</p><p class="zh" style="font-size:18px">${esc(en)}</p>
   <div class="row" style="justify-content:center"><button class="btn sky" data-act="sttread" data-l="zh">🔊 华文</button><button class="btn sky" data-act="sttread" data-l="en">🔊 English</button></div><p class="zh" style="text-align:center;margin:10px 0 0">换个顺序，就是另一个故事哦！</p></div>`:''}`}
