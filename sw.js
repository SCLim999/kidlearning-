/* Momo offline cache: network first (so updates show up), cache as fallback when offline */
const CACHE='momo-v4';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./fig/clock.html','./fig/magnet.html','./fig/plant.html','./fig/soil.html','./world/index.html','./malware/index.html','./malware/css/game.css','./malware/css/firewall.css','./malware/js/firewall-levels.js','./malware/js/firewall-history.js','./malware/js/firewall-phishing.js','./malware/js/firewall.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
