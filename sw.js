const C='vocabbook-v2';
const FILES=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  const same=u.origin===self.location.origin;
  const lib=u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/');
  const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(!(same||lib||font))return;
  if(same){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();if(res.ok)caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{const cp=res.clone();if(res.ok||res.type==='opaque')caches.open(C).then(c=>c.put(r,cp));return res})));
  }
});
