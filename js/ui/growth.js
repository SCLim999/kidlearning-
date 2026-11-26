/* ---------- growth ---------- */
function weekKeys(off){const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7)-7*off);const ks=[];for(let i=0;i<7;i++){const x=new Date(d);x.setDate(d.getDate()+i);ks.push(dk(x))}return ks}
function weekSum(off){const ks=weekKeys(off);const w={days:0,stars:0,mins:0,correct:0,wrong:0,rec:0,mc:0,sc:0,cc:0,newWords:0,ks};
  ks.forEach(k=>{const r=S.days[k];if(r&&r.stars>0){w.days++;w.stars+=r.stars;w.mins+=r.mins||0;w.correct+=r.correct;w.wrong+=r.wrong;w.rec+=r.rec||0;w.mc+=r.mc||0;w.sc+=r.sc||0;w.cc+=r.cc||0}});
  w.newWords=Object.values(S.words).filter(r=>r.m&&ks.includes(r.m)).length;return w}
function weakTopic(){let best=null;TOPICS.forEach(t=>{let tried=0;t.words.forEach(w=>{const r=wstat(S.lang,w);if(r.c+r.w)tried++});if(!tried)return;
  const ratio=mastered(S.lang,t.id)/t.words.length;if(ratio<1&&(!best||ratio<best.ratio))best={t,ratio}});return best&&best.t}
function fmtK(k){const p=k.split('-');return (+p[1])+'/'+(+p[2])}
function reportText(){const w=weekSum(0),lw=weekSum(1),wt=weakTopic();const acc=w.correct+w.wrong?Math.round(w.correct*100/(w.correct+w.wrong)):null;
  return `📋 ${S.name} 的本周学习报告（${fmtK(w.ks[0])}–${fmtK(w.ks[6])}）\n学习天数：${w.days} 天（上周 ${lw.days} 天）\n得到星星：${w.stars} 颗（上周 ${lw.stars} 颗）\n学习时间：约 ${w.mins} 分钟\n新学会的词：${w.newWords} 个\n第一次就答对：${acc==null?'–':acc+'%'}\n跟读次数：${w.rec} 次\n数学答对：${w.mc} 题\n科学答对：${w.sc} 题\n华文答对：${w.cc} 题${wt?'\n下周多练：'+wt.zh+'（'+wt.en+' / '+wt.ms+'）':''}\n— Momo 学英文·国文`}
function cmp(a,b){return a>b?'<span style="color:var(--good)">▲</span>':a<b?'<span style="color:var(--bad)">▼</span>':''}
function vReport(){const w=weekSum(0),lw=weekSum(1),wt=weakTopic();const acc=w.correct+w.wrong?Math.round(w.correct*100/(w.correct+w.wrong)):null;
  const msg=w.days===0?'这个星期还没开始学习，今天就来玩一个游戏吧！':w.days>=5?'这个星期非常用功，几乎天天都有学习，真棒！':w.stars>lw.stars?'比上个星期更努力了，继续保持！':'每天学一点点，进步会越来越大。';
  return `<div class="panel"><div class="row"><h2 style="margin:0">本周报告 📋</h2><span class="zh">${fmtK(w.ks[0])}–${fmtK(w.ks[6])}</span><div class="spacer"></div><button class="btn" data-act="copyrep">📋 复制报告</button></div>
  <p style="font-weight:700;margin:10px 0">${msg}</p>
  <div class="stats">
    <div class="stat"><div class="n">${w.days}</div><div class="l">学习天数（上周 ${lw.days}）</div></div>
    <div class="stat"><div class="n">⭐ ${w.stars}</div><div class="l">星星（上周 ${lw.stars}）</div></div>
    <div class="stat"><div class="n">${w.newWords}</div><div class="l">🏅 新学会的词</div></div>
    <div class="stat"><div class="n">${w.mins}</div><div class="l">⏱️ 学习分钟</div></div>
    <div class="stat"><div class="n">${acc==null?'–':acc+'%'}</div><div class="l">🎯 第一次就答对</div></div>
    <div class="stat"><div class="n">${w.rec}</div><div class="l">🎤 跟读次数</div></div>
    <div class="stat"><div class="n">${w.mc}</div><div class="l">🔢 数学答对</div></div>
    <div class="stat"><div class="n">${w.sc}</div><div class="l">🔬 科学答对</div></div>
    <div class="stat"><div class="n">${w.cc}</div><div class="l">🀄 华文答对</div></div>
  </div>${wt?`<p style="margin:12px 0 0">💡 下周可以多练 <b>${esc(wt.icon)} ${esc(wt.zh)}</b>（${esc(wt[S.lang])}），这个主题学会的词最少。</p>`:''}</div>`}
