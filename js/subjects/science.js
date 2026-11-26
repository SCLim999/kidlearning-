/* ---------------- 科学 Science ---------------- */
const lab=(e,t)=>`<span>${e}</span><small>${t}</small>`;
const bigItem=(e,t)=>`<div class="sitem"><div class="se">${e}</div><div class="st">${t}</div></div>`;
const LIVE1=[['🐶','小狗',1],['🌳','大树',1],['🐟','鱼',1],['🌻','向日葵',1],['👶','婴儿',1],['🐦','小鸟',1],['🪨','石头',0],['🧸','玩具熊',0],['✏️','铅笔',0],['📱','手机',0],['🪑','椅子',0],['⚽','足球',0]];
const LIVE2=[['🍄','蘑菇',1,'蘑菇会长大，也需要水'],['🌱','小树苗',1,'小树苗会慢慢长大'],['🐛','毛毛虫',1,'毛毛虫会吃东西、会长大'],['🌵','仙人掌',1,'仙人掌不会走路，但会长大，也需要水'],['🚗','汽车',0,'汽车会动，但不会长大，也不会呼吸'],['🤖','机器人',0,'机器人会动也会说话，但不会呼吸、不会长大'],['🔥','火',0,'火会变大，但它不会呼吸，也不需要食物'],['☁️','云',0,'云会飘来飘去，但不会呼吸、不需要食物'],['🎈','气球',0,'气球会飞，但它不会长大'],['🐚','空贝壳',0,'空贝壳里已经没有小动物，不会长大']];
const SENSE={eye:['👁️','眼睛','看'],ear:['👂','耳朵','听'],nose:['👃','鼻子','闻'],tongue:['👅','舌头','尝'],skin:['✋','皮肤','摸']};
const SITEMS=[['🌈','彩虹的颜色','eye'],['📺','电视上的画面','eye'],['🌙','天上的月亮','eye'],['🔔','叮当叮当的铃声','ear'],['🐶','小狗汪汪叫','ear'],['🎵','好听的音乐','ear'],['🌸','香香的花','nose'],['🗑️','臭臭的垃圾','nose'],['🍞','面包的香味','nose'],['🍋','酸酸的柠檬','tongue'],['🍬','甜甜的糖果','tongue'],['🧂','咸咸的盐','tongue'],['🧊','冷冷的冰块','skin'],['🌵','刺刺的仙人掌','skin'],['🧸','软软的玩具熊','skin']];
const ANM={'🐦':'小鸟','🦋':'蝴蝶','🐝':'蜜蜂','🦆':'鸭子','🐟':'鱼','🦈':'鲨鱼','🐢':'乌龟','🐌':'蜗牛','🐮':'牛','🐐':'山羊','🦏':'犀牛','🐔':'鸡','🐍':'蛇','🐊':'鳄鱼','🐱':'猫','🐰':'兔子','🐶':'狗'};
const FEAT1=[{f:'翅膀',y:['🐦','🦋','🐝','🦆'],n:['🐟','🐱','🐢','🐍','🐮','🐰','🐌'],w:'翅膀帮助它飞'},{f:'鳍',y:['🐟','🦈'],n:['🐦','🐱','🐰','🐮','🐔','🦋'],w:'鳍帮助它在水里游'},{f:'壳',y:['🐢','🐌'],n:['🐟','🐱','🐦','🐮','🐰','🐍'],w:'硬硬的壳保护它的身体'},{f:'角',y:['🐮','🐐','🦏'],n:['🐱','🐦','🐟','🐰','🐍','🐔'],w:'角帮助它保护自己'}];
const FEAT2=[{f:'羽毛',y:['🐦','🐔','🦆'],n:['🐱','🐟','🐢','🐮','🐍','🦋'],w:'羽毛让它保暖，也帮助它飞'},{f:'鳞片',y:['🐟','🐍','🐊'],n:['🐱','🐰','🐮','🦋','🐶'],w:'鳞片保护它的身体'},{f:'喙（尖尖的嘴）',y:['🐦','🐔','🦆'],n:['🐱','🐟','🐶','🐮','🐰','🐍'],w:'它用喙来啄食物'}];
const PARTS={root:['根','把植物抓紧在泥土里，还会吸水'],stem:['茎','撑起植物，把水送到叶子'],leaf:['叶','用阳光制造食物'],flower:['花','以后会变成果实和种子']};
function plantSvg(part,show){const hl={root:'<ellipse cx="80" cy="168" rx="38" ry="28"',stem:'<rect x="66" y="62" width="28" height="80" rx="10"',leaf:'<ellipse cx="58" cy="100" rx="30" ry="20"',flower:'<circle cx="80" cy="46" r="27"'}[part];
  const lx={root:128,stem:110,leaf:16,flower:118}[part],ly={root:170,stem:104,leaf:72,flower:30}[part];
  return `<svg viewBox="0 0 160 200" width="200" height="250" aria-hidden="true"><rect x="0" y="140" width="160" height="60" rx="8" fill="#C8A27A"/>
  <path d="M80 140 L80 182 M80 150 L60 174 M80 156 L102 180 M80 168 L68 192 M80 166 L94 194" stroke="#7B4A2A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <line x1="80" y1="140" x2="80" y2="58" stroke="#3E9E4F" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="58" cy="100" rx="22" ry="9" fill="#6FD6A8" stroke="#2E7D3E" stroke-width="2" transform="rotate(-25 58 100)"/><ellipse cx="102" cy="86" rx="22" ry="9" fill="#6FD6A8" stroke="#2E7D3E" stroke-width="2" transform="rotate(25 102 86)"/>
  ${[0,72,144,216,288].map(a=>`<circle cx="${80+11*Math.cos(a*Math.PI/180)}" cy="${46+11*Math.sin(a*Math.PI/180)}" r="9" fill="#FF8FB1"/>`).join('')}<circle cx="80" cy="46" r="7" fill="#FFD23F"/>
  ${hl} fill="none" stroke="#FF3B6B" stroke-width="4" stroke-dasharray="7 5"/>
  <text x="${lx}" y="${ly}" font-size="${show?16:26}" font-weight="800" fill="#FF3B6B" font-family="inherit">${show?PARTS[part][0]:'?'}</text></svg>`}
