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
/* Momo. mood: happy (default) · oops · think (question open) · teach (hint) · cheer (after a wrong pick)
   · party (celebrating) · rest (rest screen). One drawing; moods only change the eyes, mouth and small marks. */
function panda(size,mood){const K='#2A2F6B',W='#fff';
  const eyes=mood==='party'?`<path d="M30 51 Q37 43 44 51 M56 51 Q63 43 70 51" stroke="${W}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    :mood==='rest'?`<path d="M30 48 Q37 54 44 48 M56 48 Q63 54 70 48" stroke="${W}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    :mood==='think'?`<circle cx="39" cy="45" r="4" fill="${W}"/><circle cx="65" cy="45" r="4" fill="${W}"/>`
    :`<circle cx="37" cy="48" r="4" fill="${W}"/><circle cx="63" cy="48" r="4" fill="${W}"/>`;
  const mouth=mood==='oops'?`<path d="M44 67 Q50 62 56 67" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    :mood==='think'?`<path d="M45 66 Q50 64 55 66" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    :mood==='rest'?`<ellipse cx="50" cy="66" rx="3" ry="2.5" fill="${K}"/>`
    :mood==='party'?`<path d="M40 62 Q50 78 60 62 Z" fill="#FF8FB1" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`
    :`<path d="M42 63 Q50 72 58 63" stroke="${K}" stroke-width="3" fill="#FF8FB1" stroke-linecap="round"/>`;
  const extra=mood==='teach'?`<g stroke="#E9A23B" stroke-width="3" fill="none"><circle cx="35" cy="49" r="12"/><circle cx="65" cy="49" r="12"/><path d="M47 48 Q50 45 53 48"/></g>`
    :mood==='cheer'?`<path d="M27 33 Q35 28 43 32 M57 32 Q65 28 73 33" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    :mood==='think'?`<path d="M28 34 Q35 31 42 34 M58 32 Q65 28 72 31" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    :mood==='rest'?`<text x="80" y="16" font-size="16" font-weight="800" fill="#58B4F0" font-family="sans-serif">z</text><text x="90" y="8" font-size="11" font-weight="800" fill="#58B4F0" font-family="sans-serif">z</text>`:'';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="flex:none;overflow:visible">
  <circle cx="22" cy="24" r="14" fill="${K}"/><circle cx="78" cy="24" r="14" fill="${K}"/>
  <circle cx="50" cy="55" r="38" fill="${W}" stroke="${K}" stroke-width="3"/>
  <ellipse cx="35" cy="49" rx="10" ry="12" fill="${K}" transform="rotate(-20 35 49)"/><ellipse cx="65" cy="49" rx="10" ry="12" fill="${K}" transform="rotate(20 65 49)"/>
  ${eyes}<ellipse cx="50" cy="58" rx="5" ry="3.5" fill="${K}"/>
  <circle cx="27" cy="65" r="6" fill="#FF8FB1" opacity=".75"/><circle cx="73" cy="65" r="6" fill="#FF8FB1" opacity=".75"/>${mouth}${extra}</svg>`}
const L=()=>S.lang, other=()=>S.lang==='en'?'ms':'en';
function zh(t){return S.showZh?`<div class="helpzh">${esc(t)}</div>`:''}

const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const sumOf=a=>a.reduce((x,y)=>x+y,0);
