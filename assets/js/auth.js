// =============================================
// auth.js - 로그인 / 인증
// =============================================

let currentUser = null;
let isAdminLoggedIn = false;


function doLogin(){
  const pin = ['p1','p2','p3','p4'].map(id=>document.getElementById(id).value).join('');
  if(pin.length < 4) return;
  const matched = PAX_DATA.filter(p => p.phone.slice(-4) === pin);
  if(matched.length === 0){
    document.getElementById('loginError').style.display = 'block';
    ['p1','p2','p3','p4'].forEach(id=>{ document.getElementById(id).value=''; });
    document.getElementById('p1').focus();
    return;
  }
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('loginScreen').classList.add('hidden');
  if(matched.length === 1){
    enterUserMode(matched[0]);
  } else {
    showNameSelect(matched);
  }
}

function showAdminLoginPopup(){
  document.getElementById('adminId').value='';
  document.getElementById('adminPw').value='';
  document.getElementById('adminError').style.display='none';
  document.getElementById('adminLoginOverlay').classList.add('show');
}

function toggleAdminForm(){
  const form = document.getElementById('adminInlineForm');
  const btn = document.getElementById('adminToggleBtn');
  if(!form) return;
  const isOpen = form.style.display === 'block';
  form.style.display = isOpen ? 'none' : 'block';
  btn.style.borderColor = isOpen ? 'var(--border)' : '#4a9eff';
  btn.style.color = isOpen ? 'var(--gray)' : '#4a9eff';
  if(!isOpen) setTimeout(()=>{ const el=document.getElementById('adminId2'); if(el) el.focus(); }, 100);
}

function doAdminLoginInline(){
  const id = (document.getElementById('adminId2').value||'').trim();
  const pw = document.getElementById('adminPw2').value||'';
  const errEl = document.getElementById('adminInlineError');
  if(id === ADMIN_ID && pw === ADMIN_PW){
    if(errEl) errEl.style.display='none';
    isAdminLoggedIn = true;
    currentUser = 'admin';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('myDashboard').style.display='none';
    document.body.classList.remove('app-mode');
    document.querySelector('.hero').style.display='';
    document.getElementById('mainWrap').style.display='block';
    document.body.classList.add('is-admin');
    const appScreens=document.getElementById('appScreens');
    const appTabBar=document.getElementById('appTabBar');
    const appHeader=document.getElementById('appHeader');
    if(appScreens) appScreens.style.display='none';
    if(appTabBar) appTabBar.style.display='none';
    if(appHeader) appHeader.style.display='none';
    closeAll();
    updateAdminBtn();
    openAdminPanel();
  } else {
    if(errEl) errEl.style.display='block';
    document.getElementById('adminPw2').value='';
    document.getElementById('adminPw2').focus();
  }
}

function doAdminLogin(){
  const id = document.getElementById('adminId').value.trim();
  const pw = document.getElementById('adminPw').value;
  if(id===ADMIN_ID && pw===ADMIN_PW){
    isAdminLoggedIn = true;
    currentUser = 'admin';
    document.getElementById('adminError').style.display='none';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('myDashboard').style.display='none';
    // 앱 모드 완전 해제
    document.body.classList.remove('app-mode');
    document.querySelector('.hero').style.display='';
    document.getElementById('mainWrap').style.display='block';
    document.body.classList.add('is-admin');
    // 앱 스크린/탭바 숨기기
    const appScreens = document.getElementById('appScreens');
    const appTabBar = document.getElementById('appTabBar');
    const appHeader = document.getElementById('appHeader');
    if(appScreens) appScreens.style.display='none';
    if(appTabBar) appTabBar.style.display='none';
    if(appHeader) appHeader.style.display='none';
    closeAll();
    updateAdminBtn();
    openAdminPanel();
  } else {
    document.getElementById('adminError').style.display='block';
    document.getElementById('adminPw').value='';
  }
}

function openAdminLogin(){
  if(isAdminLoggedIn){ openAdminPanel(); return; }
  document.getElementById('adminId').value='';
  document.getElementById('adminPw').value='';
  document.getElementById('adminError').style.display='none';
  document.getElementById('adminLoginOverlay').classList.add('show');
}

function closeAdminLogin(e){ if(e.target===document.getElementById('adminLoginOverlay')) closeAll(); }

