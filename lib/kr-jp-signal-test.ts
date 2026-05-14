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
    en: "Test how well you read the subtle signals, replies, plans, and social distance between Korean and Japanese communication styles.",
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
    ja: "12のシナリオ",
  },
  resultLabel: {
    ko: "나의 문화 신호 판독 결과",
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
    ja: "次のシナリオ",
  },
  finish: {
    ko: "결과 보기",
    en: "See result",
    ja: "結果を見る",
  },
  retry: {
    ko: "다시 하기",
    en: "Retry",
    ja: "もう一度",
  },
  share: {
    ko: "친구에게 공유하기",
    en: "Share with a friend",
    ja: "友だちにシェア",
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
    ja: "いちばん安全な読み方",
  },
  related: {
    ko: "다음에 해볼 만한 테스트",
    en: "Try another test",
    ja: "次におすすめの診断",
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
      ko: "빠른 친밀감, 직접적인 말투, 구체적인 약속 신호를 자연스럽게 읽는 편이에요.",
      en: "You may read quick closeness and direct warmth more naturally.",
      ja: "早い距離の縮まり方や、はっきりした表現を自然に読みやすいタイプです。",
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
      ko: "완곡한 표현, 분위기, 거리감 조절을 먼저 살피는 편이에요.",
      en: "You may notice indirect wording and social distance first.",
      ja: "遠回しな表現や空気感、距離感の変化に気づきやすいタイプです。",
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
      ko: "정답보다 오해를 줄이는 감각을 재미있게 확인해보는 모드예요.",
      en: "You are here for the fun, but avoiding misunderstandings sounds useful.",
      ja: "正解探しより、誤解を減らす感覚を楽しく見てみるモードです。",
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
      ko: "당신은 작은 신호 하나에 바로 흔들리기보다 맥락을 보고 판단하는 편이에요. 답장 속도, 말투, 약속의 구체성, 거리감을 한 장면으로 묶어 읽습니다.",
      en: "You do not jump at every tiny cue. You read reply speed, wording, plans, and social distance as one full context.",
      ja: "小さなサインひとつで決めつけず、文脈全体を見て判断するタイプです。返信速度、言葉遣い、約束の具体性、距離感をまとめて読めます。",
    },
    strength: {
      ko: "상대의 말투를 단정하지 않고 상황 전체를 봅니다.",
      en: "You avoid snap judgments and read the whole situation.",
      ja: "相手の言葉を決めつけず、状況全体を見られます。",
    },
    weakPoint: {
      ko: "가끔은 너무 신중해서 타이밍을 놓칠 수 있어요.",
      en: "You can be so careful that the timing slips away.",
      ja: "慎重すぎて、たまにタイミングを逃すことがあります。",
    },
    shareLine: {
      ko: "나는 한일 문화 신호 읽기에서 눈치 만렙 통역가 나왔다.",
      en: "I got Signal Translator on the Korea-Japan culture signal test.",
      ja: "韓日文化サイン診断で空気読みマスターが出た。",
    },
    advice: {
      ko: "좋은 질문 하나를 가볍게 던지는 것이 당신의 진짜 장점입니다.",
      en: "Your real skill is asking one calm clarifying question.",
      ja: "軽く確認する一言が、あなたの本当の強みです。",
    },
    accent: "#6ee7b7",
  },
  kDirect: {
    id: "kDirect",
    name: { ko: "K-직진 해석러", en: "K-Direct Reader", ja: "K直進リーダー" },
    subtitle: {
      ko: "빠른 친밀감과 솔직한 표현에 강한 타입",
      en: "Strong with fast closeness and direct warmth",
      ja: "早い親密さとストレートな表現に強いタイプ",
    },
    description: {
      ko: "당신은 빠른 답장, 편한 말투, 직접적인 약속 제안에 반응을 잘합니다. 다만 완곡한 거절이나 부담을 줄이는 표현은 가끔 진짜 가능성처럼 들릴 수 있어요.",
      en: "You read fast replies, casual wording, and direct invitations well. Soft refusals can sometimes sound more hopeful than they are.",
      ja: "返信の速さ、親しげな言葉、直接的な誘いを読み取るのが得意です。ただし、遠回しな断りが希望のサインに聞こえることもあります。",
    },
    strength: {
      ko: "솔직한 신호와 빠른 관계 변화에 강합니다.",
      en: "You catch direct signals and fast changes in closeness.",
      ja: "率直なサインや距離の縮まり方に強いです。",
    },
    weakPoint: {
      ko: "간접 거절이나 조심스러운 표현을 놓칠 수 있어요.",
      en: "You may miss indirect refusals or cautious wording.",
      ja: "遠回しな断りや慎重な表現を見落とすことがあります。",
    },
    shareLine: {
      ko: "나는 K-직진 해석러래. 완곡한 표현은 아직 어렵다.",
      en: "I got K-Direct Reader. Indirect wording is still hard.",
      ja: "K直進リーダーだった。遠回しな表現はまだ難しい。",
    },
    advice: {
      ko: "날짜, 장소, 다음 행동이 구체적인지 보면 과몰입을 줄일 수 있어요.",
      en: "Check whether the date, place, and next step are concrete.",
      ja: "日時、場所、次の行動が具体的かを見ると読みすぎを減らせます。",
    },
    accent: "#f59e0b",
  },
  jSubtle: {
    id: "jSubtle",
    name: { ko: "J-완곡 신호 감지러", en: "J-Subtle Signal Reader", ja: "J遠回しセンサー" },
    subtitle: {
      ko: "조심스러운 말투와 거리감을 섬세하게 보는 타입",
      en: "Sensitive to wording, softness, and social distance",
      ja: "遠回しな言葉と距離感を繊細に見るタイプ",
    },
    description: {
      ko: "당신은 조심스러운 말투, 예의 표현, 부담을 줄이는 문장을 잘 감지합니다. 분위기 읽기는 좋지만, 가끔 단순한 친절도 깊은 퍼즐처럼 해석할 수 있어요.",
      en: "You notice careful wording, politeness, and softened refusals. You read the room well, but simple kindness can become a deep puzzle.",
      ja: "慎重な言い方、礼儀表現、やわらかい断りをよく感知します。空気は読めますが、普通の親切まで深読みすることがあります。",
    },
    strength: {
      ko: "부드러운 거절, 예의 표현, 거리감을 잘 감지합니다.",
      en: "You detect soft refusals, manners, and distance well.",
      ja: "やわらかい断り、礼儀表現、距離感をよく察知します。",
    },
    weakPoint: {
      ko: "가끔 단순한 표현도 너무 깊게 읽을 수 있어요.",
      en: "You may read too much into a simple phrase.",
      ja: "シンプルな言葉まで深く読みすぎることがあります。",
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
      ja: "細かいところに気づけますが、それを恋愛、断り、駆け引きに広げるのが少し早いことがあります。楽しいけれど、頭は忙しめです。",
    },
    strength: {
      ko: "디테일을 잘 봅니다.",
      en: "You notice small details.",
      ja: "細かいディテールによく気づきます。",
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
      ja: "好意か礼儀か、まだ読み込み中のタイプ",
    },
    description: {
      ko: "당신은 아직 한일 말투와 거리감의 차이가 조금 헷갈리는 타입입니다. 하지만 열린 마음으로 배우는 속도가 빠르기 때문에, 테스트를 할수록 감각이 살아납니다.",
      en: "Korean-Japanese wording and distance still feel a little blurry. The good news: you are open, so you learn quickly.",
      ja: "韓日間の言葉遣いや距離感の違いが、まだ少しぼんやりしているタイプです。でも開かれた姿勢があるので、すぐに感覚が育ちます。",
    },
    strength: {
      ko: "새로운 문화 차이를 열린 마음으로 받아들입니다.",
      en: "You are open to unfamiliar cultural nuance.",
      ja: "新しい文化の違いを素直に受け入れられます。",
    },
    weakPoint: {
      ko: "너무 빨리 결론을 내리면 오해할 수 있어요.",
      en: "Fast conclusions can create misunderstandings.",
      ja: "結論を急ぐと誤解につながることがあります。",
    },
    shareLine: {
      ko: "나는 문화차이 혼돈러래. 이거 호감인지 예의인지 아직 모르겠음.",
      en: "I got Culture Confusion Type. Signal or manners? Still not sure.",
      ja: "文化差迷子だった。脈ありなのか礼儀なのか、まだ分からない。",
    },
    advice: {
      ko: "헷갈릴수록 단정 대신 맥락을 하나 더 보는 습관이 좋아요.",
      en: "When confused, add one more context clue before deciding.",
      ja: "迷ったら決めつけず、文脈をもう一つ足して見てみましょう。",
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
      ko: '일본 친구가 약속 얘기 중에 "また今度ね"라고 했어요. 가장 안전한 해석은?',
      en: 'A Japanese friend says "mata kondo ne" while talking about plans. What is the safest read?',
      ja: "日本の友だちが約束の話で「また今度ね」と言いました。いちばん安全な読み方は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "직접 거절보다 부드럽게 미루는 표현일 수 있어요. 물론 진짜 다음을 의미할 수도 있지만, 확정 신호로 보긴 어려워요.",
      en: "It can softly postpone instead of directly refusing. It may mean next time for real, but it is not a confirmed plan by itself.",
      ja: "直接断る代わりに、やわらかく先延ばしにする表現のことがあります。本当に次回を意味する場合もありますが、確定した約束とは限りません。",
    },
    choices: [
      choice("a", { ko: "무조건 다음 약속을 잡자는 뜻", en: "Definitely a real next plan", ja: "必ず次の約束をしようという意味" }, { ko: "확신 과다", en: "Too certain", ja: "確信しすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "진짜일 수도 있지만, 부드러운 거절일 수도 있음", en: "Could be real, but could be a soft no", ja: "本気かもしれないけど、やわらかい断りかも" }, { ko: "맥락형", en: "Context reader", ja: "文脈重視" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "확실한 호감 신호", en: "A sure romantic signal", ja: "確実な脈ありサイン" }, { ko: "로맨스 급발진", en: "Romance jump", ja: "恋愛ジャンプ" }, { overthinking: 3 }),
      choice("d", { ko: "화난 상태", en: "They are angry", ja: "怒っている状態" }, { ko: "드라마 전개", en: "Drama mode", ja: "ドラマ展開" }, { overthinking: 2 }),
    ],
  },
  {
    id: "kr-bap",
    theme: { ko: "밥 약속", en: "Meal talk", ja: "ご飯の約束" },
    situation: {
      ko: '한국 친구가 "언제 밥 한번 먹자"라고 했어요. 이건 무조건 실제 약속일까요?',
      en: 'A Korean friend says, "Let\'s grab a meal sometime." Is it always an actual plan?',
      ja: "韓国の友だちが「いつかご飯食べよう」と言いました。これは必ず本当の約束？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "친근한 인사처럼 쓰일 수도 있고 진짜 약속일 수도 있어요. 날짜와 장소가 구체화되는지 보는 게 안전합니다.",
      en: "It can be friendly warmth or a real invitation. The safe clue is whether a date and place become concrete.",
      ja: "親しみのある挨拶のように使われることも、本当の誘いであることもあります。日時や場所が具体的になるかを見るのが安全です。",
    },
    choices: [
      choice("a", { ko: "무조건 날짜를 잡자는 뜻", en: "It definitely means set a date", ja: "必ず日程を決めようという意味" }, { ko: "캘린더 직행", en: "Calendar jump", ja: "予定表直行" }, { directnessBalance: 1, overthinking: 1 }),
      choice("b", { ko: "친근한 인사일 수도 있고 실제 약속일 수도 있음", en: "It may be friendly talk or a real plan", ja: "親しみの表現か、本当の約束かもしれない" }, { ko: "균형 감각", en: "Balanced read", ja: "バランス型" }, { signalSense: 3, cultureContext: 2, directnessBalance: 3 }),
      choice("c", { ko: "거절의 표현", en: "It means refusal", ja: "断りの表現" }, { ko: "거리두기 과해석", en: "Too distant", ja: "距離を読みすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っているという意味" }, { ko: "장르 변경", en: "Genre shift", ja: "ジャンル変更" }, { overthinking: 3 }),
    ],
  },
  {
    id: "kk-only",
    theme: { ko: "짧은 웃음", en: "Short laugh", ja: "短い笑い" },
    situation: {
      ko: '상대가 답장 끝에 "ㅋㅋ"만 보냈어요. 가장 안전한 해석은?',
      en: 'They only added "ㅋㅋ" at the end of a reply. What is the safest read?',
      ja: "相手が返信の最後に「ㅋㅋ」だけ送りました。いちばん安全な読み方は？",
    },
    bestChoiceId: "c",
    explanation: {
      ko: '"ㅋㅋ"는 웃음, 어색함 완화, 대화 유지 등 여러 의미로 쓰여요. 이것만으로 호감이나 거절을 판단하긴 어려워요.',
      en: 'It can mean laughter, softening awkwardness, or keeping the chat light. It cannot prove interest or rejection by itself.',
      ja: "「ㅋㅋ」は笑い、気まずさの緩和、会話を軽く続ける表現など、いろいろな意味があります。これだけで好意や拒否は判断しにくいです。",
    },
    choices: [
      choice("a", { ko: "무조건 관심 없음", en: "Definitely no interest", ja: "絶対に興味なし" }, { ko: "차단급 단정", en: "Hard no", ja: "決めつけすぎ" }, { overthinking: 3 }),
      choice("b", { ko: "무조건 호감", en: "Definitely interest", ja: "絶対に脈あり" }, { ko: "희망회로", en: "Hope engine", ja: "期待しすぎ" }, { overthinking: 3 }),
      choice("c", { ko: "분위기를 부드럽게 넘기는 짧은 반응일 수 있음", en: "It may be a short reaction to soften the mood", ja: "雰囲気をやわらげる短い反応かもしれない" }, { ko: "현실 체크", en: "Reality check", ja: "現実チェック" }, { signalSense: 3, directnessBalance: 2 }),
      choice("d", { ko: "싸우자는 뜻", en: "They want to fight", ja: "けんかしたいという意味" }, { ko: "장르 폭주", en: "Plot twist", ja: "展開が急" }, { overthinking: 2 }),
    ],
  },
  {
    id: "jp-daijoubu",
    theme: { ko: "괜찮다는 말", en: "Saying okay", ja: "大丈夫の幅" },
    situation: {
      ko: '일본 친구가 계속 "大丈夫です"라고 해요. 가장 조심해야 할 점은?',
      en: 'A Japanese friend keeps saying "daijoubu desu." What should you be careful about?',
      ja: "日本の友だちがずっと「大丈夫です」と言っています。注意したい点は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: '"大丈夫です"는 상황에 따라 괜찮다, 필요 없다, 사양한다는 의미로도 들릴 수 있어요. 맥락이 중요합니다.',
      en: "Depending on context, it can mean okay, no need, or politely declining. Context and tone matter.",
      ja: "「大丈夫です」は状況によって、平気です、必要ありません、遠慮します、という意味にもなります。文脈が大事です。",
    },
    choices: [
      choice("a", { ko: "항상 진짜 괜찮다는 뜻", en: "It always means truly okay", ja: "いつも本当に大丈夫という意味" }, { ko: "문자 그대로", en: "Too literal", ja: "文字通りすぎ" }, { directnessBalance: 1 }),
      choice("b", { ko: "괜찮다는 뜻일 수도 있지만, 거절이나 부담 없음 표현일 수도 있음", en: "Could mean okay, refusal, or no need", ja: "大丈夫、断り、不要の表現かもしれない" }, { ko: "맥락 체크", en: "Context check", ja: "文脈チェック" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "무조건 화났다는 뜻", en: "They are definitely angry", ja: "必ず怒っているという意味" }, { ko: "긴장 과열", en: "Tension spike", ja: "緊張しすぎ" }, { overthinking: 3 }),
      choice("d", { ko: "무조건 친해지고 싶다는 뜻", en: "They definitely want to get closer", ja: "必ず仲良くなりたいという意味" }, { ko: "과속", en: "Too fast", ja: "早すぎ" }, { overthinking: 2 }),
    ],
  },
  {
    id: "kr-banmal",
    theme: { ko: "말투 변화", en: "Speech level", ja: "話し方の変化" },
    situation: {
      ko: "한국 친구가 갑자기 반말을 쓰기 시작했어요. 가능한 의미는?",
      en: "A Korean friend suddenly starts speaking casually. What could it mean?",
      ja: "韓国の友だちが急にタメ口を使い始めました。ありえる意味は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "한국어에서는 말투 변화가 관계 거리감과 연결되는 경우가 많아요. 갑작스럽다면 당황할 수 있지만, 친근함의 표현일 수도 있어요.",
      en: "In Korean, speech level often connects to closeness. It can feel sudden, but it may be an attempt to feel closer.",
      ja: "韓国語では話し方の変化が距離感とつながることが多いです。急だと戸惑いますが、親しさの表現かもしれません。",
    },
    choices: [
      choice("a", { ko: "무조건 무례함", en: "Definitely rude", ja: "絶対に失礼" }, { ko: "단호박", en: "Too fixed", ja: "決めつけ" }, { overthinking: 1 }),
      choice("b", { ko: "친해졌다고 느껴서 거리감을 줄인 것일 수 있음", en: "They may feel closer and reduce distance", ja: "親しくなったと感じて距離を縮めたのかも" }, { ko: "관계 신호", en: "Closeness cue", ja: "距離感サイン" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "관계를 끊자는 뜻", en: "They want to end the relationship", ja: "関係を終わらせたいという意味" }, { ko: "급종료", en: "Hard ending", ja: "急終了" }, { overthinking: 3 }),
      choice("d", { ko: "아무 의미 없음", en: "It has no meaning", ja: "何の意味もない" }, { ko: "신호 삭제", en: "Signal ignored", ja: "サイン無視" }, { directnessBalance: 1 }),
    ],
  },
  {
    id: "jp-emoji",
    theme: { ko: "이모티콘 온도", en: "Emoji warmth", ja: "絵文字の温度" },
    situation: {
      ko: "일본 친구가 메시지에 느낌표와 이모티콘을 많이 써요. 가장 좋은 해석은?",
      en: "A Japanese friend uses many exclamation marks and emojis. What is the safest read?",
      ja: "日本の友だちがメッセージに感嘆符や絵文字をたくさん使います。いちばん良い読み方は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "친절함과 분위기 완화를 위해 자주 쓰일 수 있어요. 이것만으로 호감을 단정하면 과몰입일 수 있어요.",
      en: "They can be used for friendliness and softening the tone. By themselves, they do not prove romantic interest.",
      ja: "親切さや雰囲気をやわらげるためによく使われます。それだけで好意だと決めると読みすぎかもしれません。",
    },
    choices: [
      choice("a", { ko: "무조건 연애 감정", en: "Definitely romantic", ja: "絶対に恋愛感情" }, { ko: "설렘 과속", en: "Crush sprint", ja: "ときめき加速" }, { overthinking: 3 }),
      choice("b", { ko: "친절하고 분위기를 부드럽게 만드는 표현일 수 있음", en: "A friendly way to soften the mood", ja: "親切で雰囲気をやわらげる表現かも" }, { ko: "균형 해석", en: "Balanced read", ja: "バランス型" }, { signalSense: 3, cultureContext: 2, directnessBalance: 2 }),
      choice("c", { ko: "비꼬는 뜻", en: "It is sarcasm", ja: "皮肉の意味" }, { ko: "의심 모드", en: "Suspicion mode", ja: "疑いモード" }, { overthinking: 2 }),
      choice("d", { ko: "대화 끝내자는 뜻", en: "They want to end the chat", ja: "会話を終わらせたい意味" }, { ko: "너무 차분함", en: "Too bleak", ja: "暗く読みすぎ" }, { overthinking: 1 }),
    ],
  },
  {
    id: "kr-get-home",
    theme: { ko: "도착 연락", en: "Get-home text", ja: "帰宅連絡" },
    situation: {
      ko: '한국 친구가 "집 가면 연락해"라고 했어요. 가능한 느낌은?',
      en: 'A Korean friend says, "Text me when you get home." What could it feel like?',
      ja: "韓国の友だちが「家に着いたら連絡して」と言いました。ありえるニュアンスは？",
    },
    bestChoiceId: "a",
    explanation: {
      ko: "가까운 사이에서 안전하게 도착했는지 확인하는 말로 자주 쓰여요. 친근함이나 배려로 볼 수 있습니다.",
      en: "Among close people, it often checks that you arrived safely. It can be care and warmth.",
      ja: "近い関係では、無事に帰ったか確認する言葉としてよく使われます。親しさや気遣いとして見られます。",
    },
    choices: [
      choice("a", { ko: "걱정과 친근함의 표현일 수 있음", en: "It can show care and closeness", ja: "心配や親しさの表現かもしれない" }, { ko: "따뜻한 신호", en: "Warm cue", ja: "あたたかいサイン" }, { signalSense: 3, cultureContext: 2, directnessBalance: 2 }),
      choice("b", { ko: "감시하려는 뜻", en: "They want to monitor you", ja: "監視したいという意味" }, { ko: "스릴러 해석", en: "Thriller read", ja: "スリラー読み" }, { overthinking: 3 }),
      choice("c", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っている意味" }, { ko: "반전 과다", en: "Too much twist", ja: "反転しすぎ" }, { overthinking: 2 }),
      choice("d", { ko: "의미 없음", en: "It means nothing", ja: "意味はない" }, { ko: "신호 무시", en: "Cue ignored", ja: "サイン無視" }, { directnessBalance: 1 }),
    ],
  },
  {
    id: "jp-muzukashii",
    theme: { ko: "완곡한 거절", en: "Soft refusal", ja: "遠回しな断り" },
    situation: {
      ko: '일본 친구가 직접 거절하지 않고 "ちょっと難しいかも"라고 했어요. 가장 가까운 의미는?',
      en: 'A Japanese friend says, "chotto muzukashii kamo" instead of directly refusing. Closest meaning?',
      ja: "日本の友だちが直接断らず「ちょっと難しいかも」と言いました。いちばん近い意味は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: '"조금 어려울지도" 같은 표현은 부드럽게 거절하거나 부담을 줄이는 방식일 수 있어요.',
      en: '"It might be a little difficult" can be a softened refusal or a way to reduce pressure.',
      ja: "「少し難しいかも」という表現は、やわらかい断りや負担を減らす言い方のことがあります。",
    },
    choices: [
      choice("a", { ko: "가능성이 아주 높음", en: "Very likely possible", ja: "可能性がかなり高い" }, { ko: "희망회로", en: "Hopeful read", ja: "期待しすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "사실상 어렵다는 완곡한 표현일 수 있음", en: "It may softly mean it is difficult", ja: "実質的に難しいという遠回しな表現かも" }, { ko: "완곡 감지", en: "Soft-no detected", ja: "遠回しセンサー" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "무조건 장난", en: "Definitely a joke", ja: "必ず冗談" }, { ko: "가볍게 해석", en: "Too light", ja: "軽く見すぎ" }, { directnessBalance: 1 }),
      choice("d", { ko: "확실한 호감", en: "A sure sign of interest", ja: "確実な脈あり" }, { ko: "고백 예고편", en: "Romance trailer", ja: "恋愛予告編" }, { overthinking: 3 }),
    ],
  },
  {
    id: "kr-slow-reply",
    theme: { ko: "답장 속도", en: "Reply speed", ja: "返信速度" },
    situation: {
      ko: "한국 친구가 답장이 빠르다가 갑자기 느려졌어요. 가장 안전한 해석은?",
      en: "A Korean friend used to reply fast, then suddenly slowed down. Safest read?",
      ja: "韓国の友だちの返信が速かったのに、急に遅くなりました。いちばん安全な読み方は？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "답장 속도만으로 마음을 판단하긴 어려워요. 일정, 피로, 상황 변화 등 다양한 이유가 있을 수 있습니다.",
      en: "Reply speed alone cannot decide feelings. Work, fatigue, or changed circumstances can all matter.",
      ja: "返信速度だけで気持ちは判断しにくいです。予定、疲れ、状況の変化など、いろいろな理由があります。",
    },
    choices: [
      choice("a", { ko: "무조건 마음이 식음", en: "They definitely lost interest", ja: "絶対に気持ちが冷めた" }, { ko: "엔딩 확정", en: "Ending declared", ja: "終わり判定" }, { overthinking: 3 }),
      choice("b", { ko: "바쁘거나 상황이 바뀌었을 수 있음", en: "They may be busy or circumstances changed", ja: "忙しいか、状況が変わったのかも" }, { ko: "현실 점검", en: "Reality check", ja: "現実チェック" }, { signalSense: 3, directnessBalance: 3 }),
      choice("c", { ko: "무조건 밀당", en: "Definitely playing hard to get", ja: "絶対に駆け引き" }, { ko: "로맨스 각본", en: "Romance script", ja: "恋愛脚本" }, { overthinking: 3 }),
      choice("d", { ko: "무조건 화남", en: "Definitely angry", ja: "絶対に怒っている" }, { ko: "위기 연출", en: "Alarm mode", ja: "危機演出" }, { overthinking: 2 }),
    ],
  },
  {
    id: "jp-gift",
    theme: { ko: "선물 리액션", en: "Gift reaction", ja: "プレゼントの反応" },
    situation: {
      ko: '일본 친구가 선물을 받고 "気を遣わせてごめんね"라고 했어요. 가장 가까운 느낌은?',
      en: 'A Japanese friend receives a gift and says, "Sorry for making you worry about me." Closest feeling?',
      ja: "日本の友だちがプレゼントを受け取って「気を遣わせてごめんね」と言いました。いちばん近いニュアンスは？",
    },
    bestChoiceId: "b",
    explanation: {
      ko: "상대의 배려에 고마워하면서도, 나에게 신경 쓰게 한 것 같아 미안하다는 예의 표현일 수 있어요.",
      en: "It can express gratitude while also feeling sorry that you went out of your way.",
      ja: "相手の気遣いに感謝しつつ、手間をかけさせてしまって申し訳ないという礼儀表現のことがあります。",
    },
    choices: [
      choice("a", { ko: "선물이 싫다는 뜻", en: "They dislike the gift", ja: "プレゼントが嫌だったという意味" }, { ko: "너무 직역", en: "Too literal", ja: "直訳しすぎ" }, { overthinking: 2 }),
      choice("b", { ko: "고마우면서도 부담을 준 것 같아 미안하다는 예의 표현", en: "Grateful, but politely sorry you made the effort", ja: "ありがたいけど、気を遣わせて申し訳ないという礼儀表現" }, { ko: "예의 감지", en: "Manners read", ja: "礼儀読み" }, { signalSense: 3, cultureContext: 3, directnessBalance: 2 }),
      choice("c", { ko: "화났다는 뜻", en: "They are angry", ja: "怒っている意味" }, { ko: "반응 과열", en: "Overheated", ja: "反応過熱" }, { overthinking: 2 }),
      choice("d", { ko: "다시는 선물하지 말라는 뜻", en: "Never give a gift again", ja: "二度と贈らないでという意味" }, { ko: "극단 해석", en: "Extreme read", ja: "極端読み" }, { overthinking: 3 }),
    ],
  },
  {
    id: "read-receipt",
    theme: { ko: "읽씹 해석", en: "Read receipt", ja: "既読の読み方" },
    situation: {
      ko: "메시지는 읽었는데 답장이 몇 시간 뒤에 왔어요. 가장 덜 위험한 판단은?",
      en: "They read your message, but replied hours later. Least risky judgment?",
      ja: "メッセージは既読なのに、返信は数時間後でした。いちばん危なくない判断は？",
    },
    bestChoiceId: "c",
    explanation: {
      ko: "읽고 바로 답하지 못하는 상황은 많아요. 단정하기보다 반복 패턴과 대화의 질을 함께 보는 편이 좋아요.",
      en: "There are many reasons someone reads first and replies later. Look at repeated patterns and conversation quality.",
      ja: "読んですぐ返せない理由はたくさんあります。決めつけず、繰り返しのパターンや会話の質も一緒に見るのが安全です。",
    },
    choices: [
      choice("a", { ko: "관계 끝", en: "The relationship is over", ja: "関係終了" }, { ko: "드라마 최종화", en: "Final episode", ja: "最終回" }, { overthinking: 3 }),
      choice("b", { ko: "나를 시험하는 중", en: "They are testing me", ja: "自分を試している" }, { ko: "추리물 개시", en: "Mind game mode", ja: "駆け引きモード" }, { overthinking: 3 }),
      choice("c", { ko: "바로 답하기 어려웠을 수 있으니 반복 패턴을 봄", en: "Maybe they could not reply, so check patterns", ja: "すぐ返せなかったかも。まずはパターンを見る" }, { ko: "침착한 판독", en: "Calm read", ja: "落ち着いた読み" }, { signalSense: 3, directnessBalance: 3 }),
      choice("d", { ko: "무조건 호감이라 일부러 늦춘 것", en: "They delayed it because they like me", ja: "好きだからわざと遅らせた" }, { ko: "서사 과열", en: "Story overload", ja: "物語化しすぎ" }, { overthinking: 3 }),
    ],
  },
  {
    id: "confirm-next",
    theme: { ko: "오해 방지", en: "Avoiding misunderstanding", ja: "誤解防止" },
    situation: {
      ko: "상대의 말이 호감인지 예의인지 애매해요. 가장 좋은 다음 행동은?",
      en: "When you cannot tell if it is interest or manners, what is the best next move?",
      ja: "相手の言葉が好意なのか礼儀なのか曖昧です。いちばん良い次の行動は？",
    },
    bestChoiceId: "a",
    explanation: {
      ko: "가볍고 구체적인 확인은 오해를 줄여요. 단정하거나 떠보기보다 다음 행동을 편하게 묻는 편이 안전합니다.",
      en: "A light, concrete check reduces misunderstanding. Ask about the next step instead of testing or assuming.",
      ja: "軽く具体的に確認すると誤解が減ります。試したり決めつけたりせず、次の行動を自然に聞くのが安全です。",
    },
    choices: [
      choice("a", { ko: "가볍게 구체적으로 확인한다", en: "Lightly ask a concrete follow-up", ja: "軽く具体的に確認する" }, { ko: "최고의 안전벨트", en: "Best seatbelt", ja: "一番の安全策" }, { signalSense: 4, cultureContext: 2, directnessBalance: 3 }),
      choice("b", { ko: "하루 종일 답장 시간만 분석한다", en: "Analyze reply times all day", ja: "一日中返信時間だけ分析する" }, { ko: "탐정 야근", en: "Detective overtime", ja: "探偵残業" }, { overthinking: 4 }),
      choice("c", { ko: "일단 호감이라고 확정한다", en: "Decide it is interest", ja: "とりあえず脈ありと決める" }, { ko: "행복회로 대가동", en: "Hope engine max", ja: "期待エンジン全開" }, { overthinking: 3 }),
      choice("d", { ko: "무조건 거리를 둔다", en: "Pull away completely", ja: "必ず距離を置く" }, { ko: "방어력 과다", en: "Too defensive", ja: "防御しすぎ" }, { overthinking: 2, directnessBalance: 1 }),
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
