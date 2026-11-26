/* ---------------- state ---------------- */
const KEY='momo-learn.v1';
function blank(){return{v:1,name:'',avatar:'🐼',lang:'en',showZh:true,sound:true,goal:10,stars:0,days:{},words:{},sessions:[],math:{},sci:{},cn:{},world:{},subj:'lang',bamboo:0,bambooInit:1,adv:{done:{}},missions:{date:'',done:[]},limit:0,custom:[],autoLook:true,mist:{w:{},m:{}},tests:[],letterWk:'',pet:{owned:[],wear:{},bg:'sky',fed:0,happy:60},skin:'toy',story:{done:{},bag:[]},lv:{},rpg:{boss:{},made:[],cdone:{}},updatedAt:0}}
/* Saves can come from a backup file someone else made, so every field is checked and coerced here:
   numbers become numbers, ids/dates must match a pattern, text is length-limited (and still escaped when shown). */
const num=(v,d)=>{v=+v;return Number.isFinite(v)?v:(d||0)},str=(v,n)=>typeof v==='string'?v.slice(0,n):'';
const DATE_RE=/^\d{4}-\d{2}-\d{2}$/,ID_RE=/^[A-Za-z0-9_-]{1,40}$/;
const WKEY_RE=/^(en|ms):[A-Za-z0-9_-]{1,44}:[^<>"'&`]{1,60}$/;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
function cleanMap(o,fn,keyRe){const out={};Object.keys(obj(o)).slice(0,5000).forEach(k=>{if(keyRe&&!keyRe.test(k))return;const v=fn(o[k]);if(v!==undefined)out[k]=v});return out}
const cw=v=>{v=obj(v);const r={c:num(v.c),w:num(v.w)};if(DATE_RE.test(v.m))r.m=v.m;if(DATE_RE.test(v.due))r.due=v.due;if(v.iv!=null)r.iv=num(v.iv,1);if(v.ro!=null)r.ro=num(v.ro);if(v.rm!=null)r.rm=num(v.rm);return r};
const safeEmoji=e=>{e=str(e,12);return /[<>&"'`=\\/A-Za-z0-9]/.test(e)?'':e};
/* 家长密码 is stored only as a salted, repeated SHA-256 ("h1:salt:hash"), never as the 4 digits themselves.
   Old saves and backups that still hold the plain digits are converted in normalize(). */
const PINH_RE=/^h1:[0-9a-f]{16}:[0-9a-f]{64}$/;
function sha256hex(str){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes=[...new TextEncoder().encode(str)],l=bytes.length*8;bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);for(let i=7;i>=0;i--)bytes.push(i>3?0:(l>>>(i*8))&255);
  const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],W=new Array(64),r=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let o=0;o<bytes.length;o+=64){for(let i=0;i<16;i++)W[i]=(bytes[o+i*4]<<24)|(bytes[o+i*4+1]<<16)|(bytes[o+i*4+2]<<8)|bytes[o+i*4+3];
    for(let i=16;i<64;i++){const s0=r(W[i-15],7)^r(W[i-15],18)^(W[i-15]>>>3),s1=r(W[i-2],17)^r(W[i-2],19)^(W[i-2]>>>10);W[i]=(W[i-16]+s0+W[i-7]+s1)|0}
    let [a,b,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){const t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+W[i])|0,t2=((r(a,2)^r(a,13)^r(a,22))+((a&b)^(a&c)^(b&c)))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0}
  return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('')}
function pinHash(pin,salt){if(!salt){const u=new Uint8Array(8);crypto.getRandomValues(u);salt=[...u].map(x=>x.toString(16).padStart(2,'0')).join('')}
  let h=salt+':'+pin;for(let i=0;i<500;i++)h=sha256hex(salt+h);return 'h1:'+salt+':'+h}
