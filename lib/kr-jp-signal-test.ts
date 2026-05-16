export type SignalLocale = "ko" | "en" | "ja";

export type PerspectiveId = "korean" | "japanese" | "curious";

export type SignalDimension =
  | "signalSense"
  | "cultureContext"
  | "directnessBalance"
  | "overthinking";

export type SignalScores = Record<SignalDimension, number>;

export type LocalText = Record<SignalLocale, string>;

export type PerspectiveOption = {
  id: PerspectiveId;
  label: LocalText;
  caption: LocalText;
};

export type SignalChoice = {
  id: string;
  label: LocalText;
  tone: LocalText;
  scores: Partial<SignalScores>;
};

export type SignalScenario = {
  id: string;
  theme: LocalText;
  situation: LocalText;
  phrase: string;
  meaning: LocalText;
  question: LocalText;
  bestChoiceId: string;
  explanation: LocalText;
  choices: SignalChoice[];
};

export type SignalResultId =
  | "translator"
  | "kDirect"
  | "jSubtle"
  | "detective"
  | "confused";

export type SignalResult = {
  id: SignalResultId;
  name: LocalText;
  subtitle: LocalText;
  description: LocalText;
  strength: LocalText;
  weakPoint: LocalText;
  shareLine: LocalText;
  advice: LocalText;
  accent: string;
};

export const SIGNAL_LOCALE_LABELS: Record<SignalLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export const SIGNAL_COPY = {
  title: {
    ko: "이거 호감임? 문화차이임?",
    en: "Is This a Signal or a Culture Difference?",
    ja: "これって脈あり？文化の違い？",
  },
  subtitle: {
    ko: "한국과 일본 사이에서 자주 생기는 말투, 답장, 약속, 거리감의 신호를 얼마나 잘 읽는지 테스트해보세요.",
    en: "Test how well you read subtle signals, replies, plans, and social distance between Korean and Japanese communication styles.",
    ja: "韓国と日本の会話、返信、約束、距離感に隠れたサインをどれくらい読めるか診断してみましょう。",
  },
  start: {
    ko: "테스트 시작하기",
    en: "Start the test",
    ja: "診断を始める",
  },
  disclaimer: {
    ko: "이 테스트는 재미용입니다. 실제 상대의 마음을 단정하지 않아요.",
    en: "This is for fun and does not determine anyone's real feelings.",
    ja: "この診断はエンタメ用です。相手の本当の気持ちを断定するものではありません。",
  },
  perspectiveTitle: {
    ko: "나는 어떤 문화가 더 익숙한가요?",
    en: "Which perspective feels closest?",
    ja: "どの文化によりなじみがありますか？",
  },
  questionCount: {
    ko: "12개 상황",
    en: "12 scenarios",
    ja: "12のシーン",
  },
  meaningLabel: {
    ko: "뜻",
    en: "Meaning",
    ja: "意味",
  },
  resultLabel: {
    ko: "나의 문화 신호 읽기 결과",
    en: "Your culture signal result",
    ja: "あなたの文化サイン診断結果",
  },
  scoreLabel: {
    ko: "문화 신호 읽기 점수",
    en: "Culture signal reading score",
    ja: "文化サイン読解スコア",
  },
  explanationLabel: {
    ko: "해설",
    en: "Explanation",
    ja: "解説",
  },
  next: {
    ko: "다음 상황",
    en: "Next scenario",
    ja: "次のシーン",
  },
  finish: {
    ko: "결과 보기",
    en: "See result",
    ja: "結果を見る",
  },
  retry: {
    ko: "다시 하기",
    en: "Retry",
    ja: "もう一度やる",
  },
  share: {
    ko: "친구에게 공유하기",
    en: "Share with a friend",
    ja: "友達にシェア",
  },
  copied: {
    ko: "공유 문구 복사됨",
    en: "Copied share text",
    ja: "シェア文をコピーしました",
  },
  saveImage: {
    ko: "결과 이미지 저장",
    en: "Save result image",
    ja: "結果画像を保存",
  },
  best: {
    ko: "가장 안전한 해석",
    en: "Safest read",
    ja: "一番安全な解釈",
  },
  related: {
    ko: "다음에 해볼 만한 테스트",
    en: "Try another test",
    ja: "他の診断も見る",
  },
} satisfies Record<string, LocalText>;

export const SIGNAL_PERSPECTIVES: PerspectiveOption[] = [
  {
    id: "korean",
    label: {
      ko: "나는 한국 문화가 더 익숙해요",
      en: "I'm more familiar with Korean culture",
      ja: "韓国文化の方がなじみがあります",
    },
    caption: {
      ko: "빠른 친밀감, 직접적인 말투, 구체적인 약속 신호가 비교적 익숙한 편이에요.",
      en: "Quick closeness, direct warmth, and concrete plans may feel more natural to you.",
      ja: "早い距離の縮まり方や、直接的な表現に比較的なじみがあるタイプです。",
    },
  },
  {
    id: "japanese",
    label: {
      ko: "나는 일본 문화가 더 익숙해요",
      en: "I'm more familiar with Japanese culture",
      ja: "日本文化の方がなじみがあります",
    },
    caption: {
      ko: "완곡한 표현, 분위기, 거리감 조절을 먼저 읽는 편일 수 있어요.",
      en: "Indirect wording, atmosphere, and social distance may stand out to you first.",
      ja: "遠回しな表現、空気感、距離感の調整を先に読むタイプかもしれません。",
    },
  },
  {
    id: "curious",
    label: {
      ko: "그냥 궁금해서 해볼래요",
      en: "I'm just curious",
      ja: "ただ気になるのでやってみます",
    },
    caption: {
      ko: "정답 맞히기보다 오해를 줄이는 감각을 가볍게 확인하는 모드예요.",
      en: "You are here for fun, but avoiding misunderstandings sounds useful.",
      ja: "正解探しというより、誤解を減らす感覚を気軽に見るモードです。",
    },
  },
];

