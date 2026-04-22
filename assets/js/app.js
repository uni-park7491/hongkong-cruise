
// ─────────── AI 시간대별 인사말 ───────────
function getTimeGreeting(pax){
  const now = new Date();
  const hk = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Hong_Kong'}));
  const h = hk.getHours();
  const name = pax.nick || pax.name;

  // 여행 기간 판단
  const tripStart = new Date('2026-04-24T09:00:00+08:00');
  const tripEnd   = new Date('2026-04-28T06:20:00+09:00');
  const isTripDay = now >= tripStart && now <= tripEnd;

  // 오늘 일정 찾기
  const todayKey = `${hk.getMonth()+1}/${hk.getDate()}`;
  const scheduleMap = {
    '4/24': { title:'탑승 & 웰컴 나이트', events:['~16:00 홍콩 공항 도착','16~18시 크루즈 탑승 수속','21:00 🚢 크루즈 출항'] },
    '4/25': { title:'메인 컨퍼런스 데이', events:['10:00 오프닝 세션','12:00 점심 식사','14:00 국가별 커뮤니티 회의','19:30 저녁 프로젝트 세션','22:00 글로벌 공연'] },
    '4/26': { title:'하선 & 홍콩 시티투어', events:['09:00 크루즈 하선','종일 홍콩 1일 시티투어','투어 후 호텔 체크인'] },
    '4/27': { title:'홍콩 자유 일정', events:['아침 호텔 조식','낮~저녁 자유 일정','22:30 홍콩 국제공항 출발'] },
    '4/28': { title:'귀국', events:['01:40 ✈️ 아시아나 OZ746 출발','06:20 인천 T2 도착'] },
  };
  const todaySched = scheduleMap[todayKey];

  let emoji = '👋';
  let greeting = '';
  let subMsg = '';

  if(isTripDay && todaySched){
    const eventsText = todaySched.events.join(' · ');
    if(h < 7){
      emoji = '🌙';
      greeting = `${name}님, 새벽이네요!`;
      subMsg = `오늘은 <strong>${todaySched.title}</strong> 날이에요.<br>${eventsText}`;
    } else if(h < 12){
      emoji = '🌅';
      greeting = `좋은 아침이에요, ${name}님!`;
      subMsg = `오늘 일정: <strong>${todaySched.title}</strong><br>${eventsText}`;
    } else if(h < 14){
      emoji = '☀️';
      greeting = `${name}님, 점심 시간이에요!`;
      subMsg = `오늘은 <strong>${todaySched.title}</strong> 일정입니다.<br>${eventsText}`;
    } else if(h < 18){
      emoji = '🌤️';
      greeting = `${name}님, 오후도 파이팅!`;
      subMsg = `오늘 남은 일정: <strong>${todaySched.title}</strong><br>${eventsText}`;
    } else if(h < 22){
      emoji = '🌆';
      greeting = `${name}님, 즐거운 저녁이에요!`;
      subMsg = `오늘 하루 <strong>${todaySched.title}</strong> 어떠셨나요? 😊`;
    } else {
      emoji = '🌙';
      greeting = `${name}님, 오늘 하루 수고하셨어요!`;
      subMsg = `편안한 밤 되세요. 내일도 좋은 일정이 기다리고 있어요 ✨`;
    }
  } else {
    // 여행 전/후
    const diff = Math.ceil((tripStart - now) / 86400000);
    if(diff > 0){
      if(h < 12){
        emoji = '🌅';
        greeting = `좋은 아침이에요, ${name}님!`;
        subMsg = `홍콩 크루즈까지 <strong>D-${diff}</strong>! 준비 잘 되고 있나요? 🚢`;
      } else if(h < 18){
        emoji = '☀️';
        greeting = `안녕하세요, ${name}님!`;
        subMsg = `출발까지 <strong>${diff}일</strong> 남았어요. 설레지 않나요? ✈️`;
      } else if(h < 22){
        emoji = '🌆';
        greeting = `${name}님, 저녁 잘 드셨어요?`;
        subMsg = `홍콩 크루즈 <strong>D-${diff}</strong>! 오늘 준비물 체크해보셨나요? ✅`;
      } else {
        emoji = '🌙';
        greeting = `${name}님, 좋은 밤이에요!`;
        subMsg = `내일도 크루즈 준비 파이팅! 🚢 설레는 꿈 꾸세요 ✨`;
      }
    } else {
      emoji = '🎉';
      greeting = `${name}님, 홍콩 크루즈 어떠셨나요?`;
      subMsg = `멋진 연수였기를 바라요! 다음에 또 함께해요 😊`;
    }
  }

  return { emoji, greeting, subMsg };
}

