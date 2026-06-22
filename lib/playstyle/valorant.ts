import type { PlaystyleConfig } from "./core";

// 발로란트 플레이 성향 테스트 — 확정 콘텐츠 (1:1). 라이엇 자산 self-host.
export const VALORANT_CONFIG: PlaystyleConfig = {
  id: "valorant-playstyle",
  path: "/tests/valorant-playstyle",
  testName: "Valorant Playstyle Test",
  gameLabel: "발로란트",
  titleKo: "발로란트 플레이 성향 테스트 | 너의 진짜 발로 스타일",
  metaDescription:
    "에임이냐 머리냐, 너의 진짜 발로 스타일. 9문항으로 알아보는 내 에이전트 유형 — 발로란트 플레이 성향 테스트.",
  eyebrowPill: "AGENT TEST",
  introSub: "에임이냐 머리냐, 너의 진짜 발로 스타일.",
  introDesc:
    "엔트리, 운영, 클러치, 정보, 센티넬, 폭주형까지. 9개의 상황 선택으로 너와 가장 닮은 에이전트와 플레이 성향을 찾아드립니다.",
  introTypeLine: "에이전트 유형",
  pairLabel: "닮은 요원",
  media: "art",
  artBase: "/images/tests/valorant/art",
  artExt: "png",
  notice:
    "이 콘텐츠는 Riot Games의 'Legal Jibber Jabber' 정책에 따라 제작되었으며, Riot Games는 본 프로젝트를 보증·후원하지 않습니다. VALORANT 에셋 © Riot Games.",
  tiebreak: ["entry", "clutch", "igl", "recon", "sentinel", "chaos"],
  ogKicker: "VALORANT PLAYSTYLE TEST",
  ogDefault: {
    title: "발로란트 플레이 성향 테스트",
    sub: "에임이냐 머리냐, 너의 진짜 발로 스타일.",
    line: "엔트리? 운영? 클러치? 아니면 폭주형?",
  },
  ogDescriptionDefault: "에임이냐 머리냐, 너의 진짜 발로 스타일. 9문항으로 알아보는 내 에이전트 유형.",
  recommendIds: ["lol-playstyle", "overwatch-playstyle", "pubg-playstyle", "kbti"],
  theme: { accent: "#FF4655", accentInk: "#240608" },
  types: {
    entry: {
      ko: "엔트리 프래거",
      en: "The Entry Fragger",
      pair: "제트",
      img: "jett",
      desc: "먼저 들어가 첫 각을 여는 돌격대장. 에임으로 스페이스를 뚫고 팀의 길을 낸다. 잘 풀리면 캐리, 욕심내면 첫 데스도 너.",
      tags: ["#선entry", "#에임깡패", "#앞장", "#스페이스창출"],
    },
    igl: {
      ko: "작전 사령관",
      en: "The Strategist",
      pair: "오멘",
      img: "omen",
      desc: "에임보다 머리. 유틸 조합과 콜로 라운드를 설계한다. 화려하진 않아도 네 콜대로 굴러갈 때 팀이 이긴다.",
      tags: ["#샷콜러", "#유틸장인", "#두뇌플레이", "#판짜기"],
    },
    clutch: {
      ko: "클러치 마스터",
      en: "The Clutch",
      pair: "체임버",
      img: "chamber",
      desc: "불리할수록 침착해진다. 1vN을 각 하나씩 풀어 뒤집는 해결사. 모두가 포기한 라운드를 혼자 들고 온다.",
      tags: ["#1vN", "#침착함", "#한방의각", "#에이스각"],
    },
    recon: {
      ko: "정보 이니시에이터",
      en: "The Initiator",
      pair: "소바",
      img: "sova",
      desc: "정찰과 정보로 팀을 셋업하는 길잡이. 직접 안 따도 네 드론·화살이 팀의 킬을 만든다.",
      tags: ["#정보왕", "#정찰", "#팀셋업", "#각공유"],
    },
    sentinel: {
      ko: "수문장 센티넬",
      en: "The Sentinel",
      pair: "사이퍼",
      img: "cypher",
      desc: "뒤를 지키고 늦게 터지는 수비의 핵심. 함정과 정보로 플랭크를 차단한다. 조용하지만 없으면 무너진다.",
      tags: ["#뒷마당사수", "#함정설치", "#안정러", "#정보차단"],
    },
    chaos: {
      ko: "즐겜 폭주형",
      en: "The Wildcard",
      pair: "레이즈",
      img: "raze",
      desc: "승패보다 재미. 샷건 러쉬와 예측불가 무브로 변수를 만든다. 적이면 제일 짜증나는 그 사람.",
      tags: ["#샷건러쉬", "#예측불가", "#즐겜", "#광기"],
    },
  },
  questions: [
    {
      q: "라운드 시작, 너의 첫 무브는?",
      answers: [
        { label: "빠르게 사이트 진입각부터 잡는다", types: ["entry"] },
        { label: "팀 유틸·동선을 콜한다", types: ["igl"] },
        { label: "상대 위치 정보부터 딴다", types: ["recon"] },
        { label: "뒤·플랭크 막을 자리를 잡는다", types: ["sentinel"] },
      ],
    },
    {
      q: "너의 주력 무기는?",
      answers: [
        { label: "에임. 정면에서 이긴다", types: ["entry", "clutch"] },
        { label: "유틸. 연막·플래시로 판 짠다", types: ["igl"] },
        { label: "정찰. 정보가 곧 킬", types: ["recon"] },
        { label: "그냥 꼴리는 대로 쏜다ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "피스톨 라운드 전략은?",
      answers: [
        { label: "러쉬 박아 기선제압", types: ["entry"] },
        { label: "세이브하고 다음을 본다", types: ["igl", "sentinel"] },
        { label: "정보 따고 천천히", types: ["recon"] },
        { label: "샷건 사서 돌격ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "1v3 클러치, 너는?",
      answers: [
        { label: "침착하게 각 하나씩 따낸다", types: ["clutch"] },
        { label: "시간 끌고 스파이크로 이긴다", types: ["igl"] },
        { label: "어차피 안되니 화려하게 죽는다", types: ["chaos"] },
        { label: "정보 콜 남기고 트레이드 유도", types: ["recon"] },
      ],
    },
    {
      q: "가장 짜릿한 순간은?",
      answers: [
        { label: "오프닝 듀얼 이기고 한칸 따낼 때", types: ["entry"] },
        { label: "내 콜대로 라운드가 굴러갈 때", types: ["igl"] },
        { label: "1vN 에이스 클러치", types: ["clutch"] },
        { label: "내 정보로 팀이 다 잡을 때", types: ["recon"] },
      ],
    },
    {
      q: "수비 라운드 너의 위치는?",
      answers: [
        { label: "어그로 잡으러 앞점", types: ["entry"] },
        { label: "가장 안쪽/뒷마당", types: ["sentinel"] },
        { label: "미드 정보 따는 자리", types: ["recon"] },
        { label: "아무데나 가서 변수ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "팀원이 계속 던질 때?",
      answers: [
        { label: "내가 에임으로 캐리한다", types: ["entry", "clutch"] },
        { label: "작전 다시 짜서 콜", types: ["igl"] },
        { label: "ㅋㅋ 즐기자", types: ["chaos"] },
        { label: "한 명이라도 살려 트레이드", types: ["sentinel", "recon"] },
      ],
    },
    {
      q: "살 돈이 부족하다. 너의 선택?",
      answers: [
        { label: "그래도 라이플 질러 한타", types: ["entry"] },
        { label: "팀과 맞춰 이코 통일", types: ["igl"] },
        { label: "권총+유틸로 정보각", types: ["recon"] },
        { label: "샷건 사서 기습ㅋㅋ", types: ["chaos"] },
      ],
    },
    {
      q: "친구들이 말하는 너의 발로 스타일은?",
      answers: [
        { label: "에임 미쳤는데 먼저 죽음", types: ["entry"] },
        { label: "똑똑하게 굴린다", types: ["igl"] },
        { label: "1대다 잘 뒤집음", types: ["clutch"] },
        { label: "뒤지키다 막판에 일함", types: ["sentinel"] },
      ],
    },
  ],
};