const NEEDS=[['🌻','植物',['💧 水','☀️ 阳光','💨 空气']],['🐶','动物',['💧 水','🍖 食物','💨 空气']],['👦','人',['💧 水','🍚 食物','💨 空气','🏠 住的地方']]];
const NOTNEED=['🍬 糖果','📺 电视','🧸 玩具','📱 手机','🎮 游戏机','👟 新鞋子'];
const MAGY=[['📎','回形针'],['🔩','螺丝'],['🧷','安全别针'],['📌','图钉'],['🪝','铁钩子']];
const MAGN=[['✏️','铅笔'],['🧸','玩具熊'],['📄','纸'],['🥤','塑料杯'],['🍎','苹果'],['🪵','木头'],['👕','衣服'],['🥛','玻璃杯']];
function magSvg(a,b,c,d){const col=p=>p==='N'?'#FF6B6B':'#5AB8FF';const bar=(x,p,q)=>`<rect x="${x}" y="20" width="50" height="40" fill="${col(p)}" stroke="#2A2F6B" stroke-width="3"/><rect x="${x+50}" y="20" width="50" height="40" fill="${col(q)}" stroke="#2A2F6B" stroke-width="3"/><text x="${x+25}" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${p}</text><text x="${x+75}" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${q}</text>`;
  return `<svg viewBox="0 0 280 80" width="100%" style="max-width:420px" aria-hidden="true">${bar(10,a,b)}${bar(170,c,d)}<text x="140" y="48" text-anchor="middle" font-size="22" fill="#6B70A8">⟷</text></svg>`}