function renderTimeGreeting(pax){
  const el = document.getElementById('aiGreeting');
  if(!el || !pax) return;
  const { emoji, greeting, subMsg } = getTimeGreeting(pax);
  el.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:rgba(255,255,255,.08);border-radius:12px;margin:12px 0 0;border:1px solid rgba(255,255,255,.12)">
      <div style="font-size:24px;flex-shrink:0;margin-top:2px">${emoji}</div>
      <div>
        <div style="font-size:14px;font-weight:800;color:#fff;margin-bottom:4px">${greeting}</div>
        <div style="font-size:12px;color:rgba(255,255,255,.7);line-height:1.6">${subMsg}</div>
      </div>
    </div>
  `;
}
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
  // 앱 UI 명시적으로 표시
  const appScreens = document.getElementById('appScreens');
  const appTabBar = document.getElementById('appTabBar');
  const appHeader = document.getElementById('appHeader');
  if(appScreens){ appScreens.style.display = 'block'; appScreens.style.zIndex = '100'; }
  if(appTabBar) appTabBar.style.display = 'flex';
  if(appHeader) appHeader.style.display = 'flex';

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
  setTimeout(()=>renderTimeGreeting(pax), 100);

  // 탭 초기화 - DOM이 준비된 후 실행
  requestAnimationFrame(function(){
    switchTab('home');
    screenHistory = ['home'];
  });
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

  // 모든 스크린 먼저 숨기기 (active 확실히 해제)
  document.querySelectorAll('.app-screen').forEach(s => {
    s.classList.remove('active','hidden-left','hidden-right');
    if(s.id !== 'screen-'+tab) s.classList.add('hidden-right');
  });

  // 스크린 전환 방향 결정
  const tabOrder = ['home','schedule','chat','myinfo'];
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
  const titles = {home:'ONCHAIN 2140', schedule:'행사 일정', chat:'💬 채팅', myinfo:'내 정보'};
  const titleEl = document.getElementById('appHeaderTitle');
  if(titleEl) titleEl.textContent = titles[tab] || 'ONCHAIN 2140';

  // 뒤로 버튼 숨기기
  const backBtn = document.getElementById('appHeaderBack');
  if(backBtn) backBtn.classList.remove('show');

  screenHistory = [tab];

  // 탭별 콘텐츠 렌더
  if(tab === 'schedule') renderAppSchedule();
  if(tab === 'chat') renderAppChat(document.getElementById('appChatContent'));
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
  } else if(type === 'community-board'){
    // 게시판 전용 (투표+방명록)
    const titleEl = document.getElementById('appHeaderTitle');
    if(titleEl) titleEl.textContent = '📋 게시판';
    const subScreen = document.getElementById('screen-sub');
    const content = document.getElementById('appSubContent');
    if(!subScreen || !content) return;
    document.querySelectorAll('.app-screen').forEach(s=>{
      s.classList.remove('active');
      if(s.id !== 'screen-sub') s.classList.add('hidden-left');
    });
    subScreen.classList.remove('hidden-right','hidden-left','active');
    subScreen.classList.add('active');
    screenHistory.push('sub:community-board');
    const back = document.getElementById('appHeaderBack');
    if(back) back.classList.add('show');
    // 커뮤니티 섹션 복사
    const commEl = document.getElementById('community');
    if(commEl){
      const clone = commEl.cloneNode(true);
      clone.classList.remove('popup-section','admin-only');
      clone.style.cssText = 'display:block;box-shadow:none;background:transparent;padding:0;border-radius:0';
      content.innerHTML = '';
      content.appendChild(clone);
    }
    if(typeof initCommunity === 'function') initCommunity();
  } else if(type === 'cruise-ticket'){
    if(typeof showCruiseTicket === 'function') showCruiseTicket();
    // sub screen으로 가지 않고 모달 열기
    appGoBack();
  } else if(type === 'finance'){
    if(typeof showFinanceWarning === 'function') showFinanceWarning();
    appGoBack();
  } else if(type === 'parking'){
    if(typeof showParkingInfo === 'function') showParkingInfo();
    appGoBack();
  } else if(type === 'hotel'){
    if(typeof showHotelInfo === 'function') showHotelInfo();
    appGoBack();
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
    +'<div style="font-size:12px;color:var(--gray2);margin-top:1px">전체 명단</div></div>'
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
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div style="font-size:20px;font-weight:900">${pax.name}</div>
          <div style="background:rgba(255,202,34,.25);border:1px solid rgba(255,202,34,.5);border-radius:20px;padding:3px 12px;font-size:13px;font-weight:700;color:#ffca22">${pax.nick}</div>
        </div>
      </div>
    </div>
    ${passportHtml}
    <div class="info-menu-item" onclick="appNav('flights')">
      <div class="info-menu-ico" style="background:#e8effe">✈️</div>
      <div><div class="info-menu-title">내 항공편</div><div class="info-menu-sub">가는편 · 귀국편 · 좌석 확인</div></div>
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
  const airline1 = p.flight1==='OZ721' ? '아시아나항공 A330-300' : '에어프레미아 B787-9';
  const airline2 = 'OZ746 · 아시아나항공 A330-300';

  function seatCard(seat, flight, color){
    const row = parseInt(seat);
    const col = seat.replace(/[0-9]/g,'').toUpperCase();
    // 아시아나 A330: A-B-C / D-E-F / H-J-K (3-3-3), 에어프레미아 B787: A-B-C / D-E-F / G-H-J (3-3-3)
    const isAsiana = flight.includes('OZ');
    const cols = isAsiana ? ['A','B','C','D','E','F','H','J','K'] : ['A','B','C','D','E','F','G','H','J'];
    let pos = '';
    if(isAsiana){
      if(col==='A') pos='왼쪽 창가';
      else if(col==='B') pos='왼쪽 중간';
      else if(col==='C') pos='왼쪽 통로';
      else if(col==='D') pos='가운데 통로';
      else if(col==='E') pos='가운데 중간';
      else if(col==='F') pos='가운데 통로';
      else if(col==='H') pos='오른쪽 통로';
      else if(col==='J') pos='오른쪽 중간';
      else if(col==='K') pos='오른쪽 창가';
    } else {
      if(col==='A') pos='왼쪽 창가';
      else if(col==='B') pos='왼쪽 중간';
      else if(col==='C') pos='왼쪽 통로';
      else if(col==='D') pos='가운데 통로';
      else if(col==='E') pos='가운데 중간';
      else if(col==='F') pos='가운데 통로';
      else if(col==='G') pos='오른쪽 통로';
      else if(col==='H') pos='오른쪽 중간';
      else if(col==='J') pos='오른쪽 창가';
    }
    const zone = row<=15?'앞쪽':row<=25?'중간':'뒤쪽';
    const cardId = 'seatCard_' + seat + '_' + flight.replace(/[^a-zA-Z0-9]/g,'');
    // 전역에 등록
    window['openSeat_'+cardId] = function(){ showSeatMapModal(seat, flight); };
    return `<div style="background:${color};border-radius:12px;padding:14px;cursor:pointer;grid-column:span 2"
      onclick="window['openSeat_${cardId}']()" id="${cardId}">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:10px;color:rgba(255,255,255,.7);margin-bottom:4px">내 좌석 · 탭하면 위치 확인</div>
          <div style="font-size:38px;font-weight:900;color:#fff;font-family:Barlow,sans-serif;line-height:1">${seat}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;color:rgba(255,255,255,.8);margin-bottom:4px">${zone} · ${pos}</div>
          <div style="background:rgba(255,255,255,.2);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;color:#fff">
            🗺 좌석 배치도 보기
          </div>
        </div>
      </div>
    </div>`;
  }

  content.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div style="font-size:12px;font-weight:700;color:var(--blue);letter-spacing:.06em">✈ 가는 편</div>
          <div style="font-size:11px;color:var(--gray2)">04.24 (금)</div>
        </div>
        <div style="font-size:11px;color:var(--gray2);margin-bottom:14px">${airline1}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">항공편</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.flight1}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">출발 시각</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.dep1.split(' ').pop()}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">인천 터미널</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.flight1==='OZ721'?'T2':'T1'}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">홍콩 도착</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.arr1.split(' ').pop()}</div>
          </div>
          ${seatCard(p.seat1, p.flight1, 'linear-gradient(135deg,#0e8a7c,#1e5fd4)')}
        </div>
      </div>
      <div style="background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div style="font-size:12px;font-weight:700;color:var(--blue);letter-spacing:.06em">✈ 귀국 편</div>
          <div style="font-size:11px;color:var(--gray2)">04.28 (화) 새벽</div>
        </div>
        <div style="font-size:11px;color:var(--gray2);margin-bottom:14px">${airline2}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">항공편</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.flight2}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">출발 시각</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.dep2.split(' ').pop()}</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">홍콩 터미널</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">T1</div>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:12px">
            <div style="font-size:10px;color:var(--gray2);margin-bottom:4px">인천 도착</div>
            <div style="font-size:18px;font-weight:800;color:var(--navy)">${p.arr2.split(' ').pop()}</div>
          </div>
          ${seatCard(p.seat2, p.flight2, 'linear-gradient(135deg,#002868,#1e5fd4)')}
        </div>
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
  if(sec){
    const clone=sec.cloneNode(true);
    clone.style.boxShadow='none';
    content.innerHTML='';
    content.appendChild(clone);
  }
  // 관광지 투표 섹션 추가
  const voteDiv = document.createElement('div');
  voteDiv.style.cssText = 'margin-top:16px;background:var(--white);border-radius:16px;padding:18px;box-shadow:var(--shadow)';
  voteDiv.innerHTML = renderAttractionVote();
  content.appendChild(voteDiv);
}

function renderAttractionVote(){
  const VOTE_KEY = 'attractionVotes';
  const MY_VOTE_KEY = 'myAttractionVotes_' + (appUser ? appUser.phone : 'guest');
  const attractions_list = [
    {rank:1, name:'빅토리아 피크', emoji:'⛰️'},
    {rank:2, name:'침사추이 워터프론트', emoji:'🌊'},
    {rank:3, name:'심포니 오브 라이츠', emoji:'✨'},
    {rank:4, name:'천단대불', emoji:'🙏'},
    {rank:5, name:'옹핑 360 케이블카', emoji:'🚡'},
    {rank:6, name:'템플스트리트 야시장', emoji:'🏮'},
    {rank:7, name:'익청빌딩', emoji:'🏢'},
    {rank:8, name:'스타페리', emoji:'⛴️'},
    {rank:9, name:'란콰이퐁', emoji:'🍸'},
    {rank:10, name:'몽콕 레이디스마켓', emoji:'🛍️'},
    {rank:11, name:'홍콩 디즈니랜드', emoji:'🏰'},
    {rank:12, name:'오션파크', emoji:'🎡'},
    {rank:13, name:'센트럴 에스컬레이터', emoji:'🚶'},
    {rank:14, name:'스카이100 전망대', emoji:'🏙️'},
    {rank:15, name:'리펄스베이 & 틴하우사원', emoji:'🏖️'},
  ];

  // 투표 데이터 로드
  let votes = {};
  let myVotes = [];
  try {
    const stored = localStorage.getItem(VOTE_KEY);
    if(stored) votes = JSON.parse(stored);
    const myStored = localStorage.getItem(MY_VOTE_KEY);
    if(myStored) myVotes = JSON.parse(myStored);
  } catch(e){}

  const maxVote = Math.max(1, ...Object.values(votes));
  const totalVoters = new Set(Object.values(votes)).size || 1;

  const items = attractions_list.map(a => {
    const cnt = votes[a.rank] || 0;
    const pct = Math.round(cnt / Math.max(1, Object.values(votes).reduce((s,v)=>s+v,0)) * 100) || 0;
    const checked = myVotes.includes(a.rank);
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <input type="checkbox" id="avote${a.rank}" ${checked?'checked':''} onchange="handleAttrVote(${a.rank},this.checked)"
        style="width:20px;height:20px;cursor:pointer;accent-color:var(--blue);flex-shrink:0">
      <label for="avote${a.rank}" style="flex:1;cursor:pointer;display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">${a.emoji}</span>
        <span style="font-size:13px;font-weight:700;color:var(--navy)">${a.rank}. ${a.name}</span>
      </label>
      <div style="text-align:right;min-width:60px">
        <div style="font-size:12px;font-weight:800;color:var(--blue)">${cnt}표</div>
        <div style="width:60px;height:4px;background:var(--border);border-radius:2px;margin-top:3px">
          <div style="width:${pct}%;height:100%;background:var(--blue);border-radius:2px;transition:.3s"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  return `<div>
    <div style="font-size:15px;font-weight:800;color:var(--navy);margin-bottom:4px">🗳️ 어디를 가고싶나요?</div>
    <div style="font-size:12px;color:var(--gray2);margin-bottom:14px">TOP 15 중에서 가고싶은 곳을 투표해 주세요 · 중복 선택 가능 · 항목당 1회</div>
    ${items}
    <div style="margin-top:12px;font-size:11px;color:var(--gray2);text-align:center">투표는 이 기기에 저장됩니다</div>
  </div>`;
}

function handleAttrVote(rank, checked){
  const VOTE_KEY = 'attractionVotes';
  const MY_VOTE_KEY = 'myAttractionVotes_' + (appUser ? appUser.phone : 'guest');
  let votes = {};
  let myVotes = [];
  try {
    const s = localStorage.getItem(VOTE_KEY); if(s) votes=JSON.parse(s);
    const m = localStorage.getItem(MY_VOTE_KEY); if(m) myVotes=JSON.parse(m);
  } catch(e){}

  if(checked){
    votes[rank] = (votes[rank]||0) + 1;
    if(!myVotes.includes(rank)) myVotes.push(rank);
  } else {
    votes[rank] = Math.max(0, (votes[rank]||1) - 1);
    myVotes = myVotes.filter(r=>r!==rank);
  }

  try {
    localStorage.setItem(VOTE_KEY, JSON.stringify(votes));
    localStorage.setItem(MY_VOTE_KEY, JSON.stringify(myVotes));
  } catch(e){}

  // 투표수 즉시 반영
  const cnt = votes[rank] || 0;
  const totalVotes = Object.values(votes).reduce((s,v)=>s+v,0) || 1;
  const pct = Math.round(cnt/totalVotes*100);
  const row = document.getElementById('avote'+rank)?.closest('div[style*="border-bottom"]');
  if(row){
    const cntEl = row.querySelector('div[style*="font-weight:800"]');
    const barEl = row.querySelector('div[style*="height:100%"]');
    if(cntEl) cntEl.textContent = cnt+'표';
    if(barEl) barEl.style.width = pct+'%';
  }
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


// ─────────────────────────────────────────────
// 실시간 채팅 (Firebase Firestore)
// ─────────────────────────────────────────────
let chatUnsubscribe = null;

function renderAppChat(content){
  if(!content){ content = document.getElementById('appChatContent'); }
  if(!content) return;

  const user = appUser;
  const myName = user ? user.nick : '익명';

  content.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;min-height:calc(100vh - 140px)">
      <!-- 채팅 헤더 -->
      <div style="padding:12px 16px;background:var(--white);border-bottom:1px solid var(--border);flex-shrink:0">
        <div style="font-size:15px;font-weight:900;color:var(--navy)">💬 그룹 채팅</div>
        <div style="font-size:11px;color:var(--gray2);margin-top:2px">ONCHAIN 2140 · 홍콩 크루즈 22명</div>
      </div>
      <!-- 메시지 목록 -->
      <div id="chatMessages" style="flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;background:#f8faff"></div>
      <!-- 입력창 -->
      <div style="padding:10px 12px;background:var(--white);border-top:1px solid var(--border);flex-shrink:0;display:flex;gap:8px;align-items:flex-end">
        <textarea id="chatInput" placeholder="메시지를 입력하세요..."
          style="flex:1;border:1.5px solid var(--border);border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit;resize:none;outline:none;max-height:100px;line-height:1.5;background:var(--bg)"
          rows="1"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMsg();}"></textarea>
        <button onclick="sendChatMsg()" style="background:linear-gradient(135deg,#1e5fd4,#0e8a7c);border:none;border-radius:12px;padding:10px 16px;color:#fff;font-size:20px;cursor:pointer;flex-shrink:0;line-height:1">➤</button>
      </div>
    </div>`;

  // 채팅 리스너 시작
  startChatListener();
}

