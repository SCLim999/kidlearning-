/* ---------------- 🌍 环游世界: games (the copied world-explorer data and the flag poster are in data/world.js) ---------------- */
const WC=WX.COUNTRIES,WCONT=Object.fromEntries(WX.CONTINENTS.filter(c=>c.id!=='all').map(c=>[c.id,c.zh]));
const wById=id=>WC.find(c=>c.id===id),wPool=L=>L===1?WC.filter(c=>c.c==='as'):WC;
const wFlag=(c,cls)=>WX.flagSVG(c.id,cls||'wflag');
const wOpt=c=>({v:c.id,l:`<span class="wfo">${wFlag(c,'wflag sm')}</span><small>${esc(c.zh)}</small>`});
function wOpts(ans,pool,key){const seen=new Set([key?key(ans):ans.id]);const o=[ans];for(const c of shuffle(pool.length>=4?pool:WC)){const k=key?key(c):c.id;if(o.length<4&&!seen.has(k)){seen.add(k);o.push(c)}}return shuffle(o)}
const latin=t=>/^[\u0000-\u024F\s'/.-]+$/.test(t||'');
const hiShow=c=>latin(c.hi)?c.hi.split(' / ')[0]:latin(c.hiR)?c.hiR:c.hiR;
const HI_UNIQ=WC.filter(c=>c.hi&&WC.filter(x=>x.hi&&hiShow(x).toLowerCase()===hiShow(c).toLowerCase()).length===1);
const wFact=c=>c.f&&c.f[0]?c.f[0][0]+' '+c.f[0][1]:'';
const WF=[];Object.entries(WF_RAW).forEach(([c,str])=>str.split(/ (?=[a-z]{2}:)/).forEach(x=>{const [id,zh,...en]=x.split(':');WF.push({id,zh,en:en.join(':'),c})}));
const flagEmoji=id=>String.fromCodePoint(...id.toUpperCase().split('').map(ch=>0x1F1E6+ch.charCodeAt(0)-65));
let FLAGOK=null;function flagEmojiOK(){if(FLAGOK!==null)return FLAGOK;try{const c=document.createElement('canvas').getContext('2d');c.font='32px sans-serif';const a=c.measureText(flagEmoji('my')).width,b=c.measureText(String.fromCodePoint(0x1F1F2)).width;FLAGOK=a<b*1.6}catch(e){FLAGOK=false}return FLAGOK}
function wfOpts(f,pool){const bad=new Set([f.id]);WF_SAME.forEach(g=>{if(g.includes(f.id))g.forEach(x=>bad.add(x))});const o=[f];for(const x of shuffle(pool)){if(o.length>=4)break;if(bad.has(x.id))continue;o.push(x);WF_SAME.forEach(g=>{if(g.includes(x.id))g.forEach(y=>bad.add(y))});bad.add(x.id)}return shuffle(o)}
const WG={
 wflag:{zh:'国旗',e:'🚩',hue:'#FFD6D6',d:'这是哪一国的国旗？',l1:'亚洲 15 国',l2:'全世界 52 国',how:'看国旗的颜色和图案，选出是哪一个国家。按「💡 提示」会告诉你这个国家在哪一洲，还有一个小知识。',
  gen:L=>{const c=pick(wPool(L));return{title:'这是哪一个国家的国旗？',say:'这是哪一个国家的国旗？',html:h=>`<div class="wbig">${wFlag(c)}</div>`+(h?`<div class="hintbox">💡 它在${WCONT[c.c]}。${esc(wFact(c))}</div>`:''),big:true,ans:c.id,
   opts:wOpts(c,wPool(L)).map(x=>({v:x.id,l:`<span style="font-size:30px">${esc(x.zh)}</span><small>${esc(x.en)}</small>`})),explain:`这是 <b>${esc(c.zh)}</b>（${esc(c.en)}）的国旗。${esc(wFact(c))}`,sayAns:`这是${c.zh}的国旗`}}},
 wcap:{zh:'首都',e:'🏛️',hue:'#E3D4FF',d:'国家的首都在哪里？',l1:'亚洲 15 国',l2:'全世界 52 国',how:'每个国家都有一个首都，通常是国家最重要的城市。马来西亚的首都是吉隆坡。',
  gen:L=>{const c=pick(wPool(L));return{title:`${esc(c.zh)}的首都是哪里？`,say:`${c.zh}的首都是哪里？`,html:h=>`<div class="wbig">${wFlag(c)}</div>`+(h?`<div class="hintbox">💡 英文叫 ${esc(c.capEn)}，第一个字是「${esc(c.capZh[0])}」</div>`:''),big:true,ans:c.capZh,
   opts:wOpts(c,wPool(L),x=>x.capZh).map(x=>({v:x.capZh,l:`<span style="font-size:28px">${esc(x.capZh)}</span><small>${esc(x.capEn)}</small>`})),explain:`${esc(c.zh)}的首都是 <b>${esc(c.capZh)}</b>（${esc(c.capEn)}）。`,sayAns:`${c.zh}的首都是${c.capZh}`}}},
 wanimal:{zh:'动物找家',e:'🐾',hue:'#C9E89A',d:'这只动物住在哪一国？',l1:'有名的动物',l2:'每个国家的代表动物',how:'很多国家都有一种代表它的动物，像澳大利亚的袋鼠、中国的大熊猫、马来西亚的红毛猩猩。',
  gen:L=>{let a;if(L===1){const x=pick(WX.ANIMALS);a={e:x.e,zh:x.zh,c:wById(x.id)}}else{const c=pick(WC.filter(c=>WX.EXTRA[c.id]));const an=WX.EXTRA[c.id].an;a={e:an[0],zh:an[1],c}}
   return{title:`${esc(a.zh)}是哪一个国家的代表动物？`,say:`${a.zh}是哪一个国家的代表动物？`,html:h=>`<div style="font-size:96px;line-height:1.1">${a.e}</div>`+(h?`<div class="hintbox">💡 这个国家在${WCONT[a.c.c]}</div>`:''),big:true,ans:a.c.id,
    opts:wOpts(a.c,WC).map(wOpt),explain:`${a.e} ${esc(a.zh)}是 <b>${esc(a.c.zh)}</b> 的代表动物。`,sayAns:`${a.zh}是${a.c.zh}的代表动物`}}},
 wland:{zh:'有名的地方',e:'🗼',hue:'#B5DCFF',d:'这座建筑在哪一国？',l1:'亚洲',l2:'全世界',how:'很多国家都有一个大家都认识的地标，像中国的长城、马来西亚的双子塔、法国的埃菲尔铁塔。',
  gen:L=>{const pool=wPool(L).filter(c=>WX.EXTRA[c.id]),c=pick(pool),lm=WX.EXTRA[c.id].lm;
   return{title:`「${esc(lm[1])}」在哪一个国家？`,say:`${lm[1]}在哪一个国家？`,html:h=>`<div class="zh" style="font-size:22px">${esc(lm[2])}</div>`+(h?`<div class="hintbox">💡 这个国家在${WCONT[c.c]}，首都是${esc(c.capZh)}</div>`:''),big:true,ans:c.id,
    opts:wOpts(c,pool).map(wOpt),explain:`${esc(lm[1])}（${esc(lm[2])}）在 <b>${esc(c.zh)}</b>。`,sayAns:`${lm[1]}在${c.zh}`}}},
 whello:{zh:'各国的你好',e:'👋',hue:'#FFE9A8',d:'他们怎么说「你好」？',l1:'亚洲',l2:'全世界',how:'不同国家说不一样的话。马来西亚说 Selamat pagi / Apa khabar，日本说 Konnichiwa，泰国说 Sawasdee。',
  gen:L=>{const pool=wPool(L).filter(c=>HI_UNIQ.includes(c)),c=pick(pool);
   return{title:`「${esc(hiShow(c))}」是哪一个国家的「你好」？`,say:'这是哪一个国家的你好？',html:h=>`<div style="font-size:44px;font-weight:800">👋 ${esc(hiShow(c))}</div>`+(h?`<div class="hintbox">💡 当地写成「${esc(c.hi)}」，听起来像「${esc(c.hiR)}」，这个国家在${WCONT[c.c]}</div>`:''),big:true,ans:c.id,
    opts:wOpts(c,WC.filter(x=>x.hi),x=>hiShow(x).toLowerCase()).map(wOpt),explain:`在 <b>${esc(c.zh)}</b>，「你好」写成「${esc(c.hi)}」，听起来像「${esc(c.hiR)}」。`,sayAns:`这是${c.zh}的你好`}}},
 wcont:{zh:'在哪一洲？',e:'🗺️',hue:'#A4E2F0',d:'亚洲、欧洲、非洲……',l1:'有名的国家',l2:'全世界 52 国',how:'地球上的陆地分成几个大洲：亚洲、欧洲、非洲、北美洲、南美洲、大洋洲，还有冰天雪地的南极洲。马来西亚在亚洲。',
  gen:L=>{const famous=['cn','jp','my','sg','th','in','gb','fr','de','it','eg','ke','za','us','ca','mx','br','ar','au','nz'],pool=L===1?WC.filter(c=>famous.includes(c.id)):WC,c=pick(pool);
   const cs=shuffle([c.c,...shuffle(Object.keys(WCONT).filter(k=>k!==c.c)).slice(0,3)]);
   return{title:`${esc(c.zh)}在哪一个洲？`,say:`${c.zh}在哪一个洲？`,html:h=>`<div class="wbig">${wFlag(c)}</div>`+(h?`<div class="hintbox">💡 ${esc(wFact(c))}</div>`:''),big:true,ans:c.c,
    opts:cs.map(k=>({v:k,l:`<span style="font-size:30px">${WCONT[k]}</span>`})),explain:`${esc(c.zh)}在 <b>${WCONT[c.c]}</b>，首都是${esc(c.capZh)}。`,sayAns:`${c.zh}在${WCONT[c.c]}`}}},
 wflag2:{zh:'全世界国旗',e:'🎌',hue:'#FFE0E0',d:'挂图上的近 200 面国旗',needEmoji:true,l1:'亚洲',l2:'欧洲、美洲、大洋洲',l3:'非洲和全世界',how:'和挂图一样，按大洲来认国旗。有些国旗长得很像（像印度尼西亚和摩纳哥），这些不会放在同一题里。',
  gen:L=>{const pool=L===1?WF.filter(f=>f.c==='as'):L===2?WF.filter(f=>['eu','na','sa','oc'].includes(f.c)):Math.random()<0.5?WF.filter(f=>f.c==='af'):WF,f=pick(pool),same=WF.filter(x=>x.c===f.c);
   return{title:'这是哪一个国家的国旗？',say:'这是哪一个国家的国旗？',html:h=>`<div class="wemoji">${flagEmoji(f.id)}</div>`+(h?`<div class="hintbox">💡 它在${WCONT[f.c]}，名字第一个字是「${esc(f.zh[0])}」</div>`:''),big:true,ans:f.id,
    opts:wfOpts(f,same.length>=6?same:WF).map(x=>({v:x.id,l:`<span style="font-size:24px">${esc(x.zh)}</span><small>${esc(x.en)}</small>`})),explain:`${flagEmoji(f.id)} 是 <b>${esc(f.zh)}</b>（${esc(f.en)}）的国旗，它在${WCONT[f.c]}。`,sayAns:`这是${f.zh}的国旗`}}},
 mytour:{zh:'马来西亚旅游胜地',e:'🇲🇾',hue:'#FFE9A8',d:'这个好玩的地方在哪一州？',l1:'地方 → 州',l2:'州 → 地方',how:'马来西亚有很多好玩的地方：沙巴的神山、雪兰莪的黑风洞、槟城的极乐寺……看看它们在哪一州。',
  gen:L=>{const t=pick(MYTOUR),st=MYST[t[3]];
   if(L===1){const others=shuffle(Object.keys(MYST).filter(k=>k!==t[3])).slice(0,3);
    return{title:`${t[1]}（${esc(t[2])}）在哪一州？`,say:`${t[1]}在哪一州？`,html:h=>`<div style="font-size:88px;line-height:1.1">${t[0]}</div>`+(h?`<div class="hintbox">💡 ${t[4]}。马来文写成 ${esc(t[2])}, ${esc(st[1])}</div>`:''),big:true,ans:t[3],
     opts:shuffle([t[3],...others]).map(k=>({v:k,l:`<span style="font-size:28px">${MYST[k][0]}</span><small>${esc(MYST[k][1])}</small>`})),explain:`${t[0]} ${t[1]}在 <b>${st[0]}</b>（${esc(st[1])}）：${t[4]}。`,sayAns:`${t[1]}在${st[0]}`}}
   const others=shuffle(MYTOUR.filter(x=>x[3]!==t[3])).slice(0,3);
   return{title:`哪一个好玩的地方在${st[0]}？`,say:`哪一个好玩的地方在${st[0]}？`,html:h=>`<div style="font-size:40px;font-weight:800">📍 ${st[0]} ${esc(st[1])}</div>`+(h?`<div class="hintbox">💡 ${t[4]}</div>`:''),big:true,ans:t[1],
    opts:shuffle([t,...others]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${t[0]} <b>${t[1]}</b>（${esc(t[2])}）在${st[0]}：${t[4]}。`,sayAns:`${t[1]}在${st[0]}`}}}
};
const worldCards=()=>Object.entries(WG).filter(([,g])=>!g.needEmoji||flagEmojiOK()).map(gameCard).join('');
function worldPanel(){const st=S.world||{};const rows=Object.entries(WG).map(([k,g])=>{const r=st[k]||{c:0,w:0},t=r.c+r.w,acc=t?Math.round(r.c*100/t):0;
  return `<div style="font-weight:700">${g.e} ${g.zh}</div><div class="mrow"><div class="meter"><i style="width:${acc}%;background:var(--sky)"></i></div>${t?'答对 '+r.c+' 题 · '+acc+'%':'还没玩过'}</div>`}).join('');
  return `<div class="panel"><h2>环游世界 🌍</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">蓝色条＝第一次就答对的比例</div><div class="bars2">${rows}</div></div>`}
const sciCards=()=>byYear(Object.entries(SG),gameCard);
function sciPanel(){const st=S.sci||{};const rows=Object.entries(SG).map(([k,g])=>{const r=st[k]||{c:0,w:0},t=r.c+r.w,acc=t?Math.round(r.c*100/t):0;
  return `<div style="font-weight:700">${g.e} ${g.zh}${g.yr===2?' <span class="zh" style="font-size:13px">二年级</span>':''}</div><div class="mrow"><div class="meter"><i style="width:${acc}%;background:var(--mint)"></i></div>${t?'答对 '+r.c+' 题 · '+acc+'%':'还没玩过'}</div>`}).join('');
  return `<div class="panel"><h2>科学 🔬</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">绿色条＝第一次就答对的比例</div><div class="bars2">${rows}</div></div>`}
