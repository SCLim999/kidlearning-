/* ---------------- 华文 Chinese: games (the characters are in data/chinese.js) ---------------- */
function toneVars(p){for(const ts of Object.values(TONEV))for(let k=0;k<4;k++){const i=p.indexOf(ts[k]);if(i>=0)return [0,1,2,3].map(t=>p.slice(0,i)+ts[t]+p.slice(i+1))}return [p]}
const hzPool=L=>L===1?HZ.slice(0,24):HZ;
const hzOpts=(z,pool)=>shuffle([z,...shuffle(pool.filter(x=>x!==z&&x[0]!==z[0])).slice(0,3)]).map(x=>({v:x[0],l:`<span class="hz">${x[0]}</span>`}));
const CI2=HZ2.concat(HZ.filter(z=>!'一二三上下目口人心田'.includes(z[0]))).filter((z,i,a)=>z[3].length===2&&a.findIndex(y=>y[3]===z[3])===i);
const CG={
 kanzi:{zh:'看图识字',e:'🖼️',hue:'#FFD1D1',d:'看图，找出对的字',l1:'24 个常用字',l2:'全部 41 个字',how:'看看图片是什么，从四个字里找出对的那一个。按「💡 提示」会出现拼音和词语。',
  gen:L=>{const z=pick(hzPool(L));return{title:'这是什么字？',say:'这是什么字？',html:h=>`<div style="font-size:96px;line-height:1.1">${z[2]}</div>`+(h?`<div class="hintbox">💡 拼音：${z[1]}　词语：${z[3]}</div>`:''),big:true,ans:z[0],opts:hzOpts(z,hzPool(L)),
   explain:`${z[2]} 是「<b>${z[0]}</b>」（${z[1]}），${z[3]}的${z[0]}。`,sayAns:`${z[0]}，${z[3]}的${z[0]}`}}},
 tingzi:{zh:'听音选字',e:'👂',hue:'#C9E7FF',d:'听一听，选出对的字',l1:'24 个常用字',l2:'全部 41 个字',how:'按「🔊 听题目」，听 Momo 念的是哪一个字，再选出来。按「💡 提示」会出现图片。',
  gen:L=>{const z=pick(hzPool(L));return{title:'听一听，是哪一个字？',say:`${z[3]}的${z[0]}`,html:h=>h?`<div class="hintbox">💡 ${z[2]} ${z[1]}</div>`:'<div style="font-size:72px">👂</div>',big:true,ans:z[0],opts:hzOpts(z,hzPool(L)),
   explain:`Momo 念的是「<b>${z[0]}</b>」（${z[1]}），${z[3]}的${z[0]} ${z[2]}。`,sayAns:`${z[3]}的${z[0]}`}}},
 pinyin:{zh:'拼音',e:'🔤',hue:'#E3D4FF',d:'这个字怎么拼？',l1:'选对的拼音',l2:'选对的声调',how:'看字，选出它的拼音。中等关要分辨四个声调：一声 ˉ 平平的，二声 ˊ 往上，三声 ˇ 先下后上，四声 ˋ 往下。',
  gen:L=>{const z=pick(HZ);let ps;if(L===2&&toneVars(z[1]).length===4)ps=toneVars(z[1]);else{const seen=new Set([z[1]]);ps=[z[1],...shuffle(HZ).map(x=>x[1]).filter(p=>!seen.has(p)&&seen.add(p)).slice(0,3)]}
   return{title:'这个字的拼音是哪一个？',say:'这个字的拼音是哪一个？',html:h=>`<div class="hz" style="font-size:110px;line-height:1.1">${z[0]}</div>`+(h?`<div class="hintbox">💡 ${z[2]} ${z[3]}${L===2?'　一声 ˉ 平，二声 ˊ 上，三声 ˇ 拐弯，四声 ˋ 下':''}</div>`:''),ans:z[1],opts:shuffle(ps).map(p=>({v:p,l:`<span style="font-size:40px">${p}</span>`})),
   explain:`「${z[0]}」的拼音是 <b>${z[1]}</b>，${z[3]}的${z[0]}。`,sayAns:`${z[0]}，${z[3]}的${z[0]}`}}},
 kanzi2:{yr:2,zh:'看图识字',e:'🖼️',hue:'#FFD1D1',d:'二年级生字',l1:'前 17 个字',l2:'全部 34 个字',how:'看看图片是什么，从四个字里找出对的那一个。按「💡 提示」会出现拼音和词语。',
  gen:L=>{const pool=L===1?HZ2.slice(0,17):HZ2,z=pick(pool);return{title:'这是什么字？',say:'这是什么字？',html:h=>`<div style="font-size:96px;line-height:1.1">${z[2]}</div>`+(h?`<div class="hintbox">💡 拼音：${z[1]}　词语：${z[3]}</div>`:''),big:true,ans:z[0],opts:hzOpts(z,pool),
   explain:`${z[2]} 是「<b>${z[0]}</b>」（${z[1]}），${z[3]}的${z[0]}。`,sayAns:`${z[0]}，${z[3]}的${z[0]}`}}},
 tingzi2:{yr:2,zh:'听音选字',e:'👂',hue:'#C9E7FF',d:'二年级生字',l1:'前 17 个字',l2:'全部 34 个字',how:'按「🔊 听题目」，听 Momo 念的是哪一个字，再选出来。按「💡 提示」会出现图片。',
  gen:L=>{const pool=L===1?HZ2.slice(0,17):HZ2,z=pick(pool);return{title:'听一听，是哪一个字？',say:`${z[3]}的${z[0]}`,html:h=>h?`<div class="hintbox">💡 ${z[2]} ${z[1]}</div>`:'<div style="font-size:72px">👂</div>',big:true,ans:z[0],opts:hzOpts(z,pool),
   explain:`Momo 念的是「<b>${z[0]}</b>」（${z[1]}），${z[3]}的${z[0]} ${z[2]}。`,sayAns:`${z[3]}的${z[0]}`}}},
 pinyin2:{yr:2,zh:'拼音',e:'🔤',hue:'#E3D4FF',d:'二年级生字的拼音',l1:'选对的拼音',l2:'选对的声调',how:'看字，选出它的拼音。中等关要分辨四个声调：一声 ˉ 平平的，二声 ˊ 往上，三声 ˇ 先下后上，四声 ˋ 往下。',
  gen:L=>{const z=pick(HZ2);let ps;if(L===2&&toneVars(z[1]).length===4)ps=toneVars(z[1]);else{const seen=new Set([z[1]]);ps=[z[1],...shuffle(HZ2).map(x=>x[1]).filter(p=>!seen.has(p)&&seen.add(p)).slice(0,3)]}
   return{title:'这个字的拼音是哪一个？',say:'这个字的拼音是哪一个？',html:h=>`<div class="hz" style="font-size:110px;line-height:1.1">${z[0]}</div>`+(h?`<div class="hintbox">💡 ${z[2]} ${z[3]}${L===2?'　一声 ˉ 平，二声 ˊ 上，三声 ˇ 拐弯，四声 ˋ 下':''}</div>`:''),ans:z[1],opts:shuffle(ps).map(p=>({v:p,l:`<span style="font-size:40px">${p}</span>`})),
   explain:`「${z[0]}」的拼音是 <b>${z[1]}</b>，${z[3]}的${z[0]}。`,sayAns:`${z[0]}，${z[3]}的${z[0]}`}}},
 ciyu:{yr:2,zh:'词语',e:'📚',hue:'#FFE9A8',d:'看图选词语、补字',l1:'看图选词语',l2:'词语少了一个字',how:'两个字合起来变成词语，像「雨」和「伞」变成「雨伞」。看图选出对的词语，或者找出词语里少了的那个字。',
  gen:L=>{const z=pick(CI2),others=shuffle(CI2.filter(x=>x[3]!==z[3]&&x[2]!==z[2])).slice(0,3);
   if(L===1)return{title:'图里是什么词语？',say:'图里是什么词语？',html:h=>`<div style="font-size:96px;line-height:1.1">${z[2]}</div>`+(h?`<div class="hintbox">💡 这个词语里有「${z[0]}」字</div>`:''),big:true,ans:z[3],opts:shuffle([z,...others]).map(x=>({v:x[3],l:`<span class="hz" style="font-size:44px">${x[3]}</span>`})),
     explain:`${z[2]} 是「<b>${z[3]}</b>」。`,sayAns:z[3]};
   const k=z[3].indexOf(z[0]),blank=z[3].split('').map((c,i)=>i===k?'＿':c).join(''),chars=shuffle([z[0],...shuffle(HZ2.concat(HZ).map(x=>x[0]).filter(c=>c!==z[0]&&!z[3].includes(c))).slice(0,3)]);
   return{title:`「${blank}」少了哪一个字？`,say:`${blank.replace('＿','什么')}，少了哪一个字？`,html:h=>`<div class="hz" style="font-size:72px;letter-spacing:8px">${blank}</div>`+(h?`<div class="hintbox">💡 ${z[2]} 拼音：${z[1]}</div>`:''),big:true,ans:z[0],opts:chars.map(c=>({v:c,l:`<span class="hz">${c}</span>`})),
    explain:`${z[2]}「${z[3]}」少了「<b>${z[0]}</b>」（${z[1]}）。`,sayAns:z[3]}}},
 fanyi:{zh:'反义词',e:'↔️',hue:'#E1BEE7',d:'大↔小、快↔慢、开↔关',l1:'华文反义词',l2:'English / BM 反义词',how:'反义词是意思相反的词：大和小、快和慢、开和关、满和空。想一想它们的样子，一个和另一个正好相反。',
  gen:L=>{const ws=[...T('opp1').words,...T('opp2').words],w=pick(ws),o=oppOf(w);
   const lg=L===1?'zh':pick(['en','ms']),bad=new Set(ws.filter(y=>y[lg]===w[lg]).map(y=>oppOf(y)[lg])),others=shuffle(ws.filter(x=>x!==w&&x[lg]!==w[lg]&&!bad.has(x[lg]))).filter((x,i,a)=>a.findIndex(y=>y[lg]===x[lg])===i).slice(0,3);
   const word=lg==='zh'?w.zh:w[lg],nm=lg==='en'?'英文':'国文';
   return{title:lg==='zh'?`「${w.zh}」的反义词是什么？`:`${nm}「${esc(word)}」的反义词是什么？`,say:lg==='zh'?`${w.zh}的反义词是什么？`:`${w.zh}的反义词是什么？`,
    html:h=>`<div style="font-size:80px;line-height:1.1">${pic(w)}</div><div class="zh" style="font-size:26px;font-weight:800">${esc(word)}</div>`+(h?`<div class="hintbox">💡 想一想「${w.zh}」的相反：<span style="font-size:40px">${pic(o)}</span></div>`:''),big:true,ans:o[lg],
    opts:shuffle([o,...others]).map(x=>({v:x[lg],l:esc(x[lg])+(lg==='zh'?'':' <small>'+esc(x.zh)+'</small>')})),explain:`<b>${esc(word)}</b> ↔ <b>${esc(o[lg])}</b>（${w.zh} ↔ ${o.zh}）`,sayAns:`${w.zh}的反义词是${o.zh}`}}},
 xinyang:{zh:'我们的宗教信仰',e:'🙏',hue:'#FFE0B2',d:'佛教、伊斯兰教、兴都教、基督教',l1:'在哪里祈祷？',l2:'读一读',how:'马来西亚有不同的宗教：佛教、伊斯兰教、兴都教和基督教。沙巴一部分卡达山杜顺族相信稻神，砂拉越一些伊班族相信神灵。我们要互相尊重别人的宗教信仰。',
  gen:L=>{const R=[['@theanhou','佛教','佛寺'],['🕌','伊斯兰教','清真寺'],['🛕','兴都教','兴都庙'],['⛪','基督教','教堂']],x=pick(R),k=lab;
   if(L===1){const rev=Math.random()<0.4;
    if(!rev)return{title:`在${x[2]}祈祷的人信奉什么宗教？`,say:`在${x[2]}祈祷的人信奉什么宗教？`,html:h=>`<div style="font-size:80px;line-height:1.1">${pic({e:x[0],zh:x[2]})}</div><div class="zh">${x[2]}</div>`+(h?`<div class="hintbox">💡 ${R.filter(r=>r!==x).map(r=>r[2]+' → '+r[1]).join('，')}，那${x[2]}呢？</div>`:''),big:true,ans:x[1],
      opts:shuffle(R).map(r=>({v:r[1],l:r[1]})),explain:`在${x[2]}祈祷的人信奉 <b>${x[1]}</b>。我们要互相尊重。`,sayAns:`我信奉${x[1]}`};
    return{title:`信奉${x[1]}的人在哪里祈祷？`,say:`信奉${x[1]}的人在哪里祈祷？`,html:h=>`<div style="font-size:34px;font-weight:800">我信奉${x[1]}。</div>`+(h?`<div class="hintbox">💡 ${R.map(r=>r[1]+' → '+r[2]).filter(t=>!t.startsWith(x[1])).join('，')}</div>`:''),big:true,ans:x[2],
     opts:shuffle(R).map(r=>({v:r[2],l:k(r[0].startsWith('@')?icoSvg(r[0]):r[0],r[2])})),explain:`信奉${x[1]}的人在 <b>${x[2]}</b> 祈祷。`,sayAns:`信奉${x[1]}的人在${x[2]}祈祷`}}
   const S2=[['沙巴一部分卡达山杜顺族相信＿＿。','稻神','🌾'],['砂拉越一些伊班族相信＿＿。','神灵','✨'],['我们都有各自的＿＿＿＿。','宗教信仰','🙏'],...R.map(r=>[`我信奉＿＿＿。我在${r[2]}祈祷。`,r[1],r[0]])],q=pick(S2);
   const pool=['稻神','神灵','宗教信仰',...R.map(r=>r[1])].filter(v=>v!==q[1]&&(q[1].length===2?v.length<=3:true));
   return{title:q[0],say:q[0].replace(/＿+/,'什么'),html:h=>`<div style="font-size:72px;line-height:1.1">${pic({e:q[2],zh:q[1]})}</div>`+(h?`<div class="hintbox">💡 看看图，想一想课本里的句子。</div>`:''),big:true,ans:q[1],
    opts:shuffle([q[1],...shuffle(pool).slice(0,3)]).map(v=>({v,l:v})),explain:`${q[0].replace(/＿+/,'<b>'+q[1]+'</b>')} 我们要互相尊重别人的宗教信仰。`,sayAns:q[0].replace(/＿+/,q[1])}}}
};
const cnCards=()=>byYear(Object.entries(CG),gameCard);
function cnPanel(){const st=S.cn||{};const rows=Object.entries(CG).map(([k,g])=>{const r=st[k]||{c:0,w:0},t=r.c+r.w,acc=t?Math.round(r.c*100/t):0;
  return `<div style="font-weight:700">${g.e} ${g.zh}${g.yr===2?' <span class="zh" style="font-size:13px">二年级</span>':''}</div><div class="mrow"><div class="meter"><i style="width:${acc}%;background:var(--pink)"></i></div>${t?'答对 '+r.c+' 题 · '+acc+'%':'还没玩过'}</div>`}).join('');
  return `<div class="panel"><h2>华文 🀄</h2><div class="zh" style="font-size:14px;margin:-6px 0 10px">粉红条＝第一次就答对的比例</div><div class="bars2">${rows}</div></div>`}