function startChatListener(){
  if(chatUnsubscribe) chatUnsubscribe();
  
  // Firebase 준비 안 됐으면 fbready 이벤트 기다림
  if(!window._db || !window._fs){
    window.addEventListener('fbready', function onFbReady(){
      window.removeEventListener('fbready', onFbReady);
      startChatListener();
    }, {once: true});
    return;
  }
  
  try {
    const fs = window._fs;
    const db = window._db;
    // orderBy ts없이 먼저 시도 (규칙 문제로 인덱스 없을 수 있음)
    const q = fs.query(
      fs.collection(db, 'groupChat'),
      fs.orderBy('ts', 'asc'),
      fs.limit(100)
    );
    chatUnsubscribe = fs.onSnapshot(q, 
      function(snap){
        const msgs = snap.docs.map(function(d){ return Object.assign({id: d.id}, d.data()); });
        renderChatMessages(msgs);
      },
      function(err){
        console.warn('Chat listener error:', err.code, err.message);
        // 에러 메시지 표시
        const el = document.getElementById('chatMessages');
        if(el) el.innerHTML = '<div style="text-align:center;padding:20px;color:#dc2626;font-size:12px">채팅 연결 오류: ' + err.message + '<br>Firebase 보안 규칙을 확인해주세요.</div>';
      }
    );
  } catch(e){ 
    console.warn('Chat error:', e);
    const el = document.getElementById('chatMessages');
    if(el) el.innerHTML = '<div style="text-align:center;padding:20px;color:#dc2626;font-size:12px">Firebase 연결 실패: ' + e.message + '</div>';
  }
}

