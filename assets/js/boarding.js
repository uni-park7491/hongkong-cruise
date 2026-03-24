// =============================================
// boarding.js - 탑승권 렌더링 및 저장
// =============================================

let memberBpTab = 'go';
let bpAccordionOpen = false;
let bpAccordionTab = 'go';


function openMemberBp(phone){
  // phone이 undefined이면 appUser 사용
  if(!phone && appUser) phone = appUser.phone;
  const p = PAX_DATA.find(x=>x.phone===phone) || appUser;
  if(!p){ console.error('PAX not found:', phone); return; }
  memberBpTab = memberBpTab || 'go';
  renderMemberBp(p);
  document.body.style.overflow = 'auto';
  const overlay = document.getElementById('memberBpOverlay');
  if(!overlay){ console.error('memberBpOverlay not found'); return; }
  overlay.style.position = 'fixed';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.classList.add('show');
}

function switchMemberBpTab(tab, phone){
  memberBpTab = tab;
  const p = PAX_DATA.find(x=>x.phone===phone);
  if(p) renderMemberBp(p);
}

function renderMemberBp(p){
  var isAsiana1 = p.flight1 === 'OZ721';
  var isGo = memberBpTab === 'go';
  var flight = isGo ? p.flight1 : p.flight2;
  var dep = isGo ? p.dep1 : p.dep2;
  var seat = isGo ? p.seat1 : p.seat2;
  var from = isGo ? 'ICN' : 'HKG';
  var to = isGo ? 'HKG' : 'ICN';
  var fromName = isGo ? '서울/인천' : '홍콩';
  var toName = isGo ? '홍콩' : '서울/인천';
  var date = isGo ? '24APR26' : '28APR26';
  var isAsiana = isGo ? isAsiana1 : true;
  var terminal = isGo ? (isAsiana1 ? 'T2' : 'T1') : 'T1';
  var depTime = dep.split(' ').pop();
  var parts = depTime.split(':').map(Number);
  var brdTotal = parts[0] * 60 + parts[1] - 40;
  var boardingTime = String(Math.floor(brdTotal/60)).padStart(2,'0') + ':' + String(brdTotal%60).padStart(2,'0');
  var tabBg = isAsiana ? '#002868' : '#1c2b5e';
  var tabActive = isAsiana ? '#c8102e' : '#e63946';
  var goActive = memberBpTab === 'go';
  var h = '';

  if(isAsiana){
    h += '<div class="ticket-asiana" id="ticketRender">';
    h += '<div class="az-stripe"></div>';
    h += '<div class="az-header">';
    h += '<div class="az-header-left"><div class="az-header-airline">ASIANA AIRLINES</div>';
    h += '<div class="az-header-alliance">&#9733; A STAR ALLIANCE MEMBER &#9733;</div></div>';
    h += '<div class="az-header-economy">ECONOMY</div></div>';
    h += '<div class="az-main"><div class="az-section-left">';
    h += '<div class="az-barcode-wrap"><div class="az-barcode-img"></div></div>';
    h += '<div class="az-content">';
    h += '<div class="az-name-label">NAME</div>';
    h += '<div class="az-name-val">' + p.name + ' / ' + p.nick + '</div>';
    h += '<div class="az-flight-row"><span class="az-fl-label">FLIGHT NO.</span>';
    h += '<span class="az-fl-val">' + flight + '</span>';
    h += '<span class="az-fl-val" style="font-weight:400;color:#555"> /' + date + '</span></div>';
    h += '<div class="az-route-row">';
    h += '<div class="az-route-item"><div class="az-route-label">FROM</div><div class="az-route-code">' + from + '</div></div>';
    h += '<div class="az-route-arrow">&#x2192;</div>';
    h += '<div class="az-route-item"><div class="az-route-label">TO</div><div class="az-route-code">' + to + '</div></div></div>';
    h += '<div class="az-boxes">';
    h += '<div class="az-boarding-box"><div class="az-boarding-box-label">BOARDING TIME</div><div class="az-boarding-box-val">' + boardingTime + '</div></div>';
    h += '<div class="az-boarding-box" style="border-color:#c8102e"><div class="az-boarding-box-label" style="color:#c8102e">DEP. TIME</div><div class="az-boarding-box-val" style="color:#c8102e">' + depTime + '</div></div>';
    h += '<div class="az-seat-box"><div class="az-seat-label">SEAT NO.</div><div class="az-seat-val">' + seat + '</div></div></div>';
    h += '<div class="az-zone-gate"><div class="az-zone">ZONE 3</div>';
    h += '<div style="font-size:9px;color:#888;margin-left:8px">TERMINAL ' + terminal + '</div></div></div>';
    h += '<div class="az-section-right">';
    h += '<div class="az-right-title">Boarding Pass &nbsp; 탑승권</div>';
    h += '<div class="az-right-airline">ASIANA AIRLINES</div>';
    h += '<div class="az-right-row"><div class="az-right-label">FLIGHT</div><div class="az-right-val">' + flight + ' / ' + date + '</div></div>';
    h += '<div class="az-right-row"><div class="az-right-label">FROM</div><div class="az-right-val">' + fromName.toUpperCase() + '</div></div>';
    h += '<div class="az-right-row"><div class="az-right-label">TO</div><div class="az-right-val">' + toName.toUpperCase() + '</div></div>';
    h += '<div class="az-right-row"><div class="az-right-label">NAME</div><div class="az-right-val">' + p.name + '</div></div>';
    h += '<div class="az-right-row"><div class="az-right-label">DEP.TIME</div><div class="az-right-val">' + depTime + '</div></div>';
    h += '<div style="font-size:8px;color:#555;letter-spacing:.06em;margin-top:8px;margin-bottom:2px">SEAT NO.</div>';
    h += '<div class="az-right-seat-box"><div><div class="az-right-seat-label">ECONOMY</div>';
    h += '<div class="az-right-seat-num">' + seat + '</div></div></div>';
    h += '<div class="az-right-footer"><div class="az-right-footer-row"><span>Silver</span><span></span></div>';
    h += '<div class="az-right-footer-row"><span>TIMES</span><span>MILES</span></div></div>';
    h += '</div></div>';
    h += '<div class="az-divider"></div>';
    h += '<div class="az-footer"><span>항공기 출발 10분 전 탑승 마감</span><span>' + flight + ' &middot; SEAT ' + seat + '</span></div>';
    h += '<div class="az-notice">Boarding gate closes 10minutes prior to departure time. (항공기 출발 10분 전에 탑승이 마감됩니다.)</div>';
    h += '</div>';
  } else {
    h += '<div class="ticket-premia" id="ticketRender">';
    h += '<div class="yp-header"><div class="yp-dot"></div>';
    h += '<div class="yp-logo-text"><span>a</span>ir PREMIA</div>';
    h += '<div class="yp-bp-label">Boarding Pass</div></div>';
    h += '<div class="yp-name-area">';
    h += '<div class="yp-pax-name">' + p.name + ' / ' + p.nick + '</div>';
    h += '<div class="yp-route-line">' + from + ' - ' + to + '</div></div>';
    h += '<div class="yp-flight-area"><span class="yp-fl-label">Flight</span>';
    h += '<span class="yp-fl-val">' + flight + '</span>';
    h += '<span class="yp-fl-val" style="font-weight:400;color:#555"> / ' + date + '</span></div>';
    h += '<div class="yp-ovals-row">';
    h += '<div class="yp-oval-item"><div class="yp-oval-lbl">Boarding<br>Time</div>';
    h += '<div class="yp-oval-shape"><div class="yp-oval-time">' + boardingTime + '</div></div></div>';
    h += '<div class="yp-oval-item"><div class="yp-oval-lbl gray">Departure<br>Time</div>';
    h += '<div class="yp-oval-shape"><div class="yp-oval-time">' + depTime + '</div></div></div>';
    h += '<div class="yp-oval-item"><div class="yp-oval-lbl gate-lbl">Gate</div>';
    h += '<div class="yp-oval-shape"><div class="yp-oval-gate">C39</div></div></div></div>';
    h += '<div class="yp-seat-area"><div class="yp-seat-lbl">Seat</div>';
    h += '<div class="yp-seat-num">' + seat + '</div></div>';
    h += '<div class="yp-zone">ZONE B</div>';
    h += '<div class="yp-bottom">';
    h += '<div class="yp-notice">항공기 정시 출발을 위하여 출발 시각 10분 전에 탑승이 종료됩니다.<br>Boarding gate closes 10minutes prior to departure time.</div>';
    h += '<div class="yp-barcode-area"></div></div>';
    h += '</div>';
  }

  var goStyle = 'background:' + tabBg + ';color:#fff;' + (goActive ? 'background:' + tabActive + ';' : 'opacity:.45;');
  var retStyle = 'background:' + tabBg + ';color:#fff;' + (!goActive ? 'background:' + tabActive + ';' : 'opacity:.45;');
  var wrap = '<div class="mbp-wrap"><div class="mbp-tabs">';
  wrap += '<button class="mbp-tab" style="' + goStyle + '" onclick="switchMemberBpTab(\'go\',\''+p.phone+'\')">✈ 가는 편</button>';
  wrap += '<button class="mbp-tab" style="' + retStyle + '" onclick="switchMemberBpTab(\'return\',\''+p.phone+'\')">✈ 귀국 편</button>';
  wrap += '</div>' + h + '</div>';
  var saveName = p.name + (goActive ? '_가는편' : '_귀국편');
  var saveBtn = '<button class="mbp-save-btn" onclick="saveTicketImage(\'' + saveName + '\')">📥 탑승권 이미지 저장</button>';

  document.getElementById('memberBpContent').innerHTML = wrap + saveBtn;
}

