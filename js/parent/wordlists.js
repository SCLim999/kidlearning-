/* ---------- custom word lists ---------- */
function clDraft(id){if(!id)return null;if(id==='new')return{id:'new',name:'',lang:S.subj==='lang'?S.lang:'en',text:''};
  const c=(S.custom||[]).find(x=>x.id===id);if(!c)return null;return{id,name:c.name,lang:c.lang,text:c.words.map(a=>[a.w,a.zh,a.e].filter(Boolean).join(', ')).join('\n')}}
function clKeep(){const d=view.draft;if(!d)return;const n=document.getElementById('cl-name'),t=document.getElementById('cl-text');if(n)d.name=n.value;if(t)d.text=t.value}
function vCustom(){const d=view.draft,lists=S.custom||[];
  return bar('settings')+`<div class="panel row"><span style="font-size:56px">📝</span><div style="flex:1"><h1 style="font-size:30px">学校词表</h1><div class="zh">输入学校这星期要学的词，孩子就能用「认识单词、听音选图、看图选词、拼一拼、翻牌配对、泡泡」来练习。</div></div><button class="btn" data-act="settings">⬅ 返回</button></div>
  ${d?`<div class="panel"><h2>${d.id==='new'?'新增词表':'编辑词表'}</h2>
    <div style="font-weight:700;margin-bottom:6px">词表名字</div><input id="cl-name" class="cl-in" maxlength="20" value="${esc(d.name)}" placeholder="例如：第 12 周英文听写" autocomplete="off">
    <div class="row" style="margin:14px 0 6px"><b>语言</b><div class="seg" role="group" aria-label="词表语言">${Object.entries(LANGS).map(([k,v])=>`<button data-act="cllang" data-v="${k}" class="${d.lang===k?'on':''}">${v.flag} ${v.zh}</button>`).join('')}</div></div>
    <div style="font-weight:700;margin:12px 0 6px">单词（每行一个）</div>
    <textarea id="cl-text" class="cl-in" spellcheck="false" autocapitalize="off" placeholder="${d.lang==='ms'?'kucing, 猫, 🐱\nsekolah, 学校\nmerah':'apple, 苹果, 🍎\nschool bag, 书包\nred'}">${esc(d.text)}</textarea>
    <p class="zh" style="font-size:15px;margin:8px 0 12px">💡 每行写：单词, 中文意思, 表情图（中文和表情图可以不写其中一个）。Momo 认识的词会自动配上图。至少 ${CL_MIN_WORDS} 个词，最多 ${CL_MAX_WORDS} 个。</p>
    ${clBad()}
    <div class="row"><button class="btn sun big" data-act="clsave">💾 保存</button><button class="btn" data-act="clcancel">取消</button></div></div>`:''}
  ${d?'':clBad()}
  <div class="panel"><h2>${esc(S.name)} 的词表</h2>
    ${lists.length?lists.map(c=>{const t=T('my-'+c.id),m=t?mastered(c.lang,t.id):0;return `<div class="cl-row"><span style="font-size:30px">${LANGS[c.lang].flag}</span><div style="flex:1;min-width:140px"><b>${esc(c.name)}</b><div class="zh" style="font-size:14px">${LANGS[c.lang].zh} · ${c.words.length} 个词 · 学会 ${m}</div></div>
      <button class="btn sky" data-act="clplay" data-v="${c.id}">▶ 去玩</button><button class="btn" data-act="cl" data-v="${c.id}">✏️ 编辑</button><button class="btn pink" data-act="cldel" data-v="${c.id}">🗑</button></div>`}).join(''):'<p class="zh" style="margin:0 0 10px">还没有词表。</p>'}
    ${d||lists.length>=CL_MAX_LISTS?'':`<button class="btn mint" data-act="cl" data-v="new" style="margin-top:10px">➕ 新增词表</button>`}</div>`}
