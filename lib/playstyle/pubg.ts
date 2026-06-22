import type { PlaystyleConfig } from "./core";

// 배그 플레이 성향 테스트 — 확정 콘텐츠 (1:1). 공식 에셋 미사용(타이포+이모지).
export const PUBG_CONFIG: PlaystyleConfig = {
  id: "pubg-playstyle",
  path: "/tests/pubg-playstyle",
  testName: "PUBG Playstyle Test",
  gameLabel: "배그",
  titleKo: "배그 플레이 성향 테스트 | 너의 진짜 배그 스타일",
  metaDescription:
    "핫드랍이냐 존버냐, 너의 진짜 배그 스타일. 9문항으로 알아보는 내 플레이 유형 — 배그 플레이 성향 테스트.",
  eyebrowPill: "SURVIVOR TEST",
  introSub: "핫드랍이냐 존버냐, 너의 진짜 배그 스타일.",
  introDesc:
    "핫드랍, 존버, 저격, 로테이션, 파밍, 서포터까지. 9개의 상황 선택으로 너와 가장 닮은 플레이 유형을 찾아드립니다.",
  introTypeLine: "플레이 유형",
  pairLabel: "주무기",
  media: "emoji",
  notice:
    "비공식 팬 콘텐츠입니다. PUBG/배틀그라운드 및 관련 상표권은 크래프톤에 있으며, 본 테스트는 공식 게임 자산을 사용하지 않습니다.",
  tiebreak: ["hotdrop", "sniper", "survivor", "rotator", "looter", "support"],
  ogKicker: "PUBG PLAYSTYLE TEST",
  ogDefault: {
    title: "배그 플레이 성향 테스트",
    sub: "핫드랍이냐 존버냐, 너의 진짜 배그 스타일.",
    line: "핫드랍? 존버? 저격? 아니면 운전기사?",
  },
  ogDescriptionDefault: "핫드랍이냐 존버냐, 너의 진짜 배그 스타일. 9문항으로 알아보는 내 플레이 유형.",
  recommendIds: ["lol-playstyle", "valorant-playstyle", "overwatch-playstyle", "kbti"],
  theme: { accent: "#F2A900", accentInk: "#1a1206" },
  types: {
    hotdrop: {
      ko: "핫드랍 파이터",
      en: "The Hot-Dropper",
      pair: "베릴 M762",
      emoji: "🔫",
      desc: "군사기지·도심 직행. 강하 직후 교전이 곧 너의 낙이다. 초반에 터지거나 캐리하거나 둘 중 하나.",
      tags: ["#스폰킬", "#초반교전", "#에임자신감", "#하이리스크"],
    },
    survivor: {
      ko: "잠수함 생존러",
      en: "The Survivor",
      pair: "부쉬+프라이팬",
      emoji: "🌿",
      desc: "한 발 안 쏘고도 치킨 먹는 게 실력. 포지셔닝과 인내로 끝까지 살아남는다. 막판에 갑자기 등장.",
      tags: ["#포지셔닝", "#무교전치킨", "#자기장러브", "#존버"],
    },
    sniper: {
      ko: "명사수 저격형",
      en: "The Marksman",
      pair: "AWM · Kar98",
      emoji: "🎯",
      desc: "200m 너머가 너의 무대. 한 발의 헤드샷으로 판을 가른다. 가까이 붙으면 약간 당황.",
      tags: ["#장거리각", "#헤드샷", "#스코프장인", "#원샷"],
    },
    rotator: {
      ko: "로테이션 운전기사",
      en: "The Driver",
      pair: "차량(ㅋㅋ)",
      emoji: "🚗",
      desc: "자기장을 읽고 명당을 선점하는 맵 리더. 운전·이동은 늘 네 몫. 싸움보다 자리싸움에 강하다.",
      tags: ["#자기장리딩", "#운전수", "#로테이션", "#맵리딩"],
    },
    looter: {
      ko: "파밍 마스터",
      en: "The Looter",
      pair: "풀파츠 M416",
      emoji: "🎒",
      desc: "풀템·풀파츠를 갖춰야 마음이 놓인다. 준비된 자의 안정적인 운영. 다만 파밍하다 자기장에 쫓기기도.",
      tags: ["#풀템", "#안정러", "#보급장인", "#준비된자"],
    },
    support: {
      ko: "팀 리바이브 서포터",
      en: "The Reviver",
      pair: "연막+구급상자",
      emoji: "🚑",
      desc: "내 킬보다 팀의 생존. 연막 깔고 다운된 팀원을 살려낸다. 보급 셔틀이지만 없으면 스쿼드가 안 굴러간다.",
      tags: ["#리바이브", "#연막엄호", "#팀의어머니", "#보급셔틀"],
    },
  },
  questions: [
    {
      q: "비행기에서 어디로 강하?",
      answers: [
        { label: "핫스팟(군사기지·도심) 직행", types: ["hotdrop"] },
        { label: "외곽 안전지대", types: ["survivor", "looter"] },
        { label: "고지대 저격 포인트", types: ["sniper"] },
        { label: "자기장 중앙 예측해서", types: ["rotator"] },
      ],
    },
    {
      q: "강하 직후 적과 마주쳤다?",
      answers: [
        { label: "바로 교전, 선빵", types: ["hotdrop"] },
        { label: "일단 숨고 상황 본다", types: ["survivor"] },
        { label: "거리 벌리고 조준", types: ["sniper"] },
        { label: "팀 모일 때까지 버틴다", types: ["support"] },
      ],
    },
    {
      q: "가장 자신있는 교전 거리?",
      answers: [
        { label: "근거리 풀파이트", types: ["hotdrop"] },
        { label: "안 싸우는 게 최고", types: ["survivor"] },
        { label: "200m+ 저격", types: ["sniper"] },
        { label: "중거리 안정 교전", types: ["looter"] },
      ],
    },
    {
      q: "자기장이 멀리 잡혔다. 너는?",
      answers: [
        { label: "교전하며 천천히 들어감", types: ["hotdrop"] },
        { label: "일찍 출발해 명당 선점", types: ["rotator", "survivor"] },
        { label: "길목에 자리잡고 저격", types: ["sniper"] },
        { label: "차 구해 팀 태우고 이동", types: ["rotator", "support"] },
      ],
    },
    {
      q: "가장 짜릿한 순간은?",
      answers: [
        { label: "강하 직후 3킬", types: ["hotdrop"] },
        { label: "한 발도 안 쏘고 치킨", types: ["survivor"] },
        { label: "300m 헤드샷", types: ["sniper"] },
        { label: "다운된 팀원 다 살려 이김", types: ["support"] },
      ],
    },
    {
      q: "파밍 스타일은?",
      answers: [
        { label: "총만 먹고 바로 싸움", types: ["hotdrop"] },
        { label: "풀파츠·풀템 다 챙김", types: ["looter"] },
        { label: "스코프·탄약 위주", types: ["sniper"] },
        { label: "팀 보급까지 챙김", types: ["support"] },
      ],
    },
    {
      q: "막판 자기장, 팀원 한 명 다운?",
      answers: [
        { label: "일단 적부터 정리", types: ["hotdrop"] },
        { label: "연막 깔고 리바이브", types: ["support"] },
        { label: "엄폐물 뒤 포지션 유지", types: ["survivor"] },
        { label: "차로 빼내 살림", types: ["rotator", "support"] },
      ],
    },
    {
      q: "솔로 vs 스쿼드, 너의 진가는?",
      answers: [
        { label: "스쿼드, 앞에서 뚫는 역할", types: ["hotdrop"] },
        { label: "솔로, 혼자 존버 치킨", types: ["survivor"] },
        { label: "어디서든 저격 라인", types: ["sniper"] },
        { label: "스쿼드, 팀 살리고 운영", types: ["support"] },
      ],
    },
    {
      q: "친구들이 말하는 너의 배그 스타일은?",
      answers: [
        { label: "강하하자마자 죽거나 캐리거나", types: ["hotdrop"] },
        { label: "숨어있다 막판에 등장", types: ["survivor"] },
        { label: "멀리서 머리만 노림", types: ["sniper"] },
        { label: "맨날 운전·보급 셔틀", types: ["rotator"] },
      ],
    },
  ],
};
