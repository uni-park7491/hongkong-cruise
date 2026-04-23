// =============================================
// cruiseMap.js - 구랑위호 인터랙티브 배 지도
// =============================================

const CRUISE_DECKS = {
  'TOP': {
    label: '최상층 · 선데크',
    rooms: [
      { id:'pool',    x:60,  y:40, w:220, h:90, label:'수영장 & 선베드',     cat:'레저', desc:'야외 수영장. 갑판 선베드에서 바다 전망을 즐길 수 있어요. 선크림 필수!', tags:['야외','무료'] },
      { id:'kidpool', x:295, y:40, w:110, h:90, label:'어린이 풀',           cat:'레저', desc:'얕은 어린이 전용 수영 공간. 안전 요원 상주.',                         tags:['야외'] },
      { id:'sport',   x:420, y:40, w:200, h:90, label:'스포츠 코트',         cat:'레저', desc:'배드민턴·탁구·농구 등 갑판 스포츠 시설. 무료 이용.',                    tags:['야외','무료'] }
    ]
  },
  '13F': {
    label: '13층 · 행사장',
    rooms: [
      { id:'conf',    x:50,  y:45, w:260, h:90, label:'다기능 회의실',       cat:'행사', desc:'루시팀 참가증 수령 장소 (APR 24 · 19:00~22:00). 소규모 워크샵 공간.', tags:['참가증 수령','팀 필수'] },
      { id:'gym',     x:330, y:45, w:145, h:90, label:'피트니스 센터',       cat:'레저', desc:'러닝머신, 자전거, 웨이트 기구. 운동화 착용 필수.',                       tags:['유료'] },
      { id:'spa',     x:490, y:45, w:145, h:90, label:'스파 & 사우나',       cat:'레저', desc:'마사지, 스파 트리트먼트 예약 운영.',                                   tags:['유료'] }
    ]
  },
  '12F': {
    label: '12층 · 공연·식음',
    rooms: [
      { id:'theater', x:50,  y:35, w:240, h:110, label:'성해극장 (메인홀)',   cat:'행사', desc:'개막 회의 & 전체 세션 장소. 좌석 600석+. APR 25 10:00 개막 — 전원 참석 필수!', tags:['APR25 개막','전원참석'] },
      { id:'hall2',   x:305, y:35, w:160, h:110, label:'금도연예홀',         cat:'행사', desc:'APR 25 개막 회의 분회장. 소그룹 세션 공간.',                           tags:['APR25 행사'] },
      { id:'party',   x:480, y:35, w:155, h:110, label:'중갑판 파티존',      cat:'식음', desc:'APR 24 21:45 웰컴 파티 & 출항 파티 장소. 칵테일바 운영.',             tags:['APR24 파티'] }
    ]
  },
  '10F': {
    label: '10층 · 객실 D구역',
    rooms: [
      { id:'r10175',  x:40,  y:55, w:90, h:70, label:'10175 우진희(루시)',    cat:'객실D', desc:'우진희(루시) 베란다 객실. 집합소 D.',   tags:['베란다','집합소 D'] },
      { id:'r10225',  x:145, y:55, w:90, h:70, label:'10225 안정원·박혜덕',   cat:'객실D', desc:'안정원(스텔라) & 박혜덕(쏘냐). 집합소 D.', tags:['베란다','집합소 D'] },
      { id:'r10108',  x:250, y:55, w:90, h:70, label:'10108 김도은',         cat:'객실D', desc:'김도은(도은). 집합소 D.',             tags:['집합소 D'] },
      { id:'r10117',  x:355, y:55, w:90, h:70, label:'10117 김명순',         cat:'객실D', desc:'김명순(명순). 집합소 D.',             tags:['집합소 D'] },
      { id:'r10226',  x:460, y:55, w:90, h:70, label:'10226 김무성',         cat:'객실D', desc:'김무성(무성). 집합소 D.',             tags:['집합소 D'] },
      { id:'mstD',    x:565, y:35, w:75, h:110,'label':'집합소 D',           cat:'안전',  desc:'10층 구역 비상 집합 지점. 구명조끼 착용 후 집합.', tags:['비상시'] }
    ]
  },
  '9F': {
    label: '9층 · 객실 A·B구역',
    rooms: [
      { id:'r9126',   x:30,  y:25, w:80, h:60, label:'9126 최경환',          cat:'객실A', desc:'최경환(초이스). 집합소 A.',            tags:['집합소 A'] },
      { id:'r9155',   x:120, y:25, w:80, h:60, label:'9155 주재순',          cat:'객실A', desc:'주재순(재순). 집합소 A.',             tags:['집합소 A'] },
      { id:'r9189',   x:210, y:25, w:80, h:60, label:'9189 김인자',          cat:'객실A', desc:'김인자(인자). 집합소 A.',             tags:['집합소 A'] },
      { id:'r9190',   x:300, y:25, w:80, h:60, label:'9190 박평심',          cat:'객실A', desc:'박평심(평심). 집합소 A.',             tags:['집합소 A'] },
      { id:'r9196',   x:390, y:25, w:80, h:60, label:'9196 김재담',          cat:'객실A', desc:'김재담(썬킴). 집합소 A.',             tags:['집합소 A'] },
      { id:'mstA',    x:480, y:15, w:75, h:80, label:'집합소 A',             cat:'안전',  desc:'9층 앞쪽 비상 집합 지점.',            tags:['비상시'] },
      { id:'r9227',   x:30,  y:135,w:80, h:60, label:'9227 박수영',          cat:'객실B', desc:'박수영(유니). 집합소 B.',             tags:['집합소 B'] },
      { id:'r9258',   x:120, y:135,w:80, h:60, label:'9258 박정이·최진홍',    cat:'객실B', desc:'박정이(맥가이버) & 최진홍(마이콜). 집합소 B.', tags:['집합소 B'] },
      { id:'r9282',   x:210, y:135,w:80, h:60, label:'9282 김경애',          cat:'객실B', desc:'김경애(경애). 집합소 B.',             tags:['집합소 B'] },
      { id:'r9208',   x:300, y:135,w:80, h:60, label:'9208 박승범',          cat:'객실B', desc:'박승범(세일러) 오션뷰 객실. 집합소 B.', tags:['오션뷰','집합소 B'] },
      { id:'r9298',   x:390, y:135,w:80, h:60, label:'9298 김수영',          cat:'객실B', desc:'김수영(수영). 집합소 B.',             tags:['집합소 B'] },
      { id:'r9299',   x:480, y:135,w:80, h:60, label:'9299 황중일',          cat:'객실B', desc:'황중일(중일). 집합소 B.',             tags:['집합소 B'] },
      { id:'mstB',    x:570, y:125,w:75, h:80, label:'집합소 B',             cat:'안전',  desc:'9층 뒤쪽 비상 집합 지점.',            tags:['비상시'] }
    ]
  },
  '8F': {
    label: '8층 · 객실 C구역',
    rooms: [
      { id:'r8113',   x:50,  y:55, w:90, h:70, label:'8113 정금자',          cat:'객실C', desc:'정금자(금자). 집합소 C.',             tags:['집합소 C'] },
      { id:'r8117',   x:155, y:55, w:90, h:70, label:'8117 서정희',          cat:'객실C', desc:'서정희(크리스탈). 집합소 C.',          tags:['집합소 C'] },
      { id:'r8120',   x:260, y:55, w:90, h:70, label:'8120 우종선',          cat:'객실C', desc:'우종선(JS우). 집합소 C.',             tags:['집합소 C'] },
      { id:'r8121',   x:365, y:55, w:90, h:70, label:'8121 신경숙',          cat:'객실C', desc:'신경숙(경숙). 집합소 C.',             tags:['집합소 C'] },
      { id:'r8140',   x:470, y:55, w:90, h:70, label:'8140 김채은',          cat:'객실C', desc:'김채은(채은). 집합소 C.',             tags:['집합소 C'] },
      { id:'mstC',    x:573, y:35, w:75, h:110,label:'집합소 C',             cat:'안전',  desc:'8층 구역 비상 집합 지점.',            tags:['비상시'] }
    ]
  },
  '6F': {
    label: '6층 · 레스토랑',
    rooms: [
      { id:'r6163',   x:45,  y:50, w:90, h:80, label:'6163 박유리',          cat:'객실B', desc:'박유리(유리) 6층 특수 객실. 집합소 B.', tags:['집합소 B'] },
      { id:'buffet',  x:155, y:50, w:200, h:80, label:'메인 뷔페',            cat:'식음',  desc:'조식·중식·석식 무료 제공. 식사 시간 외 출입 제한.',                   tags:['무료','3식'] },
      { id:'special', x:368, y:50, w:155, h:80, label:'스페셜티 레스토랑',    cat:'식음',  desc:'일식·중식·양식 전문 레스토랑. 예약 필요, 별도 요금.',                  tags:['유료'] },
      { id:'bar6',    x:535, y:50, w:110, h:80, label:'라운지 바',           cat:'식음',  desc:'칵테일, 맥주, 소프트드링크. 알코올 유료.',                            tags:['유료'] }
    ]
  }
};