const ABY=[['🧽','海绵'],['🧻','纸巾'],['🧦','棉袜子'],['👕','棉 T 恤']];
const ABN=[['🥄','铁汤匙'],['🥤','塑料杯'],['☂️','雨伞'],['🍽️','盘子'],['🪙','硬币'],['🔑','钥匙']];
const ABS2=[{q:'牛奶打翻了，用什么擦干桌子？',a:['🧽','海绵'],w:'海绵会吸水，可以把牛奶吸干'},{q:'下雨天出门，用什么挡雨？',a:['☂️','雨伞'],w:'雨伞不吸水，雨水会流走，不会弄湿我们'},{q:'下雨天穿哪一双鞋比较好？',a:['👢','雨靴'],w:'雨靴是胶做的，不吸水，脚不会湿'},{q:'流鼻涕了，用什么擦？',a:['🧻','纸巾'],w:'纸巾软软的，很会吸水'},{q:'装水来喝，用哪一个？',a:['🥤','塑料杯'],w:'塑料杯不吸水，水不会渗出来'}];
const ABSPOOL=[['🧽','海绵'],['🧻','纸巾'],['🧦','棉袜子'],['☂️','雨伞'],['👢','雨靴'],['🥤','塑料杯'],['📄','纸'],['🧸','布娃娃']];
const RULE1=[['🚶','排好队走进科学室',1],['🏃','在科学室里跑来跑去',0],['🍔','在科学室里吃东西',0],['🙋','有问题先举手问老师',1],['🧹','离开前把桌子收拾干净',1],['🧪','偷偷把药水放进嘴里尝',0],['📢','在科学室里大声吵闹',0],['👂','安静听老师讲解',1]];
const RULE2=[['🧼','做完实验要洗手',1],['🔥','自己拿火柴来玩',0],['🩹','受伤了马上告诉老师',1],['🤚','老师还没允许就去碰仪器',0],['🗑️','把垃圾丢进垃圾桶',1],['💦','把水泼到同学身上',0],['👂','仔细听老师的指示',1],['📋','照着老师说的步骤做实验',1],['👃','把鼻子凑近去闻不认识的药水',0]];
const SOILY=[['💧','水','泥土里有水，植物的根会吸水'],['💨','空气','泥土的小空隙里有空气'],['🪨','小石头','泥土里常常有小石头'],['🍂','枯叶','枯叶烂掉以后变成泥土的养分'],['🪱','蚯蚓','蚯蚓住在泥土里，帮泥土松土'],['🐜','蚂蚁','很多蚂蚁在泥土里做窝']];
const SOILN=[['🧸','玩具熊'],['📱','手机'],['🍦','冰淇淋'],['📺','电视'],['🎈','气球'],['👟','新鞋子']];
const SOILT={sand:['🏖️','沙土'],clay:['🏺','黏土'],garden:['🪴','园土']};
const SOILQ=[{q:'哪一种泥土最适合种花和种菜？',a:'garden',w:'园土里有很多烂掉的枯叶，养分多，植物长得好'},{q:'倒水下去，水最快流走的是哪一种泥土？',a:'sand',w:'沙土的沙粒大，中间空隙多，水很快就流下去'},{q:'哪一种泥土最能留住水，摸起来黏黏的？',a:'clay',w:'黏土的颗粒很细，水不容易流走'},{q:'哪一种泥土可以用来捏陶土公仔？',a:'clay',w:'黏土黏黏的，可以捏成各种形状'},{q:'海边沙滩上的是哪一种泥土？',a:'sand',w:'沙滩上都是沙粒，就是沙土'},{q:'蚯蚓喜欢住在哪一种泥土里？',a:'garden',w:'园土湿湿的，有很多烂掉的枯叶，是蚯蚓的食物'},{q:'哪一种泥土摸起来粗粗的、沙沙的？',a:'sand',w:'沙土的颗粒比较大，摸起来粗粗的'},{q:'哪一种泥土颜色比较深，里面有很多枯叶？',a:'garden',w:'园土有很多烂掉的枯叶，所以颜色比较深'}];
/* ---- 科学 二年级 (Year 2): growth of humans, animals, plants; light ---- */
function qPick(it){return{title:it.q,say:it.q,html:h=>(it.big?`<div style="font-size:80px;line-height:1.1">${it.big}</div>`:'')+(h?`<div class="hintbox">💡 ${it.h}</div>`:''),big:true,ans:it.a[1],
  opts:shuffle([it.a,...it.n]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${it.a[0]} <b>${it.a[1]}</b>：${it.w}。`,sayAns:it.a[1]+'。'+it.w}}
function qNext(st,name,hint){const back=Math.random()<0.5,i=back?rnd(1,st.length-1):rnd(0,st.length-2),c=st[i],a=st[back?i-1:i+1];const others=shuffle(st.filter(x=>x!==c&&x!==a)).slice(0,3);
  const word=back?'前面':'下一个',chain=st.map((x,j)=>x===a?'？':x[1]).join(' → ');
  return{title:`${c[0]} ${c[1]}，${word}是什么？`,say:`${name}：${c[1]}，${word}是什么？`,html:h=>`<div style="font-size:80px;line-height:1.1">${c[0]}</div>`+(h?`<div class="hintbox">💡 ${hint}：${chain}</div>`:''),big:true,ans:a[1],
   opts:shuffle([a,...others]).map(x=>({v:x[1],l:lab(x[0],x[1])})),explain:`${name}：${st.map(x=>x[1]).join(' → ')}。${c[1]}的${word}是<b>${a[1]}</b>。`,sayAns:`${c[1]}的${word}是${a[1]}`}}
const HUMAN=[['👶','婴儿'],['🧒','小孩'],['🧑','少年'],['👨','大人'],['🧓','老人']];
const GROW2=[
 {q:'我们长大的时候，身体会有什么改变？',a:['📏','长高、变重'],n:[['⬇️','变矮'],['🪶','变轻'],['🚫','一直不变']],h:'想一想：你现在和婴儿的时候比，哪里不一样？',w:'人长大的时候会长高，体重也会增加'},
 {q:'哪一样帮助我们健康长大？',a:['🥦','吃有营养的食物'],n:[['🍬','吃很多糖果'],['📱','整天玩手机'],['🌙','很晚才睡觉']],h:'身体需要好的食物才有力量',w:'有营养的食物给身体力量，帮助我们长大'},
 {q:'哪一样也能帮助我们长高、长壮？',a:['🏃','多运动'],n:[['🛋️','整天躺着'],['🥤','喝很多汽水'],['🎮','一直玩游戏']],h:'要让身体动一动哦',w:'运动让骨头和肌肉更强壮'},
 {q:'小时候穿的鞋子，现在为什么穿不下了？',a:['🧒','因为我长大了'],n:[['👟','鞋子自己变小了'],['🌧️','因为下雨'],['🧽','鞋子被洗过']],h:'是鞋子变了，还是你变了？',w:'我们的脚会跟着身体一起长大'},
 {q:'婴儿和你比，有什么不一样？',a:['👶','婴儿比较小、比较轻'],n:[['🦷','婴儿的牙齿比较多'],['📏','婴儿比较高'],['🏋️','婴儿比较重']],h:'婴儿要大人抱，因为他们很……',w:'我们小时候也是婴儿，后来慢慢长大'},
 {q:'哪一样习惯会让牙齿健康？',a:['🪥','每天刷牙'],n:[['🍭','睡前吃糖'],['🥤','常常喝汽水'],['🚫','不刷牙']],h:'牙齿也要好好照顾',w:'每天刷牙，牙齿才会健康、坚固'},
 {q:'我们长大以后，哪一样会跟着变大？',a:['🦶','我们的脚'],n:[['🧸','玩具熊'],['📕','课本'],['🪑','椅子']],h:'是身体的一部分哦',w:'我们的身体，包括手和脚，都会慢慢长大'},
 {q:'谁已经长大了，所以比较高？',a:['👨','爸爸'],n:[['👶','婴儿'],['🧒','小孩'],['🐱','小猫']],h:'大人比小孩高',w:'大人已经长大了，所以比小孩和婴儿高'},
 {q:'睡觉对长大有帮助吗？',a:['😴','有，睡得够才长得好'],n:[['🙅','一点帮助也没有'],['🌙','睡得越少越好'],['📺','看电视比睡觉好']],h:'身体在睡觉的时候休息和长大',w:'睡得够，身体才有时间休息和长大'}];
const BABY=[['🥚','蛋','🐥','小鸡'],['🐥','小鸡','🐔','鸡'],['🐛','毛毛虫','🦋','蝴蝶'],['🐶','小狗','🐕','大狗'],['🐱','小猫','🐈','大猫']];
const CYCLES=[{n:'蝴蝶的一生',st:[['🥚','卵'],['🐛','毛毛虫'],['🟫','蛹'],['🦋','蝴蝶']]},{n:'青蛙的一生',st:[['🥚','卵'],['〰️','蝌蚪'],['🐸','小青蛙'],['🐸','青蛙']]},{n:'鸡的一生',st:[['🥚','蛋'],['🐥','小鸡'],['🐔','鸡']]}];
const ANIM2=[{q:'哪一种动物小时候和长大以后长得很不一样？',a:['🦋','蝴蝶'],n:[['🐶','狗'],['🐱','猫'],['🐘','大象']],h:'有一种动物小时候是毛毛虫哦',w:'蝴蝶小时候是毛毛虫，长大以后才有翅膀'},
 {q:'哪一种动物小时候和长大以后长得很不一样？',a:['🐸','青蛙'],n:[['🐄','牛'],['🐰','兔子'],['🐒','猴子']],h:'有一种动物小时候住在水里，有尾巴没有脚',w:'青蛙小时候是蝌蚪，有尾巴，住在水里'}];
const SEED=[['🌰','种子'],['🌱','发芽'],['🌿','幼苗'],['🌻','长大的植物']];
const PLANT2=[
 {q:'种子要发芽，需要哪一样？',a:['💧','水'],n:[['🧂','盐'],['🍬','糖'],['📺','电视']],h:'种子发芽需要水、空气和适合的温度',w:'种子要有水、空气和适合的温度才会发芽'},
 {q:'种子要发芽，还需要哪一样？',a:['💨','空气'],n:[['🧸','玩具'],['🍦','冰淇淋'],['🎵','音乐']],h:'我们要呼吸，种子也需要……',w:'种子要有水、空气和适合的温度才会发芽'},
 {q:'种子发芽的时候，不一定需要哪一样？',a:['☀️','阳光'],n:[['💧','水'],['💨','空气'],['🌡️','适合的温度']],h:'种子埋在泥土里，看得到太阳吗？',w:'种子在黑暗的泥土里也会发芽；发芽以后，小苗才需要阳光'},
 {q:'小苗要长大，需要哪一样？',a:['☀️','阳光'],n:[['🍬','糖果'],['🧸','玩具'],['📱','手机']],h:'植物用阳光来制造食物',w:'植物需要阳光、水和空气，才能制造食物，慢慢长大'},
 {q:'把种子放进冰箱里，会怎样？',a:['🥶','太冷了，不容易发芽'],n:[['🌱','很快就发芽'],['🌻','马上开花'],['🍎','长出果子']],h:'种子发芽需要适合的温度',w:'冰箱太冷，温度不适合，种子不容易发芽'},
 {q:'种子发芽时，最先长出来的通常是什么？',a:['〰️','根'],n:[['🌸','花'],['🍎','果子'],['🍂','枯叶']],h:'它要先往下抓住泥土、吸水',w:'种子发芽时，通常先长出根，往下吸水，再长出芽'},
 {q:'植物长大的时候，会有什么改变？',a:['📏','长高，叶子变多'],n:[['⬇️','变矮'],['🍂','叶子越来越少'],['🚫','一直不变']],h:'想一想小苗和大树有什么不一样',w:'植物会长高，叶子越来越多'}];
const LIGHTY=[['☀️','太阳'],['💡','亮着的电灯'],['🔦','打开的手电筒'],['🕯️','点着的蜡烛']];
const LIGHTN=[['🌙','月亮'],['🪞','镜子'],['📘','书'],['🪨','石头'],['🥄','汤匙']];
const LIGHT2=[
 {q:'影子是怎样形成的？',a:['✋','光被东西挡住了'],n:[['💧','水洒在地上'],['🌬️','风吹过来'],['🎨','用笔画出来']],h:'用手挡住手电筒的光，墙上出现了什么？',w:'光走直线，被东西挡住的地方照不到光，就变成影子'},
 {q:'哪一样东西可以让光穿过去？',a:['🪟','透明的玻璃窗'],n:[['🧱','砖墙'],['📘','书'],['🪵','木板']],h:'哪一样东西是透明的，可以看到另一边？',w:'玻璃是透明的，光可以穿过去'},
 {q:'哪一样东西会挡住光，做出很黑的影子？',a:['🪵','木板'],n:[['🪟','透明玻璃'],['🥛','透明的玻璃杯'],['💧','清水']],h:'不透明的东西，光穿不过去',w:'木板不透明，光穿不过，所以影子很黑'},
 {q:'中午和傍晚，哪一个时候你的影子比较短？',a:['🕛','中午'],n:[['🌇','傍晚'],['🌅','清早']],h:'太阳越高，影子越……',w:'中午太阳差不多在头顶上，所以影子最短'},
 {q:'影子的形状和东西像不像？',a:['✅','很像'],n:[['❌','一点也不像'],['🔺','都是三角形'],['⚪','都是圆形']],h:'看看你自己的影子',w:'影子的形状和挡住光的东西很像'},
 {q:'怎样让墙上的影子变大？',a:['🔦','把东西靠近手电筒'],n:[['🌙','关掉手电筒'],['🧽','把东西洗干净'],['🎨','把东西涂上颜色']],h:'东西离光越近……',w:'东西越靠近光，挡住的光越多，影子就越大'},
 {q:'晚上关了灯，为什么看不见东西？',a:['🌑','因为没有光'],n:[['👀','眼睛坏了'],['😴','东西睡觉了'],['🔇','因为太安静']],h:'我们要靠什么才看得见东西？',w:'要有光照到东西，再进入我们的眼睛，我们才看得见'}];
/* 动物的栖息地 (picture dictionary p.122): [picture, name, habitat, habitats not to offer as wrong answers, ms, en] */
/* 植物的栖息地 (dictionary p.102–103): [icon, 华文, BM, hint, English "grows …"] */
const PHAB={land:['🏞️','陆地','darat','木瓜树、香蕉树、橡胶树、草和玉米都长在陆地上','on land','陆地上'],damprock:['🪨','潮湿的石头','batu lembap','苔喜欢长在阴凉、潮湿的石头上','on damp rock','潮湿的石头上'],water:['💧','水','air','睡莲、浮萍、莲花和凤眼莲长在水里','in water','水里'],desert:['🏜️','沙漠','gurun','仙人掌长在又干又热的沙漠，它把水存在茎里','in the desert','沙漠里'],tree:['🌳','树','pokok','兰花和蕨可以长在大树上','on trees','树上'],beach:['🏖️','海滩','pantai','椰树和松树长在海滩上','on the beach','海滩上'],swamp:['@swamp','沼泽','paya','红树长在沼泽，它的根会伸出泥土','in the swamp','沼泽里']};
const HABH={sea:['🌊','海洋','laut','海洋里有鲨鱼、墨鱼、海龟和鱼'],pond:['@pond','池塘','kolam','池塘里有鱼、乌龟、青蛙和蝌蚪'],underground:['@burrow','地洞','bawah tanah','地洞里住着兔子、蚂蚁和蚯蚓'],grassland:['@grassland','草原','padang rumput','草原上有长颈鹿、斑马和鹿'],
 jungle:['@jungle','森林','hutan','森林里有大象、老虎和狮子'],tree:['🌳','树上','pokok','树上住着猴子、鸟和松鼠'],farm:['@farm','农场','ladang','农场里有牛、羊、鸭和母鸡'],beach:['🏖️','海滩','pantai','海滩上有螃蟹、螺和蚌']};
const HABA=[['🦈','鲨鱼','sea',['beach','pond'],'yu','shark'],['🦑','墨鱼','sea',['beach','pond'],'sotong','cuttlefish'],['🐢','海龟','sea',['beach','pond'],'penyu','turtle'],['🐟','鱼','sea',['pond','beach'],'ikan','fish'],
 ['@tortoise','乌龟','pond',['jungle','grassland','farm'],'kura-kura','tortoise'],['🐸','青蛙','pond',['jungle','tree','farm'],'katak','frog'],['@tadpole','蝌蚪','pond',[],'berudu','tadpole'],
 ['🐇','兔子','underground',['farm','grassland','jungle'],'arnab','rabbit'],['🐜','蚂蚁','underground',['farm','grassland','jungle','tree'],'semut','ant'],['🪱','蚯蚓','underground',['farm','grassland','jungle'],'cacing tanah','earthworm'],
 ['🦒','长颈鹿','grassland',['jungle'],'zirafah','giraffe'],['🦓','斑马','grassland',['jungle'],'kuda belang','zebra'],['🦌','鹿','grassland',['jungle','farm'],'rusa','deer'],
 ['🐘','大象','jungle',['grassland'],'gajah','elephant'],['🐅','老虎','jungle',['grassland'],'harimau','tiger'],['🦁','狮子','jungle',['grassland'],'singa','lion'],
 ['🐒','猴子','tree',['jungle'],'monyet','monkey'],['🐦','鸟','tree',['jungle','farm'],'burung','bird'],['🐿️','松鼠','tree',['jungle'],'tupai','squirrel'],
 ['🐄','牛','farm',['grassland'],'lembu','cow'],['🐐','羊','farm',['grassland'],'kambing','goat'],['🦆','鸭','farm',['pond'],'itik','duck'],['🐔','母鸡','farm',[],'ayam betina','hen'],
 ['🦀','螃蟹','beach',['sea','pond'],'ketam','crab'],['🐌','螺','beach',['sea','pond'],'siput','snail'],['@mussel','蚌','beach',['sea','pond'],'remis','mussel']];
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
