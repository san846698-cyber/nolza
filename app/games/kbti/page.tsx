"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { AdBottom, AdMobileSticky } from "../../components/Ads";
import { ShareCard } from "../../components/ShareCard";
import RecommendedGames from "../../components/game/RecommendedGames";
import ResultActions from "../../components/game/ResultActions";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  buildQuestionList,
  pickResult,
  TOTAL_QUESTIONS,
  TOTAL_TYPES,
  type AnswerLetter,
  type MatchResult,
} from "@/lib/kbti";

const BG = "#0d0d0f";
const PAPER = "#18181b";
const PAPER_2 = "#222226";
const ACCENT = "#C60C30";
const INK = "#f6f3ef";
const SUBTLE = "rgba(246,243,239,0.64)";
const RULE = "rgba(255,255,255,0.1)";
const SANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const ANSWER_LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];

type Phase = "intro" | "quiz" | "result";

const STATS_KEY = "nolza_kbti_stats_v3";

type Stats = {
  total: number;
  byType: Record<string, number>;
};

type KbtiVibe = {
  aliasKo: string;
  aliasEn: string;
  subtitleKo: string;
  subtitleEn: string;
  summaryKo: string;
  summaryEn: string;
  traitsKo: string[];
  traitsEn: string[];
  innerKo: string;
  innerEn: string;
  misunderstoodKo: string;
  misunderstoodEn: string;
  closeKo: string;
  closeEn: string;
  heardKo: string[];
  heardEn: string[];
  friendProofKo: string[];
  friendProofEn: string[];
  goodMatchKo: string;
  goodMatchEn: string;
  badSituationKo: string;
  badSituationEn: string;
};

const DEFAULT_VIBE: KbtiVibe = {
  aliasKo: "한국형 현실 생존자",
  aliasEn: "Korean Reality Survivor",
  subtitleKo: "괜찮은 척하지만 머릿속은 이미 회의 중",
  subtitleEn: "Looks fine outside, running a whole meeting inside",
  summaryKo:
    "겉으로는 대충 사는 것처럼 보여도, 실제로는 관계와 타이밍과 분위기를 꽤 많이 계산합니다. 웃긴 건 본인은 이걸 그냥 평범한 생존 방식이라고 생각한다는 점이에요.",
  summaryEn:
    "You may look casual from the outside, but you are constantly reading timing, relationships, and atmosphere. The funny part is that you call this normal survival.",
  traitsKo: ["상황 파악이 빠름", "혼자 생각이 많음", "친해지면 훨씬 웃김", "은근히 기준이 뚜렷함"],
  traitsEn: ["Fast at reading rooms", "Thinks a lot alone", "Funnier once close", "Quietly clear standards"],
  innerKo: "아무 말 안 하는 순간에도 머릿속에서는 인간관계 시뮬레이션이 조용히 돌아갑니다.",
  innerEn: "Even when silent, a quiet relationship simulator is running in your head.",
  misunderstoodKo: "무심한 게 아니라 에너지 배분을 신중하게 하는 쪽에 가깝습니다.",
  misunderstoodEn: "You are not careless. You are careful about where your energy goes.",
  closeKo: "편해지면 갑자기 말이 많아지고, 이상한 포인트에서 웃겨서 주변 사람이 당황합니다.",
  closeEn: "Once comfortable, you get talkative and unexpectedly funny in oddly specific ways.",
  heardKo: ["너 생각보다 웃기다", "괜찮다면서 제일 신경 쓰고 있지?", "너 이거 또 혼자 분석했지"],
  heardEn: ["You're funnier than I expected", "You say you're fine, but you're clearly thinking", "You analyzed this alone, didn't you"],
  friendProofKo: ["단톡방에서는 조용한데 개인톡은 정확함", "싫은 티를 안 내지만 표정에 살짝 남음", "좋아하는 주제 나오면 말 속도가 달라짐"],
  friendProofEn: ["Quiet in group chats, precise in DMs", "Tries to hide dislike, face gives a little away", "Talk speed changes when the topic is loved"],
  goodMatchKo: "속도 강요 안 하고, 말하지 않아도 빈틈을 알아봐 주는 사람",
  goodMatchEn: "People who do not rush you and notice the gaps without forcing words",
  badSituationKo: "즉석 발표, 애매한 단체 약속, 갑자기 모두가 나만 보는 순간",
  badSituationEn: "Surprise presentations, vague group plans, sudden spotlight moments",
};

