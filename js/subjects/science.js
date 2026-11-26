/* ---------------- 科学 Science: games (the question banks are in data/science.js) ---------------- */
const lab=(e,t)=>`<span>${e}</span><small>${t}</small>`;
const bigItem=(e,t)=>`<div class="sitem"><div class="se">${e}</div><div class="st">${t}</div></div>`;
function plantSvg(part,show){const hl={root:'<ellipse cx="80" cy="168" rx="38" ry="28"',stem:'<rect x="66" y="62" width="28" height="80" rx="10"',leaf:'<ellipse cx="58" cy="100" rx="30" ry="20"',flower:'<circle cx="80" cy="46" r="27"'}[part];
  const lx={root:128,stem:110,leaf:16,flower:118}[part],ly={root:170,stem:104,leaf:72,flower:30}[part];
  return `<svg viewBox="0 0 160 200" width="200" height="250" aria-hidden="true"><rect x="0" y="140" width="160" height="60" rx="8" fill="#C8A27A"/>
  <path d="M80 140 L80 182 M80 150 L60 174 M80 156 L102 180 M80 168 L68 192 M80 166 L94 194" stroke="#7B4A2A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <line x1="80" y1="140" x2="80" y2="58" stroke="#3E9E4F" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="58" cy="100" rx="22" ry="9" fill="#6FD6A8" stroke="#2E7D3E" stroke-width="2" transform="rotate(-25 58 100)"/><ellipse cx="102" cy="86" rx="22" ry="9" fill="#6FD6A8" stroke="#2E7D3E" stroke-width="2" transform="rotate(25 102 86)"/>
  ${[0,72,144,216,288].map(a=>`<circle cx="${80+11*Math.cos(a*Math.PI/180)}" cy="${46+11*Math.sin(a*Math.PI/180)}" r="9" fill="#FF8FB1"/>`).join('')}<circle cx="80" cy="46" r="7" fill="#FFD23F"/>
  ${hl} fill="none" stroke="#FF3B6B" stroke-width="4" stroke-dasharray="7 5"/>
  <text x="${lx}" y="${ly}" font-size="${show?16:26}" font-weight="800" fill="#FF3B6B" font-family="inherit">${show?PARTS[part][0]:'?'}</text></svg>`}
function magSvg(a,b,c,d){const col=p=>p==='N'?'#FF6B6B':'#5AB8FF';const bar=(x,p,q)=>`<rect x="${x}" y="20" width="50" height="40" fill="${col(p)}" stroke="#2A2F6B" stroke-width="3"/><rect x="${x+50}" y="20" width="50" height="40" fill="${col(q)}" stroke="#2A2F6B" stroke-width="3"/><text x="${x+25}" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${p}</text><text x="${x+75}" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${q}</text>`;
  return `<svg viewBox="0 0 280 80" width="100%" style="max-width:420px" aria-hidden="true">${bar(10,a,b)}${bar(170,c,d)}<text x="140" y="48" text-anchor="middle" font-size="22" fill="#6B70A8">⟷</text></svg>`}
