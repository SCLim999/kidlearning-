/* ---------- 家长密码 parent PIN ----------
   Entering settings unlocks for 10 minutes, but changing or removing the PIN always asks for the current PIN again.
   Wrong PINs: after 3 in a row the PIN is locked for 5 minutes (stored per device in localStorage momo-pinlock).
   Forgotten PIN: a code sent to the parent's 云端同步 email (when signed in), or the 8-character recovery code shown when the PIN was set (stored hashed in ALL.pinRec);
   an old PIN without a recovery code falls back to a two-digit × two-digit sum and gets a code the next time the PIN is entered. */
let pinUntil=0;
const RECCH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function pinLock(){try{const o=JSON.parse(localStorage.getItem('momo-pinlock')||'{}');return {n:+o.n||0,until:+o.until||0}}catch(e){return {n:0,until:0}}}
function pinLockSave(o){try{localStorage.setItem('momo-pinlock',JSON.stringify(o))}catch(e){}}
function pinLocked(){const l=pinLock(),left=l.until-Date.now();if(left>0){sBad();toast('密码输错太多次，请 '+Math.ceil(left/60e3)+' 分钟后再试 🔒');return true}return false}
function pinWrong(){const l=pinLock();l.n++;if(l.n>=3){l.n=0;l.until=Date.now()+5*60e3}pinLockSave(l);return l.until>Date.now()}
function pinRight(){pinLockSave({n:0,until:0})}
function newRecCode(){const u=new Uint8Array(8);crypto.getRandomValues(u);const c=[...u].map(x=>RECCH[x%RECCH.length]).join('');ALL.pinRec=pinHash(c);
  alert('请把这个「恢复码」写下来，收在孩子拿不到的地方：\n\n      '+c.slice(0,4)+'-'+c.slice(4)+'\n\n忘记家长密码时，可以用它重新设定密码（登入了云端同步的话，也可以用电邮验证码）。这个码只显示这一次。')}
function recOk(a){return hashOk(ALL.pinRec,String(a||'').toUpperCase().replace(/[^A-Z0-9]/g,''))}
// forgotten PIN → recovery code (or, for an old PIN without one, a hard sum) → must set a new PIN at once
function pinForgot(cb){
  const em=pinMail();if(em&&confirm('忘记家长密码？\n\n按「确定」：寄验证码到家长电邮 '+em+'\n按「取消」：用恢复码'))return pinByMail(em,cb);
  if(ALL.pinRec){const a=prompt('请输入设定密码时记下的 8 个字「恢复码」：');if(a===null)return;
    if(!recOk(a)){pinWrong();sBad();toast('恢复码不对 🔒');return}}
  else{const x=rnd(23,89),y=rnd(13,89),a=prompt('忘记家长密码？请算：'+x+' × '+y+' = ?');if(a===null)return;if(+a!==x*y){pinWrong();sBad();toast('答案不对 🔒');return}}
  pinReset(cb)}
function pinReset(cb){pinRight();const old=ALL.pin;toast('请设定新的家长密码');setPin();if(ALL.pin!==old&&cb)cb()}
// reset by email: the parent's ☁️ 云端同步 login gets a Supabase sign-in code; only someone who can read that inbox can reset the PIN
function pinMail(){return typeof syncReady==='function'&&syncReady()&&SB&&SB.email&&navigator.onLine!==false?SB.email:''}
async function pinByMail(em,cb){
  try{await sbSendCode(em)}catch(e){sBad();toast('寄不出去：'+e.message);return}
  const a=prompt('验证码已经寄到 '+em+'。\n请输入邮件里的 6 位数字；如果邮件里只有链接，不要按它，长按 →「拷贝链接」再贴到这里：');if(a===null)return;
  const raw=a.trim(),link=/^https:\/\//i.test(raw);
  if(!link&&!/^\d{6,10}$/.test(raw.replace(/\s/g,''))){pinWrong();sBad();toast('验证码不对 🔒');return}
  const prev=SB;
  try{if(link)await sbVerifyLink(raw);else await sbVerify(em,raw.replace(/\s/g,''))}catch(e){pinWrong();sBad();toast('验证码不对或已过期 🔒');return}
  if(!SB||String(SB.email).toLowerCase()!==em.toLowerCase()){SB=prev;sbSave();pinWrong();sBad();toast('这不是家长电邮的验证码 🔒');return}
  pinReset(cb)}
function askPin(msg,cb){if(pinLocked())return;const a=prompt(msg);if(a===null)return;
  if(pinOk(a.trim())){pinRight();if(!ALL.pinRec){newRecCode();touch()}return cb()}
  if(pinWrong()){sBad();toast('密码输错太多次，请 5 分钟后再试 🔒');return}
  if(confirm('密码不对。忘记密码了吗？\n\n按「确定」用恢复码重新设定，按「取消」再试一次。'))pinForgot(cb);else sBad()}
function needPin(cb){if(!ALL.pin||Date.now()<pinUntil)return cb();askPin('请输入家长密码（4 位数字）',()=>{pinUntil=Date.now()+10*60e3;cb()})}
// changing or removing the PIN always needs the current PIN, even while settings are unlocked
function pinCheckNow(what,cb){if(!ALL.pin)return cb();askPin(what+'：请先输入现在的家长密码',cb)}
function changePin(){pinCheckNow('更改家长密码',()=>setPin(true))}
const PIN_EASY=/^(\d)\1{3}$|^(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)$/;
function setPin(keepRec){const a=prompt('设定家长密码：请输入 4 位数字（不要用 1234、0000 这类容易猜的）');if(a===null)return;const p=a.trim();if(!/^\d{4}$/.test(p)){toast('要 4 位数字哦');return}
  if(PIN_EASY.test(p)){toast('这个密码太容易猜了，换一个吧');return}
  const b2=prompt('再输入一次确认');if(b2===null)return;if(b2.trim()!==p){toast('两次不一样，请再试一次');return}
  ALL.pin=pinHash(p);if(!keepRec||!ALL.pinRec)newRecCode();pinUntil=Date.now()+10*60e3;touch();toast('已设定家长密码 🔒');render()}
// restoring a backup or snapshot never changes this device's PIN (a backup may be older or have none)
function keepPin(data){if(ALL.pin){data.pin=ALL.pin;if(ALL.pinRec)data.pinRec=ALL.pinRec;else delete data.pinRec}}
