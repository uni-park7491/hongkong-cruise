// =============================================
// app.js - 앱 코어 (탭, 화면 전환, 네비게이션)
// =============================================

let currentTab = 'home';
let screenHistory = ['home'];
let appUser = null;
let memberListOpen = false;


function initAppMode(pax){
  appUser = pax;
  document.body.classList.add('app-mode');
  // 기존 UI 숨기기
  document.querySelector('.hero').style.display = 'none';
  document.getElementById('mainWrap').style.display = 'none';
  document.getElementById('myDashboard').style.display = 'none';

  // 앱 헤더 날씨 연동
  const weatherEl = document.getElementById('weatherVal');
  if(weatherEl){
    const obs = new MutationObserver(()=>{
      const appW = document.getElementById('appWeatherBadge');
      if(appW) appW.textContent = weatherEl.textContent;
    });
    obs.observe(weatherEl, {characterData:true, childList:true, subtree:true});
  }

  // D-Day 업데이트
  updateAppDday();
  setInterval(updateAppDday, 1000);

  // 날씨 카드 연동
  syncAppWeather();
  setInterval(syncAppWeather, 300000); // 5분마다

  // 내정보 스크린 렌더
  renderMyInfoScreen(pax);

  // 탭 초기화
  switchTab('home');
  screenHistory = ['home'];
}

function exitAppMode(){
  document.body.classList.remove('app-mode');
  appUser = null;
}

function switchTab(tab){
  const prev = currentTab;
  currentTab = tab;

  // 탭 버튼 활성화
  document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById('tab-'+tab);
  if(activeTab) activeTab.classList.add('active');

  // 스크린 전환 방향 결정
  const tabOrder = ['home','schedule','community','myinfo'];
  const prevIdx = tabOrder.indexOf(prev);
  const nextIdx = tabOrder.indexOf(tab);
  const goRight = nextIdx > prevIdx;

  // 현재 스크린 퇴장
  const prevScreen = document.getElementById('screen-'+prev);
  const nextScreen = document.getElementById('screen-'+tab);
  // 모든 스크린 일단 숨기기
  document.querySelectorAll('.app-screen').forEach(s => {
    if(s.id !== 'screen-'+tab && s.id !== 'screen-sub'){
      s.classList.remove('active');
      s.classList.add('hidden-right');
    }
  });
  if(nextScreen){
    nextScreen.classList.remove('hidden-left','hidden-right');
    nextScreen.classList.add('active');
  }

  // 헤더 타이틀
  const titles = {home:'ONCHAIN 2140', schedule:'행사 일정', community:'커뮤니티', myinfo:'내 정보'};
  const titleEl = document.getElementById('appHeaderTitle');
  if(titleEl) titleEl.textContent = titles[tab] || 'ONCHAIN 2140';

  // 뒤로 버튼 숨기기
  const backBtn = document.getElementById('appHeaderBack');
  if(backBtn) backBtn.classList.remove('show');

  screenHistory = [tab];

  // 탭별 콘텐츠 렌더
  if(tab === 'schedule') renderAppSchedule();
  if(tab === 'community') renderAppCommunity();
  if(tab === 'myinfo') renderMyInfoScreen(appUser);
  // 카드 진입 애니메이션
  setTimeout(()=>{ const s=document.getElementById('screen-'+tab); if(s) reanimateCards(s); }, 50);
}

function appNav(type){
  const subScreen = document.getElementById('screen-sub');
  const content = document.getElementById('appSubContent');
  if(!subScreen || !content) return;

  // 현재 스크린 숨기기
  document.querySelectorAll('.app-screen').forEach(s=>{
    s.classList.remove('active');
    if(s.id !== 'screen-sub') s.classList.add('hidden-left');
  });
  subScreen.classList.remove('hidden-right','hidden-left','active');
  subScreen.classList.add('active');
  screenHistory.push('sub:'+type);

  const back = document.getElementById('appHeaderBack');
  if(back) back.classList.add('show');

  // 콘텐츠 렌더
  const titles = {flights:'내 항공편', schedule:'행사 일정', emergency:'비상연락망',
    exchange:'환율계산기', cruise:'크루즈 정보', attractions:'관광지 TOP10'};
  const titleEl = document.getElementById('appHeaderTitle');
  if(titleEl) titleEl.textContent = titles[type] || '';

  if(type === 'flights'){
    renderAppFlights(content);
  } else if(type === 'exchange'){
    renderAppExchange(content);
  } else if(type === 'emergency'){
    renderAppEmergency(content);
  } else if(type === 'attractions'){
    renderAppAttractions(content);
  } else {
    // 기존 섹션 복사
    const sec = document.getElementById(type);
    if(sec){
      const clone = sec.cloneNode(true);
      clone.classList.remove('popup-section','admin-only');
      clone.style.display = 'block';
      clone.style.boxShadow = 'none';
      clone.style.borderRadius = '0';
      clone.style.margin = '0';
      content.innerHTML = '';
      content.appendChild(clone);
    }
  }
}