function chart(){
  const days=[];const d=new Date();d.setDate(d.getDate()-13);
  for(let i=0;i<14;i++){days.push({k:dk(d),day:d.getDate(),s:(S.days[dk(d)]||{}).stars||0});d.setDate(d.getDate()+1)}
  const max=Math.max(S.goal,...days.map(x=>x.s));const W=560,H=180,bw=W/14;
  const gy=H-20-(S.goal/max)*(H-40);
  return `<div style="overflow-x:auto"><svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" style="min-width:420px" role="img" aria-label="最近14天的星星">
    <line class="gl" x1="0" x2="${W}" y1="${gy}" y2="${gy}"/>
    ${days.map((x,i)=>{const h=(x.s/max)*(H-40);const isT=i===13;return `<rect class="${x.s>=S.goal?'bt':'b'}" x="${i*bw+6}" y="${H-20-h}" width="${bw-12}" height="${Math.max(h,0)}" rx="7"/>
      ${x.s?`<text x="${i*bw+bw/2}" y="${H-24-h}" text-anchor="middle">${x.s}</text>`:''}<text x="${i*bw+bw/2}" y="${H-4}" text-anchor="middle" style="${isT?'font-weight:800':''}">${isT?'今天':x.day}</text>`}).join('')}
  </svg></div><div class="zh" style="font-size:14px">黄色＝达到每日目标 ${S.goal} 颗星　粉色虚线＝目标线</div>`}

function vGrowth(){
  const lv=Math.min(Math.floor(S.stars/25),LEVELS.length-1);const into=S.stars-lv*25;const isMax=lv===LEVELS.length-1;
  const acc=accuracy();const st=streak();
  const totalWords=BASE.reduce((a,t)=>a+t.words.length,0);
  const weak=Object.entries(S.words).filter(([k,r])=>r.w>0&&r.c<MASTER).sort((a,b)=>b[1].w-a[1].w).slice(0,10)
    .map(([k,r])=>{const [lang,t,en]=k.split(':');return {lang,w:WMAP[t+':'+en]}}).filter(x=>x.w);
  const recent=S.sessions.slice(-8).reverse();
  const todayM=(S.days[dk()]||{}).mins||0;
  return bar('growth')+`
  <div class="panel lvl"><div class="big">${esc(S.avatar)}</div>
    <div style="flex:1"><h1 style="font-size:30px">${esc(S.name)} 的成长记录</h1>
      <div style="font-weight:700">等级 ${lv+1}：${LEVELS[lv]}</div>
      <div class="meter" style="background:var(--soft);height:16px"><i style="width:${isMax?100:into*4}%;background:var(--mint)"></i></div>
      <div class="zh" style="font-size:15px">${isMax?'已经是最高等级啦！':'再拿 '+(25-into)+' 颗星升级'}</div></div></div>
  ${vReport()}
  <div class="panel row"><button class="btn" data-act="print">🖨️ 打印本周贴纸表</button><button class="btn" data-act="letter">📮 看 Momo 的信</button><button class="btn" data-act="test">📝 每周小测成绩</button></div>
  <div class="panel stats">
    <div class="stat"><div class="n">⭐ ${S.stars}</div><div class="l">总星星</div></div>
    <div class="stat"><div class="n">${mastered('en')}</div><div class="l">🇬🇧 学会的英文词 / ${totalWords}</div></div>
    <div class="stat"><div class="n">${mastered('ms')}</div><div class="l">🇲🇾 学会的国文词 / ${totalWords}</div></div>
    <div class="stat"><div class="n">🔥 ${st}</div><div class="l">连续学习天数</div></div>
    <div class="stat"><div class="n">${acc==null?'–':acc+'%'}</div><div class="l">🎯 第一次就答对</div></div>
    <div class="stat"><div class="n">${todayM}</div><div class="l">⏱️ 今天学了几分钟</div></div>
  </div>
  <div class="panel"><h2>最近 14 天 📈</h2>${chart()}</div>
  <div class="panel"><h2>每个主题学会了多少</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">一个词第一次就答对 ${MASTER} 次，就算学会 🏅</div>
    <div class="bars2">${BASE.map(t=>{const n=t.words.length,e=mastered('en',t.id),m=mastered('ms',t.id);
      return `<div style="font-weight:700">${t.icon} ${t.zh}</div><div class="m2">
      <div class="mrow">🇬🇧<div class="meter"><i class="en" style="width:${e*100/n}%"></i></div>${e}/${n}</div>
      <div class="mrow">🇲🇾<div class="meter"><i class="ms" style="width:${m*100/n}%"></i></div>${m}/${n}</div></div>`}).join('')}</div></div>
  <div class="panel"><h2>需要多练习的词 💪</h2>${weak.length?`<div class="chips">${weak.map(x=>`<button class="chip" data-act="sayL" data-l="${x.lang}" data-v="${esc(x.w[x.lang])}">${ico(x.w)} ${esc(x.w[x.lang])} <span class="zh">${esc(x.w.zh)}</span></button>`).join('')}</div>`:'<p class="zh" style="margin:0">还没有哦！继续玩游戏，这里会出现答错过的词。</p>'}</div>
  ${mathPanel()}
  ${sciPanel()}
  ${cnPanel()}
  ${worldPanel()}
  <div class="panel"><h2>我的贴纸本 🎁</h2><div class="stickers">${STICKERS.map(s=>`<div class="sticker ${S.stars>=s.n?'':'lock'}"><span class="e">${s.e}</span>${S.stars>=s.n?s.zh:'⭐ '+s.n}</div>`).join('')}</div></div>
  <div class="panel"><h2>最近玩了什么</h2>${recent.length?`<ul class="list">${recent.map(r=>{const mg=/^(math|sci|cn|world):/.test(r.topic)&&GAME(r.topic.split(':')[1]);const t=T(r.topic)||(mg?{icon:mg.e,zh:mg.zh}:null),m=MODES[r.mode],dt=new Date(r.t);
    return `<li><span style="font-size:28px">${t?t.icon:'📘'}</span><span style="flex:1"><b>${t?t.zh+' · ':''}${m?m.zh:''}</b> <span class="zh">${LANGS[r.lang]?LANGS[r.lang].flag+' '+LANGS[r.lang].zh:''}</span></span>
    <span>${r.score==null?'📖 学完':r.score+'/'+r.total}</span><span class="zh" style="font-size:14px">${dt.getMonth()+1}/${dt.getDate()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}</span></li>`}).join('')}</ul>`:'<p class="zh" style="margin:0">还没有记录，去玩第一个游戏吧！</p>'}</div>`}

