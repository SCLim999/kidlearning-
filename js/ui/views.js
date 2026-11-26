/* ---------------- views ---------------- */
let view={name:S.name?'home':'setup'};
let G=null;
/* 全屏: Chrome/Edge/Android + iPad Safari (webkit prefix); iPhone Safari has no page fullscreen, so the button hides there */
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
const fsOK=()=>{const d=document.documentElement;return !!(d.requestFullscreen||d.webkitRequestFullscreen)};
let fsOff=false; // the child left fullscreen with the button: stop auto-entering this visit
function fsSet(on){const d=document.documentElement;try{const p=on?(d.requestFullscreen||d.webkitRequestFullscreen).call(d):(document.exitFullscreen||document.webkitExitFullscreen).call(document);if(p&&p.catch)p.catch(()=>{})}catch(e){}}
['fullscreenchange','webkitfullscreenchange'].forEach(e=>document.addEventListener(e,()=>view.name==='game'&&render()));
function go(v){view=v;if(v.name==='game'&&!fsOff&&fsOK()&&!fsEl())fsSet(true);render();window.scrollTo(0,0)}

function bar(active){
  return `<div class="bar">
    <button class="who" data-act="kids" aria-label="切换孩子"><div class="ava">${esc(S.avatar)}</div><div>${esc(S.name)}${Object.keys(ALL.kids).length>1?' <span class="zh" style="font-size:14px">⇄</span>':''}</div><span class="pill">⭐ ${S.stars}</span><span class="pill" style="background:var(--mint)">🎋 ${S.bamboo||0}</span></button>
    <div class="tabs">
      <button class="btn ${active==='home'?'on':''}" data-act="home">🏠 学习</button>
      <button class="btn ${active==='growth'?'on':''}" data-act="growth">🌳 成长</button>
      <button class="btn ${active==='pet'?'on':''}" data-act="pet">🐼 Momo</button>
      <button class="btn round ${active==='settings'?'on':''}" data-act="settings" aria-label="家长设置">⚙️</button>
    </div></div>`}

function vSetup(){
  const sel=view.ava||(view.newKid?'🐰':S.avatar)||'🐼';
  return `<div class="setup panel">
    <div class="wiggle" style="display:inline-block">${panda(130)}</div>
    <h1 style="font-size:34px;margin-top:8px">你好！我是熊猫 Momo</h1>
    <p class="zh" style="margin:4px 0 0">Hello! Hai! 华小一年级，我们一起学英文和国文吧～</p>
    <input id="nm" maxlength="16" placeholder="你叫什么名字？" value="${esc(view.nm||(view.newKid?'':S.name)||'')}" autocomplete="off">
    <div style="font-weight:700">选一个你喜欢的头像</div>
    <div class="avas">${AVAS.map(a=>`<button data-act="ava" data-v="${a}" class="${a===sel?'on':''}" aria-label="头像 ${a}">${a}</button>`).join('')}</div>
    <div class="row" style="justify-content:center">${view.newKid?'<button class="btn big" data-act="kids">⬅ 返回</button>':''}<button class="btn sun big" data-act="start">开始学习 🚀</button></div>
  </div>`}
function vKids(){
  return bar('')+`<div class="panel"><h2>谁要学习？</h2><div class="kids">${Object.entries(ALL.kids).map(([id,k])=>`<button class="btn kid ${id===ALL.cur?'sun':''}" data-act="pickkid" data-v="${id}"><span class="ke">${esc(k.avatar)}</span><b>${esc(k.name||'?')}</b><span>⭐ ${k.stars}</span></button>`).join('')}
    <button class="btn kid" data-act="addkid"><span class="ke">➕</span><b>添加孩子</b><span class="zh">兄弟姐妹各有自己的记录</span></button></div></div>`}