function openAdminPanel(){
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = adminData.map((p,i)=>`
    <tr style="border-bottom:1px solid var(--border);background:${i%2===0?'#fafbfd':'#fff'}">
      <td style="padding:10px 12px;color:var(--gray)">${p.no}</td>
      <td style="padding:10px 12px;font-weight:700;color:var(--navy)">${p.name}</td>
      <td style="padding:10px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--gray)">${p.eng}</td>
      <td style="padding:10px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--teal);font-weight:700">${p.passport}</td>
      <td style="padding:10px 12px;font-size:13px;color:var(--text2)">${p.birth}</td>
      <td style="padding:10px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--blue);font-weight:700">${p.phone}</td>
      <td style="padding:10px 12px;font-size:13px;color:var(--text2)">${p.gender}</td>
      <td style="padding:10px 12px;font-size:13px;color:var(--text2)">${p.room}</td>
    </tr>`).join('');
  document.getElementById('adminPanelOverlay').classList.add('show');
}

function closeAdminPanel(e){ if(e.target===document.getElementById('adminPanelOverlay')) closeAll(); }

function logoutAdmin(){
  isAdminLoggedIn = false;
  currentUser = null;
  document.body.classList.remove('is-admin');
  updateAdminBtn();
  closeAll();
  // 로그인 화면으로
  document.getElementById('myDashboard').style.display='none';
  document.querySelector('.hero').style.display='none';
  document.getElementById('mainWrap').style.display='none';
  // 앱 UI도 숨기기
  const appScreens = document.getElementById('appScreens');
  const appTabBar = document.getElementById('appTabBar');
  const appHeader = document.getElementById('appHeader');
  if(appScreens) appScreens.style.display='none';
  if(appTabBar) appTabBar.style.display='none';
  if(appHeader) appHeader.style.display='none';
  ['p1','p2','p3','p4'].forEach(id=>{ document.getElementById(id).value=''; });
  document.getElementById('loginScreen').classList.remove('hidden');
}

function updateAdminBtn(){
  const btn = document.getElementById('adminNavBtn');
  if(!btn) return;
  if(isAdminLoggedIn){
    btn.innerHTML = '<span class="ico">🔓</span>관리자';
    btn.style.borderColor='var(--teal)';
    btn.style.color='var(--teal)';
  } else {
    btn.innerHTML = '<span class="ico">🔒</span>관리자';
    btn.style.borderColor='';
    btn.style.color='';
  }
}

function showFullSite(){
  // 전체 사이트 표시 (관리자용)
  document.querySelector('.hero').style.display='';
  document.getElementById('mainWrap').style.display='block';
  document.getElementById('myDashboard').style.display='none';
}

function enterUserMode(pax){
  currentUser = pax;
  // 항공사 클래스 적용
  document.body.classList.remove('user-asiana','user-premia');
  if(pax.flight1 === 'OZ721') document.body.classList.add('user-asiana');
  else document.body.classList.add('user-premia');
  // hero 숨기고 wrap + dashboard 모두 표시
  document.querySelector('.hero').style.display='none';
  document.getElementById('mainWrap').style.display='block';
  document.getElementById('myDashboard').style.display='block';
  // 메인 wrap의 일정 섹션 숨기기 (대시보드에 이미 표시)
  const schedMain = document.getElementById('schedule');
  if(schedMain) schedMain.style.display='none';
  // 개인 대시보드 표시
  showMyDashboard(pax);
  // 커뮤니티 닉네임 자동 선택
  setTimeout(()=>{
    myNick = pax.nick;
    onNickChange();
  }, 100);
  // 앱 모드 진입
  initAppMode(pax);
}

