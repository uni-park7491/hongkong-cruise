// =============================================
// data.js - 데이터 (탑승객, 관광지, 관리자)
// =============================================

// ── PAX_DATA ──
const PAX_DATA = [
  {name:'김경애',  nick:'경애',    phone:'010-5092-1407', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'34H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25E'},
  {name:'김도은',  nick:'도은',    phone:'010-9969-7457', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26G'},
  {name:'김명순',  nick:'명순',    phone:'010-2940-3558', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23E'},
  {name:'김무성',  nick:'무성',    phone:'010-2086-5435', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33A', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25A'},
  {name:'김수영',  nick:'수영',    phone:'010-3622-9644', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23A'},
  {name:'김인자',  nick:'인자',    phone:'010-4723-1982', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23F'},
  {name:'김재담',  nick:'썬킴',    phone:'010-8253-2411', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27E'},
  {name:'김채은',  nick:'채은',    phone:'010-3606-1523', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25D'},
  {name:'박수영',  nick:'유니',    phone:'010-4999-4116', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32A', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26C'},
  {name:'박승범',  nick:'세일러',  phone:'010-7378-2225', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'34K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25H'},
  {name:'박유리',  nick:'유리',    phone:'010-7242-2411', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'미정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'미정', passport:'M133B4626', cabin:'6163', deck:'6', muster:'B'},
  {name:'박정이', nick:'맥가이버', phone:'010-5342-0356', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26A'},
  {name:'박평심',  nick:'평심',    phone:'010-4931-1866', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23C'},
  {name:'박혜덕',  nick:'쏘냐',    phone:'010-5249-3115', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27A', passport:'M06607772', cabin:'10225', deck:'10', muster:'D'},
  {name:'서정희',  nick:'크리스탈',phone:'010-2476-2378', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26F'},
  {name:'신경숙',  nick:'경숙',    phone:'010-0000-8121', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'미정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'미정', cabin:'8121', deck:'8', muster:'C'},
  {name:'안정원',  nick:'스텔라',  phone:'010-3662-3459', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32B', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26D'},
  {name:'우종선',  nick:'JS우',    phone:'010-6323-0952', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27F'},
  {name:'우진희',  nick:'루시',    phone:'010-7387-6114', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27D'},
  {name:'정금자',  nick:'금자',    phone:'010-5387-8192', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25F'},
  {name:'주재순',  nick:'재순',    phone:'010-4166-2747', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23D'},
  {name:'최경환',  nick:'초이스',  phone:'010-3828-0303', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27D'},
  {name:'최진홍',  nick:'마이콜',  phone:'010-6584-3289', flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27C', passport:'M440V3016', cabin:'9258', deck:'9', muster:'B'},
  {name:'황중일',  nick:'중일',    phone:'010-5758-8192', flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25G'}
];

// ── adminData ──
const adminData = [
  {no:1,  name:'박정이',  eng:'PARK JUNG YEE',    passport:'M617T1902', cabin:'9258', deck:'9', muster:'B', birth:'1963/05/12', phone:'010-5342-0356', gender:'남', room:'스탠다드'},
  {no:2,  name:'박수영',  eng:'PARK SUYOUNG',     passport:'M501X5561', cabin:'9227', deck:'9', muster:'B', birth:'1990/11/26', phone:'010-4999-4116', gender:'남', room:'스탠다드'},
  {no:3,  name:'최경환',  eng:'CHOI KYUNG HWAN',  passport:'M574F7288', cabin:'9126', deck:'9', muster:'A',  birth:'1965/04/28', phone:'010-3828-0303', gender:'남', room:'스탠다드'},
  {no:4,  name:'우진희',  eng:'WOO JIN HEE',      passport:'M016H3305', cabin:'10175', deck:'10', muster:'D', birth:'1968/12/03', phone:'010-7387-6114', gender:'여', room:'베란다'},
  {no:5,  name:'안정원',  eng:'AN JEONG WON',     passport:'M268N9545', cabin:'10225', deck:'10', muster:'D', birth:'1965/01/15', phone:'010-3662-3459', gender:'여', room:'베란다'},
  {no:6,  name:'김재담',  eng:'KIM JAEDAM',       passport:'M333N1940', cabin:'9196', deck:'9', muster:'A', birth:'1965/12/27', phone:'010-8253-2411', gender:'남', room:'스탠다드'},
  {no:7,  name:'서정희',  eng:'SEO JUNGHEE',      passport:'M290X5365', cabin:'8117', deck:'8', muster:'C', birth:'1968/02/10', phone:'010-2476-2378', gender:'여', room:'스탠다드'},
  {no:8,  name:'김도은',  eng:'KIM DO EUN',       passport:'M215M2465', cabin:'10108', deck:'10', muster:'D', birth:'1950/07/27', phone:'010-9969-7457', gender:'여', room:'스탠다드'},
  {no:9,  name:'우종선',  eng:'WOO JONGSEON',     passport:'M610F0888', cabin:'8120', deck:'8', muster:'C', birth:'1966/09/28', phone:'010-6323-0952', gender:'남', room:'스탠다드'},
  {no:10, name:'박승범',  eng:'PARK SEUNG BEUM',  passport:'M172Z0472', cabin:'9208', deck:'9', muster:'B', birth:'1964/06/30', phone:'010-7378-2225', gender:'남', room:'오션뷰'},
  {no:12, name:'황중일',  eng:'HWANG JUNG IL',    passport:'M33717605', cabin:'9299', deck:'9', muster:'B', birth:'1950/05/09', phone:'010-5758-8192', gender:'남', room:'스탠다드'},
  {no:13, name:'정금자',  eng:'JUNG KEUM JA',     passport:'M55836905', cabin:'8113', deck:'8', muster:'C', birth:'1950/12/11', phone:'010-5387-8192', gender:'여', room:'스탠다드'},
  {no:14, name:'김채은',  eng:'KIM CHEAEUN',      passport:'M402L1576', cabin:'8140', deck:'8', muster:'C', birth:'1965/12/25', phone:'010-3606-1523', gender:'여', room:'스탠다드'},
  {no:15, name:'김무성',  eng:'KIM MUSEONG',      passport:'M521J5239', cabin:'10226', deck:'10', muster:'D', birth:'2001/11/26', phone:'010-2086-5435', gender:'남', room:'스탠다드'},
  {no:17, name:'김인자',  eng:'KIM IN JA',        passport:'M799N2517', cabin:'9189', deck:'9', muster:'A', birth:'1963/03/15', phone:'010-4723-1982', gender:'여', room:'스탠다드'},
  {no:18, name:'김명순',  eng:'KIM MYEONGSUN',    passport:'M56032051', cabin:'10117', deck:'10', muster:'D', birth:'1958/05/02', phone:'010-2940-3558', gender:'여', room:'스탠다드'},
  {no:19, name:'주재순',  eng:'JU JAESUN',        passport:'M762N6951', cabin:'9155', deck:'9', muster:'A', birth:'1968/07/03', phone:'010-4166-2747', gender:'여', room:'스탠다드'},
  {no:20, name:'박평심',  eng:'PARK PEANGSIM',    passport:'M12117778', cabin:'9190', deck:'9', muster:'A', birth:'1963/08/21', phone:'010-4931-1866', gender:'여', room:'스탠다드'},
  {no:21, name:'김수영',  eng:'KIM SOO YOUNG',    passport:'M810T8840', cabin:'9298', deck:'9', muster:'B', birth:'1950/04/01', phone:'010-3622-9644', gender:'여', room:'스탠다드'},
  {no:22, name:'김경애',  eng:'KIM GYEONGAE',     passport:'M22124164', cabin:'9282', deck:'9', muster:'B', birth:'1965/04/05', phone:'010-5092-1407', gender:'여', room:'스탠다드'},
  {no:23, name:'신경숙',  eng:'SIN KYEONGSUK',    passport:'M071R4644',          birth:'1959/10/02', phone:'010-0000-0000', gender:'여', room:'스탠다드'},
  {no:24, name:'최진홍',  eng:'CHOI JINHONG',    passport:'M440V3016', birth:'1963/01/19', phone:'010-6584-3289', gender:'남', room:'스탠다드'},
  {no:25, name:'박혜덕',  eng:'PARK HYEDUCK',   passport:'M06607772', birth:'1963/08/08', phone:'010-5249-3115', gender:'여', room:'스탠다드'},
];

// ── attractions ──
const attractions = [
  {
    rank:1, name:'빅토리아 피크', cat:'전망대 · 야경',
    emoji:'⛰️',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/victoria-peak.jpg',
    desc:'해발 552m 홍콩 최고의 뷰포인트. 피크 트램을 타고 올라가면 빅토리아 하버와 홍콩 스카이라인이 한눈에 펼쳐집니다. 야경이 특히 황홀해요.',
    tip:'💡 일몰 30분 전 방문 추천 · 피크 트램 왕복 HK$99 · 온라인 예약 시 대기 줄 생략 가능',
    addr:'피크 트램 승강장 · Garden Road, Central, Hong Kong',
    map:'https://www.google.com/maps/search/?api=1&query=Victoria+Peak+Hong+Kong'
  },
  {
    rank:2, name:'침사추이 워터프론트', cat:'야경 · 산책',
    emoji:'🌃',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/tsim-sha-tsui.jpg',
    desc:'빅토리아 하버를 따라 펼쳐진 해안 산책로. 홍콩 섬의 화려한 야경을 정면으로 감상할 수 있는 최고의 스팟. 매일 밤 8시 심포니 오브 라이트도 이곳에서!',
    tip:'💡 입장 무료 · 저녁 7시 30분부터 자리 잡는 것 추천 · 스타페리 터미널 바로 옆',
    addr:'Salisbury Road, Tsim Sha Tsui, Kowloon',
    map:'https://www.google.com/maps/search/?api=1&query=Tsim+Sha+Tsui+Waterfront+Hong+Kong'
  },
  {
    rank:3, name:'심포니 오브 라이트', cat:'미디어아트 · 야경',
    emoji:'🌟',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/symphony-of-lights.jpg',
    desc:'기네스북 등재 세계 최대 빛과 소리 공연! 매일 밤 8시 홍콩 섬 고층 빌딩에 LED 조명 쇼가 펼쳐집니다. 침사추이 해안가에서 최고의 뷰로 감상 가능.',
    tip:'💡 매일 저녁 8:00 PM · 완전 무료 · 침사추이 워터프론트 또는 스타페리 갑판에서 관람',
    addr:'Victoria Harbour, Tsim Sha Tsui Waterfront',
    map:'https://www.google.com/maps/search/?api=1&query=Symphony+of+Lights+Hong+Kong'
  },
  {
    rank:4, name:'천단대불 (빅 부다)', cat:'사원 · 불상',
    emoji:'🛕',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/tian-tan-buddha.jpg',
    desc:'란타우 섬에 위치한 높이 34m 세계 최대 청동 불상 중 하나. 옹핑 360 케이블카를 타고 올라가며 보는 풍경도 장관. 포린 사원과 함께 둘러볼 것.',
    tip:'💡 옹핑 케이블카 왕복 HK$215 · 반나절 소요 · 긴 계단(268개) 있으니 편한 신발 필수',
    addr:'Ngong Ping, Lantau Island, Hong Kong',
    map:'https://www.google.com/maps/search/?api=1&query=Tian+Tan+Buddha+Lantau+Hong+Kong'
  },
  {
    rank:5, name:'옹핑 360 케이블카', cat:'액티비티 · 자연',
    emoji:'🚡',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/ngong-ping-cable.jpg',
    desc:'란타우 섬을 가로지르는 5.7km 길이의 케이블카. 유리 바닥 크리스탈 캐빈을 타면 발아래 펼쳐지는 절경이 스릴 만점! 천단대불로 가는 필수 코스.',
    tip:'💡 크리스탈 캐빈 HK$280 · 일반 캐빈 HK$215 · 고소공포증 없다면 크리스탈 강추!',
    addr:'Tung Chung Cable Car Terminal, Lantau Island',
    map:'https://www.google.com/maps/search/?api=1&query=Ngong+Ping+360+Cable+Car+Hong+Kong'
  },
  {
    rank:6, name:'템플스트리트 야시장', cat:'야시장 · 쇼핑',
    emoji:'🏮',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/temple-street.jpg',
    desc:'홍콩 최대의 야시장. 저녁 5시부터 자정까지 기념품, 의류, 전자제품, 길거리 음식이 가득한 활기찬 거리. 점쟁이와 칸토니즈 오페라 공연도 볼 수 있어요.',
    tip:'💡 무료 입장 · 저녁 7시 이후 가장 활기 · 가격 흥정 문화! 처음 부르는 값의 60~70% 제시',
    addr:'Temple Street, Yau Ma Tei, Kowloon',
    map:'https://www.google.com/maps/search/?api=1&query=Temple+Street+Night+Market+Hong+Kong'
  },
  {
    rank:7, name:'익청빌딩 (몬스터빌딩)', cat:'포토스팟 · 도시',
    emoji:'🏢',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/yick-cheong.jpg',
    desc:'트랜스포머 촬영지로 유명한 독특한 아파트 단지. 5개 동이 맞닿은 중정에서 올려다보면 현실인 듯 가상인 듯 압도적인 뷰가 나옵니다. 홍콩 필수 포토스팟!',
    tip:'💡 24시간 입장 가능 (실제 주거지이므로 소음 주의) · 쿼리베이(Quarry Bay) MTR역 도보 5분',
    addr:'Yik Cheong Building, 1060 Kings Road, Quarry Bay',
    map:'https://www.google.com/maps/search/?api=1&query=Yick+Cheong+Building+Hong+Kong'
  },
  {
    rank:8, name:'스타페리', cat:'교통 · 관광',
    emoji:'⛴️',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/star-ferry.jpg',
    desc:'1880년부터 운항한 홍콩의 상징적인 페리. 센트럴↔침사추이 구간 약 10분 항해 중 빅토리아 하버를 가로지르며 홍콩 스카이라인을 볼 수 있습니다.',
    tip:'💡 편도 HK$3.4 (센트럴→침사추이) · 야경 볼 때 페리 위에서 보는 뷰가 최고! · 에어컨 있는 상층 추천',
    addr:'Star Ferry Pier, Edinburgh Place, Central',
    map:'https://www.google.com/maps/search/?api=1&query=Star+Ferry+Hong+Kong'
  },
  {
    rank:9, name:'란콰이퐁 & 소호', cat:'나이트라이프 · 미식',
    emoji:'🍻',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/lan-kwai-fong.jpg',
    desc:'홍콩 최고의 나이트라이프 지구. 자갈길 미로에 레스토랑, 바, 나이트클럽이 즐비. 다국적 음식과 홍콩식 밀크티를 함께 즐길 수 있는 세련된 동네.',
    tip:'💡 저녁 9시 이후 활기 최고 · 소호 미드레벨 에스컬레이터(영화 중경삼림 배경)와 함께 방문 추천',
    addr:'Lan Kwai Fong, Central, Hong Kong Island',
    map:'https://www.google.com/maps/search/?api=1&query=Lan+Kwai+Fong+Hong+Kong'
  },
  {
    rank:10, name:'몽콕 & 레이디스 마켓', cat:'쇼핑 · 거리',
    emoji:'🛍️',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/mong-kok.jpg',
    desc:'세계에서 인구밀도가 가장 높은 지역 중 하나. 레이디스 마켓, 꽃 시장, 새 시장, 옥시장이 모여 있어 홍콩 로컬 문화를 가장 생생하게 느낄 수 있는 곳.',
    tip:'💡 MTR 몽콕역 하차 · 레이디스 마켓(야동가) 오후 12시~자정 · 홍콩 옥토퍼스 카드로 편리하게 이동',
    addr:'Mong Kok, Kowloon, Hong Kong',
    map:'https://www.google.com/maps/search/?api=1&query=Ladies+Market+Mong+Kok+Hong+Kong'
  },
  {
    rank:11, name:'홍콩 디즈니랜드', cat:'테마파크 · 엔터테인먼트',
    emoji:'🏰',
    desc:'2005년 개장, 아시아 최대 규모의 마블 콘텐츠 보유. 겨울왕국 테마 "월드 오브 프로즌" 전 세계 최초 오픈. 아이언맨·앤트맨·토이스토리·판타지랜드 등 8개 테마존. MTR 써니베이역에서 디즈니 리조트 라인 환승.',
    tip:'오픈런 필수. 파크 안쪽 토이스토리 랜드부터 시작하면 대기 시간 절약. 공식 앱 다운로드 필수.',
    addr:'Lantau Island, Hong Kong',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/disneyland.jpg',
    map:'https://www.google.com/maps/search/?api=1&query=Hong+Kong+Disneyland'
  },
  {
    rank:12, name:'오션파크', cat:'테마파크 · 해양',
    emoji:'🎡',
    desc:'홍콩 남부 해안 위치. 스릴 넘치는 롤러코스터와 해양생물 전시관이 공존하는 복합 테마파크. 판다관·젤리피시 하우스·케이블카 등 볼거리 풍부. 홍콩섬과 바다 전망이 아름다움.',
    tip:'케이블카를 꼭 타야 전체 뷰를 즐길 수 있어요. 평일 방문 시 대기 시간 단축 가능.',
    addr:'1 Ocean Park Rd, Wong Chuk Hang, Hong Kong',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/ocean-park.webp',
    map:'https://www.google.com/maps/search/?api=1&query=Ocean+Park+Hong+Kong'
  },
  {
    rank:13, name:'센트럴 미드레벨 에스컬레이터', cat:'거리 · 문화',
    emoji:'🚶',
    desc:'세계에서 가장 긴 실외 에스컬레이터(총 800m). 영화 "중경삼림" 배경지. 주변으로 카페·바·레스토랑 즐비. 오전에는 아래→위, 오전 10시 이후 위→아래로 방향 전환.',
    tip:'소호(SoHo) 구역과 연결. 맛집·카페 탐방하며 천천히 걸어 올라가는 코스 추천.',
    addr:'Central, Hong Kong Island',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/mid-levels-escalator.jpg',
    map:'https://www.google.com/maps/search/?api=1&query=Central-Mid-Levels+escalator+Hong+Kong'
  },
  {
    rank:14, name:'스카이100 전망대', cat:'전망대 · 실내',
    emoji:'🏙️',
    desc:'홍콩 국제상업센터(ICC) 100층 위치. 지상 393m 홍콩 최고층 실내 전망대. 360도 파노라마 뷰로 빅토리아 하버와 홍콩 스카이라인 한눈에 조망. 날씨가 흐려도 야경은 훌륭.',
    tip:'온라인 사전 예매 시 할인. 일몰 전후 방문 시 낮과 밤 두 가지 풍경 모두 감상 가능.',
    addr:'100/F, International Commerce Centre, 1 Austin Rd W, West Kowloon',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/sky100.jpg',
    map:'https://www.google.com/maps/search/?api=1&query=Sky100+Hong+Kong+Observatory'
  },
  {
    rank:15, name:'리펄스베이 & 틴하우 사원', cat:'해변 · 문화',
    emoji:'🏖️',
    desc:'홍콩섬 남부의 아름다운 초승달 모양 해변. 인근 틴하우 사원에는 거대한 관음상과 행운의 다리가 있어 현지인들도 즐겨 찾는 명소. 홍콩의 여유로운 면을 느낄 수 있는 곳.',
    tip:'버스 6·6A·260번으로 접근 가능. 주말에는 현지인들로 붐비므로 평일 방문 추천.',
    addr:'Repulse Bay, Southern District, Hong Kong Island',
    img:'https://uni-park7491.github.io/hongkong-cruise/images/repulse-bay.jpg',
    map:'https://www.google.com/maps/search/?api=1&query=Repulse+Bay+Hong+Kong'
  },
];

// ── ADMIN_ID ──
const ADMIN_ID = 'admin1';

// ── ADMIN_PW ──
const ADMIN_PW = 'admin1234';

// ── SCHEDULE_DATES ──
const SCHEDULE_DATES = {
  'APR 24': new Date(2026, 3, 24),  // 월은 0부터
  'APR 25': new Date(2026, 3, 25),
  'APR 26': new Date(2026, 3, 26),
  'APR 27': new Date(2026, 3, 27),
  'APR 28': new Date(2026, 3, 28),
};

