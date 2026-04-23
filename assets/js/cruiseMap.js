// ─────────────────────────────────────────────
// cruiseMap.js — 크루즈 항구 지도
// 반드시 app.js 이후에 로드되어야 함
// ─────────────────────────────────────────────

function renderCruiseMap(content) {
  if (!content) return;

  // 카이탁 부두 좌표
  const lat = 22.3068, lng = 114.2121;
  const googleMapUrl = 'https://maps.google.com/?q=' + lat + ',' + lng + '&z=16';
  const naverMapUrl = 'https://map.naver.com/v5/?lng=' + lng + '&lat=' + lat + '&type=0';

  content.innerHTML = '<div style="padding:0">'
    + '<div style="padding:14px 16px;background:#fff;border-bottom:1px solid #e2e8f0">'
    + '<div style="font-size:15px;font-weight:900;color:#0f2044;margin-bottom:2px">🗺 크루즈 항구 지도</div>'
    + '<div style="font-size:11px;color:#64748b">홍콩 카이탁 부두 위치</div>'
    + '</div>'
    + '<div style="padding:14px 16px">'

    // 구글 지도 임베드
    + '<div style="border-radius:14px;overflow:hidden;margin-bottom:14px;box-shadow:0 4px 16px rgba(0,0,0,.12)">'
    + '<iframe width="100%" height="260" frameborder="0" style="border:0;display:block" loading="lazy" allowfullscreen '
    + 'src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d' + lng + '!3d' + lat + '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE4JzI0LjUiTiAxMTTCsDEyJzQzLjYiRQ!5e0!3m2!1sko!2skr!4v1000000000000"></iframe>'
    + '</div>'

    // 주소 정보
    + '<div style="background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:12px">'
    + '<div style="font-size:12px;font-weight:800;color:#0f2044;margin-bottom:8px">⚓ 카이탁 크루즈 터미널</div>'
    + '<div style="font-size:12px;color:#374151;line-height:1.9">'
    + '启德邮轮码头 (Kai Tak Cruise Terminal)<br>'
    + '33 Shing Fung Road, Kai Tak, Kowloon<br>'
    + '홍콩 구룡 카이탁 승봉도 33번지'
    + '</div></div>'

    // 지도 앱 열기 버튼
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + '<a href="' + googleMapUrl + '" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#1e5fd4;color:#fff;border-radius:10px;padding:12px;text-decoration:none;font-size:13px;font-weight:700">🗺 구글 지도</a>'
    + '<a href="' + naverMapUrl + '" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#03c75a;color:#fff;border-radius:10px;padding:12px;text-decoration:none;font-size:13px;font-weight:700">🗺 네이버 지도</a>'
    + '</div>'
    + '</div></div>';
}
