/* ---------------- helpers ---------------- */
const app=document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const T=id=>TOPICS.find(t=>t.id===id);
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function burst(el,ch){if(!el)return;const r=el.getBoundingClientRect?el.getBoundingClientRect():el;for(let i=0;i<7;i++){const s=document.createElement('span');s.className='pop';s.textContent=ch||pick(['⭐','🌟','✨','💖']);
  s.style.left=(r.left+r.width/2-17+(Math.random()*40-20))+'px';s.style.top=(r.top+r.height/2-17)+'px';s.style.setProperty('--dx',(Math.random()*200-100)+'px');s.style.animationDelay=(i*0.05)+'s';
  document.body.appendChild(s);setTimeout(()=>s.remove(),1400)}}
function panda(size,mood){
  const mouth=mood==='oops'?'<path d="M44 67 Q50 62 56 67" stroke="#2A2F6B" stroke-width="3" fill="none" stroke-linecap="round"/>':'<path d="M42 63 Q50 72 58 63" stroke="#2A2F6B" stroke-width="3" fill="#FF8FB1" stroke-linecap="round"/>';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="flex:none">
  <circle cx="22" cy="24" r="14" fill="#2A2F6B"/><circle cx="78" cy="24" r="14" fill="#2A2F6B"/>
  <circle cx="50" cy="55" r="38" fill="#fff" stroke="#2A2F6B" stroke-width="3"/>
  <ellipse cx="35" cy="49" rx="10" ry="12" fill="#2A2F6B" transform="rotate(-20 35 49)"/><ellipse cx="65" cy="49" rx="10" ry="12" fill="#2A2F6B" transform="rotate(20 65 49)"/>
  <circle cx="37" cy="48" r="4" fill="#fff"/><circle cx="63" cy="48" r="4" fill="#fff"/>
  <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#2A2F6B"/>
  <circle cx="27" cy="65" r="6" fill="#FF8FB1" opacity=".75"/><circle cx="73" cy="65" r="6" fill="#FF8FB1" opacity=".75"/>${mouth}</svg>`}
const L=()=>S.lang, other=()=>S.lang==='en'?'ms':'en';
function zh(t){return S.showZh?`<div class="helpzh">${esc(t)}</div>`:''}
