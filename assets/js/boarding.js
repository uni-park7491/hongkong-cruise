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

function showSeatMap(seat, flight){
  if(!seat && appUser){ seat = appUser.seat1; flight = appUser.flight1; }
  // 좌석 파싱 (예: 32A, 26C)
  const row = parseInt(seat);
  const col = seat.replace(/[0-9]/g,'').toUpperCase();
  // 아시아나 OZ721/OZ746 좌석 배치 (이코노미: A B C _ D E F K H J K)
  // 실제 배치: ABC / DEFHJ / K 혹은 간략히 ABC / DEF / HJK
  const cols = ['A','B','C','D','E','F','G','H','J','K'];
  const colLabels = ['A','B','C','','D','E','F','','H','J','K'];
  // 어느 구역인지
  let zone = '';
  if(row <= 20) zone = '앞쪽';
  else if(row <= 30) zone = '중간';
  else if(row <= 40) zone = '뒤쪽';
  else zone = '맨 뒤';

  let colPos = '';
  if(['A'].includes(col)) colPos = '왼쪽 창가';
  else if(['B'].includes(col)) colPos = '왼쪽 중간';
  else if(['C'].includes(col)) colPos = '왼쪽 통로';
  else if(['D'].includes(col)) colPos = '오른쪽 통로';
  else if(['E'].includes(col)) colPos = '오른쪽 중간';
  else if(['F'].includes(col)) colPos = '오른쪽 통로';
  else if(['H','J'].includes(col)) colPos = '오른쪽 중간';
  else if(['K'].includes(col)) colPos = '오른쪽 창가';
  else colPos = '중간';

  // 미니 좌석도 SVG 생성 (25~45열 표시, 내 좌석 강조)
  let rows = '';
  const startRow = Math.max(1, row - 5);
  const endRow = row + 5;
  const seatCols = ['A','B','C','D','E','F','H','J','K'];
  const xMap = {A:5,B:22,C:39,D:62,E:79,F:96,H:119,J:136,K:153};
  const W = 174, H_ROW = 14, PADDING = 8;

  for(let r = startRow; r <= endRow; r++){
    const y = (r - startRow) * H_ROW + PADDING;
    seatCols.forEach(c => {
      const x = xMap[c];
      const isMine = r === row && c === col;
      const fill = isMine ? '#ffca22' : (r % 2 === 0 ? '#e8effe' : '#f0f4ff');
      const stroke = isMine ? '#d4a017' : '#c8d0e0';
      rows += `<rect x="${x}" y="${y}" width="12" height="11" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      if(isMine) rows += `<text x="${x+6}" y="${y+8.5}" text-anchor="middle" font-size="6" font-weight="bold" fill="#0a1628">${c}</text>`;
    });
    rows += `<text x="${W/2}" y="${(r-startRow)*H_ROW+PADDING+8}" text-anchor="middle" font-size="7" fill="#94a3b8">${r}</text>`;
  }

  const svgH = (endRow - startRow + 1) * H_ROW + PADDING * 2;
  const svg = `<svg width="${W}" height="${svgH}" viewBox="0 0 ${W} ${svgH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${svgH}" fill="#f8faff" rx="8"/>
    <!-- 통로 표시 -->
    <rect x="52" y="0" width="8" height="${svgH}" fill="rgba(148,163,184,.1)"/>
    <rect x="111" y="0" width="6" height="${svgH}" fill="rgba(148,163,184,.1)"/>
    ${rows}
    <!-- 열 레이블 -->
    <text x="11" y="6" text-anchor="middle" font-size="6" fill="#64748b">A</text>
    <text x="28" y="6" text-anchor="middle" font-size="6" fill="#64748b">B</text>
    <text x="45" y="6" text-anchor="middle" font-size="6" fill="#64748b">C</text>
    <text x="68" y="6" text-anchor="middle" font-size="6" fill="#64748b">D</text>
    <text x="85" y="6" text-anchor="middle" font-size="6" fill="#64748b">E</text>
    <text x="102" y="6" text-anchor="middle" font-size="6" fill="#64748b">F</text>
    <text x="125" y="6" text-anchor="middle" font-size="6" fill="#64748b">H</text>
    <text x="142" y="6" text-anchor="middle" font-size="6" fill="#64748b">J</text>
    <text x="159" y="6" text-anchor="middle" font-size="6" fill="#64748b">K</text>
  </svg>`;

  // 간단한 alert 대신 기존 팝업 재활용
  const content = document.getElementById('popupSectionContent');
  const overlay = document.getElementById('popupSectionOverlay');
  if(!content || !overlay) return;

  content.innerHTML =
    '<div style="padding:20px">'
    +'<div style="font-size:12px;color:var(--blue);font-weight:700;letter-spacing:.08em;margin-bottom:6px">✈ '+flight+' · 좌석 위치</div>'
    +'<h2 style="font-family:Barlow,sans-serif;font-size:2rem;font-weight:900;color:var(--navy);margin-bottom:4px">'+seat+'</h2>'
    +'<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">'
    +'<span style="background:var(--blue-light);color:var(--blue);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700">'+zone+'</span>'
    +'<span style="background:var(--teal-light);color:var(--teal2);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700">'+colPos+'</span>'
    +'</div>'
    +'<div style="background:#f8faff;border-radius:12px;padding:12px;text-align:center;margin-bottom:14px">'
    +'<div style="font-size:11px;color:var(--gray2);margin-bottom:8px">노란색 ⬛ = 내 좌석</div>'
    +svg
    +'</div>'
    +'<div style="background:var(--gold-light);border-left:3px solid var(--gold2);border-radius:8px;padding:10px 14px;font-size:13px;color:#5a3e0a">'
    +'💡 '+row+'행 '+col+'열 · '+colPos+' 자리예요.'
    +'</div>'
    +'</div>';

  document.body.style.overflow = 'auto';
  overlay.style.position = 'fixed';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.classList.add('show');
}

function confirmCall(number){
  return confirm(`📞 ${number}\n\n통화를 연결하시겠습니까?`);
}