function appNavGroup(){
  // 단체 채팅방 팝업
  const html = `
    <div style="padding:8px 0">
      <h3 style="font-size:16px;font-weight:800;color:var(--navy);margin-bottom:16px">💬 단체 채팅방</h3>
      <a href="https://open.kakao.com/o/gRo1Rvli" target="_blank"
        style="display:flex;align-items:center;gap:12px;background:#FEE500;border-radius:12px;padding:14px 16px;margin-bottom:10px;text-decoration:none">
        <span style="font-size:24px">💬</span>
        <div>
          <div style="font-size:14px;font-weight:800;color:#3A1D1D">카카오톡 오픈채팅</div>
          <div style="font-size:11px;color:#5a3a00">ONCHAIN 2140 홍콩 크루즈</div>
        </div>
        <span style="margin-left:auto;font-size:18px;color:#3A1D1D">→</span>
      </a>
      <a href="https://t.me/+lZJxyopMildlODE1" target="_blank"
        style="display:flex;align-items:center;gap:12px;background:#229ED9;border-radius:12px;padding:14px 16px;text-decoration:none">
        <span style="font-size:24px">✈️</span>
        <div>
          <div style="font-size:14px;font-weight:800;color:#fff">텔레그램</div>
          <div style="font-size:11px;color:rgba(255,255,255,.8)">ONCHAIN 2140 홍콩 크루즈</div>
        </div>
        <span style="margin-left:auto;font-size:18px;color:#fff">→</span>
      </a>
    </div>`;
  const subScreen = document.getElementById('screen-sub');
  const content = document.getElementById('appSubContent');
  if(!subScreen||!content) return;
  const cur = document.getElementById('screen-'+currentTab);
  if(cur){cur.classList.remove('active');cur.classList.add('hidden-left');}
  subScreen.classList.remove('hidden-right','hidden-left');
  subScreen.classList.add('active');
  screenHistory.push('sub:chat');
  document.getElementById('appHeaderTitle').textContent = '단체 채팅방';
  document.getElementById('appHeaderBack').classList.add('show');
  content.innerHTML = html;
}

function appGoBack(){
  if(screenHistory.length <= 1){ switchTab('home'); return; }
  screenHistory.pop();
  const prev = screenHistory[screenHistory.length-1];

  const subScreen = document.getElementById('screen-sub');
  subScreen.classList.remove('active');
  subScreen.classList.add('hidden-right');

  if(prev.startsWith('sub:')){
    // 이전 서브화면으로
  } else {
    const tab = prev || 'home';
    const cur = document.getElementById('screen-'+tab);
    if(cur){ cur.classList.remove('hidden-left','hidden-right'); cur.classList.add('active'); }
    const titles={home:'ONCHAIN 2140',schedule:'행사 일정',community:'커뮤니티',myinfo:'내 정보'};
    document.getElementById('appHeaderTitle').textContent = titles[tab] || 'ONCHAIN 2140';
    document.getElementById('appHeaderBack').classList.remove('show');
    document.querySelectorAll('.app-tab').forEach(t=>t.classList.remove('active'));
    const at = document.getElementById('tab-'+tab);
    if(at) at.classList.add('active');
    currentTab = tab;
  }
}