function renderChatMessages(msgs){
  const el = document.getElementById('chatMessages');
  if(!el) return;
  const myNick = appUser ? appUser.nick : '';
  
  if(!msgs || !msgs.length){
    el.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:13px;padding:40px 0">아직 메시지가 없어요.<br>첫 메시지를 보내보세요! 👋</div>';
    return;
  }

  el.innerHTML = msgs.map(m => {
    const isMe = m.nick === myNick;
    const timeStr = m.ts ? new Date(m.ts.toMillis ? m.ts.toMillis() : m.ts).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) : '';
    
    if(isMe){
      return `<div style="display:flex;justify-content:flex-end;gap:6px;align-items:flex-end">
        <div style="font-size:10px;color:#94a3b8;flex-shrink:0">${timeStr}</div>
        <div style="max-width:72%;background:linear-gradient(135deg,#1e5fd4,#0e8a7c);color:#fff;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:14px;line-height:1.5;word-break:break-word">${escapeHtml(m.text)}</div>
      </div>`;
    } else {
      return `<div style="display:flex;gap:8px;align-items:flex-start">
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#e8effe,#dde6fb);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#1e5fd4;flex-shrink:0">${(m.nick||'?')[0]}</div>
        <div>
          <div style="font-size:11px;color:#64748b;margin-bottom:3px;font-weight:600">${escapeHtml(m.nick||'익명')}</div>
          <div style="display:flex;gap:6px;align-items:flex-end">
            <div style="max-width:72%;background:#fff;border:1px solid #e2e8f0;border-radius:4px 16px 16px 16px;padding:10px 14px;font-size:14px;line-height:1.5;word-break:break-word;box-shadow:0 1px 4px rgba(0,0,0,.06)">${escapeHtml(m.text)}</div>
            <div style="font-size:10px;color:#94a3b8;flex-shrink:0">${timeStr}</div>
          </div>
        </div>
      </div>`;
    }
  }).join('');

  // 최신 메시지로 스크롤
  el.scrollTop = el.scrollHeight;
}