const _CM_FILL = {
  '레저':'#B5D4F4','행사':'#9FE1CB','식음':'#FAC775',
  '객실D':'#CECBF6','객실A':'#F4C0D1','객실B':'#C0DD97','객실C':'#F5C4B3','안전':'#F7C1C1'
};
const _CM_STROKE = {
  '레저':'#185FA5','행사':'#0F6E56','식음':'#BA7517',
  '객실D':'#534AB7','객실A':'#993556','객실B':'#3B6D11','객실C':'#D85A30','안전':'#A32D2D'
};

let _cmDeck = 'TOP';

/* ── 모달 열기 ── */
function openCruiseMap() {
  let modal = document.getElementById('cruiseMapModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cruiseMapModal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,.55);
      display:flex;align-items:center;justify-content:center;
      padding:16px;
    `;
    modal.innerHTML = `
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-lg);
                  width:100%;max-width:680px;max-height:90vh;overflow-y:auto;padding:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-size:16px;font-weight:500;color:var(--color-text-primary)">구랑위호 배치도</div>
            <div style="font-size:12px;color:var(--color-text-secondary)">구역을 탭하면 상세 정보가 나와요</div>
          </div>
          <button onclick="closeCruiseMap()" style="width:32px;height:32px;border-radius:50%;border:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary);cursor:pointer;font-size:16px;line-height:32px;text-align:center;color:var(--color-text-secondary)">×</button>
        </div>
        <div id="cmTabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px"></div>
        <div style="border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);overflow:hidden;background:var(--color-background-secondary)">
          <svg id="cmSvg" viewBox="0 0 660 220" style="width:100%;display:block"></svg>
        </div>
        <div id="cmInfo" style="margin-top:12px;padding:14px;border-radius:var(--border-radius-md);
                                 border:0.5px solid var(--color-border-secondary);
                                 background:var(--color-background-primary);min-height:70px">
          <div style="font-size:13px;color:var(--color-text-secondary)">구역을 탭하면 정보가 표시돼요</div>
        </div>
        <div id="cmLegend" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px"></div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) closeCruiseMap(); });
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  _cmRenderTabs();
  _cmRenderSvg();
}

