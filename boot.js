'use strict';
// Resolve the current release before loading game assets, even from a cached page.
(async()=>{
 const base=new URL('.',document.currentScript.src),fallback='20261120-speed2';
 let version=fallback;
 if(location.protocol!=='file:'){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),4000);
  try{const url=new URL('version.json',base);url.searchParams.set('t',String(Date.now()));const response=await fetch(url,{cache:'no-store',signal:controller.signal});if(response.ok){const release=await response.json();if(typeof release.version==='string'&&/^[a-zA-Z0-9._-]{1,80}$/.test(release.version))version=release.version}}catch{}finally{clearTimeout(timeout)}
 }
 const asset=name=>{const url=new URL(name,base);url.searchParams.set('v',version);return url.href};
 const stylesheet=document.querySelector('link[rel="stylesheet"]');stylesheet.href=asset('style.css');
 window.__CELL_BUILD__=version;
 try{for(const name of ['questions.js','docx.js','arcade.js'])await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=asset(name);script.onload=resolve;script.onerror=()=>reject(new Error('Failed to load '+name));document.body.append(script)})}
 catch(error){console.error(error);const overlay=document.querySelector('#overlay');overlay.classList.remove('hidden');overlay.innerHTML='<div class="splash"><h2>게임을 불러오지 못했어요.</h2><p>인터넷 연결을 확인하고 다시 시도해 주세요.</p><button class="primary" id="retry-load">다시 불러오기</button></div>';document.querySelector('#retry-load').onclick=()=>location.reload()}
})();