export const SIGNAL_RESULTS: Record<SignalResultId, SignalResult> = {
  translator: {
    id: "translator",
    name: { ko: "눈치 만렙 통역가", en: "Signal Translator", ja: "空気読みマスター" },
    subtitle: {
      ko: "호감, 예의, 문화차이를 꽤 잘 구분하는 타입",
      en: "You separate interest, manners, and culture pretty well",
      ja: "好意、礼儀、文化差をかなり上手に見分けるタイプ",
    },
    description: {
      ko: "당신은 작은 신호 하나에 바로 흔들리기보다 맥락을 보고 판단하는 편이에요. 답장 속도, 말투, 약속의 구체성, 거리감을 한 번에 묶어 읽습니다.",
      en: "You do not jump at every tiny cue. You read reply speed, wording, plans, and social distance as one full context.",
      ja: "小さなサインだけで決めつけず、文脈全体を見て判断するタイプです。返信速度、言い方、約束の具体性、距離感をまとめて読みます。",
    },
    strength: {
      ko: "상대의 말투를 단정하지 않고 상황 전체를 봅니다.",
      en: "You avoid snap judgments and read the whole situation.",
      ja: "相手の言葉を決めつけず、状況全体を見ます。",
    },
    weakPoint: {
      ko: "가끔은 너무 신중해서 타이밍을 놓칠 수 있어요.",
      en: "You can be so careful that the timing slips away.",
      ja: "慎重すぎてタイミングを逃すことがあります。",
    },
    shareLine: {
      ko: "나는 한일 문화 신호 읽기에서 눈치 만렙 통역가 나왔다.",
      en: "I got Signal Translator on the Korea-Japan culture signal test.",
      ja: "韓日文化サイン診断で空気読みマスターが出た。",
    },
    advice: {
      ko: "좋은 질문 하나를 가볍게 던지는 것이 당신의 진짜 장점입니다.",
      en: "Your real skill is asking one calm clarifying question.",
      ja: "やさしく確認する一言が、あなたの本当の強みです。",
    },
    accent: "#6ee7b7",
  },
  kDirect: {
    id: "kDirect",
    name: { ko: "K-직진 해석러", en: "K-Direct Reader", ja: "K直進リーダー" },
    subtitle: {
      ko: "빠른 친밀감과 솔직한 표현에 강한 타입",
      en: "Strong with fast closeness and direct warmth",
      ja: "早い親しさとストレートな表現に強いタイプ",
    },
    description: {
      ko: "당신은 빠른 답장, 편한 말투, 직접적인 제안에 반응을 잘합니다. 다만 완곡한 거절이나 부담을 줄이는 표현은 가끔 진짜 가능성처럼 들릴 수 있어요.",
      en: "You read fast replies, casual wording, and direct invitations well. Soft refusals can sometimes sound more hopeful than they are.",
      ja: "早い返信、気軽な言葉、直接的な誘いに強いタイプです。ただし、遠回しな断りを期待のサインとして読んでしまうこともあります。",
    },
    strength: {
      ko: "솔직한 신호와 빠른 관계 변화에 강합니다.",
      en: "You catch direct signals and fast changes in closeness.",
      ja: "ストレートなサインと距離の変化に強いです。",
    },
    weakPoint: {
      ko: "간접 거절이나 조심스러운 표현을 놓칠 수 있어요.",
      en: "You may miss indirect refusals or cautious wording.",
      ja: "遠回しな断りや慎重な表現を見落とすことがあります。",
    },
    shareLine: {
      ko: "나는 K-직진 해석러래. 완곡한 표현은 아직 어렵다.",
      en: "I got K-Direct Reader. Indirect wording is still hard.",
      ja: "K直進リーダーだった。遠回し表現はまだ難しい。",
    },
    advice: {
      ko: "날짜, 장소, 다음 행동이 구체적인지 보면 과몰입을 줄일 수 있어요.",
      en: "Check whether the date, place, and next step are concrete.",
      ja: "日付、場所、次の行動が具体的かを見ると読みすぎを減らせます。",
    },
    accent: "#f59e0b",
  },
  jSubtle: {
    id: "jSubtle",
    name: { ko: "J-완곡 신호 감지러", en: "J-Subtle Signal Reader", ja: "J遠回しセンサー" },
    subtitle: {
      ko: "조심스러운 말투와 거리감을 섬세하게 보는 타입",
      en: "Sensitive to wording, softness, and social distance",
      ja: "言い回し、やわらかさ、距離感に敏感なタイプ",
    },
    description: {
      ko: "당신은 조심스러운 말투, 예의 표현, 부담을 줄이는 문장을 잘 감지합니다. 분위기 읽기는 좋지만, 단순한 친절도 깊은 신호처럼 해석할 수 있어요.",
      en: "You notice careful wording, politeness, and softened refusals. You read the room well, but simple kindness can become a deep puzzle.",
      ja: "慎重な言い方、礼儀表現、負担を減らす言葉をよく読み取ります。ただ、単なる親切も深いサインに見えることがあります。",
    },
    strength: {
      ko: "부드러운 거절, 예의 표현, 거리감을 잘 감지합니다.",
      en: "You detect soft refusals, manners, and distance well.",
      ja: "やんわりした断り、礼儀、距離感をよく察知します。",
    },
    weakPoint: {
      ko: "가끔 단순한 표현도 너무 깊게 읽을 수 있어요.",
      en: "You may read too much into a simple phrase.",
      ja: "シンプルな言葉も深読みしすぎることがあります。",
    },
    shareLine: {
      ko: "나는 J-완곡 신호 감지러 나왔다. 말 한마디도 그냥 못 넘김.",
      en: "I got J-Subtle Signal Reader. I cannot let one phrase pass.",
      ja: "J遠回しセンサーだった。一言もそのまま流せない。",
    },
    advice: {
      ko: "뉘앙스는 살리되, 확인은 가볍고 구체적으로 해보세요.",
      en: "Keep the nuance, then confirm lightly and concretely.",
      ja: "ニュアンスは大事にしつつ、確認は軽く具体的にしてみましょう。",
    },
    accent: "#8b5cf6",
  },
  detective: {
    id: "detective",
    name: { ko: "썸 과몰입 탐정", en: "Overthinking Detective", ja: "深読み探偵" },
    subtitle: {
      ko: "답장 하나로 마음의 사건 파일을 여는 타입",
      en: "You open a case file from one reply",
      ja: "返信ひとつで事件ファイルを開くタイプ",
    },
    description: {
      ko: "당신은 디테일을 잘 보지만, 그 디테일이 너무 빨리 로맨스, 거절, 전략으로 확장될 때가 있어요. 재미는 확실하지만 머리가 조금 바쁩니다.",
      en: "You notice details, then sometimes expand them into romance, rejection, or strategy too quickly. Fun, but mentally busy.",
      ja: "細かいところによく気づきますが、それを恋愛、拒否、駆け引きに広げすぎることがあります。楽しいけれど頭が忙しいタイプです。",
    },
    strength: {
      ko: "디테일을 잘 봅니다.",
      en: "You notice small details.",
      ja: "細かい変化によく気づきます。",
    },
    weakPoint: {
      ko: "호감, 예의, 습관을 헷갈릴 수 있어요.",
      en: "You may mix up interest, manners, and habit.",
      ja: "好意、礼儀、習慣を混同しやすいです。",
    },
    shareLine: {
      ko: "나는 썸 과몰입 탐정 나왔다. 답장 하나로 논문 씀.",
      en: "I got Overthinking Detective. One reply becomes a thesis.",
      ja: "深読み探偵だった。返信ひとつで論文が書ける。",
    },
    advice: {
      ko: "한 번 숨 쉬고, 신호보다 반복 패턴을 보세요.",
      en: "Breathe once. Look for patterns, not one-off signals.",
      ja: "一度深呼吸して、単発のサインより繰り返しのパターンを見ましょう。",
    },
    accent: "#fb7185",
  },
  confused: {
    id: "confused",
    name: { ko: "문화차이 혼돈러", en: "Culture Confusion Type", ja: "文化差迷子" },
    subtitle: {
      ko: "호감인지 예의인지 아직 로딩 중인 타입",
      en: "Still loading: interest, manners, or culture?",
      ja: "好意なのか礼儀なのか、まだ読み込み中のタイプ",
    },
    description: {
      ko: "당신은 아직 한일 말투와 거리감의 차이가 조금 헷갈리는 타입입니다. 하지만 열린 마음으로 배우는 속도가 빠르기 때문에 테스트를 할수록 감각이 좋아집니다.",
      en: "Korean-Japanese wording and distance still feel a little blurry. The good news: you are open, so you learn quickly.",
      ja: "韓日間の言葉や距離感の違いが、まだ少しぼんやりしているタイプです。でも、オープンなので学ぶのは早いです。",
    },
    strength: {
      ko: "새로운 문화 차이를 열린 마음으로 받아들입니다.",
      en: "You are open to unfamiliar cultural nuance.",
      ja: "新しい文化差をオープンに受け止められます。",
    },
    weakPoint: {
      ko: "너무 빨리 결론을 내리면 오해할 수 있어요.",
      en: "Fast conclusions can create misunderstandings.",
      ja: "急いで結論を出すと誤解しやすいです。",
    },
    shareLine: {
      ko: "나는 문화차이 혼돈러래. 이거 호감인지 예의인지 아직 모르겠음.",
      en: "I got Culture Confusion Type. Signal or manners? Still not sure.",
      ja: "文化差迷子だった。脈ありか礼儀か、まだわからない。",
    },
    advice: {
      ko: "헷갈릴수록 단정 대신 맥락을 하나 더 보는 습관이 좋아요.",
      en: "When confused, add one more context clue before deciding.",
      ja: "迷ったときほど、決めつけず文脈をもう一つ見ましょう。",
    },
    accent: "#38bdf8",
  },
};

