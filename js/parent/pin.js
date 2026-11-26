/* ---------- 家长密码 parent PIN ---------- */
let pinUntil=0;
function needPin(cb){if(!ALL.pin||Date.now()<pinUntil)return cb();const a=prompt('请输入家长密码（4 位数字）');if(a===null)return;
  if(pinOk(a.trim())){pinUntil=Date.now()+10*60e3;return cb()}
  const x=rnd(12,29),y=rnd(3,9),b2=prompt('密码不对。忘记密码的话，请算：'+x+' × '+y+' = ?');if(b2!==null&&+b2===x*y){pinUntil=Date.now()+10*60e3;cb()}else{sBad();toast('密码不对哦 🔒')}}
function setPin(){const a=prompt('设定家长密码：请输入 4 位数字');if(a===null)return;if(!/^\d{4}$/.test(a.trim())){toast('要 4 位数字哦');return}
  const b2=prompt('再输入一次确认');if(b2===null)return;if(b2.trim()!==a.trim()){toast('两次不一样，请再试一次');return}ALL.pin=pinHash(a.trim());pinUntil=Date.now()+10*60e3;touch();toast('已设定家长密码 🔒');render()}