/* ---- 科学 二年级 (Year 2): growth of humans, animals, plants; light ---- */
function qPick(it){return{title:it.q,say:it.q,html:h=>(it.big?`<div style="font-size:80px;line-height:1.1">${it.big}</div>`:'')+(h?`<div class="hintbox">💡 ${it.h}</div>`:''),big:true,ans:it.a[1],
  opts:shuffle([it.a,...it.n]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${it.a[0]} <b>${it.a[1]}</b>：${it.w}。`,sayAns:it.a[1]+'。'+it.w}}
function qNext(st,name,hint){const back=Math.random()<0.5,i=back?rnd(1,st.length-1):rnd(0,st.length-2),c=st[i],a=st[back?i-1:i+1];const others=shuffle(st.filter(x=>x!==c&&x!==a)).slice(0,3);
  const word=back?'前面':'下一个',chain=st.map((x,j)=>x===a?'？':x[1]).join(' → ');
  return{title:`${c[0]} ${c[1]}，${word}是什么？`,say:`${name}：${c[1]}，${word}是什么？`,html:h=>`<div style="font-size:80px;line-height:1.1">${c[0]}</div>`+(h?`<div class="hintbox">💡 ${hint}：${chain}</div>`:''),big:true,ans:a[1],
   opts:shuffle([a,...others]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${name}：${st.map(x=>x[1]).join(' → ')}。${c[1]}的${word}是<b>${a[1]}</b>。`,sayAns:`${c[1]}的${word}是${a[1]}`}}
const SG={
 living:{zh:'生物与非生物',e:'🌱',hue:'#93E3BE',d:'会长大的是生物',l1:'容易分辨',l2:'有点难哦',how:'生物会呼吸、会长大，需要食物、水和空气。看看图片里的东西是不是这样。',
  gen:L=>{const it=pick(L===1?LIVE1:LIVE2),ans=it[2];const why=L===1?(ans?it[1]+'会呼吸、会长大，需要食物和水':it[1]+'不会呼吸、不会长大'):it[3];
   return{title:'这是生物还是非生物？',say:`${it[1]}，是生物还是非生物？`,html:h=>bigItem(it[0],it[1])+(h?'<div class="hintbox">💡 想一想：它会长大吗？它需要吃东西和喝水吗？</div>':''),wide:true,ans,opts:[{v:1,l:lab('🌱','生物')},{v:0,l:lab('🪨','非生物')}],explain:`${why}，所以是<b>${ans?'生物':'非生物'}</b>。`,sayAns:`${it[1]}是${ans?'生物':'非生物'}`}}},
 senses:{zh:'五种感官',e:'👀',hue:'#FFC56B',d:'看、听、闻、尝、摸',l1:'用什么感官知道？',l2:'这个感官能知道什么？',how:'我们用眼睛看、耳朵听、鼻子闻、舌头尝、皮肤摸，来认识身边的东西。',
  gen:L=>{if(L===1){const it=pick(SITEMS),s=SENSE[it[2]];const keys=shuffle([it[2],...shuffle(Object.keys(SENSE).filter(k=>k!==it[2])).slice(0,3)]);
    return{title:'用什么知道？',say:`${it[1]}，要用什么知道？`,html:h=>bigItem(it[0],it[1])+(h?'<div class="hintbox">💡 想一想：是要看、听、闻、尝，还是摸？</div>':''),big:true,ans:it[2],opts:keys.map(k=>({v:k,l:lab(SENSE[k][0],SENSE[k][1])})),explain:`用${s[1]}${s[2]}，就知道${it[1]}。`,sayAns:`用${s[1]}${s[2]}`}}
   const sk=pick(Object.keys(SENSE)),s=SENSE[sk];const right=pick(SITEMS.filter(x=>x[2]===sk));const used=new Set([sk]);const wrong=shuffle(SITEMS.filter(x=>x[2]!==sk)).filter(x=>!used.has(x[2])&&used.add(x[2])).slice(0,3);
   return{title:`用${s[1]}${s[2]}，可以知道哪一个？`,say:`用${s[1]}${s[2]}，可以知道哪一个？`,html:h=>`<div class="se">${s[0]}</div>`+(h?`<div class="hintbox">💡 ${s[1]}是用来${s[2]}的</div>`:''),big:true,ans:right[1],opts:shuffle([right,...wrong]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${right[1]}要用${s[1]}${s[2]}才知道。`,sayAns:`${right[1]}要用${s[1]}${s[2]}`}}},
 animal:{zh:'动物的身体',e:'🐾',hue:'#FFB98F',d:'翅膀、鳍、壳、角……',l1:'翅膀、鳍、壳、角',l2:'羽毛、鳞片、喙',how:'不同的动物有不同的身体部分，帮助它们飞、游泳或保护自己。',
  gen:L=>{const F=pick(L===1?FEAT1:FEAT2),yes=pick(F.y),nos=shuffle(F.n).slice(0,3);
   return{title:`哪一个动物有${F.f}？`,say:`哪一个动物有${F.f}？`,html:h=>h?`<div class="hintbox">💡 ${F.w}</div>`:'',big:true,ans:yes,opts:shuffle([yes,...nos]).map(e=>({v:e,l:lab(e,ANM[e])})),explain:`${ANM[yes]}有${F.f}：${F.w}。`,sayAns:`${ANM[yes]}有${F.f}`}}},
 plant:{zh:'植物',e:'🌻',fig:'plant',hue:'#C9E89A',d:'根、茎、叶、花',l1:'植物的部分',l2:'生物需要什么？',how:'认识植物的根、茎、叶、花，还有植物、动物和人需要什么才能活下去。',
  gen:L=>{if(L===1){const part=pick(Object.keys(PARTS)),p=PARTS[part];
    return{title:'红圈里是植物的哪一部分？',say:'红圈里是植物的哪一部分？',html:h=>plantSvg(part,h&&false)+(h?`<div class="hintbox">💡 这个部分会${p[1]}</div>`:''),ans:part,opts:shuffle(Object.keys(PARTS)).map(k=>({v:k,l:PARTS[k][0]})),explain:`这是<b>${p[0]}</b>：${p[1]}。`,sayAns:`这是${p[0]}`}}
   const n=pick(NEEDS),need=pick(n[2]),bad=shuffle(NOTNEED).slice(0,3);
   return{title:`${n[1]}需要哪一个才能活下去？`,say:`${n[1]}需要哪一个才能活下去？`,html:h=>`<div class="se">${n[0]}</div>`+(h?'<div class="hintbox">💡 没有它就活不下去哦</div>':''),ans:need,opts:shuffle([need,...bad]).map(x=>({v:x,l:x})),explain:`${n[1]}需要${n[2].join('、')}才能活下去。`,sayAns:`${n[1]}需要${need.split(' ')[1]}`}}},
 magnet:{zh:'磁铁',e:'🧲',fig:'magnet',hue:'#FFB3B3',d:'什么会被吸住？',l1:'会被磁铁吸住吗？',l2:'两块磁铁靠近会怎样？',how:'磁铁会吸住铁做的东西。两块磁铁：不一样的一端（N 和 S）会吸在一起，一样的一端会互相推开。',
  gen:L=>{if(L===1){const y=pick(MAGY),ns=shuffle(MAGN).slice(0,3);
    return{title:'哪一个会被磁铁吸住？🧲',say:'哪一个会被磁铁吸住？',html:h=>h?'<div class="hintbox">💡 磁铁会吸住铁做的东西</div>':'',big:true,ans:y[1],opts:shuffle([y,...ns]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${y[1]}是铁做的，所以会被磁铁吸住。`,sayAns:`${y[1]}会被磁铁吸住`}}
   const P=()=>pick(['N','S']),a=P(),b=a==='N'?'S':'N',c=P(),d=c==='N'?'S':'N',att=b!==c;
   return{title:'这两块磁铁靠近会怎样？',say:'这两块磁铁靠近会怎样？',html:h=>magSvg(a,b,c,d)+(h?'<div class="hintbox">💡 看看中间靠近的两端：一样的会推开，不一样的会吸在一起</div>':''),wide:true,ans:att?1:0,opts:[{v:1,l:lab('🤝','吸在一起')},{v:0,l:lab('↔️','互相推开')}],explain:`靠近的一端是 ${b} 和 ${c}，${att?'不一样，所以会<b>吸在一起</b>':'一样，所以会<b>互相推开</b>'}。`,sayAns:att?'不一样的会吸在一起':'一样的会互相推开'}}},
 absorb:{zh:'吸水',e:'💧',hue:'#8FCBFF',d:'哪些东西会吸水？',l1:'哪一个会吸水？',l2:'生活里怎么用？',how:'海绵、纸巾、棉布会吸水；塑料、铁、玻璃不吸水。我们会按需要选择会吸水或不吸水的东西。',
  gen:L=>{if(L===1){const y=pick(ABY),ns=shuffle(ABN).slice(0,3);
    return{title:'哪一个会吸水？💧',say:'哪一个会吸水？',html:h=>h?'<div class="hintbox">💡 想一想：哪一个碰到水会变湿、把水吸进去？</div>':'',big:true,ans:y[1],opts:shuffle([y,...ns]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${y[1]}会把水吸进去，所以会吸水。`,sayAns:`${y[1]}会吸水`}}
   const sc=pick(ABS2),ds=shuffle(ABSPOOL.filter(x=>x[1]!==sc.a[1])).slice(0,3);
   return{title:sc.q,say:sc.q,html:h=>h?'<div class="hintbox">💡 这里需要会吸水的，还是不吸水的东西？</div>':'',big:true,ans:sc.a[1],opts:shuffle([sc.a,...ds]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`用<b>${sc.a[1]}</b>：${sc.w}。`,sayAns:`用${sc.a[1]}`}}},
 soil:{zh:'泥土',e:'🪱',fig:'soil',hue:'#D9B99B',d:'泥土里有什么？',l1:'泥土里有什么？',l2:'沙土、黏土、园土',how:'泥土里有水、空气、小石头、枯叶，还住着蚯蚓等小动物。泥土有三种：沙土让水很快流走，黏土会留住水，园土最适合种植物。',
  gen:L=>{if(L===1){const y=pick(SOILY),ns=shuffle(SOILN).slice(0,3);
    return{title:'哪一个可以在泥土里找到？',say:'哪一个可以在泥土里找到？',html:h=>h?'<div class="hintbox">💡 想一想：挖开花园的泥土，会看到什么？</div>':'',big:true,ans:y[1],opts:shuffle([y,...ns]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${y[0]} <b>${y[1]}</b>：${y[2]}。`,sayAns:`泥土里有${y[1]}`}}
   const sq=pick(SOILQ),t=SOILT[sq.a];
   return{title:sq.q,say:sq.q,html:h=>h?'<div class="hintbox">💡 沙土：沙粒大，水流得快；黏土：黏黏的，留住水；园土：黑黑的，有枯叶，养分多</div>':'',big:true,ans:sq.a,opts:shuffle(Object.keys(SOILT)).map(k=>({v:k,l:lab(SOILT[k][0],SOILT[k][1])})),explain:`是<b>${t[1]}</b>：${sq.w}。`,sayAns:`是${t[1]}`}}},

 grow:{yr:2,zh:'人类的成长',e:'👶',hue:'#FFD6E0',d:'我们会慢慢长大',l1:'人生的阶段',l2:'怎样健康长大',how:'人会从婴儿慢慢长大，变成小孩、少年、大人、老人。长大的时候会长高、变重。吃有营养的食物、多运动、睡得够，才能健康长大。',
  gen:L=>L===1?qNext(HUMAN,'人长大的顺序','人长大的顺序'):qPick(pick(GROW2))},
 agrow:{yr:2,zh:'动物的成长',e:'🐣',hue:'#FFE9A8',d:'小动物长大变成什么？',l1:'长大以后变成什么',l2:'动物的一生',how:'小动物会慢慢长大。有些动物小时候和爸爸妈妈长得很像（像小狗），有些很不一样（像毛毛虫变成蝴蝶、蝌蚪变成青蛙）。',
  gen:L=>{if(L===1){const b=pick(BABY),others=shuffle(BABY.filter(x=>x[3]!==b[3]&&x[3]!==b[1])).slice(0,3);
     return{title:`${b[1]}长大以后变成什么？`,say:`${b[1]}长大以后变成什么？`,html:h=>`<div style="font-size:80px;line-height:1.1">${b[0]}</div>`+(h?`<div class="hintbox">💡 ${b[1]}会慢慢长大，变成……</div>`:''),big:true,ans:b[3],
      opts:shuffle([[b[2],b[3]],...others.map(x=>[x[2],x[3]])]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${b[0]} ${b[1]}长大以后变成 ${b[2]} <b>${b[3]}</b>。`,sayAns:`${b[1]}长大以后变成${b[3]}`}}
   if(Math.random()<0.7){const c=pick(CYCLES);return qNext(c.st,c.n,c.n)}return qPick(pick(ANIM2))}},
 pgrow:{yr:2,zh:'植物的成长',e:'🌱',hue:'#C9E89A',d:'种子怎样长大？',l1:'种子长大的顺序',l2:'种子发芽需要什么',how:'种子有了水、空气和适合的温度就会发芽，慢慢长成幼苗和大植物。小苗长大还需要阳光。',
  gen:L=>L===1?qNext(SEED,'种子长大的顺序','种子长大的顺序'):qPick(pick(PLANT2))},
 light:{yr:2,zh:'光与影子',e:'🔦',hue:'#FFF3B0',d:'光从哪里来？影子怎样来？',l1:'哪些东西会发光',l2:'影子和透明',how:'太阳、电灯、蜡烛会自己发光，叫做光源。月亮和镜子自己不会发光。光被不透明的东西挡住，就会出现影子；透明的东西让光穿过去。',
  gen:L=>{if(L===1){const y=pick(LIGHTY),ns=shuffle(LIGHTN).slice(0,3);
     return qPick({q:'哪一个会自己发光？',a:y,n:ns,h:'月亮自己不会发光，它是反射太阳的光',w:'它会自己发光，叫做「光源」'})}return qPick(pick(LIGHT2))}},
 phabitat:{zh:'植物长在哪里',e:'🌵',hue:'#C8E6C9',d:'陆地、水、沙漠、海滩、沼泽……',l1:'植物 → 地方',l2:'地方 → 植物',how:'不同的植物长在不同的地方（栖息地）：木瓜树长在陆地，睡莲长在水里，仙人掌长在沙漠，椰树长在海滩，红树长在沼泽，兰花和蕨可以长在大树上。',
  gen:L=>{const ws=[...T('plant1').words,...T('plant2').words],w=pick(ws),h=PHAB[w.p],hp=k=>PHAB[k][0].startsWith('@')?icoSvg(PHAB[k][0]):PHAB[k][0];
   if(L===1){const others=shuffle(Object.keys(PHAB).filter(k=>k!==w.p)).slice(0,3);
    return{title:`${w.zh}长在哪里？`,say:`${w.zh}长在哪里？`,html:hn=>`<div style="font-size:88px;line-height:1.1">${pic(w)}</div><div class="zh">${esc(w.ms)} · ${esc(w.en)}</div>`+(hn?`<div class="hintbox">💡 ${h[3]}</div>`:''),big:true,ans:w.p,
     opts:shuffle([w.p,...others]).map(k=>({v:k,l:lab(hp(k),PHAB[k][1])})),explain:`${esc(w.zh)}（${esc(w.en)}）长在 <b>${h[5]}</b>（${h[2]}）。`,sayAns:`${w.zh}长在${h[5]}`}}
   const others=shuffle(ws.filter(x=>x.p!==w.p)).slice(0,3);
   return{title:`哪一种植物长在${h[5]}？`,say:`哪一种植物长在${h[5]}？`,html:hn=>`<div style="font-size:80px;line-height:1.1">${hp(w.p)}</div>`+(hn?`<div class="hintbox">💡 ${h[3]}</div>`:''),big:true,ans:w.zh,
    opts:shuffle([w,...others]).map(x=>({v:x.zh,l:lab(pic(x),x.zh)})),explain:`${esc(w.zh)}长在 <b>${h[5]}</b>。${h[3]}。`,sayAns:`${w.zh}长在${h[5]}`}}},
 mixcol:{zh:'调颜色',e:'🎨',hue:'#F8BBD0',d:'原色和间色',l1:'混合后变成什么？',l2:'哪两种颜色？',how:'红、黄、蓝是三原色。把两种原色混在一起，会变成新的颜色（间色）：红＋黄＝橙，黄＋蓝＝绿，红＋蓝＝紫。',
  gen:L=>{const C={red:['🔴','红色'],blue:['🔵','蓝色'],yellow:['🟡','黄色'],purple:['🟣','紫色'],green:['🟢','绿色'],orange:['🟠','橙色']};
   const MIX=[['red','yellow','orange'],['yellow','blue','green'],['red','blue','purple']],m=pick(MIX),r=C[m[2]];
   if(L===1){const a=Math.random()<0.5?[m[0],m[1]]:[m[1],m[0]];
    return{title:`${C[a[0]][1]}＋${C[a[1]][1]}，变成什么颜色？`,say:`${C[a[0]][1]}加${C[a[1]][1]}，变成什么颜色？`,html:h=>`<div style="font-size:64px;line-height:1.2">${C[a[0]][0]} ＋ ${C[a[1]][0]} ＝ ❓</div>`+(h?`<div class="hintbox">💡 红＋黄＝橙，黄＋蓝＝绿，红＋蓝＝紫</div>`:''),big:true,ans:m[2],
     opts:shuffle(['orange','green','purple',pick(['red','blue','yellow'])]).map(k=>({v:k,l:lab(C[k][0],C[k][1])})),explain:`${C[a[0]][1]}和${C[a[1]][1]}混在一起，变成 <b>${r[1]}</b>。`,sayAns:`${C[a[0]][1]}加${C[a[1]][1]}变成${r[1]}`}}
   if(Math.random()<0.3){const k=pick(['red','blue','yellow','purple','green','orange']),pr=['red','blue','yellow'].includes(k);
    return{title:`${C[k][1]}是原色还是间色？`,say:`${C[k][1]}是原色还是间色？`,html:h=>`<div style="font-size:80px">${C[k][0]}</div>`+(h?`<div class="hintbox">💡 原色只有三种：红、黄、蓝</div>`:''),big:true,ans:pr?'p':'s',
     opts:[{v:'p',l:lab('🎨','原色')},{v:'s',l:lab('🖌️','间色')}],explain:pr?`${C[k][1]}是 <b>原色</b>。原色有红、黄、蓝三种。`:`${C[k][1]}是 <b>间色</b>，是两种原色混合出来的。`,sayAns:`${C[k][1]}是${pr?'原色':'间色'}`}}
   const key=x=>x.slice().sort().join('+'),ans=key([m[0],m[1]]),all=[['red','yellow'],['yellow','blue'],['red','blue'],['red','green'],['blue','orange'],['yellow','purple']].map(key);
   return{title:`哪两种颜色混在一起，会变成${r[1]}？`,say:`哪两种颜色混在一起，会变成${r[1]}？`,html:h=>`<div style="font-size:80px">${r[0]}</div>`+(h?`<div class="hintbox">💡 ${r[1]}是间色，要用两种原色（红、黄、蓝）来调</div>`:''),big:true,ans,
    opts:shuffle([ans,...shuffle(all.filter(x=>x!==ans)).slice(0,3)]).map(k=>({v:k,l:'<span style="font-size:34px;white-space:nowrap;line-height:1.3;display:block">'+k.split('+').map(c=>C[c][0]).join('＋')+'</span><small>'+k.split('+').map(c=>C[c][1]).join('＋')+'</small>'})),explain:`${C[m[0]][1]}＋${C[m[1]][1]}＝<b>${r[1]}</b>。`,sayAns:`${C[m[0]][1]}加${C[m[1]][1]}变成${r[1]}`}}},
 habitat:{zh:'动物住在哪里',e:'🏞️',hue:'#A8E6CF',d:'海洋、池塘、森林、农场……',l1:'动物 → 家',l2:'家 → 动物',how:'不同的动物住在不同的地方（栖息地）：鲨鱼住在海洋，青蛙住在池塘，猴子住在树上，牛住在农场。',
  gen:L=>{const a=pick(HABA),h=HABH[a[2]];
   if(L===1){const others=shuffle(Object.keys(HABH).filter(k=>k!==a[2]&&!(a[3]||[]).includes(k))).slice(0,3);
    return{title:`${a[1]}住在哪里？`,say:`${a[1]}住在哪里？`,html:hn=>`<div style="font-size:88px;line-height:1.1">${pic({e:a[0],zh:a[1]})}</div><div class="zh">${esc(a[4])} · ${esc(a[5])}</div>`+(hn?`<div class="hintbox">💡 ${h[3]}</div>`:''),big:true,ans:a[2],
     opts:shuffle([a[2],...others]).map(k=>({v:k,l:lab(HABH[k][0].startsWith('@')?icoSvg(HABH[k][0]):HABH[k][0],HABH[k][1])})),explain:`${a[1]}（${esc(a[5])}）住在 <b>${h[1]}</b>（${esc(h[2])}）。`,sayAns:`${a[1]}住在${h[1]}`}}
   const others=shuffle(HABA.filter(x=>x[2]!==a[2]&&!(x[3]||[]).includes(a[2]))).filter((x,i,arr)=>arr.findIndex(y=>y[1]===x[1])===i).slice(0,3);
   return{title:`哪一种动物住在${h[1]}？`,say:`哪一种动物住在${h[1]}？`,html:hn=>`<div style="font-size:80px;line-height:1.1">${h[0].startsWith('@')?icoSvg(h[0]):h[0]}</div>`+(hn?`<div class="hintbox">💡 ${h[3]}</div>`:''),big:true,ans:a[1],
    opts:shuffle([a,...others]).map(x=>({v:x[1],l:lab(pic({e:x[0],zh:x[1]}),x[1])})),explain:`${a[1]}住在 <b>${h[1]}</b>。${h[3]}。`,sayAns:`${a[1]}住在${h[1]}`}}},
 matprop:{zh:'硬、软、热、冷',e:'🧊',hue:'#E3D4FF',d:'材料的性质',l1:'这个东西是怎样的？',l2:'哪一个是……的？',how:'摸一摸身边的东西：石头和椅子是硬的，枕头和海绵是软的，火和沸水是热的，冰和冰淇淋是冷的。热的东西不可以乱摸哦！',
  gen:L=>{const w=pick(T('materials').words),pp=MATP[w.p];
   if(L===1)return{title:`${w.zh}是怎样的？`,say:`${w.zh}是怎样的？`,html:hn=>`<div style="font-size:88px;line-height:1.1">${pic(w)}</div>`+(hn?`<div class="hintbox">💡 想一想：摸起来${pp.zh==='硬'||pp.zh==='软'?'是硬硬的还是软软的':'是热热的还是冷冷的'}？</div>`:''),big:true,ans:w.p,
     opts:Object.keys(MATP).map(k=>({v:k,l:lab(MATP[k].e,MATP[k].zh+' '+MATP[k].ms)})),explain:`${esc(w.zh)}是 <b>${pp.zh}</b> 的（${esc(w.ms)} itu ${pp.ms}）。${w.p==='hot'?'热的东西要小心，不可以乱摸！':''}`,sayAns:`${w.zh}是${pp.zh}的`};
   const others=shuffle(T('materials').words.filter(x=>x.p!==w.p)).slice(0,3);
   return{title:`哪一个是${pp.zh}的？`,say:`哪一个是${pp.zh}的？`,html:hn=>`<div style="font-size:64px">${pp.e}</div>`+(hn?`<div class="hintbox">💡 ${pp.zh}：${pp.ms} / ${pp.en}</div>`:''),big:true,ans:w.en,
    opts:shuffle([w,...others]).map(x=>({v:x.en,l:lab(pic(x),x.zh)})),explain:`${esc(w.zh)}是 <b>${pp.zh}</b> 的。`,sayAns:`${w.zh}是${pp.zh}的`}}},
 taste:{zh:'甜、咸、酸、苦',e:'👅',hue:'#FFE9A8',d:'食物的味道',l1:'这个吃起来是什么味道？',l2:'哪一个是……的？',how:'舌头可以尝出味道：巧克力和糖是甜的，盐和酱油是咸的，醋和罗望子果是酸的，苦瓜和咖啡豆是苦的。药要大人给才可以吃哦！',
  gen:L=>{const w=pick(T('taste').words),pp=TASTEP[w.p];
   if(L===1)return{title:`${w.zh}吃起来是什么味道？`,say:`${w.zh}吃起来是什么味道？`,html:hn=>`<div style="font-size:88px;line-height:1.1">${pic(w)}</div>`+(hn?'<div class="hintbox">💡 想一想：是甜甜的、咸咸的、酸酸的，还是苦苦的？</div>':''),big:true,ans:w.p,
     opts:Object.keys(TASTEP).map(k=>({v:k,l:lab(TASTEP[k].e,TASTEP[k].zh+' '+TASTEP[k].ms)})),explain:`${esc(w.zh)}是 <b>${pp.zh}</b> 的（${esc(w.ms)} itu ${pp.ms}）。${w.en==='medicine'?'药要大人给才可以吃！':''}`,sayAns:`${w.zh}是${pp.zh}的`};
   const others=shuffle(T('taste').words.filter(x=>x.p!==w.p)).slice(0,3);
   return{title:`哪一个是${pp.zh}的？`,say:`哪一个是${pp.zh}的？`,html:hn=>`<div style="font-size:64px">${pp.e}</div>`+(hn?`<div class="hintbox">💡 ${pp.zh}：${pp.ms} / ${pp.en}</div>`:''),big:true,ans:w.en,
    opts:shuffle([w,...others]).map(x=>({v:x.en,l:lab(pic(x),x.zh)})),explain:`${esc(w.zh)}是 <b>${pp.zh}</b> 的。`,sayAns:`${w.zh}是${pp.zh}的`}}},
 rules:{zh:'科学室规则',e:'🧪',hue:'#C9A9FF',d:'怎样做才安全？',l1:'基本规则',l2:'更多安全规则',how:'在科学室里要守规矩，才能安全地做实验。想一想这样做对不对。',
  gen:L=>{const it=pick(L===1?RULE1:RULE2),ok=it[2];
   return{title:'这样做对吗？',say:`${it[1]}，这样做对吗？`,html:h=>bigItem(it[0],it[1])+(h?'<div class="hintbox">💡 想一想：这样做安全吗？</div>':''),wide:true,ans:ok,opts:[{v:1,l:lab('👍','对')},{v:0,l:lab('👎','不对')}],explain:ok?`${it[1]}，这样做是<b>对的</b>，很安全！`:`${it[1]}很危险，<b>不可以</b>这样做！`,sayAns:ok?'这样做是对的':'这样做不对'}}},
};