function vSettings(){
  return bar('settings')+`
  <div class="panel row" style="background:var(--s-en);color:#2A2F6B"><span style="font-size:44px">📊</span><div style="flex:1"><h2 style="margin:0">家长后台</h2><div style="font-size:15px">看所有孩子的学习进度、强项、弱项和兴趣（要输入家长密码）</div></div><button class="btn sun big" data-act="admin">打开 ▶</button></div>
  <div class="panel"><h2>家长设置 👨‍👩‍👧</h2>
    <div class="row" style="margin-bottom:14px"><b>孩子的名字</b><input id="nm2" maxlength="16" value="${esc(S.name)}" style="flex:1;min-width:160px;font-size:20px;border:3px solid var(--edge);border-radius:14px;padding:8px 12px;background:var(--surface);user-select:text;-webkit-user-select:text"><button class="btn mint" data-act="rename">保存</button></div>
    <div style="font-weight:700">头像</div>
    <div class="avas" style="justify-content:flex-start">${AVAS.map(a=>`<button data-act="setava" data-v="${a}" class="${a===S.avatar?'on':''}" aria-label="头像 ${a}">${a}</button>`).join('')}</div>
    <div class="row" style="margin-bottom:12px"><b>每日目标</b>${[5,10,15,20].map(n=>`<button class="btn ${S.goal===n?'sky':''}" data-act="goal" data-v="${n}">${n} ⭐</button>`).join('')}</div>
    <div class="row" style="margin-bottom:12px"><b>每天时间提醒</b>${[0,15,20,30].map(n=>`<button class="btn ${S.limit===n?'sky':''}" data-act="limit" data-v="${n}">${n?n+' 分钟':'关'}</button>`).join('')}</div>
    <div class="row" style="margin-bottom:12px"><b>华文帮助</b><button class="btn ${S.showZh?'mint':''}" data-act="zh">${S.showZh?'开 ✓':'关'}</button>
      <b style="margin-left:12px">音效</b><button class="btn ${S.sound?'mint':''}" data-act="snd">${S.sound?'开 ✓':'关'}</button></div>
    <div class="row" style="margin-bottom:12px"><b>游戏画风</b><button class="btn ${S.autoLook!==false?'mint':''}" data-act="autolook">${S.autoLook!==false?'每一轮换场景和画风 ✓':'固定（用下面选的画风）'}</button></div>
  </div>
  <div class="panel"><h2>画风皮肤 🎨</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">换一个喜欢的画风，整个 App 都会变样子</div>
    <div class="skins">${SKINS.map(([id,e,name])=>`<button class="skin ${S.skin===id?'on':''}" data-skin="${id}" data-act="skin" data-v="${id}" aria-pressed="${S.skin===id}" aria-label="画风 ${name}"><span class="sk-row">${panda(46,'happy')}<span class="sk-b">Aa</span></span><b>${e} ${name}</b></button>`).join('')}</div></div>
  <div class="panel row"><span style="font-size:44px">📝</span><div style="flex:1"><h2 style="margin:0">学校词表</h2><div class="zh" style="font-size:15px">输入学校这星期要学的英文或国文词，Momo 会把它们变成游戏。现在有 ${(S.custom||[]).length} 个词表。</div></div><button class="btn sun" data-act="cl">管理词表 ▶</button></div>
  ${voiceSettings()}
  ${syncPanel()}${backupPanel()}
  <div class="panel"><h2>家长密码 🔒</h2><p style="margin:0 0 10px">设定以后，打开「家长设置」、编辑学校词表、或休息时间多加 10 分钟，都要先输入密码。更改或取消密码时，每次都要再输入现在的密码；连续输错 3 次会锁 5 分钟。忘记密码时，可以寄验证码到云端同步登入的家长电邮，或者用设定密码时给你的「恢复码」。</p><div class="row">${ALL.pin?'<b>✅ 已设定</b><button class="btn" data-act="pinset">更改密码</button><button class="btn pink" data-act="pinoff">取消密码</button>':'<button class="btn mint" data-act="pinset">设定密码</button>'}</div></div>
  <div class="panel"><h2>学习记录保存</h2>
    <p style="margin:0 0 10px">${cloudOn?'☁️ 学习记录会自动保存在你的 Claude 帐号里，换设备打开同一个链接也能继续。':'💾 学习记录保存在这台设备的浏览器里（换设备不会同步）。'}</p>
    <div class="row"><button class="btn pink" data-act="reset">清除 ${esc(S.name)} 的学习记录</button>${Object.keys(ALL.kids).length>1?`<button class="btn" data-act="delkid">删除 ${esc(S.name)}</button>`:''}</div></div>`}