function showMyDashboard(pax){
  document.getElementById('myWelcomeName').textContent = pax.name + ' 님';
  document.getElementById('myWelcomeNick').textContent = '닉네임: ' + pax.nick;

  // 22명 명단 - 본인 맨 위, 나머지는 아래
  const me = PAX_DATA.find(p=>p.phone===pax.phone);
  const others = PAX_DATA.filter(p=>p.phone!==pax.phone);
  const sorted = [me, ...others];
  const memberList = sorted.map((p,i)=>{
    const isMe = i===0;
    // 본인 카드: 클릭 가능 + 탑승권 아이콘
    // 다른 사람: 클릭 불가, 이름/닉네임만
    if(isMe){
      return `<div onclick="openMemberBp('${p.phone}')" style="display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;transition:.15s;background:var(--blue-light);border-radius:10px;border:1.5px solid var(--blue);margin-bottom:10px;"
        onmouseover="this.style.background='#c8d8f8'" onmouseout="this.style.background='var(--blue-light)'">
        <span style="font-size:18px">⭐</span>
        <div>
          <div style="font-weight:800;color:var(--blue);font-size:16px">${p.name}</div>
          <div style="font-size:12px;color:var(--gray)">${p.nick}</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:12px;color:var(--blue);font-weight:700">나</div>
          <div style="font-size:20px">🎫</div>
        </div>
      </div>`;
    } else {
      return `<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border);">
        <span style="font-size:12px;color:var(--gray);width:20px;text-align:center">${i}</span>
        <span style="font-weight:600;color:var(--navy);font-size:14px">${p.name}</span>
        <span style="font-size:12px;color:var(--gray);background:var(--bg);border-radius:4px;padding:2px 8px">${p.nick}</span>
      </div>`;
    }
  }).join('');

  document.getElementById('myFlightCards').innerHTML = `
    <div class="my-flight-card">
      <div class="my-flight-title">✈ 가는 편 (04.24)</div>
      <div class="my-flight-row"><span class="my-flight-label">항공편</span><span class="my-flight-value">${pax.flight1}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">출발</span><span class="my-flight-value">${pax.dep1}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">도착</span><span class="my-flight-value">${pax.arr1}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">내 좌석</span><span class="my-flight-value" style="font-size:22px;color:var(--teal)">${pax.seat1}</span></div>
    </div>
    <div class="my-flight-card">
      <div class="my-flight-title">✈ 귀국 편 (04.28 새벽)</div>
      <div class="my-flight-row"><span class="my-flight-label">항공편</span><span class="my-flight-value">${pax.flight2}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">출발</span><span class="my-flight-value">${pax.dep2}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">도착</span><span class="my-flight-value">${pax.arr2}</span></div>
      <div class="my-flight-row"><span class="my-flight-label">내 좌석</span><span class="my-flight-value" style="font-size:22px;color:var(--blue)">${pax.seat2}</span></div>
    </div>`;

  // 일정 섹션 복사해서 대시보드에 직접 삽입
  const schedEl = document.getElementById('schedule');
  if(schedEl){
    const clone = schedEl.cloneNode(true);
    clone.id = 'myScheduleClone';
    clone.classList.remove('popup-section');
    clone.style.display = 'block';
    const sched = document.getElementById('myScheduleSection');
    sched.innerHTML = '';
    sched.appendChild(clone);
  }
  highlightTodaySchedule();

  // 참석자 명단 (제일 아래)
  document.getElementById('myMemberSection').innerHTML = `
    <div class="my-flight-card">
      <div class="my-flight-title">👥 참석자 명단 (22명)</div>
      ${memberList}
    </div>`;

  window.scrollTo(0,0);
}

function showNameSelect(list){
  const box = document.querySelector('.login-box');
  box.innerHTML = `
    <div class="login-logo">👤</div>
    <div class="login-title" style="margin-bottom:6px">본인 이름을 선택해주세요</div>
    <div class="login-sub">동일한 번호가 여러 명이에요</div>
    ${list.map(p=>`<button onclick="selectPax('${p.phone}')"
      style="display:block;width:100%;padding:13px;margin-bottom:8px;background:var(--blue-light);border:1.5px solid var(--blue);border-radius:8px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;color:var(--navy)">
      ${p.name} <span style="font-size:13px;color:var(--gray)">(${p.nick})</span>
    </button>`).join('')}`;
}

function selectPax(phone){
  const pax = PAX_DATA.find(p=>p.phone===phone);
  if(pax){
    document.getElementById('loginScreen').classList.add('hidden');
    enterUserMode(pax);
  }
}

function exitMyView(){
  currentUser = null;
  isAdminLoggedIn = false;
  document.body.classList.remove('is-admin','user-asiana','user-premia');
  document.getElementById('myDashboard').style.display='none';
  document.querySelector('.hero').style.display='none';
  document.getElementById('mainWrap').style.display='none';
  // 앱 UI도 숨기기
  const appScreens = document.getElementById('appScreens');
  const appTabBar = document.getElementById('appTabBar');
  const appHeader = document.getElementById('appHeader');
  if(appScreens) appScreens.style.display='none';
  if(appTabBar) appTabBar.style.display='none';
  if(appHeader) appHeader.style.display='none';
  ['p1','p2','p3','p4'].forEach(id=>{ document.getElementById(id).value=''; });
  document.getElementById('loginScreen').classList.remove('hidden');
  updateAdminBtn();
}

function exitAppModeAndLogout(){
  exitAppMode();
  exitMyView();
}

function pinNext(el, nextId){
  el.value = el.value.replace(/[^0-9]/g,'');
  if(el.value && nextId) document.getElementById(nextId).focus();
  if(!nextId && el.value) doLogin();
}

function pinBack(e, el, prevId){
  if(e.key==='Backspace' && !el.value && prevId) document.getElementById(prevId).focus();
}
