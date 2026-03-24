// =============================================
// utils.js - 날씨, 환율, 공통 유틸리티
// =============================================

const RATE = 192;
const RATE_P = 192;
let passportOpen = false;
let passportRevealed = false;


async function fetchHKWeather(){
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m,weathercode,relative_humidity_2m,precipitation&hourly=precipitation_probability&timezone=Asia/Hong_Kong&forecast_days=1');
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weathercode;
    const humid = data.current.relative_humidity_2m;
    const icon = getWeatherIcon(code);

    // 향후 6시간 강수 확률 평균
    const hIdx = new Date().getHours();
    const probs = (data.hourly?.precipitation_probability||[]).slice(hIdx, hIdx+6);
    const rainProb = probs.length ? Math.round(probs.reduce((a,b)=>a+b,0)/probs.length) : 0;
    const rainTxt = rainProb >= 20 ? rainProb+'%' : '';

    // 홈 앱 날씨카드
    const ico = document.getElementById('appWeatherIco');
    const tmpEl = document.getElementById('appWeatherTemp');
    const descEl = document.getElementById('appWeatherDesc');
    const rainEl = document.getElementById('appWeatherRain');
    const badge = document.getElementById('appWeatherBadge');
    if(ico) ico.textContent = icon;
    if(tmpEl) tmpEl.textContent = temp+'℃';
    if(descEl) descEl.textContent = '습도 '+humid+'%';
    if(rainEl) rainEl.textContent = rainTxt ? '🌧 '+rainTxt : '';
    if(badge) badge.textContent = icon+' '+temp+'℃';

    // 구버전 호환
    const el = document.getElementById('weatherVal');
    if(el) el.textContent = icon+' '+temp+'℃';
  } catch(e) {
    const el = document.getElementById('weatherVal');
    if(el) el.textContent = '🌤️ —';
  }
}

function getWeatherIcon(code){
  if(code === 0) return '☀️';
  if(code <= 2) return '⛅';
  if(code <= 3) return '☁️';
  if(code <= 49) return '🌫️';
  if(code <= 59) return '🌦️';
  if(code <= 69) return '🌧️';
  if(code <= 79) return '🌨️';
  if(code <= 82) return '🌧️';
  if(code <= 99) return '⛈️';
  return '🌤️';
}

function syncAppWeather(){
  const ico = document.getElementById('appWeatherIco');
  const temp = document.getElementById('appWeatherTemp');
  const desc = document.getElementById('appWeatherDesc');
  const badge = document.getElementById('appWeatherBadge');
  fetch('https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m,weathercode,relative_humidity_2m&timezone=Asia/Hong_Kong')
    .then(r=>r.json()).then(d=>{
      const t = Math.round(d.current.temperature_2m);
      const code = d.current.weathercode;
      const humid = d.current.relative_humidity_2m;
      const icon = getWeatherIcon(code);
      if(ico) ico.textContent = icon;
      if(temp) temp.textContent = `${t}℃`;
      if(desc) desc.textContent = `습도 ${humid}%`;
      if(badge) badge.textContent = `${icon} ${t}℃`;
      // 헤더 날씨도 업데이트
      const hv = document.getElementById('weatherVal');
      if(hv) hv.textContent = `${icon} ${t}℃`;
    }).catch(()=>{});
}

function calcHKD(){
  const v = parseFloat(document.getElementById('hkdInput2').value);
  const el = document.getElementById('krwResult');
  if(!v || isNaN(v)){ el.textContent = '— 원'; return; }
  el.textContent = Math.round(v * RATE).toLocaleString() + '원';
}

function calcKRW(){
  const v = parseFloat(document.getElementById('krwInput2').value);
  const el = document.getElementById('hkdResult');
  if(!v || isNaN(v)){ el.textContent = '— HKD'; return; }
  el.textContent = (v / RATE).toFixed(1) + ' HKD';
}

function resetHKD(){
  document.getElementById('hkdInput2').value = '';
  document.getElementById('krwResult').textContent = '— 원';
}

function resetKRW(){
  document.getElementById('krwInput2').value = '';
  document.getElementById('hkdResult').textContent = '— HKD';
}

function quickCalc(hkd){
  document.getElementById('hkdInput2').value = hkd;
  document.getElementById('krwInput2').value = '';
  document.getElementById('hkdResult').textContent = '— HKD';
  calcHKD();
}

function calcHKD_p(){
  const v = parseFloat(document.getElementById('p_hkdInput2').value);
  const el = document.getElementById('p_krwResult');
  if(!v || isNaN(v)){ el.textContent = '— 원'; return; }
  el.textContent = Math.round(v * RATE_P).toLocaleString() + '원';
}

function calcKRW_p(){
  const v = parseFloat(document.getElementById('p_krwInput2').value);
  const el = document.getElementById('p_hkdResult');
  if(!v || isNaN(v)){ el.textContent = '— HKD'; return; }
  el.textContent = (v / RATE_P).toFixed(1) + ' HKD';
}

function resetHKD_p(){
  document.getElementById('p_hkdInput2').value = '';
  document.getElementById('p_krwResult').textContent = '— 원';
}

function resetKRW_p(){
  document.getElementById('p_krwInput2').value = '';
  document.getElementById('p_hkdResult').textContent = '— HKD';
}

function quickCalc_p(hkd){
  document.getElementById('p_hkdInput2').value = hkd;
  document.getElementById('p_krwInput2').value = '';
  document.getElementById('p_hkdResult').textContent = '— HKD';
  calcHKD_p();
}