const KBTI_VIBES: Record<string, Partial<KbtiVibe>> = {
  nuppro: {
    aliasKo: "누워있는 성취러",
    aliasEn: "Horizontal Overachiever",
    subtitleKo: "몸은 침대에 있는데 자아는 이미 팀장급",
    subtitleEn: "Body in bed, ambition in management mode",
    traitsKo: ["누워서 계획은 잘 세움", "시작 전 상상력이 큼", "휴식 명분이 탄탄함", "마감 앞에서 갑자기 살아남"],
    traitsEn: ["Plans well in bed", "Big pre-start imagination", "Strong rest logic", "Wakes up near deadlines"],
    innerKo: "쉬는 척하지만 머릿속에서는 '내일부터 달라질 나' 프레젠테이션이 재생 중입니다.",
    misunderstoodKo: "게으른 게 아니라 충전과 회피의 경계에서 고급 줄타기를 하는 중입니다.",
    closeKo: "친해지면 누워서도 인생 조언을 꽤 그럴듯하게 해줍니다.",
    heardKo: ["너 또 누워 있어?", "말은 진짜 잘한다", "시작만 하면 잘할 것 같은데"],
    friendProofKo: ["계획표는 예쁜데 실행 날짜가 내일임", "침대에서 보낸 링크 퀄리티가 높음", "마감 직전 집중력이 갑자기 미침"],
  },
  mujichul: {
    aliasKo: "통장수호대장",
    aliasEn: "Bank Balance Guardian",
    subtitleKo: "충동구매 앞에서만큼은 국가대표급 수비수",
    traitsKo: ["가성비 레이더", "장바구니 숙성 장인", "할인율 계산 빠름", "돈 쓴 뒤 복기함"],
    innerKo: "사고 싶다는 마음과 통장 잔고가 머릿속에서 토론회를 엽니다.",
    misunderstoodKo: "짠 게 아니라 후회의 가능성을 미리 차단하는 쪽입니다.",
    closeKo: "친해지면 좋은 할인과 필요 없는 소비를 동시에 알려줍니다.",
    heardKo: ["너는 진짜 계산 빠르다", "그거 왜 안 샀어?", "근데 네 말 듣고 안 사길 잘했다"],
    friendProofKo: ["장바구니에 오래 묵은 물건이 많음", "배송비까지 계산해야 결제함", "친구 소비도 조용히 말려줌"],
  },
  njob: {
    aliasKo: "퇴근 후 또 출근형",
    aliasEn: "After-work Worker",
    subtitleKo: "본업 끝났는데 사이드퀘스트 알림이 울림",
    traitsKo: ["일 벌이기 선수", "쉬는 법을 공부함", "생산성 앱 수집가", "피곤한데 또 함"],
    innerKo: "쉬어야 한다는 걸 알면서도 '이거 하나만 더'가 자동 재생됩니다.",
    misunderstoodKo: "욕심이 많은 게 아니라 멈추면 불안한 타입에 가깝습니다.",
    closeKo: "친해지면 갑자기 좋은 툴, 좋은 루틴, 이상한 수익모델을 추천합니다.",
    heardKo: ["너 대체 언제 쉬어?", "또 뭐 시작했어?", "근데 실행력은 인정"],
    friendProofKo: ["노션 페이지가 계속 늘어남", "쉬는 날에도 할 일을 만듦", "번아웃 직전까지 효율을 찾음"],
  },
  nuwo: {
    aliasKo: "침대 위 세계관 기획자",
    aliasEn: "World-class Planner in Bed",
    subtitleKo: "누운 지 5분 만에 인생 개편안 완성",
    traitsKo: ["상상력 과밀", "시작 전 설계가 큼", "휴식과 회피가 친함", "밤에 각성함"],
    innerKo: "지금은 쉬는 시간이지만, 사실 머릿속에서는 내 인생 시즌2가 제작 중입니다.",
    misunderstoodKo: "아무것도 안 하는 것처럼 보여도 생각만큼은 과로 중입니다.",
    closeKo: "친해지면 누워서 만든 거대한 계획을 진지하게 들려줍니다.",
    heardKo: ["그 생각을 누워서 했다고?", "일어나면 진짜 대박일 듯", "오늘도 계획만 세웠지"],
    friendProofKo: ["밤에 갑자기 긴 메시지 보냄", "시작 전 자료조사가 길어짐", "침대가 회의실 역할을 함"],
  },
  iksip: {
    aliasKo: "읽씹 명분 제조기",
    aliasEn: "Read-and-ignore Alchemist",
    subtitleKo: "답장을 안 한 게 아니라 완벽한 타이밍을 놓침",
    traitsKo: ["답장 시뮬레이션", "알림 피로도 높음", "가까운 사람에게 더 느림", "마음은 있음"],
    innerKo: "답장 문장을 다섯 번 고치다가 결국 타이밍을 잃고 조용히 폰을 덮습니다.",
    misunderstoodKo: "무시하는 게 아니라 답장을 잘하고 싶어서 늦어지는 경우가 많습니다.",
    closeKo: "친해지면 답은 늦어도 정성은 이상하게 깊습니다.",
    heardKo: ["읽었는데 왜 답이 없어?", "너 또 생각하다 놓쳤지", "괜찮아 살아있지?"],
    friendProofKo: ["알림은 봤는데 대화창을 다시 못 엶", "중요한 말은 의외로 오래 기억함", "미안하다는 말을 자주 함"],
  },
  ppalli: {
    aliasKo: "초록불 선출발형",
    aliasEn: "Already Moving at Green",
    subtitleKo: "기다림 3초에도 인생 손해를 느낌",
    traitsKo: ["속도 중시", "답답함에 약함", "먼저 움직임", "결정 후 후회도 빠름"],
    innerKo: "아직 신호가 바뀌기 전인데 몸은 이미 출발 준비를 끝냈습니다.",
    misunderstoodKo: "성격이 급한 게 아니라 흐름이 끊기는 걸 못 견디는 편입니다.",
    closeKo: "친해지면 답답한 상황에서 대신 총대를 메줍니다.",
    heardKo: ["잠깐만 기다려 봐", "너 진짜 빠르다", "이미 했어?"],
    friendProofKo: ["로딩 화면에서 새로고침 누름", "주문 메뉴를 빠르게 정함", "느린 사람 옆에서 표정 관리 실패"],
  },
  jamsu: {
    aliasKo: "카톡 잠수 전략가",
    aliasEn: "Message Submarine Strategist",
    subtitleKo: "사라진 게 아니라 수면 아래에서 회복 중",
    traitsKo: ["연락 에너지 절약", "혼자 회복함", "친한 사람에게 솔직함", "재등장 타이밍 독특함"],
    innerKo: "지금은 아무도 싫지 않습니다. 그냥 모두가 잠시 멀리 있어야 살 것 같습니다.",
    misunderstoodKo: "정이 없는 게 아니라 관계를 오래 유지하려고 잠깐 숨는 방식입니다.",
    closeKo: "친해지면 잠수 후에도 아무 일 없던 것처럼 자연스럽게 돌아옵니다.",
    heardKo: ["너 어디 갔었어?", "살아있었네", "답 늦는 건 이제 익숙해"],
    friendProofKo: ["며칠 뒤 갑자기 긴 답장", "혼자 있으면 컨디션 회복", "중요한 순간엔 의외로 나타남"],
  },
  yashik: {
    aliasKo: "야식 의사결정자",
    aliasEn: "Midnight Snack Executive",
    subtitleKo: "밤 11시에만 판단력이 묘하게 관대해짐",
    traitsKo: ["늦은 밤 합리화", "맛있는 위로 선호", "후회도 빠름", "내일의 나와 협상함"],
    innerKo: "배고픈 건지 외로운 건지 모르겠지만 일단 배달 앱을 켭니다.",
    misunderstoodKo: "먹는 걸 좋아하는 게 아니라 오늘 하루를 음식으로 마무리하고 싶은 쪽입니다.",
    closeKo: "친해지면 야식 메뉴 추천만큼은 이상하게 설득력 있습니다.",
    heardKo: ["또 시켰어?", "내일부터라며", "근데 맛있긴 하겠다"],
    friendProofKo: ["밤에 메뉴 캡처를 보냄", "최소주문금액에 쉽게 설득됨", "먹고 나서 다짐을 새로 함"],
  },
  galdeung: {
    aliasKo: "메뉴판 내전형",
    aliasEn: "Menu-board Civil War",
    subtitleKo: "선택지는 많은데 마음은 하나도 안정되지 않음",
    traitsKo: ["결정 피로", "비교 분석", "후회 방지 욕구", "추천에 약함"],
    innerKo: "하나를 고르는 순간 나머지 가능성이 전부 아까워집니다.",
    misunderstoodKo: "우유부단한 게 아니라 실패 없는 선택을 하고 싶은 겁니다.",
    closeKo: "친해지면 최종 선택 전까지 드라마틱한 내적 갈등을 보여줍니다.",
    heardKo: ["아직도 못 골랐어?", "그냥 아무거나 해", "너한테 고르라 하면 안 되겠다"],
    friendProofKo: ["메뉴판을 오래 봄", "리뷰를 너무 많이 읽음", "남이 골라주면 안도함"],
  },
  chulhak: {
    aliasKo: "새벽 철학자",
    aliasEn: "2AM Philosopher",
    subtitleKo: "잠들기 전 갑자기 인생의 본질을 묻는 타입",
    traitsKo: ["깊은 생각", "새벽 감성", "질문이 많음", "결론보다 과정"],
    innerKo: "내일 해야 할 일보다 '나는 왜 이렇게 사는가'가 더 크게 들리는 밤이 있습니다.",
    misunderstoodKo: "피곤한 게 아니라 생각이 너무 멀리 가서 돌아오는 중입니다.",
    closeKo: "친해지면 갑자기 진지한 질문을 던져 분위기를 깊게 만듭니다.",
    heardKo: ["갑자기 왜 이렇게 진지해?", "너 밤에 생각 많지", "그 말 좀 좋다"],
    friendProofKo: ["메모장에 이상한 문장이 있음", "새벽에 감성 폭발", "가벼운 얘기도 깊게 연결함"],
  },
  wanbyuk: {
    aliasKo: "0.1mm 완벽주의자",
    aliasEn: "0.1mm Perfectionist",
    subtitleKo: "남들은 못 본 틈을 혼자 계속 봄",
    traitsKo: ["디테일 집착", "마감 전 수정", "기준 높음", "칭찬보다 오차가 먼저 보임"],
    innerKo: "괜찮다는 말을 들어도 본인은 아직 마음에 걸리는 한 줄을 보고 있습니다.",
    misunderstoodKo: "까다로운 게 아니라 결과물이 본인을 대표한다고 느끼는 편입니다.",
    closeKo: "친해지면 퀄리티를 진짜 끝까지 끌어올려 줍니다.",
    heardKo: ["이 정도면 됐어", "너만 보여 그거", "그래도 결과는 좋다"],
    friendProofKo: ["제출 직전에도 수정", "정렬 안 맞으면 신경 씀", "완성 후에도 다시 봄"],
  },
  injeung: {
    aliasKo: "칭찬 알림 대기형",
    aliasEn: "Compliment Notification Watcher",
    subtitleKo: "아닌 척하지만 인정 한마디에 배터리 풀충전",
    traitsKo: ["인정 욕구", "칭찬 기억력", "반응 확인", "잘하고 싶은 마음"],
    innerKo: "괜찮다고 말하지만 사실 '잘했다' 한마디를 조용히 기다립니다.",
    misunderstoodKo: "관종이라기보다 노력한 걸 누군가 알아봐 주면 힘이 나는 타입입니다.",
    closeKo: "친해지면 칭찬 하나에도 표정이 바로 풀립니다.",
    heardKo: ["칭찬하면 좋아하는 거 티 나", "너 은근 인정받고 싶어 하지", "잘했어 진짜"],
    friendProofKo: ["좋은 댓글을 다시 봄", "반응 없는 결과물에 시무룩함", "칭찬받은 건 오래 기억함"],
  },
  aljanj: {
    aliasKo: "조용한 관찰자",
    aliasEn: "Quietly Competent Observer",
    subtitleKo: "말수는 적은데 상황 파악은 이미 끝남",
    traitsKo: ["관찰력", "낮은 과시욕", "정확한 한마디", "은근한 실력"],
    innerKo: "단체방에서는 조용하지만 속으로는 모두의 말투와 분위기를 분석하고 있습니다.",
    misunderstoodKo: "소극적인 게 아니라 말할 필요가 생길 때까지 기다리는 편입니다.",
    closeKo: "친해지면 갑자기 날카롭고 웃긴 관찰평을 꺼냅니다.",
    heardKo: ["너 조용한데 다 보고 있었네", "말하니까 맞는 말이네", "은근 웃기다"],
    friendProofKo: ["상황 요약이 정확함", "불필요한 말은 줄임", "한 번 말하면 임팩트 있음"],
  },
  nunting: {
    aliasKo: "눈팅 정보기관",
    aliasEn: "Lurker Intelligence Unit",
    subtitleKo: "참여는 안 했지만 내용은 제일 많이 알고 있음",
    traitsKo: ["정보 수집", "낮은 노출 욕구", "조용한 판단", "타이밍 관찰"],
    innerKo: "말은 안 얹지만 누가 어떤 톤으로 말했는지까지 조용히 저장합니다.",
    misunderstoodKo: "관심 없는 게 아니라 굳이 존재감을 드러내지 않는 쪽입니다.",
    closeKo: "친해지면 '그때 봤는데'로 시작하는 정확한 기억을 꺼냅니다.",
    heardKo: ["너 그거 보고 있었어?", "왜 말 안 했어?", "정보력 뭐야"],
    friendProofKo: ["단톡방 읽음 수에는 늘 있음", "중요한 정보는 놓치지 않음", "필요할 때만 등장함"],
  },
  bunsuk: {
    aliasKo: "말투 분석관",
    aliasEn: "Text-tone Analyst",
    subtitleKo: "점 하나, 답장 속도 하나에도 의미를 읽음",
    traitsKo: ["뉘앙스 민감", "관계 레이더", "과해석 위험", "분위기 감지"],
    innerKo: "상대가 'ㅇㅋ'라고 보낸 순간부터 머릿속에 가능성 그래프가 열립니다.",
    misunderstoodKo: "예민한 게 아니라 작은 변화에서 관계의 온도를 읽는 사람입니다.",
    closeKo: "친해지면 친구의 썸, 갈등, 분위기를 누구보다 빨리 감지합니다.",
    heardKo: ["그걸 어떻게 알았어?", "너 너무 깊게 봐", "근데 맞는 것 같아"],
    friendProofKo: ["마침표 하나도 봄", "답장 텀을 기억함", "표정과 말투가 안 맞으면 바로 느낌"],
  },
  chaga: {
    aliasKo: "차가운 척 유리멘탈",
    aliasEn: "Cold Outside, Glass Inside",
    subtitleKo: "겉은 시크한데 마음에는 스크래치가 잘 남음",
    traitsKo: ["표정 관리", "상처 오래감", "정 많은 편", "약한 모습 숨김"],
    innerKo: "아무렇지 않은 척하지만 방금 들은 말이 밤까지 다시 재생됩니다.",
    misunderstoodKo: "차가운 사람이 아니라 상처받기 싫어서 표면을 단단하게 만드는 편입니다.",
    closeKo: "친해지면 의외로 정이 많고, 작은 말에도 오래 감동합니다.",
    heardKo: ["너 시크한 줄 알았는데", "생각보다 마음 여리네", "아까 그 말 신경 썼지"],
    friendProofKo: ["괜찮다 해도 표정이 살짝 굳음", "작은 호의 오래 기억", "속상하면 혼자 정리함"],
  },
  jipchak: {
    aliasKo: "꽂히면 끝까지형",
    aliasEn: "Locked-in Deep Diver",
    subtitleKo: "관심 버튼이 눌리면 주변 소음이 꺼짐",
    traitsKo: ["몰입력", "취향 선명", "시간 감각 상실", "덕질형 집중"],
    innerKo: "한 번 꽂히면 자료, 후기, 영상, 커뮤니티까지 자연스럽게 들어갑니다.",
    misunderstoodKo: "집착이 아니라 좋아하는 걸 깊이 이해하고 싶은 마음입니다.",
    closeKo: "친해지면 본인 세계관을 엄청난 디테일로 영업합니다.",
    heardKo: ["너 또 거기에 빠졌어?", "설명 좀 짧게 해 봐", "근데 듣다 보니 재밌다"],
    friendProofKo: ["관심사 설명이 길어짐", "관련 자료 저장이 많음", "새 취미가 생기면 며칠 사라짐"],
  },
  byuk: {
    aliasKo: "마음의 벽 인테리어형",
    aliasEn: "Interior Wall Builder",
    subtitleKo: "벽은 높은데 안쪽은 꽤 따뜻함",
    traitsKo: ["경계심", "천천히 친해짐", "안전한 관계 선호", "속정 깊음"],
    innerKo: "사람이 싫은 건 아닌데, 문을 열어도 되는지 확인하는 시간이 오래 걸립니다.",
    misunderstoodKo: "거리 두는 게 아니라 오래 갈 사람인지 조용히 보는 중입니다.",
    closeKo: "친해지면 갑자기 편하고 오래가는 사람으로 변합니다.",
    heardKo: ["처음엔 어려웠어", "친해지니까 완전 다르네", "너 은근 다정하다"],
    friendProofKo: ["초반엔 답이 짧음", "선 넘는 사람을 빨리 차단", "내 사람에게는 오래 감"],
  },
  toejun: {
    aliasKo: "퇴사 상상 출근러",
    aliasEn: "Resignation Daydreamer",
    subtitleKo: "아침엔 퇴사, 오후엔 월급, 밤엔 로또",
    traitsKo: ["현실 피로", "상상 탈출", "책임감은 있음", "월급날 회복"],
    innerKo: "출근은 했지만 머릿속에서는 이미 제주도 카페 사장 3년 차입니다.",
    misunderstoodKo: "책임감이 없는 게 아니라 책임감 때문에 더 자주 탈출을 상상합니다.",
    closeKo: "친해지면 퇴사 시나리오를 웃기고 자세하게 들려줍니다.",
    heardKo: ["너 또 퇴사 얘기해?", "근데 일은 잘하네", "이번 달도 버텼다"],
    friendProofKo: ["점심시간에 채용공고 봄", "로또 당첨 후 계획 있음", "월요일 표정이 투명함"],
  },
  nunchi: {
    aliasKo: "공기 읽는 레이더",
    aliasEn: "Room-reading Radar",
    subtitleKo: "누가 말 안 해도 이미 분위기를 감지함",
    traitsKo: ["눈치 빠름", "중재 본능", "피곤한 관찰력", "분위기 책임감"],
    innerKo: "아무도 말하지 않은 불편함까지 먼저 감지해서 혼자 조용히 수습합니다.",
    misunderstoodKo: "소심한 게 아니라 분위기가 망가지기 전에 먼저 움직이는 편입니다.",
    closeKo: "친해지면 모두가 편해지는 방향으로 자연스럽게 판을 깔아줍니다.",
    heardKo: ["너 눈치 진짜 빠르다", "말 안 했는데 어떻게 알았어?", "있으면 편해"],
    friendProofKo: ["정적이 오면 먼저 움직임", "불편한 사람을 빨리 알아봄", "뒤처진 사람을 챙김"],
  },
  chimaek: {
    aliasKo: "치맥 통합정부",
    aliasEn: "Chicken-and-beer Coalition",
    subtitleKo: "복잡한 감정도 일단 치킨 앞에서는 협치 가능",
    traitsKo: ["분위기 회복", "먹는 자리 중재", "단순한 행복 선호", "친구 소환력"],
    innerKo: "복잡한 문제는 많지만, 오늘은 바삭한 것부터 해결해야 합니다.",
    misunderstoodKo: "대충 사는 게 아니라 회복의 우선순위를 정확히 아는 편입니다.",
    closeKo: "친해지면 가장 평화로운 방식으로 모두를 한 테이블에 앉힙니다.",
    heardKo: ["역시 답은 치킨이지", "너랑 먹으면 기분 풀림", "메뉴 통합 능력 인정"],
    friendProofKo: ["분위기 싸해지면 먹을 걸 제안", "메뉴 합의가 빠름", "소소한 행복을 크게 즐김"],
  },
};