function closeCruiseMap() {
  const m = document.getElementById('cruiseMapModal');
  if (m) m.style.display = 'none';
}

function _cmSetDeck(k) {
  _cmDeck = k;
  _cmRenderTabs();
  _cmRenderSvg();
  document.getElementById('cmInfo').innerHTML =
    '<div style="font-size:13px;color:var(--color-text-secondary)">구역을 탭하면 정보가 표시돼요</div>';
}

function _cmRenderTabs() {
  const el = document.getElementById('cmTabs');
  if (!el) return;
  el.innerHTML = Object.keys(CRUISE_DECKS).map(k => {
    const active = k === _cmDeck;
    return `<button onclick="_cmSetDeck('${k}')"
      style="padding:5px 13px;border-radius:16px;font-size:12px;cursor:pointer;border:0.5px solid ${active?'#185FA5':'var(--color-border-secondary)'};
             background:${active?'#185FA5':'var(--color-background-primary)'};
             color:${active?'#fff':'var(--color-text-secondary)'};transition:all .15s">
      ${CRUISE_DECKS[k].label}
    </button>`;
  }).join('');
}

function _cmRenderSvg() {
  const svg = document.getElementById('cmSvg');
  if (!svg) return;
  const deck = CRUISE_DECKS[_cmDeck];

  // 데크 높이에 따라 viewBox 조절
  const maxY = deck.rooms.reduce((m,r) => Math.max(m, r.y + r.h), 0) + 20;
  svg.setAttribute('viewBox', `0 0 660 ${Math.max(maxY, 150)}`);

  let html = `<rect x="5" y="5" width="650" height="${Math.max(maxY,150)-10}" rx="35" fill="none" stroke="var(--color-border-secondary)" stroke-width="0.8"/>`;

  deck.rooms.forEach(r => {
    const fc = _CM_FILL[r.cat]  || '#eee';
    const sc = _CM_STROKE[r.cat]|| '#999';
    const lines = r.label.length > 9 ? [r.label.substring(0,9), r.label.substring(9)] : [r.label];
    const midY  = r.y + r.h / 2;
    const textY = lines.length > 1 ? midY - 7 : midY - 4;

    html += `<g style="cursor:pointer" onclick="cmShowInfo('${r.id}')">
      <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="5"
            fill="${fc}" stroke="${sc}" stroke-width="0.8"
            onmouseover="this.style.opacity='.8'" onmouseout="this.style.opacity='1'"/>
      <text x="${r.x+r.w/2}" y="${textY+10}" text-anchor="middle"
            font-size="10" font-weight="500" fill="${sc}">${lines[0]}</text>`;
    if (lines[1]) {
      html += `<text x="${r.x+r.w/2}" y="${textY+22}" text-anchor="middle"
               font-size="10" font-weight="500" fill="${sc}">${lines[1]}</text>`;
    }
    html += `<text x="${r.x+r.w/2}" y="${r.y+r.h-7}" text-anchor="middle"
             font-size="9" fill="${sc}" opacity=".75">${r.cat}</text>
    </g>`;
  });

  svg.innerHTML = html;

  // 범례
  const cats = [...new Set(deck.rooms.map(r => r.cat))];
  const leg = document.getElementById('cmLegend');
  if (leg) {
    leg.innerHTML = cats.map(c =>
      `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-text-secondary)">
        <div style="width:10px;height:10px;border-radius:2px;background:${_CM_FILL[c]||'#eee'};border:0.5px solid ${_CM_STROKE[c]||'#999'}"></div>${c}
      </div>`
    ).join('');
  }
}

/* ── 구역 클릭 정보 표시 ── */
window.cmShowInfo = function(id) {
  const deck  = CRUISE_DECKS[_cmDeck];
  const room  = deck.rooms.find(r => r.id === id);
  if (!room) return;
  const sc = _CM_STROKE[room.cat] || '#185FA5';
  const fc = _CM_FILL[room.cat]   || '#E6F1FB';
  document.getElementById('cmInfo').innerHTML = `
    <div style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin-bottom:4px">${room.label}</div>
    <div style="font-size:13px;color:var(--color-text-secondary);line-height:1.6">${room.desc}</div>
    <div style="margin-top:8px">${room.tags.map(t =>
      `<span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:10px;margin-right:5px;background:${fc};color:${sc}">${t}</span>`
    ).join('')}</div>
  `;
};

/* ── 전역 노출 ── */
window.openCruiseMap  = openCruiseMap;
window.closeCruiseMap = closeCruiseMap;
window._cmSetDeck     = _cmSetDeck;
