/* ---------------- sound ---------------- */
let voices=[];
function loadVoices(){try{voices=speechSynthesis.getVoices()}catch(e){}}
let VP={en:'',ms:'',zh:'',rate:1};try{Object.assign(VP,JSON.parse(localStorage.getItem('momo-voice')||'{}'))}catch(e){}
function saveVP(){try{localStorage.setItem('momo-voice',JSON.stringify(VP))}catch(e){}}
const PREF={en:['en-gb','en-us','en'],ms:['ms-my','ms','id-id','id'],zh:['zh-cn','zh-sg','zh-my','zh-tw','zh']};
const vlang=v=>v.lang.replace('_','-').toLowerCase();
function voicesFor(l){const pf=l==='ms'?['ms','id']:[l];return voices.filter(v=>pf.some(p=>vlang(v).startsWith(p)))}
function pickVoice(l){if(VP[l]){const v=voices.find(x=>x.voiceURI===VP[l]);if(v)return v}for(const p of PREF[l]){const v=voices.find(x=>vlang(x).startsWith(p));if(v)return v}return null}
function hasMalay(){return voices.some(v=>vlang(v).startsWith('ms'))}
if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=()=>{loadVoices();if(typeof view!=='undefined'&&view.name==='settings')render()}}
function speak(text,lang,queue){
  if(!('speechSynthesis' in window))return;
  try{if(!queue)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);
    const v=pickVoice(lang);
    if(v){u.voice=v;u.lang=v.lang}else u.lang=PREF[lang][0];
    u.rate=(lang==='zh'?0.9:0.78)*VP.rate;u.pitch=1.1;speechSynthesis.speak(u)}catch(e){}
}
let actx;
function tone(fs,dur,type){if(!S.sound)return;try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;
  fs.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type=type||'sine';o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t+i*dur);g.gain.exponentialRampToValueAtTime(0.22,t+i*dur+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+i*dur+dur);
  o.connect(g).connect(actx.destination);o.start(t+i*dur);o.stop(t+i*dur+dur+0.03)})}catch(e){}}
const sGood=()=>tone([660,880,1320],0.11),sBad=()=>tone([320,220],0.16,'triangle'),sTap=()=>tone([520],0.06);

/* ---------------- recording (跟读) ---------------- */
let rec=null,recChunks=[],recUrl=null,recState='idle',recTimer=null;
function resetRec(){if(rec&&rec.state==='recording'){try{rec.stop()}catch(e){}}clearTimeout(recTimer);if(recUrl)URL.revokeObjectURL(recUrl);recUrl=null;recState='idle'}
async function toggleRec(){
  if(recState==='rec'){stopRec();return}
  try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder)throw new Error('no');
    try{speechSynthesis.cancel()}catch(e){}
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    recChunks=[];rec=new MediaRecorder(stream);
    rec.ondataavailable=e=>{if(e.data&&e.data.size)recChunks.push(e.data)};
    rec.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(recChunks,{type:rec.mimeType||'audio/mp4'});
      if(recUrl)URL.revokeObjectURL(recUrl);recUrl=URL.createObjectURL(blob);recState='done';const d=dayRec();d.rec=(d.rec||0)+1;touch();
      if(view.name==='game')render();playMine()};
    rec.start();recState='rec';render();recTimer=setTimeout(stopRec,4000);
  }catch(e){recState='idle';render();toast('这台设备暂时不能录音，请允许使用麦克风 🎤')}
}
function stopRec(){clearTimeout(recTimer);if(rec&&rec.state==='recording')rec.stop()}
function playMine(){if(!recUrl)return;try{new Audio(recUrl).play().catch(()=>{})}catch(e){}}