function renderAppSchedule(){
  const content = document.getElementById('appScheduleContent');
  if(!content) return;
  const schedEl = document.getElementById('schedule');
  if(schedEl){
    const clone = schedEl.cloneNode(true);
    clone.id = 'appScheduleClone';
    clone.classList.remove('popup-section');
    clone.style.display = 'block';
    clone.style.boxShadow = 'none';
    clone.style.background = 'transparent';
    clone.style.padding = '0';
    content.innerHTML = '';
    content.appendChild(clone);
    highlightTodaySchedule();
  }

  // 참석 명단 토글 추가
  const memberToggle = document.createElement('div');
  memberToggle.style.cssText = 'margin-top:12px';
  memberToggle.innerHTML =
    '<div onclick="toggleMemberList()" style="background:var(--white);border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:12px;cursor:pointer;box-shadow:var(--shadow);transition:.2s"'
    +' onmouseover="this.style.background=\'var(--blue-light)\'" onmouseout="this.style.background=\'var(--white)\'">'
    +'<div style="width:38px;height:38px;background:var(--blue-light);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">👥</div>'
    +'<div style="flex:1"><div style="font-size:14px;font-weight:800;color:var(--navy)">참석자 명단</div>'
    +'<div style="font-size:12px;color:var(--gray2);margin-top:1px">22명 전체 명단</div></div>'
    +'<span id="memberListArrow" style="color:var(--gray2);font-size:16px;transition:transform .3s">▼</span>'
    +'</div>'
    +'<div id="memberListPanel" style="display:none;background:var(--white);border-radius:0 0 14px 14px;box-shadow:var(--shadow);overflow:hidden;margin-top:-4px">'
    + renderMemberListHTML()
    +'</div>';
  content.appendChild(memberToggle);
}

function toggleMemberList(){
  memberListOpen = !memberListOpen;
  const panel = document.getElementById('memberListPanel');
  const arrow = document.getElementById('memberListArrow');
  if(panel) panel.style.display = memberListOpen ? 'block' : 'none';
  if(arrow) arrow.style.transform = memberListOpen ? 'rotate(180deg)' : 'rotate(0deg)';
}

function renderMemberListHTML(){
  const asiana = PAX_DATA.filter(p => p.flight1 === 'OZ721');
  const premia = PAX_DATA.filter(p => p.flight1 === 'YP801');
  let html = '<div style="padding:4px 0">';

  // 아시아나
  html += '<div style="padding:8px 16px;font-size:10px;font-weight:800;color:var(--blue);letter-spacing:.1em;background:var(--blue-light);border-top:1px solid var(--border)">아시아나 OZ721 · '+asiana.length+'명</div>';
  asiana.forEach((p,i) => {
    html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--border)">'
      +'<span style="font-size:11px;color:var(--gray2);width:18px;text-align:center">'+(i+1)+'</span>'
      +'<span style="font-weight:700;color:var(--navy);font-size:14px">'+p.name+'</span>'
      +'<span style="font-size:12px;color:var(--gray2);background:var(--bg);border-radius:4px;padding:2px 8px">'+p.nick+'</span>'
      +'</div>';
  });

  // 에어프레미아
  html += '<div style="padding:8px 16px;font-size:10px;font-weight:800;color:var(--teal);letter-spacing:.1em;background:var(--teal-light);border-top:1px solid var(--border)">에어프레미아 YP801 · '+premia.length+'명</div>';
  premia.forEach((p,i) => {
    html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--border)">'
      +'<span style="font-size:11px;color:var(--gray2);width:18px;text-align:center">'+(i+1)+'</span>'
      +'<span style="font-weight:700;color:var(--navy);font-size:14px">'+p.name+'</span>'
      +'<span style="font-size:12px;color:var(--gray2);background:var(--bg);border-radius:4px;padding:2px 8px">'+p.nick+'</span>'
      +'</div>';
  });

  html += '</div>';
  return html;
}

function renderAppCommunity(){
  const content = document.getElementById('appCommunityContent');
  if(!content || content.dataset.loaded) return;
  const secEl = document.getElementById('community');
  if(secEl){
    const clone = secEl.cloneNode(true);
    clone.style.display = 'block';
    clone.style.boxShadow = 'none';
    clone.style.background = 'transparent';
    clone.style.padding = '0';
    content.innerHTML = '';
    content.appendChild(clone);
    content.dataset.loaded = '1';
  }
}

