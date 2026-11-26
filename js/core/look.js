/* ---------- 每一轮的样子: per-round scene and art style (SCENES, SKINS, newLook, sceneDeco) ----------
   Used by every game start; render() applies LOOK.skin only in game/end/duel views. */
const OBJ0=['🍎','🍓','🐟','⭐','🎈','🐥','🍬','🚗','🌸','⚽','🐞','🍩'],OBJ=OBJ0.slice();
/* 每一轮换场景和画风: a random scene (background tint, decorations, counting objects) and a random art style per game round */
const SCENES=[
 {id:'ocean',e:'🌊',zh:'海底',obj:['🐠','🐙','🐚','🦀','🐡','🐳','🦑','🐟'],deco:['🐠','💧','🐙','🐚','🌊','🐳']},
 {id:'space',e:'🚀',zh:'太空',obj:['⭐','🪐','🚀','🛸','🌙','☄️','👽','🛰️'],deco:['🪐','⭐','🚀','🌙','✨','🛸']},
 {id:'forest',e:'🌳',zh:'森林',obj:['🍄','🐿️','🦔','🌰','🍁','🐞','🦉','🐻'],deco:['🌳','🍄','🦉','🍁','🌲','🐿️']},
 {id:'candy',e:'🍭',zh:'糖果屋',obj:['🍭','🍬','🧁','🍩','🍪','🍫','🍰','🍦'],deco:['🍭','🧁','🍬','🍩','🍰','🍪']},
 {id:'farm',e:'🚜',zh:'农场',obj:['🐔','🐄','🐷','🥕','🌽','🐑','🐣','🦆'],deco:['🚜','🐄','🌽','🐔','🌻','🐑']},
 {id:'garden',e:'🌸',zh:'花园',obj:['🌸','🌻','🦋','🐝','🐌','🌷','🐛','🌼'],deco:['🌸','🦋','🌷','🐝','🌻','🌼']},
 {id:'city',e:'🏙️',zh:'城市',obj:['🚗','🚌','🚲','🚕','🚓','🚑','🛴','🚂'],deco:['🏙️','🚌','🚦','🚕','🏢','🚲']},
 {id:'toys',e:'🧸',zh:'玩具房',obj:['🧸','⚽','🪁','🎈','🎲','🪀','🚂','🎨'],deco:['🧸','🎈','🪁','🎲','⚽','🪀']},
 {id:'fruit',e:'🍉',zh:'水果摊',obj:['🍎','🍌','🍇','🍓','🍊','🍉','🍍','🥭'],deco:['🍉','🍍','🍇','🍌','🍓','🍊']}];
let LOOK=null;
function newLook(){if(S.autoLook===false){LOOK=null;OBJ.splice(0,OBJ.length,...OBJ0);return}
  const prev=LOOK;const SK=SKINS.map(x=>x[0]).filter(x=>x!=='glass');let sc=pick(SCENES),sk=pick(SK);if(prev){let n=0;while((sc.id===prev.scene.id||sk===prev.skin)&&n++<20){sc=pick(SCENES);sk=pick(SK)}}
  LOOK={scene:sc,skin:sk};OBJ.splice(0,OBJ.length,...sc.obj)}
function sceneDeco(){let d=document.getElementById('scenedeco');const on=LOOK&&['game','end','duelplay'].includes(view.name);
  if(!on){if(d)d.remove();delete document.documentElement.dataset.scene;return}
  document.documentElement.dataset.scene=LOOK.scene.id;
  if(!d){d=document.createElement('div');d.id='scenedeco';d.setAttribute('aria-hidden','true');document.body.prepend(d)}
  if(d.dataset.s!==LOOK.scene.id){d.dataset.s=LOOK.scene.id;const pos=[[4,14],[88,10],[2,52],[90,48],[6,84],[86,86]];d.innerHTML=LOOK.scene.deco.map((e,i)=>`<span style="left:${pos[i][0]}%;top:${pos[i][1]}%;animation-delay:${-i*1.3}s">${e}</span>`).join('')}}
const SKINS=[['toy','🧱','积木'],['crayon','🖍️','蜡笔'],['pixel','👾','像素'],['ink','🖌️','水墨'],['candy','🍬','糖果'],['neon','🌌','星空霓虹'],['iso','🧊','立体'],['origami','🦢','折纸'],['glass','⛪','彩绘玻璃']];
