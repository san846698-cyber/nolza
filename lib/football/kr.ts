import {
  FB_POSITIONS,
  FB_QUESTIONS,
  FB_STYLES,
  FB_STYLE_TIE,
  type FbPlayer,
  type FootballTestConfig,
} from "./engine";

// 한국 축구선수 성향 테스트 — 5포지션 × 5스타일 = 25명 (전원 국가대표). 모두 🇰🇷.
// 가장 사랑받는 선수(손흥민·박지성 등)는 가장 빛나는 축에 배치 = "당첨 결과"로 공유 유발.
const PLAYERS: Record<string, FbPlayer> = {
  // ── GK 골키퍼 ──
  kimbyungji: { key: "kimbyungji", name: "김병지", pos: "gk", style: "A", flag: "kr", jersey: "1", desc: "필드를 누비던 적극적인 골키퍼의 상징. 과감한 전진과 빌드업으로 골문 밖까지 지배한 한국 GK의 개척자.", tags: ["#적극적", "#전진수비", "#빌드업", "#개척자"] },
  leewoonjae: { key: "leewoonjae", name: "이운재", pos: "gk", style: "B", flag: "kr", jersey: "1", desc: "'독수리'. 오랜 세월 골문을 지킨 안정의 대명사. 큰 무대에서도 흔들림 없던 정통파 수문장.", tags: ["#독수리", "#안정감", "#롱런", "#정통파"] },
  chohyunwoo: { key: "chohyunwoo", name: "조현우", pos: "gk", style: "C", flag: "kr", jersey: "21", desc: "2018 독일전 선방쇼의 주인공. 큰 경기일수록 미친 반사신경으로 폭발하는 빅매치 키퍼.", tags: ["#선방쇼", "#빅매치", "#반사신경", "#각성"] },
  kimjinhyeon: { key: "kimjinhyeon", name: "김진현", pos: "gk", style: "D", flag: "kr", jersey: "23", desc: "뛰어난 반사신경과 발기술을 겸비한 모던 키퍼. 위치 선정과 빌드업까지 영리하게 막아낸다.", tags: ["#모던키퍼", "#반사신경", "#발기술", "#영리함"] },
  kimseunggyu: { key: "kimseunggyu", name: "김승규", pos: "gk", style: "E", flag: "kr", jersey: "19", desc: "묵묵히 자리를 지켜온 헌신의 수문장. 주전과 백업을 오가며 팀을 위해 모든 걸 내준 일꾼.", tags: ["#헌신", "#묵묵함", "#팀우선", "#프로"] },

  // ── CB 중앙 수비수 ──
  kimminjae: { key: "kimminjae", name: "김민재", pos: "cb", style: "A", flag: "kr", jersey: "3", desc: "'괴물'. 전진 수비와 압도적 피지컬로 상대를 짓누르는 월드클래스 센터백. 수비가 곧 공격이다.", tags: ["#괴물수비수", "#피지컬", "#전진수비", "#월드클래스"] },
  kimyounggwon: { key: "kimyounggwon", name: "김영권", pos: "cb", style: "B", flag: "kr", jersey: "19", desc: "오랜 세월 대표팀 뒷문을 지킨 안정의 베테랑. 화려함보다 꾸준함으로 증명한 정통파.", tags: ["#베테랑", "#안정감", "#꾸준함", "#뒷문지킴이"] },
  hongmyungbo: { key: "hongmyungbo", name: "홍명보", pos: "cb", style: "C", flag: "kr", jersey: "20", desc: "2002 4강 신화의 주장. 큰 경기에서 더 빛난 리베로, 한국 수비의 레전드.", tags: ["#2002주장", "#리베로", "#빅매치", "#레전드"] },
  kimjooseong: { key: "kimjooseong", name: "김주성", pos: "cb", style: "D", flag: "kr", jersey: "5", desc: "'야생마'. 수비부터 공격까지 다 해낸 기술적 만능 수비수. 시대를 앞서간 창의적 플레이어.", tags: ["#야생마", "#만능", "#기술", "#창의적"] },
  kwaktaehwi: { key: "kwaktaehwi", name: "곽태휘", pos: "cb", style: "E", flag: "kr", jersey: "4", desc: "몸을 사리지 않는 헌신의 수비수. 궂은일과 제공권을 도맡으며 묵묵히 뒷문을 지킨 일꾼.", tags: ["#헌신", "#제공권", "#몸싸움", "#묵묵함"] },

  // ── FB 측면 수비수 ──
  seolyoungwoo: { key: "seolyoungwoo", name: "설영우", pos: "fb", style: "A", flag: "kr", jersey: "2", desc: "지칠 줄 모르는 공격적 풀백. 오버래핑과 침투로 측면을 지배하는 차세대 윙백.", tags: ["#공격적풀백", "#오버래핑", "#활동량", "#차세대"] },
  kimjinsu: { key: "kimjinsu", name: "김진수", pos: "fb", style: "B", flag: "kr", jersey: "13", desc: "오랜 주전 좌측 수비수. 안정적인 수비와 정확한 크로스로 측면 균형을 잡는 정통파 풀백.", tags: ["#주전풀백", "#안정감", "#크로스", "#균형"] },
  parkjuho: { key: "parkjuho", name: "박주호", pos: "fb", style: "C", flag: "kr", jersey: "22", desc: "여러 포지션을 소화한 멀티 플레이어. 큰 무대 경험으로 위기에서 빛난 영리한 클러치 자원.", tags: ["#멀티", "#빅매치경험", "#영리함", "#클러치"] },
  leeyoungpyo: { key: "leeyoungpyo", name: "이영표", pos: "fb", style: "D", flag: "kr", jersey: "12", desc: "'헛다리 페인팅'의 원조. 세계가 인정한 기술적 풀백, 영리한 수비의 교과서.", tags: ["#헛다리", "#기술풀백", "#월드클래스", "#영리함"] },
  kimtaehwan: { key: "kimtaehwan", name: "김태환", pos: "fb", style: "E", flag: "kr", jersey: "23", desc: "쉴 새 없이 측면을 오르내리는 활동량의 화신. 팀을 위해 90분 내내 뛰는 헌신의 일꾼.", tags: ["#활동량", "#헌신", "#에너지", "#풀타임"] },

  // ── MF 미드필더 ──
  hwanginbeom: { key: "hwanginbeom", name: "황인범", pos: "mf", style: "A", flag: "kr", jersey: "6", desc: "전진과 탈압박으로 경기를 주도하는 대표팀의 엔진. 공격적으로 중원을 휘젓는 사령탑.", tags: ["#중원사령탑", "#탈압박", "#주도적", "#엔진"] },
  kiseongyung: { key: "kiseongyung", name: "기성용", pos: "mf", style: "B", flag: "kr", jersey: "16", desc: "오랜 캡틴, 딥라잉 플레이메이커의 표본. 한 박자 빠른 패스로 경기를 조립한 정통파.", tags: ["#캡틴", "#딥라잉", "#패스마스터", "#조립"] },
  gujacheol: { key: "gujacheol", name: "구자철", pos: "mf", style: "C", flag: "kr", jersey: "13", desc: "아시안컵 득점왕 출신, 큰 경기에서 골을 넣는 미드필더. 무대가 클수록 강했다.", tags: ["#득점왕", "#빅매치골", "#공격형MF", "#클러치"] },
  leekangin: { key: "leekangin", name: "이강인", pos: "mf", style: "D", flag: "kr", jersey: "18", desc: "왼발의 마법사. 창의적인 패스와 탈압박, 환상적인 발재간으로 경기를 디자인하는 테크니션.", tags: ["#왼발마법", "#창의패스", "#발재간", "#테크니션"] },
  parkjisung: { key: "parkjisung", name: "박지성", pos: "mf", style: "E", flag: "kr", jersey: "7", desc: "'두 개의 심장'. 90분 내내 멈추지 않는 활동량으로 팀을 위해 모든 걸 내준 헌신의 아이콘.", tags: ["#두개의심장", "#활동량", "#헌신", "#아이콘"] },

  // ── FW 공격수 ──
  son: { key: "son", name: "손흥민", pos: "fw", style: "A", flag: "kr", jersey: "7", desc: "월드클래스 그 자체. 양발 슈팅과 폭발적인 마무리로 경기를 끝내는 대한민국의 캡틴. '손흥민 존'에서 그는 무적이다.", tags: ["#월드클래스", "#양발슈팅", "#캡틴", "#해결사"] },
  chabumkun: { key: "chabumkun", name: "차범근", pos: "fw", style: "B", flag: "kr", jersey: "11", desc: "'차붐'. 분데스리가를 호령한 한국 축구의 전설. 시대를 초월한 정통파 골잡이.", tags: ["#차붐", "#분데스전설", "#레전드", "#정통파"] },
  jokyuseong: { key: "jokyuseong", name: "조규성", pos: "fw", style: "C", flag: "kr", jersey: "9", desc: "카타르 월드컵에서 헤더 2골을 터뜨린 타깃맨. 큰 경기에서 증명한 클러치 스트라이커.", tags: ["#월드컵2골", "#타깃맨", "#제공권", "#클러치"] },
  parkjuyoung: { key: "parkjuyoung", name: "박주영", pos: "fw", style: "D", flag: "kr", jersey: "10", desc: "감각적인 마무리와 프리킥의 예술가. 영리한 움직임과 기술로 기회를 만드는 창의적 공격수.", tags: ["#프리킥", "#감각적", "#기술", "#창의적"] },
  hwangheechan: { key: "hwangheechan", name: "황희찬", pos: "fw", style: "E", flag: "kr", jersey: "11", desc: "'늑대'. 쉼 없는 압박과 침투로 최전방에서 수비까지 하는 헌신의 공격수.", tags: ["#늑대", "#압박", "#침투", "#헌신"] },
};

