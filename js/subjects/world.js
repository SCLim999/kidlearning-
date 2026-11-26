/* ---------------- 🌍 环游世界: data copied from github.com/SCLim999/world-explorer (flags, 52 countries, landmarks/animals) ---------------- */
const WX=(function(){
function starPts(cx,cy,r,rot){
  rot = rot===undefined ? -90 : rot;
  var p=[];
  for(var i=0;i<10;i++){
    var a=(rot+i*36)*Math.PI/180, rr = (i%2)? r*0.382 : r;
    p.push((cx+rr*Math.cos(a)).toFixed(2)+','+(cy+rr*Math.sin(a)).toFixed(2));
  }
  return p.join(' ');
}
function star(cx,cy,r,fill,rot){return '<polygon points="'+starPts(cx,cy,r,rot)+'" fill="'+(fill||'#fff')+'"/>';}
function hbands(cols){var s='',h=40/cols.length;cols.forEach(function(c,i){s+='<rect y="'+(i*h)+'" width="60" height="'+(h+0.3)+'" fill="'+c+'"/>';});return s;}
function vbands(cols){var s='',w=60/cols.length;cols.forEach(function(c,i){s+='<rect x="'+(i*w)+'" width="'+(w+0.3)+'" height="40" fill="'+c+'"/>';});return s;}
var UJ='<rect width="60" height="40" fill="#012169"/>'+
  '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="9"/>'+
  '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4.5"/>'+
  '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="13"/>'+
  '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="7.5"/>';
var CANTON_UJ='<svg x="0" y="0" width="30" height="20" viewBox="0 0 60 40">'+UJ+'</svg>';

var FLAGS={
  cn:function(){return '<rect width="60" height="40" fill="#EE1C25"/>'+star(11,10,6.5,'#FFDE00')+
      star(21,4,2.2,'#FFDE00')+star(25.5,8.5,2.2,'#FFDE00')+star(25.5,14.5,2.2,'#FFDE00')+star(21,19,2.2,'#FFDE00');},
  jp:function(){return '<rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="11" fill="#BC002D"/>';},
  my:function(){var s='';for(var i=0;i<14;i++)s+='<rect y="'+(i*40/14)+'" width="60" height="'+(40/14+0.3)+'" fill="'+(i%2?'#fff':'#CC0001')+'"/>';
      s+='<rect width="34" height="'+(40/14*8)+'" fill="#010066"/>';
      s+='<circle cx="13" cy="11" r="6.4" fill="#FFCC00"/><circle cx="15.8" cy="11" r="5.4" fill="#010066"/>';
      s+=star(25,11,5,'#FFCC00');return s;},
  sg:function(){var s='<rect width="60" height="40" fill="#fff"/><rect width="60" height="20" fill="#ED2939"/>'+
      '<circle cx="12" cy="10" r="6" fill="#fff"/><circle cx="14.6" cy="10" r="5" fill="#ED2939"/>';
      for(var i=0;i<5;i++){var a=(-90+i*72)*Math.PI/180;s+=star(23+4.6*Math.cos(a),10+4.6*Math.sin(a),1.9,'#fff');}
      return s;},
  us:function(){var s='';for(var i=0;i<13;i++)s+='<rect y="'+(i*40/13)+'" width="60" height="'+(40/13+0.3)+'" fill="'+(i%2?'#fff':'#B22234')+'"/>';
      s+='<rect width="24" height="21.6" fill="#3C3B6E"/>';
      for(var r=0;r<5;r++)for(var c=0;c<6;c++)s+='<circle cx="'+(2.6+c*3.8)+'" cy="'+(2.6+r*4.2)+'" r="1.05" fill="#fff"/>';
      return s;},
  gb:function(){return UJ;},
  fr:function(){return vbands(['#002395','#ffffff','#ED2939']);},
  it:function(){return vbands(['#009246','#ffffff','#CE2B37']);},
  de:function(){return hbands(['#000000','#DD0000','#FFCE00']);},
  ru:function(){return hbands(['#ffffff','#0039A6','#D52B1E']);},
  es:function(){return '<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/>'+
      '<rect x="13" y="15" width="9" height="11" rx="1.5" fill="#AA151B"/><rect x="14.5" y="16.5" width="6" height="8" rx="1" fill="#F1BF00"/>';},
  eg:function(){return hbands(['#CE1126','#ffffff','#000000'])+'<circle cx="30" cy="20" r="3.4" fill="#C09300"/>'+
      '<polygon points="30,14.5 33,19 27,19" fill="#C09300"/>';},
  ke:function(){return '<rect width="60" height="40" fill="#fff"/><rect width="60" height="12" fill="#000"/>'+
      '<rect y="14" width="60" height="12" fill="#BB0000"/><rect y="28" width="60" height="12" fill="#006600"/>'+
      '<ellipse cx="30" cy="20" rx="5" ry="9" fill="#fff"/><ellipse cx="30" cy="20" rx="3.2" ry="7" fill="#BB0000"/>'+
      '<rect x="29.2" y="7" width="1.6" height="26" fill="#000" opacity=".55"/>';},
  br:function(){return '<rect width="60" height="40" fill="#009739"/><polygon points="30,4 56,20 30,36 4,20" fill="#FEDD00"/>'+
      '<circle cx="30" cy="20" r="8.5" fill="#012169"/><path d="M22,18 Q30,25 38,18" stroke="#fff" stroke-width="2.6" fill="none"/>'+
      star(27,16,1.1,'#fff')+star(33,17,1,'#fff')+star(30,22.5,0.9,'#fff');},
  au:function(){return '<rect width="60" height="40" fill="#00247D"/>'+CANTON_UJ+star(14,31,4,'#fff')+
      star(46,9,2.4,'#fff')+star(52,20,2,'#fff')+star(45,31,2.4,'#fff')+star(39,19,1.9,'#fff')+star(49,26,1.3,'#fff');},
  in:function(){return hbands(['#FF9933','#ffffff','#138808'])+
      '<circle cx="30" cy="20" r="5" fill="none" stroke="#000080" stroke-width="1.4"/>'+
      '<circle cx="30" cy="20" r="1" fill="#000080"/>'+
      '<path d="M30,15 V25 M25,20 H35 M26.5,16.5 L33.5,23.5 M33.5,16.5 L26.5,23.5" stroke="#000080" stroke-width="0.7"/>';},
  ca:function(){return '<rect width="60" height="40" fill="#fff"/><rect width="15" height="40" fill="#D52B1E"/>'+
      '<rect x="45" width="15" height="40" fill="#D52B1E"/>'+
      '<path d="M30,6 l2.3,4.8 4.7,-1 -1.4,4.6 5.4,-1.7 -1.7,3.2 4.8,3.5 -1.7,1 1,3.5 -5.6,-1.1 -0.6,2.3 -4.5,-4.8 1,8.2 -2.7,-1.2 -0.5,-2 -0.5,2 -2.7,1.2 1,-8.2 -4.5,4.8 -0.6,-2.3 -5.6,1.1 1,-3.5 -1.7,-1 4.8,-3.5 -1.7,-3.2 5.4,1.7 -1.4,-4.6 4.7,1 z" fill="#D52B1E"/>';},
  mx:function(){return vbands(['#006847','#ffffff','#CE1126'])+
      '<circle cx="30" cy="20" r="5" fill="#8DBE3F" opacity=".75"/><circle cx="30" cy="20" r="2.6" fill="#8B5A2B"/>';},
  kr:function(){return '<rect width="60" height="40" fill="#fff"/>'+
      '<circle cx="30" cy="20" r="8.5" fill="#0047A0"/>'+
      '<path d="M21.5,20 A8.5,8.5 0 0,1 38.5,20 Z" fill="#CD2E3A"/>'+
      '<circle cx="25.75" cy="20" r="4.25" fill="#CD2E3A"/><circle cx="34.25" cy="20" r="4.25" fill="#0047A0"/>'+
      '<g fill="#000"><rect x="6" y="7" width="8" height="1.3"/><rect x="6" y="9.4" width="8" height="1.3"/><rect x="6" y="11.8" width="8" height="1.3"/>'+
      '<rect x="46" y="7" width="8" height="1.3"/><rect x="46" y="9.4" width="8" height="1.3"/><rect x="46" y="11.8" width="8" height="1.3"/>'+
      '<rect x="6" y="27" width="8" height="1.3"/><rect x="6" y="29.4" width="8" height="1.3"/><rect x="6" y="31.8" width="8" height="1.3"/>'+
      '<rect x="46" y="27" width="8" height="1.3"/><rect x="46" y="29.4" width="8" height="1.3"/><rect x="46" y="31.8" width="8" height="1.3"/></g>';},
  th:function(){return '<rect width="60" height="40" fill="#A51931"/><rect y="6.6" width="60" height="26.8" fill="#fff"/>'+
      '<rect y="13.3" width="60" height="13.4" fill="#2D2A4A"/>';},
  id:function(){return '<rect width="60" height="40" fill="#fff"/><rect width="60" height="20" fill="#CE1126"/>';},
  nz:function(){return '<rect width="60" height="40" fill="#00247D"/>'+CANTON_UJ+
      star(46,9,2.6,'#CC142B')+star(52,20,2.1,'#CC142B')+star(45,31,2.6,'#CC142B')+star(39,19.5,2,'#CC142B');},
  za:function(){return '<rect width="60" height="40" fill="#002395"/><rect width="60" height="20" fill="#DE3831"/>'+
      '<rect y="15" width="60" height="10" fill="#fff"/><rect y="17" width="60" height="6" fill="#007A4D"/>'+
      '<polygon points="0,0 28,20 0,40" fill="#fff"/><polygon points="0,3 24,20 0,37" fill="#FFB612"/>'+
      '<polygon points="0,6 20,20 0,34" fill="#000"/>';},
  ar:function(){return hbands(['#74ACDF','#ffffff','#74ACDF'])+
      '<circle cx="30" cy="20" r="6" fill="none" stroke="#F6B40E" stroke-width="1.4" stroke-dasharray="1.6 1.6"/>'+
      '<circle cx="30" cy="20" r="3.6" fill="#F6B40E"/>';},
  vn:function(){return '<rect width="60" height="40" fill="#DA251D"/>'+star(30,20,11,'#FFFF00');},
  ph:function(){var s='<rect width="60" height="40" fill="#CE1126"/><rect width="60" height="20" fill="#0038A8"/>'+
      '<polygon points="0,0 26,20 0,40" fill="#fff"/>';
      for(var i=0;i<8;i++) s+='<rect x="8.4" y="19.2" width="7.5" height="1.6" fill="#FCD116" transform="rotate('+(i*45)+' 8.4 20)"/>';
      s+='<circle cx="8.4" cy="20" r="3.2" fill="#FCD116"/>';
      return s+star(3.4,4.8,1.8,'#FCD116')+star(3.4,35.2,1.8,'#FCD116')+star(20.6,20,1.8,'#FCD116');},
  ae:function(){return hbands(['#00732F','#ffffff','#000000'])+'<rect width="15" height="40" fill="#FF0000"/>';},
  np:function(){return '<rect width="60" height="40" fill="#fff"/>'+
      '<path d="M12,2 L42,13 L20,19 L50,27 L12,38 Z" fill="#DC143C" stroke="#003893" stroke-width="2.4" stroke-linejoin="round"/>'+
      '<circle cx="19" cy="9.5" r="3.3" fill="#fff"/><circle cx="20.6" cy="8.3" r="2.7" fill="#DC143C"/>'+
      star(21,28.5,4.4,'#fff');},
  tr:function(){return '<rect width="60" height="40" fill="#E30A17"/>'+
      '<circle cx="23" cy="20" r="9" fill="#fff"/><circle cx="26.6" cy="20" r="7.2" fill="#E30A17"/>'+
      star(37,20,4.2,'#fff');},
  nl:function(){return hbands(['#AE1C28','#ffffff','#21468B']);},
  ch:function(){return '<rect width="60" height="40" fill="#FF0000"/>'+
      '<rect x="26" y="8" width="8" height="24" fill="#fff"/><rect x="18" y="16" width="24" height="8" fill="#fff"/>';},
  gr:function(){var s='',i;for(i=0;i<9;i++)s+='<rect y="'+(i*40/9)+'" width="60" height="'+(40/9+0.3)+'" fill="'+(i%2?'#fff':'#0D5EAF')+'"/>';
      return s+'<rect width="22.2" height="22.2" fill="#0D5EAF"/>'+
        '<rect x="8.9" width="4.4" height="22.2" fill="#fff"/><rect y="8.9" width="22.2" height="4.4" fill="#fff"/>';},
  no:function(){return '<rect width="60" height="40" fill="#BA0C2F"/>'+
      '<rect x="14" width="12" height="40" fill="#fff"/><rect y="14" width="60" height="12" fill="#fff"/>'+
      '<rect x="17" width="6" height="40" fill="#00205B"/><rect y="17" width="60" height="6" fill="#00205B"/>';},
  ma:function(){return '<rect width="60" height="40" fill="#C1272D"/>'+
      '<polygon points="'+starPts(30,20,9)+'" fill="none" stroke="#006233" stroke-width="2"/>';},
  tz:function(){return '<rect width="60" height="40" fill="#1EB53A"/><polygon points="60,0 60,40 0,40" fill="#00A3DD"/>'+
      '<path d="M0,40 L60,0" stroke="#FCD116" stroke-width="11"/><path d="M0,40 L60,0" stroke="#000" stroke-width="7"/>';},
  mg:function(){return '<rect width="60" height="40" fill="#FC3D32"/><rect y="20" width="60" height="20" fill="#007E3A"/>'+
      '<rect width="20" height="40" fill="#fff"/>';},
  cu:function(){var s='',i;for(i=0;i<5;i++)s+='<rect y="'+(i*8)+'" width="60" height="8.3" fill="'+(i%2?'#fff':'#002A8F')+'"/>';
      return s+'<polygon points="0,0 26,20 0,40" fill="#CF142B"/>'+star(9,20,5,'#fff');},
  pe:function(){return vbands(['#D91023','#ffffff','#D91023']);},
  cl:function(){return '<rect width="60" height="40" fill="#fff"/><rect y="20" width="60" height="20" fill="#D52B1E"/>'+
      '<rect width="20" height="20" fill="#0039A6"/>'+star(10,10,5.5,'#fff');},
  fj:function(){return '<rect width="60" height="40" fill="#68BFE5"/>'+CANTON_UJ+
      '<path d="M40,11 h11 v9 q0,6.5 -5.5,9 q-5.5,-2.5 -5.5,-9 z" fill="#fff" stroke="#d8d8d8" stroke-width="0.6"/>'+
      '<rect x="40" y="11" width="11" height="2.8" fill="#CE1126"/>'+
      '<path d="M45.5,13.8 V29 M40,18.5 H51" stroke="#CE1126" stroke-width="1.5"/>';},
  mn:function(){return vbands(['#C4272F','#015197','#C4272F'])+
      '<g fill="#F9CF02"><circle cx="10" cy="11" r="2.1"/><path d="M7.7,14.4 h4.6 l-2.3,3.3 z"/>'+
      '<rect x="7.3" y="18.9" width="5.4" height="1.5"/><rect x="7.3" y="21.7" width="5.4" height="1.5"/>'+
      '<circle cx="10" cy="26.4" r="1.9"/><rect x="5.2" y="8" width="1.3" height="21"/>'+
      '<rect x="13.5" y="8" width="1.3" height="21"/></g>';},
  kh:function(){return '<rect width="60" height="40" fill="#032EA1"/><rect y="10" width="60" height="20" fill="#E00025"/>'+
      '<g fill="#fff"><rect x="21" y="26.5" width="18" height="2.6"/><rect x="23.5" y="23.5" width="13" height="3"/>'+
      '<path d="M30,10.5 l3,6.5 h-6 z"/><path d="M23.6,14 l2.3,5 h-4.6 z"/><path d="M36.4,14 l2.3,5 h-4.6 z"/>'+
      '<rect x="28.9" y="16" width="2.2" height="8"/><rect x="22.8" y="18.6" width="1.9" height="5.2"/>'+
      '<rect x="35.3" y="18.6" width="1.9" height="5.2"/></g>';},
  se:function(){return '<rect width="60" height="40" fill="#006AA7"/>'+
      '<rect x="17" width="7" height="40" fill="#FECC00"/><rect y="16.5" width="60" height="7" fill="#FECC00"/>';},
  is:function(){return '<rect width="60" height="40" fill="#02529C"/>'+
      '<rect x="15" width="12" height="40" fill="#fff"/><rect y="14" width="60" height="12" fill="#fff"/>'+
      '<rect x="18" width="6" height="40" fill="#DC1E35"/><rect y="17" width="60" height="6" fill="#DC1E35"/>';},
  pl:function(){return '<rect width="60" height="40" fill="#fff"/><rect y="20" width="60" height="20" fill="#DC143C"/>';},
  ng:function(){return vbands(['#008751','#ffffff','#008751']);},
  et:function(){return hbands(['#078930','#FCDD09','#DA121A'])+
      '<circle cx="30" cy="20" r="9" fill="#0F47AF"/>'+star(30,20,6.6,'#FCDD09');},
  bw:function(){return '<rect width="60" height="40" fill="#75AADB"/>'+
      '<rect y="14.5" width="60" height="11" fill="#fff"/><rect y="17" width="60" height="6" fill="#000"/>';},
  cr:function(){return '<rect width="60" height="40" fill="#002B7F"/><rect y="6.7" width="60" height="26.6" fill="#fff"/>'+
      '<rect y="13.3" width="60" height="13.4" fill="#CE1126"/>';},
  co:function(){return '<rect width="60" height="40" fill="#FCD116"/>'+
      '<rect y="20" width="60" height="10" fill="#003893"/><rect y="30" width="60" height="10" fill="#CE1126"/>';},
  bo:function(){return hbands(['#D52B1E','#F9E300','#007A33']);},
  pg:function(){return '<rect width="60" height="40" fill="#CE1126"/><path d="M0,0 L0,40 L60,40 Z" fill="#000"/>'+
      star(13,30,2.6,'#fff')+star(20,24.5,2,'#fff')+star(18,35.5,2.6,'#fff')+star(8,25,1.6,'#fff')+
      '<g fill="#FCD116"><ellipse cx="40" cy="14" rx="4.6" ry="3"/><circle cx="45.2" cy="10.8" r="2.4"/>'+
      '<path d="M36,15.5 q-8,2.5 -12,8.5 q7,-3.5 12,-4.5 z"/><path d="M40.5,11 q3,-6 8,-7 q-3.2,4 -3.2,7 z"/></g>';}
};
function flagSVG(id,cls){
  return '<svg viewBox="0 0 60 40" class="'+(cls||'')+'" xmlns="http://www.w3.org/2000/svg">'+FLAGS[id]()+
         '<rect width="60" height="40" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="1"/></svg>';
}

/* ============================================================
   2. COUNTRY DATA
   ============================================================ */
var CONTINENTS=[
  {id:'all', zh:'全部', en:'All'},
  {id:'as',  zh:'亚洲', en:'Asia'},
  {id:'eu',  zh:'欧洲', en:'Europe'},
  {id:'af',  zh:'非洲', en:'Africa'},
  {id:'na',  zh:'北美洲', en:'North America'},
  {id:'sa',  zh:'南美洲', en:'South America'},
  {id:'oc',  zh:'大洋洲', en:'Oceania'}
];

var COUNTRIES=[
 {id:'cn',zh:'中国',en:'China',c:'as',capZh:'北京',capEn:'Beijing',lat:39.9,lon:116.4,
  hi:'你好',hiR:'Nǐ hǎo',
  f:[['🐼','大熊猫的家乡，它们最爱吃竹子','Home of the giant panda, who loves bamboo'],
     ['🧱','有一座长长的万里长城','It has the very long Great Wall'],
     ['🥟','小朋友过年会吃饺子','Kids eat dumplings at New Year']]},
 {id:'jp',zh:'日本',en:'Japan',c:'as',capZh:'东京',capEn:'Tokyo',lat:35.7,lon:139.7,
  hi:'こんにちは',hiR:'Konnichiwa',
  f:[['🌸','春天有粉红色的樱花','Pink cherry blossoms bloom in spring'],
     ['🗻','有一座很高的富士山','Mount Fuji is its tallest mountain'],
     ['🚄','火车「新干线」跑得很快','Bullet trains run super fast']]},
 {id:'my',zh:'马来西亚',en:'Malaysia',c:'as',capZh:'吉隆坡',capEn:'Kuala Lumpur',lat:3.14,lon:101.69,
  hi:'Apa khabar',hiR:'阿帕 卡巴',
  f:[['🏙️','有一对双子塔，像两支铅笔','The Twin Towers look like two pencils'],
     ['🌴','天气全年都很热，有热带雨林','Hot all year, with rainforests'],
     ['🥭','榴莲被叫做「水果之王」','Durian is called the king of fruits']]},
 {id:'sg',zh:'新加坡',en:'Singapore',c:'as',capZh:'新加坡',capEn:'Singapore',lat:1.35,lon:103.82,
  hi:'你好 / Hello',hiR:'Nǐ hǎo',
  f:[['🦁','有一只鱼尾狮，狮子头鱼尾巴','The Merlion has a lion head and fish tail'],
     ['🌳','城市里到处都是树，叫花园城市','A garden city full of trees'],
     ['🏝️','是一个很小很小的岛国','It is a very tiny island country']]},
 {id:'in',zh:'印度',en:'India',c:'as',capZh:'新德里',capEn:'New Delhi',lat:28.61,lon:77.21,
  hi:'नमस्ते',hiR:'Namaste',
  f:[['🕌','有白白的泰姬陵，非常漂亮','The white Taj Mahal is beautiful'],
     ['🐘','大象会参加节日游行','Elephants join festival parades'],
     ['🍛','很多人喜欢吃咖喱','Many people love curry']]},
 {id:'kr',zh:'韩国',en:'South Korea',c:'as',capZh:'首尔',capEn:'Seoul',lat:37.57,lon:126.98,
  hi:'안녕하세요',hiR:'Annyeonghaseyo',
  f:[['🥬','大家爱吃辣辣的泡菜','People love spicy kimchi'],
     ['👘','节日会穿漂亮的韩服','They wear hanbok on holidays'],
     ['🎵','K-pop 音乐全世界都听','K-pop music is famous worldwide']]},
 {id:'th',zh:'泰国',en:'Thailand',c:'as',capZh:'曼谷',capEn:'Bangkok',lat:13.76,lon:100.5,
  hi:'สวัสดี',hiR:'Sawasdee',
  f:[['🐘','大象是泰国的好朋友','Elephants are special in Thailand'],
     ['🛕','有金色闪闪的寺庙','Temples shine with gold'],
     ['😊','被叫做「微笑的国家」','It is called the Land of Smiles']]},
 {id:'id',zh:'印度尼西亚',en:'Indonesia',c:'as',capZh:'雅加达',capEn:'Jakarta',lat:-6.2,lon:106.85,
  hi:'Selamat pagi',hiR:'早安',
  f:[['🏝️','由一万多个小岛组成','Made of more than 10,000 islands'],
     ['🌋','有很多会冒烟的火山','It has many volcanoes'],
     ['🦎','科莫多龙是最大的蜥蜴','The Komodo dragon is the biggest lizard']]},
 {id:'vn',zh:'越南',en:'Vietnam',c:'as',capZh:'河内',capEn:'Hanoi',lat:21.03,lon:105.85,
  hi:'Xin chào',hiR:'辛 交',
  f:[['🛶','下龙湾有很多像石头小山的岛','Ha Long Bay is full of rocky little islands'],
     ['👒','农民会戴尖尖的斗笠遮太阳','Farmers wear pointy straw hats for shade'],
     ['🍜','大家早餐爱吃热热的河粉','People love a hot bowl of pho for breakfast']]},
 {id:'ph',zh:'菲律宾',en:'Philippines',c:'as',capZh:'马尼拉',capEn:'Manila',lat:14.6,lon:120.98,
  hi:'Kumusta',hiR:'库姆斯塔',
  f:[['🏝️','由七千多个小岛组成','Made of more than 7,000 islands'],
     ['🚐','彩色的吉普尼小巴很热闹','Colourful jeepney buses fill the streets'],
     ['🥭','这里的芒果又甜又香','Its mangoes are sweet and yummy']]},
 {id:'np',zh:'尼泊尔',en:'Nepal',c:'as',capZh:'加德满都',capEn:'Kathmandu',lat:27.72,lon:85.32,
  hi:'नमस्ते',hiR:'Namaste',
  f:[['🏔️','世界最高的珠穆朗玛峰在这里','Mount Everest, the world\'s highest peak, is here'],
     ['🚩','国旗不是长方形，是两个三角形','Its flag is not a rectangle — it is two triangles'],
     ['🐐','山路上靠牦牛帮忙背东西','Yaks carry loads along the mountain paths']]},
 {id:'ae',zh:'阿联酋',en:'United Arab Emirates',c:'as',capZh:'阿布扎比',capEn:'Abu Dhabi',lat:24.45,lon:54.38,
  hi:'مرحبا',hiR:'Marhaba',
  f:[['🏙️','有世界上最高的大楼哈利法塔','The world\'s tallest building is here'],
     ['🏜️','四周都是金黄色的大沙漠','Golden desert stretches all around'],
     ['🐪','以前的人骑骆驼走沙漠','People used to cross the sand on camels']]},
 {id:'tr',zh:'土耳其',en:'Türkiye',c:'as',capZh:'安卡拉',capEn:'Ankara',lat:39.93,lon:32.86,
  hi:'Merhaba',hiR:'梅尔哈巴',
  f:[['🎈','卡帕多西亚每天早上有好多热气球','Hot-air balloons fill the Cappadocia sky each morning'],
     ['🌉','一半在亚洲，一半在欧洲','Half of it is in Asia and half in Europe'],
     ['🍦','这里的冰淇淋黏黏的，拉得很长','Its ice cream is so stretchy it can be pulled long']]},
 {id:'ru',zh:'俄罗斯',en:'Russia',c:'eu',capZh:'莫斯科',capEn:'Moscow',lat:55.76,lon:37.62,
  hi:'Привет',hiR:'Privet',
  f:[['🗺️','是世界上最大的国家','The largest country in the world'],
     ['❄️','冬天非常冷，雪很厚','Winters are very cold and snowy'],
     ['⛪','教堂的屋顶像彩色洋葱','Church roofs look like colourful onions']]},
 {id:'gb',zh:'英国',en:'United Kingdom',c:'eu',capZh:'伦敦',capEn:'London',lat:51.5,lon:-0.13,
  hi:'Hello',hiR:'哈啰',
  f:[['🕰️','有一座大本钟，会「当当」响','Big Ben is a giant clock that chimes'],
     ['🚌','街上有红色的双层巴士','Red double-decker buses drive around'],
     ['👑','有国王和城堡','It has a king and many castles']]},
 {id:'fr',zh:'法国',en:'France',c:'eu',capZh:'巴黎',capEn:'Paris',lat:48.86,lon:2.35,
  hi:'Bonjour',hiR:'蓬如',
  f:[['🗼','有高高的埃菲尔铁塔','The tall Eiffel Tower stands in Paris'],
     ['🥖','面包棍又长又香','Baguette bread is long and yummy'],
     ['🎨','有很多美丽的图画和博物馆','Full of famous paintings and museums']]},
 {id:'de',zh:'德国',en:'Germany',c:'eu',capZh:'柏林',capEn:'Berlin',lat:52.52,lon:13.4,
  hi:'Hallo',hiR:'哈啰',
  f:[['🚗','会做很棒的汽车','Famous for making great cars'],
     ['🏰','山上有像童话一样的城堡','Fairy-tale castles sit on the hills'],
     ['🥨','大家爱吃扭扭的碱水面包','People love pretzels']]},
 {id:'it',zh:'意大利',en:'Italy',c:'eu',capZh:'罗马',capEn:'Rome',lat:41.9,lon:12.5,
  hi:'Ciao',hiR:'俏',
  f:[['🍕','披萨就是这里发明的','Pizza was invented here'],
     ['🗼','有一座会「斜」的比萨斜塔','The Leaning Tower of Pisa tilts'],
     ['👢','国家的形状像一只靴子','The country looks like a boot']]},
 {id:'es',zh:'西班牙',en:'Spain',c:'eu',capZh:'马德里',capEn:'Madrid',lat:40.42,lon:-3.7,
  hi:'Hola',hiR:'欧拉',
  f:[['💃','有热情的弗拉门戈舞','Flamenco dancing is full of energy'],
     ['⚽','大家超级喜欢踢足球','Football is loved by everyone'],
     ['☀️','阳光很好，海边很美','Sunny days and pretty beaches']]},
 {id:'nl',zh:'荷兰',en:'Netherlands',c:'eu',capZh:'阿姆斯特丹',capEn:'Amsterdam',lat:52.37,lon:4.9,
  hi:'Hallo',hiR:'哈啰',
  f:[['🌷','春天有一大片一大片的郁金香','Whole fields of tulips bloom in spring'],
     ['🚲','自行车比人还要多','There are more bicycles than people'],
     ['🌊','很多地方比海还要低，靠堤坝挡水','Much of it is below the sea, kept dry by dikes']]},
 {id:'ch',zh:'瑞士',en:'Switzerland',c:'eu',capZh:'伯尔尼',capEn:'Bern',lat:46.95,lon:7.45,
  hi:'Grüezi',hiR:'格吕齐',
  f:[['🏔️','到处都是白雪盖顶的阿尔卑斯山','Snowy Alps rise all around'],
     ['🍫','巧克力做得特别好吃','It makes some of the best chocolate'],
     ['⌚','手表做得又准又漂亮','Its watches are famous for keeping perfect time']]},
 {id:'gr',zh:'希腊',en:'Greece',c:'eu',capZh:'雅典',capEn:'Athens',lat:37.98,lon:23.73,
  hi:'Γεια σου',hiR:'Yassou',
  f:[['🏛️','有两千多年前的白色神庙','White temples here are over 2,000 years old'],
     ['🏅','奥林匹克运动会从这里开始','The Olympic Games started here'],
     ['🏘️','小岛上的房子白墙蓝屋顶','Island houses have white walls and blue roofs']]},
 {id:'no',zh:'挪威',en:'Norway',c:'eu',capZh:'奥斯陆',capEn:'Oslo',lat:59.91,lon:10.75,
  hi:'Hei',hiR:'嘿',
  f:[['💚','冬天的夜空会出现彩色的极光','Colourful northern lights glow in the winter sky'],
     ['🏞️','海水钻进高山中间，叫峡湾','The sea slips between tall cliffs — that is a fjord'],
     ['🌙','冬天有些日子太阳整天不出来','On some winter days the sun never rises']]},
 {id:'eg',zh:'埃及',en:'Egypt',c:'af',capZh:'开罗',capEn:'Cairo',lat:30.04,lon:31.24,
  hi:'مرحبا',hiR:'Marhaba',
  f:[['🔺','有巨大的金字塔','Giant pyramids stand in the desert'],
     ['🦁','狮身人面像守着沙漠','The Sphinx guards the sand'],
     ['🛶','尼罗河是很长很长的河','The Nile is a very long river']]},
 {id:'ke',zh:'肯尼亚',en:'Kenya',c:'af',capZh:'内罗毕',capEn:'Nairobi',lat:-1.29,lon:36.82,
  hi:'Jambo',hiR:'占波',
  f:[['🦁','草原上有狮子和长颈鹿','Lions and giraffes live on the savanna'],
     ['🏃','跑步运动员跑得非常快','Its runners are super fast'],
     ['🐘','可以坐车去看野生动物','You can go on a safari']]},
 {id:'za',zh:'南非',en:'South Africa',c:'af',capZh:'比勒陀利亚',capEn:'Pretoria',lat:-25.75,lon:28.19,
  hi:'Sawubona',hiR:'萨乌波纳',
  f:[['⛰️','有一座平平的桌山','Table Mountain has a flat top'],
     ['🦓','有斑马、大象和犀牛','Zebras, elephants and rhinos live here'],
     ['🏙️','它有三个首都，很特别','It has three capital cities!']]},
 {id:'ma',zh:'摩洛哥',en:'Morocco',c:'af',capZh:'拉巴特',capEn:'Rabat',lat:34.02,lon:-6.84,
  hi:'السلام عليكم',hiR:'Salam',
  f:[['🏜️','南边就是大大的撒哈拉沙漠','The huge Sahara Desert lies to the south'],
     ['💙','有一座房子全刷成蓝色的小城','One little town is painted all blue'],
     ['🍵','客人来了要请喝薄荷茶','Guests are always served sweet mint tea']]},
 {id:'tz',zh:'坦桑尼亚',en:'Tanzania',c:'af',capZh:'多多马',capEn:'Dodoma',lat:-6.16,lon:35.75,
  hi:'Jambo',hiR:'占波',
  f:[['🏔️','非洲最高的乞力马扎罗山在这里','Kilimanjaro, Africa\'s tallest mountain, is here'],
     ['🦓','草原上有几百万只动物大迁徙','Millions of animals migrate across the plains'],
     ['🏝️','桑给巴尔岛的海水又蓝又清','The sea around Zanzibar is clear and blue']]},
 {id:'mg',zh:'马达加斯加',en:'Madagascar',c:'af',capZh:'塔那那利佛',capEn:'Antananarivo',lat:-18.88,lon:47.51,
  hi:'Salama',hiR:'萨拉马',
  f:[['🏝️','是世界第四大的岛','The fourth-biggest island in the world'],
     ['🐒','狐猴只有这里才有','Lemurs live nowhere else on Earth'],
     ['🌳','猴面包树的肚子胖胖的','Baobab trees have big fat trunks']]},
 {id:'us',zh:'美国',en:'United States',c:'na',capZh:'华盛顿',capEn:'Washington, D.C.',lat:38.9,lon:-77.0,
  hi:'Hello',hiR:'哈啰',
  f:[['🗽','有绿色的自由女神像','The green Statue of Liberty waves hello'],
     ['🏜️','大峡谷又深又大','The Grand Canyon is huge and deep'],
     ['⭐','由 50 个州组成','It is made of 50 states']]},
 {id:'ca',zh:'加拿大',en:'Canada',c:'na',capZh:'渥太华',capEn:'Ottawa',lat:45.42,lon:-75.7,
  hi:'Hello / Bonjour',hiR:'哈啰',
  f:[['🍁','国旗上有一片枫叶','A maple leaf is on its flag'],
     ['🍯','枫糖浆又香又甜','Maple syrup is sweet and yummy'],
     ['💦','尼亚加拉大瀑布哗啦啦','Niagara Falls roars with water']]},
 {id:'mx',zh:'墨西哥',en:'Mexico',c:'na',capZh:'墨西哥城',capEn:'Mexico City',lat:19.43,lon:-99.13,
  hi:'Hola',hiR:'欧拉',
  f:[['🌮','玉米卷饼很好吃','Tacos are delicious'],
     ['🌵','沙漠里长着大仙人掌','Big cactus plants grow in the desert'],
     ['🔺','古老的金字塔可以爬上去','Ancient pyramids you can climb']]},
 {id:'cu',zh:'古巴',en:'Cuba',c:'na',capZh:'哈瓦那',capEn:'Havana',lat:23.13,lon:-82.38,
  hi:'Hola',hiR:'欧拉',
  f:[['🚗','街上跑着五颜六色的老爷车','Colourful vintage cars drive along the streets'],
     ['🐦','世界上最小的鸟蜂鸟住在这里','The world\'s smallest bird lives here'],
     ['🎺','大家爱唱歌跳萨尔萨舞','Everyone loves music and salsa dancing']]},
 {id:'br',zh:'巴西',en:'Brazil',c:'sa',capZh:'巴西利亚',capEn:'Brasília',lat:-15.79,lon:-47.88,
  hi:'Olá',hiR:'欧拉',
  f:[['🌳','有最大的亚马逊雨林','The huge Amazon rainforest is here'],
     ['⚽','足球踢得非常厉害','Very, very good at football'],
     ['🎉','狂欢节有唱歌跳舞','Carnival is full of music and dancing']]},
 {id:'ar',zh:'阿根廷',en:'Argentina',c:'sa',capZh:'布宜诺斯艾利斯',capEn:'Buenos Aires',lat:-34.6,lon:-58.38,
  hi:'Hola',hiR:'欧拉',
  f:[['💃','探戈是这里的舞蹈','Tango dancing started here'],
     ['🐄','大草原上有很多牛','Cows graze on the wide grasslands'],
     ['🏔️','有高高的安第斯山','The tall Andes mountains are here']]},
 {id:'pe',zh:'秘鲁',en:'Peru',c:'sa',capZh:'利马',capEn:'Lima',lat:-12.05,lon:-77.04,
  hi:'Hola',hiR:'欧拉',
  f:[['🏔️','高山上有古城马丘比丘','The old city of Machu Picchu sits high in the mountains'],
     ['🦙','羊驼的毛又软又暖','Alpaca wool is soft and warm'],
     ['🌈','有一座山是彩虹一样的条纹','One mountain has stripes like a rainbow']]},
 {id:'cl',zh:'智利',en:'Chile',c:'sa',capZh:'圣地亚哥',capEn:'Santiago',lat:-33.45,lon:-70.67,
  hi:'Hola',hiR:'欧拉',
  f:[['📏','国家又长又窄，像一条长面条','A long, thin country shaped like a noodle'],
     ['🗿','复活节岛上有巨大的石头人像','Giant stone faces stand on Easter Island'],
     ['🏜️','阿塔卡马沙漠是世界最干的地方','The Atacama is the driest desert on Earth']]},
 {id:'au',zh:'澳大利亚',en:'Australia',c:'oc',capZh:'堪培拉',capEn:'Canberra',lat:-35.28,lon:149.13,
  hi:'G\'day',hiR:'哥day',
  f:[['🦘','袋鼠会跳，考拉爱睡觉','Kangaroos hop and koalas sleep a lot'],
     ['🐠','大堡礁有五彩的珊瑚','The Great Barrier Reef has colourful coral'],
     ['🎄','圣诞节是夏天，很热','Christmas there is in summer!']]},
 {id:'nz',zh:'新西兰',en:'New Zealand',c:'oc',capZh:'惠灵顿',capEn:'Wellington',lat:-41.29,lon:174.78,
  hi:'Kia ora',hiR:'Kia ora',
  f:[['🐦','奇异鸟不会飞，晚上出来','The kiwi bird cannot fly'],
     ['🐑','绵羊比人还要多','There are more sheep than people'],
     ['🏔️','有雪山和绿色的草地','Snowy mountains and green meadows']]},
 {id:'fj',zh:'斐济',en:'Fiji',c:'oc',capZh:'苏瓦',capEn:'Suva',lat:-18.14,lon:178.44,
  hi:'Bula',hiR:'布拉',
  f:[['🏝️','由三百多个小岛组成','Made of more than 300 little islands'],
     ['🐠','海底有五彩的珊瑚和小鱼','Colourful coral and fish live under the sea'],
     ['👋','见面要笑着说「Bula！」','People smile and say "Bula!" when they meet']]},
 {id:'mn',zh:'蒙古',en:'Mongolia',c:'as',capZh:'乌兰巴托',capEn:'Ulaanbaatar',lat:47.89,lon:106.91,
  hi:'Сайн байна уу',hiR:'赛音白努',
  f:[['🐎','马比人还要多','There are more horses than people'],
     ['⛺','住在圆圆的蒙古包里，可以搬着走','People live in round tents they can carry away'],
     ['🌾','草原一望无际，看不到边','The grassland goes on further than you can see']]},
 {id:'kh',zh:'柬埔寨',en:'Cambodia',c:'as',capZh:'金边',capEn:'Phnom Penh',lat:11.56,lon:104.92,
  hi:'សួស្ដី',hiR:'Suostei',
  f:[['🛕','有世界上最大的宗教建筑吴哥窟','Angkor Wat is the largest religious building on Earth'],
     ['🚩','全世界只有它把一座建筑画在国旗上','It is the only flag in the world with a building on it'],
     ['🍚','用大米做出各种各样的点心','All kinds of sweets are made from rice']]},
 {id:'se',zh:'瑞典',en:'Sweden',c:'eu',capZh:'斯德哥尔摩',capEn:'Stockholm',lat:59.33,lon:18.07,
  hi:'Hej',hiR:'嘿',
  f:[['🏝️','首都建在十四个小岛上','The capital is built across fourteen islands'],
     ['🏆','诺贝尔奖每年在这里颁发','The Nobel Prizes are given out here every year'],
     ['🌲','森林多得像一片绿色的海','There is so much forest it looks like a green sea']]},
 {id:'is',zh:'冰岛',en:'Iceland',c:'eu',capZh:'雷克雅未克',capEn:'Reykjavík',lat:64.15,lon:-21.94,
  hi:'Halló',hiR:'哈罗',
  f:[['🌋','火山和冰川住在同一座岛上','Volcanoes and glaciers live on the same island'],
     ['♨️','地底下的热水给整座城市供暖','Hot water from underground heats the whole city'],
     ['🌌','冬天的晚上看得到绿色的极光','Green northern lights glow on winter nights']]},
 {id:'pl',zh:'波兰',en:'Poland',c:'eu',capZh:'华沙',capEn:'Warsaw',lat:52.23,lon:21.01,
  hi:'Cześć',hiR:'切希奇',
  f:[['🎹','钢琴家肖邦是波兰人','The pianist Chopin was Polish'],
     ['🦬','森林里住着欧洲最大的野牛','Europe\'s biggest wild animal lives in its forests'],
     ['🏰','有很多几百年的古城堡','It has castles hundreds of years old']]},
 {id:'ng',zh:'尼日利亚',en:'Nigeria',c:'af',capZh:'阿布贾',capEn:'Abuja',lat:9.06,lon:7.49,
  hi:'Sannu',hiR:'桑努',
  f:[['👨‍👩‍👧‍👦','非洲人口最多的国家','More people live here than in any other African country'],
     ['🎬','电影拍得又多又快，叫「诺莱坞」','It makes so many films they call it Nollywood'],
     ['🥁','鼓的种类特别多，有的会「说话」','It has many kinds of drum — some can even talk']]},
 {id:'et',zh:'埃塞俄比亚',en:'Ethiopia',c:'af',capZh:'亚的斯亚贝巴',capEn:'Addis Ababa',lat:9.03,lon:38.74,
  hi:'ሰላም',hiR:'Selam',
  f:[['☕','咖啡最早就是从这里来的','Coffee first came from here'],
     ['📅','用自己的历法，一年有 13 个月','Its own calendar has 13 months in a year'],
     ['⛪','有从整块石头里凿出来的教堂','Its churches were carved down out of solid rock']]},
 {id:'bw',zh:'博茨瓦纳',en:'Botswana',c:'af',capZh:'哈博罗内',capEn:'Gaborone',lat:-24.63,lon:25.92,
  hi:'Dumela',hiR:'杜梅拉',
  f:[['🐘','大象比世界上任何国家都多','It has more elephants than any other country'],
     ['🏜️','一大半是卡拉哈里沙漠','More than half of it is the Kalahari Desert'],
     ['💧','有一条流不到海的大河','It has a great river that never reaches the sea']]},
 {id:'cr',zh:'哥斯达黎加',en:'Costa Rica',c:'na',capZh:'圣何塞',capEn:'San José',lat:9.93,lon:-84.08,
  hi:'Pura vida',hiR:'普拉比达',
  f:[['🦥','树上挂着慢吞吞的树懒','Slow, sleepy sloths hang in the trees'],
     ['🕊️','没有军队，把钱拿去办学校和医院','It has no army — the money goes to schools and hospitals'],
     ['🌳','四分之一的国土是保护区','A quarter of the country is protected wilderness']]},
 {id:'co',zh:'哥伦比亚',en:'Colombia',c:'sa',capZh:'波哥大',capEn:'Bogotá',lat:4.71,lon:-74.07,
  hi:'Hola',hiR:'欧拉',
  f:[['☕','咖啡种在山坡上，一颗一颗手工摘','Its coffee grows on hillsides and is picked by hand'],
     ['🦋','蝴蝶的种类是世界第一多','It has more kinds of butterfly than anywhere else'],
     ['🌈','有一条会变成五种颜色的河','One of its rivers turns five different colours']]},
 {id:'bo',zh:'玻利维亚',en:'Bolivia',c:'sa',capZh:'苏克雷',capEn:'Sucre',lat:-19.03,lon:-65.26,
  hi:'Hola',hiR:'欧拉',
  f:[['🧂','有世界上最大的盐湖，白得像镜子','It has the largest salt flat on Earth, white as a mirror'],
     ['⛰️','政府所在的拉巴斯是世界最高的首都','La Paz, where the government sits, is the highest capital in the world'],
     ['🦙','山上到处都是羊驼和美洲驼','Llamas and alpacas are everywhere in the mountains']]},
 {id:'pg',zh:'巴布亚新几内亚',en:'Papua New Guinea',c:'oc',capZh:'莫尔兹比港',capEn:'Port Moresby',lat:-9.44,lon:147.18,
  hi:'Gude',hiR:'古德',
  f:[['🗣️','有八百多种语言，世界第一','More than 800 languages — more than any other country'],
     ['🐦','有羽毛很漂亮、会跳舞的极乐鸟','Birds-of-paradise here dance to show off their feathers'],
     ['🌴','大部分地方是没人去过的雨林','Most of it is rainforest no one has ever walked through']]}
];
var EXTRA={
 cn:{lm:['gwall','长城','The Great Wall'],   an:['🐼','大熊猫','Giant Panda'],  fl:['many,7,#f06fa8,#ffd84d','牡丹','Peony']},
 jp:{lm:['fuji','富士山','Mount Fuji'],      an:['🦌','梅花鹿','Sika Deer'],    fl:['round,5,#ffb3d1,#ffe066','樱花','Cherry Blossom']},
 my:{lm:['twin','双子塔','Petronas Towers'], an:['🦧','红毛猩猩','Orangutan'],  fl:['round,5,#e8323c,#ffd84d','大红花','Hibiscus']},
 sg:{lm:['mbs','滨海湾金沙','Marina Bay Sands'], an:['🦁','狮子','Lion'],       fl:['point,5,#a86fd0,#f2e2a8','卓锦万代兰','Vanda Orchid']},
 in:{lm:['taj','泰姬陵','Taj Mahal'],        an:['🐅','孟加拉虎','Bengal Tiger'], fl:['many,8,#ff9ec4,#ffe066','莲花','Lotus']},
 kr:{lm:['hanok','景福宫','Gyeongbokgung Palace'], an:['🐕','珍岛犬','Jindo Dog'], fl:['round,5,#e59ad6,#e0405a','木槿花','Rose of Sharon']},
 th:{lm:['wat','金色佛塔','Golden Temple'],  an:['🐘','大象','Elephant'],       fl:['point,6,#f5c518,#e8a000','金链花','Golden Shower']},
 id:{lm:['boro','婆罗浮屠','Borobudur'],     an:['🦎','科莫多龙','Komodo Dragon'], fl:['round,5,#ffffff,#ffe066','茉莉花','Jasmine']},
 ru:{lm:['basil','圣瓦西里教堂','St Basil\'s Cathedral'], an:['🐻','棕熊','Brown Bear'], fl:['point,10,#ffffff,#ffd400','洋甘菊','Chamomile']},
 gb:{lm:['bigben','大本钟','Big Ben'],       an:['🦢','天鹅','Swan'],           fl:['many,7,#d92b3c,#ffd84d','玫瑰','Rose']},
 fr:{lm:['eiffel','埃菲尔铁塔','Eiffel Tower'], an:['🐓','高卢雄鸡','Gallic Rooster'], fl:['point,5,#7a5fd0,#ffd84d','鸢尾花','Iris']},
 de:{lm:['castle','新天鹅堡','Neuschwanstein Castle'], an:['🐗','野猪','Wild Boar'], fl:['point,7,#4f7fe0,#2a4fa0','矢车菊','Cornflower']},
 it:{lm:['pisa','比萨斜塔','Leaning Tower of Pisa'], an:['🐺','母狼','She-Wolf'], fl:['round,8,#ffffff,#ffd400','雏菊','Daisy']},
 es:{lm:['sagrada','圣家堂','Sagrada Família'], an:['🐂','公牛','Bull'],        fl:['many,6,#e8324f,#ffb3c0','康乃馨','Carnation']},
 eg:{lm:['pyramid','金字塔','The Pyramids'], an:['🐈','猫','Cat'],              fl:['point,8,#6fa8dc,#ffe066','蓝睡莲','Blue Water Lily']},
 ke:{lm:['acacia','草原金合欢树','Savanna Acacia'], an:['🦒','长颈鹿','Giraffe'], fl:['point,10,#ff8c3c,#f2d16b','非洲菊','Gerbera Daisy']},
 za:{lm:['table','桌山','Table Mountain'],   an:['🦓','斑马','Zebra'],          fl:['point,12,#f2809f,#f5d76e','帝王花','King Protea']},
 us:{lm:['liberty','自由女神像','Statue of Liberty'], an:['🦅','白头鹰','Bald Eagle'], fl:['many,7,#d92b3c,#ffd84d','玫瑰','Rose']},
 ca:{lm:['cntower','加拿大国家电视塔','CN Tower'], an:['🦫','河狸','Beaver'],   fl:['maple,0,#d52b1e,#d52b1e','枫叶','Maple Leaf']},
 mx:{lm:['chichen','奇琴伊察金字塔','Chichén Itzá'], an:['🐆','美洲豹','Jaguar'], fl:['many,8,#e0447a,#ffd84d','大丽花','Dahlia']},
 br:{lm:['christ','救世基督像','Christ the Redeemer'], an:['🦜','金刚鹦鹉','Macaw'], fl:['round,5,#ffd21f,#e09a00','黄花风铃木','Golden Trumpet Tree']},
 ar:{lm:['obelisk','方尖碑','The Obelisk'],  an:['🦙','原驼','Guanaco'],        fl:['point,6,#e8323c,#ffcf5c','塞波花','Ceibo Flower']},
 au:{lm:['opera','悉尼歌剧院','Sydney Opera House'], an:['🦘','袋鼠','Kangaroo'], fl:['puff,0,#f2c230,#e0a020','金合欢','Golden Wattle']},
 nz:{lm:['skytower','天空塔','Sky Tower'],   an:['🐦','奇异鸟','Kiwi Bird'],    fl:['puff,0,#e8384f,#f2c230','圣诞红花','Pōhutukawa']},
 vn:{lm:['halong','下龙湾','Ha Long Bay'],   an:['🐃','水牛','Water Buffalo'],  fl:['many,8,#ffb3d1,#ffe066','莲花','Lotus']},
 ph:{lm:['chocohill','巧克力山','Chocolate Hills'], an:['🦈','鲸鲨','Whale Shark'], fl:['round,6,#ffffff,#ffd84d','茉莉花','Sampaguita']},
 np:{lm:['everest','珠穆朗玛峰','Mount Everest'], an:['🦏','独角犀牛','One-horned Rhino'], fl:['many,6,#e8506e,#ffd84d','红杜鹃','Rhododendron']},
 ae:{lm:['burj','哈利法塔','Burj Khalifa'],  an:['🐪','单峰骆驼','Dromedary Camel'], fl:['round,5,#f7d84a,#e8a83c','蒺藜花','Tribulus Flower']},
 tr:{lm:['cappa','卡帕多西亚','Cappadocia'], an:['🐇','安哥拉兔','Angora Rabbit'], fl:['point,6,#e8323c,#f2c230','郁金香','Tulip']},
 nl:{lm:['windmill','风车','Dutch Windmill'], an:['🐄','奶牛','Dairy Cow'],     fl:['point,6,#f2803c,#e0a020','郁金香','Tulip']},
 ch:{lm:['matter','马特洪峰','The Matterhorn'], an:['🐐','高山羱羊','Alpine Ibex'], fl:['point,9,#ffffff,#e0b840','雪绒花','Edelweiss']},
 gr:{lm:['parthenon','帕特农神庙','The Parthenon'], an:['🦉','猫头鹰','Owl'],   fl:['round,5,#8f6fd0,#f5e08a','紫罗兰','Violet']},
 no:{lm:['fjord','峡湾','The Fjords'],       an:['🦊','北极狐','Arctic Fox'],   fl:['many,7,#c77bd0,#f2e2a8','帚石南','Heather']},
 ma:{lm:['bluecity','蓝色小城','The Blue City'], an:['🐪','沙漠骆驼','Desert Camel'], fl:['round,5,#ffffff,#f2c230','橙花','Orange Blossom']},
 tz:{lm:['kili','乞力马扎罗山','Mount Kilimanjaro'], an:['🦛','河马','Hippo'], fl:['round,5,#8b5fd0,#ffe066','非洲堇','African Violet']},
 mg:{lm:['baobab','猴面包树','Baobab Trees'], an:['🐒','环尾狐猴','Ring-tailed Lemur'], fl:['round,5,#e88ac4,#ffe066','长春花','Periwinkle']},
 cu:{lm:['havana','哈瓦那老城','Old Havana'], an:['🐊','古巴鳄','Cuban Crocodile'], fl:['point,5,#ffffff,#9ec46b','蝴蝶姜花','Mariposa Lily']},
 pe:{lm:['machu','马丘比丘','Machu Picchu'], an:['🦙','羊驼','Alpaca'],        fl:['many,5,#e0447a,#f2c230','坎图塔花','Cantuta']},
 cl:{lm:['moai','摩艾石像','Moai Statues'],  an:['🐧','洪堡企鹅','Humboldt Penguin'], fl:['point,5,#d92b5c,#f2c230','智利钟花','Copihue']},
 fj:{lm:['islet','珊瑚小岛','Coral Island'], an:['🐢','海龟','Sea Turtle'],    fl:['point,6,#e8324f,#ffffff','塔基茉莉','Tagimoucia']},
 mn:{lm:['ger','蒙古包','The Ger'],          an:['🐎','蒙古马','Mongolian Horse'], fl:['point,6,#e8657f,#f2d16b','山丹花','Mountain Lily']},
 kh:{lm:['angkor','吴哥窟','Angkor Wat'],    an:['🐂','野牛「谷波雷」','Kouprey'],  fl:['round,5,#f7ecb0,#e8c95a','隆多花','Rumduol']},
 se:{lm:['icehotel','冰旅馆','The Icehotel'],an:['🦌','驼鹿','Moose'],            fl:['round,6,#ffffff,#eaf5d8','铃兰','Lily of the Valley']},
 is:{lm:['geyser','间歇泉','The Geysers'],   an:['🐴','冰岛马','Icelandic Horse'], fl:['round,8,#ffffff,#f5d76e','仙女木','Mountain Avens']},
 pl:{lm:['wawel','瓦维尔城堡','Wawel Castle'],an:['🦬','欧洲野牛','European Bison'],fl:['round,4,#e8323c,#3a3a3a','红罂粟','Corn Poppy']},
 ng:{lm:['zumarock','祖玛岩','Zuma Rock'],   an:['🦍','西非大猩猩','Cross River Gorilla'], fl:['round,4,#f5c518,#e09a00','黄喇叭花','Yellow Trumpet']},
 et:{lm:['lalibela','拉利贝拉岩石教堂','The Rock Churches of Lalibela'], an:['🐒','狮尾狒','Gelada'], fl:['point,5,#ffffff,#f5d76e','马蹄莲','Calla Lily']},
 bw:{lm:['okavango','奥卡万戈三角洲','The Okavango Delta'], an:['🐘','非洲象','African Elephant'], fl:['round,5,#fdfbf0,#e8d8a0','猴面包树花','Baobab Flower']},
 cr:{lm:['arenal','阿雷纳尔火山','Arenal Volcano'], an:['🦥','树懒','Sloth'],      fl:['point,5,#a86fd0,#f2e2a8','紫兰花','Guaria Morada']},
 co:{lm:['canocristales','五彩河','Caño Cristales'], an:['🦅','安第斯神鹫','Andean Condor'], fl:['point,5,#e8659f,#f2e2a8','五月兰','Cattleya Orchid']},
 bo:{lm:['uyuni','乌尤尼盐沼','Salar de Uyuni'], an:['🦙','美洲驼','Llama'],       fl:['point,4,#e8324f,#f2c230','帕图胡花','Patujú']},
 pg:{lm:['haustambaran','灵屋','The Spirit House'], an:['🦜','极乐鸟','Bird-of-Paradise'], fl:['point,5,#6fa8dc,#f2e2a8','塞皮克蓝兰','Sepik Blue Orchid']}
};
var ANIMALS=[
  {e:'🐼',zh:'大熊猫',en:'Panda',id:'cn'},
  {e:'🦘',zh:'袋鼠',en:'Kangaroo',id:'au'},
  {e:'🦁',zh:'狮子',en:'Lion',id:'ke'},
  {e:'🐘',zh:'大象',en:'Elephant',id:'th'},
  {e:'🦧',zh:'红毛猩猩',en:'Orangutan',id:'my'},
  {e:'🐦',zh:'奇异鸟',en:'Kiwi bird',id:'nz'},
  {e:'🦎',zh:'科莫多龙',en:'Komodo dragon',id:'id'},
  {e:'🦅',zh:'白头鹰',en:'Bald eagle',id:'us'},
  {e:'🐫',zh:'骆驼',en:'Camel',id:'eg'},
  {e:'🐅',zh:'老虎',en:'Tiger',id:'in'},
  {e:'🐻',zh:'棕熊',en:'Brown bear',id:'ru'},
  {e:'🦫',zh:'河狸',en:'Beaver',id:'ca'},
  {e:'🦙',zh:'羊驼',en:'Alpaca',id:'pe'},
  {e:'🐧',zh:'企鹅',en:'Penguin',id:'cl'},
  {e:'🐒',zh:'环尾狐猴',en:'Lemur',id:'mg'},
  {e:'🦛',zh:'河马',en:'Hippo',id:'tz'},
  {e:'🐢',zh:'海龟',en:'Sea turtle',id:'fj'},
  {e:'🐄',zh:'奶牛',en:'Dairy cow',id:'nl'},
  {e:'🐃',zh:'水牛',en:'Water buffalo',id:'vn'},
  {e:'🦉',zh:'猫头鹰',en:'Owl',id:'gr'}
];
return{flagSVG:flagSVG,CONTINENTS:CONTINENTS,COUNTRIES:COUNTRIES,EXTRA:EXTRA,ANIMALS:ANIMALS};})();

