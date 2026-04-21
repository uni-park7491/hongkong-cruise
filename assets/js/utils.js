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


// ─────────────────────────────────────────────
// 금융 주의사항 모달
// ─────────────────────────────────────────────
function showFinanceWarning(){
  const old = document.getElementById('_financeModal');
  if(old) old.remove();
  const modal = document.createElement('div');
  modal.id = '_financeModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;padding:0;backdrop-filter:blur(4px)';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;padding:24px 20px 40px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:16px;font-weight:900;color:#dc2626">⚠️ 금융 보안 주의사항</div>
        <button onclick="document.getElementById('_financeModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8">×</button>
      </div>
      <div style="background:#fef2f2;border:1.5px solid #fca5a5;border-radius:12px;padding:14px;margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#dc2626;margin-bottom:6px">🚨 홍콩 현지 최신 사기 수법</div>
        <div style="font-size:12px;color:#7f1d1d;line-height:1.7">
          홍콩 경찰은 2025~26년 저금리 대출을 미끼로 암호화폐 보증금을 요구하는 사기를 대대적으로 단속 중입니다. 은행 직원을 사칭해 가짜 사무실로 유인하는 사례가 급증하고 있어요.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:12px">
          <div style="font-size:12px;font-weight:800;color:#c2410c;margin-bottom:4px">📱 가짜 앱 & 피싱 주의</div>
          <div style="font-size:12px;color:#431407;line-height:1.6">TokenPocket, WalletConnect 등을 사칭한 가짜 앱이 유포 중입니다. 반드시 공식 앱스토어에서만 다운로드하세요. APK 직접 설치는 절대 금지.</div>
        </div>
        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:12px">
          <div style="font-size:12px;font-weight:800;color:#c2410c;margin-bottom:4px">🔑 시드구문·개인키 절대 비공개</div>
          <div style="font-size:12px;color:#431407;line-height:1.6">지갑 복구를 도와준다며 시드 구문(12~24단어)이나 개인키를 요구하면 100% 사기입니다. 어떤 상황에서도 공유하지 마세요.</div>
        </div>
        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:12px">
          <div style="font-size:12px;font-weight:800;color:#c2410c;margin-bottom:4px">📷 QR코드 스캔 주의 (퀴싱)</div>
          <div style="font-size:12px;color:#431407;line-height:1.6">길거리·식당의 QR코드가 가짜일 수 있습니다. QR 스티커가 덧붙여져 있거나 출처 불명의 QR은 절대 스캔하지 마세요. 전체 온라인 사기의 20%가 QR 피싱입니다.</div>
        </div>
        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:12px">
          <div style="font-size:12px;font-weight:800;color:#c2410c;margin-bottom:4px">💸 주소 중독 공격 (Address Poisoning)</div>
          <div style="font-size:12px;color:#431407;line-height:1.6">소액 코인을 먼저 보내 거래 내역에 가짜 주소를 심는 수법입니다. 항상 전체 지갑 주소를 처음부터 끝까지 확인하세요.</div>
        </div>
        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:12px">
          <div style="font-size:12px;font-weight:800;color:#c2410c;margin-bottom:4px">🤝 오프라인 사기 주의</div>
          <div style="font-size:12px;color:#431407;line-height:1.6">2023년 로마 조직범죄단이 트러스트월렛 사용자를 대면으로 접근해 $400만을 탈취한 사례처럼, 현지에서 낯선 사람의 도움이나 투자 제안에 각별히 주의하세요.</div>
        </div>
        <div style="background:#fef2f2;border-radius:10px;padding:12px;margin-top:4px">
          <div style="font-size:12px;font-weight:800;color:#dc2626;margin-bottom:6px">✅ 안전 수칙 체크리스트</div>
          <div style="font-size:12px;color:#7f1d1d;line-height:1.8">
            ☐ 공식 앱 외 설치 안 함<br>
            ☐ 시드구문 절대 공유 안 함<br>
            ☐ 모르는 QR코드 스캔 안 함<br>
            ☐ 송금 전 주소 전체 확인<br>
            ☐ 투자 권유·고수익 제안 즉시 거절<br>
            ☐ 공공 WiFi에서 지갑 접속 안 함
          </div>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

// ─────────────────────────────────────────────
// 주차 정보 모달
// ─────────────────────────────────────────────
function showParkingInfo(){
  const old = document.getElementById('_parkingModal');
  if(old) old.remove();
  const modal = document.createElement('div');
  modal.id = '_parkingModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;padding:0;backdrop-filter:blur(4px)';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;padding:24px 20px 40px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:16px;font-weight:900;color:#0f2044">🅿️ 인천공항 주차 가이드</div>
        <button onclick="document.getElementById('_parkingModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8">×</button>
      </div>

      <!-- 실시간 주차 현황 링크 -->
      <a href="https://www.airport.kr/ap_ko/570/subview.do" target="_blank"
        style="display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#1e5fd4,#0e8a7c);border-radius:12px;padding:14px 16px;margin-bottom:14px;text-decoration:none">
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff">📡 실시간 주차 가능 대수 확인</div>
          <div style="font-size:11px;color:rgba(255,255,255,.7);margin-top:2px">인천공항 공식 사이트 → 탭하면 이동</div>
        </div>
        <span style="font-size:20px">›</span>
      </a>

      <!-- T1 -->
      <div style="background:#f0f4ff;border-radius:14px;padding:16px;margin-bottom:12px">
        <div style="font-size:14px;font-weight:900;color:#0f2044;margin-bottom:10px">✈️ 제1터미널 (아시아나 OZ721)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="background:#fff;border-radius:10px;padding:12px">
            <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">단기주차장</div>
            <div style="font-size:16px;font-weight:800;color:#1e5fd4">₩24,000</div>
            <div style="font-size:11px;color:#64748b">1일 최대</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:12px">
            <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">장기주차장</div>
            <div style="font-size:16px;font-weight:800;color:#0e8a7c">₩9,000</div>
            <div style="font-size:11px;color:#64748b">1일 최대</div>
          </div>
        </div>
        <div style="font-size:12px;color:#374151;line-height:1.8;background:#fff;border-radius:10px;padding:12px">
          <strong>💡 꿀팁</strong><br>
          • 최초 10분 무료<br>
          • 장기주차장은 터미널에서 1.5~1.8km → 무료 셔틀버스 이용<br>
          • 장기주차장 P1~P4 중 동편/서편 확인 후 가까운 곳으로<br>
          • 주차 후 주변 사진 찍어두면 찾을 때 편리
        </div>
      </div>

      <!-- T2 -->
      <div style="background:#f0fdf4;border-radius:14px;padding:16px;margin-bottom:12px">
        <div style="font-size:14px;font-weight:900;color:#0f2044;margin-bottom:10px">✈️ 제2터미널 (에어프레미아 YP801 없음 — 아시아나 출국자 해당)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="background:#fff;border-radius:10px;padding:12px">
            <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">단기주차장</div>
            <div style="font-size:16px;font-weight:800;color:#1e5fd4">₩24,000</div>
            <div style="font-size:11px;color:#64748b">1일 최대</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:12px">
            <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">장기주차장</div>
            <div style="font-size:16px;font-weight:800;color:#0e8a7c">₩9,000</div>
            <div style="font-size:11px;color:#64748b">1일 최대</div>
          </div>
        </div>
        <div style="font-size:12px;color:#374151;line-height:1.8;background:#fff;border-radius:10px;padding:12px">
          <strong>⚠️ 주의</strong><br>
          • T2는 규모가 T1보다 작아 만차 가능 → 미리 확인 필수<br>
          • 최초 10분 무료 (T1/T2 동일)<br>
          • 문의: 032-741-0260 (교통관리센터)
        </div>
      </div>

      <!-- 발렛 -->
      <div style="background:#fdf6e3;border-radius:14px;padding:16px;margin-bottom:12px">
        <div style="font-size:14px;font-weight:900;color:#0f2044;margin-bottom:8px">🚗 주차대행 (발렛) 서비스</div>
        <div style="font-size:12px;color:#374151;line-height:1.8">
          ✅ 인천공항 공식 주차대행 <strong>가능</strong>합니다!<br><br>
          <strong>이용 방법</strong><br>
          • T1: 단기주차장 지하1층 주차대행 전용 접수장<br>
          • T2: 동일 방식, 별도 접수장<br>
          • 주차료: 장기주차장 요금 적용 (일 ₩9,000)<br>
          • 서비스 요금: 별도 (후불 정산)<br><br>
          <strong>⚠️ 사설 주차 주의</strong><br>
          공항 진입로에서 호객하는 사설주차는 인천공항공사와 무관 → 피해 발생 시 공항 무책임. 반드시 공식 접수장 이용!
        </div>
      </div>

      <!-- 4박 5일 예상 비용 -->
      <div style="background:#f0f4ff;border-radius:12px;padding:14px">
        <div style="font-size:13px;font-weight:800;color:#1e5fd4;margin-bottom:8px">💰 홍콩 여행 (4박 5일) 예상 주차비</div>
        <div style="font-size:12px;color:#374151;line-height:2">
          단기주차 4일 × ₩24,000 = <strong style="color:#dc2626">₩96,000</strong><br>
          장기주차 4일 × ₩9,000 = <strong style="color:#0e8a7c">₩36,000</strong> ← 추천!<br>
          발렛(장기요금) 4일 = <strong>₩36,000 + 서비스료</strong>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

// ─────────────────────────────────────────────
// 호텔 정보 모달
// ─────────────────────────────────────────────
function showHotelInfo(){
  const old = document.getElementById('_hotelModal');
  if(old) old.remove();
  const modal = document.createElement('div');
  modal.id = '_hotelModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,.7);display:flex;align-items:flex-end;justify-content:center;padding:0;backdrop-filter:blur(4px)';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;padding:24px 20px 40px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:16px;font-weight:900;color:#0f2044">🏨 숙박 호텔 안내</div>
        <button onclick="document.getElementById('_hotelModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8">×</button>
      </div>

      <!-- 호텔 1 -->
      <div style="background:#f0f4ff;border-radius:16px;overflow:hidden;margin-bottom:16px">
        <div style="background:linear-gradient(135deg,#1e5fd4,#0a1628);padding:16px">
          <div style="font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.1em;margin-bottom:4px">시티투어 & 자유일정 (소규모)</div>
          <div style="font-size:16px;font-weight:900;color:#fff">Four Points by Sheraton</div>
          <div style="font-size:13px;color:rgba(255,255,255,.8)">Hong Kong, Tung Chung</div>
        </div>
        <div style="padding:14px">
          <div style="font-size:12px;color:#374151;line-height:1.9">
            <strong>📍 주소</strong><br>
            9 Yi Tung Road, Tung Chung<br>
            Lantau Island, Hong Kong<br>
            怡東路9號, 東涌, 大嶼山<br><br>
            <strong>🚇 교통</strong><br>
            • MTR 퉁충역 도보 10~13분<br>
            • 홍콩 국제공항 차로 약 5분<br>
            • 무료 공항 셔틀버스 운행<br><br>
            <strong>✨ 주변</strong><br>
            • 씨티게이트 아울렛 도보 13분<br>
            • 옹핑 360 케이블카 인근<br>
            • 홍콩 디즈니랜드 차로 15분
          </div>
          <a href="https://maps.google.com/?q=Four+Points+by+Sheraton+Hong+Kong+Tung+Chung" target="_blank"
            style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1e5fd4;color:#fff;border-radius:10px;padding:12px;margin-top:12px;text-decoration:none;font-size:13px;font-weight:700">
            🗺 구글 지도에서 보기
          </a>
        </div>
      </div>

      <!-- 호텔 2 -->
      <div style="background:#f0fdf4;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0e8a7c,#0a2010);padding:16px">
          <div style="font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.1em;margin-bottom:4px">대규모 (200인 이상)</div>
          <div style="font-size:16px;font-weight:900;color:#fff">Regala Skycity Hotel</div>
          <div style="font-size:13px;color:rgba(255,255,255,.8)">丽豪航天城酒店</div>
        </div>
        <div style="padding:14px">
          <div style="font-size:12px;color:#374151;line-height:1.9">
            <strong>📍 주소</strong><br>
            8 Exhibition Drive, Hong Kong<br>
            香港离岛区航展道8号<br><br>
            <strong>🚇 교통</strong><br>
            • 홍콩 국제공항 직결 (도보 가능)<br>
            • AsiaWorld-Expo 인접<br>
            • 에어포트 익스프레스 공항역<br><br>
            <strong>✨ 특징</strong><br>
            • 200명 이상 대형 단체 수용 가능<br>
            • Regal Hotels 운영<br>
            • 컨퍼런스 시설 완비
          </div>
          <a href="https://maps.google.com/?q=Regala+Skycity+Hotel+Hong+Kong+Airport" target="_blank"
            style="display:flex;align-items:center;justify-content:center;gap:8px;background:#0e8a7c;color:#fff;border-radius:10px;padding:12px;margin-top:12px;text-decoration:none;font-size:13px;font-weight:700">
            🗺 구글 지도에서 보기
          </a>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}
