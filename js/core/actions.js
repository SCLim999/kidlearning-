/* ---------------- actions ---------------- */
app.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v;
  switch(a){
    case 'ava':view.ava=v;view.nm=(document.getElementById('nm')||{}).value;sTap();render();break;
    case 'start':{const n=(document.getElementById('nm').value||'').trim();if(!n){toast('先写下你的名字哦 ✏️');return}
      if(view.newKid){const id='k'+Date.now();ALL.kids[id]=blank();ALL.cur=id;S=ALL.kids[id];S.avatar='🐰'}
      S.name=n;S.avatar=view.ava||S.avatar;touch();sGood();go({name:'home'});speak('Hello '+n,'en');break}
    case 'home':go({name:'home'});break;
    case 'growth':go({name:'growth'});break;
    case 'settings':needPin(()=>go({name:'settings'}));break;
    case 'subjpage':sTap();go({name:'subject'});break;
    case 'pick':{const x=SUBJS.find(y=>y.k===v&&!y.extra);if(!x)return;if(v==='en'||v==='ms'){S.subj='lang';S.lang=v}else S.subj=v;touch();sTap();go({name:'subject'});speak(v==='en'?'English':v==='ms'?'Bahasa Melayu':'我们来学'+x.zh+'！',v==='en'||v==='ms'?v:'zh');break}
    case 'lang':S.subj='lang';S.lang=v;touch();sTap();render();speak(v==='en'?'English':'Bahasa Melayu',v);break;
    case 'topic':sTap();go({name:'topic',topic:v});break;
    case 'trend':view.trend=v==='m'?'m':'w';render();break;
    case 'ltab':sTap();ltabSet(v);render();break;
    case 'story':sTap();ST=null;go({name:'story'});break;
    case 'stch':sTap();startStory(+v);break;
    case 'stmap':sTap();ST=null;if('speechSynthesis' in window)speechSynthesis.cancel();go({name:'story'});break;
    case 'stans':stAnswer(+v,b);break;
    case 'sthint':sTap();ST.hint=true;render();break;
    case 'stsay':if(ST&&ST.q)speak(ST.q.say,ST.q.sayLang||'zh');break;
    case 'stpaint':if(ST&&ST.solved&&!ST.painted.includes(+v)){ST.painted.push(+v);sTap();render();const it=document.querySelectorAll('.stitem')[+v];burst(it,'🎨')}break;
    case 'stnext':sTap();stNext();break;
    case 'stread':{if(v==='intro')speak('调皮的灰灰怪偷走了彩虹群岛的七颗知识星，岛上的颜色全都变灰了！请你和 Momo 一起出发，用学过的知识帮朋友们过难关，再把颜色涂回去吧！','zh');else if(v==='page'&&ST)speak(stText(STORY[ST.ch].sc[ST.i][1]),'zh');else{const c=STORY.find(x=>x.id===v);if(c)speak(stText(stRecap(c)),'zh')}break}
    case 'sttell':sTap();go({name:'storytell',pick:[]});break;
    case 'sttpick':{const p=view.pick||(view.pick=[]);if(p.length<3&&!p.includes(v)&&isObj(v)&&stBag().includes(v)){p.push(v);sTap();render();if(p.length===3)setTimeout(()=>speak(stTell(p)[0],'zh'),200)}break}
    case 'sttreset':sTap();view.pick=[];render();break;
    case 'sttread':{const t=stTell(view.pick||[]);speak(b.dataset.l==='en'?t[1]:t[0],b.dataset.l==='en'?'en':'zh');break}
    case 'play':startGame(v);break;
    case 'say':speak(v,S.lang);break;
    case 'sayL':speak(v,b.dataset.l);break;
    case 'sayCur':speakCur();break;
    case 'sayZh':speak(cur().w.zh,'zh');break;
    case 'prev':if(G.i>0){G.i--;resetRec();render();speakCur()}break;
    case 'lnext':cur().done=true;resetRec();if(G.i<G.qs.length-1){G.i++;render();speakCur()}else endGame();break;
    case 'rec':toggleRec();break;
    case 'card':{if(G.lock)return;const c=G.cards[+v];if(!c||c.up||c.done)return;c.up=true;sTap();if(c.k==='t')speak(c.w[G.lang],G.lang);G.open.push(c);
      if(G.open.length===2){G.moves++;const [a1,a2]=G.open;G.open=[];
        if(a1.w===a2.w){a1.done=a2.done=true;G.score++;G.combo++;G.best=Math.max(G.best,G.combo);render();sGood();speak(a1.w[G.lang],G.lang);burst(document.querySelector('.mcard[data-v="'+a1.i+'"]'),G.combo>=3?'🔥':null);
          if(G.cards.every(x=>x.done))setTimeout(endGame,1300);return}
        G.combo=0;G.lock=true;render();sBad();setTimeout(()=>{a1.up=false;a2.up=false;G.lock=false;render()},1000);return}
      render();break}
    case 'pet':sTap();go({name:'pet'});break;
    case 'map':sTap();go({name:'map'});break;
    case 'album':sTap();go({name:'album'});break;
    case 'missions':sTap();go({name:'missions'});break;
    case 'duel':sTap();go({name:'duel',opp:D?D.opp:0,sub:D?D.sub:'en'});break;
    case 'station':startStation(+v);break;
    case 'locked':sBad();toast('先完成前面的关卡哦 🔒');break;
    case 'cardsay':{const w=WMAP[b.dataset.t+':'+v];if(!w)return;speak(w.en,'en');speak(w.ms,'ms',true);speak(w.zh,'zh',true);burst(b,'✨');break}
    case 'mdone':{const m=missionState();if(m.done.includes(+v))return;m.done.push(+v);addStars(2);touch();render();sGood();speak('太棒了！','zh');burst(document.querySelector('.mission.ok:last-of-type')||document.querySelector('.mission'),'🌟');break}
    case 'dopp':view.opp=+v;sTap();render();break;
    case 'dsub':view.sub=v;sTap();render();break;
    case 'dstart':if(view.name==='duelplay'){view.opp=D.opp;view.sub=D.sub}startDuel();break;
    case 'dsay':duelSay();break;
    case 'dquit':if(D&&!D.over&&!confirm('要结束对战吗？'))return;go({name:'duel',opp:D?D.opp:0,sub:D?D.sub:'en'});break;
    case 'dans':{const p=+b.dataset.p,i=+v,q=D.qs[D.i];if(D.done||D.lock[p])return;
      if(q.opts[i].v===q.ans){D.done=true;D.winner=p;D.sc[p]++;render();sGood();burst(document.querySelector('.dside.p'+p),'⚡');speak(q.ansText,q.ansLang);setTimeout(duelNext,1900)}
      else{D.lock[p]=true;sBad();if(D.lock[0]&&D.lock[1]){D.done=true;D.winner=null;render();speak(q.ansText,q.ansLang);setTimeout(duelNext,1900)}else render()}break}
    case 'limit':S.limit=+v;touch();render();break;
    case 'cl':needPin(()=>{const d=clDraft(v||((S.custom||[]).length?'':'new'));sTap();go({name:'custom',draft:d,bad:null});if(d){const el=document.getElementById(d.id==='new'?'cl-name':'cl-text');if(el)el.focus()}});break;
    case 'cllang':clKeep();view.draft.lang=v;sTap();render();break;
    case 'clcancel':go({name:'custom',draft:null});break;
    case 'clsave':clSave();break;
    case 'clplay':{const c=(S.custom||[]).find(x=>x.id===v);if(!c)return;S.subj='lang';S.lang=c.lang;touch();sTap();go({name:'topic',topic:'my-'+c.id});break}
    case 'cldel':{const c=(S.custom||[]).find(x=>x.id===v);if(!c)return;if(confirm('要删除词表「'+c.name+'」吗？')){S.custom=S.custom.filter(x=>x!==c);touch();toast('已删除');render()}break}
    case 'export':exportData();break;
    case 'sbsend':{const em=((document.getElementById('sbmail')||{}).value||'').trim().toLowerCase();if(!/^[^\s@]{1,64}@[^\s@]{1,100}\.[a-z]{2,}$/.test(em)){toast('请输入正确的电邮');break}
      view.sb={email:em,msg:'正在寄……'};render();sbSendCode(em).then(()=>{view.sb={step:'code',email:em,msg:''};render()}).catch(e=>{view.sb={email:em,msg:'寄不出去：'+e.message};render()});break}
    case 'sbverify':{const raw=((document.getElementById('sbcode')||{}).value||'').trim(),code=raw.replace(/\s/g,''),link=/^https:\/\//i.test(raw);if(!link&&!/^\d{6,10}$/.test(code)){toast('请输入邮件里的数字登入码，或贴上登入链接');break}
      const em=(view.sb||{}).email;(link?sbVerifyLink(raw):sbVerify(em,code)).then(()=>{view.sb={};toast('已登入 ☁️');render();syncNow()}).catch(e=>{view.sb=Object.assign({},view.sb,{msg:'登入失败：'+e.message});render()});break}
    case 'sbback':view.sb={email:(view.sb||{}).email};render();break;
    case 'sbsync':sTap();syncNow();break;
    case 'sbout':if(confirm('要登出云端吗？这台设备上的资料会保留，只是不再同步。')){sbSignOut().then(()=>{view.sb={};sbState={msg:'',at:0,err:''};render()})}break;
    case 'sbbackups':cloudBackups().then(list=>{view.sb=Object.assign({},view.sb,{list});render()}).catch(e=>{view.sb=Object.assign({},view.sb,{msg:e.message});render()});break;
    case 'sbrestore':cloudRestore(v).then(r=>applyRestore(r.data,'云端备份 '+r.day)).catch(e=>toast(e.message));break;
    case 'sbdel':if(confirm('要删除云端的全部学习记录、云端备份和这个登入账号吗？\n这台设备上的资料会保留。删除以后不能复原。')){cloudDeleteAll().then(()=>sbSignOut()).then(()=>{view.sb={msg:'云端资料已经删除。'};render()}).catch(e=>{view.sb=Object.assign({},view.sb,{msg:'删除失败：'+e.message});render()})}break;
    case 'snapuse':{const x=snaps()[+v];if(x)applyRestore(normalize(x.data),x.day+' 的快照');break}
    case 'world':S.subj='world';touch();sTap();go({name:'subject'});speak('我们去环游世界！','zh');break;
    case 'malware':sTap();openMalware();break;
    case 'mist':sTap();go({name:'mist'});break;
    case 'tutor':sTap();go({name:'tutor'});break;
    case 'worlds':sTap();go({name:'worlds'});break;
    case 'world':sTap();if(WORLDS.some(x=>x.id===v))go({name:'world',w:v});break;
    case 'wch':sTap();view.ch=+v;render();break;
    case 'wnode':{const W=view.w,c=worldState(W).chs[view.ch!=null?view.ch:Math.max(0,worldState(W).chs.findIndex(x=>x.open&&!x.beaten))],n=c&&c.nodes[+v];if(!n)break;sTap();
      if(n.type==='w'){S.lang=n.lang;S.subj='lang';go({name:'topic',topic:n.id})}else go({name:'mtopic',game:n.id});break}
    case 'wboss':{const W=view.w,chs=worldState(W).chs,ci=view.ch!=null?view.ch:Math.max(0,chs.findIndex(x=>x.open&&!x.beaten));if(!chs[ci].allStarted){toast('每一站都开始以后，才能挑战知识魔王 🔒');break}sTap();startKBoss(W,ci);break}
    case 'create':sTap();go({name:'create'});break;
    case 'make':sTap();if(MAKES.some(m=>m.k===v)){if(overLimit()){showRest();break}go({name:'make',make:v,st:{}})}break;
    case 'mtool':view.st.tool=v==='x'?'':v;sTap();render();break;
    case 'mcell':{const [r,c]=v.split('-').map(Number);if(view.st.grid&&view.st.grid[r]){view.st.grid[r][c]=view.st.grid[r][c]===view.st.tool?'':view.st.tool;view.st.msg='';sTap();render()}break}
    case 'mcheck':{const res=houseCheck(view.st);view.st.msg=res.msg;render();if(res.ok){sGood();speak(res.msg.replace(/<[^>]+>/g,''),'zh');saveMade('house',res.msg.replace(/<[^>]+>/g,''),view.st.grid.map(r=>r.map(x=>x||'▫️').join('')).filter(r=>!/^(▫️)+$/.test(r)).join('\n'))}else{sBad();speak(res.msg,'zh')}break}
    case 'mreset':sTap();go({name:'make',make:view.make,st:{}});break;
    case 'mplus':case 'mminus':{const st=view.st;st.n=st.n||{};const cur0=st.n[v]||0;st.n[v]=Math.max(0,Math.min(5,cur0+(a==='mplus'?1:-1)));sTap();render();break}
    case 'madj':{const [id,adj]=v.split('|');view.st.adj=view.st.adj||{};view.st.adj[id]=view.st.adj[id]===adj?'':adj;sTap();render();break}
    case 'mread':{const st=view.st,k2=view.make,list=k2==='zoo'?[...T('zoo').words,...T('pets').words]:KAMP.map(x=>({e:x[0],ms:x[1],zh:x[2],cl:x[3]}));const ch=list.filter(x=>st.n&&st.n[x.ms]>0);
      const t=k2==='zoo'?zooText(ch,st)[0]:k2==='kampung'?kampText(ch,st)[0]:cardText(st);speak(t.replace(/\n/g,' '),b.dataset.l);break}
    case 'msave':{const st=view.st,k2=view.make;if(k2==='zoo'||k2==='kampung'){const list=k2==='zoo'?[...T('zoo').words,...T('pets').words]:KAMP.map(x=>({e:x[0],ms:x[1],zh:x[2],cl:x[3]}));const ch=list.filter(x=>st.n&&st.n[x.ms]>0);if(ch.length<3)break;const t=k2==='zoo'?zooText(ch,st):kampText(ch,st);saveMade(k2,t[0]+'\n'+t[1],ch.map(x=>x.e.repeat(st.n[x.ms])).join(' '))}
      else if(k2==='plant'){const miss=['water','sun','air','soil'].filter(x=>!st.f[x]);saveMade('plant',(miss.length?'少了：'+miss.map(x=>({water:'水',sun:'阳光',air:'空气',soil:'泥土'})[x]).join('、')+'，向日葵长不好。':'有水、阳光、空气和泥土，向日葵长大了！')+((st.guess==='y')===!miss.length?'（猜对了）':''),miss.length?'🌰 → 🥀':'🌰 → 🌱 → 🌻')}
      else if(k2==='card'){saveMade('card',cardText(st),CARD.occ[st.occ][1]+' 💌')}go({name:'create'});break}
    case 'mfactor':view.st.f[v]=view.st.f[v]?0:1;sTap();render();break;
    case 'mguess':view.st.guess=v==='y'?'y':'n';sTap();render();break;
    case 'mrun':view.st.run=1;sGood();render();break;
    case 'mocc':view.st.occ=Math.max(0,Math.min(CARD.occ.length-1,+v));view.st.w=[CARD.occ[view.st.occ][2][0]];sTap();render();break;
    case 'mto':if(CARD.to.includes(v)){view.st.to=v;sTap();render()}break;
    case 'mwish':{const w2=view.st.w;const i2=w2.indexOf(v);if(i2>=0){if(w2.length>1)w2.splice(i2,1)}else if(w2.length<4)w2.push(v);sTap();render();break}
    case 'madesay':{const x=rpg().made.find(y=>String(y.t)===v);if(x){const m=MAKES.find(y=>y.k===x.k);const l=x.k==='zoo'?'en':x.k==='kampung'?'ms':'zh';speak(x.txt.split('\n').filter(line=>l==='zh'||!/[\u4e00-\u9fff]/.test(line)).join(' '),l)}break}
    case 'tutorgo':sTap();startTutor();break;
    case 'tlang':tutorLangSet(v);render();sayTutor(view.name==='game'&&G&&G.qs[G.i]&&G.qs[G.i].tutor||'hi');break;
    case 'tsay':sayTutor(v);break;
    case 'tpractice':{sTap();const [kind,a,b2]=v.split(':');if(kind==='g'&&GAME(a))startMath(a,recLevel(a));else if(kind==='w'&&(a==='en'||a==='ms')&&T(b2)){S.lang=a;S.subj='lang';go({name:'topic',topic:b2})}break}
    case 'mistplay':startMist();break;
    case 'mistgame':{const [g,l]=v.split(':');startMath(g,+l);break}
    case 'test':sTap();go({name:'test'});break;
    case 'teststart':startTest();break;
    case 'print':go({name:'print',off:0});break;
    case 'printwk':go({name:'print',off:+v});break;
    case 'doprint':window.print();break;
    case 'letter':showLetter();break;
    case 'pinset':if(ALL.pin)changePin();else setPin();break;
    case 'admin':openAdmin();break;
    case 'adminkid':needPin(()=>go({name:'admin',kid:v}));break;
    case 'copyadmin':{const t=adminText(v);(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('摘要已复制 📋'),()=>toast('复制不了，请手动截图'));break}
    case 'pinoff':pinCheckNow('取消家长密码',()=>{if(confirm('要取消家长密码吗？取消后孩子可以随意打开家长设置。')){delete ALL.pin;delete ALL.pinRec;touch();toast('已取消密码');render()}});break;
    case 'saycheck':startSay();break;
    case 'import':document.getElementById('imp').click();break;
    case 'pat':{const t=pick(MOMO_TALK),li=rnd(0,2);const el=document.getElementById('petsay');if(el)el.innerHTML=esc(t[2])+'<small>'+esc(li===2?t[0]:t[li])+'</small>';speak(t[li],['en','ms','zh'][li]);
      const m=document.querySelector('.room .momo');if(m){m.classList.remove('dance');void m.offsetWidth;m.classList.add('dance');setTimeout(()=>m.classList.remove('dance'),1500);burst(m,'💖')}break}
    case 'feed':{if((S.bamboo||0)<3)return;const p=pet();S.bamboo-=3;p.happy=Math.min(100,happyNow()+25);p.fed=Date.now();touch();render();sGood();speak('好吃！谢谢你！','zh');burst(document.querySelector('.room .momo'),'🎋');break}
    case 'buy':{const x=SHOP.find(i=>i.id===v),p=pet();if(!x||p.owned.includes(x.id))return;if((S.bamboo||0)<x.p){sBad();toast('竹子还不够哦，再去学习赚 '+(x.p-(S.bamboo||0))+' 根竹子吧 🎋');return}
      S.bamboo-=x.p;p.owned.push(x.id);if(x.slot==='bg')p.bg=x.id;else{p.wear=p.wear||{};p.wear[x.slot]=x.id}touch();render();sGood();toast('买到了 '+x.e+' '+x.zh+'！');burst(document.querySelector('.room .momo'),x.e);break}
    case 'wear':{const p=pet();if(v==='sky'||v.startsWith('bg-'))p.bg=v;else{const x=SHOP.find(i=>i.id===v);if(!x)return;p.wear=p.wear||{};p.wear[x.slot]=p.wear[x.slot]===x.id?null:x.id}touch();sTap();render();break}
    case 'mine':playMine();break;
    case 'compare':speakCur();setTimeout(playMine,1700);break;
    case 'kids':go({name:'kids'});break;
    case 'rate':VP.rate=+v;saveVP();render();speak('This is a cat.','en');break;
    case 'pickkid':ALL.cur=v;S=ALL.kids[v];touch();sGood();go({name:S.name?'home':'setup'});break;
    case 'addkid':go({name:'setup',newKid:true});break;
    case 'delkid':{if(Object.keys(ALL.kids).length<2)return;if(confirm('确定要删除 '+S.name+' 的全部资料吗？')&&confirm('真的确定吗？这个动作不能复原。')){delete ALL.kids[ALL.cur];ALL.cur=Object.keys(ALL.kids)[0];S=ALL.kids[ALL.cur];touch();toast('已删除');go({name:'home'})}break}
    case 'copyrep':{const t=reportText();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('报告已复制，可以贴到 WhatsApp 📋'),()=>toast('复制不了，请手动截图保存'));break}
    case 'ans':{const q=cur(),i=+v;const ok=q.m==='math'?q.opts[i].v===q.ans:q.opts[i]===q.w;if(ok)answer(true,b);else{q.wrongIdx.push(i);answer(false);if(q.m==='bubble'){b.classList.add('popx')}else{b.classList.add('shake');setTimeout(render,400)}}break}
    case 'tile':{const q=cur(),t=q.tiles.find(x=>x.id===+v);const s=q.slots.find(x=>!x.fixed&&!x.val);if(!t||t.used||!s)return;
      t.used=true;s.val=t.ch;s.tile=t.id;sTap();render();spellCheck();break}
    case 'unslot':{const q=cur();if(q.done)return;const s=q.slots[+v];if(!s||!s.val)return;q.tiles.find(t=>t.id===s.tile).used=false;s.val=null;s.tile=null;render();break}
    case 'clear':{const q=cur();q.slots.forEach(s=>{if(!s.fixed){s.val=null;s.tile=null}});q.tiles.forEach(t=>t.used=false);render();break}
    case 'hint':{const q=cur();const i=q.slots.findIndex(s=>!s.fixed&&s.val!==s.ch);if(i<0)return;q.hinted=true;
      const s=q.slots[i];if(s.val){q.tiles.find(t=>t.id===s.tile).used=false;s.val=null;s.tile=null}
      const blk=q.slots.find((x,j)=>j!==i&&!x.fixed&&x.val===s.ch&&x.ch!==s.ch);if(blk){q.tiles.find(t=>t.id===blk.tile).used=false;blk.val=null;blk.tile=null}
      const t=q.tiles.find(t=>!t.used&&t.ch===s.ch);if(t){t.used=true;s.val=t.ch;s.tile=t.id}render();spellCheck();break}
    case 'next':if(G.i<G.qs.length-1){G.i++;setupTiles();render();const m=cur().m;if(m==='listen'||m==='sent'||m==='math'||m==='dict')setTimeout(speakCur,250)}else endGame();break;
    case 'quit':if(G&&G.qs.some(q=>q.done)&&!confirm('要离开吗？这一轮的进度不会保存成绩（已得的星星会保留）。'))return;G.station!=null?go({name:'map'}):isMG(G.mode)?go({name:'mtopic',game:G.game}):G.mode==='kboss'?go({name:'world',w:G.world,ch:G.ch}):G.mode==='mist'||G.mode==='test'||G.mode==='tutor'?go({name:G.mode}):G.topic==='review'?go({name:'subject'}):go({name:'topic',topic:G.topic});break;
    case 'again':G&&G.station!=null?startStation(G.station):isMG(view.mode)?startMath(G.game,G.level):view.mode==='kboss'?startKBoss(view.world,view.ch):view.mode==='mist'?startMist():view.mode==='tutor'?startTutor():view.mode==='test'?startTest():startGame(view.mode);break;
    case 'subj':S.subj=v||'math';touch();sTap();render();speak({sci:'我们来学科学！',cn:'我们来学华文！'}[S.subj]||'我们来学数学！','zh');break;
    case 'mtopic':sTap();go({name:'mtopic',game:v});break;
    case 'mplay':startMath(view.game,+v);break;
    case 'mhint':cur().hint=true;render();break;
    case 'fs':fsOff=!!fsEl();fsSet(!fsEl());break;
    case 'back':G.station!=null?go({name:'map'}):isMG(G.mode)?go({name:'mtopic',game:G.game}):G.mode==='kboss'?go({name:'world',w:G.world,ch:G.ch}):G.mode==='mist'||G.mode==='test'||G.mode==='tutor'?go({name:G.mode}):G.topic==='review'?go({name:'subject'}):go({name:'topic',topic:G.topic});break;
    case 'rename':{const n=(document.getElementById('nm2').value||'').trim();if(n){S.name=n;touch();toast('已保存 ✓');render()}break}
    case 'setava':S.avatar=v;touch();render();break;
    case 'goal':S.goal=+v;touch();render();break;
    case 'zh':S.showZh=!S.showZh;touch();render();break;
    case 'snd':S.sound=!S.sound;touch();render();break;
    case 'autolook':S.autoLook=S.autoLook===false;touch();sTap();render();break;
    case 'skin':S.skin=v;touch();render();sGood();break;
    case 'reset':if(confirm('确定要清除全部学习记录吗？星星、贴纸和成长记录都会归零。')&&confirm('真的确定吗？这个动作不能复原。')){const keep={name:S.name,avatar:S.avatar,custom:S.custom||[]};S=ALL.kids[ALL.cur]=Object.assign(blank(),keep);touch();toast('已清除');go({name:'home'})}break;
  }
});
app.addEventListener('change',e=>{const t=e.target;if(t.id==='imp'){importData(t.files&&t.files[0]);t.value='';return}if(t.classList&&t.classList.contains('vsel')){VP[t.dataset.l]=t.value;saveVP();speak({en:'Hello!',ms:'Selamat pagi!',zh:'你好！'}[t.dataset.l],t.dataset.l)}});
app.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='nm'){app.querySelector('[data-act="start"]').click();return}
  const t=e.target;if((e.key==='Enter'||e.key===' ')&&t.getAttribute&&t.getAttribute('role')==='button'&&t.dataset&&t.dataset.act&&t.tagName.toLowerCase()==='g'){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});

render();
setTimeout(initCloud,0);
setTimeout(initSync,0);
/* offline: cache the app on GitHub Pages (needs https, or localhost for testing) */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