function renderMyInfoScreen(pax){
  const content = document.getElementById('appMyInfoContent');
  if(!content || !pax) return;
  // 여권 정보 찾기
  const admin = adminData.find(a => a.name === pax.name);
  const maskedPassport = admin ? admin.passport.slice(0,1)+'●●●●●●'+admin.passport.slice(-1) : '';
  const passportHtml = admin ? `
    <div style="background:linear-gradient(135deg,#0a1628,#1a3a7a);border-radius:16px;margin-bottom:12px;color:#fff;overflow:hidden">
      <!-- 헤더 토글 -->
      <div onclick="togglePassportDetail()" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">🛂</span>
          <span style="font-size:16px;font-weight:800;letter-spacing:.02em">나의 여권</span>
        </div>
        <span id="passportArrow" style="color:rgba(255,255,255,.5);font-size:18px;transition:transform .3s">▼</span>
      </div>
      <!-- 상세 패널 -->
      <div id="passportDetail" style="display:none;border-top:1px solid rgba(255,255,255,.12);padding:16px 20px 20px">
        <!-- 성명 / 생년월일 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:4px">성명</div>
            <div style="font-size:16px;font-weight:800">${pax.name}</div>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:4px">생년월일</div>
            <div style="font-size:16px;font-weight:700">${admin.birth}</div>
          </div>
        </div>
        <!-- 영문이름 / 성별 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:4px">영문이름</div>
            <div style="font-size:13px;font-weight:700;font-family:Space Mono,monospace">${admin.eng}</div>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:4px">성별</div>
            <div style="font-size:16px;font-weight:700">${admin.gender === '남' ? 'M (남)' : 'F (여)'}</div>
          </div>
        </div>
        <!-- 여권번호 -->
        <div style="background:rgba(255,255,255,.08);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,.45);letter-spacing:.08em;margin-bottom:5px">여권번호</div>
            <div id="passportNumDisplay"
              data-real="${admin.passport}"
              data-masked="${maskedPassport}"
              style="font-size:20px;font-weight:900;font-family:Space Mono,monospace;letter-spacing:.1em">${maskedPassport}</div>
          </div>
          <button id="passportRevealBtn" onclick="togglePassportReveal(event)"
            style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);color:#fff;border-radius:10px;padding:9px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">
            👁 보기
          </button>
        </div>
      </div>
    </div>` : '';

  content.innerHTML = `
    <div class="info-profile-card">
      <div class="info-avatar">✈️</div>
      <div>
        <div style="font-size:18px;font-weight:800">${pax.name}</div>
        <div style="font-size:13px;opacity:.8;margin-top:2px">닉네임: ${pax.nick}</div>
        <div style="font-size:11px;opacity:.6;margin-top:1px">${pax.flight1 === 'OZ721' ? '아시아나항공' : '에어프레미아'} 탑승</div>
      </div>
    </div>
    ${passportHtml}
    <div class="info-menu-item" onclick="appNav('flights')">
      <div class="info-menu-ico" style="background:#e8effe">✈️</div>
      <div><div class="info-menu-title">내 탑승권</div><div class="info-menu-sub">가는편 · 귀국편 좌석 확인</div></div>
      <span class="info-menu-arrow">›</span>
    </div>
    <div class="info-menu-item" onclick="openMemberBp(appUser.phone)">
      <div class="info-menu-ico" style="background:#dcf5f0">🎫</div>
      <div><div class="info-menu-title">탑승권 이미지</div><div class="info-menu-sub">탑승권 저장하기</div></div>
      <span class="info-menu-arrow">›</span>
    </div>
    <div class="info-menu-item" onclick="appNav('checklist')">
      <div class="info-menu-ico" style="background:#fdf6e3">✅</div>
      <div><div class="info-menu-title">준비물 체크리스트</div><div class="info-menu-sub">출발 전 체크사항</div></div>
      <span class="info-menu-arrow">›</span>
    </div>
    <div class="info-menu-item" onclick="toggleDarkMode()">
      <div class="info-menu-ico" style="background:#f0f4ff" id="darkMenuIco">🌙</div>
      <div><div class="info-menu-title">다크모드</div><div class="info-menu-sub">화면 테마 변경</div></div>
      <label style="margin-left:auto" onclick="event.stopPropagation()">
        <input type="checkbox" id="darkModeToggle" onchange="toggleDarkMode()" style="width:40px;height:22px;cursor:pointer;accent-color:var(--blue)">
      </label>
    </div>
    <div class="info-menu-item" onclick="exitAppModeAndLogout()" style="margin-top:8px">
      <div class="info-menu-ico" style="background:#fdeaea">🚪</div>
      <div><div class="info-menu-title" style="color:var(--red)">로그아웃</div><div class="info-menu-sub">로그인 화면으로</div></div>
      <span class="info-menu-arrow">›</span>
    </div>`;
  const cb = document.getElementById('darkModeToggle');
  if(cb) cb.checked = document.body.classList.contains('dark-mode');
}