function pinOk(pin){const m=PINH_RE.test(ALL.pin||'')&&ALL.pin.split(':');return !!m&&pinHash(pin,m[1])===ALL.pin}
function fixKid(k){const b=blank();
  k.name=str(k.name,16);k.avatar=AVAS.includes(k.avatar)?k.avatar:'🐼';k.lang=k.lang==='ms'?'ms':'en';k.subj=['lang','math','sci','cn','world'].includes(k.subj)?k.subj:'lang';
  k.showZh=k.showZh!==false;k.autoLook=k.autoLook!==false;k.sound=k.sound!==false;k.goal=[5,10,15,20].includes(+k.goal)?+k.goal:10;k.limit=[0,15,20,30].includes(+k.limit)?+k.limit:0;
  k.stars=Math.max(0,num(k.stars));k.bamboo=Math.max(0,num(k.bamboo));k.updatedAt=num(k.updatedAt);k.skin=str(k.skin,20);k.letterWk=DATE_RE.test(k.letterWk)?k.letterWk:'';
  k.days=cleanMap(k.days,d=>{d=obj(d);const r={};['stars','correct','wrong','mins','secs','rec','mc','sc','cc','wc','extra','say','mh'].forEach(f=>{if(d[f]!=null)r[f]=num(d[f])});r.stars=r.stars||0;r.correct=r.correct||0;r.wrong=r.wrong||0;r.mins=r.mins||0;return r},DATE_RE);
  k.words=cleanMap(k.words,cw,WKEY_RE);k.lv=cleanMap(k.lv,cw,/^[A-Za-z0-9_]{1,30}:[123]$/);['math','sci','cn','world'].forEach(f=>{k[f]=cleanMap(k[f],cw,ID_RE)});
  k.sessions=(Array.isArray(k.sessions)?k.sessions:[]).filter(x=>x&&typeof x==='object').slice(-300).map(x=>{const r={t:num(x.t),topic:str(x.topic,60),mode:str(x.mode,20),lang:str(x.lang,4),score:x.score==null?null:num(x.score),total:num(x.total)};if(x.sec!=null)r.sec=num(x.sec);return r});
  k.tests=(Array.isArray(k.tests)?k.tests:[]).filter(x=>x&&DATE_RE.test(x.d)).slice(-30).map(x=>({d:x.d,s:num(x.s),n:num(x.n,10)}));
  const m=obj(k.mist);k.mist={w:cleanMap(m.w,v=>num(v),WKEY_RE),m:cleanMap(m.m,v=>num(v),/^[A-Za-z0-9_]{1,30}:[123]$/)};
  k.adv={done:cleanMap(obj(k.adv).done,v=>v?true:undefined,/^\d{1,3}$/)};
  const rp=obj(k.rpg);k.rpg={boss:cleanMap(rp.boss,v=>Math.max(0,Math.min(20,num(v))),/^(en|ms|math|sci|cn):\d{1,2}$/),cdone:cleanMap(rp.cdone,v=>v?1:undefined,/^(house|zoo|plant|kampung|card)$/),
    made:(Array.isArray(rp.made)?rp.made:[]).filter(x=>x&&/^(house|zoo|plant|kampung|card)$/.test(x.k)).slice(0,20).map(x=>({k:x.k,t:num(x.t),txt:str(x.txt,400),art:str(x.art,200)}))};
  const sy=obj(k.story);k.story={done:cleanMap(sy.done,v=>v?1:undefined,/^c[1-9]$/),bag:[...new Set((Array.isArray(sy.bag)?sy.bag:[]).filter(x=>typeof x==='string'&&/^[a-z]{2,12}$/.test(x)))].slice(0,30)};
  const ms=obj(k.missions);k.missions={date:DATE_RE.test(ms.date)?ms.date:'',done:(Array.isArray(ms.done)?ms.done:[]).map(Number).filter(Number.isInteger).slice(0,10)};
  const pt=obj(k.pet),pid=v=>/^[a-z-]{1,20}$/.test(v)?v:null;k.pet={owned:(Array.isArray(pt.owned)?pt.owned:[]).map(pid).filter(Boolean),wear:cleanMap(pt.wear,v=>pid(v),/^[a-z]{1,10}$/),bg:pid(pt.bg)||'sky',fed:num(pt.fed),happy:num(pt.happy,60)};
  k.custom=(Array.isArray(k.custom)?k.custom:[]).filter(c=>c&&ID_RE.test(c.id)&&(c.lang==='en'||c.lang==='ms')&&Array.isArray(c.words)).slice(0,CL_MAX_LISTS)
    .map(c=>({id:c.id,name:str(c.name,20)||'学校词表',lang:c.lang,words:c.words.filter(a=>a&&typeof a.w==='string'&&a.w.trim()).slice(0,CL_MAX_WORDS).map(a=>({w:a.w.trim().slice(0,30),zh:str(a.zh,12),e:safeEmoji(a.e)}))})).filter(c=>c.words.length);
  Object.keys(k).forEach(f=>{if(!(f in b)&&f!=='settings')delete k[f]});return k}
