/* ---------- ☁️ 云端同步 (Supabase) + local snapshots ----------
   Offline first: the device's localStorage stays the working copy; the cloud is a copy that devices merge with.
   · Parent account = a Supabase email login (6-digit code or magic link). Nothing else about the family is collected:
     the cloud row holds the same ALL object as localStorage (children's nicknames, avatars and learning records).
   · One row per parent in public.momo_progress (row-level security: only that parent can read or write it), plus one
     backup per day in public.momo_backups (kept 30 days). See supabase/schema.sql and supabase/SETUP.md.
   · mergeAll() never throws progress away: counts take the larger value, histories are combined, a child's settings,
     pet, word lists and bamboo follow whichever device used that child most recently.
   · Sync runs after start-up, after every change (debounced), when the device comes back online and every 5 minutes.
   · Local snapshots: one per day (last 7) in localStorage 'momo-snaps', so a bad import or merge can be undone offline.
   Everything here is only reachable from the PIN-protected settings page. */
const SB_KEY='momo-sb',SNAP_KEY='momo-snaps';
const syncReady=()=>typeof SYNC_CFG==='object'&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(SYNC_CFG.url||'')&&typeof SYNC_CFG.key==='string'&&SYNC_CFG.key.length>20;
let SB=null,sbTimer=null,sbBusy=false,sbAgain=false,sbState={msg:'',at:0,err:''};
function sbLoad(){try{const s=JSON.parse(localStorage.getItem(SB_KEY)||'null');if(s&&typeof s.rt==='string'&&typeof s.at==='string')SB=s}catch(e){}}
function sbSave(){try{SB?localStorage.setItem(SB_KEY,JSON.stringify(SB)):localStorage.removeItem(SB_KEY)}catch(e){}}
async function sbFetch(path,opt={}){const h=Object.assign({apikey:SYNC_CFG.key,'Content-Type':'application/json'},opt.headers||{});
  if(opt.auth!==false&&SB){await sbFresh();h.Authorization='Bearer '+SB.at}
  const r=await fetch(SYNC_CFG.url+path,{method:opt.method||'GET',headers:h,body:opt.body==null?undefined:JSON.stringify(opt.body)});
  const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
  if(!r.ok){const m=(j&&(j.msg||j.message||j.error_description||j.error))||('HTTP '+r.status);throw new Error(String(m).slice(0,160))}return j}
async function sbFresh(){if(!SB||Date.now()<SB.exp-60e3)return;
  const r=await fetch(SYNC_CFG.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SYNC_CFG.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:SB.rt})});
  if(!r.ok){SB=null;sbSave();throw new Error('登入已过期，请重新登入')}sbTake(await r.json())}
function sbTake(j){if(!j||!j.access_token)throw new Error('登入失败');SB={at:j.access_token,rt:j.refresh_token,exp:Date.now()+(+j.expires_in||3600)*1000,email:String((j.user&&j.user.email)||(SB&&SB.email)||'').slice(0,120)};sbSave()}
async function sbSendCode(email){await sbFetch('/auth/v1/otp',{method:'POST',auth:false,body:{email,create_user:true}})}
async function sbVerify(email,code){sbTake(await sbFetch('/auth/v1/verify',{method:'POST',auth:false,body:{type:'email',email,token:code}}))}
async function sbSignOut(){try{if(SB)await sbFetch('/auth/v1/logout',{method:'POST'})}catch(e){}SB=null;sbSave()}
/* ---- merging two copies of ALL ---- */
const mx=(a,b)=>Math.max(+a||0,+b||0);
function mergeRec(a,b){if(!a)return b;if(!b)return a;const r={c:mx(a.c,b.c),w:mx(a.w,b.w)};
  for(const f of ['m','due'])if(a[f]||b[f])r[f]=[a[f],b[f]].filter(Boolean).sort().pop();if(a.iv!=null||b.iv!=null)r.iv=(a.due||'')>=(b.due||'')?(a.iv??b.iv):(b.iv??a.iv);
  if(a.ro!=null||b.ro!=null)r.ro=mx(a.ro,b.ro);if(a.rm!=null||b.rm!=null)r.rm=mx(a.rm,b.rm);return r}
