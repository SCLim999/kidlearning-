/* ---------------- cloud sync (Claude artifact storage) ---------------- */
let cloudRef=null,cloudTimer=null,cloudBusy=false,cloudAgain=false,cloudOn=false;
async function initCloud(){
  if(!window.claude||!window.claude.use)return;
  try{
    const db=await window.claude.use('db');const user=await window.claude.use('user');
    if(!db||!user)return;const id=await user.id();if(!id)return;
    cloudRef=db.collection('data/users/'+id).doc('progress');
    const snap=await cloudRef.get();cloudOn=true;
    if(snap.exists){const d=snap.data();if(d&&typeof d.state==='string'){const remote=normalize(JSON.parse(d.state));
      if((remote.updatedAt||0)>(ALL.updatedAt||0)){ALL=remote;S=ALL.kids[ALL.cur];saveLocal();if(view.name!=='game')render()}
      else if((ALL.updatedAt||0)>(remote.updatedAt||0))queueCloud()}}
    else if(S.name)queueCloud();
    if(view.name==='settings')render();
  }catch(e){}
}
function queueCloud(){if(!cloudRef)return;clearTimeout(cloudTimer);cloudTimer=setTimeout(pushCloud,1500)}
async function pushCloud(){if(!cloudRef)return;if(cloudBusy){cloudAgain=true;return}cloudBusy=true;
  try{await cloudRef.set({state:JSON.stringify(ALL),updatedAt:ALL.updatedAt})}catch(e){}
  cloudBusy=false;if(cloudAgain){cloudAgain=false;pushCloud()}}
