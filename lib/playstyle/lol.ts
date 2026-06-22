import type { PlaystyleConfig } from "./core";

// 롤 플레이 성향 테스트 — 확정 콘텐츠 (1:1). 라이엇 챔피언 아트 self-host.
export const LOL_CONFIG: PlaystyleConfig = {
  id: "lol-playstyle",
  path: "/tests/lol-playstyle",
  testName: "LoL Playstyle Test",
  gameLabel: "롤",
  titleKo: "롤 플레이 성향 테스트 | 티어로는 안 보이는 너의 진짜 롤 스타일",
  metaDescription:
    "티어로는 안 보이는 너의 진짜 롤 스타일. 9문항으로 캐리형·운영형·트롤형까지 알아보는 롤 플레이 성향 테스트입니다.",
  eyebrowPill: "SUMMONER TEST",
  introSub: "티어로는 안 보이는 너의 진짜 롤 스타일.",
  introDesc:
    "캐리형, 운영형, 탱커형, 암살자형, 서포터형, 트롤형까지. 9개의 상황 선택으로 너와 가장 닮은 챔피언과 플레이 성향을 찾아드립니다.",
  introTypeLine: "게임 성향",
  pairLabel: "닮은 챔피언",
  media: "art",
  artBase: "/images/tests/lol/art",
  artExt: "jpg",
  notice:
    '이 콘텐츠는 Riot Games의 "Legal Jibber Jabber" 정책에 따라 Riot Games가 소유한 자산을 사용해 제작되었습니다. Riot Games는 본 프로젝트를 보증하거나 후원하지 않습니다. 챔피언 이미지 © Riot Games.',
  tiebreak: ["carry", "assassin", "strat", "tank", "support", "chaos"],
  ogKicker: "LOL PLAYSTYLE TEST",
  ogDefault: {
    title: "롤 플레이 성향 테스트",
    sub: "티어로는 안 보이는 너의 진짜 롤 스타일.",
    line: "너는 캐리형? 운영형? 아니면 트롤형?",
  },
  ogDescriptionDefault: "티어로는 안 보이는 너의 진짜 롤 스타일. 너는 캐리형? 운영형? 아니면 트롤형?",
  recommendIds: ["valorant-playstyle", "overwatch-playstyle", "pubg-playstyle", "kbti"],
  theme: { accent: "#C8AA6E", accentInk: "#1c1505" },
  types: {
    carry: {
      ko: "하드 캐리형",
      en: "The Hard Carry",
      pair: "야스오",
      img: "Yasuo",
      desc: "승패는 곧 너의 손끝에 달렸다. 1인분으로는 만족 못 하고, 결국 네가 게임을 끝내야 직성이 풀린다. 잘 풀리면 그 누구보다 무섭지만, 욕심이 과하면 혼자 던지는 것도 너다.",
      tags: ["#공격성_만렙", "#1v9_가능", "#하이리스크_하이리턴", "#내가_곧_게임"],
    },
    strat: {
      ko: "두뇌 운영형",
      en: "The Strategist",
      pair: "아지르",
      img: "Azir",
      desc: "한타보다 운영. 시야, 오브젝트, 라인 관리로 게임을 천천히 조여간다. 화려하진 않아도 이기는 그림을 그릴 줄 안다. 다만 가끔 팀원이 네 큰 그림을 못 따라온다.",
      tags: ["#오브젝트_장인", "#시야_집착", "#큰그림", "#침착함"],
    },
    tank: {
      ko: "든든한 탱커형",
      en: "The Guardian",
      pair: "오른",
      img: "Ornn",
      desc: "가장 앞에서 몸을 던진다. 팀을 지키고, 이니시를 열고, 궂은일을 도맡는다. 스포트라이트는 딜러가 받아도, 그 판을 받친 건 너라는 걸 팀은 안다(가끔 모르지만).",
      tags: ["#앞라인_담당", "#이니시에이터", "#팀의_방패", "#묵묵함"],
    },
    assassin: {
      ko: "침묵의 암살자형",
      en: "The Assassin",
      pair: "제드",
      img: "Zed",
      desc: "보이지 않게 들어와 핵심을 끊어먹는다. 한 번의 각으로 한타를 터뜨리는 짜릿함이 너의 연료. 스노우볼은 최고지만, 각이 안 나오면 그림자처럼 조용해진다.",
      tags: ["#끊어먹기", "#스노우볼", "#한방의_미학", "#기습"],
    },
    support: {
      ko: "헌신의 서포터형",
      en: "The Supporter",
      pair: "쓰레쉬",
      img: "Thresh",
      desc: "내 점수보다 팀의 승리. 와드를 박고, 궁으로 살리고, 묵묵히 케어한다. 화려한 KDA는 없어도 너 없으면 팀이 안 굴러간다. 진짜 잘하는 사람만 아는 포지션의 주인공.",
      tags: ["#팀_케어", "#보이지않는_핵심", "#이타적", "#멘탈_지킴이"],
    },
    chaos: {
      ko: "즐겜 트롤형",
      en: "The Chaos",
      pair: "티모",
      img: "Teemo",
      desc: "승패? 재미가 먼저지. 의외의 픽, 예측불가 플레이로 변수를 만든다. 상대를 빡치게 하는 데 특화. 같은 팀이면 든든하고, 적이면 제일 짜증나는 그 사람이 바로 너다.",
      tags: ["#즐겜_장인", "#변수_창출", "#예측불가", "#상대_도발"],
    },
  },
  questions: [
    {
      q: "게임 시작! 로딩 화면에서 가장 먼저 드는 생각은?",
      answers: [
        { label: "이번 판 내가 캐리한다", types: ["carry"] },
        { label: "라인 구도랑 정글 동선부터 계산", types: ["strat"] },
        { label: "우리 팀 안 터지게 잘 받쳐야지", types: ["tank", "support"] },
        { label: "아무튼 재밌게 하면 됐지ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "라인전에서 너의 기본 스타일은?",
      answers: [
        { label: "솔킬 노리고 계속 압박한다", types: ["carry", "assassin"] },
        { label: "CS 안 놓치고 침착하게 파밍", types: ["strat"] },
        { label: "로밍이나 갱 호응 위주로", types: ["support", "tank"] },
        { label: "상대 도발하고 멘탈 흔들기", types: ["chaos"] },
      ],
    },
    {
      q: "한타가 터지기 직전, 너의 위치는?",
      answers: [
        { label: "맨 앞, 내가 먼저 진입한다", types: ["tank"] },
        { label: "측면에서 각 보다가 암살", types: ["assassin"] },
        { label: "뒤에서 안전하게 딜 욱여넣기", types: ["carry"] },
        { label: "아군 옆에서 보호막/힐 대기", types: ["support"] },
      ],
    },
    {
      q: "팀원들이 계속 죽고 있다. 너의 선택은?",
      answers: [
        { label: "내가 더 잘하면 됨, 캐리각 본다", types: ["carry"] },
        { label: "오브젝트로 시선 돌려 운영으로 푼다", types: ["strat"] },
        { label: "다이브 막으러 합류한다", types: ["tank", "support"] },
        { label: "ㅋㅋ 어쩔 수 없지, 그냥 즐긴다", types: ["chaos"] },
      ],
    },
    {
      q: "가장 짜릿한 순간을 하나 고른다면?",
      answers: [
        { label: "1v3 상황에서 역으로 따낼 때", types: ["carry"] },
        { label: "완벽한 이니시로 한타 터뜨릴 때", types: ["tank"] },
        { label: "안 보이게 파고들어 적 원딜 짤라먹을 때", types: ["assassin"] },
        { label: "내 궁 하나로 팀을 다 살렸을 때", types: ["support"] },
      ],
    },
    {
      q: "챔피언 고를 때 가장 중요한 기준은?",
      answers: [
        { label: "캐리력. 하드캐리 가능한 챔프", types: ["carry", "assassin"] },
        { label: "운영. 시야/한타에 좋은 챔프", types: ["strat"] },
        { label: "팀 기여. 도움 되는 챔프", types: ["support", "tank"] },
        { label: "그냥 내가 재밌는 챔프", types: ["chaos"] },
      ],
    },
    {
      q: "와드와 시야에 대한 너의 진심은?",
      answers: [
        { label: "꼼꼼히 박는다. 시야가 곧 승리", types: ["strat", "support"] },
        { label: "한타각 보이는 핵심 부쉬만", types: ["tank"] },
        { label: "바빠서… 서폿이 박겠지", types: ["carry", "chaos"] },
        { label: "내가 다 박는다, 그게 내 역할", types: ["support"] },
      ],
    },
    {
      q: "패배가 거의 확정된 분위기. 마지막 너의 자세는?",
      answers: [
        { label: "끝까지 캐리각 노린다", types: ["carry"] },
        { label: "복기용으로 끝까지 집중", types: ["strat"] },
        { label: "GG 치고 깔끔하게 인정", types: ["tank", "support"] },
        { label: "마지막까지 변수 만들어보기ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "친구들이 말하는 '너의 플레이'는?",
      answers: [
        { label: "혼자 캐리하려다 자주 짐", types: ["carry"] },
        { label: "은근 똑똑하게 잘함", types: ["strat"] },
        { label: "각 나오면 바로 끊어먹는 놈", types: ["assassin"] },
        { label: "맨날 서폿 시켜도 군말 없는 애", types: ["support"] },
      ],
    },
  ],
};
