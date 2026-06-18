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
  homeTitleEn: string;
  homeDescriptionEn: string;
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
    slug: "emotional-cooling-moment",
    href: "/guides/emotional-cooling-moment",
    gameId: "breaking-point",
    title: "감정적으로 마음이 식는 순간은 왜 생길까?",
    metaTitle: "마음이 차가워지는 순간을 이해하는 법 | Nolza 가이드",
    metaDescription:
      "관계에서 갑자기 마음이 식는 순간, 상처와 거리두기 반응을 어떻게 읽으면 좋을지 설명합니다.",
    homeTitle: "마음이 식는 순간 이해하기",
    homeDescription: "상처, 실망, 거리두기가 갑자기 차가운 반응으로 바뀌는 이유를 풀어봅니다.",
    homeTitleEn: "Understanding when feelings cool",
    homeDescriptionEn: "Why hurt, disappointment, and distance can suddenly turn into a cold reaction.",
    intro: [
      "누군가에게 실망했을 때 사람은 곧바로 화를 내기도 하지만, 아무 말 없이 차가워지기도 합니다. 이때의 차가움은 감정이 없는 상태라기보다 더 다치지 않으려는 보호 반응에 가까울 때가 많습니다.",
      "나를 차갑게 만드는 순간 테스트는 그런 전환점을 가볍게 살펴보는 콘텐츠입니다. 이 가이드는 결과를 진단처럼 받아들이기보다, 어떤 상황에서 내 마음이 문을 닫는지 읽는 방법을 설명합니다.",
    ],
    what:
      "감정이 식는 순간은 보통 하나의 사건만으로 생기지 않습니다. 반복해서 무시당한다고 느꼈거나, 기대했던 반응이 돌아오지 않았거나, 설명해도 이해받지 못한다고 느낄 때 마음은 서서히 에너지를 아끼기 시작합니다. 겉으로는 평온해 보여도 안쪽에서는 이미 '더 말해도 소용없다'는 결론을 내리고 있을 수 있습니다. 이 테스트는 사용자의 선택을 통해 상처를 즉시 표현하는 편인지, 조용히 물러나는 편인지, 이유를 따지며 설명하려는 편인지, 선을 긋고 정리하는 편인지 살펴봅니다.",
    how:
      "문항을 풀 때는 이상적인 대답보다 실제로 자주 하는 반응을 고르는 것이 좋습니다. '나는 원래 성숙한 사람이어야 한다'는 기준을 잠시 내려놓고, 비슷한 상황에서 몸이 먼저 하는 행동을 떠올려보세요. 읽씹을 당했을 때 바로 서운함을 말하는지, 농담으로 넘기는지, 혼자 오래 생각하는지, 아니면 조용히 기대치를 낮추는지를 보는 것이 핵심입니다.",
    interpretation:
      "결과는 관계 능력을 평가하는 점수가 아닙니다. 어떤 사람은 상처를 빨리 알아차리고 표현해야 안정되고, 어떤 사람은 잠시 혼자 있어야 다시 말할 수 있습니다. 중요한 것은 내 반응을 '이상하다'고 몰아붙이는 대신, 그 반응이 무엇을 지키려는지 보는 일입니다. 결과 문장을 읽으며 내가 자주 피하는 말, 너무 늦게 꺼내는 말, 관계에서 반복해서 기대하는 장면을 함께 떠올려보면 좋습니다.",
    sharing:
      "친구나 연인과 결과를 비교할 때는 누가 더 차갑거나 예민한지를 따지기보다, 서로의 경고등이 켜지는 상황을 확인하는 대화로 이어가면 좋습니다. 같은 사건도 한 사람에게는 작은 실수이고 다른 사람에게는 관계의 안전감이 흔들리는 신호일 수 있습니다.",
    related: [
      { href: "/tests/breaking-point", title: "나를 차갑게 만드는 순간", description: "평소의 내가 차갑게 변하는 지점을 확인해보세요." },
      { href: "/guides/relationship-boundaries-meaning", title: "관계에서 선을 긋는다는 것", description: "차가움과 건강한 경계의 차이를 읽어봅니다." },
      { href: "/tests/defense-mechanism", title: "방어기제 테스트", description: "불편한 감정 앞에서 마음이 나를 지키는 방식을 봅니다." },
    ],
    faq: [
      {
        question: "마음이 식는 것은 나쁜 성격인가요?",
        answer:
          "그렇지 않습니다. 다만 반복적으로 관계를 끊거나 설명 없이 사라지는 방식이 된다면, 내가 무엇에 다쳤는지 먼저 알아차리는 연습이 도움이 됩니다.",
      },
      {
        question: "결과를 관계 판단에 써도 되나요?",
        answer:
          "이 테스트는 재미와 자기성찰을 위한 콘텐츠입니다. 실제 관계의 중요한 결정은 대화, 상황, 서로의 맥락을 함께 보고 판단해야 합니다.",
      },
      {
        question: "결과가 마음에 들지 않으면 어떻게 보나요?",
        answer:
          "결과 전체를 정답처럼 받아들이지 말고, 그중 유독 신경 쓰이는 문장만 표시해보세요. 그 문장이 지금 필요한 힌트일 수 있습니다.",
      },
    ],
    ctaHref: "/tests/breaking-point",
    ctaLabel: "나를 차갑게 만드는 순간 테스트하기",
    publisherLinkLabel: "마음이 식는 순간 가이드",
    publisherLinkDescription: "상처, 거리두기, 경계 반응을 결과와 함께 읽는 방법을 정리했습니다.",
  },
  {
    slug: "defense-mechanism-basics",
    href: "/guides/defense-mechanism-basics",
    gameId: "defense-mechanism",
    title: "방어기제란 무엇인가?",
    metaTitle: "방어기제 뜻과 대표 반응 이해하기 | Nolza 가이드",
    metaDescription:
      "부정, 합리화, 회피, 투사처럼 불편한 감정을 피하거나 다루는 마음의 보호 반응을 쉽게 설명합니다.",
    homeTitle: "방어기제 쉽게 이해하기",
    homeDescription: "불편한 감정이 올라올 때 마음이 스스로를 지키는 방식을 읽어봅니다.",
    homeTitleEn: "Defense mechanisms made simple",
    homeDescriptionEn: "How the mind protects itself when uncomfortable feelings rise.",
    intro: [
      "방어기제는 마음이 불편한 감정과 충돌을 한 번에 감당하기 어려울 때 사용하는 보호 반응입니다. 이것은 나쁜 습관이라는 뜻이 아니라, 사람이 스트레스를 견디기 위해 자연스럽게 익히는 심리적 움직임에 가깝습니다.",
      "다만 어떤 방어가 반복되면 문제를 해결하기보다 미루게 만들 수 있습니다. 그래서 방어기제를 알아차린다는 것은 자신을 탓하는 일이 아니라, 내가 어떤 방식으로 마음을 보호하는지 관찰하는 일입니다.",
    ],
    what:
      "대표적인 방어 반응에는 사실을 인정하기 어려워 밀어내는 부정, 그럴듯한 이유를 만들어 불편함을 낮추는 합리화, 감정을 느끼기 전에 상황을 피하는 회피, 내 안의 감정을 다른 사람에게 있는 것처럼 느끼는 투사 등이 있습니다. 어떤 방어는 당장 마음을 안정시키지만, 오래 반복되면 대화가 끊기거나 같은 문제가 되풀이될 수 있습니다. 방어기제 테스트는 특정 반응이 좋고 나쁘다는 평가보다, 내가 긴장할 때 어느 방향으로 기울어지는지 보여주는 놀이형 콘텐츠입니다.",
    how:
      "문항을 풀 때는 '나는 이렇게 해야 한다'가 아니라 '실제로 나는 이렇게 한다'에 가까운 답을 골라보세요. 예를 들어 상처받았을 때 곧장 설명하는지, 아무렇지 않은 척하는지, 상대를 탓하는지, 혼자 정리한 뒤 연락을 줄이는지 떠올리면 선택이 쉬워집니다. 비슷해 보이는 선택지도 감정의 출발점이 다르므로, 말의 내용보다 몸이 먼저 향하는 방향을 기준으로 고르면 좋습니다.",
    interpretation:
      "결과는 심리 진단이 아닙니다. 정신건강 상태, 성격장애, 치료 필요성을 판단하지 않습니다. 대신 결과 제목과 설명을 통해 내가 불편한 감정 앞에서 쓰는 익숙한 언어를 확인하는 용도로 읽으면 좋습니다. 어떤 결과가 나왔다면 그 반응이 언제 도움이 되고, 언제 관계나 일상에서 나를 더 고립시키는지를 함께 생각해보세요.",
    sharing:
      "친구와 결과를 비교할 때는 '너는 회피형이야'처럼 낙인찍기보다 '나는 이런 상황에서 농담으로 넘기더라', '너는 바로 이유를 찾는 편이구나'처럼 반응의 차이를 대화로 풀어보는 것이 좋습니다. 방어는 누구에게나 있고, 차이는 그것을 알아차린 뒤 선택할 수 있느냐에 있습니다.",
    related: [
      { href: "/tests/defense-mechanism", title: "방어기제 테스트", description: "내 마음이 불편함을 처리하는 방식을 확인합니다." },
      { href: "/guides/noticing-avoided-emotions", title: "내가 회피하는 감정 알아차리기", description: "감정을 피할 때 나타나는 작은 신호를 정리했습니다." },
      { href: "/tests/thinking-pattern", title: "인지왜곡 테스트", description: "생각이 자주 꼬이는 방향을 살펴봅니다." },
    ],
    faq: [
      {
        question: "방어기제가 있으면 문제가 있는 건가요?",
        answer:
          "아닙니다. 방어기제는 누구에게나 있습니다. 문제는 특정 방식이 너무 굳어져서 현실 확인이나 대화를 방해할 때 생깁니다.",
      },
      {
        question: "이 테스트로 상담이 필요한지 알 수 있나요?",
        answer:
          "알 수 없습니다. 이 콘텐츠는 진단 도구가 아니며, 지속적인 고통이나 일상 기능의 어려움이 있다면 전문가 상담을 고려하는 것이 좋습니다.",
      },
      {
        question: "방어기제는 바꿀 수 있나요?",
        answer:
          "완전히 없애기보다 알아차리고 선택지를 늘리는 쪽에 가깝습니다. 내가 자주 쓰는 반응을 알면 다른 대답을 시도할 여지가 생깁니다.",
      },
    ],
    ctaHref: "/tests/defense-mechanism",
    ctaLabel: "방어기제 테스트하기",
    publisherLinkLabel: "방어기제 가이드",
    publisherLinkDescription: "결과를 진단이 아니라 마음의 보호 반응으로 읽는 방법을 설명합니다.",
  },
  {
    slug: "cognitive-distortions-seven",
    href: "/guides/cognitive-distortions-seven",
    gameId: "thinking-pattern",
    title: "인지왜곡의 대표 유형 7가지",
    metaTitle: "인지왜곡 유형 7가지와 생각 패턴 읽기 | Nolza 가이드",
    metaDescription:
      "흑백논리, 파국화, 마음읽기, 과잉일반화 등 자주 꼬이는 생각 패턴을 쉬운 예시로 설명합니다.",
    homeTitle: "인지왜곡 7가지 읽기",
    homeDescription: "생각이 사실보다 먼저 달려갈 때 나타나는 대표 패턴을 정리했습니다.",
    homeTitleEn: "Reading 7 cognitive distortions",
    homeDescriptionEn: "The main patterns that show up when thoughts race ahead of the facts.",
    intro: [
      "인지왜곡은 현실을 일부러 왜곡한다는 뜻이 아닙니다. 불안하거나 상처받은 순간에 생각이 빠르게 결론을 내리면서, 사실보다 해석이 앞서가는 상태를 말합니다.",
      "인지왜곡 테스트는 내가 어떤 방향으로 생각을 과장하거나 단정하는지 가볍게 확인하는 콘텐츠입니다. 이 가이드는 대표 유형을 쉬운 예시로 설명해 결과를 더 안전하게 읽도록 돕습니다.",
    ],
    what:
      "대표적인 인지왜곡에는 모든 일을 성공 아니면 실패로 나누는 흑백논리, 작은 문제를 최악의 결말까지 연결하는 파국화, 상대가 말하지 않은 마음을 안다고 느끼는 마음읽기, 한 번의 경험을 늘 그렇다고 확대하는 과잉일반화가 있습니다. 또 좋은 일은 우연으로 넘기고 나쁜 일만 증거로 모으는 긍정 무시, 감정이 그렇기 때문에 사실도 그렇다고 믿는 감정적 추론, 내가 모든 책임을 져야 한다고 느끼는 개인화도 자주 나타납니다.",
    how:
      "테스트를 풀 때는 각 상황에서 떠오르는 첫 생각을 기준으로 답하면 됩니다. 예를 들어 친구가 답장을 늦게 했을 때 '바쁜가 보다'보다 '내가 뭔가 잘못했나'가 먼저 떠오른다면, 그 첫 반응이 결과에 더 가깝습니다. 중요한 것은 생각을 없애는 것이 아니라, 생각과 사실 사이에 작은 간격을 만드는 것입니다.",
    interpretation:
      "결과는 정신건강 진단이 아니며, 특정 사고 패턴이 있다는 이유로 문제가 있다는 뜻도 아닙니다. 누구나 피곤하거나 불안할 때는 왜곡된 해석을 합니다. 다만 반복되는 패턴을 알면 다음번에 '지금 내가 증거를 보고 있나, 결론을 먼저 내고 있나'라고 잠깐 멈출 수 있습니다. 결과를 읽을 때는 나를 비난하지 말고, 자주 사용하는 생각의 자동완성 기능을 확인한다고 보면 좋습니다.",
    sharing:
      "친구와 결과를 비교하면 같은 상황에서도 어떤 사람은 최악을 상상하고, 어떤 사람은 자기 탓으로 돌리며, 또 다른 사람은 상대 마음을 단정한다는 차이를 볼 수 있습니다. 비교는 웃고 넘기는 데서 끝나도 좋지만, 서로에게 조심해야 할 말투를 배우는 계기가 될 수도 있습니다.",
    related: [
      { href: "/tests/thinking-pattern", title: "인지왜곡 테스트", description: "내 생각이 자주 꼬이는 방향을 확인해보세요." },
      { href: "/guides/defense-mechanism-basics", title: "방어기제란 무엇인가?", description: "생각과 감정이 나를 보호하는 방식을 함께 읽어봅니다." },
      { href: "/tests/stoic-control", title: "스토아적 통제력 테스트", description: "통제 가능한 것과 아닌 것을 구분하는 습관을 봅니다." },
    ],
    faq: [
      {
        question: "인지왜곡이 있으면 비합리적인 사람인가요?",
        answer:
          "아닙니다. 인지왜곡은 누구에게나 생깁니다. 특히 피곤하거나 불안하거나 관계에서 위협을 느낄 때 더 쉽게 나타납니다.",
      },
      {
        question: "테스트 결과로 치료가 필요한지 알 수 있나요?",
        answer:
          "알 수 없습니다. 이 콘텐츠는 자기성찰용이며, 지속적인 불안이나 우울, 일상 어려움은 전문가와 상의하는 것이 안전합니다.",
      },
      {
        question: "생각 패턴을 바꾸려면 무엇부터 하면 좋나요?",
        answer:
          "가장 먼저 떠오른 생각을 적고, 그 생각을 뒷받침하는 증거와 반대 증거를 나누어 보는 것부터 시작할 수 있습니다.",
      },
    ],
    ctaHref: "/tests/thinking-pattern",
    ctaLabel: "인지왜곡 테스트하기",
    publisherLinkLabel: "인지왜곡 가이드",
    publisherLinkDescription: "결과에 나오는 생각 패턴을 대표 유형과 함께 쉽게 읽어봅니다.",
  },
  {
    slug: "attachment-result-guide",
    href: "/guides/attachment-result-guide",
    gameId: "attachment",
    title: "애착유형 테스트 결과 읽는 법",
    metaTitle: "안정형, 불안형, 회피형, 혼란형 애착 읽기 | Nolza 가이드",
    metaDescription:
      "애착유형 테스트 결과를 낙인 없이 읽고 관계 속 반응 패턴을 이해하는 방법을 설명합니다.",
    homeTitle: "애착유형 결과 읽는 법",
    homeDescription: "안정형, 불안형, 회피형, 혼란형을 관계 반응의 언어로 풀어봅니다.",
    homeTitleEn: "How to read attachment results",
    homeDescriptionEn: "Secure, anxious, avoidant, and disorganized styles as the language of relationship reactions.",
    intro: [
      "애착유형은 관계에서 친밀감, 거리감, 불안, 독립성을 어떻게 경험하는지 설명할 때 자주 쓰이는 언어입니다. 하지만 결과 이름 하나로 사람을 고정하는 도구는 아닙니다.",
      "애착유형 테스트를 더 잘 읽으려면 '나는 어떤 사람인가'보다 '관계에서 불안해질 때 어떤 행동을 반복하는가'에 초점을 맞추는 것이 좋습니다.",
    ],
    what:
      "안정형 애착은 가까워지는 것과 혼자 있는 것 사이를 비교적 편안하게 오갑니다. 불안형 애착은 관계가 멀어질 것 같은 신호에 민감하고 확인을 자주 원할 수 있습니다. 회피형 애착은 친밀감이 커질수록 부담을 느끼고 혼자 정리할 공간을 더 필요로 할 수 있습니다. 혼란형 또는 불안-회피형 애착은 가까워지고 싶은 마음과 도망치고 싶은 마음이 동시에 나타나는 경우가 많습니다. 이 구분은 사람을 평가하기 위한 등급이 아니라 관계에서 반복되는 반응을 이해하는 지도에 가깝습니다.",
    how:
      "문항을 풀 때는 가장 최근의 관계 하나만 떠올리기보다, 여러 관계에서 반복되는 나의 기본 반응을 떠올려보세요. 연락이 줄었을 때 불안이 커지는지, 갈등이 생기면 바로 대화하고 싶은지, 오히려 멀어져야 편한지, 친해질수록 긴장이 올라오는지를 기준으로 답하면 결과가 더 자연스럽습니다.",
    interpretation:
      "결과가 불안형이나 회피형이라고 해서 잘못된 사람이 되는 것은 아닙니다. 애착 반응은 과거 경험, 현재 관계의 안전감, 스트레스 수준에 따라 달라질 수 있습니다. 결과를 읽을 때는 장점과 어려움을 함께 보세요. 불안형은 관계를 세심하게 살피는 힘이 있고, 회피형은 독립성과 자기정리를 잘할 수 있습니다. 다만 그 힘이 너무 강해질 때 어떤 오해가 생기는지 살피는 것이 중요합니다.",
    sharing:
      "연인이나 친구와 애착 결과를 비교할 때는 상대를 분석하려 하지 말고, '내가 불안할 때 필요한 말', '내가 부담스러울 때 필요한 거리'처럼 구체적인 요청으로 바꾸면 좋습니다. 결과는 관계를 판정하는 도구가 아니라 대화를 조금 쉽게 여는 카드입니다.",
    related: [
      { href: "/games/attachment", title: "애착 유형 테스트", description: "나의 관계 안정감과 거리두기 패턴을 확인합니다." },
      { href: "/guides/relationship-boundaries-meaning", title: "관계에서 선을 긋는다는 것", description: "애착과 경계의 균형을 함께 읽어봅니다." },
      { href: "/tests/breaking-point", title: "나를 차갑게 만드는 순간", description: "관계에서 마음이 닫히는 지점을 확인합니다." },
    ],
    faq: [
      {
        question: "애착유형은 평생 변하지 않나요?",
        answer:
          "고정된 딱지처럼 보기는 어렵습니다. 관계 경험, 안전한 대화, 자기 이해가 쌓이면 반응 방식도 달라질 수 있습니다.",
      },
      {
        question: "불안형이나 회피형이면 문제가 있나요?",
        answer:
          "그렇지 않습니다. 결과는 병명이나 진단이 아니며, 친밀감 앞에서 반복되는 반응을 설명하는 참고 언어입니다.",
      },
      {
        question: "상대의 애착유형을 알아내면 관계가 해결되나요?",
        answer:
          "유형만으로 해결되지는 않습니다. 서로가 어떤 상황에서 불안해지고 어떤 방식의 배려가 필요한지 대화하는 과정이 더 중요합니다.",
      },
    ],
    ctaHref: "/games/attachment",
    ctaLabel: "애착 유형 테스트하기",
    publisherLinkLabel: "애착유형 가이드",
    publisherLinkDescription: "결과 이름을 낙인 없이 관계 반응의 언어로 읽는 법을 안내합니다.",
  },
  {
    slug: "why-fear-feels-different",
    href: "/guides/why-fear-feels-different",
    gameId: "deep-fear",
    title: "공포가 사람마다 다르게 느껴지는 이유",
    metaTitle: "사람마다 다른 공포 반응 이해하기 | Nolza 가이드",
    metaDescription:
      "버려짐, 들킴, 통제 상실, 반복, 망각처럼 공포가 사람마다 다르게 느껴지는 이유를 설명합니다.",
    homeTitle: "공포가 다르게 느껴지는 이유",
    homeDescription: "괴물보다 더 무서운 것은 각자가 숨기고 있는 감정의 모양일 수 있습니다.",
    homeTitleEn: "Why fear feels different for each of us",
    homeDescriptionEn: "Scarier than any monster may be the shape of the emotion each of us hides.",
    intro: [
      "누군가는 어두운 방보다 연락이 끊기는 순간을 더 무서워하고, 누군가는 낯선 존재보다 자기 마음을 통제하지 못하는 상황을 더 두려워합니다. 공포는 단순히 무서운 이미지에 반응하는 감각이 아니라, 내가 잃고 싶지 않은 것과 연결되어 있습니다.",
      "당신 안의 가장 깊은 공포는? 테스트는 귀신이나 괴물을 맞히는 퀴즈가 아니라, 일상적인 장면 속에서 어떤 심리적 위협에 민감하게 반응하는지 읽어보는 심리 호러형 콘텐츠입니다.",
    ],
    what:
      "공포는 크게 버려질까 봐 두려운 마음, 숨긴 부분이 들킬까 봐 긴장하는 마음, 통제력을 잃을까 봐 불안한 마음, 가까운 사람을 믿지 못하는 마음처럼 여러 방향으로 나타납니다. 어떤 사람은 존재가 잊히는 것을 두려워하고, 어떤 사람은 익숙한 사람이 갑자기 낯설게 느껴지는 순간에 가장 크게 흔들립니다. 이 테스트의 결과 유형은 사용자가 고른 선택지를 바탕으로 어떤 공포 서사가 더 강하게 반응하는지 보여줍니다.",
    how:
      "문항의 상황은 일부러 거창하지 않습니다. 늦은 밤의 작은 소리, 어색한 메시지, 기억이 어긋나는 순간처럼 일상과 공포의 경계에 있는 장면을 제시합니다. 답을 고를 때는 가장 무섭게 보이는 선택지가 아니라, 내가 그 상황에 놓였을 때 실제로 먼저 떠올릴 생각에 가까운 문장을 고르세요.",
    interpretation:
      "결과는 트라우마, 공포증, 불안장애를 진단하지 않습니다. 공포의 언어를 빌린 자기성찰형 엔터테인먼트입니다. 다만 결과가 유독 마음에 남는다면, 그것은 내가 관계, 기억, 통제, 정체성 같은 주제 중 무엇에 민감한지 알려주는 단서일 수 있습니다. 무섭다는 감정은 때로 내가 지키고 싶은 것이 무엇인지 알려줍니다.",
    sharing:
      "친구와 결과를 비교하면 각자가 무서워하는 장면이 얼마나 다른지 알 수 있습니다. 누군가에게는 외로움이 가장 무섭고, 다른 사람에게는 들키는 느낌이나 반복되는 기억이 더 무서울 수 있습니다. 결과를 공유할 때는 놀리기보다 '이 장면은 진짜 싫다'고 말할 수 있는 안전한 대화로 이어가면 좋습니다.",
    related: [
      { href: "/tests/deep-fear", title: "당신 안의 가장 깊은 공포는?", description: "일상 속 선택으로 숨은 공포 패턴을 확인합니다." },
      { href: "/tests/scene-choice", title: "무의식 장면 테스트", description: "낯선 장면 속에서 먼저 보이는 마음의 방향을 봅니다." },
      { href: "/guides/noticing-avoided-emotions", title: "내가 회피하는 감정 알아차리기", description: "무서워서 피하는 감정의 신호를 읽어봅니다." },
    ],
    faq: [
      {
        question: "이 테스트는 공포증을 진단하나요?",
        answer:
          "아닙니다. 의학적 또는 심리학적 진단이 아니며, 공포 분위기를 활용한 자기성찰형 엔터테인먼트입니다.",
      },
      {
        question: "무서운 이미지나 점프스케어가 있나요?",
        answer:
          "점프스케어나 잔혹한 이미지를 목표로 하지 않습니다. 조용하고 심리적인 분위기의 문항과 결과로 구성되어 있습니다.",
      },
      {
        question: "결과가 불편하게 느껴지면 어떻게 하나요?",
        answer:
          "언제든 중단해도 됩니다. 불편함이 오래 남거나 일상에 영향을 준다면 가까운 사람이나 전문가와 이야기하는 것이 안전합니다.",
      },
    ],
    ctaHref: "/tests/deep-fear",
    ctaLabel: "깊은 공포 테스트하기",
    publisherLinkLabel: "심리적 공포 가이드",
    publisherLinkDescription: "공포 결과를 귀신 퀴즈가 아니라 마음의 민감한 주제로 읽어봅니다.",
  },
  {
    slug: "comparing-test-results-with-friends",
    href: "/guides/comparing-test-results-with-friends",
    title: "친구와 심리테스트 결과를 비교할 때 주의할 점",
    metaTitle: "심리테스트 결과를 친구와 비교할 때 좋은 대화법 | Nolza 가이드",
    metaDescription:
      "심리테스트 결과를 친구와 공유할 때 낙인, 놀림, 과한 해석을 피하고 재미있게 대화하는 방법을 안내합니다.",
    homeTitle: "친구와 결과 비교하는 법",
    homeDescription: "재미있는 테스트 결과를 대화로 이어갈 때 조심하면 좋은 지점을 정리했습니다.",
    homeTitleEn: "Comparing results with friends",
    homeDescriptionEn: "What to keep in mind when turning fun test results into a conversation.",
    intro: [
      "심리테스트는 혼자 해도 재미있지만, 친구와 비교할 때 훨씬 더 오래 이야기하게 됩니다. 같은 질문을 보고도 서로 전혀 다른 선택을 한다는 사실이 의외의 친밀감을 만들기 때문입니다.",
      "하지만 결과 이름을 가지고 상대를 단정하거나 놀리면, 가벼운 콘텐츠가 불편한 대화가 될 수 있습니다. 좋은 공유는 결과를 무기처럼 쓰지 않고 대화의 시작점으로 쓰는 것입니다.",
    ],
    what:
      "테스트 결과는 사람을 완전히 설명하지 않습니다. 특정 유형이 나왔다고 해서 그 사람이 항상 그렇게 행동한다는 뜻도 아닙니다. 결과는 문항에 답한 순간의 선택 패턴을 읽기 쉬운 이야기로 바꾼 것입니다. 따라서 친구와 비교할 때는 '너는 원래 그래'보다 '이 문장은 좀 너 같다'처럼 부드럽게 말하는 편이 좋습니다. 웃음이 생기더라도 상대가 민감해하는 주제라면 잠깐 멈추는 감각이 필요합니다.",
    how:
      "결과를 공유할 때는 먼저 내 결과에서 맞는 부분과 아닌 부분을 말해보세요. 그다음 친구에게 '너는 어느 문장이 맞아?'라고 물으면 상대가 스스로 해석할 공간이 생깁니다. 결과가 다르게 나왔을 때는 우열을 따지지 말고, 같은 상황에서 서로의 기준이 어떻게 다른지 보는 쪽이 더 재미있습니다.",
    interpretation:
      "테스트 결과는 진단, 상담, 법적 판단, 의학적 조언을 대신하지 않습니다. 특히 애착, 방어기제, 인지왜곡처럼 심리학 용어와 가까운 주제는 더 조심해서 읽어야 합니다. 콘텐츠는 자기 이해를 돕는 가벼운 언어를 제공할 뿐, 상대의 성격이나 관계의 미래를 판정하지 않습니다.",
    sharing:
      "좋은 공유는 '결과 맞아?'에서 시작해서 '어떤 상황에서 그렇게 느껴?'로 이어집니다. 이렇게 질문하면 결과가 단순한 유형표가 아니라 서로의 감정과 습관을 이해하는 작은 장면이 됩니다. 불편한 주제라면 깊게 파고들지 않고 웃고 넘기는 것도 좋은 선택입니다.",
    related: [
      { href: "/tests", title: "테스트 모아보기", description: "Nolza의 심리, 관계, 성향 테스트를 한곳에서 둘러보세요." },
      { href: "/guides/enjoy-psychology-tests-better", title: "심리테스트를 더 잘 즐기는 방법", description: "결과를 과하게 믿지 않고 재미있게 읽는 법을 소개합니다." },
      { href: "/games/kbti", title: "KBTI", description: "친구와 공유하기 좋은 한국식 성격 유형 테스트입니다." },
    ],
    faq: [
      {
        question: "친구 결과를 보고 조언해도 되나요?",
        answer:
          "상대가 원할 때만 가볍게 이야기하는 것이 좋습니다. 결과를 근거로 충고하거나 판단하면 부담이 될 수 있습니다.",
      },
      {
        question: "결과가 너무 안 맞으면 어떻게 하나요?",
        answer:
          "그 자체로 대화 주제가 됩니다. 어떤 선택 때문에 그런 결과가 나왔는지 돌아보되, 틀렸다고 몰아붙일 필요는 없습니다.",
      },
      {
        question: "결과를 SNS에 올려도 되나요?",
        answer:
          "가능하지만 이름, 생년, 관계 정보처럼 민감하게 느껴질 수 있는 입력값이 보이는지 먼저 확인하는 것이 좋습니다.",
      },
    ],
    ctaHref: "/tests",
    ctaLabel: "테스트 둘러보기",
    publisherLinkLabel: "친구와 결과 비교 가이드",
    publisherLinkDescription: "결과를 낙인 없이 재미있는 대화로 연결하는 방법을 정리했습니다.",
  },
  {
    slug: "noticing-avoided-emotions",
    href: "/guides/noticing-avoided-emotions",
    title: "내가 회피하는 감정은 어떻게 알아차릴까?",
    metaTitle: "회피하는 감정을 알아차리는 작은 신호들 | Nolza 가이드",
    metaDescription:
      "감정을 피할 때 나타나는 농담, 바쁨, 설명, 거리두기 같은 작은 신호를 살펴봅니다.",
    homeTitle: "회피하는 감정 알아차리기",
    homeDescription: "농담, 침묵, 바쁨 뒤에 숨어 있는 감정의 신호를 읽어봅니다.",
    homeTitleEn: "Noticing the emotions you avoid",
    homeDescriptionEn: "Reading the emotional signals hidden behind jokes, silence, and busyness.",
    intro: [
      "사람은 감정을 모를 때보다 너무 잘 알 것 같을 때 오히려 피하기도 합니다. 서운함을 느끼면 별일 아닌 척하고, 불안을 느끼면 바쁜 일로 덮고, 화가 나면 논리적인 설명만 길어지는 식입니다.",
      "회피는 게으름이나 차가움만을 뜻하지 않습니다. 어떤 감정은 지금 당장 느끼기 버거워서 잠시 우회로를 찾는 것에 가깝습니다.",
    ],
    what:
      "회피하는 감정은 몸과 행동에 먼저 나타나는 경우가 많습니다. 갑자기 연락을 미루거나, 중요한 이야기를 농담으로 바꾸거나, 상대가 묻기 전에 너무 많은 이유를 설명하거나, 혼자 있을 시간을 과하게 확보하려는 모습이 그 예입니다. 감정을 잘 다루는 사람도 특정 주제 앞에서는 회피할 수 있습니다. 특히 거절, 버려짐, 실패, 들킴, 무력감처럼 오래 민감했던 주제는 더 빠르게 숨고 싶어집니다.",
    how:
      "알아차림의 시작은 '내가 왜 이러지?'보다 '지금 내가 무엇을 피하려고 하지?'라는 질문입니다. 답장이 늦어질 때 정말 바쁜지, 아니면 서운하다고 말하는 장면이 부담스러운지 구분해보세요. 농담을 던진 뒤 마음이 가벼워졌는지, 더 공허해졌는지도 힌트가 됩니다. 감정 이름을 정확히 찾지 못해도 괜찮습니다. 불편함, 긴장, 무거움처럼 넓은 단어부터 시작하면 됩니다.",
    interpretation:
      "회피를 알아차린다고 해서 바로 정면으로 부딪혀야 하는 것은 아닙니다. 어떤 감정은 천천히 다뤄야 합니다. 다만 계속 피하기만 하면 내가 무엇을 원하는지, 어디에서 다쳤는지 알기 어려워집니다. 테스트 결과나 가이드는 전문 상담을 대신하지 않지만, 반복되는 회피 패턴을 관찰하는 작은 출발점이 될 수 있습니다.",
    sharing:
      "친구와 이 주제를 이야기할 때는 '너는 회피해'라고 말하기보다 '나는 이런 상황에서 농담으로 도망가더라'처럼 자기 이야기로 시작하는 편이 안전합니다. 서로가 피하는 감정을 알게 되면, 갈등이 생겼을 때 상대의 침묵을 무조건 무관심으로 해석하지 않을 수 있습니다.",
    related: [
      { href: "/guides/defense-mechanism-basics", title: "방어기제란 무엇인가?", description: "회피를 포함한 마음의 보호 반응을 설명합니다." },
      { href: "/tests/defense-mechanism", title: "방어기제 테스트", description: "불편한 감정 앞에서 내가 쓰는 반응을 확인합니다." },
      { href: "/tests/deep-fear", title: "깊은 공포 테스트", description: "내가 피하고 싶은 심리적 공포의 모양을 읽어봅니다." },
    ],
    faq: [
      {
        question: "회피는 항상 나쁜 건가요?",
        answer:
          "아닙니다. 잠시 거리를 두는 것은 감정을 안정시키는 데 도움이 될 수 있습니다. 문제는 회피가 유일한 선택지가 될 때입니다.",
      },
      {
        question: "감정을 꼭 말로 표현해야 하나요?",
        answer:
          "말이 가장 직접적일 수 있지만, 글로 적거나 잠시 시간을 요청하는 것도 표현의 한 방식입니다.",
      },
      {
        question: "회피가 너무 심하면 어떻게 하나요?",
        answer:
          "관계나 일상에 계속 영향을 준다면 신뢰할 수 있는 사람이나 전문가와 이야기하는 것이 도움이 될 수 있습니다.",
      },
    ],
    ctaHref: "/tests/defense-mechanism",
    ctaLabel: "방어기제 테스트하기",
    publisherLinkLabel: "회피 감정 가이드",
    publisherLinkDescription: "내가 피하는 감정이 행동에 어떻게 나타나는지 살펴봅니다.",
  },
  {
    slug: "relationship-boundaries-meaning",
    href: "/guides/relationship-boundaries-meaning",
    gameId: "value-conflict",
    title: "관계에서 선을 긋는다는 건 무슨 뜻일까?",
    metaTitle: "관계에서 건강한 경계와 거리두기 이해하기 | Nolza 가이드",
    metaDescription:
      "관계에서 선을 긋는 것이 차가움이나 이기심이 아니라 서로를 지키는 방식일 수 있음을 설명합니다.",
    homeTitle: "관계에서 선 긋기 이해하기",
    homeDescription: "차가움과 건강한 경계 사이의 차이를 현실적인 예시로 살펴봅니다.",
    homeTitleEn: "Understanding boundaries in relationships",
    homeDescriptionEn: "The difference between coldness and a healthy boundary, with real-life examples.",
    intro: [
      "선을 긋는다는 말은 종종 차갑게 들립니다. 하지만 건강한 경계는 상대를 밀어내기 위한 벽이 아니라, 관계를 오래 유지하기 위한 울타리에 가깝습니다.",
      "내가 감당할 수 있는 것과 없는 것을 구분하지 못하면, 처음에는 배려처럼 보여도 나중에는 억울함이나 폭발로 돌아올 수 있습니다.",
    ],
    what:
      "관계의 경계는 시간, 감정, 돈, 연락 빈도, 부탁의 범위, 사적인 정보처럼 여러 영역에 존재합니다. 예를 들어 지금은 답장할 여유가 없다고 말하는 것, 반복되는 농담이 불편하다고 알려주는 것, 도와줄 수 있는 범위를 분명히 하는 것도 경계입니다. 선을 긋는 일은 상대를 벌주는 것이 아니라 내가 관계 안에서 무너지지 않기 위한 최소한의 조건을 설명하는 일입니다.",
    how:
      "경계를 세울 때는 비난보다 상태와 요청을 함께 말하는 것이 좋습니다. '너는 왜 항상 그래?'보다 '이 이야기가 반복되면 나는 부담을 느껴. 오늘은 여기까지만 말하고 싶어'가 더 명확합니다. 처음부터 완벽하게 말할 필요는 없습니다. 중요한 것은 내가 어디에서 불편해지는지 알아차리고, 상대가 추측하지 않아도 되게 표현하는 것입니다.",
    interpretation:
      "경계를 세우는 것이 늘 좋은 결과를 보장하지는 않습니다. 어떤 사람은 서운해할 수도 있고, 관계의 기존 방식이 바뀌면서 어색함이 생길 수도 있습니다. 그러나 경계 없는 친절은 오래 지속되기 어렵습니다. 테스트 결과를 볼 때도 '나는 이기적인가'보다 '나는 어느 순간부터 내 기준을 잃는가'를 질문하면 더 도움이 됩니다.",
    sharing:
      "친구나 연인과 이 가이드를 공유할 때는 서로의 금지 목록을 만드는 것보다, 안전하게 관계를 이어가기 위한 사용설명서를 만든다고 생각하면 좋습니다. 각자의 경계를 알면 오해가 줄고, 거절이 곧 애정의 부족이라는 해석도 조금 느슨해질 수 있습니다.",
    related: [
      { href: "/tests/value-conflict", title: "가치관 충돌 테스트", description: "내가 어떤 가치 앞에서 흔들리는지 확인합니다." },
      { href: "/tests/breaking-point", title: "나를 차갑게 만드는 순간", description: "경계가 무너졌을 때 차가워지는 지점을 봅니다." },
      { href: "/guides/attachment-result-guide", title: "애착유형 결과 읽는 법", description: "친밀감과 거리감의 균형을 함께 이해합니다." },
    ],
    faq: [
      {
        question: "선을 긋는 건 이기적인 행동인가요?",
        answer:
          "아닙니다. 상대를 통제하려는 것이 아니라 내 한계를 설명하는 경계라면 관계를 더 건강하게 만들 수 있습니다.",
      },
      {
        question: "상대가 서운해하면 어떻게 하나요?",
        answer:
          "상대의 감정을 인정하되 내 경계를 바로 철회할 필요는 없습니다. 이유와 필요를 차분히 설명하는 것이 좋습니다.",
      },
      {
        question: "경계와 회피는 어떻게 다른가요?",
        answer:
          "경계는 필요한 범위를 설명하는 것이고, 회피는 설명 없이 사라지거나 감정을 계속 미루는 것에 가깝습니다.",
      },
    ],
    ctaHref: "/tests/value-conflict",
    ctaLabel: "가치관 충돌 테스트하기",
    publisherLinkLabel: "관계 경계 가이드",
    publisherLinkDescription: "결과를 차가움이 아니라 내가 지키고 싶은 기준으로 읽는 법을 안내합니다.",
  },
  {
    slug: "joseon-life-world-guide",
    href: "/guides/joseon-life-world-guide",
    gameId: "joseon",
    title: "조선 일대기 테스트 세계관 안내",
    metaTitle: "조선시대 나의 일대기 테스트 세계관 읽기 | Nolza 가이드",
    metaDescription:
      "조선시대 나의 일대기 테스트를 역사 진단이 아닌 가상 생애 기록 콘텐츠로 즐기는 방법을 안내합니다.",
    homeTitle: "조선 일대기 세계관 안내",
    homeDescription: "이름 하나로 펼쳐지는 가상 조선 생애 기록을 어떻게 즐기면 좋을지 설명합니다.",
    homeTitleEn: "A guide to the Joseon life world",
    homeDescriptionEn: "How to enjoy a fictional Joseon-era life story built from a single name.",
    intro: [
      "조선시대 나의 일대기는 이름을 바탕으로 가상의 신분, 성격, 인생 장면을 만들어보는 세계관형 테스트입니다. 역사 시험이 아니라, 조선이라는 익숙한 시대 이미지를 빌린 캐릭터 카드에 가깝습니다.",
      "이 테스트는 사용자가 한 사람의 생애 기록을 읽듯 결과를 따라가도록 구성되어 있습니다. 그래서 결과를 더 재미있게 보려면 점수보다 장면과 문장에 집중하는 편이 좋습니다.",
    ],
    what:
      "조선 일대기 결과에는 신분, 기질, 하루의 장면, 인생의 전환점 같은 요소가 포함됩니다. 이름을 입력하면 결과가 하나의 짧은 전기처럼 이어지고, 사용자는 '내가 조선에 태어났다면 어떤 사람이었을까'라는 상상을 즐길 수 있습니다. 실제 역사 고증이나 사주, 운명 판단을 제공하는 콘텐츠가 아니며, 한국적 세계관과 결과 문장을 결합한 창작형 엔터테인먼트입니다.",
    how:
      "이름은 본명, 별명, 영문 이름 모두 사용할 수 있습니다. 결과를 읽을 때는 먼저 제목과 신분을 보고, 그다음 성격 키워드와 사건 문장을 천천히 읽어보세요. 마음에 드는 문장이 있다면 친구에게 공유해 서로의 조선 캐릭터를 비교해보는 것도 좋습니다. 같은 이름은 같은 흐름의 결과가 나오도록 설계되어 있어 다시 열어도 이어지는 느낌을 줍니다.",
    interpretation:
      "결과가 양반, 장인, 상인, 선비 같은 이미지를 사용하더라도 실제 신분이나 능력을 평가하는 뜻은 아닙니다. 캐릭터 설정을 통해 나의 현재 성격을 직접 판단하기보다, 어떤 분위기의 이야기와 내가 잘 맞는지 보는 식으로 읽으면 좋습니다. 역사적 사실과 창작적 표현이 섞인 콘텐츠이므로 교육 자료나 고증 자료로 사용하기에는 적절하지 않습니다.",
    sharing:
      "친구와 결과를 비교하면 '너는 궁궐보다 장터가 어울린다', '나는 기록을 남기는 사람이네'처럼 가볍고 재치 있는 대화가 이어집니다. 결과 이미지는 SNS 스토리에 올리기 좋도록 구성되어 있으므로, 이름이 노출되어도 괜찮은지 확인한 뒤 공유하는 것이 안전합니다.",
    related: [
      { href: "/games/joseon", title: "조선시대 나의 일대기", description: "가상의 조선 생애 기록을 바로 만들어봅니다." },
      { href: "/games/joseon-couple", title: "조선시대 커플", description: "두 사람의 인연을 조선 로맨스처럼 읽어봅니다." },
      { href: "/games/korean-name", title: "다른 나라에서 태어났다면?", description: "이름과 분위기를 바탕으로 새로운 정체성을 상상합니다." },
    ],
    faq: [
      {
        question: "역사적으로 정확한 테스트인가요?",
        answer:
          "아닙니다. 조선의 분위기를 빌린 창작형 결과이며, 역사 교육이나 고증 자료가 아닙니다.",
      },
      {
        question: "본명을 넣어도 되나요?",
        answer:
          "가능하지만 결과를 공유할 때 이름이 보일 수 있으니, 부담스럽다면 별명이나 이니셜을 사용하는 것이 좋습니다.",
      },
      {
        question: "결과가 마음에 들지 않으면 다시 해도 되나요?",
        answer:
          "다른 별명이나 표기를 넣어 다른 분위기의 결과를 즐길 수 있습니다.",
      },
    ],
    ctaHref: "/games/joseon",
    ctaLabel: "조선 일대기 시작하기",
    publisherLinkLabel: "조선 일대기 세계관 가이드",
    publisherLinkDescription: "가상 생애 기록 결과를 창작형 세계관으로 읽는 방법을 안내합니다.",
  },
  {
    slug: "enjoy-psychology-tests-better",
    href: "/guides/enjoy-psychology-tests-better",
    gameId: "kbti",
    title: "재미있는 심리테스트를 더 잘 즐기는 방법",
    metaTitle: "심리테스트를 재미있고 안전하게 즐기는 법 | Nolza 가이드",
    metaDescription:
      "심리테스트 결과를 과하게 믿지 않으면서 자기 이해와 대화의 소재로 활용하는 방법을 설명합니다.",
    homeTitle: "심리테스트 더 잘 즐기기",
    homeDescription: "결과를 정답처럼 믿기보다 나와 친구를 이해하는 가벼운 언어로 사용하는 법입니다.",
    homeTitleEn: "Enjoying psychology tests better",
    homeDescriptionEn: "Using results as light language to understand yourself and friends, not as answers to trust.",
    intro: [
      "재미있는 심리테스트는 짧은 시간 안에 '나를 설명하는 문장'을 건네줍니다. 그래서 가볍게 시작했는데도 결과 한 줄이 이상하게 오래 남을 때가 있습니다.",
      "좋은 테스트 경험은 결과를 맹신하는 것이 아니라, 맞는 부분과 아닌 부분을 나누어 읽고 친구와 이야기할 수 있는 언어를 얻는 데 있습니다.",
    ],
    what:
      "심리테스트는 과학적 진단 도구와 다릅니다. Nolza의 테스트는 사용자의 선택을 바탕으로 성향, 반응, 분위기, 관계 패턴을 이야기 형식으로 정리하는 엔터테인먼트 콘텐츠입니다. 결과가 잘 맞는 것처럼 느껴지는 이유는 문항이 일상적인 갈등과 감정을 다루기 때문일 수 있습니다. 하지만 몇 개의 질문만으로 사람 전체를 설명할 수는 없으므로, 결과는 나를 완성하는 답이 아니라 생각을 여는 문장으로 읽어야 합니다.",
    how:
      "테스트를 더 잘 즐기려면 첫째, 너무 오래 고민하지 말고 실제 반응에 가까운 선택을 하세요. 둘째, 결과 중 맞는 문장과 아닌 문장을 구분하세요. 셋째, 친구와 비교할 때 상대를 놀리거나 단정하지 말고 서로의 기준을 묻는 방식으로 대화하세요. 넷째, 불편한 결과가 나왔다면 잠시 거리를 두고 필요한 부분만 참고하면 됩니다.",
    interpretation:
      "결과를 읽을 때 가장 좋은 질문은 '이게 맞아, 틀려?'가 아니라 '왜 이 문장이 나에게 걸렸지?'입니다. 어떤 문장은 정확해서 남고, 어떤 문장은 싫어서 남습니다. 둘 다 자기 이해의 단서가 될 수 있습니다. 단, 심리적 어려움이나 관계 문제를 해결해야 하는 상황이라면 테스트 결과가 아니라 실제 대화와 전문적인 도움을 우선해야 합니다.",
    sharing:
      "KBTI처럼 공유하기 쉬운 테스트는 친구와의 가벼운 대화에 잘 어울립니다. 결과 이미지를 올릴 때는 개인정보가 보이지 않는지 확인하고, 댓글에서 누군가의 성격을 단정하는 말은 피하는 것이 좋습니다. 테스트는 서로를 가두는 라벨이 아니라, 잠깐 웃고 더 물어볼 수 있게 해주는 작은 카드입니다.",
    related: [
      { href: "/games/kbti", title: "KBTI", description: "한국식 성격 유형을 가볍게 확인해보세요." },
      { href: "/guides/comparing-test-results-with-friends", title: "친구와 결과 비교하는 법", description: "공유할 때 조심하면 좋은 대화법을 정리했습니다." },
      { href: "/tests", title: "테스트 모아보기", description: "Nolza의 다양한 테스트를 둘러보세요." },
    ],
    faq: [
      {
        question: "심리테스트 결과를 믿어도 되나요?",
        answer:
          "재미와 자기성찰의 힌트로는 사용할 수 있지만, 진단이나 중요한 결정의 근거로 사용하면 안 됩니다.",
      },
      {
        question: "친구와 결과가 다르면 누가 더 맞는 건가요?",
        answer:
          "우열의 문제가 아닙니다. 같은 상황을 다르게 받아들이는 방식을 비교하는 것이 더 자연스럽습니다.",
      },
      {
        question: "결과를 자주 해도 되나요?",
        answer:
          "가능합니다. 다만 그날의 기분에 따라 선택이 달라질 수 있으므로 결과 변화도 가볍게 즐기는 편이 좋습니다.",
      },
    ],
    ctaHref: "/games/kbti",
    ctaLabel: "KBTI 테스트하기",
    publisherLinkLabel: "심리테스트 즐기는 법",
    publisherLinkDescription: "KBTI 결과를 라벨이 아니라 대화의 시작점으로 읽는 법을 안내합니다.",
  },
];

export const GUIDE_PATHS = GUIDES.map((guide) => guide.href);

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

export function getGuideByGameId(gameId: string) {
  return GUIDES.find((guide) => guide.gameId === gameId) ?? null;
}