function renderAttractions(){
  const grid=document.getElementById('attGrid');
  if(!grid)return;
  grid.innerHTML=attractions.map(a=>`
    <div class="att-card" onclick="openPhoto(${a.rank})">
      ${a.img ? `<img class="att-thumb" src="${a.img}" alt="${a.name}" loading="lazy">` : `<div class="att-thumb-placeholder">${a.emoji}</div>`}
      <div class="att-body">
        <div class="att-rank">#${a.rank}</div>
        <div class="att-name">${a.name}</div>
        <div class="att-cat">${a.cat}</div>
      </div>
    </div>`).join('');
}

function openPhoto(rank){
  const a=attractions.find(x=>x.rank===rank);
  if(!a)return;
  const mapBtn = a.map ? `<a href="${a.map}" target="_blank"
    style="display:flex;align-items:center;justify-content:center;gap:8px;background:#4285f4;color:#fff;border-radius:10px;padding:12px;text-decoration:none;font-size:14px;font-weight:700;margin-top:12px;width:100%;box-sizing:border-box">
    📍 구글 맵에서 보기</a>` : '';
  document.getElementById('photoContent').innerHTML=`
    <img class="photo-modal-img" src="${a.img||''}" alt="${a.name}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      onload="this.style.display='block'"
      ${a.img?'':'style="display:none"'}>
    <div style="${a.img?'display:none':'display:flex'};height:200px;background:linear-gradient(135deg,#1e5fd4,#0e8a7c);align-items:center;justify-content:center;font-size:64px">${a.emoji}</div>
    <div class="photo-modal-body">
      <div class="att-rank" style="margin-bottom:8px">#${a.rank} TOP 15</div>
      <h2>${a.name}</h2>
      <div class="sub">${a.cat}</div>
      <p>${a.desc}</p>
      <div class="photo-tip">${a.tip}</div>
      <div style="margin-top:10px;font-size:12px;color:#94a3b8">📍 ${a.addr||''}</div>
      ${mapBtn}
    </div>`;
  document.getElementById('photoOverlay').classList.add('show');
}

function closePhoto(e){if(e.target===document.getElementById('photoOverlay'))closeAll();}

function filterPax(q){
  q=q.toLowerCase();
  document.querySelectorAll('#paxAllBody tr').forEach(r=>{
    r.style.display=r.textContent.toLowerCase().includes(q)?'':'none';
  });
  document.querySelectorAll('.tab')[0].click();
}

function resetSortBtns(){
  document.querySelectorAll('.sb').forEach(b=>{
    b.classList.remove('on');
    b.textContent=b.textContent.replace(' ▲','').replace(' ▼','');
  });
}

function resetSort(btn){
  if(!origRows)return;
  const tbody=document.getElementById('finalBody');
  tbody.innerHTML='';
  origRows.forEach(r=>tbody.appendChild(r.cloneNode(true)));
  Object.keys(sortStates).forEach(k=>delete sortStates[k]);
  resetSortBtns();
  btn.classList.add('on');
  btn.textContent='번호순 ▲';
}

function sortFinal(col,btn){
  const tbody=document.getElementById('finalBody');
  const rows=Array.from(tbody.querySelectorAll('tr'));
  const key='col'+col;
  const asc=sortStates[key]!=='asc';
  sortStates[key]=asc?'asc':'desc';
  rows.sort((a,b)=>{
    const ta=a.cells[col]?.textContent.trim()||'';
    const tb=b.cells[col]?.textContent.trim()||'';
    return asc?ta.localeCompare(tb,'ko'):tb.localeCompare(ta,'ko');
  });
  rows.forEach(r=>tbody.appendChild(r));
  resetSortBtns();
  btn.classList.add('on');
  btn.textContent=btn.textContent+(asc?' ▲':' ▼');
}

function toggleDone(cb){
  const item=cb.closest('.checklist-item');
  item.classList.toggle('done',cb.checked);
}

function showInstallBanner(){
  if(document.getElementById('pwaInstallBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#0a1628,#1a56d6);
    color:#fff;border-radius:14px;padding:12px 18px;
    display:flex;align-items:center;gap:12px;
    box-shadow:0 8px 32px rgba(0,0,0,.35);
    z-index:9999;font-family:inherit;
    animation:slideUpIn .4s cubic-bezier(.34,1.4,.64,1);
    max-width:320px;width:calc(100% - 40px);
  `;
  banner.innerHTML = `
    <span style="font-size:28px">📲</span>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:800">앱으로 설치하기</div>
      <div style="font-size:11px;opacity:.75;margin-top:1px">홈 화면에서 바로 실행</div>
    </div>
    <button onclick="installPWA()" style="background:#f0cc6a;color:#0a1628;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;font-family:inherit">설치</button>
    <button onclick="dismissInstall()" style="background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;cursor:pointer;padding:0 4px;line-height:1">✕</button>
  `;
  document.body.appendChild(banner);
}

function installPWA(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(r => {
    deferredPrompt = null;
    dismissInstall();
  });
}

function dismissInstall(){
  const b = document.getElementById('pwaInstallBanner');
  if(b) b.remove();
}

function togglePassportDetail(){
  passportOpen = !passportOpen;
  const detail = document.getElementById('passportDetail');
  const arrow = document.getElementById('passportArrow');
  if(!passportOpen) passportRevealed = false;
  if(detail) detail.style.display = passportOpen ? 'block' : 'none';
  if(arrow) arrow.style.transform = passportOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  updatePassportMask();
}

function togglePassportReveal(e){
  if(e) e.stopPropagation();
  passportRevealed = !passportRevealed;
  updatePassportMask();
}

function updatePassportMask(){
  const numEl = document.getElementById('passportNumDisplay');
  const revBtn = document.getElementById('passportRevealBtn');
  if(!numEl) return;
  numEl.textContent = passportRevealed ? numEl.dataset.real : numEl.dataset.masked;
  if(revBtn) revBtn.textContent = passportRevealed ? '🙈 숨기기' : '👁 보기';
}