function saveTicketImage(filename){
  const el = document.getElementById('ticketRender');
  if(!el){ alert('티켓을 찾을 수 없어요'); return; }
  const btn = document.querySelector('.mbp-save-btn');
  if(btn){ btn.textContent='⏳ 저장 중...'; btn.disabled=true; }
  html2canvas(el, { scale:2, useCORS:true, backgroundColor:'#fff',
    ignoreElements: e => e.classList && e.classList.contains('mbp-save-btn') }).then(canvas=>{
    const a = document.createElement('a');
    a.download = filename + '_탑승권.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    if(btn){ btn.textContent='✅ 저장 완료!'; setTimeout(()=>{ btn.textContent='📥 탑승권 이미지 저장'; btn.disabled=false; },2000); }
  }).catch(err=>{
    alert('저장 실패: '+err.message);
    if(btn){ btn.textContent='📥 탑승권 이미지 저장'; btn.disabled=false; }
  });
}

function closeMemberBp(e){
  if(e.target===document.getElementById('memberBpOverlay')) closeAll();
}

function saveAccordionBp(){
  const content = document.getElementById('bpAccordionContent');
  if(!content || !appUser) return;
  const filename = appUser.name + '_' + (bpAccordionTab==='go'?'가는편':'귀국편');
  const btn = content.querySelector('button');
  if(btn){ btn.textContent='⏳ 저장 중...'; btn.disabled=true; }
  html2canvas(content, { scale:2, useCORS:true, backgroundColor:'#fff', 
    ignoreElements: el => el.tagName === 'BUTTON' }).then(canvas=>{
    const a = document.createElement('a');
    a.download = filename + '_탑승권.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    if(btn){ btn.textContent='✅ 저장 완료!'; setTimeout(()=>{ btn.textContent='📥 탑승권 이미지 저장'; btn.disabled=false; },2000); }
  }).catch(err=>{
    alert('저장 실패: '+err.message);
    if(btn){ btn.textContent='📥 탑승권 이미지 저장'; btn.disabled=false; }
  });
}

