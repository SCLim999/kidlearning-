/* ---------------- 数学 Math ---------------- */
function numOpts(ans,min,max,step,fmt){step=step||1;fmt=fmt||(v=>String(v));const set=new Set([ans]);let n=0;
  while(set.size<4&&n<80){n++;const x=ans+pick([-3,-2,-1,1,2,3])*step;if(x>=min&&x<=max)set.add(x)}
  let k=1;while(set.size<4){set.add(ans+k*step);k++}return shuffle([...set]).map(v=>({v,l:fmt(v)}))}
function objs(n,e,o){o=o||{};let h='';for(let i=0;i<n;i++){const x=o.cross&&i>=n-o.cross;
  h+=`<span class="ob${x?' x':''}">${e}${o.hint&&!x?`<i>${(o.start||0)+i+1}</i>`:''}</span>`;if(o.row&&(i+1)%o.row===0&&i<n-1)h+='<br>'}
  return `<span class="obs">${h}</span>`}
const SHAPES2=[{k:'circle',zh:'圆形',f:'圆圆的，没有角'},{k:'square',zh:'正方形',f:'4 条边一样长，有 4 个角'},{k:'triangle',zh:'三角形',f:'有 3 条边、3 个角'},{k:'rect',zh:'长方形',f:'有 4 个角，两条边长、两条边短'}];
const SHAPES3=[{e:'🏀',zh:'球体',f:'圆圆的，可以到处滚'},{e:'🎲',zh:'正方体',f:'6 个面都是一样大的正方形'},{e:'🥫',zh:'圆柱体',f:'上下两面是圆形，可以滚也可以站'},{e:'🍦',zh:'圆锥体',f:'下面圆圆的，上面尖尖的'},{e:'📦',zh:'长方体',f:'像一个盒子，有 6 个面'}];
const SCOL=['#FF8FB1','#5AB8FF','#6FD6A8','#FFD23F','#C9A9FF','#FFB98F'];
function shapeSvg(k,c){const st=`fill="${c}" stroke="#2A2F6B" stroke-width="4" stroke-linejoin="round"`;
  const b=k==='circle'?`<circle cx="50" cy="50" r="38" ${st}/>`:k==='square'?`<rect x="14" y="14" width="72" height="72" ${st}/>`:k==='triangle'?`<polygon points="50,10 92,88 8,88" ${st}/>`:`<rect x="4" y="28" width="92" height="46" ${st}/>`;
  return `<svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">${b}</svg>`}
const STORIES=[
 {op:1,e:'🐦',unit:'只',t:(a,b)=>`树上有 ${a} 只小鸟，又飞来了 ${b} 只。现在树上一共有几只小鸟？`},
 {op:1,e:'🍬',unit:'颗',t:(a,b)=>`妹妹有 ${a} 颗糖果，妈妈再给她 ${b} 颗。妹妹现在有几颗糖果？`},
 {op:1,e:'🍎',e2:'🍏',unit:'个',t:(a,b)=>`篮子里有 ${a} 个红苹果和 ${b} 个青苹果。篮子里一共有几个苹果？`},
 {op:1,e:'🚗',unit:'辆',t:(a,b)=>`停车场有 ${a} 辆车，又开来了 ${b} 辆。停车场现在有几辆车？`},
 {op:-1,e:'🍪',unit:'块',t:(a,b)=>`盘子里有 ${a} 块饼干，弟弟吃了 ${b} 块。盘子里还剩几块饼干？`},
 {op:-1,e:'🦆',unit:'只',t:(a,b)=>`池塘里有 ${a} 只鸭子，游走了 ${b} 只。池塘里还剩几只鸭子？`},
 {op:-1,e:'🎈',unit:'个',t:(a,b)=>`哥哥有 ${a} 个气球，飞走了 ${b} 个。哥哥还有几个气球？`},
 {op:-1,e:'✏️',unit:'支',t:(a,b)=>`我有 ${a} 支铅笔，送给同学 ${b} 支。我还有几支铅笔？`}];
function clockSvg(h,m){const ha=((h%12)+m/60)*30*Math.PI/180,ma=m*6*Math.PI/180;
  const nums=Array.from({length:12},(_,i)=>{const a=(i+1)*30*Math.PI/180;return `<text x="${100+70*Math.sin(a)}" y="${100-70*Math.cos(a)+7}" text-anchor="middle" font-size="20" font-weight="800" fill="#2A2F6B">${i+1}</text>`}).join('');
  return `<svg viewBox="0 0 200 200" width="210" height="210" role="img" aria-label="时钟"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#2A2F6B" stroke-width="6"/>${nums}
  <line x1="100" y1="100" x2="${100+46*Math.sin(ha)}" y2="${100-46*Math.cos(ha)}" stroke="#FF6B6B" stroke-width="9" stroke-linecap="round"/>
  <line x1="100" y1="100" x2="${100+70*Math.sin(ma)}" y2="${100-70*Math.cos(ma)}" stroke="#2A2F6B" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="7" fill="#2A2F6B"/></svg>`}
/* ---- 数学 二年级 (Year 2) helpers ---- */
function nearOpts(ans,min,max,steps,fmt){fmt=fmt||(v=>String(v));const set=new Set([ans]);for(const d of shuffle(steps))for(const sg of shuffle([1,-1])){const x=ans+sg*d;if(set.size<4&&x>=min&&x<=max)set.add(x)}
  let k=1;while(set.size<4){if(ans+k<=max)set.add(ans+k);else set.add(ans-k);k++}return shuffle([...set]).map(v=>({v,l:fmt(v)}))}