const mergeMap=(a,b,f)=>{const o=Object.assign({},a||{});Object.entries(b||{}).forEach(([k,v])=>{o[k]=k in o?f(o[k],v):v});return o};
function mergeKid(a,b){const newer=(b.updatedAt||0)>(a.updatedAt||0)?b:a,k=Object.assign({},newer);
  k.stars=mx(a.stars,b.stars);k.words=mergeMap(a.words,b.words,mergeRec);k.lv=mergeMap(a.lv,b.lv,mergeRec);
  for(const s of ['math','sci','cn','world'])k[s]=mergeMap(a[s],b[s],mergeRec);
  k.days=mergeMap(a.days,b.days,(x,y)=>{const d=Object.assign({},x);Object.entries(y).forEach(([f,v])=>{d[f]=mx(d[f],v)});return d});
  const seen=new Set();k.sessions=[...(a.sessions||[]),...(b.sessions||[])].filter(r=>{const key=r.t+'|'+r.topic+'|'+r.mode;if(seen.has(key))return false;seen.add(key);return true}).sort((x,y)=>x.t-y.t).slice(-300);
  const tk=new Set();k.tests=[...(a.tests||[]),...(b.tests||[])].filter(t=>{const key=t.d+'|'+t.s+'|'+t.n;if(tk.has(key))return false;tk.add(key);return true}).slice(-30);
  k.adv={done:Object.assign({},(a.adv||{}).done,(b.adv||{}).done)};
  k.story={done:Object.assign({},(a.story||{}).done,(b.story||{}).done),bag:[...new Set([...((a.story||{}).bag||[]),...((b.story||{}).bag||[])])]};
  const ra=a.rpg||{},rb=b.rpg||{},mk=new Set();k.rpg={boss:mergeMap(ra.boss,rb.boss,mx),cdone:Object.assign({},ra.cdone,rb.cdone),
    made:[...(ra.made||[]),...(rb.made||[])].filter(x=>{if(mk.has(x.t))return false;mk.add(x.t);return true}).sort((x,y)=>y.t-x.t).slice(0,20)};
  k.updatedAt=mx(a.updatedAt,b.updatedAt);return k}
function mergeAll(local,remote){if(!remote||!remote.kids)return local;const kids={};
  for(const id of new Set([...Object.keys(local.kids),...Object.keys(remote.kids)]))kids[id]=local.kids[id]&&remote.kids[id]?mergeKid(local.kids[id],remote.kids[id]):(local.kids[id]||remote.kids[id]);
  const newer=(remote.updatedAt||0)>(local.updatedAt||0)?remote:local;
  const out={v:2,cur:kids[local.cur]?local.cur:Object.keys(kids)[0],kids,updatedAt:mx(local.updatedAt,remote.updatedAt)};
  if(newer.pin||local.pin)out.pin=newer.pin||local.pin;if(local.lastBackup||remote.lastBackup)out.lastBackup=mx(local.lastBackup,remote.lastBackup);
  return normalize(out)}
/* ---- syncing ---- */
function queueSync(){if(!SB||!syncReady())return;clearTimeout(sbTimer);sbTimer=setTimeout(syncNow,4000)}
async function syncNow(){if(!SB||!syncReady()||!navigator.onLine)return;if(sbBusy){sbAgain=true;return}sbBusy=true;
  try{const rows=await sbFetch('/rest/v1/momo_progress?select=data,updated_at');const remote=rows&&rows[0]&&rows[0].data?normalize(rows[0].data):null;
    const before=JSON.stringify(ALL),merged=remote?mergeAll(ALL,remote):ALL;
    if(JSON.stringify(merged)!==before){snapshot('sync');ALL=merged;S=ALL.kids[ALL.cur]||Object.values(ALL.kids)[0];saveLocal();if(!['game','duelplay','make','story'].includes(view.name))render()}
    if(!remote||JSON.stringify(normalize(remote))!==JSON.stringify(ALL))
      await sbFetch('/rest/v1/momo_progress?on_conflict=owner',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:{data:ALL,updated_at:new Date().toISOString()}});
    await dailyCloudBackup();sbState={msg:'已同步',at:Date.now(),err:''}}
  catch(e){sbState={msg:'',at:sbState.at,err:e.message||'同步失败'}}
  sbBusy=false;if(view.name==='settings')render();if(sbAgain){sbAgain=false;syncNow()}}
async function dailyCloudBackup(){const day=dk();let last='';try{last=localStorage.getItem('momo-sb-day')||''}catch(e){}if(last===day)return;
  await sbFetch('/rest/v1/momo_backups?on_conflict=owner,day',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:{day,data:ALL}});
  const old=dk(new Date(Date.now()-30*864e5));await sbFetch('/rest/v1/momo_backups?day=lt.'+old,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  try{localStorage.setItem('momo-sb-day',day)}catch(e){}}
async function cloudBackups(){return (await sbFetch('/rest/v1/momo_backups?select=id,day,created_at&order=day.desc&limit=30'))||[]}
async function cloudRestore(id){const rows=await sbFetch('/rest/v1/momo_backups?select=data,day&id=eq.'+encodeURIComponent(id));if(!rows||!rows[0])throw new Error('找不到这个备份');return {day:rows[0].day,data:normalize(rows[0].data)}}
async function cloudDeleteAll(){await sbFetch('/rest/v1/momo_backups?owner=not.is.null',{method:'DELETE',headers:{Prefer:'return=minimal'}});await sbFetch('/rest/v1/momo_progress?owner=not.is.null',{method:'DELETE',headers:{Prefer:'return=minimal'}});
  try{await sbFetch('/rest/v1/rpc/delete_my_account',{method:'POST',body:{}})}catch(e){}}