function toggleBpAccordion(){
  bpAccordionOpen = !bpAccordionOpen;
  const acc = document.getElementById('bpAccordion');
  const arrow = document.getElementById('bpAccordionArrow');
  if(!acc) return;
  if(bpAccordionOpen){
    acc.style.display = 'block';
    if(arrow) arrow.style.transform = 'rotate(180deg)';
    renderBpAccordion();
  } else {
    acc.style.display = 'none';
    if(arrow) arrow.style.transform = 'rotate(0deg)';
  }
}

function switchBpAccordionTab(tab){
  bpAccordionTab = tab;
  const goBtn = document.getElementById('bpTabGo');
  const retBtn = document.getElementById('bpTabReturn');
  const isAsiana = appUser && appUser.flight1 === 'OZ721';
  const activeColor = isAsiana ? '#c8102e' : '#e63946';
  const inactiveColor = isAsiana ? '#002868' : '#1c2b5e';
  if(goBtn){ goBtn.style.background = tab==='go' ? activeColor : inactiveColor; goBtn.style.opacity = tab==='go'?'1':'0.5'; }
  if(retBtn){ retBtn.style.background = tab==='return' ? activeColor : inactiveColor; retBtn.style.opacity = tab==='return'?'1':'0.5'; }
  renderBpAccordion();
  event.stopPropagation();
}

