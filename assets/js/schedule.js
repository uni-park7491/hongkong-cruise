// =============================================
// schedule.js - 일정, D-Day, 세계시계
// =============================================


function highlightTodaySchedule(){
  const today = new Date();
  today.setHours(0,0,0,0);

  // 메인 일정과 대시보드 복사본 둘 다 처리
  ['schedule','myScheduleClone'].forEach(id => {
    const section = document.getElementById(id);
    if(!section) return;
    section.querySelectorAll('.day-card').forEach(card => {
      const dtEl = card.querySelector('.dt');
      if(!dtEl) return;
      const dtText = dtEl.textContent.trim(); // ex) "APR 24 · FRI"
      const key = dtText.split('·')[0].trim(); // "APR 24"
      const cardDate = SCHEDULE_DATES[key];
      if(!cardDate) return;

      const head = card.querySelector('.day-head');
      if(!head) return;

      // 초기화
      head.style.background = '';
      head.style.outline = '';
      card.style.outline = '';
      card.style.boxShadow = '';
      dtEl.style.color = '';

      if(cardDate.getTime() === today.getTime()){
        // 오늘 → 노란색 #ffca22
        head.style.background = 'linear-gradient(135deg,#d4a017,#ffca22)';
        head.style.color = '#1a1a00';
        card.style.outline = '2.5px solid #ffca22';
        card.style.boxShadow = '0 0 0 4px rgba(255,202,34,.2)';
        dtEl.style.color = 'rgba(0,0,0,.6)';
        // 오늘 뱃지 추가
        if(!head.querySelector('.today-badge')){
          const badge = document.createElement('span');
          badge.className = 'today-badge';
          badge.style.cssText = 'background:#1a1a00;color:#ffca22;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;margin-left:8px;letter-spacing:.05em';
          badge.textContent = 'TODAY';
          head.querySelector('.ttl').appendChild(badge);
        }
      } else if(cardDate < today){
        // 지난 날 → 회색
        head.style.background = 'linear-gradient(135deg,#7a8a9a,#9aa8b8)';
        card.style.opacity = '0.7';
        dtEl.style.color = 'rgba(255,255,255,.5)';
      } else {
        // 미래 → 원래 스타일 (navy)
        card.style.opacity = '1';
      }
    });
  });
}

function scheduleNextDayUpdate(){
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate()+1);
  midnight.setHours(0,0,1,0);
  const msUntilMidnight = midnight - now;
  setTimeout(()=>{ highlightTodaySchedule(); scheduleNextDayUpdate(); }, msUntilMidnight);
}

function updateDDay(){
  const target = new Date('2026-04-24T09:00:00+09:00');
  const now = new Date();
  const diff = target - now;
  const el = document.getElementById('ddayVal');
  if(!el) return;
  if(diff <= 0){
    // 여행 중 또는 종료
    const end = new Date('2026-04-28T06:20:00+09:00');
    if(now < end){
      el.textContent = '✈️ 여행 중!';
      el.style.color = '#f0cc6a';
    } else {
      el.textContent = '귀국 완료 🎉';
    }
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);
  if(days > 0){
    el.textContent = `D-${days}`;
  } else {
    el.textContent = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    el.style.color = '#f0cc6a';
    el.style.fontFamily = 'Space Mono, monospace';
    el.style.fontSize = '14px';
  }
}

function updateAppDday(){
  const el = document.getElementById('appDday');
  const sub = document.getElementById('appDdaySub');
  if(!el) return;
  const target = new Date('2026-04-24T09:00:00+09:00');
  const now = new Date();
  const diff = target - now;
  if(diff <= 0){
    const end = new Date('2026-04-28T06:20:00+09:00');
    if(now < end){
      el.textContent = '✈️ 여행 중!';
      if(sub) sub.textContent = '홍콩 크루즈 연수 진행 중';
    } else {
      el.textContent = '🎉 완료!';
      if(sub) sub.textContent = '홍콩 크루즈 연수 종료';
    }
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if(days > 0){
    el.textContent = `D-${days}`;
    if(sub) sub.textContent = `${hours}시간 ${mins}분 후 출발`;
  } else {
    el.textContent = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    if(sub) sub.textContent = '출발이 임박했어요! 🔥';
  }
}

function updateWorldClock(){
  const now = new Date();
  // 홍콩 UTC+8
  const hkTime = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Hong_Kong'}));
  const krTime = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Seoul'}));
  const fmt = d => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  const hkEl = document.getElementById('clockHK');
  const krEl = document.getElementById('clockKR');
  if(hkEl) hkEl.textContent = fmt(hkTime);
  if(krEl) krEl.textContent = fmt(krTime);
}

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
