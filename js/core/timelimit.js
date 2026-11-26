/* ---------------- 时间提醒 ---------------- */
function todaySecs(){return (S.days[dk()]||{}).secs||0}
function overLimit(){return S.limit>0&&todaySecs()>=(S.limit+((S.days[dk()]||{}).extra||0))*60}
function showRest(){if(document.querySelector('.rest'))return;const o=document.createElement('div');o.className='rest';
  o.innerHTML=`<div class="panel setup" style="max-width:520px">${pandaDressed(130,'happy')}<h1 style="font-size:32px">眼睛要休息啦 😴</h1><p style="font-size:20px">今天已经学习了 ${Math.round(todaySecs()/60)} 分钟，真棒！<br>去喝杯水、看看远方、动一动身体吧。</p><div class="row" style="justify-content:center"><button class="btn sun big" data-rest="ok">好的，休息一下</button><button class="btn" data-rest="parent">家长：再玩 10 分钟</button></div></div>`;
  o.addEventListener('click',e=>{const t=e.target.closest('[data-rest]');if(!t)return;
    if(t.dataset.rest==='ok'){o.remove();if(view.name!=='home')go({name:'home'})}
    else{const more=()=>{const d=dayRec();d.extra=(d.extra||0)+10;touch();o.remove();toast('已经多加 10 分钟 ⏱️')};if(ALL.pin){pinUntil=0;needPin(more);return}const a=rnd(6,9),c=rnd(6,9);const ans=prompt('家长确认：'+a+' × '+c+' = ?');if(ans!==null&&+ans===a*c)more();else if(ans!==null)toast('答案不对哦')}});
  document.body.appendChild(o);speak('眼睛要休息啦，去喝杯水吧！','zh')}
setInterval(()=>{if(document.hidden||!S.name)return;const d=dayRec();d.secs=(d.secs||0)+30;saveLocal();if(overLimit()&&!['game','duelplay','setup'].includes(view.name))showRest()},30000);