function renderBpAccordion(){
  const content = document.getElementById('bpAccordionContent');
  if(!content || !appUser) return;
  const p = appUser;
  const isGo = bpAccordionTab === 'go';
  const isAsiana1 = p.flight1 === 'OZ721';
  const isAsiana = isGo ? isAsiana1 : true;
  const flight = isGo ? p.flight1 : p.flight2;
  const dep = isGo ? p.dep1 : p.dep2;
  const seat = isGo ? p.seat1 : p.seat2;
  const from = isGo ? 'ICN' : 'HKG';
  const to = isGo ? 'HKG' : 'ICN';
  const fromName = isGo ? '서울/인천' : '홍콩';
  const toName = isGo ? '홍콩' : '서울/인천';
  const date = isGo ? '24APR26' : '28APR26';
  const terminal = isGo ? (isAsiana1?'T2':'T1') : 'T1';
  const depTime = dep.split(' ').pop();
  const dParts = depTime.split(':').map(Number);
  const brdTotal = dParts[0]*60 + dParts[1] - 40;
  const boardingTime = String(Math.floor(brdTotal/60)).padStart(2,'0')+':'+String(brdTotal%60).padStart(2,'0');

  if(isAsiana){
    content.innerHTML =
      '<div class="az-stripe"></div>'
      +'<div class="az-header"><div class="az-header-left">'
      +'<div class="az-header-airline">ASIANA AIRLINES</div>'
      +'<div class="az-header-alliance">&#9733; A STAR ALLIANCE MEMBER &#9733;</div></div>'
      +'<div class="az-header-economy">ECONOMY</div></div>'
      +'<div class="az-main"><div class="az-section-left">'
      +'<div class="az-barcode-wrap"><div class="az-barcode-img"></div></div>'
      +'<div class="az-content">'
      +'<div class="az-name-label">NAME</div>'
      +'<div class="az-name-val">'+p.name+' / '+p.nick+'</div>'
      +'<div class="az-flight-row"><span class="az-fl-label">FLIGHT NO.</span><span class="az-fl-val">'+flight+'</span></div>'
      +'<div class="az-route-row"><div class="az-route-item"><div class="az-route-label">FROM</div><div class="az-route-code">'+from+'</div></div>'
      +'<div class="az-route-arrow">&#8594;</div>'
      +'<div class="az-route-item"><div class="az-route-label">TO</div><div class="az-route-code">'+to+'</div></div></div>'
      +'<div class="az-boxes"><div class="az-boarding-box"><div class="az-boarding-box-label">BOARDING TIME</div><div class="az-boarding-box-val">'+boardingTime+'</div></div>'
      +'<div class="az-boarding-box" style="border-color:#c8102e"><div class="az-boarding-box-label" style="color:#c8102e">DEP. TIME</div><div class="az-boarding-box-val" style="color:#c8102e">'+depTime+'</div></div>'
      +'<div class="az-seat-box"><div class="az-seat-label">SEAT NO.</div><div class="az-seat-val">'+seat+'</div></div></div>'
      +'<div class="az-zone-gate"><div class="az-zone">ZONE 3</div><div style="font-size:9px;color:#888;margin-left:8px">TERMINAL '+terminal+'</div></div>'
      +'</div></div>'
      +'<div class="az-section-right">'
      +'<div class="az-right-title">Boarding Pass &nbsp; 탑승권</div>'
      +'<div class="az-right-airline">ASIANA AIRLINES</div>'
      +'<div class="az-right-row"><div class="az-right-label">FLIGHT</div><div class="az-right-val">'+flight+' /'+date+'</div></div>'
      +'<div class="az-right-row"><div class="az-right-label">FROM</div><div class="az-right-val">'+fromName.toUpperCase()+'</div></div>'
      +'<div class="az-right-row"><div class="az-right-label">TO</div><div class="az-right-val">'+toName.toUpperCase()+'</div></div>'
      +'<div class="az-right-row"><div class="az-right-label">NAME</div><div class="az-right-val">'+p.name+'</div></div>'
      +'<div class="az-right-row"><div class="az-right-label">DEP.TIME</div><div class="az-right-val">'+depTime+'</div></div>'
      +'<div style="font-size:8px;color:#555;letter-spacing:.06em;margin-top:8px;margin-bottom:2px">SEAT NO.</div>'
      +'<div class="az-right-seat-box"><div><div class="az-right-seat-label">ECONOMY</div><div class="az-right-seat-num">'+seat+'</div></div></div>'
      +'</div></div>'
      +'<div class="az-footer"><span>항공기 출발 10분 전 탑승 마감</span><span>'+flight+' · SEAT '+seat+'</span></div>'
      +'<div class="az-notice">Boarding gate closes 10minutes prior to departure time.</div>'
      +'<button onclick="saveAccordionBp()" style="display:block;width:100%;background:linear-gradient(135deg,#0e8a7c,#1e5fd4);color:#fff;border:none;padding:12px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer">&#x1F4E5; 탑승권 이미지 저장</button>';
  } else {
    content.innerHTML =
      '<div class="yp-header"><div class="yp-dot"></div><div class="yp-logo">AIR PREMIA</div><div class="yp-bp-txt">Boarding pass</div></div>'
      +'<div class="yp-body"><div class="yp-main">'
      +'<div class="yp-name">'+p.name+' / '+p.nick+'</div>'
      +'<div class="yp-times-row">'
      +'<div class="yp-time-item"><div class="yp-time-label">Boarding<br>Time</div><div class="yp-oval"><div class="yp-oval-val red">'+boardingTime+'</div></div></div>'
      +'<div class="yp-time-item"><div class="yp-time-label gray">Departure<br>Time</div><div class="yp-oval"><div class="yp-oval-val">'+depTime+'</div></div></div>'
      +'<div class="yp-time-item"><div class="yp-time-label">Gate</div><div class="yp-oval"><div class="yp-oval-val red">C156</div></div></div>'
      +'</div>'
      +'<div class="yp-seat-area"><div class="yp-seat-label">Seat</div><div class="yp-seat-num">'+seat+'</div></div>'
      +'<div class="yp-zone">ZONE B</div></div>'
      +'<div class="yp-right">'
      +'<div class="yp-right-row"><div class="yp-right-label">Name</div><div class="yp-right-val">'+p.name+'</div></div>'
      +'<div class="yp-right-row"><div class="yp-right-label">From</div><div class="yp-right-val">'+fromName+'</div></div>'
      +'<div class="yp-right-row"><div class="yp-right-label">To</div><div class="yp-right-val">'+toName+'</div></div>'
      +'<div class="yp-right-row"><div class="yp-right-label">Flight</div><div class="yp-right-val">'+flight+'</div></div>'
      +'<div class="yp-right-row"><div class="yp-right-label">Seat</div><div class="yp-right-val" style="font-size:14px;font-weight:900">'+seat+'</div></div>'
      +'<div class="yp-right-row"><div class="yp-right-label">Terminal</div><div class="yp-right-val">'+terminal+'</div></div>'
      +'</div></div>'
      +'<div class="yp-divider"></div>'
      +'<div class="yp-footer"><p>항공기 정시 출발을 위하여 출발 시각 <strong style="color:#fff">10분</strong> 전에 탑승이 종료됩니다.</p></div>'
      +'<button onclick="saveAccordionBp()" style="display:block;width:100%;background:linear-gradient(135deg,#0e8a7c,#1e5fd4);color:#fff;border:none;padding:12px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer">&#x1F4E5; 탑승권 이미지 저장</button>';
  }
}