function renderAppFlights(content){
  if(!appUser) return;
  const p = appUser;
  content.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)">
        <div style="font-size:12px;font-weight:700;color:var(--blue);letter-spacing:.08em;margin-bottom:12px">✈ 가는 편 (04.24)</div>
        <div style="font-size:28px;font-weight:900;color:var(--navy);font-family:Barlow,sans-serif;margin-bottom:14px">ICN → HKG</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">항공편</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">${p.flight1}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">출발</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">${p.dep1.split(' ').pop()}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">터미널</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">${p.flight1==='OZ721'?'T2':'T1'}</div>
          </div>
          <div style="background:var(--teal);border-radius:10px;padding:12px;cursor:pointer" onclick="showSeatMap(appUser.seat1, appUser.flight1)">
            <div style="font-size:10px;color:rgba(255,255,255,.7);letter-spacing:.06em;margin-bottom:4px">내 좌석 👆</div>
            <div style="font-size:28px;font-weight:900;color:#fff;font-family:Barlow,sans-serif">${p.seat1}</div>
            <div style="font-size:9px;color:rgba(255,255,255,.6);margin-top:2px">위치 보기</div>
          </div>
        </div>
        <button onclick="memberBpTab='go';openMemberBp(appUser.phone)" style="width:100%;background:var(--teal);color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer">🎫 탑승권 보기</button>
      </div>
      <div style="background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)">
        <div style="font-size:12px;font-weight:700;color:var(--blue);letter-spacing:.08em;margin-bottom:12px">✈ 귀국 편 (04.28)</div>
        <div style="font-size:28px;font-weight:900;color:var(--navy);font-family:Barlow,sans-serif;margin-bottom:14px">HKG → ICN</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">항공편</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">${p.flight2}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">출발</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">${p.dep2.split(' ').pop()}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);letter-spacing:.06em;margin-bottom:4px">터미널</div>
            <div style="font-size:16px;font-weight:800;color:var(--navy)">T1 (홍콩)</div>
          </div>
          <div style="background:var(--blue);border-radius:10px;padding:12px;cursor:pointer" onclick="showSeatMap(appUser.seat2,'OZ746')">
            <div style="font-size:10px;color:rgba(255,255,255,.7);letter-spacing:.06em;margin-bottom:4px">내 좌석 👆</div>
            <div style="font-size:28px;font-weight:900;color:#fff;font-family:Barlow,sans-serif">${p.seat2}</div>
            <div style="font-size:9px;color:rgba(255,255,255,.6);margin-top:2px">위치 보기</div>
          </div>
        </div>
        <button onclick="memberBpTab='return';openMemberBp(appUser.phone)" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer">🎫 탑승권 보기</button>
      </div>
    </div>`;
}

function renderAppExchange(content){
  const sec = document.getElementById('exchange');
  if(sec){
    const clone = sec.cloneNode(true);
    clone.classList.remove('popup-section');
    clone.style.display='block';clone.style.boxShadow='none';
    // ID 리맵
    const idMap={'hkdInput2':'p_hkdInput2','krwInput2':'p_krwInput2','krwResult':'p_krwResult','hkdResult':'p_hkdResult'};
    Object.entries(idMap).forEach(([o,n])=>{const el=clone.querySelector('#'+o);if(el){el.id=n;}});
    const h=clone.querySelector('#p_hkdInput2');const k=clone.querySelector('#p_krwInput2');
    if(h)h.setAttribute('oninput','calcHKD_p()');if(k)k.setAttribute('oninput','calcKRW_p()');
    clone.querySelectorAll('button').forEach(b=>{
      if(b.getAttribute('onclick')==='resetHKD()')b.setAttribute('onclick','resetHKD_p()');
      if(b.getAttribute('onclick')==='resetKRW()')b.setAttribute('onclick','resetKRW_p()');
      if(b.getAttribute('onclick')&&b.getAttribute('onclick').startsWith('quickCalc('))
        b.setAttribute('onclick',b.getAttribute('onclick').replace('quickCalc(','quickCalc_p('));
    });
    content.innerHTML='';content.appendChild(clone);
  }
}

function renderAppEmergency(content){
  if(!content) return;
  const kakaoLinks = {
    '010-5342-0356':'http://qr.kakao.com/talk/HWVMG4rjO8iU43ryieVKp3Hpsq8-',
    '010-4999-4116':'http://qr.kakao.com/talk/C6xJQEDor._O1q_GwP8rvMVw7vc-',
    '010-3828-0303':'https://qr.kakao.com/talk/pQc9Yo0iWR.zlkwelBJ9Yekgbmc-',
    '010-7387-6114':'http://qr.kakao.com/talk/1K.n1ClX7qB7U8hIyO6rfli82p8-',
    '010-3662-3459':'http://qr.kakao.com/talk/FQqn4kF_tN9EmdH4Un3H85tPJls-',
    '010-8253-2411':'http://qr.kakao.com/talk/Lbyo8NGse2mSszS4gwX7GIzCKTI-',
    '010-2476-2378':'https://qr.kakao.com/talk/zr1nc96OxkA0TWFwTZmkzGAyvV4-',
    '010-6323-0952':'http://qr.kakao.com/talk/z3XPlL5imU4rN_zoke_wVA0c.2A-',
    '010-7378-2225':'http://qr.kakao.com/talk/XLyImWPL.DQpjSwq_N0qYyuUJpw-',
  };
  let cards = '';
  PAX_DATA.forEach(function(p){
    var tel = p.phone.replace(/-/g,'');
    var kakao = kakaoLinks[p.phone] || '';
    var kakaoBtn = kakao
      ? '<a href="' + kakao + '" target="_blank" style="display:block;background:#FEE500;color:#3A1D1D;border-radius:6px;padding:5px 8px;text-align:center;font-size:12px;font-weight:700;text-decoration:none;margin-top:4px">&#x1F4AC; 카카오톡</a>'
      : '';
    cards += '<div style="background:var(--white);border-radius:10px;padding:12px;box-shadow:var(--shadow)">'
      + '<div style="font-size:13px;font-weight:800;color:var(--navy)">' + p.name + '</div>'
      + '<div style="font-size:11px;color:var(--gray2);margin-bottom:6px">' + p.nick + '</div>'
      + '<a href="tel:' + tel + '" style="display:block;background:var(--teal-light);color:var(--teal);border-radius:6px;padding:5px 8px;text-align:center;font-size:12px;font-weight:700;text-decoration:none">&#x1F4DE; ' + p.phone + '</a>'
      + kakaoBtn
      + '</div>';
  });
  content.innerHTML =
    '<div style="background:#fff3cd;border:2px solid #ffc107;border-radius:12px;padding:14px 16px;margin-bottom:14px;display:flex;gap:10px">'
    + '<span style="font-size:20px">&#x26A0;&#xFE0F;</span>'
    + '<div><div style="font-size:13px;font-weight:800;color:#856404;margin-bottom:3px">로밍 요금 주의!</div>'
    + '<div style="font-size:12px;color:#856404">홍콩 현지 전화 시 로밍 요금 발생. 카카오톡/텔레그램 이용 권장.</div></div></div>'
    + '<a href="https://open.kakao.com/o/gRo1Rvli" target="_blank" style="display:flex;align-items:center;gap:12px;background:#FEE500;border-radius:12px;padding:12px 16px;margin-bottom:8px;text-decoration:none">'
    + '<span style="font-size:22px">&#x1F4AC;</span><div style="flex:1"><div style="font-size:14px;font-weight:800;color:#3A1D1D">카카오 단체 채팅방</div></div><span style="color:#3A1D1D">&#x2192;</span></a>'
    + '<a href="https://t.me/+lZJxyopMildlODE1" target="_blank" style="display:flex;align-items:center;gap:12px;background:#229ED9;border-radius:12px;padding:12px 16px;margin-bottom:16px;text-decoration:none">'
    + '<span style="font-size:22px">&#x2708;&#xFE0F;</span><div style="flex:1"><div style="font-size:14px;font-weight:800;color:#fff">텔레그램 채팅방</div></div><span style="color:#fff">&#x2192;</span></a>'
    + '<div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:10px">&#x1F4DE; 22명 연락처</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' + cards + '</div>'
    + '<div style="margin-top:14px;background:var(--red-light);border-radius:10px;padding:12px 14px;font-size:12px;color:var(--red)">'
    + '&#x1F3E5; 홍콩 긴급: <strong>999</strong> &middot; 한국 영사관: <strong>+852-2529-4141</strong></div>';
}

function renderAppAttractions(content){
  const sec = document.getElementById('attractions');
  if(sec){ const clone=sec.cloneNode(true); clone.style.boxShadow='none'; content.innerHTML=''; content.appendChild(clone); }
}

function reanimateCards(screenEl){
  if(!screenEl) return;
  screenEl.querySelectorAll('.home-card, .info-menu-item, .day-card').forEach((el,i)=>{
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
    el.style.animationDelay = (i * 0.06) + 's';
    el.classList.remove('anim-card');
    void el.offsetWidth;
    el.classList.add('anim-card');
  });
}

function toggleDarkMode(){
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  const btn = document.getElementById('darkToggle');
  if(btn) btn.textContent = isDark?'☀️':'🌙';
  const appBtn = document.getElementById('appDarkBtn');
  if(appBtn) appBtn.textContent = isDark?'☀️':'🌙';
  const cb = document.getElementById('darkModeToggle');
  if(cb) cb.checked = isDark;
}

function closeAll(){
  // 앱모드 body overflow 복원
  if(document.body.classList.contains('app-mode')) document.body.style.overflow = 'hidden';
  document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('show'));
}

function openEmergency(){
  if(document.body.classList.contains('app-mode')){
    appNav('emergency');
  } else {
    document.getElementById('emgOverlay').classList.add('show');
  }
}

function closeEmg(e){if(e.target===document.getElementById('emgOverlay'))closeAll();}

function scrollTo2(id){document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'});}

function openPopupSection(id){
  const sec = document.getElementById(id);
  if(!sec) return;
  const clone = sec.cloneNode(true);
  clone.classList.remove('popup-section','admin-only');
  clone.style.display = 'block';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.margin = '0';

  // ID 중복 방지: 환율계산기 ID들을 popup용으로 변경
  const idMap = {
    'hkdInput2': 'p_hkdInput2',
    'krwInput2': 'p_krwInput2',
    'krwResult': 'p_krwResult',
    'hkdResult': 'p_hkdResult'
  };
  Object.entries(idMap).forEach(([oldId, newId]) => {
    const el = clone.querySelector('#' + oldId);
    if(el) el.id = newId;
  });
  // oninput 함수도 popup용으로 교체
  const hkdIn = clone.querySelector('#p_hkdInput2');
  const krwIn = clone.querySelector('#p_krwInput2');
  if(hkdIn) hkdIn.setAttribute('oninput', 'calcHKD_p()');
  if(krwIn) krwIn.setAttribute('oninput', 'calcKRW_p()');

  // 초기화 버튼도 교체
  clone.querySelectorAll('button').forEach(btn => {
    if(btn.getAttribute('onclick') === 'resetHKD()') btn.setAttribute('onclick','resetHKD_p()');
    if(btn.getAttribute('onclick') === 'resetKRW()') btn.setAttribute('onclick','resetKRW_p()');
    if(btn.getAttribute('onclick') && btn.getAttribute('onclick').startsWith('quickCalc('))
      btn.setAttribute('onclick', btn.getAttribute('onclick').replace('quickCalc(', 'quickCalc_p('));
  });

  document.getElementById('popupSectionContent').innerHTML = '';
  document.getElementById('popupSectionContent').appendChild(clone);
  document.getElementById('popupSectionOverlay').classList.add('show');
}

function closePopupSection(e){
  if(e.target===document.getElementById('popupSectionOverlay')) closeAll();
}