function clBad(){return view.bad&&view.bad.length?`<div class="cl-bad"><b>这些行看不懂，没有加进去：</b>${view.bad.map(b=>`<div>${esc(b)}</div>`).join('')}</div>`:''}
function clSave(){clKeep();const d=view.draft;const {out,bad}=parseWords(d.text);
  if(out.length<CL_MIN_WORDS){view.bad=bad;sBad();toast('至少要 '+CL_MIN_WORDS+' 个看得懂的词哦（现在 '+out.length+' 个）');render();return}
  const name=(d.name||'').trim()||('学校词表 '+dk().slice(5));
  S.custom=S.custom||[];let c=S.custom.find(x=>x.id===d.id);
  if(!c){if(S.custom.length>=CL_MAX_LISTS){toast('最多 '+CL_MAX_LISTS+' 个词表');return}c={id:'c'+Date.now().toString(36)};S.custom.push(c)}
  Object.assign(c,{name,lang:d.lang,words:out});touch();syncCustom();sGood();
  if(bad.length){view.draft=null;view.bad=bad;toast('已保存 '+out.length+' 个词，有 '+bad.length+' 行跳过了');render();return}
  toast('已保存 '+out.length+' 个词 ✓');S.subj='lang';S.lang=c.lang;go({name:'topic',topic:'my-'+c.id})}

function voiceSettings(){
  const row=(l,flag,name,sample)=>{const vs=voicesFor(l);const cur=pickVoice(l);
    return `<div class="row" style="margin-bottom:10px"><b style="min-width:72px">${flag} ${name}</b>
    ${vs.length?`<select class="vsel" data-l="${l}" aria-label="${name}声音">${vs.map(v=>`<option value="${esc(v.voiceURI)}" ${cur&&cur.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select>`:'<span class="zh" style="flex:1">没有找到这个语言的声音</span>'}
    <button class="btn" data-act="sayL" data-l="${l}" data-v="${esc(sample)}">🔊 试听</button></div>`};
  const ms=hasMalay();
  return `<div class="panel"><h2>朗读声音 🔊</h2>
    <p class="zh" style="margin:-6px 0 12px;font-size:15px">每台设备的声音不一样，挑一个孩子听得最清楚的。设定只保存在这台设备上。</p>
    ${row('en','🇬🇧','英文','Hello! This is a cat. I have a kite.')}
    ${row('ms','🇲🇾','国文','Selamat pagi! Ini kucing. Saya ada layang-layang.')}
    ${row('zh','🇨🇳','华文','你好！这是猫。我有一个风筝。')}
    <div class="row" style="margin:6px 0 12px"><b>说话速度</b>${[[0.8,'🐢 慢'],[1,'🙂 正常'],[1.2,'🐇 快']].map(([r,t])=>`<button class="btn ${VP.rate===r?'sky':''}" data-act="rate" data-v="${r}">${t}</button>`).join('')}</div>
    ${ms?'':`<p style="margin:0 0 6px;font-weight:700">⚠️ 这台设备没有马来语声音，国文会用${voicesFor('ms').length?'印尼语':'其他语言的'}声音代替，口音会有点不同。</p>`}
    <p class="zh" style="font-size:15px;margin:0">加装马来语声音：<br>• iPad：设置 › 辅助功能 › 朗读内容 › 声音 › 马来语<br>• Android：设置 › 系统 › 语言 › 文字转语音输出，在语音引擎里安装马来语（如果有）<br>• Windows：用 Edge 打开通常已有 Microsoft 马来语声音；或 设置 › 时间和语言 › 语音 › 添加语音</p></div>`}

function render(){
  syncCustom();
  const v=view.name;
  const inGame=LOOK&&['game','end','duelplay'].includes(view.name),sk=inGame?LOOK.skin:S.skin;document.documentElement.dataset.skin=SKINS.some(s=>s[0]===sk)?sk:'toy';sceneDeco();
  app.innerHTML=v==='setup'?vSetup():v==='home'?vHome():v==='subject'?vSubject():v==='topic'?vTopic():v==='game'?vGame():v==='end'?vEnd():v==='growth'?vGrowth():v==='map'?vMap():v==='album'?vAlbum():v==='missions'?vMissions():v==='duel'?vDuelSetup():v==='duelplay'?vDuel():v==='pet'?vPet():v==='mtopic'?vMTopic():v==='kids'?vKids():v==='custom'?vCustom():v==='mist'?vMist():v==='test'?vTest():v==='print'?vPrint():v==='admin'?vAdmin():v==='story'?vStory():v==='worlds'?vWorlds():v==='world'?vWorld():v==='create'?vCreate():v==='make'?vMake():v==='tutor'?vTutor():v==='storytell'?vStoryTell():vSettings();
  if(v==='home')setTimeout(maybeLetter,500);
}