export const FOOTBALL_KR_CONFIG: FootballTestConfig = {
  id: "football-kr",
  path: "/tests/football-kr",
  testName: "Korean Football Player Test",
  eyebrowPill: "K-FOOTBALL TEST",
  accent: "#E23B3B",
  accentInk: "#2a0707",
  titleKo: "나랑 닮은 한국 축구선수는? | 포지션별 성향 테스트",
  metaDescription:
    "월드컵 시즌, 나랑 닮은 한국 축구선수는 누구? 포지션 고르고 5문항만 답하면 손흥민·김민재·이강인 등 국가대표 25인 중 한 명을 찾아드립니다.",
  introTitleTop: "나랑 닮은 한국 축구선수는?",
  introSub: "월드컵 시즌, 그라운드 위 너의 분신을 찾아라.",
  introDesc:
    "주 포지션을 고르고 5문항만 답하면, 너의 플레이 성향과 똑 닮은 한국 국가대표 선수를 찾아드립니다. 포지션별 5명, 총 25명 중 한 명.",
  positions: FB_POSITIONS,
  styles: FB_STYLES,
  styleTie: FB_STYLE_TIE,
  grid: {
    gk: { A: "kimbyungji", B: "leewoonjae", C: "chohyunwoo", D: "kimjinhyeon", E: "kimseunggyu" },
    cb: { A: "kimminjae", B: "kimyounggwon", C: "hongmyungbo", D: "kimjooseong", E: "kwaktaehwi" },
    fb: { A: "seolyoungwoo", B: "kimjinsu", C: "parkjuho", D: "leeyoungpyo", E: "kimtaehwan" },
    mf: { A: "hwanginbeom", B: "kiseongyung", C: "gujacheol", D: "leekangin", E: "parkjisung" },
    fw: { A: "son", B: "chabumkun", C: "jokyuseong", D: "parkjuyoung", E: "hwangheechan" },
  },
  players: PLAYERS,
  questions: FB_QUESTIONS,
  notice:
    "비공식 팬 콘텐츠로 만든 재미용 테스트이며, 언급된 선수·구단·협회와 무관합니다. 선수명·등번호·국기는 정보 제공 목적으로만 사용되었고, 어떤 보증·후원 관계도 없습니다.",
  recommendIds: ["football-global", "lol-playstyle", "lck-pro", "kbti"],
  statsEndpoint: "/api/football-stats/football-kr",
  ogKicker: "한국 축구선수 테스트",
  ogDefault: {
    title: "나랑 닮은 한국 축구선수는?",
    sub: "월드컵 시즌, 그라운드 위 너의 분신을 찾아라.",
    line: "손흥민? 김민재? 아니면 이강인?",
  },
  ogDescriptionDefault:
    "월드컵 시즌, 나랑 닮은 한국 축구선수는? 포지션별 국가대표 25인 중 너의 분신을 찾아라.",
  ogMotif: "🇰🇷",
  ogTheme: { bg: "linear-gradient(135deg, #2a0608 0%, #7e1518 58%, #5a0f12 100%)", accent: "#FFE08A" },
};