const dg=n=>[Math.floor(n/100),Math.floor(n/10)%10,n%10];
function blocks(n){const [h,t,o]=dg(n);const b=(k,c,l,w,ht)=>Array.from({length:k},()=>`<i class="blk" style="width:${w}px;height:${ht}px;background:${c}" title="${l}"></i>`).join('');
  return `<div class="blks"><span>${b(h,'var(--sky)','百',50,50)}</span><span>${b(t,'var(--mint)','十',14,50)}</span><span>${b(o,'var(--sun)','一',16,16)}</span></div><div class="zh" style="font-size:15px">🟦 大方块 = 100　🟩 长条 = 10　🟨 小方块 = 1</div>`}
function colCalc(a,b,op,ans){const w=String(Math.max(a,b,ans||0)).length,pad=v=>String(v).padStart(w,' ').split('').map(c=>`<td>${c===' '?'':c}</td>`).join('');
  return `<table class="col"><tr><td></td>${pad(a)}</tr><tr><td>${op}</td>${pad(b)}</tr><tr class="ln"><td></td>${ans==null?'<td></td>'.repeat(w):pad(ans)}</tr></table>`}
function fracSvg(n,k,shape){const c='var(--pink)',st='stroke="#2A2F6B" stroke-width="3"';let g='';
  if(shape==='circle'){for(let i=0;i<n;i++){const a0=i*2*Math.PI/n-Math.PI/2,a1=(i+1)*2*Math.PI/n-Math.PI/2;g+=`<path d="M60 60 L${60+50*Math.cos(a0)} ${60+50*Math.sin(a0)} A50 50 0 ${n===1?1:0} 1 ${60+50*Math.cos(a1)} ${60+50*Math.sin(a1)} Z" fill="${i<k?c:'#fff'}" ${st}/>`}}
  else for(let i=0;i<n;i++)g+=`<rect x="${10+i*100/n}" y="25" width="${100/n}" height="70" fill="${i<k?c:'#fff'}" ${st}/>`;
  return `<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="${n} 份里涂了 ${k} 份">${g}</svg>`}
const FR={'1/2':['½','二分之一'],'1/4':['¼','四分之一'],'3/4':['¾','四分之三'],'1/3':['⅓','三分之一'],'1':['1','一个整体']};
function rulerSvg(len){const px=26;let t='';for(let i=0;i<=15;i++)t+=`<line x1="${12+i*px}" y1="70" x2="${12+i*px}" y2="${i%5?82:88}" stroke="#2A2F6B" stroke-width="2"/><text x="${12+i*px}" y="104" font-size="13" text-anchor="middle" fill="#2A2F6B">${i}</text>`;
  return `<svg viewBox="0 0 420 112" width="100%" style="max-width:460px" role="img" aria-label="尺"><rect x="12" y="34" width="${len*px}" height="22" rx="6" fill="#FFD23F" stroke="#2A2F6B" stroke-width="2"/><polygon points="${12+len*px},34 ${12+len*px+16},45 ${12+len*px},56" fill="#FFB98F" stroke="#2A2F6B" stroke-width="2"/><rect x="6" y="66" width="404" height="42" rx="6" fill="#FFF7D6" stroke="#2A2F6B" stroke-width="2"/>${t}</svg>`}
const UNITS={len:['厘米 cm','米 m'],mass:['克 g','公斤 kg'],vol:['毫升 ml','公升 l']};
const UNITQ=[['✏️','一支铅笔的长度','len',0],['📏','一把尺的长度','len',0],['🦷','一颗牙齿的长度','len',0],['🚪','一扇门的高度','len',1],['🏫','课室的长度','len',1],['🏊','游泳池的长度','len',1],
 ['🍎','一个苹果的重量','mass',0],['✏️','一支铅笔的重量','mass',0],['🍉','一个大西瓜的重量','mass',1],['🧑','爸爸的体重','mass',1],['🍚','一大包米的重量','mass',1],
 ['🥄','一汤匙药水','vol',0],['🧃','一小盒果汁（很小盒）','vol',0],['🪣','一桶水','vol',1],['🛁','浴缸里的水','vol',1]];
const PEOPLE=['🧒','👧','👦','🧑'];

/* 分一分 (Year 2 activity book: 二分之一, 四分之一): equal parts, half of a whole, quarters of food */
function splitSvg(equal,shape){const st='stroke="#2A2F6B" stroke-width="3"';const c='var(--pink)';
  if(shape==='circle'){const x=equal?60:76;return `<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="${equal?'分成一样大的两份':'分成不一样大的两份'}"><circle cx="60" cy="60" r="50" fill="#fff" ${st}/><path d="M${x} ${60-Math.sqrt(2500-(x-60)**2)} A50 50 0 0 0 ${x} ${60+Math.sqrt(2500-(x-60)**2)} Z" fill="${c}" ${st}/><path d="M${x} ${60-Math.sqrt(2500-(x-60)**2)} V${60+Math.sqrt(2500-(x-60)**2)}" ${st}/></svg>`}
  const w=equal?50:32;return `<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="${equal?'分成一样大的两份':'分成不一样大的两份'}"><rect x="10" y="25" width="100" height="70" fill="#fff" ${st}/><rect x="10" y="25" width="${w}" height="70" fill="${c}" ${st}/></svg>`}
const FOODS=[['🍉','西瓜','个'],['@roti','印度煎饼','片'],['🍕','比萨','个'],['🎂','蛋糕','个'],['🍫','巧克力','块']];