function backupPanel(){const lb=ALL.lastBackup,days=lb?Math.floor((Date.now()-lb)/864e5):null;
  return `<div class="panel"><h2>备份 / 恢复 💾</h2>
    <p style="margin:0 0 10px">把所有孩子的星星、单词、宠物和学校词表存成一个文件。换设备、换浏览器或清除了浏览器资料之后，可以用这个文件恢复。</p>
    <p class="zh" style="font-size:15px;margin:0 0 12px">${lb?'上次备份：'+dk(new Date(lb))+(days>=14?' ⚠️ 已经 '+days+' 天没备份了':''):'⚠️ 还没有备份过'}</p>
    <div class="row"><button class="btn mint" data-act="export">⬇️ 下载备份文件</button><button class="btn" data-act="import">⬆️ 从备份文件恢复</button><input type="file" id="imp" hidden></div>
    <p class="zh" style="font-size:14px;margin:10px 0 0">iPad / iPhone：文件会存到「文件」App 的「下载」里。恢复时会取代这台设备上现在的全部资料。</p>${snapPanel()}</div>`}
function exportData(){
  const name='momo-backup-'+dk()+'.json';const blob=new Blob([JSON.stringify({app:'momo-learn',exported:new Date().toISOString(),data:ALL})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);ALL.lastBackup=Date.now();saveLocal();toast('备份文件已下载：'+name);render()}
function importData(file){if(!file)return;if(file.size>5e6){sBad();toast('这个文件太大了，不是 Momo 的备份文件 😕');return}const r=new FileReader();
  r.onload=()=>{let n;try{let o=JSON.parse(r.result);if(o&&o.app==='momo-learn')o=o.data;if(!o||typeof o!=='object'||!(o.kids||o.days||o.words))throw 0;n=normalize(o)}catch(e){sBad();toast('这个文件不是 Momo 的备份文件 😕');return}
    const names=Object.values(n.kids).map(k=>(k.avatar||'')+(k.name||'?')+' ⭐'+k.stars).join('、');
    if(!confirm('要用备份文件里的资料取代这台设备上现在的全部资料吗？\n\n备份里有：'+names))return;
    snapshot('import');keepPin(n);ALL=n;S=ALL.kids[ALL.cur];G=null;touch();sGood();toast('已恢复 ✓');go({name:S.name?'home':'setup'})};
  r.onerror=()=>toast('读不到这个文件');r.readAsText(file)}
