// =============================================
// location.js - GPS 위치 공유 & 팀원 지도
// =============================================

const GMAPS_KEY = 'AIzaSyAR7MhosoVMQjTaDhxA9nq_Iz0OAqv7sCI';
let _locMap       = null;
let _locMarkers   = {};
let _locInterval  = null;
let _locSharing   = false;
let _locUnsub     = null;
let _gmapsLoaded  = false;

/* ── Google Maps 스크립트 동적 로드 ── */
function _loadGMaps(cb) {
  if (_gmapsLoaded || (window.google && window.google.maps)) {
    _gmapsLoaded = true; cb(); return;
  }
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&language=ko`;
  s.async = true;
  s.onload = () => { _gmapsLoaded = true; cb(); };
  s.onerror = () => { console.warn('Google Maps 로드 실패 — 지도 기능 비활성화'); };
  document.head.appendChild(s);
}

/* ── 위치 패널 초기화 (홈탭 진입 시 호출) ── */
function initLocationPanel() {
  const el = document.getElementById('locMapCanvas');
  if (!el) return;
  _loadGMaps(() => {
    if (_locMap) return;
    _locMap = new google.maps.Map(el, {
      center: { lat: 22.3193, lng: 114.1694 },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [{ featureType:'poi', stylers:[{visibility:'off'}] }]
    });
    _subscribeLocations();
  });
}

/* ── 내 위치 공유 토글 (버튼 onclick) ── */
function toggleMyLocation() {
  if (!window._currentUser) {
    alert('로그인 후 이용하세요.'); return;
  }
  _locSharing ? _stopSharing() : _startSharing();
}

function _startSharing() {
  if (!navigator.geolocation) {
    alert('이 브라우저는 위치 공유를 지원하지 않아요.'); return;
  }
  const opts = { enableHighAccuracy: true, timeout: 10000 };
  navigator.geolocation.getCurrentPosition(pos => {
    _saveLocation(pos.coords.latitude, pos.coords.longitude);
    _locSharing = true;
    _updateLocBtn();
    _locInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        p => _saveLocation(p.coords.latitude, p.coords.longitude),
        null, opts
      );
    }, 60000);
  }, () => {
    alert('위치 권한이 필요해요.\n브라우저 설정에서 위치 허용 후 다시 눌러주세요.');
  }, opts);
}

function _stopSharing() {
  if (_locInterval) { clearInterval(_locInterval); _locInterval = null; }
  const u = window._currentUser;
  if (u && window._db && window._fs) {
    const db = window._db;
    const { doc, deleteDoc } = window._fs;
    if (doc && deleteDoc) deleteDoc(doc(db, 'locations', u.name)).catch(() => {});
  }
  _locSharing = false;
  _updateLocBtn();
}

function _saveLocation(lat, lng) {
  const u = window._currentUser;
  if (!u) return;
  const fs = window._fs;
  const db = window._db || (fs && fs.db);
  if (!fs || !db) return;
  try {
    const { doc, setDoc, serverTimestamp } = fs;
    if (doc && setDoc) {
      setDoc(doc(db, 'locations', u.name), {
        name: u.name, nick: u.nick || u.name,
        lat, lng, updatedAt: serverTimestamp ? serverTimestamp() : new Date()
      });
    } else if (fs.addDoc && fs.collection) {
      fs.addDoc(fs.collection(db, 'locations'), {
        name: u.name, nick: u.nick || u.name, lat, lng
      });
    }
  } catch(e) { console.warn('위치 저장 오류:', e); }
}

/* ── Firestore 실시간 구독 ── */
function _subscribeLocations() {
  const fs = window._fs;
  const db = window._db || (fs && fs.db);
  if (!fs || !db) {
    // Firebase 아직 미준비 → fbready 이후 재시도
    window.addEventListener('fbready', _subscribeLocations, { once: true });
    return;
  }
  const { collection, onSnapshot } = fs;
  if (!collection || !onSnapshot) return;
  if (_locUnsub) _locUnsub();
  try {
    _locUnsub = onSnapshot(collection(db, 'locations'), snap => {
      const members = [];
      snap.forEach(d => members.push(d.data()));
      _renderMarkers(members);
      _renderList(members);
    }, () => {});
  } catch(e) { console.warn('위치 구독 오류:', e); }
}

/* ── 지도 마커 렌더링 ── */
function _renderMarkers(members) {
  if (!_locMap || !window.google) return;
  Object.values(_locMarkers).forEach(m => m.setMap(null));
  _locMarkers = {};
  if (members.length === 0) return;

  const bounds = new google.maps.LatLngBounds();
  members.forEach(m => {
    const pos = { lat: m.lat, lng: m.lng };
    bounds.extend(pos);
    const marker = new google.maps.Marker({
      position: pos, map: _locMap,
      title: `${m.nick}(${m.name})`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 20,
        fillColor: m.name === window._currentUser?.name ? '#dc2626' : '#185FA5',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2.5
      },
      label: { text: (m.nick||m.name).charAt(0), color:'#fff', fontSize:'12px', fontWeight:'500' }
    });
    const info = new google.maps.InfoWindow({
      content: `<div style="font-size:13px;padding:4px 2px;font-family:sans-serif">
        <b>${m.name}</b> <span style="color:#666">(${m.nick})</span>
      </div>`
    });
    marker.addListener('click', () => info.open(_locMap, marker));
    _locMarkers[m.name] = marker;
  });

  _locMap.fitBounds(bounds);
  if (members.length === 1) _locMap.setZoom(14);
}

/* ── 위치 공유 멤버 목록 렌더링 ── */
function _renderList(members) {
  const el = document.getElementById('locMemberList');
  if (!el) return;
  const myName = window._currentUser?.name;
  if (members.length === 0) {
    el.innerHTML = `<div style="color:var(--color-text-secondary);font-size:13px;text-align:center;padding:10px 0">위치를 공유한 팀원이 아직 없어요</div>`;
    return;
  }
  el.innerHTML = members.map(m => {
    const isMe = m.name === myName;
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
      <div style="width:32px;height:32px;border-radius:50%;background:${isMe?'#dc2626':'#185FA5'};display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:500;flex-shrink:0">${(m.nick||m.name).charAt(0)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:500;color:var(--color-text-primary)">${m.name} <span style="color:var(--color-text-secondary);font-weight:400">(${m.nick})</span>${isMe?'<span style="font-size:10px;background:#fee2e2;color:#dc2626;padding:1px 6px;border-radius:8px;margin-left:6px">나</span>':''}</div>
        <div style="font-size:11px;color:var(--color-text-secondary)">위치 공유 중</div>
      </div>
      <button onclick="locFocus('${m.name}')" style="font-size:11px;padding:4px 10px;border-radius:10px;border:0.5px solid var(--color-border-secondary);background:var(--color-background-primary);cursor:pointer;color:var(--color-text-secondary);flex-shrink:0">보기</button>
    </div>`;
  }).join('');
}

/* ── 특정 팀원 지도 포커스 ── */
window.locFocus = function(name) {
  const mk = _locMarkers[name];
  if (mk && _locMap) {
    _locMap.setCenter(mk.getPosition());
    _locMap.setZoom(15);
    google.maps.event.trigger(mk, 'click');
  }
};

/* ── 버튼 상태 업데이트 ── */
function _updateLocBtn() {
  const btn = document.getElementById('locShareBtn');
  if (!btn) return;
  if (_locSharing) {
    btn.textContent = '공유 중지';
    btn.style.cssText = 'background:#dc2626;color:#fff;border-color:#dc2626;font-size:12px;padding:5px 12px;border-radius:12px;border:none;cursor:pointer';
  } else {
    btn.textContent = '내 위치 공유';
    btn.style.cssText = 'background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px;padding:5px 12px;border-radius:12px;border:0.5px solid var(--color-border-secondary);cursor:pointer';
  }
}

/* ── 전역 노출 ── */
window.initLocationPanel = initLocationPanel;
window.toggleMyLocation  = toggleMyLocation;

/* ── 언로드 시 위치 삭제 ── */
window.addEventListener('beforeunload', () => {
  if (_locSharing) _stopSharing();
  if (_locUnsub)   _locUnsub();
});