const SUBJS=[{k:'en',e:'🔤',zh:'英文',d:'English',hue:'var(--s-en)'},{k:'ms',e:'🇲🇾',zh:'国文',d:'Bahasa Melayu',hue:'var(--s-ms)'},{k:'math',e:'🔢',zh:'数学',d:'一年级 · 二年级',hue:'var(--s-math)'},{k:'sci',e:'🔬',zh:'科学',d:'一年级 · 二年级',hue:'var(--s-sci)'},{k:'cn',e:'🀄',zh:'华文',d:'一年级 · 二年级',hue:'var(--s-cn)'},{k:'world',e:'🌍',zh:'环游世界',d:'国旗 · 首都 · 动物 · 地标',hue:'var(--s-world)',extra:true}];
const curSubj=()=>S.subj==='lang'?S.lang:S.subj;
function subjProg(k){if(k==='en'||k==='ms')return '学会 '+mastered(k)+' 个词';const st=S[k]||{};const c=Object.values(st).reduce((a,r)=>a+(r.c||0),0);return c?'答对 '+c+' 题':'还没玩过'}
/* 大红花 home picker: five hibiscus petals = five subjects, Momo in the middle */
function flower(last){const P='M200 200 C150 172 98 118 112 66 C122 30 160 14 186 34 C193 26 207 26 214 34 C240 14 278 30 288 66 C302 118 250 172 200 200 Z';
  const petals=SUBJS.filter(x=>!x.extra).map((x,i)=>{const a=i*72;
    return `<g class="petal" role="button" tabindex="0" data-act="pick" data-v="${x.k}" aria-label="学${x.zh}"><g transform="rotate(${a} 200 200)"><g class="pb">
      <path d="${P}" fill="url(#hibg)" stroke="var(--hib-deep)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M200 196 L200 70 M200 170 L168 90 M200 170 L232 90" stroke="var(--hib-vein)" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>
      <g transform="rotate(${-a} 200 104)"><text x="200" y="98" text-anchor="middle" font-size="36">${x.e}</text><text x="200" y="134" text-anchor="middle" font-size="27" font-weight="800" fill="#fff" stroke="var(--hib-deep)" stroke-width="4" paint-order="stroke">${x.zh}</text>
      ${x.k===last&&S.sessions.length?`<g><rect x="168" y="142" width="64" height="22" rx="11" fill="#fff" stroke="var(--hib-deep)" stroke-width="2"/><text x="200" y="158" text-anchor="middle" font-size="13" font-weight="800" fill="#9E1028">上次学的</text></g>`:''}</g>
    </g></g></g>`}).join('');
  const dots=Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180;return `<circle cx="${200+52*Math.cos(a)}" cy="${200+52*Math.sin(a)}" r="5" fill="var(--stamen)" stroke="var(--hib-deep)" stroke-width="1.5"/>`}).join('');
  return `<svg class="flower" viewBox="-14 -6 428 412" role="group" aria-label="大红花：选一个科目">
    <defs><radialGradient id="hibg" cx="200" cy="200" r="175" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="var(--hib-deep)"/><stop offset=".35" stop-color="var(--hib)"/><stop offset="1" stop-color="#F2475A"/></radialGradient></defs>
    ${petals}<circle cx="200" cy="200" r="58" fill="var(--hib-deep)"/>${dots}
    <g class="petal" role="button" tabindex="0" data-act="pet" aria-label="去 Momo 的家"><circle cx="200" cy="200" r="44" fill="#fff" stroke="var(--hib-deep)" stroke-width="3"/><g transform="translate(160 158)">${panda(80)}</g></g></svg>`}
function vHome(){
  const d=S.days[dk()]||{stars:0};const g=S.goal;const pct=Math.min(1,d.stars/g);const C=2*Math.PI*40;
  const st=streak();const last=curSubj();
  const hello=happyNow()<35?['Momo 肚子饿了！学习赚竹子来喂它吧 🎋','Momo is hungry!']:d.stars>=g?['今天的目标完成啦！再玩一会儿也可以哦。','Goal done! 好棒！']:d.stars>0?['继续加油，还差 '+(g-d.stars)+' 颗星！','Keep going!']:['今天想学什么呢？点一个科目吧！','What shall we learn today?'];
  return bar('home')+`
  <div class="panel hello"><button class="momobtn" data-act="pet" aria-label="去 Momo 的家">${pandaDressed(84)}</button><div class="bubble">Hi ${esc(S.name)}! ${hello[0]}<small>${esc(hello[1])}</small></div>
    <div class="ring" title="今天的星星"><svg width="96" height="96"><circle cx="48" cy="48" r="40" fill="none" stroke="var(--soft)" stroke-width="12"/>
      <circle cx="48" cy="48" r="40" fill="none" stroke="var(--sun)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/></svg><b>${d.stars}/${g}</b></div></div>
  ${`<p class="zh" style="text-align:center;margin:-6px 0 14px"><span class="mstar">⭐ 今天 ${d.stars} / ${g}　</span>${st>0?'🔥 连续学习 '+st+' 天':''}${S.limit?'　⏱️ 今天 '+Math.round(todaySecs()/60)+' / '+(S.limit+((S.days[dk()]||{}).extra||0))+' 分钟':''}</p>`}
  <h2 style="font-size:28px;margin:4px 0 12px;text-align:center">今天学什么？👇</h2>
  ${flower(last)}
  <p class="zh" style="text-align:center;margin:-6px 0 16px">点一片花瓣开始学习 🌺</p>
  <div class="panel more"><h2>更多好玩的 🎈</h2><div class="feats" style="margin:0">${[['worlds','🗺️','学习世界','5 个世界 · 知识魔王'],['tutor','🧑‍🏫','Momo 小老师',tutorSummary()],['story','📖','彩虹岛历险',STORY.filter(c=>stDone()[c.id]).length+' / 7 颗知识星'],['map','🗺️','冒险地图',Math.min(advNext(),STATIONS.length)+' / '+STATIONS.length+' 站'],['album','📚','卡片册',cardCount()+' 张卡片'],['missions','🏠','生活任务','今天 '+missionState().done.length+' / 3'],['duel','⚔️','亲子对战','两人一起玩'],['world','🌍','环游世界','52 个国家'],['malware','🛡️','病毒猎人',mhTicket()?'⏱️ 还可以玩':MH_COST+' 🎋 玩 '+MH_MIN+' 分钟'],['mist','📒','错题本',(mistWords().length+mistGames().length)?(mistWords().length+mistGames().reduce((a,x)=>a+x.n,0))+' 题要重做':'没有错题 🎉'],['test','📝','每周小测',(()=>{const wk=weekKeys(0),t=(S.tests||[]).filter(x=>wk.includes(x.d));return t.length?'本周 '+Math.max(...t.map(x=>x.s))+' / 10':'本周还没测'})()]].map(([a,e,t,x])=>`<button class="btn feat" data-act="${a}"><span class="fe">${e}</span><b>${t}</b><span class="fs">${x}</span></button>`).join('')}</div></div>`}