/* ---- local snapshots for offline recovery ---- */
function snaps(){try{const a=JSON.parse(localStorage.getItem(SNAP_KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.day==='string'&&x.data):[]}catch(e){return []}}
function snapshot(why){try{const day=dk(),list=snaps().filter(x=>!(x.day===day&&x.why===why));list.unshift({day,why,t:Date.now(),data:ALL});
  for(let n=Math.min(list.length,8);n>0;n--){try{localStorage.setItem(SNAP_KEY,JSON.stringify(list.slice(0,n)));return}catch(e){}}}catch(e){}}
function dailySnapshot(){if(!S||!S.name)return;if(!snaps().some(x=>x.day===dk()&&x.why==='daily'))snapshot('daily')}
const SNAPWHY={daily:'每天自动',sync:'云端合并之前',restore:'恢复之前',import:'导入之前'};
function syncPanel(){const ready=syncReady(),sb=view.sb||{};
  if(!ready)return `<div class="panel"><h2>☁️ 云端同步</h2><p class="zh" style="margin:0">还没有设定云端（Supabase）。设定以后，iPad、手机和电脑可以同步学习记录，每天还会自动在云端备份。设定方法见 supabase/SETUP.md。</p></div>`;
  const status=SB?(sbState.err?'⚠️ '+esc(sbState.err):sbState.at?'✅ '+sbState.msg+' · '+new Date(sbState.at).toLocaleTimeString().slice(0,5):'⏳ 准备同步……'):'';
  return `<div class="panel"><h2>☁️ 云端同步</h2>
   <p class="zh" style="margin:0 0 10px">用家长的电邮登入以后，这台设备的学习记录会和其他登入同一个电邮的设备同步；没有网络时照常学习，连上网再同步。云端只保存孩子的昵称、头像和学习记录，不保存录音、照片或其他个人资料。</p>
   ${SB?`<p style="margin:0 0 8px">已登入：<b>${esc(SB.email||'家长')}</b>　${status}</p>
     <div class="row"><button class="btn mint" data-act="sbsync">🔄 现在同步</button><button class="btn" data-act="sbbackups">🗂️ 云端备份</button><button class="btn" data-act="sbout">登出</button><button class="btn pink" data-act="sbdel">删除云端资料</button></div>
     ${sb.list?`<div style="margin-top:10px">${sb.list.length?sb.list.map(b=>`<div class="tuline"><span>☁️</span><div class="tn">${esc(b.day)}</div><button class="btn" data-act="sbrestore" data-v="${esc(String(b.id))}">恢复到这一天</button></div>`).join(''):'<p class="zh" style="margin:0">还没有云端备份（每天第一次同步时会自动备份）。</p>'}</div>`:''}`
   :sb.step==='code'?`<p style="margin:0 0 8px">登入码已经寄到 <b>${esc(sb.email||'')}</b>，请输入邮件里的 6 位数字（或者直接按邮件里的链接）。</p>
     <div class="row"><input id="sbcode" inputmode="numeric" maxlength="10" placeholder="123456" style="width:140px" aria-label="登入码"><button class="btn sun" data-act="sbverify">登入</button><button class="btn" data-act="sbback">换电邮</button></div>`
   :`<div class="row"><input id="sbmail" type="email" maxlength="120" placeholder="家长的电邮" value="${esc(sb.email||'')}" style="min-width:220px" aria-label="家长的电邮"><button class="btn sun" data-act="sbsend">寄登入码</button></div>`}
   ${sb.msg?`<p class="zh" style="margin:8px 0 0">${esc(sb.msg)}</p>`:''}</div>`}
function snapPanel(){const list=snaps();if(!list.length)return '';
  return `<div style="margin-top:12px"><b>🕒 自动快照</b><div class="zh" style="font-size:14px">这台设备每天自动保存一份（最近 7 份），资料不对时可以回到那时候。</div>
   ${list.map((x,i)=>`<div class="tuline"><span>📸</span><div class="tn">${esc(x.day)} <small class="zh">${SNAPWHY[x.why]||''}</small></div><button class="btn" data-act="snapuse" data-v="${i}">恢复</button></div>`).join('')}</div>`}
function applyRestore(data,label){if(!confirm('要用「'+label+'」的资料取代这台设备上现在的全部资料吗？\n（现在的资料会先存成一份快照）'))return;
  snapshot('restore');ALL=data;S=ALL.kids[ALL.cur];G=null;ALL.updatedAt=S.updatedAt=Date.now();saveLocal();
  if(SB&&syncReady())sbFetch('/rest/v1/momo_progress?on_conflict=owner',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:{data:ALL,updated_at:new Date().toISOString()}}).catch(()=>{});
  sGood();toast('已恢复 ✓');go({name:S.name?'home':'setup'})}
function initSync(){dailySnapshot();if(!syncReady())return;sbLoad();
  // magic link: Supabase sends the tokens back in the address hash
  const h=new URLSearchParams(location.hash.slice(1));if(h.get('access_token')&&h.get('refresh_token')){try{sbTake({access_token:h.get('access_token'),refresh_token:h.get('refresh_token'),expires_in:h.get('expires_in')})}catch(e){}history.replaceState(null,'',location.pathname+location.search)}
  if(SB){syncNow();setInterval(()=>{if(!document.hidden)syncNow()},5*60e3)}
  addEventListener('online',()=>syncNow());document.addEventListener('visibilitychange',()=>{if(document.hidden&&SB)syncNow()})}