const WC=WX.COUNTRIES,WCONT=Object.fromEntries(WX.CONTINENTS.filter(c=>c.id!=='all').map(c=>[c.id,c.zh]));
const wById=id=>WC.find(c=>c.id===id),wPool=L=>L===1?WC.filter(c=>c.c==='as'):WC;
const wFlag=(c,cls)=>WX.flagSVG(c.id,cls||'wflag');
const wOpt=c=>({v:c.id,l:`<span class="wfo">${wFlag(c,'wflag sm')}</span><small>${esc(c.zh)}</small>`});
function wOpts(ans,pool,key){const seen=new Set([key?key(ans):ans.id]);const o=[ans];for(const c of shuffle(pool.length>=4?pool:WC)){const k=key?key(c):c.id;if(o.length<4&&!seen.has(k)){seen.add(k);o.push(c)}}return shuffle(o)}
const latin=t=>/^[\u0000-\u024F\s'/.-]+$/.test(t||'');
const hiShow=c=>latin(c.hi)?c.hi.split(' / ')[0]:latin(c.hiR)?c.hiR:c.hiR;
const HI_UNIQ=WC.filter(c=>c.hi&&WC.filter(x=>x.hi&&hiShow(x).toLowerCase()===hiShow(c).toLowerCase()).length===1);
const wFact=c=>c.f&&c.f[0]?c.f[0][0]+' '+c.f[0][1]:'';
/* 全世界国旗 (from the 'Understanding of the World Flag' poster): emoji flags, shown only where the device draws flag emoji (Windows does not) */
const WF_RAW={as:'cn:中国:China af:阿富汗:Afghanistan ae:阿联酋:United Arab Emirates om:阿曼:Oman az:阿塞拜疆:Azerbaijan ps:巴勒斯坦:Palestine kp:朝鲜:North Korea tl:东帝汶:Timor-Leste bh:巴林:Bahrain bt:不丹:Bhutan pk:巴基斯坦:Pakistan ge:格鲁吉亚:Georgia kr:韩国:South Korea lb:黎巴嫩:Lebanon kg:吉尔吉斯斯坦:Kyrgyzstan sa:沙特阿拉伯:Saudi Arabia kh:柬埔寨:Cambodia la:老挝:Laos kw:科威特:Kuwait ph:菲律宾:Philippines kz:哈萨克斯坦:Kazakhstan my:马来西亚:Malaysia mn:蒙古:Mongolia uz:乌兹别克斯坦:Uzbekistan iq:伊拉克:Iraq mm:缅甸:Myanmar sy:叙利亚:Syria jp:日本:Japan th:泰国:Thailand cy:塞浦路斯:Cyprus tr:土耳其:Türkiye mv:马尔代夫:Maldives tm:土库曼斯坦:Turkmenistan sg:新加坡:Singapore bn:文莱:Brunei lk:斯里兰卡:Sri Lanka tj:塔吉克斯坦:Tajikistan am:亚美尼亚:Armenia jo:约旦:Jordan qa:卡塔尔:Qatar np:尼泊尔:Nepal ir:伊朗:Iran ye:也门:Yemen il:以色列:Israel bd:孟加拉国:Bangladesh in:印度:India id:印度尼西亚:Indonesia vn:越南:Vietnam',
 eu:'bg:保加利亚:Bulgaria ie:爱尔兰:Ireland by:白俄罗斯:Belarus ba:波黑:Bosnia and Herzegovina me:黑山:Montenegro lv:拉脱维亚:Latvia fi:芬兰:Finland hr:克罗地亚:Croatia ch:瑞士:Switzerland at:奥地利:Austria de:德国:Germany al:阿尔巴尼亚:Albania ee:爱沙尼亚:Estonia ad:安道尔:Andorra is:冰岛:Iceland pl:波兰:Poland li:列支敦士登:Liechtenstein se:瑞典:Sweden mk:北马其顿:North Macedonia md:摩尔多瓦:Moldova si:斯洛文尼亚:Slovenia hu:匈牙利:Hungary gb:英国:United Kingdom lu:卢森堡:Luxembourg nl:荷兰:Netherlands lt:立陶宛:Lithuania cz:捷克:Czechia it:意大利:Italy fr:法国:France mt:马耳他:Malta sk:斯洛伐克:Slovakia pt:葡萄牙:Portugal rs:塞尔维亚:Serbia sm:圣马力诺:San Marino ua:乌克兰:Ukraine es:西班牙:Spain dk:丹麦:Denmark gr:希腊:Greece ru:俄罗斯:Russia no:挪威:Norway ro:罗马尼亚:Romania be:比利时:Belgium mc:摩纳哥:Monaco va:梵蒂冈:Vatican City',
 af:'et:埃塞俄比亚:Ethiopia er:厄立特里亚:Eritrea ss:南苏丹:South Sudan lr:利比里亚:Liberia gw:几内亚比绍:Guinea-Bissau zw:津巴布韦:Zimbabwe ly:利比亚:Libya cv:佛得角:Cape Verde bf:布基纳法索:Burkina Faso bj:贝宁:Benin gq:赤道几内亚:Equatorial Guinea gm:冈比亚:Gambia sd:苏丹:Sudan ke:肯尼亚:Kenya ls:莱索托:Lesotho dj:吉布提:Djibouti gn:几内亚:Guinea gh:加纳:Ghana tz:坦桑尼亚:Tanzania mu:毛里求斯:Mauritius ao:安哥拉:Angola cg:刚果（布）:Congo cd:刚果（金）:DR Congo eg:埃及:Egypt cm:喀麦隆:Cameroon bw:博茨瓦纳:Botswana ci:科特迪瓦:Côte d’Ivoire ng:尼日利亚:Nigeria mr:毛里塔尼亚:Mauritania dz:阿尔及利亚:Algeria mw:马拉维:Malawi ml:马里:Mali ma:摩洛哥:Morocco mz:莫桑比克:Mozambique na:纳米比亚:Namibia mg:马达加斯加:Madagascar sl:塞拉利昂:Sierra Leone sn:塞内加尔:Senegal sz:斯威士兰:Eswatini so:索马里:Somalia za:南非:South Africa sc:塞舌尔:Seychelles cf:中非:Central African Republic tn:突尼斯:Tunisia tg:多哥:Togo td:乍得:Chad ne:尼日尔:Niger zm:赞比亚:Zambia ga:加蓬:Gabon rw:卢旺达:Rwanda ug:乌干达:Uganda bi:布隆迪:Burundi km:科摩罗:Comoros st:圣多美和普林西比:São Tomé and Príncipe',
 oc:'au:澳大利亚:Australia nu:纽埃:Niue ki:基里巴斯:Kiribati ck:库克群岛:Cook Islands vu:瓦努阿图:Vanuatu fm:密克罗尼西亚:Micronesia nr:瑙鲁:Nauru pg:巴布亚新几内亚:Papua New Guinea pw:帕劳:Palau ws:萨摩亚:Samoa mh:马绍尔群岛:Marshall Islands sb:所罗门群岛:Solomon Islands to:汤加:Tonga fj:斐济:Fiji tv:图瓦卢:Tuvalu nz:新西兰:New Zealand',
 na:'us:美国:United States dm:多米尼克:Dominica mx:墨西哥:Mexico ni:尼加拉瓜:Nicaragua do:多米尼加:Dominican Republic pa:巴拿马:Panama ca:加拿大:Canada cu:古巴:Cuba ag:安提瓜和巴布达:Antigua and Barbuda gd:格林纳达:Grenada sv:萨尔瓦多:El Salvador jm:牙买加:Jamaica vc:圣文森特和格林纳丁斯:Saint Vincent and the Grenadines gt:危地马拉:Guatemala tt:特立尼达和多巴哥:Trinidad and Tobago ht:海地:Haiti kn:圣基茨和尼维斯:Saint Kitts and Nevis bz:伯利兹:Belize bb:巴巴多斯:Barbados cr:哥斯达黎加:Costa Rica bs:巴哈马:Bahamas hn:洪都拉斯:Honduras lc:圣卢西亚:Saint Lucia',
 sa:'br:巴西:Brazil ar:阿根廷:Argentina cl:智利:Chile pe:秘鲁:Peru co:哥伦比亚:Colombia ve:委内瑞拉:Venezuela ec:厄瓜多尔:Ecuador bo:玻利维亚:Bolivia py:巴拉圭:Paraguay uy:乌拉圭:Uruguay gy:圭亚那:Guyana sr:苏里南:Suriname'};
const WF=[];Object.entries(WF_RAW).forEach(([c,str])=>str.split(/ (?=[a-z]{2}:)/).forEach(x=>{const [id,zh,...en]=x.split(':');WF.push({id,zh,en:en.join(':'),c})}));
const WF_SAME=[['id','mc'],['td','ro'],['nl','lu'],['ie','ci'],['ml','sn'],['co','ec'],['au','nz'],['no','is'],['ve','ec'],['si','sk','ru']];
const flagEmoji=id=>String.fromCodePoint(...id.toUpperCase().split('').map(ch=>0x1F1E6+ch.charCodeAt(0)-65));
let FLAGOK=null;function flagEmojiOK(){if(FLAGOK!==null)return FLAGOK;try{const c=document.createElement('canvas').getContext('2d');c.font='32px sans-serif';const a=c.measureText(flagEmoji('my')).width,b=c.measureText(String.fromCodePoint(0x1F1F2)).width;FLAGOK=a<b*1.6}catch(e){FLAGOK=false}return FLAGOK}
function wfOpts(f,pool){const bad=new Set([f.id]);WF_SAME.forEach(g=>{if(g.includes(f.id))g.forEach(x=>bad.add(x))});const o=[f];for(const x of shuffle(pool)){if(o.length>=4)break;if(bad.has(x.id))continue;o.push(x);WF_SAME.forEach(g=>{if(g.includes(x.id))g.forEach(y=>bad.add(y))});bad.add(x.id)}return shuffle(o)}
/* 马来西亚旅游胜地 (picture dictionary Tema 11, p.98): place → state */
const MYST={trg:['登嘉楼','Terengganu'],mlk:['马六甲','Melaka'],png:['槟城','Pulau Pinang'],phg:['彭亨','Pahang'],sgr:['雪兰莪','Selangor'],pjy:['布城','Putrajaya'],pls:['玻璃市','Perlis'],sbh:['沙巴','Sabah'],
 jhr:['柔佛','Johor'],kdh:['吉打','Kedah'],prk:['霹雳','Perak'],ktn:['吉兰丹','Kelantan'],swk:['砂拉越','Sarawak'],nsn:['森美兰','Negeri Sembilan']};
const MYTOUR=[['🏝️','热浪岛','Pulau Redang','trg','海水很清，可以看到很多鱼和珊瑚'],['🏰','古城门','A Famosa','mlk','很久以前葡萄牙人建的城堡，现在只剩下这道门'],['🛕','极乐寺','Tokong Kek Lok Si','png','建在山上的大佛寺，有一座很高的宝塔'],
 ['🍃','金马仑高原','Tanah Tinggi Cameron','phg','高原上凉凉的，有一大片一大片的茶园'],['🪜','黑风洞','Batu Caves','sgr','山洞前有一座很高的金色神像和彩色的楼梯'],['🕌','布特拉清真寺','Masjid Putra','pjy','粉红色圆顶的清真寺，就在湖边'],
 ['🐢','兰道阿邦','Rantau Abang','trg','以前有很多大海龟晚上爬上沙滩生蛋'],['🕳️','暗窿','Gua Kelam','pls','一个可以沿着走道走进去的长长山洞'],['⛰️','神山','Gunung Kinabalu','sbh','马来西亚最高的山']];
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
