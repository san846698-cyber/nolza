export type GuideRelatedLink = {
  href: string;
  title: string;
  description: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type GuidePage = {
  slug: string;
  href: string;
  gameId?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  homeTitle: string;
  homeDescription: string;
  intro: string[];
  what: string;
  how: string;
  interpretation: string;
  sharing: string;
  related: GuideRelatedLink[];
  faq: GuideFaq[];
  ctaHref: string;
  ctaLabel: string;
  publisherLinkLabel: string;
  publisherLinkDescription: string;
};

export const GUIDES: GuidePage[] = [
  {
    slug: "reaction-time-test",
    href: "/guides/reaction-time-test",
    gameId: "react",
    title: "반응속도 테스트는 어떻게 즐기면 좋을까요?",
    metaTitle: "반응속도 테스트 가이드",
    metaDescription:
      "반응속도 테스트의 플레이 방법, 결과 해석, 친구와 기록을 비교하는 재미를 짧고 쉽게 설명합니다.",
    homeTitle: "반응속도 테스트 가이드",
    homeDescription: "초록불을 누르는 짧은 게임에서 기록을 어떻게 보면 좋은지 정리했습니다.",
    intro: [
      "반응속도 테스트는 화면이 초록색으로 바뀌는 순간 얼마나 빨리 누르는지 측정하는 짧은 미니게임입니다.",
      "기록 자체도 재미있지만, 여러 번 플레이했을 때 손이 풀리는 과정이나 친구와의 차이를 비교하는 재미가 큽니다.",
    ],
    what:
      "놀자.fun의 반응속도 게임은 5번의 시도를 평균으로 묶어 한 번의 결과를 보여줍니다. 너무 빨리 누르면 해당 라운드는 다시 시작되기 때문에, 빠른 손보다 정확한 타이밍이 먼저 필요합니다.",
    how:
      "시작 후 빨간 화면에서는 기다리고, 초록 화면으로 바뀌는 순간 화면을 누르면 됩니다. 가능한 조용한 환경에서 손가락을 화면 가까이에 두고 플레이하면 기록 편차를 줄이기 쉽습니다.",
    interpretation:
      "결과의 ms 값은 신호를 보고 누르기까지 걸린 시간입니다. 낮을수록 빠르지만, 한두 번의 기록보다 평균과 가장 빠른 기록을 함께 보는 편이 더 자연스럽습니다.",
    sharing:
      "친구에게 결과를 보내면 단순히 점수를 자랑하는 것보다 '너는 몇 ms 나오나'라는 작은 도전으로 이어집니다. 짧게 끝나는 게임이라 바로 재도전하기도 좋습니다.",
    related: [
      {
        href: "/games/react",
        title: "반응속도",
        description: "초록불이 켜지는 순간 탭하는 5라운드 챌린지입니다.",
      },
      {
        href: "/games/circle",
        title: "완벽한 원 그리기",
        description: "손끝 정확도를 한 획으로 확인하는 미니게임입니다.",
      },
      {
        href: "/games/timesense",
        title: "시간 감각",
        description: "내 안의 시계가 얼마나 정확한지 확인해보세요.",
      },
    ],
    faq: [
      {
        question: "좋은 반응속도는 몇 ms 정도인가요?",
        answer:
          "일반적으로 200ms 안팎이면 꽤 빠르게 느껴집니다. 다만 기기, 화면 주사율, 손 위치에 따라 차이가 날 수 있어 절대적인 능력치로 보기는 어렵습니다.",
      },
      {
        question: "한 번만 해도 결과를 믿어도 되나요?",
        answer:
          "한 번의 기록은 운이 많이 섞입니다. 여러 라운드 평균과 가장 빠른 기록을 함께 보면 오늘의 컨디션을 더 가볍게 읽을 수 있습니다.",
      },
      {
        question: "모바일과 PC 기록이 달라질 수 있나요?",
        answer:
          "네. 입력 방식, 화면 지연, 브라우저 환경이 다르기 때문에 모바일과 PC 기록은 따로 비교하는 편이 좋습니다.",
      },
    ],
    ctaHref: "/games/react",
    ctaLabel: "반응속도 측정하기",
    publisherLinkLabel: "반응속도 테스트 가이드 보기",
    publisherLinkDescription: "ms 기록을 어떻게 읽고 친구와 비교하면 좋은지 짧게 정리했습니다.",
  },
  {
    slug: "perfect-circle-game",
    href: "/guides/perfect-circle-game",
    gameId: "circle",
    title: "완벽한 원 그리기 게임 가이드",
    metaTitle: "완벽한 원 그리기 게임 가이드",
    metaDescription:
      "완벽한 원 그리기 게임의 플레이 방법, 정확도 해석, 캔버스 결과를 친구와 공유하는 재미를 설명합니다.",
    homeTitle: "완벽한 원 그리기 가이드",
    homeDescription: "한 획으로 그린 원의 정확도를 어떻게 해석하면 좋을지 안내합니다.",
    intro: [
      "완벽한 원 그리기는 한 번의 선으로 원을 그리고, 그 모양이 얼마나 균형 잡혔는지 확인하는 미니게임입니다.",
      "정교한 그림 실력보다 손목의 감각, 시작점과 끝점의 연결, 일정한 속도가 결과를 좌우합니다.",
    ],
    what:
      "이 게임은 그린 선의 중심, 반지름 변화, 원을 얼마나 닫았는지를 바탕으로 정확도를 계산합니다. 캔버스 위에 내가 그린 선과 기준 원이 함께 남아 결과를 바로 비교할 수 있습니다.",
    how:
      "손가락이나 마우스를 떼지 않고 한 번에 둥글게 그리면 됩니다. 너무 크게 그리기보다 화면 안에서 편하게 돌릴 수 있는 크기를 선택하면 더 안정적인 결과가 나옵니다.",
    interpretation:
      "정확도는 원에 가까운 정도를 보여주는 가벼운 지표입니다. 점수가 낮아도 실패라기보다 손목이 어떤 방향으로 흔들렸는지 보는 재미에 가깝습니다.",
    sharing:
      "결과 화면은 친구가 바로 보고 따라 하기 좋습니다. 의외로 완벽한 원보다 이상하게 귀여운 원이 더 큰 반응을 얻기도 합니다.",
    related: [
      {
        href: "/games/circle",
        title: "완벽한 원 그리기",
        description: "한 획으로 원을 그리고 정확도를 바로 확인합니다.",
      },
      {
        href: "/games/react",
        title: "반응속도",
        description: "빠른 손과 정확한 타이밍을 함께 확인해보세요.",
      },
      {
        href: "/games/kbti",
        title: "KBTI",
        description: "한국식 성격 유형을 가볍게 읽는 테스트입니다.",
      },
    ],
    faq: [
      {
        question: "원은 크게 그리는 게 유리한가요?",
        answer:
          "너무 작으면 움직임이 조금만 흔들려도 차이가 커지고, 너무 크면 끝까지 균형을 유지하기 어렵습니다. 손목이 편하게 도는 중간 크기가 좋습니다.",
      },
      {
        question: "터치펜을 써도 되나요?",
        answer:
          "가능합니다. 손가락, 마우스, 터치펜 모두 사용할 수 있지만 입력 도구에 따라 기록이 달라질 수 있습니다.",
      },
      {
        question: "정확도 점수는 전문적인 측정인가요?",
        answer:
          "아니요. 재미를 위한 브라우저 게임의 계산값입니다. 그림 실력이나 실제 운동 능력을 평가하는 기준은 아닙니다.",
      },
    ],
    ctaHref: "/games/circle",
    ctaLabel: "원 그리러 가기",
    publisherLinkLabel: "완벽한 원 그리기 가이드 보기",
    publisherLinkDescription: "정확도 점수와 캔버스 결과를 가볍게 해석하는 방법을 정리했습니다.",
  },
  {
    slug: "korean-password-game",
    href: "/guides/korean-password-game",
    gameId: "password",
    title: "한국판 비밀번호 게임은 어떤 게임인가요?",
    metaTitle: "한국판 비밀번호 게임 가이드",
    metaDescription:
      "한국판 비밀번호 게임의 규칙 구조, 라이트/하드 모드 차이, 결과 공유 방법을 알기 쉽게 설명합니다.",
    homeTitle: "한국판 비밀번호 게임 가이드",
    homeDescription: "점점 이상해지는 규칙을 어떻게 받아들이면 좋은지 설명합니다.",
    intro: [
      "한국판 비밀번호 게임은 규칙을 하나씩 통과할 때마다 새 조건이 열리는 퍼즐형 미니게임입니다.",
      "처음에는 평범한 비밀번호처럼 시작하지만, 한글, 숫자, 이모지, 한자 같은 조건이 겹치며 점점 이상한 문자열이 만들어집니다.",
    ],
    what:
      "이 게임은 안전한 비밀번호를 만드는 도구가 아니라, 비밀번호 규칙이 너무 많아질 때 생기는 우스운 상황을 게임으로 바꾼 콘텐츠입니다. 라이트 모드는 짧게 맛보고, 하드 모드는 끝까지 버티는 도전에 가깝습니다.",
    how:
      "현재 열린 규칙을 확인하고, 입력창에 조건을 만족하는 문자를 추가하면 다음 규칙이 열립니다. 막혔을 때는 지금 실패한 규칙을 먼저 보고, 이미 통과한 조건을 깨뜨리지 않는 방식으로 수정하는 것이 좋습니다.",
    interpretation:
      "결과는 몇 개의 규칙을 통과했는지, 어떤 모드에서 얼마나 버텼는지를 보여줍니다. 클리어 여부보다 어디서 막혔는지가 이 게임의 재미입니다.",
    sharing:
      "진행 중 결과를 보내면 친구가 '여기서 어떻게 더 하라는 거지?' 하고 바로 반응하기 쉽습니다. 완성한 비밀번호 자체보다 규칙을 통과해가는 과정이 공유 포인트입니다.",
    related: [
      {
        href: "/games/password",
        title: "한국식 비밀번호 게임",
        description: "점점 이상해지는 규칙의 미로를 통과해보세요.",
      },
      {
        href: "/games/react",
        title: "반응속도",
        description: "짧고 빠르게 기록을 비교하기 좋은 미니게임입니다.",
      },
      {
        href: "/games/circle",
        title: "완벽한 원 그리기",
        description: "손끝 감각을 한 번에 확인하는 정확도 챌린지입니다.",
      },
      {
        href: "/games/kbti",
        title: "KBTI",
        description: "게임 후 가볍게 이어서 하기 좋은 성격 테스트입니다.",
      },
    ],
    faq: [
      {
        question: "이 게임에서 만든 비밀번호를 실제로 써도 되나요?",
        answer:
          "권장하지 않습니다. 이 페이지는 실제 보안 도구가 아니라 규칙 퍼즐을 즐기는 엔터테인먼트 게임입니다.",
      },
      {
        question: "라이트 모드와 하드 모드는 무엇이 다른가요?",
        answer:
          "라이트 모드는 짧은 규칙 수로 빠르게 끝낼 수 있고, 하드 모드는 더 많은 조건과 변수가 열려 오래 도전하는 구조입니다.",
      },
      {
        question: "중간 결과 공유는 어떤 의미인가요?",
        answer:
          "클리어하지 않아도 현재 통과한 규칙 수를 친구에게 보여줄 수 있습니다. 막힌 지점 자체가 이 게임의 재미라 중간 공유도 자연스럽습니다.",
      },
    ],
    ctaHref: "/games/password",
    ctaLabel: "비밀번호 게임 시작하기",
    publisherLinkLabel: "한국판 비밀번호 게임 가이드 보기",
    publisherLinkDescription: "라이트/하드 모드와 규칙형 퍼즐의 즐기는 법을 설명합니다.",
  },
  {
    slug: "joseon-couple-test",
    href: "/guides/joseon-couple-test",
    gameId: "joseon-couple",
    title: "조선시대 커플 궁합 테스트 가이드",
    metaTitle: "조선시대 커플 궁합 테스트 가이드",
    metaDescription:
      "조선시대 커플 궁합 테스트의 입력 방식, 결과 해석, 공유 미리보기와 친구에게 보내는 재미를 안내합니다.",
    homeTitle: "조선시대 커플 궁합 가이드",
    homeDescription: "두 사람의 이름이 조선 로맨스 결과로 바뀌는 흐름을 설명합니다.",
    intro: [
      "조선시대 커플 궁합은 두 사람의 이름을 넣어 조선의 신분, 만남, 관계 분위기를 짧은 이야기처럼 보여주는 공유형 테스트입니다.",
      "실제 궁합 판단이 아니라, 이름 조합을 바탕으로 만든 창작형 로맨스 결과를 친구나 연인과 함께 읽는 콘텐츠입니다.",
    ],
    what:
      "이 테스트는 두 사람의 입력값을 바탕으로 인연 유형, 분위기, 결과 문장을 만들어냅니다. 결과 공유 링크는 전체 내용을 다 보여주기보다 궁금하게 만드는 미리보기로 작동합니다.",
    how:
      "두 사람의 이름과 필요한 선택값을 입력한 뒤 결과를 확인하면 됩니다. 결과 제목, 궁합 점수, 조선시대 장면, 한 줄 대사를 순서대로 읽으면 이야기의 흐름이 더 잘 보입니다.",
    interpretation:
      "결과는 실제 관계의 좋고 나쁨을 판단하지 않습니다. 조선시대라는 콘셉트 안에서 두 사람의 케미를 하나의 짧은 설정집처럼 읽으면 가장 자연스럽습니다.",
    sharing:
      "공유 링크를 보내면 상대가 같은 결과를 열어볼 수 있어 대화가 바로 시작됩니다. 전체 스포일러보다 제목과 짧은 요약이 먼저 보이기 때문에 클릭하고 확인하는 재미가 살아납니다.",
    related: [
      {
        href: "/games/joseon-couple",
        title: "조선시대 커플",
        description: "그 시절 두 사람은 어떤 인연이었을지 확인해보세요.",
      },
      {
        href: "/games/kdrama-couple",
        title: "K드라마 커플",
        description: "두 사람의 케미를 드라마 장르와 서사로 풀어냅니다.",
      },
      {
        href: "/games/friend-match",
        title: "우리 사이, 하늘이 정했다",
        description: "친구와의 관계를 가볍게 비교해보는 궁합 콘텐츠입니다.",
      },
      {
        href: "/games/joseon",
        title: "조선시대 나의 삶",
        description: "혼자서도 조선시대 캐릭터 결과를 볼 수 있습니다.",
      },
    ],
    faq: [
      {
        question: "실제 궁합으로 봐도 되나요?",
        answer:
          "아니요. 이 테스트는 창작형 엔터테인먼트 콘텐츠입니다. 실제 연애나 관계 판단을 대신하지 않습니다.",
      },
      {
        question: "공유 링크에 결과가 모두 공개되나요?",
        answer:
          "공유 미리보기에는 짧은 요약만 보이도록 구성되어 있습니다. 자세한 내용은 링크를 열어 확인하는 방식입니다.",
      },
      {
        question: "같은 이름이면 같은 결과가 나오나요?",
        answer:
          "같은 입력값에서는 같은 결과를 다시 열 수 있도록 설계되어 있습니다. 그래서 친구에게 보낸 링크도 같은 결과로 복원됩니다.",
      },
    ],
    ctaHref: "/games/joseon-couple",
    ctaLabel: "조선 인연 확인하기",
    publisherLinkLabel: "조선시대 커플 궁합 가이드 보기",
    publisherLinkDescription: "결과 제목, 장면, 공유 미리보기를 어떻게 읽으면 좋은지 안내합니다.",
  },
  {
    slug: "shareable-fun-tests",
    href: "/guides/shareable-fun-tests",
    title: "친구와 공유하기 좋은 테스트를 고르는 방법",
    metaTitle: "친구와 공유하기 좋은 재미 테스트 추천 가이드",
    metaDescription:
      "심리 테스트, 관계 테스트, 운세형 결과, 미니게임 중 친구에게 보내기 좋은 콘텐츠를 고르는 기준을 안내합니다.",
    homeTitle: "공유형 재미 테스트 고르기",
    homeDescription: "친구에게 보내기 좋은 테스트와 미니게임을 고르는 기준을 정리했습니다.",
    intro: [
      "공유하기 좋은 테스트는 결과가 길기보다 한 문장으로 반응이 오는 콘텐츠인 경우가 많습니다.",
      "놀자.fun에서는 심리 테스트, 관계 테스트, 운세형 결과, 미니게임을 기분과 상황에 맞게 골라 짧게 즐길 수 있습니다.",
    ],
    what:
      "공유형 테스트는 혼자 읽고 끝나는 페이지가 아니라, 결과를 보고 누군가에게 보내고 싶어지는 콘텐츠입니다. 결과 제목, 짧은 설명, 추천 카드, 공유 버튼이 자연스럽게 연결되어야 합니다.",
    how:
      "친구에게 보낼 때는 너무 진지한 테스트보다 1분 안에 끝나거나, 결과 제목만 봐도 웃을 수 있는 콘텐츠를 고르는 편이 좋습니다. 연인이나 친구와 함께 보는 경우에는 관계형 테스트가 특히 잘 맞습니다.",
    interpretation:
      "결과는 정답이나 진단이 아니라 대화의 시작점입니다. 나와 맞는 부분만 가볍게 받아들이고, 다른 부분은 농담처럼 넘기는 태도가 가장 자연스럽습니다.",
    sharing:
      "좋은 공유 링크는 받는 사람이 설명 없이도 '이건 열어봐야겠다'고 느끼게 합니다. 짧은 결과 요약과 명확한 CTA가 있으면 카카오톡, 문자, 디스코드 같은 채팅 환경에서도 더 잘 읽힙니다.",
    related: [
      {
        href: "/games/joseon-couple",
        title: "조선시대 커플",
        description: "두 사람의 관계를 조선 로맨스처럼 보여주는 공유형 테스트입니다.",
      },
      {
        href: "/games/kdrama-couple",
        title: "K드라마 커플",
        description: "연인, 친구, 최애 조합을 드라마 서사로 읽어볼 수 있습니다.",
      },
      {
        href: "/games/kbti",
        title: "KBTI",
        description: "한국식 성격 유형을 짧게 공유하기 좋은 테스트입니다.",
      },
      {
        href: "/games/circle",
        title: "완벽한 원 그리기",
        description: "짧은 점수 결과라 친구가 바로 따라 하기 좋습니다.",
      },
    ],
    faq: [
      {
        question: "처음 온 친구에게는 어떤 테스트가 좋나요?",
        answer:
          "관계형 테스트나 30초 안에 끝나는 미니게임이 부담이 적습니다. 조선시대 커플, KBTI, 반응속도처럼 결과가 바로 보이는 콘텐츠가 좋습니다.",
      },
      {
        question: "결과가 너무 진지해 보이면 어떻게 하나요?",
        answer:
          "놀자.fun의 결과는 엔터테인먼트로 읽는 것이 좋습니다. 전문 조언이 아니라 대화 소재라고 생각하면 더 편하게 즐길 수 있습니다.",
      },
      {
        question: "공유 링크가 검색에 많이 잡혀도 괜찮나요?",
        answer:
          "결과형 URL은 공유 미리보기는 유지하되 검색엔진에는 얇은 중복 페이지로 보이지 않도록 별도로 관리하는 것이 좋습니다.",
      },
    ],
    ctaHref: "/",
    ctaLabel: "테스트 둘러보기",
    publisherLinkLabel: "공유형 테스트 고르는 법 보기",
    publisherLinkDescription: "친구에게 보내기 좋은 결과형 콘텐츠를 고르는 기준을 정리했습니다.",
  },
];

export const GUIDE_PATHS = GUIDES.map((guide) => guide.href);

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

export function getGuideByGameId(gameId: string) {
  return GUIDES.find((guide) => guide.gameId === gameId) ?? null;
}
