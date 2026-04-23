// ─────────────────────────────────────────────
// location.js — 실시간 위치 공유
// 반드시 app.js 이후에 로드되어야 함
// ─────────────────────────────────────────────

let _locWatchId = null;
let _locUnsubscribe = null;

// 위치 공유 패널 초기화
function initLocationPanel() {
  if (!window._db || !window._fs) {
    window.addEventListener('fbready', initLocationPanel, { once: true });
    return;
  }
  renderLocationCards();
  subscribeLocations();
}

// 내 위치 공유 시작/중지
function toggleMyLocation() {
  const btn = document.getElementById('locToggleBtn');
  if (_locWatchId !== null) {
    navigator.geolocation.clearWatch(_locWatchId);
    _locWatchId = null;
    if (btn) { btn.textContent = '📍 위치 공유 시작'; btn.style.background = 'linear-gradient(135deg,#1e5fd4,#0e8a7c)'; }
    updateLocationStatus('위치 공유 중지됨');
    return;
  }
  if (!navigator.geolocation) {
    alert('이 기기에서 위치 서비스를 지원하지 않습니다.');
    return;
  }
  if (btn) { btn.textContent = '⏹ 위치 공유 중지'; btn.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)'; }
  updateLocationStatus('위치 확인 중...');

  _locWatchId = navigator.geolocation.watchPosition(
    function(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy);
      saveMyLocation(lat, lng, acc);
      updateLocationStatus('공유 중 · 정확도 ±' + acc + 'm');
    },
    function(err) {
      const msgs = { 1: '위치 권한이 거부됐습니다. 설정에서 허용해주세요.', 2: '위치 신호를 찾을 수 없습니다.', 3: '위치 확인 시간 초과.' };
      updateLocationStatus(msgs[err.code] || '위치 오류');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}

// Firebase에 위치 저장
async function saveMyLocation(lat, lng, acc) {
  if (!appUser || !window._db || !window._fs) return;
  try {
    const fs = window._fs;
    const db = window._db;
    await fs.setDoc(fs.doc(db, 'locations', appUser.nick), {
      nick: appUser.nick,
      name: appUser.name,
      lat: lat,
      lng: lng,
      acc: acc,
      ts: fs.serverTimestamp()
    });
  } catch (e) { console.warn('위치 저장 실패:', e); }
}

// 실시간 위치 수신
function subscribeLocations() {
  if (!window._db || !window._fs) return;
  if (_locUnsubscribe) _locUnsubscribe();
  try {
    const fs = window._fs;
    const db = window._db;
    const colRef = fs.collection(db, 'locations');
    _locUnsubscribe = fs.onSnapshot(colRef, function(snap) {
      const locs = {};
      snap.docs.forEach(function(d) { locs[d.id] = d.data(); });
      renderLocationCards(locs);
    });
  } catch (e) { console.warn('위치 구독 실패:', e); }
}

// 위치 카드 렌더링
function renderLocationCards(locs) {
  const container = document.getElementById('locationCards');
  if (!container) return;
  if (!locs || Object.keys(locs).length === 0) {
    container.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:13px;padding:20px 0">아직 위치를 공유한 멤버가 없어요</div>';
    return;
  }
  const myNick = appUser ? appUser.nick : '';
  container.innerHTML = Object.values(locs).sort(function(a, b) {
    return a.nick === myNick ? -1 : b.nick === myNick ? 1 : 0;
  }).map(function(loc) {
    const isMe = loc.nick === myNick;
    const timeStr = loc.ts ? (loc.ts.toDate ? loc.ts.toDate().toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) : '') : '';
    const mapUrl = 'https://maps.google.com/?q=' + loc.lat + ',' + loc.lng;
    return '<div style="background:' + (isMe ? 'linear-gradient(135deg,#1e5fd4,#0e8a7c)' : '#f8faff') + ';border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">'
      + '<div><div style="font-size:13px;font-weight:800;color:' + (isMe ? '#fff' : '#0f2044') + '">' + (isMe ? '📍 나 (' : '👤 ') + loc.nick + (isMe ? ')' : '') + '</div>'
      + '<div style="font-size:11px;color:' + (isMe ? 'rgba(255,255,255,.7)' : '#64748b') + ';margin-top:2px">±' + (loc.acc || '?') + 'm · ' + timeStr + '</div></div>'
      + '<a href="' + mapUrl + '" target="_blank" style="background:' + (isMe ? 'rgba(255,255,255,.2)' : '#1e5fd4') + ';color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;text-decoration:none">지도보기</a>'
      + '</div>';
  }).join('');
}

function updateLocationStatus(msg) {
  const el = document.getElementById('locStatus');
  if (el) el.textContent = msg;
}

// 위치 공유 탭 렌더링
function renderLocationTab(content) {
  if (!content) return;
  content.innerHTML = '<div style="padding:0">'
    + '<div style="padding:14px 16px;background:#fff;border-bottom:1px solid #e2e8f0">'
    + '<div style="font-size:15px;font-weight:900;color:#0f2044;margin-bottom:2px">📍 실시간 위치 공유</div>'
    + '<div style="font-size:11px;color:#64748b">멤버들의 현재 위치를 확인하세요</div>'
    + '</div>'
    + '<div style="padding:14px 16px">'
    + '<button id="locToggleBtn" onclick="toggleMyLocation()" style="width:100%;background:linear-gradient(135deg,#1e5fd4,#0e8a7c);color:#fff;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px">📍 위치 공유 시작</button>'
    + '<div id="locStatus" style="text-align:center;font-size:11px;color:#94a3b8;margin-bottom:14px"></div>'
    + '<div id="locationCards"></div>'
    + '</div></div>';
  initLocationPanel();
}