/* 日历 (dictionary p.147): days of the week and months of the year go round in a circle */
const WEEKZ=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],MONZ=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
function calQ(list,unit,icoP){const n=list.length,i=rnd(0,n-1),back=Math.random()<0.5,a=list[(i+(back?n-1:1))%n],c=list[i];
  const others=shuffle(list.filter(x=>x!==a&&x!==c)).slice(0,3),word=back?'前一':'下一';
  return{title:`${c}的${word}${unit}是什么？`,say:`${c}的${word}${unit}是什么？`,html:h=>`<div style="font-size:80px;line-height:1.1">${icoSvg('@'+icoP+(i+1))}</div>`+(h?`<div class="hintbox">💡 ${list.map(x=>x===c?'<b>'+x+'</b>':x).join(' → ')} → 再回到${list[0]}</div>`:''),big:true,ans:a,
   opts:shuffle([a,...others]).map(x=>({v:x,l:x})),explain:`${c}的${word}${unit}是 <b>${a}</b>。${n===7?'一个星期有 7 天，星期日过后又是星期一。':'一年有 12 个月，十二月过后又是一月。'}`,sayAns:`${c}的${word}${unit}是${a}`}}
const MG={
 count:{zh:'数一数',e:'🧮',hue:'#FFE07A',d:'数一数有几个',l1:'1 到 10',l2:'11 到 20',l3:'21 到 30',how:'看看图片里有几个东西，选出对的数字。不会的话按「💡 提示」，每个东西上面会出现数字，跟着数就好。',
  gen:L=>{const n=L===1?rnd(1,10):L===2?rnd(11,20):rnd(21,30),e=pick(OBJ);return{title:'一共有几个？',say:'数一数，一共有几个？',html:h=>objs(n,e,{hint:h,row:L===1?5:10}),ans:n,opts:numOpts(n,1,30),explain:`一个一个数，一共有 <b>${n}</b> 个 ${e}`,sayAns:`一共有${n}个`}}},
 compare:{zh:'比多少',e:'⚖️',hue:'#C9A9FF',d:'哪边多？哪个大？',l1:'看图比多少',l2:'比较 100 以内的数',l3:'三个数里找最大 / 最小',how:'比一比两边，选出比较多（或比较少）的那一边。中等关比较两个数字：先看十位，十位一样再看个位。困难关有三个数字。',
  gen:L=>{const more=Math.random()<0.6,word=more?'多':'少';
   if(L===1){let x=rnd(1,10),y=rnd(1,10);while(y===x)y=rnd(1,10);const e=pick(OBJ),ans=(more?x>y:x<y)?'L':'R';
    return{title:`哪一边比较${word}？`,say:`哪一边比较${word}？`,html:()=>'',wide:true,opts:[{v:'L'},{v:'R'}],optsFn:h=>[objs(x,e,{hint:h,row:5}),objs(y,e,{hint:h,row:5})],ans,
     explain:`左边 ${x} 个，右边 ${y} 个。${Math.max(x,y)} 比 ${Math.min(x,y)} 多，所以${ans==='L'?'左边':'右边'}比较${word}。`,sayAns:`${Math.max(x,y)}比${Math.min(x,y)}多`}}
   let ns;do{ns=L===3?(t=>[t+rnd(0,9),t+rnd(0,9),rnd(10,99)])(rnd(1,9)*10):[rnd(10,99),rnd(10,99)]}while(new Set(ns).size<ns.length);
   const [a,b]=ns,big=more?'大':'小',ans=more?Math.max(...ns):Math.min(...ns),ta=Math.floor(a/10),tb=Math.floor(b/10);
   const why=L===3?`先看十位，十位一样再看个位：${ns.join('、')}。`:ta!==tb?`先看十位：${a} 有 ${ta} 个十，${b} 有 ${tb} 个十。`:`十位一样（都是 ${ta} 个十），再看个位：${a%10} 和 ${b%10}。`;
   return{title:`哪一个数${L===3?'最':'比较'}${big}？`,say:`哪一个数${L===3?'最':'比较'}${big}？`,html:h=>h?`<div class="hintbox">💡 ${why}</div>`:'',wide:true,opts:shuffle(ns).map(v=>({v,l:`<span style="font-size:60px">${v}</span>`})),ans,explain:why+`所以 <b>${ans}</b> ${L===3?'最':'比较'}${big}。`,sayAns:`${ans}${L===3?'最':'比较'}${big}`}}},
 add:{fig:'add',zh:'加法',e:'➕',hue:'#93E3BE',d:'合起来一共有几个',l1:'10 以内',l2:'20 以内',l3:'50 以内',how:'把两边的东西合起来，数一数一共有几个。按「💡 提示」会帮你从 1 一直数下去。困难关先算个位，再加上十位。',
  gen:L=>{if(L===3){const a=rnd(11,40),b=rnd(2,9),s=a+b,o=a%10,tip=`先算个位：${o} + ${b} = ${o+b}，再加 ${a-o}`;
    return{title:`${a} + ${b} = ?`,say:`${a}加${b}等于几？`,html:h=>h?`<div class="hintbox">💡 ${tip}</div>`:'<div style="font-size:64px">➕</div>',ans:s,opts:numOpts(s,0,60),explain:`${tip}：${a} + ${b} = <b>${s}</b>`,sayAns:`${a}加${b}等于${s}`}}
   const max=L===1?10:20,a=rnd(1,L===1?9:12),b=rnd(1,Math.min(10,max-a)),s=a+b,e=pick(OBJ);
   return{title:`${a} + ${b} = ?`,say:`${a}加${b}等于几？`,html:h=>`<div class="eq">${objs(a,e,{hint:h,row:5})}<span class="sym">+</span>${objs(b,e,{hint:h,start:a,row:5})}</div>`,ans:s,opts:numOpts(s,0,20),explain:`${a} 个和 ${b} 个合起来，一共 <b>${s}</b> 个：${a} + ${b} = ${s}`,sayAns:`${a}加${b}等于${s}`}}},
 sub:{fig:'subtract',zh:'减法',e:'➖',hue:'#FFB3B3',d:'拿走以后还剩几个',l1:'10 以内',l2:'20 以内',l3:'50 以内',how:'打 ✕ 的是被拿走的，数一数没打 ✕ 的还剩几个。困难关个位不够减，就借一个十。',
  gen:L=>{if(L===3){const a=rnd(21,50),b=rnd(2,9),r=a-b,o=a%10,tip=o>=b?`先算个位：${o} − ${b} = ${o-b}，再加 ${a-o}`:`借一个十：${10+o} − ${b} = ${10+o-b}，再加 ${a-o-10}`;
    return{title:`${a} − ${b} = ?`,say:`${a}减${b}等于几？`,html:h=>h?`<div class="hintbox">💡 ${tip}</div>`:'<div style="font-size:64px">➖</div>',ans:r,opts:numOpts(r,0,60),explain:`${tip}：${a} − ${b} = <b>${r}</b>`,sayAns:`${a}减${b}等于${r}`}}
   const a=L===1?rnd(2,10):rnd(11,20),b=rnd(1,L===1?a-1:Math.min(10,a-1)),r=a-b,e=pick(OBJ);
   return{title:`${a} − ${b} = ?`,say:`${a}减${b}等于几？`,html:h=>objs(a,e,{hint:h,cross:b,row:L===1?5:10}),ans:r,opts:numOpts(r,0,20),explain:`${a} 个拿走 ${b} 个（打 ✕ 的），还剩 <b>${r}</b> 个：${a} − ${b} = ${r}`,sayAns:`${a}减${b}等于${r}`}}},
 make10:{zh:'凑十',e:'🔟',hue:'#8FCBFF',d:'还差几个凑成 10',l1:'看十格框',l2:'20 以内找缺的数',l3:'50 以内找缺的数',how:'十格框装满就是 10。数一数空格有几个，就知道还要几个。',
  gen:L=>{if(L===1){const k=rnd(1,9),ans=10-k;return{title:'还要几个才是 10？',say:`${k}再加几个是10？`,
     html:h=>`<div class="frame">${Array.from({length:10},(_,i)=>i<k?'<b class="on">🔴</b>':`<b>${h?`<span class="fn">${i-k+1}</span>`:''}</b>`).join('')}</div>`,ans,opts:numOpts(ans,1,9),explain:`已经有 ${k} 个，空格有 ${ans} 个：${k} + <b>${ans}</b> = 10`,sayAns:`${k}加${ans}等于10`}}
   const c=L===2?rnd(11,20):rnd(21,50),a=rnd(c-10,c-1),ans=c-a;return{title:`${a} + ? = ${c}`,say:`${a}加几等于${c}？`,
     html:h=>h?`<div class="hintbox">💡 从 ${a} 往上数到 ${c}：</div><div>${Array.from({length:ans},(_,i)=>`<span class="nbox sm">${a+i+1}</span>`).join('')}</div><div class="hintbox">数了 ${ans} 下</div>`:'',ans,opts:numOpts(ans,1,10),explain:`从 ${a} 往上数到 ${c}，数了 ${ans} 下：${a} + <b>${ans}</b> = ${c}`,sayAns:`${a}加${ans}等于${c}`}}},
 seq:{zh:'数字接龙',e:'🚂',hue:'#FFC56B',d:'找出空格里的数字',l1:'一个一个数（20 以内）',l2:'2、5、10 个一数（100 以内）',l3:'倒着数（100 以内）',how:'数字火车一节接一节。看看每次加几（或减几），就能找出空格里的数字。',
  gen:L=>{const step=L===1?1:pick([2,5,10]),back=L===3,len=5,maxS=Math.floor((L===1?20:100)/step)-len+1,s0=rnd(0,Math.max(0,maxS))*step;
   const nums=Array.from({length:len},(_,i)=>s0+i*step),bi=rnd(back?0:1,len-1);if(back)nums.reverse();const ans=nums[bi],sg=back?'−':'+';
   return{title:'空格里是几？',say:'空格里是几？',html:h=>`<div>${nums.map((n,i)=>`${i?`<span class="step">${h?sg+step:'→'}</span>`:''}<span class="nbox ${i===bi?'q':''}">${i===bi?'?':n}</span>`).join('')}</div>`,ans,opts:numOpts(ans,0,100,step),explain:`每次${back?'减':'加'} ${step}：${nums.join('、')}，所以是 <b>${ans}</b>`,sayAns:`空格里是${ans}`}}},
 shape:{zh:'认识形状',e:'🔷',hue:'#A4E2F0',d:'圆形、三角形……',l1:'平面图形',l2:'立体图形',l3:'听特点找形状',how:'听题目，找出对的形状。按「💡 提示」会告诉你这个形状长什么样。困难关不说名字，只说形状的特点。',
  gen:L=>{if(L===1||L===3&&Math.random()<0.5){const t=pick(SHAPES2),cols=shuffle(SCOL),tt=L===3?`哪一个形状${t.f}？`:`哪一个是${t.zh}？`;return{title:tt,say:tt,html:h=>h?`<div class="hintbox">💡 ${t.zh}：${t.f}</div>`:'',ans:t.k,opts:shuffle(SHAPES2).map((x,i)=>({v:x.k,l:shapeSvg(x.k,cols[i])})),explain:`这是<b>${t.zh}</b>：${t.f}`,sayAns:`这是${t.zh}`}}
   const t=pick(SHAPES3),others=shuffle(SHAPES3.filter(x=>x!==t)).slice(0,3),tt=L===3?`哪一个${t.f}？`:`哪一个像${t.zh}？`;return{title:tt,say:tt,html:h=>h?`<div class="hintbox">💡 ${t.zh}：${t.f}</div>`:'',big:true,ans:t.zh,opts:shuffle([t,...others]).map(x=>({v:x.zh,l:x.e})),explain:`${t.e} 像<b>${t.zh}</b>：${t.f}`,sayAns:`这个像${t.zh}`}}},

 clock:{zh:'认识时钟',e:'🕒',fig:'clock',hue:'#FFD6A5',d:'现在几点？',l1:'整点（3 点）',l2:'整点和半点（3 点半）',l3:'15 分、半点、45 分',how:'短针（时针）指着几，就是几点。长针（分针）指着 12 是「整点」，指着 6 是「半」。困难关：长针指着 3 是 15 分，指着 9 是 45 分。',
  gen:L=>{const h=rnd(1,12),m=L===1?0:L===2?(Math.random()<0.6?30:0):pick([0,15,30,45,15,45]),lb=(x,mm)=>x+' 点'+(mm===30?'半':mm?' '+mm+' 分':''),ans=lb(h,m);const n=x=>(x+11)%12+1;
   const cand=L===1?[n(h+1),n(h-1),n(h+3),n(h+6)].map(x=>lb(x,0)):L===2?[lb(h,30-m),lb(n(h+1),m),lb(n(h-1),30-m),lb(n(h+1),30-m),lb(n(h+6),m)]:[lb(h,(m+15)%60),lb(h,(m+30)%60),lb(h,(m+45)%60),lb(n(h+1),m),lb(n(h-1),m)];
   const opts=shuffle([ans,...shuffle([...new Set(cand)].filter(x=>x!==ans)).slice(0,3)]).map(v=>({v,l:v})),mp={0:'12，是「整点」',15:'3，是「15 分」',30:'6，是「半」',45:'9，是「45 分」'}[m];
   return{title:'现在是几点？',say:'现在是几点？',html:hn=>clockSvg(h,m)+(hn?`<div class="hintbox">💡 短针${m?'在 '+h+' 和 '+n(h+1)+' 中间（刚过 '+h+'）':'指着 '+h}，长针指着 ${mp}</div>`:''),ans,opts,
    explain:`短针${m?'刚过 '+h:'指着 '+h}，长针指着 ${mp}，所以是 <b>${ans}</b>。`,sayAns:'现在是'+h+'点'+(m===30?'半':m?m+'分':'')}}},
 story:{zh:'应用题',e:'📖',hue:'#FFCFE3',d:'听故事，算一算',l1:'10 以内',l2:'20 以内',l3:'50 以内',how:'先听故事：东西「合起来、又来了、再给」用加法 +；「吃掉、飞走、拿走」用减法 −。按「💡 提示」会画出图来帮你数。',
  gen:L=>{const st=pick(STORIES),max=[0,10,20,50][L];let a,b;if(st.op>0){a=rnd(L===3?11:1,max-(L===3?9:2));b=rnd(L===3?2:1,Math.min(9,max-a))}else{a=rnd([0,3,11,21][L],max);b=rnd(L===3?2:1,Math.min(9,a-1))}const ans=st.op>0?a+b:a-b,t=st.t(a,b);
   return{title:`<span style="font-size:24px;line-height:1.5">${t}</span>`,say:t,html:h=>h?(L===3?'':st.op>0?`<div class="eq">${objs(a,st.e,{row:5})}<span class="sym">+</span>${objs(b,st.e2||st.e,{row:5})}</div>`:objs(a,st.e,{cross:b,row:L===1?5:10}))+`<div class="hintbox">💡 ${st.op>0?'合起来，用加法：'+a+' + '+b:'拿走了，用减法：'+a+' − '+b}</div>`:`<div style="font-size:64px">${st.e}</div>`,ans,opts:numOpts(ans,0,60),
    explain:`${st.op>0?'合起来用加法':'拿走了用减法'}：${a} ${st.op>0?'+':'−'} ${b} = <b>${ans}</b> ${st.unit}`,sayAns:`${a}${st.op>0?'加':'减'}${b}等于${ans}`}}},
 money:{zh:'认识钱币',e:'💰',hue:'#B8E07A',d:'一共有多少钱',l1:'令吉纸币（RM）',l2:'仙硬币（sen）',l3:'更多纸币（RM50 以内）',how:'把每张钱上的数字加起来，就是一共有多少钱。按「💡 提示」会写出加法算式。',
  gen:L=>{if(L!==2){const mx=L===1?20:50;let ns;do{ns=Array.from({length:L===1?rnd(2,3):rnd(3,5)},()=>pick([1,1,5,10]))}while(sumOf(ns)>mx||L===3&&sumOf(ns)<21);const s=sumOf(ns);
    return{title:'一共有多少钱？',say:'一共有多少令吉？',html:h=>`<div>${ns.map(v=>`<span class="note n${v}">RM${v}</span>`).join('')}</div>${h?`<div class="hintbox">💡 ${ns.join(' + ')} = ?</div>`:''}`,ans:s,opts:numOpts(s,1,60,1,v=>'RM'+v),explain:`${ns.map(v=>'RM'+v).join(' + ')} = <b>RM${s}</b>`,sayAns:`一共${s}令吉`}}
   let cs;do{cs=Array.from({length:rnd(2,4)},()=>pick([10,20,50]))}while(sumOf(cs)>100);const s=sumOf(cs);
   return{title:'一共有多少钱？',say:'一共有多少仙？',html:h=>`<div>${cs.map(v=>`<span class="coin">${v}<small>sen</small></span>`).join('')}</div>${h?`<div class="hintbox">💡 ${cs.join(' + ')} = ?</div>`:''}`,ans:s,opts:numOpts(s,10,100,10,v=>v===100?'100 sen<br><small>= RM1</small>':v+' sen'),explain:`${cs.map(v=>v+' sen').join(' + ')} = <b>${s} sen</b>${s===100?'，也就是 RM1':''}`,sayAns:`一共${s}仙`}}},
 place3:{yr:2,zh:'1000 以内的数',e:'💯',hue:'#B5DCFF',d:'百位、十位、个位',l1:'数一数方块',l2:'这个数字代表多少',how:'一个数可以分成百位、十位、个位。🟦 大方块是 100，🟩 长条是 10，🟨 小方块是 1。345 = 3 个百 + 4 个十 + 5 个一。',
  gen:L=>{if(L===1){const n=rnd(1,9)*100+rnd(0,9)*10+rnd(0,9),[h,t,o]=dg(n);const sw=[h*100+o*10+t,t*100+h*10+o,n+10,n-10,n+100,n-100].filter(x=>x>=100&&x<=999&&x!==n);
     const opts=shuffle([n,...shuffle([...new Set(sw)]).slice(0,3)]).map(v=>({v,l:String(v)}));
     return{title:'这些方块一共是多少？',say:'这些方块一共是多少？',html:hn=>blocks(n)+(hn?`<div class="hintbox">💡 ${h} 个百 + ${t} 个十 + ${o} 个一 = ${h*100} + ${t*10} + ${o}</div>`:''),ans:n,opts,
      explain:`${h} 个百、${t} 个十、${o} 个一：${h*100} + ${t*10} + ${o} = <b>${n}</b>`,sayAns:`一共是${n}`}}
   let n,ds;do{n=rnd(102,987);ds=dg(n)}while(new Set(ds).size<3||ds.includes(0));const pos=rnd(0,2),d=ds[pos],val=d*[100,10,1][pos],nm=['百位','十位','个位'][pos];
   const hl=String(n).split('').map((c,i)=>i===pos?`<b style="color:var(--bad)">${c}</b>`:c).join('');
   return{title:`${n} 里的红色 ${d} 代表多少？`,say:`${n}里的${d}，代表多少？`,html:hn=>`<div style="font-size:72px;font-weight:800;letter-spacing:6px">${hl}</div>`+(hn?`<div class="hintbox">💡 从右边数：个位、十位、百位。${d} 在${nm}</div>`:''),ans:val,
    opts:shuffle([d*100,d*10,d,d*100+d]).map(v=>({v,l:String(v)})),explain:`${d} 在<b>${nm}</b>，代表 <b>${val}</b>。`,sayAns:`${d}在${nm}，代表${val}`}}},
 addsub3:{yr:2,fig:'subtract',zh:'加减法 1000 以内',e:'🧮',hue:'#93E3BE',d:'用直式算一算',l1:'不用进位 / 退位',l2:'要进位 / 退位',how:'把数字对齐：个位对个位、十位对十位。从个位开始算。加法满十要「进一」到前一位；减法不够减要向前一位「借一」。',
  gen:L=>{const add=Math.random()<0.5;let a,b;
   if(L===1){if(add){const x=dg(rnd(100,899));const y=x.map((v,i)=>rnd(i?0:1,Math.min(9-v,i?9:8)));a=x[0]*100+x[1]*10+x[2];b=y[0]*100+y[1]*10+y[2]}
     else{const x=dg(rnd(200,999));const y=x.map((v,i)=>rnd(0,i?v:Math.max(0,v-1)));a=x[0]*100+x[1]*10+x[2];b=y[0]*100+y[1]*10+y[2];if(b<10)b+=10*Math.min(1,x[1])}}
   else{do{a=rnd(100,899);b=rnd(10,add?999-a:a-1)}while(add?((a%10)+(b%10)<10&&(Math.floor(a/10)%10)+(Math.floor(b/10)%10)<10):((a%10)>=(b%10)&&(Math.floor(a/10)%10)>=(Math.floor(b/10)%10)))}
   const ans=add?a+b:a-b,op=add?'+':'−';
   return{title:`${a} ${op} ${b} = ?`,say:`${a}${add?'加':'减'}${b}等于多少？`,html:h=>colCalc(a,b,op,null)+(h?`<div class="hintbox">💡 从个位开始${add?'加：满十就进一到十位':'减：不够减就向十位借一'}。个位：${a%10} ${op} ${b%10}</div>`:''),ans,
    opts:nearOpts(ans,0,1000,[1,10,100,9]),explain:colCalc(a,b,op,ans)+`${a} ${op} ${b} = <b>${ans}</b>`,sayAns:`${a}${add?'加':'减'}${b}等于${ans}`}}},
 mul:{yr:2,fig:'times',zh:'乘法',e:'✖️',hue:'#FFC56B',d:'几组，每组几个',l1:'看图：几组几个',l2:'乘法表 2、3、4、5、10',how:'乘法就是很多个一样的数加起来。3 组，每组 4 个：4 + 4 + 4 = 12，写成 3 × 4 = 12。',
  gen:L=>{if(L===1){const g=rnd(2,5),k=rnd(2,5),e=pick(OBJ),ans=g*k;
     return{title:`${g} 组，每组 ${k} 个，一共几个？`,say:`${g}组，每组${k}个，一共有几个？`,html:h=>`<div class="eq">${Array.from({length:g},()=>`<span class="grp">${objs(k,e)}</span>`).join('')}</div>`+(h?`<div class="hintbox">💡 ${Array(g).fill(k).join(' + ')} = ? 也可以写成 ${g} × ${k}</div>`:''),ans,
      opts:nearOpts(ans,1,50,[1,2,k]),explain:`${Array(g).fill(k).join(' + ')} = <b>${ans}</b>，就是 ${g} × ${k} = ${ans}`,sayAns:`${g}乘${k}等于${ans}`}}
   const k=pick([2,3,4,5,10]),m=rnd(1,10),ans=k*m;
   return{title:`${m} × ${k} = ?`,say:`${m}乘${k}等于多少？`,html:h=>h?`<div class="hintbox">💡 ${k} 个 ${k} 个数：${Array.from({length:m},(_,i)=>k*(i+1)).map((v,i)=>i===m-1?'?':v).join('、')}</div>`:'',ans,
    opts:nearOpts(ans,0,100,[k,1,2]),explain:`${m} 个 ${k}：${Array.from({length:m},(_,i)=>k*(i+1)).join('、')}，所以 ${m} × ${k} = <b>${ans}</b>`,sayAns:`${m}乘${k}等于${ans}`}}},
 div:{yr:2,fig:'divide',zh:'除法',e:'➗',hue:'#FFB3B3',d:'平分给大家',l1:'看图：平分',l2:'除法 ÷ 2、3、4、5、10',how:'除法就是平分：每个人分到一样多。12 个分给 3 个人，每人 4 个，写成 12 ÷ 3 = 4。想乘法也可以：3 × ? = 12。',
  gen:L=>{if(L===1){const pp=rnd(2,4),each=rnd(1,5),tot=pp*each,e=pick(['🍬','🍪','🍓','⭐','🎈']);
     return{title:`${tot} 个${e}平分给 ${pp} 个人，每人几个？`,say:`${tot}个，平分给${pp}个人，每人分到几个？`,html:h=>(h?`<div class="eq">${Array.from({length:pp},(_,i)=>`<span class="grp">${PEOPLE[i]} ${objs(each,e)}</span>`).join('')}</div><div class="hintbox">💡 一个一个轮流分，每人分到一样多</div>`:`<div>${objs(tot,e,{row:6})}</div><div style="font-size:44px">${PEOPLE.slice(0,pp).join(' ')}</div>`),ans:each,
      opts:nearOpts(each,1,12,[1,2]),explain:`${tot} ÷ ${pp} = <b>${each}</b>，每人分到 ${each} 个`,sayAns:`${tot}除以${pp}等于${each}`}}
   const k=pick([2,3,4,5,10]),q=rnd(1,10),a=k*q;
   return{title:`${a} ÷ ${k} = ?`,say:`${a}除以${k}等于多少？`,html:h=>h?`<div class="hintbox">💡 想乘法：${k} × ? = ${a}</div>`:'',ans:q,opts:nearOpts(q,1,10,[1,2]),explain:`因为 ${k} × ${q} = ${a}，所以 ${a} ÷ ${k} = <b>${q}</b>`,sayAns:`${a}除以${k}等于${q}`}}},
 frac:{yr:2,zh:'分数',e:'🍕',hue:'#FFD1D1',d:'二分之一、四分之一',l1:'涂色的是多少？',l2:'一半、四分之一是几个？',how:'把一个东西分成一样大的几份，其中的一份就是分数。分成 2 份，1 份是二分之一 ½；分成 4 份，1 份是四分之一 ¼，3 份是四分之三 ¾。',
  gen:L=>{if(L===1){const c=pick([['1/2',2,1],['1/4',4,1],['3/4',4,3],['1',2,2],['1/3',3,1]]),shape=pick(['circle','rect']);const keys=shuffle(Object.keys(FR).filter(k=>k!==c[0])).slice(0,3);
     return{title:'涂了颜色的部分是多少？',say:'涂了颜色的部分是多少？',html:h=>fracSvg(c[1],c[2],shape)+(h?`<div class="hintbox">💡 分成了 ${c[1]} 份一样大的，涂了 ${c[2]} 份</div>`:''),big:true,ans:c[0],opts:shuffle([c[0],...keys]).map(k=>({v:k,l:lab(FR[k][0],FR[k][1])})),
      explain:`分成 ${c[1]} 份一样大的，涂了 ${c[2]} 份，就是 <b>${FR[c[0]][1]} ${FR[c[0]][0]}</b>`,sayAns:FR[c[0]][1]}}
   const half=Math.random()<0.5,d=half?2:4,n=d*rnd(1,5),ans=n/d,e=pick(OBJ),nm=half?'二分之一 ½':'四分之一 ¼';
   return{title:`${n} 个${e}的${nm}是几个？`,say:`${n}个的${half?'二分之一':'四分之一'}是几个？`,html:h=>h?`<div class="eq">${Array.from({length:d},()=>`<span class="grp">${objs(ans,e)}</span>`).join('')}</div><div class="hintbox">💡 平分成 ${d} 份，一份有几个？</div>`:`<div>${objs(n,e,{row:10})}</div>`,ans,
    opts:nearOpts(ans,1,20,[1,2,ans]),explain:`${n} 平分成 ${d} 份，一份是 <b>${ans}</b> 个：${n} ÷ ${d} = ${ans}`,sayAns:`${n}个的${half?'二分之一':'四分之一'}是${ans}个`}}},
 measure:{yr:2,zh:'长度与重量',e:'📏',hue:'#A4E2F0',d:'厘米、米、克、公斤',l1:'用什么单位？',l2:'用尺量一量',how:'短的东西用厘米（cm），长的用米（m）；轻的东西用克（g），重的用公斤（kg）；少的水用毫升（ml），多的水用公升（l）。用尺量东西要从 0 开始。',
  gen:L=>{if(L===1){const it=pick(UNITQ),ans=UNITS[it[2]][it[3]],other=Object.keys(UNITS).filter(k=>k!==it[2]).map(k=>pick(UNITS[k]));
     return{title:`${it[1]}，用哪一个单位比较好？`,say:`${it[1]}，用哪一个单位比较好？`,html:h=>`<div style="font-size:80px;line-height:1.1">${it[0]}</div>`+(h?`<div class="hintbox">💡 ${it[2]==='len'?'是长度：短的用厘米，长的用米':it[2]==='mass'?'是重量：轻的用克，重的用公斤':'是水的多少：少的用毫升，多的用公升'}</div>`:''),ans,
      opts:shuffle([...UNITS[it[2]],...other]).map(v=>({v,l:v})),explain:`${it[1]}${it[3]?'比较大，':'比较小，'}用 <b>${ans}</b>`,sayAns:`用${ans.split(' ')[0]}`}}
   const len=rnd(3,14),e=pick(['铅笔','蜡笔','钥匙']);
   return{title:`这支${e}有几厘米长？`,say:`这支${e}有几厘米长？`,html:h=>rulerSvg(len)+(h?'<div class="hintbox">💡 从 0 开始，看尖尖的那一头对着几</div>':''),ans:len,opts:nearOpts(len,1,15,[1,2]).map(o=>({v:o.v,l:o.v+' cm'})),explain:`从 0 量到 ${len}，所以是 <b>${len} 厘米</b>`,sayAns:`${len}厘米`}}},
 fraclife:{yr:2,zh:'分一分',e:'🍉',hue:'#FFCDD2',d:'二分之一、四分之一',l1:'是不是一样大？',l2:'吃了几分之几？',how:'分数要「分成大小相同的部分」。整个西瓜切成两个大小相同的部分，一份就是二分之一（一半）；切成四个大小相同的部分，一份就是四分之一。',
  gen:L=>{const kind=L===1?pick(['eq','eq','half']):pick(['eat','eat','half']);
   if(kind==='eq'){const eq=Math.random()<0.5,sh=pick(['rect','circle']);
     return{title:'涂了颜色的部分是不是二分之一？',say:'涂了颜色的部分是不是二分之一？',html:h=>splitSvg(eq,sh)+(h?'<div class="hintbox">💡 二分之一要分成两个「大小相同」的部分。两边一样大吗？</div>':''),big:true,ans:eq?'y':'n',
      opts:[{v:'y',l:lab('✅','是')},{v:'n',l:lab('❌','不是')}],explain:eq?'分成了两个大小相同的部分，涂色的一份是 <b>二分之一</b>。':'两个部分<b>不一样大</b>，所以不是二分之一。要分成大小相同的两份才是二分之一。',sayAns:eq?'是二分之一':'不是二分之一'}}
   if(kind==='half'){const f=pick(FOODS);return{title:`把整个${f[1]}分成两个大小相同的部分，一半是几分之几？`,say:`一半是几分之几？`,html:h=>`<div style="font-size:72px">${pic({e:f[0],zh:f[1]})}</div>`+(h?'<div class="hintbox">💡 分成 2 份，拿 1 份</div>':''),big:true,ans:'1/2',
      opts:shuffle(['1/2','1/4','3/4','1']).map(k=>({v:k,l:lab(FR[k][0],FR[k][1])})),explain:`一半也是 <b>二分之一 ½</b>：分成 2 个大小相同的部分，拿其中 1 个。`,sayAns:'一半也是二分之一'}}
   const f=pick(FOODS),n=pick([2,4]),k=n===4?pick([1,1,3]):1,ans=n===2?'1/2':k===1?'1/4':'3/4',who=pick(['欣儿','哥哥','妹妹','小明']);
   return{title:`${who}把${f[1]}分成 ${n} 个大小相同的部分，吃了其中 ${k} 个部分。${who}吃了这个${f[1]}的几分之几？`,say:`${who}把${f[1]}分成${n}个大小相同的部分，吃了其中${k}个部分。吃了几分之几？`,
    html:h=>`<div style="font-size:72px">${pic({e:f[0],zh:f[1]})}</div>`+(h?`<div>${fracSvg(n,k,'circle')}</div><div class="hintbox">💡 分成 ${n} 份，吃了 ${k} 份</div>`:''),big:true,ans,
    opts:shuffle(['1/2','1/4','3/4','1']).map(x=>({v:x,l:lab(FR[x][0],FR[x][1])})),explain:`分成 ${n} 个大小相同的部分，吃了 ${k} 个，就是 <b>${FR[ans][1]} ${FR[ans][0]}</b>。`,sayAns:`吃了${FR[ans][1]}`}}},
 calendar:{zh:'日历',e:'🗓️',hue:'#FFF59D',d:'星期和月份',l1:'星期几？',l2:'几月？',how:'一个星期有 7 天：星期一、二、三、四、五、六、日，然后又从星期一开始。一年有 12 个月：一月到十二月，然后又是新的一年。',
  gen:L=>{const r=Math.random();
   if(r<0.15){const wk=L===1;return{title:wk?'一个星期有几天？':'一年有几个月？',say:wk?'一个星期有几天？':'一年有几个月？',html:h=>`<div style="font-size:80px;line-height:1.1">${icoSvg(wk?'@cal1':'@mon1')}</div>`+(h?`<div class="hintbox">💡 数一数：${(wk?WEEKZ:MONZ).join('、')}</div>`:''),big:true,ans:wk?'7':'12',
     opts:shuffle(wk?['5','6','7','8']:['10','11','12','7']).map(x=>({v:x,l:x})),explain:wk?'一个星期有 <b>7</b> 天。':'一年有 <b>12</b> 个月。',sayAns:wk?'一个星期有7天':'一年有12个月'}}
   return L===1?calQ(WEEKZ,'天','cal'):calQ(MONZ,'个月','mon')}}
};
const mathCards=()=>byYear(Object.entries(MG),gameCard);
function mathPanel(){const rows=Object.entries(MG).map(([k,g])=>{const r=S.math[k]||{c:0,w:0},t=r.c+r.w,acc=t?Math.round(r.c*100/t):0;
  return `<div style="font-weight:700">${g.e} ${g.zh}${g.yr===2?' <span class="zh" style="font-size:13px">二年级</span>':''}</div><div class="mrow"><div class="meter"><i style="width:${acc}%;background:var(--sun)"></i></div>${t?'答对 '+r.c+' 题 · '+acc+'%':'还没玩过'}</div>`}).join('');
  return `<div class="panel"><h2>数学 🔢</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">黄色条＝第一次就答对的比例</div><div class="bars2">${rows}</div></div>`}