// ─────────────────────────────────────────────
// 항공기 좌석 배치도 (실제 기종 기반 SVG)
// 아시아나 A330-300: 3-3-3 (A-B-C / D-E-F / H-J-K), 약 40열
// 에어프레미아 B787-9: 3-3-3 (A-B-C / D-E-F / G-H-J), 약 35열
// ─────────────────────────────────────────────
function showSeatMapModal(seat, flight){
  if(!seat && appUser){ seat = appUser.seat1; flight = appUser.flight1; }
  const row = parseInt(seat);
  const col = seat.replace(/[0-9]/g,'').toUpperCase();

  // ── 기종별 좌석 배열 정의 ──
  // OZ721 A321: 3-3 협동체 → A-B-C / H-J-K (D-E-F 없음)
  // OZ746 A330: 2-4-2 광동체 → A-C / D-E-F-G / H-K
  // YP801 B787: 3-3-3 광동체 → A-B-C / D-E-F / G-H-J

  let layout, groups, colLabels, aircraftName;

  if(flight === 'OZ721' || flight === 'YP801'){
    if(flight === 'OZ721'){
      // 아시아나 A321 협동체 3-3 (A-B-C / H-J-K)
      layout = ['A','B','C','H','J','K'];
      groups = [['A','B','C'],['H','J','K']];
      aircraftName = 'A321 · 3-3 배열 (A-B-C / H-J-K)';
    } else {
      // 에어프레미아 B787-9 광동체 3-3-3 (A-B-C / D-E-F / G-H-J)
      layout = ['A','B','C','D','E','F','G','H','J'];
      groups = [['A','B','C'],['D','E','F'],['G','H','J']];
      aircraftName = 'B787-9 · 3-3-3 배열 (A-B-C / D-E-F / G-H-J)';
    }
  } else {
    // 아시아나 A330 광동체 2-4-2 (A-C / D-E-F-G / H-K)
    layout = ['A','C','D','E','F','G','H','K'];
    groups = [['A','C'],['D','E','F','G'],['H','K']];
    aircraftName = 'A330-300 · 2-4-2 배열 (A-C / D-E-F-G / H-K)';
  }

  // 위치 설명
  function getSeatPos(col, groups){
    const gi = groups.findIndex(g => g.includes(col));
    const g = groups[gi];
    if(gi === 0){
      if(g.indexOf(col) === 0) return '왼쪽 창가';
      if(g.indexOf(col) === g.length-1) return '왼쪽 통로';
      return '왼쪽 중간';
    } else if(gi === groups.length-1){
      if(g.indexOf(col) === 0) return '오른쪽 통로';
      if(g.indexOf(col) === g.length-1) return '오른쪽 창가';
      return '오른쪽 중간';
    } else {
      if(g.indexOf(col) === 0) return '가운데 (왼통로)';
      if(g.indexOf(col) === g.length-1) return '가운데 (오통로)';
      return '가운데';
    }
  }
  const pos = getSeatPos(col, groups);
  const zone = row <= 8 ? '앞쪽 (비즈니스)' : row <= 20 ? '이코노미 앞쪽' : row <= 30 ? '이코노미 중간' : '이코노미 뒤쪽';

  // SVG 생성
  const CELL = 20, GAP = 5, AISLE = 16, ROW_H = 26;
  const startRow = Math.max(1, row - 5);
  const endRow = row + 5;

  // x 위치 계산
  const xMap = {};
  let x = 30;
  groups.forEach((g, gi) => {
    g.forEach(c => { xMap[c] = x; x += CELL + GAP; });
    if(gi < groups.length - 1) x += AISLE - GAP;
  });
  const svgW = x + 8;
  const svgH = (endRow - startRow + 1) * ROW_H + 32;

  let svgContent = '';

  // 통로 표시
  let ax = 30;
  groups.forEach((g, gi) => {
    ax += g.length * (CELL + GAP);
    if(gi < groups.length - 1){
      svgContent += `<rect x="${ax}" y="22" width="${AISLE - GAP}" height="${svgH-30}" rx="2" fill="rgba(148,163,184,.12)"/>`;
      ax += AISLE - GAP;
    }
  });

  // 열 레이블
  layout.forEach(c => {
    if(xMap[c] !== undefined)
      svgContent += `<text x="${xMap[c]+CELL/2}" y="16" text-anchor="middle" font-size="9" fill="#64748b" font-weight="600">${c}</text>`;
  });

  // 좌석 렌더
  for(let r = startRow; r <= endRow; r++){
    const y = (r - startRow) * ROW_H + 22;
    const isMyRow = r === row;
    svgContent += `<text x="14" y="${y+CELL*0.72}" text-anchor="middle" font-size="9" fill="${isMyRow?'#ffca22':'#94a3b8'}" font-weight="${isMyRow?'bold':'normal'}">${r}</text>`;
    layout.forEach(c => {
      const cx = xMap[c];
      if(cx === undefined) return;
      const isMe = r === row && c === col;
      const isBiz = r <= 8;
      const fill = isMe ? '#ffca22' : (isBiz ? '#bfdbfe' : '#e8effe');
      const stroke = isMe ? '#b45309' : '#c0cce0';
      const sw = isMe ? 2 : 1;
      svgContent += `<rect x="${cx}" y="${y}" width="${CELL}" height="${CELL-2}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
      if(isMe) svgContent += `<text x="${cx+CELL/2}" y="${y+CELL*0.68}" text-anchor="middle" font-size="8" font-weight="bold" fill="#0a1628">${c}</text>`;
    });
  }

  const svgEl = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${svgW}" height="${svgH}" fill="#f8faff" rx="10"/>${svgContent}
  </svg>`;

  // 팝업
  const overlay = document.getElementById('popupSectionOverlay');
  const content = document.getElementById('popupSectionContent');
  if(!overlay || !content) return;

  content.innerHTML = `
    <div style="padding:20px">
      <div style="font-size:11px;color:var(--blue);font-weight:700;letter-spacing:.08em;margin-bottom:8px">✈ ${flight} · 좌석 위치</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-size:52px;font-weight:900;color:var(--navy);font-family:Barlow,sans-serif;line-height:1">${seat}</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <span style="background:var(--blue-light);color:var(--blue);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700">${pos}</span>
          <span style="background:var(--teal-light);color:var(--teal2);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700">${zone}</span>
        </div>
      </div>
      <div style="background:#f8faff;border-radius:12px;padding:14px;text-align:center;margin-bottom:12px">
        <div style="font-size:11px;color:var(--gray2);margin-bottom:10px">🟨 = 내 좌석 · 주변 ±5열 표시</div>
        ${svgEl}
      </div>
      <div style="font-size:11px;color:var(--gray2);text-align:center">${aircraftName}</div>
    </div>`;

  document.body.style.overflow = 'auto';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.classList.add('show');
}


function confirmCall(number){
  return confirm(`📞 ${number}\n\n통화를 연결하시겠습니까?`);
}