const choice = (
  id: string,
  label: LocalText,
  tone: LocalText,
  scores: Partial<SignalScores>,
): SignalChoice => ({ id, label, tone, scores });

export const SIGNAL_SCENARIOS: SignalScenario[] = [
  {
    id: "jp-mata-kondo",
    theme: { ko: "약속 온도", en: "Plan temperature", ja: "約束の温度" },
    situation: {
      ko: "일본 친구가 약속 얘기 중에 이렇게 말했어요.",
      en: "Your Japanese friend says this while talking about plans.",
      ja: "約束の話をしているとき、相手がこう言いました。",
    },
    phrase: "また今度ね",
    meaning: {
      ko: "다음에 보자 / 다음에 하자",
      en: "Maybe next time / Let's do it another time",
      ja: "また別の機会に、という意味",
    },
    question: {
      ko: "이 말이 나왔을 때 가장 안전한 해석은?",
      en: "What is the safest interpretation?",
      ja: "この言葉の一番安全な解釈は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "일본어에서는 직접 거절보다 부드럽게 미루는 표현이 쓰일 때가 있어요. 물론 진짜 다음을 의미할 수도 있지만, 확정 신호로 보긴 어려워요.",
      en: "It can softly postpone instead of directly refusing. It may mean next time for real, but it is not a confirmed plan by itself.",
      ja: "本当に次の機会を意味する場合もありますが、やんわり断っている可能性もあります。これだけで確定とは言いにくい表現です。",
    },
    choices: [
      choice("a", { ko: "무조건 다음 약속을 잡자는 뜻", en: "They definitely want to make plans", ja: "必ず次の約束をしたいという意味" }, { ko: "너무 확정적으로 보는 선택", en: "Too certain", ja: "少し決めつけすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "진짜일 수도 있지만, 부드러운 거절일 수도 있음", en: "It could be real, but it might also be a soft refusal", ja: "本当の場合もあるが、やんわり断っている可能性もある" }, { ko: "맥락을 보는 선택", en: "Context-aware choice", ja: "文脈を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "확실한 호감 신호", en: "It is a clear romantic signal", ja: "はっきりした好意のサイン" }, { ko: "로맨스로 너무 빨리 점프", en: "Romance jump", ja: "恋愛に寄せすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "화난 상태", en: "They are angry", ja: "怒っている" }, { ko: "근거 없는 긴장 해석", en: "Unneeded alarm", ja: "警戒しすぎ" }, { overthinking: 2 }),
    ],
  },
  {
    id: "kr-bap",
    theme: { ko: "밥 약속", en: "Meal talk", ja: "ご飯の約束" },
    situation: {
      ko: "한국 친구가 헤어지기 전에 이렇게 말했어요.",
      en: "Your Korean friend says this before saying goodbye.",
      ja: "韓国の友達が別れ際にこう言いました。",
    },
    phrase: "언제 밥 한번 먹자",
    meaning: {
      ko: "언젠가 식사하자 / 다음에 밥 먹자",
      en: "Let's grab a meal sometime",
      ja: "今度ご飯でも食べよう",
    },
    question: {
      ko: "이건 무조건 실제 약속일까요?",
      en: "Does this always mean a concrete plan?",
      ja: "この言葉は必ず具体的な約束という意味でしょうか？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "한국어에서 이 말은 친근한 인사처럼 쓰일 수도 있고, 진짜 약속 제안일 수도 있어요. 날짜를 구체적으로 잡는지 보면 더 안전합니다.",
      en: "In Korean, it can be a friendly social phrase or a real invitation. A specific date or place makes it much more concrete.",
      ja: "韓国語では親しみのある挨拶のように使われることも、本当の誘いの場合もあります。日付が具体的かがポイントです。",
    },
    choices: [
      choice("a", { ko: "무조건 날짜를 잡자는 뜻", en: "They definitely want to set a date", ja: "必ず日程を決めたいという意味" }, { ko: "너무 문자 그대로 봄", en: "Too literal", ja: "文字通りすぎる" }, { overthinking: 1 }),
      choice("b", { ko: "친근한 인사일 수도 있고 실제 약속일 수도 있음", en: "It could be friendly talk or a real plan", ja: "親しみの表現の場合も、実際の約束の場合もある" }, { ko: "구체성을 확인하는 선택", en: "Looks for concreteness", ja: "具体性を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "거절의 표현", en: "It is a refusal", ja: "断りの表現" }, { ko: "너무 차갑게 봄", en: "Too cold", ja: "冷たく読みすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っているという意味" }, { ko: "상황과 맞지 않음", en: "Doesn't match the situation", ja: "状況に合わない" }, { overthinking: 2 }),
    ],
  },
  {
    id: "kr-keke",
    theme: { ko: "짧은 답장", en: "Short reply", ja: "短い返信" },
    situation: {
      ko: "상대가 긴 말 없이 답장 끝에 이것만 보냈어요.",
      en: "The other person replies with only this at the end.",
      ja: "相手が返信の最後にこれだけ送りました。",
    },
    phrase: "ㅋㅋ",
    meaning: {
      ko: "웃음 / 가벼운 반응 / 분위기 완화",
      en: "Korean text laughter, like 'haha' or a light reaction",
      ja: "韓国語の笑い表現。「笑」「www」に近い軽い反応",
    },
    question: {
      ko: "가장 안전한 해석은?",
      en: "What is the safest interpretation?",
      ja: "一番安全な解釈は？",
    },
    bestChoiceId: "c",
    explanation: {
      ko: "ㅋㅋ는 웃음, 어색함 완화, 대화 유지 등 여러 의미로 쓰여요. 이것만으로 호감이나 거절을 판단하긴 어려워요.",
      en: "It can mean laughter, awkwardness-softening, or simply keeping the mood light. It does not decide interest by itself.",
      ja: "笑い、気まずさの緩和、軽い相づちなど、いろいろな意味で使われます。これだけで好意や拒否は判断しにくいです。",
    },
    choices: [
      choice("a", { ko: "무조건 관심 없음", en: "They are definitely not interested", ja: "必ず興味がない" }, { ko: "너무 빨리 결론", en: "Too quick to conclude", ja: "結論が早すぎる" }, { overthinking: 3 }),
      choice("b", { ko: "무조건 호감", en: "They definitely like me", ja: "必ず好意がある" }, { ko: "희망 쪽으로 과해석", en: "Too hopeful", ja: "期待しすぎ" }, { overthinking: 3 }),
      choice("c", { ko: "분위기를 부드럽게 넘기는 짧은 반응일 수 있음", en: "It may be a short reaction to keep things light", ja: "雰囲気を軽くする短い反応かもしれない" }, { ko: "균형 잡힌 선택", en: "Balanced choice", ja: "バランスのよい選択" }, { signalSense: 3, directnessBalance: 3 }),
      choice("d", { ko: "싸우자는 뜻", en: "They want to fight", ja: "けんかしたいという意味" }, { ko: "드라마 과열", en: "Drama overload", ja: "ドラマ化しすぎ" }, { overthinking: 2 }),
    ],
  },
  {
    id: "jp-daijoubu",
    theme: { ko: "괜찮다는 말", en: "The word 'okay'", ja: "大丈夫の読み方" },
    situation: {
      ko: "일본 친구가 제안이나 도움 앞에서 계속 이렇게 말해요.",
      en: "Your Japanese friend keeps saying this when you offer help or suggest something.",
      ja: "提案や手伝いの場面で、相手が何度もこう言いました。",
    },
    phrase: "大丈夫です",
    meaning: {
      ko: "괜찮아요 / 괜찮습니다",
      en: "It's okay / I'm fine / No thank you, depending on context",
      ja: "大丈夫です。文脈によって「不要です」「遠慮します」にもなる",
    },
    question: {
      ko: "가장 조심해야 할 점은?",
      en: "What should you be careful about?",
      ja: "一番気をつけたい点は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "상황에 따라 진짜 괜찮다는 뜻일 수도 있지만, 필요 없다거나 정중히 사양한다는 뜻일 수도 있어요. 맥락과 표정이 중요합니다.",
      en: "Depending on context, it can mean truly okay, no need, or politely declining. Context and tone matter.",
      ja: "本当に大丈夫という意味の場合もありますが、「必要ありません」「遠慮します」に近いこともあります。文脈が大事です。",
    },
    choices: [
      choice("a", { ko: "항상 진짜 괜찮다는 뜻", en: "It always means they are truly fine", ja: "いつも本当に大丈夫という意味" }, { ko: "너무 문자 그대로 봄", en: "Too literal", ja: "文字通りすぎる" }, { directnessBalance: 1 }),
      choice("b", { ko: "괜찮다는 뜻일 수도 있지만, 거절이나 부담 없음 표현일 수도 있음", en: "It may mean okay, but it may also be a polite refusal", ja: "大丈夫の場合もあるが、遠慮や断りの可能性もある" }, { ko: "맥락을 확인하는 선택", en: "Context check", ja: "文脈を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "무조건 화났다는 뜻", en: "They are definitely angry", ja: "必ず怒っている" }, { ko: "긴장 과열", en: "Tension spike", ja: "警戒しすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "무조건 친해지고 싶다는 뜻", en: "They definitely want to get closer", ja: "必ず親しくなりたいという意味" }, { ko: "너무 빠른 결론", en: "Too fast", ja: "早すぎる結論" }, { overthinking: 2 }),
    ],
  },
  {
    id: "kr-banmal",
    theme: { ko: "말투 변화", en: "Speech level", ja: "話し方の変化" },
    situation: {
      ko: "한국 친구가 갑자기 더 편한 말투로 바꿨어요.",
      en: "Your Korean friend suddenly switches to more casual speech.",
      ja: "韓国の友達が急にカジュアルな話し方に変わりました。",
    },
    phrase: "이제 말 편하게 해도 돼?",
    meaning: {
      ko: "존댓말보다 편한 말투로 해도 될까?",
      en: "Can we speak more casually now?",
      ja: "これからもっとくだけた話し方にしてもいい？",
    },
    question: {
      ko: "가능한 의미는?",
      en: "What could it mean?",
      ja: "考えられる意味は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "한국어에서는 말투 변화가 관계 거리감과 연결되는 경우가 많아요. 갑작스럽다면 당황할 수 있지만, 친근함의 표현일 수도 있어요.",
      en: "In Korean, speech level often connects to closeness. It can feel sudden, but it may be an attempt to feel closer.",
      ja: "韓国語では話し方の変化が距離感と結びつくことが多いです。突然だと戸惑いますが、親しさの表現の場合もあります。",
    },
    choices: [
      choice("a", { ko: "무조건 무례함", en: "Definitely rude", ja: "必ず失礼" }, { ko: "너무 단정적인 선택", en: "Too fixed", ja: "決めつけすぎ" }, { overthinking: 1 }),
      choice("b", { ko: "친해졌다고 느껴서 거리감을 줄인 것일 수 있음", en: "They may feel closer and want to reduce distance", ja: "親しくなったと感じて距離を縮めたいのかもしれない" }, { ko: "관계 거리감을 보는 선택", en: "Closeness cue", ja: "距離感を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "관계를 끊자는 뜻", en: "They want to end the relationship", ja: "関係を終わらせたいという意味" }, { ko: "너무 극단적", en: "Too extreme", ja: "極端すぎる" }, { overthinking: 3 }),
      choice("d", { ko: "아무 의미 없음", en: "It has no meaning", ja: "特に意味はない" }, { ko: "신호를 너무 지움", en: "Signal ignored", ja: "サインを消しすぎ" }, { directnessBalance: 1 }),
    ],
  },
  {
    id: "jp-emoji",
    theme: { ko: "이모티콘 온도", en: "Emoji warmth", ja: "絵文字の温度" },
    situation: {
      ko: "일본 친구가 메시지에 느낌표와 이모티콘을 많이 써요.",
      en: "Your Japanese friend uses many exclamation marks and emojis.",
      ja: "日本の友達がメッセージに感嘆符や絵文字をよく使います。",
    },
    phrase: "ありがとう〜！😊",
    meaning: {
      ko: "고마워! 라는 밝고 부드러운 표현",
      en: "Thank you! A bright and friendly message",
      ja: "ありがとう！という明るくやわらかい表現",
    },
    question: {
      ko: "가장 좋은 해석은?",
      en: "What is the safest read?",
      ja: "一番安全な読み方は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "이모티콘이나 느낌표는 친절함과 분위기 완화를 위해 자주 쓰일 수 있어요. 이것만으로 호감을 단정하면 과몰입일 수 있어요.",
      en: "They can be used for friendliness and softening the tone. By themselves, they do not prove romantic interest.",
      ja: "絵文字や感嘆符は、親しさややわらかさを出すためによく使われます。これだけで恋愛感情とは断定できません。",
    },
    choices: [
      choice("a", { ko: "무조건 연애 감정", en: "Definitely romantic", ja: "必ず恋愛感情" }, { ko: "로맨스 과속", en: "Crush sprint", ja: "恋愛に寄せすぎ" }, { overthinking: 3 }),
      choice("b", { ko: "친절하고 분위기를 부드럽게 만드는 표현일 수 있음", en: "A friendly way to soften the mood", ja: "親切で雰囲気をやわらかくする表現かもしれない" }, { ko: "균형 잡힌 해석", en: "Balanced read", ja: "バランスのよい解釈" }, { signalSense: 3, cultureContext: 2, directnessBalance: 2 }),
      choice("c", { ko: "비꼬는 뜻", en: "It is sarcasm", ja: "皮肉の意味" }, { ko: "의심이 너무 큼", en: "Too suspicious", ja: "疑いすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "대화 끝내자는 뜻", en: "They want to end the chat", ja: "会話を終わらせたい" }, { ko: "너무 차갑게 봄", en: "Too bleak", ja: "冷たく見すぎ" }, { overthinking: 1 }),
    ],
  },
  {
    id: "kr-get-home",
    theme: { ko: "도착 연락", en: "Get-home text", ja: "帰宅連絡" },
    situation: {
      ko: "한국 친구가 밤에 헤어지면서 이렇게 말했어요.",
      en: "Your Korean friend says this when you part ways at night.",
      ja: "韓国の友達が夜に別れるとき、こう言いました。",
    },
    phrase: "집 가면 연락해",
    meaning: {
      ko: "집에 도착하면 알려줘",
      en: "Text me when you get home",
      ja: "家に着いたら連絡して",
    },
    question: {
      ko: "가능한 느낌은?",
      en: "What could it feel like?",
      ja: "考えられるニュアンスは？",
    },
    bestChoiceId: "a",
    explanation: {
      ko: "가까운 사이에서 안전하게 도착했는지 확인하는 말로 자주 쓰여요. 친근함이나 배려로 볼 수 있습니다.",
      en: "Among close people, it often checks that you arrived safely. It can be care and warmth.",
      ja: "近い関係では、無事に着いたかを確認する言葉としてよく使われます。気遣いや親しさと見られます。",
    },
    choices: [
      choice("a", { ko: "걱정과 친근함의 표현일 수 있음", en: "It can show care and closeness", ja: "心配や親しさの表現かもしれない" }, { ko: "따뜻한 맥락을 보는 선택", en: "Warm cue", ja: "温かい文脈を見る選択" }, { signalSense: 3, cultureContext: 2, directnessBalance: 2 }),
      choice("b", { ko: "감시하려는 뜻", en: "They want to monitor you", ja: "監視したいという意味" }, { ko: "너무 스릴러처럼 봄", en: "Thriller read", ja: "スリラー化しすぎ" }, { overthinking: 3 }),
      choice("c", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っている" }, { ko: "상황과 맞지 않음", en: "Too much twist", ja: "ひねりすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "의미 없음", en: "It means nothing", ja: "意味はない" }, { ko: "배려 신호를 지움", en: "Cue ignored", ja: "サインを消しすぎ" }, { directnessBalance: 1 }),
    ],
  },
  {
    id: "jp-muzukashii",
    theme: { ko: "완곡한 거절", en: "Soft refusal", ja: "遠回しな断り" },
    situation: {
      ko: "일본 친구가 직접 거절하지 않고 이렇게 말했어요.",
      en: "Your Japanese friend says this instead of directly refusing.",
      ja: "日本の友達が直接断らずにこう言いました。",
    },
    phrase: "ちょっと難しいかも",
    meaning: {
      ko: "조금 어려울지도 몰라",
      en: "It might be a little difficult",
      ja: "少し難しいかもしれない",
    },
    question: {
      ko: "가장 가까운 의미는?",
      en: "What is the closest meaning?",
      ja: "一番近い意味は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "조금 어렵다는 표현은 부드럽게 거절하거나 부담을 줄이는 방식일 수 있어요.",
      en: "This can be a softened refusal or a way to reduce pressure.",
      ja: "「少し難しいかも」は、やんわり断る表現として使われることがあります。",
    },
    choices: [
      choice("a", { ko: "가능성이 아주 높음", en: "It is very likely possible", ja: "可能性がとても高い" }, { ko: "희망 쪽으로 기울어짐", en: "Too hopeful", ja: "期待しすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "사실상 어렵다는 완곡한 표현일 수 있음", en: "It may softly mean it is difficult", ja: "実質的には難しいという遠回しな表現かもしれない" }, { ko: "완곡함을 감지하는 선택", en: "Soft-no detected", ja: "遠回しさを見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "무조건 장난", en: "It is definitely a joke", ja: "必ず冗談" }, { ko: "너무 가볍게 봄", en: "Too light", ja: "軽く見すぎ" }, { directnessBalance: 1 }),
      choice("d", { ko: "확실한 호감", en: "A sure sign of interest", ja: "確実な好意" }, { ko: "고백 예고편처럼 봄", en: "Romance trailer", ja: "恋愛に寄せすぎ" }, { overthinking: 3 }),
    ],
  },
  {
    id: "kr-slow-reply",
    theme: { ko: "답장 속도", en: "Reply speed", ja: "返信速度" },
    situation: {
      ko: "한국 친구가 답장이 빠르다가 갑자기 느려졌어요.",
      en: "Your Korean friend used to reply fast, then suddenly slowed down.",
      ja: "韓国の友達の返信が早かったのに、急に遅くなりました。",
    },
    phrase: "미안, 오늘 좀 정신없었어",
    meaning: {
      ko: "미안해, 오늘 바쁘고 여유가 없었어",
      en: "Sorry, today was hectic",
      ja: "ごめん、今日はちょっとバタバタしてた",
    },
    question: {
      ko: "가장 안전한 해석은?",
      en: "What is the safest read?",
      ja: "一番安全な解釈は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "답장 속도만으로 마음을 판단하긴 어려워요. 일정, 피로, 상황 변화 등 다양한 이유가 있을 수 있습니다.",
      en: "Reply speed alone cannot decide feelings. Work, fatigue, or changed circumstances can all matter.",
      ja: "返信速度だけで気持ちは判断できません。忙しさ、疲れ、状況の変化など、いろいろな理由があります。",
    },
    choices: [
      choice("a", { ko: "무조건 마음이 식음", en: "They definitely lost interest", ja: "必ず気持ちが冷めた" }, { ko: "너무 빠른 엔딩", en: "Ending declared", ja: "結論が早すぎる" }, { overthinking: 3 }),
      choice("b", { ko: "바쁘거나 상황이 바뀌었을 수 있음", en: "They may be busy or circumstances changed", ja: "忙しい、または状況が変わったのかもしれない" }, { ko: "현실적인 선택", en: "Reality check", ja: "現実的な選択" }, { signalSense: 3, directnessBalance: 3 }),
      choice("c", { ko: "무조건 밀당", en: "Definitely playing hard to get", ja: "必ず駆け引き" }, { ko: "연애 각본처럼 봄", en: "Romance script", ja: "恋愛脚本化しすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "무조건 화남", en: "Definitely angry", ja: "必ず怒っている" }, { ko: "위기 연출", en: "Alarm mode", ja: "警戒しすぎ" }, { overthinking: 2 }),
    ],
  },
  {
    id: "jp-gift",
    theme: { ko: "선물 반응", en: "Gift reaction", ja: "プレゼントの反応" },
    situation: {
      ko: "일본 친구가 선물을 받고 이렇게 말했어요.",
      en: "Your Japanese friend receives a gift and says this.",
      ja: "日本の友達がプレゼントを受け取ってこう言いました。",
    },
    phrase: "気を遣わせてごめんね",
    meaning: {
      ko: "신경 쓰게 해서 미안해",
      en: "Sorry for making you go out of your way",
      ja: "気を遣わせてごめんね",
    },
    question: {
      ko: "가장 가까운 느낌은?",
      en: "What is the closest feeling?",
      ja: "一番近いニュアンスは？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "상대의 배려에 고마워하면서도 나 때문에 신경 쓰게 한 것 같아 미안하다는 예의 표현일 수 있어요.",
      en: "It can express gratitude while also feeling sorry that you made the effort.",
      ja: "ありがたい気持ちと同時に、気を遣わせて申し訳ないという礼儀表現の場合があります。",
    },
    choices: [
      choice("a", { ko: "선물이 싫다는 뜻", en: "They dislike the gift", ja: "プレゼントが嫌だったという意味" }, { ko: "너무 부정적으로 봄", en: "Too negative", ja: "否定的に読みすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "고마우면서도 부담을 준 것 같아 미안하다는 예의 표현", en: "Grateful, but politely sorry you made the effort", ja: "ありがたいけれど、気を遣わせて申し訳ないという礼儀表現" }, { ko: "예의 맥락을 보는 선택", en: "Manners read", ja: "礼儀の文脈を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っている" }, { ko: "반응 과열", en: "Overheated", ja: "読みすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "다시는 선물하지 말라는 뜻", en: "Never give a gift again", ja: "二度と贈らないでという意味" }, { ko: "극단적인 해석", en: "Extreme read", ja: "極端な解釈" }, { overthinking: 3 }),
    ],
  },
  {
    id: "jp-read-later",
    theme: { ko: "읽고 답장", en: "Read receipt", ja: "既読と返信" },
    situation: {
      ko: "일본 친구가 메시지를 읽은 뒤 몇 시간 후 이렇게 답했어요.",
      en: "Your Japanese friend reads your message, then replies a few hours later.",
      ja: "日本の友達がメッセージを読んで、数時間後にこう返しました。",
    },
    phrase: "返信遅くなってごめんね",
    meaning: {
      ko: "답장 늦어서 미안해",
      en: "Sorry for the late reply",
      ja: "返信が遅くなってごめんね",
    },
    question: {
      ko: "가장 덜 위험한 판단은?",
      en: "What is the least risky judgment?",
      ja: "一番リスクの少ない判断は？",
    },
    bestChoiceId: "c",
    explanation: {
      ko: "읽고 바로 답하지 못하는 상황은 많아요. 단정하기보다 반복 패턴과 대화의 질을 함께 보는 편이 안전합니다.",
      en: "There are many reasons someone reads first and replies later. Look at repeated patterns and conversation quality.",
      ja: "読んですぐ返せない理由はいろいろあります。決めつけず、繰り返しのパターンや会話の質を見るのが安全です。",
    },
    choices: [
      choice("a", { ko: "관계 끝", en: "The relationship is over", ja: "関係は終わり" }, { ko: "엔딩을 너무 빨리 냄", en: "Final episode", ja: "最終回にしすぎ" }, { overthinking: 3 }),
      choice("b", { ko: "나를 시험하는 중", en: "They are testing me", ja: "こちらを試している" }, { ko: "추리 모드 과열", en: "Mind game mode", ja: "駆け引き化しすぎ" }, { overthinking: 3 }),
      choice("c", { ko: "바로 답하기 어려웠을 수 있으니 반복 패턴을 봄", en: "Maybe they could not reply, so check patterns", ja: "すぐ返せなかった可能性もあるので、パターンを見る" }, { ko: "침착한 선택", en: "Calm read", ja: "落ち着いた判断" }, { signalSense: 3, directnessBalance: 3 }),
      choice("d", { ko: "호감이라 일부러 늦춘 것", en: "They delayed it because they like me", ja: "好意があるからわざと遅らせた" }, { ko: "스토리 과열", en: "Story overload", ja: "物語化しすぎ" }, { overthinking: 3 }),
    ],
  },
  {
    id: "kr-sunbae",
    theme: { ko: "호칭과 거리", en: "Names and distance", ja: "呼び方と距離" },
    situation: {
      ko: "한국 친구가 친해진 뒤 이렇게 불러도 되냐고 물었어요.",
      en: "After getting closer, your Korean friend asks if they can call you this.",
      ja: "韓国の友達が親しくなったあと、こう呼んでもいいか聞きました。",
    },
    phrase: "이제 이름으로 불러도 돼?",
    meaning: {
      ko: "이제 더 편하게 이름으로 불러도 될까?",
      en: "Can I call you by your name now?",
      ja: "これから名前で呼んでもいい？",
    },
    question: {
      ko: "가장 자연스러운 해석은?",
      en: "What is the most natural read?",
      ja: "一番自然な解釈は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "한국어에서는 호칭이 관계 거리감과 연결되는 경우가 많아요. 이름으로 부르는 건 더 편한 관계로 가고 싶다는 신호일 수 있습니다.",
      en: "In Korean, how you address someone often marks distance. Using a name can be a move toward a more comfortable relationship.",
      ja: "韓国語では呼び方が距離感と結びつくことが多いです。名前で呼ぶのは、より気軽な関係へのサインかもしれません。",
    },
    choices: [
      choice("a", { ko: "무조건 무례한 행동", en: "It is definitely rude", ja: "必ず失礼な行動" }, { ko: "맥락을 빼고 봄", en: "Context missing", ja: "文脈を見落とし" }, { overthinking: 2 }),
      choice("b", { ko: "거리감을 조금 줄이고 싶다는 신호일 수 있음", en: "It may signal wanting a bit less distance", ja: "少し距離を縮めたいサインかもしれない" }, { ko: "관계 변화를 보는 선택", en: "Closeness shift", ja: "距離の変化を見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "확실한 고백 직전", en: "A confession is definitely coming", ja: "必ず告白の直前" }, { ko: "로맨스 급발진", en: "Romance jump", ja: "恋愛に寄せすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "상대가 화났다는 뜻", en: "They are angry", ja: "相手が怒っているという意味" }, { ko: "상황과 맞지 않음", en: "Doesn't fit", ja: "状況に合わない" }, { overthinking: 2 }),
    ],
  },
  {
    id: "jp-hima",
    theme: { ko: "가벼운 제안", en: "Casual invitation", ja: "軽い誘い" },
    situation: {
      ko: "일본 친구가 주말 얘기 중에 이렇게 말했어요.",
      en: "Your Japanese friend says this while talking about the weekend.",
      ja: "日本の友達が週末の話の中でこう言いました。",
    },
    phrase: "もし暇だったら",
    meaning: {
      ko: "혹시 시간 괜찮으면 / 혹시 한가하면",
      en: "If you're free / if you happen to have time",
      ja: "もし時間があれば",
    },
    question: {
      ko: "이 표현에서 봐야 할 포인트는?",
      en: "What should you notice in this expression?",
      ja: "この表現で見るべきポイントは？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "부담을 줄이기 위해 조건을 붙이는 표현일 수 있어요. 관심이 전혀 없다는 뜻도, 확정 약속이라는 뜻도 아닙니다.",
      en: "The condition can soften pressure. It does not mean zero interest, but it is also not a confirmed plan.",
      ja: "相手に負担をかけないための条件表現かもしれません。興味なしとも、確定の約束とも限りません。",
    },
    choices: [
      choice("a", { ko: "상대가 전혀 관심 없다는 뜻", en: "They have no interest at all", ja: "まったく興味がないという意味" }, { ko: "너무 차갑게 봄", en: "Too cold", ja: "冷たく読みすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "부담을 줄이면서 가능성을 열어둔 표현일 수 있음", en: "It may leave room while reducing pressure", ja: "負担を減らしつつ可能性を残す表現かもしれない" }, { ko: "완곡한 제안을 읽는 선택", en: "Soft invitation read", ja: "やわらかい誘いを見る選択" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "이미 약속이 확정됐다는 뜻", en: "The plan is already confirmed", ja: "もう約束が確定している" }, { ko: "확정으로 너무 빨리 봄", en: "Too confirmed", ja: "確定にしすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "상대가 일부러 헷갈리게 하는 뜻", en: "They are intentionally confusing me", ja: "わざと混乱させている" }, { ko: "의심 모드", en: "Suspicion mode", ja: "疑いすぎ" }, { overthinking: 3 }),
    ],
  },
  {
    id: "confirm-next",
    theme: { ko: "오해 방지", en: "Avoiding misunderstanding", ja: "誤解を減らす" },
    situation: {
      ko: "상대의 말이 호감인지 예의인지 애매해요. 이럴 때 할 수 있는 말은?",
      en: "You cannot tell if the other person's words mean interest or manners. What can you say next?",
      ja: "相手の言葉が好意なのか礼儀なのか曖昧です。次にどう聞くのがよいでしょう？",
    },
    phrase: "그럼 다음 주에 시간 괜찮은 날 있어?",
    meaning: {
      ko: "구체적으로 다음 약속 가능성을 확인하는 말",
      en: "A concrete way to ask whether a next plan is possible",
      ja: "次の約束が可能か、具体的に確認する言い方",
    },
    question: {
      ko: "이런 확인 방식의 장점은?",
      en: "What is the benefit of this kind of check?",
      ja: "この確認のよい点は？",
    },
    bestChoiceId: "a",
    explanation: {
      ko: "가볍고 구체적인 확인은 오해를 줄여요. 단정하거나 떠보기보다 다음 행동을 명확하게 묻는 편이 안전합니다.",
      en: "A light, concrete check reduces misunderstanding. Ask about the next step instead of testing or assuming.",
      ja: "軽く具体的に確認すると誤解を減らせます。試したり決めつけたりせず、次の行動を明確に聞くのが安全です。",
    },
    choices: [
      choice("a", { ko: "상대의 마음을 단정하지 않고 다음 행동을 확인할 수 있음", en: "It checks the next step without assuming feelings", ja: "気持ちを決めつけず、次の行動を確認できる" }, { ko: "가장 안전한 선택", en: "Safest choice", ja: "一番安全な選択" }, { signalSense: 4, cultureContext: 2, directnessBalance: 3 }),
      choice("b", { ko: "하루 종일 답장 시간만 분석하는 것보다 덜 피곤함", en: "It is less exhausting than analyzing reply times all day", ja: "一日中返信時間を分析するより疲れにくい" }, { ko: "맞는 말이지만 핵심은 아님", en: "True, but not the main point", ja: "正しいが核心ではない" }, { signalSense: 1, overthinking: 1 }),
      choice("c", { ko: "호감이라고 확정할 수 있음", en: "It proves they like me", ja: "好意が確定する" }, { ko: "확정이 너무 빠름", en: "Too much certainty", ja: "確定にしすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "상대를 시험할 수 있음", en: "It lets me test them", ja: "相手を試せる" }, { ko: "관계를 게임처럼 봄", en: "Mind-game mode", ja: "駆け引きにしすぎ" }, { overthinking: 3 }),
    ],
  },
];

export function emptySignalScores(): SignalScores {
  return {
    signalSense: 0,
    cultureContext: 0,
    directnessBalance: 0,
    overthinking: 0,
  };
}

export function calculateSignalResult(
  choices: SignalChoice[],
  perspective: PerspectiveId | null,
) {
  const scores = choices.reduce<SignalScores>((total, selectedChoice) => {
    (Object.entries(selectedChoice.scores) as Array<[SignalDimension, number]>).forEach(([key, value]) => {
      total[key] += value;
    });
    return total;
  }, emptySignalScores());

  if (perspective === "korean") scores.directnessBalance += 1;
  if (perspective === "japanese") scores.cultureContext += 1;
  if (perspective === "curious") scores.signalSense += 1;

  const correctCount = choices.filter((selectedChoice, index) => selectedChoice.id === SIGNAL_SCENARIOS[index]?.bestChoiceId).length;
  const readingScore = Math.min(
    100,
    Math.max(
      12,
      Math.round(correctCount * 6.5 + scores.signalSense * 1.15 + scores.cultureContext * 1.05 + scores.directnessBalance * 0.9 - scores.overthinking * 0.45),
    ),
  );

  let resultId: SignalResultId = "confused";
  if (scores.signalSense >= 24 && scores.cultureContext >= 20 && scores.overthinking <= 10) {
    resultId = "translator";
  } else if (scores.overthinking >= 20) {
    resultId = "detective";
  } else if (scores.cultureContext >= scores.directnessBalance + 5) {
    resultId = "jSubtle";
  } else if (scores.directnessBalance >= scores.cultureContext + 3) {
    resultId = "kDirect";
  } else if (readingScore >= 70) {
    resultId = "translator";
  }

  return {
    scores,
    correctCount,
    readingScore,
    result: SIGNAL_RESULTS[resultId],
  };
}
