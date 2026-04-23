// ──────────────────────────────────────────────
//  ONCHAIN 2140 홍콩 크루즈 — 참가자 데이터
//  최종 업데이트: 2026-04-24 (24명 전원 반영)
// ──────────────────────────────────────────────

// ── 탑승객 데이터 (탑승권·좌석·크루즈 티켓용) ──
// flight1: 출국편, dep1: 출국 출발, arr1: 출국 도착
// flight2: 귀국편, dep2: 귀국 출발, arr2: 귀국 도착
// seat1: 출국 좌석, seat2: 귀국 좌석
// cabin: 크루즈 캐빈번호, deck: 데크, muster: 집합소
const PAX_DATA = [
  {name:'김경애',  nick:'경애',    phone:'010-5092-1407', resv:'DY8TA4',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'34H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25E', passport:'M22124164', cabin:'9282',  deck:'9',  muster:'B'},
  {name:'김도은',  nick:'도은',    phone:'010-9969-7457', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32A', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26G', passport:'M215M2465', cabin:'10108', deck:'10', muster:'D'},
  {name:'김명순',  nick:'명순',    phone:'010-2940-3558', resv:'HCQ3WH / DY3AU3',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23E', passport:'M56032051', cabin:'10117', deck:'10', muster:'D'},
  {name:'김무성',  nick:'무성',    phone:'010-2086-5435', resv:'DOD8AW',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33A', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25A', passport:'M521J5239', cabin:'10226', deck:'10', muster:'D'},
  {name:'김수영',  nick:'수영',    phone:'010-3622-9644', resv:'HCQ3WH / DY3AU3',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23A', passport:'M810T8840', cabin:'9298',  deck:'9',  muster:'B'},
  {name:'김인자',  nick:'인자',    phone:'010-4723-1982', resv:'HCQ3WH / DY3AU3',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23F', passport:'M799N2517', cabin:'9189',  deck:'9',  muster:'A'},
  {name:'김재담',  nick:'썬킴',    phone:'010-8253-2411', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27E', passport:'M333N1940', cabin:'9196',  deck:'9',  muster:'A'},
  {name:'김채은',  nick:'채은',    phone:'010-3606-1523', resv:'DOD8AW',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25D', passport:'M402L1576', cabin:'8140',  deck:'8',  muster:'C'},
  {name:'박수영',  nick:'유니',    phone:'010-4999-4116', resv:'DNDPVH',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26C', passport:'M501X5561', cabin:'9227',  deck:'9',  muster:'B'},
  {name:'박승범',  nick:'세일러',  phone:'010-7378-2225', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'34K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25H', passport:'M172Z0472', cabin:'9208',  deck:'9',  muster:'B'},
  {name:'박유리',  nick:'유리',    phone:'010-7242-2411', resv:'EW9UK3',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27G', passport:'M133B4626', cabin:'6163',  deck:'6',  muster:'B'},
  {name:'박정이',  nick:'맥가이버',phone:'010-5342-0356', resv:'DMY99T',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26A', passport:'M617T1902', cabin:'9258',  deck:'9',  muster:'B'},
  {name:'박평심',  nick:'평심',    phone:'010-4931-1866', resv:'HCQ3WH / DY3AU3',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23C', passport:'M12117778', cabin:'9190',  deck:'9',  muster:'A'},
  {name:'박혜덕',  nick:'쏘냐',    phone:'010-5249-3115', resv:'AZ837L / ZCKEB7',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27A', passport:'M06607772', cabin:'10225', deck:'10', muster:'D'},
  {name:'서정희',  nick:'크리스탈',phone:'010-2476-2378', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33C', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26F', passport:'M290X5365', cabin:'8117',  deck:'8',  muster:'C'},
  {name:'신경숙',  nick:'경숙',    phone:'010-7794-3045', resv:'ENA57Y',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'34J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'24D', passport:'M071R4644', cabin:'8121',  deck:'8',  muster:'C'},
  {name:'안정원',  nick:'스텔라',  phone:'010-3662-3459', resv:'DMSJPU',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32B', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26D', passport:'M268N9545', cabin:'10225', deck:'10', muster:'D'},
  {name:'우종선',  nick:'JS우',    phone:'010-6323-0952', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'33H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27F', passport:'M610F0888', cabin:'8120',  deck:'8',  muster:'C'},
  {name:'우진희',  nick:'루시',    phone:'010-7387-6114', resv:'DNDPVH',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32C', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'26E', passport:'M016H3305', cabin:'10175', deck:'10', muster:'D'},
  {name:'정금자',  nick:'금자',    phone:'010-5387-8192', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35J', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25F', passport:'M55836905', cabin:'8113',  deck:'8',  muster:'C'},
  {name:'주재순',  nick:'재순',    phone:'010-4166-2747', resv:'HCQ3WH / DY3AU3',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'23D', passport:'M762N6951', cabin:'9155',  deck:'9',  muster:'A'},
  {name:'최경환',  nick:'초이스',  phone:'010-3828-0303', resv:'DNDPVH',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'32H', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27D', passport:'M574F7288', cabin:'9126',  deck:'9',  muster:'A'},
  {name:'최진홍',  nick:'마이콜',  phone:'010-6584-3289', resv:'L9P2MQ / YZQNCZ',   flight1:'YP801', dep1:'인천T1 09:15', arr1:'홍콩 12:00', seat1:'현장배정', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'27C', passport:'M440V3016', cabin:'9258',  deck:'9',  muster:'B'},
  {name:'황중일',  nick:'중일',    phone:'010-5758-8192', resv:'DNVKYT',            flight1:'OZ721', dep1:'인천T2 09:00', arr1:'홍콩 11:40', seat1:'35K', flight2:'OZ746', dep2:'홍콩T1 01:40', arr2:'인천T2 06:20', seat2:'25G', passport:'M33717605', cabin:'9299',  deck:'9',  muster:'B'}
];

// ── 관리자용 명단 데이터 (여권·생년월일·성별·룸 타입) ──
const ADMIN_ID = 'admin1';
const ADMIN_PW = 'admin1234';
let isAdminLoggedIn = false;

const adminData = [
  {no:1,  name:'김경애',  eng:'KIM GYEONGAE',    passport:'M22124164', birth:'1965/04/05', phone:'010-5092-1407', gender:'여', room:'스탠다드'},
  {no:2,  name:'김도은',  eng:'KIM DO EUN',      passport:'M215M2465', birth:'1950/07/27', phone:'010-9969-7457', gender:'여', room:'스탠다드'},
  {no:3,  name:'김명순',  eng:'KIM MYEONGSUN',   passport:'M56032051', birth:'1958/05/02', phone:'010-2940-3558', gender:'여', room:'스탠다드'},
  {no:4,  name:'김무성',  eng:'KIM MUSEONG',     passport:'M521J5239', birth:'2001/11/26', phone:'010-2086-5435', gender:'남', room:'스탠다드'},
  {no:5,  name:'김수영',  eng:'KIM SOO YOUNG',   passport:'M810T8840', birth:'1950/04/01', phone:'010-3622-9644', gender:'여', room:'스탠다드'},
  {no:6,  name:'김인자',  eng:'KIM IN JA',       passport:'M799N2517', birth:'1963/03/15', phone:'010-4723-1982', gender:'여', room:'스탠다드'},
  {no:7,  name:'김재담',  eng:'KIM JAEDAM',      passport:'M333N1940', birth:'1965/12/27', phone:'010-8253-2411', gender:'남', room:'스탠다드'},
  {no:8,  name:'김채은',  eng:'KIM CHEAEUN',     passport:'M402L1576', birth:'1965/12/25', phone:'010-3606-1523', gender:'여', room:'스탠다드'},
  {no:9,  name:'박수영',  eng:'PARK SUYOUNG',    passport:'M501X5561', birth:'1990/11/26', phone:'010-4999-4116', gender:'남', room:'스탠다드'},
  {no:10, name:'박승범',  eng:'PARK SEUNG BEUM', passport:'M172Z0472', birth:'1964/06/30', phone:'010-7378-2225', gender:'남', room:'오션뷰'},
  {no:11, name:'박유리',  eng:'PARK YURI',       passport:'M133B4626', birth:'1969/02/10', phone:'010-7242-2411', gender:'여', room:'스탠다드'},
  {no:12, name:'박정이',  eng:'PARK JUNG YEE',   passport:'M617T1902', birth:'1963/05/12', phone:'010-5342-0356', gender:'남', room:'스탠다드'},
  {no:13, name:'박평심',  eng:'PARK PEANGSIM',   passport:'M12117778', birth:'1963/08/21', phone:'010-4931-1866', gender:'여', room:'스탠다드'},
  {no:14, name:'박혜덕',  eng:'PARK HYEDUCK',    passport:'M06607772', birth:'1963/08/08', phone:'010-5249-3115', gender:'여', room:'스탠다드'},
  {no:15, name:'서정희',  eng:'SEO JUNGHEE',     passport:'M290X5365', birth:'1968/02/10', phone:'010-2476-2378', gender:'여', room:'스탠다드'},
  {no:16, name:'신경숙',  eng:'SIN KYUNGSUK',    passport:'M071R4644', birth:'1959/10/02', phone:'010-7794-3045', gender:'여', room:'스탠다드'},
  {no:17, name:'안정원',  eng:'AN JEONG WON',    passport:'M268N9545', birth:'1965/01/15', phone:'010-3662-3459', gender:'여', room:'베란다'},
  {no:18, name:'우종선',  eng:'WOO JONGSEON',    passport:'M610F0888', birth:'1966/09/28', phone:'010-6323-0952', gender:'남', room:'스탠다드'},
  {no:19, name:'우진희',  eng:'WOO JIN HEE',     passport:'M016H3305', birth:'1968/12/03', phone:'010-7387-6114', gender:'여', room:'베란다'},
  {no:20, name:'정금자',  eng:'JUNG KEUM JA',    passport:'M55836905', birth:'1950/12/11', phone:'010-5387-8192', gender:'여', room:'스탠다드'},
  {no:21, name:'주재순',  eng:'JU JAESUN',       passport:'M762N6951', birth:'1968/07/03', phone:'010-4166-2747', gender:'여', room:'스탠다드'},
  {no:22, name:'최경환',  eng:'CHOI KYUNG HWAN', passport:'M574F7288', birth:'1965/04/28', phone:'010-3828-0303', gender:'남', room:'스탠다드'},
  {no:23, name:'최진홍',  eng:'CHOI JINHONG',    passport:'M440V3016', birth:'1963/01/19', phone:'010-6584-3289', gender:'남', room:'스탠다드'},
  {no:24, name:'황중일',  eng:'HWANG JUNG IL',   passport:'M33717605', birth:'1950/05/09', phone:'010-5758-8192', gender:'남', room:'스탠다드'}
];