/* 英文/国文 topic page: tabs for 一年级 / 二年级 / 课本 / 图解词典 / 学校词表; the dictionary is split into themes */
const LTABS=[['y1','📗 一年级',t=>!t.yr&&!t.custom&&!t.book&&!t.bm],['y2','📘 二年级',t=>t.yr===2],['bm','📕 课本',t=>t.bm],['book','📙 图解词典',t=>t.book],['my','📝 学校词表',t=>t.custom]];
const BOOKG=[['🙋 我和家人',['face','party','hobby1','hobby2','study1','study2','costume','tradgames','values','music']],['🏫 学校和运动',['school1','school2','sports','sportgear']],['🏙️ 地方和职业',['hotel','pharmacy','police','firestation','uniform','jobs1','jobs2','urban','places2','longhouse','station1','station2','klbuild','places3']],['🚗 交通工具',['land','seaair','kltransit','signs1','signs2']],['🌿 大自然',['season','plant1','plant2','habitat','fish','fish2','fruit1','fruit2','taste']],['🔬 科学和科技',['sciact','materials','ai','robot']],['🔤 语文',['opp1','opp2','months','idioms']]];
function ltabGet(){try{const v=JSON.parse(localStorage.getItem('momo-ltab')||'{}')[L()];if(LTABS.some(x=>x[0]===v))return v}catch(e){}return 'y1'}
function ltabSet(v){try{const o=JSON.parse(localStorage.getItem('momo-ltab')||'{}');o[L()]=v;localStorage.setItem('momo-ltab',JSON.stringify(o))}catch(e){}LTAB_MEM[L()]=v}
const LTAB_MEM={};
function vSubject(){const x=SUBJS.find(y=>y.k===curSubj())||SUBJS[0];
  return bar('home')+`
  <div class="panel row subhead" style="background:${x.hue}"><span class="se2">${x.e}</span><div style="flex:1"><h1 style="font-size:36px">${x.zh}</h1><div style="font-weight:700">${x.d}</div></div><button class="btn big" data-act="home">⬅ 换科目</button></div>
  ${S.subj!=='lang'?'':(()=>{const ri=reviewInfo(),nw=ri.weak.length,nd=ri.due.length;return nw+nd?`<div class="panel row"><span style="font-size:44px">🔁</span><div style="flex:1"><b style="font-size:22px">今日复习</b><div class="zh">${[nw?nw+' 个词还没完全学会':'',nd?nd+' 个学会的词该复习了，免得忘记':''].filter(Boolean).join('，')}。</div></div><button class="btn sun" data-act="play" data-v="review">开始复习 ▶</button></div>`:''})()}
  <p class="zh" style="text-align:center;margin:0 0 12px">点一个${S.subj==='lang'?'主题':'游戏'}开始吧！</p>
  ${S.subj==='world'?`<div class="panel row" style="justify-content:center;gap:16px"><span style="font-size:48px">🌏</span><div style="flex:1;min-width:200px"><b style="font-size:22px">3D 地球 · World Explorer</b><div class="zh">转地球、看 52 个国家、世界历史、搭建工坊、漫游世界……（这里玩的不算星星）</div></div><a class="btn sun big" href="world/index.html" style="text-decoration:none">打开 ▶</a></div>`:''}
  <div class="grid">${S.subj==="math"?mathCards():S.subj==="sci"?sciCards():S.subj==="cn"?cnCards():S.subj==="world"?worldCards():(()=>{const tc=t=>{const m=mastered(L(),t.id),n=t.words.length,nm=/[一-鿿]/.test(t.zh)?t.zh.replace(/\s+[A-Za-z][^一-鿿]*$/,''):t.zh;
    return `<button class="topic" style="background:${t.hue}" data-act="topic" data-v="${t.id}">
      <div class="ic">${esc(t.icon)}</div><h3>${esc(nm)}</h3><div class="t2">${esc(t[L()]||t.en)}</div>${t.bm&&t.tag?`<span class="tag">${esc(t.tag.replace('Super Minds 1 · ','Super Minds '))}</span>`:''}
      <div class="foot"><div class="meter"><i style="width:${m*100/n}%"></i></div><div class="cnt">${m===n?'🏅 全部学会！':'学会 '+m+' / '+n}</div></div></button>`};const ts=TOPICS.filter(t=>!t.only||t.only===L());
    const tabs=LTABS.map(([k,h,f])=>[k,h,ts.filter(f)]).filter(([k,,xs])=>xs.length||k==='my'),cur=LTAB_MEM[L()]||ltabGet(),tab=tabs.find(x=>x[0]===cur)||tabs[0];
    const head=`<div class="ltabs" role="tablist">${tabs.map(([k,h,xs])=>`<button class="btn ${k===tab[0]?'sun':''}" role="tab" aria-selected="${k===tab[0]}" data-act="ltab" data-v="${k}">${h}<small>${xs.length}</small></button>`).join('')}</div>`;
    let body;if(tab[0]==='book'){const seen=new Set();body=BOOKG.map(([h,ids])=>[h,ids.map(id=>tab[2].find(t=>t.id===id)).filter(Boolean)]).map(([h,xs])=>{xs.forEach(t=>seen.add(t.id));return[h,xs]});const rest=tab[2].filter(t=>!seen.has(t.id));if(rest.length)body.push(['📚 其他',rest]);body=groups(body,tc)}
    else body=tab[2].map(tc).join('')+(tab[0]==='my'?`<button class="topic add" data-act="cl" data-v="${(S.custom||[]).length?'':'new'}"><div class="ic">📝</div><h3>学校词表</h3><div class="t2">家长输入本周要学的词</div><div class="cnt">➕ 新增 / 编辑</div></button>`:'');
    return `</div>${head}<div class="grid tidy">${body}`})()}</div>`}

