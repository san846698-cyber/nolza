import type { PlaystyleConfig } from "./core";

// 오버워치 플레이 성향 테스트 — 확정 콘텐츠 (1:1).
// 기본값: 공식 영웅 아트 미사용. 영웅명은 텍스트, 결과는 역할 색상 + 역할 아이콘 + 타이포.
export const OVERWATCH_CONFIG: PlaystyleConfig = {
  id: "overwatch-playstyle",
  path: "/tests/overwatch-playstyle",
  testName: "Overwatch Playstyle Test",
  gameLabel: "오버워치",
  titleKo: "오버워치 플레이 성향 테스트 | 너의 진짜 옵치 스타일",
  metaDescription:
    "탱·딜·힐, 너의 진짜 옵치 스타일. 9문항으로 알아보는 내 영웅 유형 — 오버워치 플레이 성향 테스트.",
  eyebrowPill: "HERO TEST",
  introSub: "탱·딜·힐, 너의 진짜 옵치 스타일.",
  introDesc:
    "메인탱, 캐리, 히트스캔, 메인힐, 플렉스, 변수형까지. 9개의 상황 선택으로 너와 가장 닮은 영웅 유형을 찾아드립니다.",
  introTypeLine: "영웅 유형",
  pairLabel: "닮은 영웅",
  media: "role",
  notice:
    "비공식 팬 콘텐츠입니다. Overwatch 및 영웅 이름의 상표권은 Blizzard Entertainment에 있으며, 본 테스트는 공식 게임 자산을 사용하지 않습니다.",
  tiebreak: ["carry", "hitscan", "maintank", "mainheal", "flex", "chaos"],
  roleColors: { 탱: "#4a9eff", 딜: "#ff6b5e", 힐: "#7bd17b" },
  roleEmoji: { 탱: "🛡️", 딜: "⚔️", 힐: "✨" },
  ogKicker: "OVERWATCH PLAYSTYLE TEST",
  ogDefault: {
    title: "오버워치 플레이 성향 테스트",
    sub: "탱·딜·힐, 너의 진짜 옵치 스타일.",
    line: "탱? 딜? 힐? 아니면 변수형?",
  },
  ogDescriptionDefault: "탱·딜·힐, 너의 진짜 옵치 스타일. 9문항으로 알아보는 내 영웅 유형.",
  recommendIds: ["lol-playstyle", "valorant-playstyle", "pubg-playstyle", "kbti"],
  theme: { accent: "#F99E1A", accentInk: "#161003" },
  types: {
    maintank: {
      ko: "돌격 메인탱",
      en: "The Anchor Tank",
      pair: "라인하르트",
      role: "탱",
      desc: "가장 앞에서 방벽을 들고 한타를 연다. 팀의 기둥이자 길잡이. 네가 버티는 만큼 팀이 산다.",
      tags: ["#앞라인", "#방벽", "#이니시", "#팀의기둥"],
    },
    carry: {
      ko: "하이퍼캐리 딜러",
      en: "The Carry DPS",
      pair: "겐지",
      role: "딜",
      desc: "측면 다이브로 백라인을 끊는 플레이메이커. 잘 풀리면 1:다수 캐리, 욕심내면 혼자 짤린다.",
      tags: ["#플레이메이킹", "#다이브", "#하드캐리", "#하이리스크"],
    },
    hitscan: {
      ko: "포커스 히트스캔",
      en: "The Sharpshooter",
      pair: "위도우메이커",
      role: "딜",
      desc: "정밀 조준 한 방으로 핵심을 지운다. 에임이 곧 너의 무기. 각이 안 나오면 조용해진다.",
      tags: ["#에임깡패", "#원킬", "#각재기", "#집중력"],
    },
    mainheal: {
      ko: "메인힐 운영형",
      en: "The Lifeline",
      pair: "아나",
      role: "힐",
      desc: "팀의 생명줄. 힐과 운영, 클러치 부활로 한타를 유지시킨다. 화려한 킬은 없어도 없으면 다 죽는다.",
      tags: ["#생명줄", "#힐운영", "#클러치힐", "#팀유지"],
    },
    flex: {
      ko: "플렉스 올라운더",
      en: "The Flex",
      pair: "디바",
      role: "탱",
      desc: "팀에 빈 자리를 채우는 만능형. 메타와 상황에 맞춰 뭐든 한다. 이타적이고 유연하다.",
      tags: ["#만능", "#상황대처", "#빈자리채움", "#이타적"],
    },
    chaos: {
      ko: "즐빡겜 변수형",
      en: "The Wildcard",
      pair: "토르비욘",
      role: "딜",
      desc: "승패보다 재미. 포탑과 의외의 픽으로 변수를 만든다. 같은 팀이면 든든, 적이면 짜증.",
      tags: ["#포탑러브", "#변수창출", "#즐빡겜", "#예측불가"],
    },
  },
  questions: [
    {
      q: "한타 시작, 너의 역할은?",
      answers: [
        { label: "방벽 들고 앞장 진입", types: ["maintank"] },
        { label: "측면 다이브로 백라인 끊기", types: ["carry"] },
        { label: "거리 두고 핵심 조준", types: ["hitscan"] },
        { label: "뒤에서 힐·궁 관리", types: ["mainheal"] },
      ],
    },
    {
      q: "궁극기가 찼다. 언제 쓰나?",
      answers: [
        { label: "이니시 열려고 바로", types: ["maintank"] },
        { label: "백라인 끊을 각에", types: ["carry"] },
        { label: "확실한 한타 마무리에", types: ["hitscan", "mainheal"] },
        { label: "그냥 꼴리는 타이밍ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "가장 자신있는 플레이는?",
      answers: [
        { label: "앞에서 어그로 받고 버티기", types: ["maintank"] },
        { label: "화려한 다이브 캐리", types: ["carry"] },
        { label: "정밀 조준 원킬", types: ["hitscan"] },
        { label: "팀 살리는 클러치 힐", types: ["mainheal"] },
      ],
    },
    {
      q: "팀에 탱이 없다. 너는?",
      answers: [
        { label: "내가 탱 간다", types: ["maintank", "flex"] },
        { label: "그냥 딜 박고 캐리", types: ["carry"] },
        { label: "자리 맞춰 유연하게 픽", types: ["flex"] },
        { label: "픽창에서 트롤챔ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "가장 짜릿한 순간은?",
      answers: [
        { label: "내 이니시로 한타 터질 때", types: ["maintank"] },
        { label: "1:다수 다이브 성공", types: ["carry"] },
        { label: "헤드샷 연속", types: ["hitscan"] },
        { label: "다 죽어가는 팀 살려낼 때", types: ["mainheal"] },
      ],
    },
    {
      q: "메타가 바뀌었다. 너의 반응?",
      answers: [
        { label: "어차피 앞라인은 필요해", types: ["maintank"] },
        { label: "캐리 가능한 딜 찾는다", types: ["carry"] },
        { label: "내 주력 조준챔 고수", types: ["hitscan"] },
        { label: "메타 맞춰 뭐든 픽", types: ["flex"] },
      ],
    },
    {
      q: "팀원이 계속 죽을 때?",
      answers: [
        { label: "앞 받쳐서 자리 만든다", types: ["maintank"] },
        { label: "내가 더 캐리하면 됨", types: ["carry"] },
        { label: "힐·부활로 살린다", types: ["mainheal"] },
        { label: "ㅋㅋ 포탑이나 박자", types: ["chaos"] },
      ],
    },
    {
      q: "픽 고르는 기준은?",
      answers: [
        { label: "팀에 필요한 역할", types: ["flex", "maintank"] },
        { label: "캐리력 높은 영웅", types: ["carry", "hitscan"] },
        { label: "내가 잘하는 조준챔", types: ["hitscan"] },
        { label: "그냥 재밌는 영웅", types: ["chaos"] },
      ],
    },
    {
      q: "친구들이 말하는 너의 옵치 스타일은?",
      answers: [
        { label: "묵묵히 앞에서 버팀", types: ["maintank"] },
        { label: "혼자 비비다 짤리거나 캐리", types: ["carry"] },
        { label: "에임 미침", types: ["hitscan"] },
        { label: "맨날 힐러 도맡음", types: ["mainheal"] },
      ],
    },
  ],
};