function defaultStats(): Stats {
  return { total: 0, byType: {} };
}

function loadStats(): Stats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stats>;
      return {
        total: typeof parsed.total === "number" ? parsed.total : 0,
        byType: parsed.byType ?? {},
      };
    }
  } catch {
    /* ignore */
  }
  return defaultStats();
}

function saveStat(stats: Stats, typeId: string): Stats {
  const next: Stats = {
    total: stats.total + 1,
    byType: { ...stats.byType, [typeId]: (stats.byType[typeId] ?? 0) + 1 },
  };
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

function vibeFor(typeId: string): KbtiVibe {
  return { ...DEFAULT_VIBE, ...(KBTI_VIBES[typeId] ?? {}) };
}

function firstLine(text: string): string {
  return text.split("\n").find((line) => line.trim().length > 0)?.trim() ?? text;
}

export default function KbtiPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<AnswerLetter | null>(
    null,
  );
  const [result, setResult] = useState<MatchResult | null>(null);
  const [stats, setStats] = useState<Stats>(defaultStats());

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase]);

  const questions = useMemo(() => buildQuestionList(), []);

  const handleStart = useCallback(() => {
    setAnswers([]);
    setQuestionIdx(0);
    setSelectedLetter(null);
    setResult(null);
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback(
    (letter: AnswerLetter) => {
      if (selectedLetter) return;
      setSelectedLetter(letter);
      window.setTimeout(() => {
        const newAnswers = [...answers, letter];
        setSelectedLetter(null);
        setAnswers(newAnswers);
        if (newAnswers.length >= questions.length) {
          const picked = pickResult(newAnswers);
          setResult(picked);
          setStats((prev) => saveStat(prev, picked.type.id));
          setPhase("result");
        } else {
          setQuestionIdx((i) => i + 1);
        }
      }, 120);
    },
    [answers, questions.length, selectedLetter],
  );

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setQuestionIdx(0);
    setAnswers([]);
    setSelectedLetter(null);
    setResult(null);
  }, []);

  return (
    <main className="kbti-page">
      <div className="kbti-stage" data-phase={phase}>
        {phase === "intro" && <Intro onStart={handleStart} t={t} />}

        {phase === "quiz" && (
          <QuizView
            questionIdx={questionIdx}
            total={questions.length}
            question={questions[questionIdx]}
            onAnswer={handleAnswer}
            locale={locale}
            selectedLetter={selectedLetter}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            result={result}
            stats={stats}
            onRestart={handleRestart}
            t={t}
            locale={locale}
          />
        )}
      </div>

      <AdMobileSticky />

      <style jsx global>{`
        .kbti-page {
          min-height: 100svh;
          background:
            radial-gradient(circle at 50% 0%, rgba(198, 12, 48, 0.18), transparent 34rem),
            ${BG};
          color: ${INK};
          font-family: ${SANS};
          overflow-x: clip;
        }
        .kbti-stage {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 72px 20px 40px;
          box-sizing: border-box;
        }
        .kbti-stage[data-phase="result"] {
          justify-content: flex-start;
        }
        .kbti-reveal {
          opacity: 0;
          animation: kbtiReveal 0.45s ease-out forwards;
          animation-delay: calc(var(--i, 0) * 80ms);
        }
        @keyframes kbtiReveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kbti-answer {
          min-height: 54px;
        }
        .kbti-answer:disabled {
          opacity: 1;
        }
        .kbti-result-card {
          width: 100%;
          background:
            radial-gradient(circle at 50% 0%, rgba(198, 12, 48, 0.2), transparent 28rem),
            ${BG};
          padding: 4px 0 18px;
        }
        .kbti-action-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          margin-top: 18px;
        }
        .kbti-page .result-actions__btn {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.055);
          color: ${INK};
        }
        .kbti-page .result-actions__btn--primary {
          border-color: ${ACCENT};
          background: ${ACCENT};
          color: #fff;
        }
        .kbti-page .result-actions__btn--share {
          border-color: ${ACCENT};
          color: ${ACCENT};
        }
        .kbti-page .recommended-games__head,
        .kbti-page .recommended-games__item {
          color: ${INK};
        }
        .kbti-page .recommended-games__item {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.055);
        }
        .kbti-page .recommended-games__head small,
        .kbti-page .recommended-games__item em {
          color: ${ACCENT};
        }
        @media (max-width: 640px) {
          .kbti-stage {
            padding-inline: 16px;
          }
          .kbti-answer {
            min-height: 58px;
            padding: 13px 14px !important;
          }
        }
      `}</style>
    </main>
  );
}