async function sendChatMsg(){
  var input = document.getElementById('chatInput');
  if(!input) return;
  var text = input.value.trim();
  if(!text || text.length > 500) return;
  var nick = appUser ? appUser.nick : '익명';
  var name = appUser ? appUser.name : '익명';
  input.value = '';
  
  if(!window._db || !window._fs){
    alert('채팅 서버 연결 중입니다. 잠시 후 다시 시도해주세요.');
    input.value = text;
    return;
  }
  
  try {
    var fs = window._fs;
    var db = window._db;
    var msgData = {
      text: text,
      nick: nick,
      name: name,
      ts: fs.serverTimestamp ? fs.serverTimestamp() : new Date()
    };
    await fs.addDoc(fs.collection(db, 'groupChat'), msgData);
  } catch(e){ 
    console.warn('Send error:', e.code, e.message);
    if(e.code === 'permission-denied'){
      var el = document.getElementById('chatMessages');
      if(el){
        var notice = document.createElement('div');
        notice.style.cssText = 'text-align:center;padding:10px;color:#dc2626;font-size:12px;background:#fef2f2;border-radius:8px;margin:8px 0';
        notice.textContent = '⚠️ 채팅 권한 오류 - Firebase 규칙 확인 필요 (permission-denied)';
        el.appendChild(notice);
      }
    } else {
      input.value = text; // 실패시 복원
    }
  }
}

function escapeHtml(str){
  if(!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────────
// 실시간 채팅 (Firebase Firestore)
// ─────────────────────────────────────────────