function normalize(o){
  if(o&&o.kids&&typeof o.kids==='object'){const kids={};Object.keys(o.kids).slice(0,20).forEach((key,i)=>{const raw=o.kids[key];if(!raw||typeof raw!=='object'||Array.isArray(raw))return;
      const k=fixKid(Object.assign(blank(),raw));if(!raw.bambooInit)k.bamboo=Math.max(0,num(raw.stars));kids[ID_RE.test(key)?key:'k'+(i+1)]=k});
    if(!Object.keys(kids).length)kids.k1=blank();const out={v:2,cur:kids[o.cur]?o.cur:Object.keys(kids)[0],kids,updatedAt:num(o.updatedAt)};
    if(typeof o.pin==='string'&&PINH_RE.test(o.pin))out.pin=o.pin;else if(typeof o.pin==='string'&&/^\d{4}$/.test(o.pin))out.pin=pinHash(o.pin);if(o.lastBackup)out.lastBackup=num(o.lastBackup);return out}
  const raw=o&&typeof o==='object'?o:{};const k=fixKid(Object.assign(blank(),raw));if(!raw.bambooInit)k.bamboo=Math.max(0,num(raw.stars));return {v:2,cur:'k1',kids:{k1:k},updatedAt:k.updatedAt||0}}
function load(){try{const r=localStorage.getItem(KEY);if(r)return normalize(JSON.parse(r))}catch(e){}return normalize(null)}
let ALL=load();let S=ALL.kids[ALL.cur];
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(ALL))}catch(e){}}
// an old save still holding the plain 4-digit PIN: write the hashed version back straight away
try{if(/"pin":"\d{4}"/.test(localStorage.getItem(KEY)||''))saveLocal()}catch(e){}
function touch(){S.updatedAt=ALL.updatedAt=Date.now();saveLocal();queueCloud()}
function dk(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dayRec(){const k=dk();return S.days[k]||(S.days[k]={stars:0,correct:0,wrong:0,mins:0})}
function addStars(n){S.stars+=n;S.bamboo=(S.bamboo||0)+n;dayRec().stars+=n}
function wkey(lang,w){return lang+':'+w.t+':'+(w.k||w.en)}
function wstat(lang,w){return S.words[wkey(lang,w)]||{c:0,w:0}}
function dPlus(n){const d=new Date();d.setDate(d.getDate()+n);return dk(d)}
const IVS=[1,3,7,14,30];
/* spaced review: a mastered word comes back after 1, 3, 7, 14, 30 days; a miss sends it back to 1 day */
function recordWord(w,ok,lang){const k=wkey(lang||(G?G.lang:S.lang),w);const r=S.words[k]||(S.words[k]={c:0,w:0});const d=dayRec();if(r.c>=MASTER){ok?r.ro=(r.ro||0)+1:r.rm=(r.rm||0)+1}
  if(ok){r.c++;if(r.c===MASTER){r.m=dk();r.iv=1;r.due=dPlus(1)}else if(r.c>MASTER&&(!r.due||r.due<=dk())){r.iv=IVS[Math.min(IVS.indexOf(r.iv||1)+1,IVS.length-1)];r.due=dPlus(r.iv)}d.correct++;addStars(1)}
  else{r.w++;d.wrong++;if(r.c>=MASTER){r.iv=1;r.due=dPlus(1)}}touch()}
function streak(){let n=0;const d=new Date();if(!((S.days[dk(d)]||{}).stars>0))d.setDate(d.getDate()-1);while((S.days[dk(d)]||{}).stars>0){n++;d.setDate(d.getDate()-1)}return n}
function mastered(lang,topic){let n=0;(topic?TOPICS:BASE).forEach(t=>{if(topic&&t.id!==topic)return;t.words.forEach(w=>{if(wstat(lang,w).c>=MASTER)n++})});return n}
function accuracy(){let c=0,w=0;Object.values(S.days).forEach(d=>{c+=d.correct;w+=d.wrong});return c+w?Math.round(c*100/(c+w)):null}