function Intro({
  onStart,
  t,
}: {
  onStart: () => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
      <div
        className="kbti-reveal"
        style={{
          ["--i" as string]: "0",
          color: ACCENT,
          fontSize: 13,
          letterSpacing: "0.28em",
          fontWeight: 800,
          marginBottom: 18,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        KBTI · {t("한국형 성격 테스트", "KOREAN PERSONALITY TEST")}
      </div>
      <h1
        className="kbti-reveal"
        style={{
          ["--i" as string]: "1",
          fontSize: "clamp(38px, 8vw, 64px)",
          fontWeight: 900,
          letterSpacing: 0,
          lineHeight: 1.08,
          marginBottom: 16,
        }}
      >
        {t("MBTI는 알겠고", "You know MBTI")}
        <br />
        <span style={{ color: ACCENT }}>
          {t("이제 한국식으로 보자", "Now make it Korean")}
        </span>
      </h1>
      <p
        className="kbti-reveal"
        style={{
          ["--i" as string]: "2",
          fontSize: 16,
          color: SUBTLE,
          margin: "0 auto 36px",
          lineHeight: 1.7,
          maxWidth: 430,
        }}
      >
        {t(
          `${TOTAL_QUESTIONS}문항으로 보는 일상 생존 성향. 결과는 웃긴데, 묘하게 들킵니다.`,
          `${TOTAL_QUESTIONS} questions for your daily survival type. Funny, but suspiciously accurate.`,
        )}
      </p>

      <div
        className="kbti-reveal"
        style={{
          ["--i" as string]: "3",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {[
          t("상황 고르기", "Pick situations"),
          t(`${TOTAL_TYPES}가지 유형`, `${TOTAL_TYPES} types`),
          t("결과 공유", "Share result"),
        ].map((item) => (
          <span
            key={item}
            style={{
              border: `1px solid ${RULE}`,
              borderRadius: 8,
              background: "rgba(255,255,255,0.045)",
              color: SUBTLE,
              padding: "11px 8px",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.35,
              wordBreak: "keep-all",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="kbti-reveal btn-press"
        style={{
          ["--i" as string]: "4",
          background: ACCENT,
          color: "#fff",
          border: "none",
          padding: "16px 42px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: SANS,
          boxShadow: "0 18px 44px rgba(198,12,48,0.34)",
          minHeight: 48,
        }}
      >
        {t("3분 컷 진단 시작", "Start the 3-minute test")}
      </button>

      <p
        className="kbti-reveal"
        style={{
          ["--i" as string]: "5",
          marginTop: 26,
          fontSize: 14,
          color: "rgba(246,243,239,0.44)",
          lineHeight: 1.7,
        }}
      >
        {t(
          "친구가 보면 “야 이거 너다” 할 확률 높음",
          "High chance your friend says, “wait, this is you.”",
        )}
      </p>
    </div>
  );
}

function QuizView({
  questionIdx,
  total,
  question,
  onAnswer,
  locale,
  selectedLetter,
}: {
  questionIdx: number;
  total: number;
  question: ReturnType<typeof buildQuestionList>[number] | undefined;
  onAnswer: (letter: AnswerLetter) => void;
  locale: SimpleLocale;
  selectedLetter: AnswerLetter | null;
}): ReactElement {
  if (!question) return <></>;
  const progress = ((questionIdx + 1) / total) * 100;

  return (
    <div style={{ maxWidth: 560, width: "100%" }}>
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            letterSpacing: "0.16em",
            color: SUBTLE,
            marginBottom: 8,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <span>KBTI</span>
          <span className="tabular-nums">
            {questionIdx + 1} / {total}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 4,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: ACCENT,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <h2
        key={questionIdx}
        className="kbti-reveal"
        style={{
          ["--i" as string]: "0",
          fontSize: "clamp(22px, 5vw, 30px)",
          fontWeight: 800,
          lineHeight: 1.38,
          letterSpacing: 0,
          marginBottom: 28,
          color: INK,
        }}
      >
        {locale === "ko" ? question.ko : question.en}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {question.choices.map((choice, i) => {
          const letter = ANSWER_LETTERS[i] as AnswerLetter;
          const selected = selectedLetter === letter;
          return (
            <button
              key={`${questionIdx}-${letter}`}
              type="button"
              onClick={() => onAnswer(letter)}
              className="kbti-reveal kbti-answer btn-press"
              data-selected={selected}
              disabled={selectedLetter !== null}
              style={{
                ["--i" as string]: String(i + 1),
                background: selected
                  ? "rgba(198,12,48,0.18)"
                  : PAPER,
                border: `1px solid ${selected ? ACCENT : RULE}`,
                color: INK,
                borderRadius: 14,
                padding: "14px 16px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: SANS,
                textAlign: "left",
                cursor: selectedLetter ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                lineHeight: 1.45,
                boxShadow: selected
                  ? "0 0 0 3px rgba(198,12,48,0.18)"
                  : "none",
                transform: selected ? "translateY(-1px)" : "none",
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: selected ? ACCENT : "rgba(255,255,255,0.06)",
                  border: `1px solid ${selected ? ACCENT : RULE}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: selected ? "#fff" : ACCENT,
                }}
              >
                {letter}
              </span>
              <span style={{ flex: 1 }}>
                {locale === "ko" ? choice.ko : choice.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({
  result,
  stats,
  onRestart,
  t,
  locale,
}: {
  result: MatchResult;
  stats: Stats;
  onRestart: () => void;
  t: (ko: string, en: string) => string;
  locale: SimpleLocale;
}): ReactElement {
  const { type, match, hidden } = result;
  const txt = locale === "ko" ? type.ko : type.en;
  const otherTxt = locale === "ko" ? type.en : type.ko;
  const vibe = vibeFor(type.id);
  const myCount = stats.byType[type.id] ?? 0;
  const total = Math.max(1, stats.total);
  const samePct = Math.round((myCount / total) * 100);
  const traits = locale === "ko" ? vibe.traitsKo : vibe.traitsEn;
  const shareLine = t(
    `내 KBTI 결과는 '${vibe.aliasKo}' 나왔습니다. 근데 설명이 너무 나 같음...`,
    `My KBTI result is '${vibe.aliasEn}'. This is way too accurate...`,
  );
  const shareText = `${shareLine}\n${firstLine(txt.oneliner)}\nhttps://nolza.fun/games/kbti`;

  let revealIdx = 0;
  const stagger = (): CSSProperties => ({
    ["--i" as string]: String(revealIdx++),
  });

  return (
    <ShareCard
      filename={`nolza-kbti-${txt.code.replace(/\s+/g, "")}`}
      locale={locale === "ko" ? "ko" : "en"}
      backgroundColor={BG}
      buttonLabel={{ ko: "결과 이미지 저장", en: "Save result image" }}
      buttonStyle={{
        padding: "12px 22px",
        borderRadius: 999,
        border: `1px solid ${ACCENT}`,
        background: "transparent",
        color: ACCENT,
        fontWeight: 800,
        fontSize: 13,
        cursor: "pointer",
        minHeight: 44,
      }}
    >
      {({ cardRef }) => (
        <div style={{ maxWidth: 720, width: "100%" }}>
          <div ref={cardRef} className="kbti-result-card">
            <div
              className="kbti-reveal"
              style={{
                ...stagger(),
                textAlign: "center",
                color: ACCENT,
                fontSize: 12,
                letterSpacing: "0.28em",
                fontWeight: 900,
                marginBottom: 12,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {hidden ? t("숨겨진 유형 발견", "HIDDEN TYPE UNLOCKED") : t("당신의 KBTI", "YOUR KBTI")}
            </div>

            <section
              className="kbti-reveal"
              style={{
                ...stagger(),
                background:
                  "linear-gradient(180deg, rgba(198,12,48,0.18), rgba(255,255,255,0.045))",
                border: `1px solid rgba(198,12,48,0.55)`,
                borderRadius: 24,
                padding: "32px 24px 26px",
                textAlign: "center",
                boxShadow: "0 24px 70px rgba(0,0,0,0.34)",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 6 }}>{type.emoji}</div>
              <div
                style={{
                  fontSize: "clamp(48px, 10vw, 78px)",
                  fontWeight: 950,
                  lineHeight: 0.95,
                  color: ACCENT,
                  letterSpacing: 0,
                }}
              >
                {txt.code}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(246,243,239,0.54)",
                  fontSize: 14,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {otherTxt.code}
              </div>
              <h1
                style={{
                  margin: "18px 0 0",
                  fontSize: "clamp(24px, 5vw, 34px)",
                  lineHeight: 1.18,
                  fontWeight: 900,
                  letterSpacing: 0,
                  wordBreak: "keep-all",
                }}
              >
                {locale === "ko" ? vibe.aliasKo : vibe.aliasEn}
              </h1>
              <p
                style={{
                  margin: "10px auto 0",
                  color: SUBTLE,
                  maxWidth: 520,
                  fontSize: 15,
                  lineHeight: 1.65,
                  wordBreak: "keep-all",
                }}
              >
                {locale === "ko" ? vibe.subtitleKo : vibe.subtitleEn}
              </p>
              {!hidden && (
                <div
                  className="tabular-nums"
                  style={{
                    marginTop: 18,
                    color: ACCENT,
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: "0.16em",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {t("매치율", "MATCH")} {match}%
                </div>
              )}
            </section>

            <Callout
              style={stagger()}
              label={t("한 줄 요약", "One-line summary")}
              body={firstLine(txt.oneliner)}
            />

            <p
              className="kbti-reveal"
              style={{
                ...stagger(),
                margin: "22px auto",
                maxWidth: 640,
                color: "rgba(246,243,239,0.84)",
                fontSize: 16,
                lineHeight: 1.8,
                textAlign: "center",
                wordBreak: "keep-all",
              }}
            >
              {locale === "ko" ? vibe.summaryKo : vibe.summaryEn}
            </p>

            <div
              className="kbti-reveal"
              style={{
                ...stagger(),
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(138px, 1fr))",
                gap: 8,
                margin: "18px 0 26px",
              }}
            >
              {traits.slice(0, 5).map((trait) => (
                <span
                  key={trait}
                  style={{
                    border: `1px solid ${RULE}`,
                    background: PAPER,
                    borderRadius: 12,
                    padding: "12px 10px",
                    textAlign: "center",
                    color: INK,
                    fontSize: 13,
                    fontWeight: 800,
                    lineHeight: 1.35,
                    wordBreak: "keep-all",
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <ResultSection
                label={t("강점", "Strengths")}
                body={txt.strengths}
                accent="#7bdba0"
                style={stagger()}
              />
              <ResultSection
                label={t("약점 / 블라인드스팟", "Blind spots")}
                body={txt.watchOut}
                accent="#ff9b6b"
                style={stagger()}
              />
              <TwoColumnSection
                leftLabel={t("관계 스타일", "Social style")}
                leftBody={txt.howOthersSee}
                rightLabel={t("일 / 공부 스타일", "Work / study style")}
                rightBody={txt.shines}
                style={stagger()}
              />
              <MiniGrid
                style={stagger()}
                items={[
                  [t("겉모습", "Outer look"), firstLine(txt.howOthersSee)],
                  [t("속마음", "Inside"), locale === "ko" ? vibe.innerKo : vibe.innerEn],
                  [t("사람들이 오해하는 점", "Common misunderstanding"), locale === "ko" ? vibe.misunderstoodKo : vibe.misunderstoodEn],
                  [t("친해지면 보이는 모습", "Once close"), locale === "ko" ? vibe.closeKo : vibe.closeEn],
                  [t("잘 맞는 유형", "Best match"), locale === "ko" ? vibe.goodMatchKo : vibe.goodMatchEn],
                  [t("안 맞는 상황", "Worst setting"), locale === "ko" ? vibe.badSituationKo : vibe.badSituationEn],
                ]}
              />
              <ListSection
                label={t("이런 말 자주 들음", "You hear this often")}
                items={locale === "ko" ? vibe.heardKo : vibe.heardEn}
                style={stagger()}
              />
              <ListSection
                label={t("친구가 보면 인정할 포인트", "Friend-proof evidence")}
                items={locale === "ko" ? vibe.friendProofKo : vibe.friendProofEn}
                style={stagger()}
              />
            </div>

            <Callout
              style={stagger()}
              label={t("공유 멘트", "Share copy")}
              body={shareLine}
            />

            {stats.total > 0 && (
              <div
                className="kbti-reveal"
                style={{
                  ...stagger(),
                  textAlign: "center",
                  fontSize: 14,
                  color: SUBTLE,
                  margin: "18px 0 8px",
                  lineHeight: 1.6,
                }}
              >
                {t(
                  `이 기기에서 ${stats.total}번 플레이 중 ${samePct}%가 같은 유형`,
                  `${samePct}% of ${stats.total} plays on this device got the same type`,
                )}
              </div>
            )}
          </div>

          <div className="kbti-action-wrap kbti-reveal" style={stagger()}>
            <ResultActions
              locale={locale}
              title={t("KBTI 결과", "KBTI result")}
              text={shareText}
              url="/games/kbti"
              onReplay={onRestart}
              replayLabel={t("다시 하기", "Try again")}
            />
            <RecommendedGames currentId="kbti" ids={["mbti-depth", "attachment", "nunchi"]} />
            <AdBottom />
          </div>
        </div>
      )}
    </ShareCard>
  );
}

function Callout({
  label,
  body,
  style,
}: {
  label: string;
  body: string;
  style: CSSProperties;
}) {
  return (
    <div
      className="kbti-reveal"
      style={{
        ...style,
        marginTop: 18,
        border: `1px solid rgba(198,12,48,0.48)`,
        background: "rgba(198,12,48,0.1)",
        borderRadius: 16,
        padding: "18px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: ACCENT,
          fontSize: 11,
          letterSpacing: "0.22em",
          fontWeight: 900,
          marginBottom: 8,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: INK,
          fontSize: 17,
          lineHeight: 1.55,
          fontWeight: 800,
          wordBreak: "keep-all",
          whiteSpace: "pre-line",
        }}
      >
        {body}
      </div>
    </div>
  );
}

function ResultSection({
  label,
  body,
  accent,
  style,
}: {
  label: string;
  body: string;
  accent: string;
  style: CSSProperties;
}): ReactElement {
  return (
    <section
      className="kbti-reveal"
      style={{
        ...style,
        background: PAPER_2,
        border: `1px solid ${RULE}`,
        borderRadius: 16,
        padding: "20px 22px",
      }}
    >
      <SectionLabel label={label} accent={accent} />
      <p
        style={{
          margin: "12px 0 0",
          color: "rgba(246,243,239,0.82)",
          fontSize: 15,
          lineHeight: 1.82,
          whiteSpace: "pre-line",
          wordBreak: "keep-all",
        }}
      >
        {body}
      </p>
    </section>
  );
}

function TwoColumnSection({
  leftLabel,
  leftBody,
  rightLabel,
  rightBody,
  style,
}: {
  leftLabel: string;
  leftBody: string;
  rightLabel: string;
  rightBody: string;
  style: CSSProperties;
}) {
  return (
    <div
      className="kbti-reveal"
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      <ResultSection label={leftLabel} body={leftBody} accent="#9bb8ff" style={{}} />
      <ResultSection label={rightLabel} body={rightBody} accent="#ffd166" style={{}} />
    </div>
  );
}

function MiniGrid({
  items,
  style,
}: {
  items: [string, string][];
  style: CSSProperties;
}) {
  return (
    <div
      className="kbti-reveal"
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 10,
      }}
    >
      {items.map(([label, body]) => (
        <div
          key={label}
          style={{
            background: PAPER,
            border: `1px solid ${RULE}`,
            borderRadius: 14,
            padding: "16px",
          }}
        >
          <SectionLabel label={label} accent="rgba(246,243,239,0.58)" compact />
          <p
            style={{
              margin: "10px 0 0",
              color: "rgba(246,243,239,0.82)",
              fontSize: 14,
              lineHeight: 1.68,
              wordBreak: "keep-all",
            }}
          >
            {body}
          </p>
        </div>
      ))}
    </div>
  );
}

function ListSection({
  label,
  items,
  style,
}: {
  label: string;
  items: string[];
  style: CSSProperties;
}) {
  return (
    <section
      className="kbti-reveal"
      style={{
        ...style,
        background: PAPER_2,
        border: `1px solid ${RULE}`,
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <SectionLabel label={label} accent={ACCENT} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 8,
          marginTop: 12,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={{
              background: "rgba(255,255,255,0.045)",
              border: `1px solid ${RULE}`,
              borderRadius: 12,
              padding: "12px 13px",
              color: INK,
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "keep-all",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({
  label,
  accent,
  compact = false,
}: {
  label: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        color: accent,
        fontSize: compact ? 10 : 11,
        letterSpacing: "0.2em",
        fontWeight: 900,
        fontFamily: "var(--font-inter), sans-serif",
        textTransform: "uppercase",
        lineHeight: 1.35,
      }}
    >
      {label}
    </div>
  );
}