function vTopic(){
  const t=T(view.topic);if(!t){view={name:'home'};return vHome()}
  return bar('home')+`
  <div class="panel row" style="background:${t.hue};color:#2A2F6B">
    <div style="font-size:72px;line-height:1">${esc(t.icon)}</div>
    <div><h1 style="font-size:36px">${esc(t.zh)}</h1><div style="font-weight:700">${esc(t.en)} · ${esc(t.ms)}</div>${t.tag?`<span class="tag">${esc(t.tag)}</span>`:''}</div>
    <div class="spacer"></div>${t.custom?`<button class="btn" data-act="cl" data-v="${t.custom}">✏️ 编辑词表</button>`:''}<button class="btn" data-act="subjpage">⬅ 返回</button>
  </div>
  <div class="modes">${Object.entries(MODES).filter(([k])=>k!=='review'&&k!=='boss'&&k!=='math'&&k!=='sci'&&(k!=='sent'||t.sent)).map(([k,m])=>`<button class="btn mode" data-act="play" data-v="${k}"><span class="e">${m.e}</span><b>${m.zh} · ${m.t[L()]}</b><span>${m.d}</span></button>`).join('')}</div>
  <div class="panel" style="margin-top:18px"><h2>这个主题的单词 <span class="zh" style="font-size:16px">点一下听发音</span></h2>
    <div class="chips">${t.words.map(w=>{const s=wstat(L(),w);return `<button class="chip" data-act="say" data-v="${esc(w[L()])}">${ico(w)} ${esc(w[L()])}${S.showZh||!w.e?' <span class="zh">'+esc(w.zh)+'</span>':''}${s.c>=MASTER?' 🏅':''}</button>`}).join('')}</div></div>`}
