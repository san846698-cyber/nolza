// Deep MBTI Analysis — 4 dimensions × 4 levels each, 28 questions total.
// Scoring convention per dimension (E/I, S/N, T/F, J/P):
//   positive scores lean toward the FIRST letter (E, S, T, J)
//   negative scores lean toward the SECOND letter (I, N, F, P)

export type Side = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type Level = 1 | 2 | 3 | 4;
export type Dimension = "EI" | "SN" | "TF" | "JP";
export type Bilingual = { ko: string; en: string };

export type LevelInfo = {
  title: Bilingual;
  /** 이런 사람이에요 — 3-4 sentences describing the persona. */
  persona: Bilingual;
  /** 현실 팩폭 — 2-3 sentences calling out the user's blind spot. */
  factCheck: Bilingual;
  /** 의외의 장점 — 2-3 sentences on hidden strengths. */
  hiddenStrength: Bilingual;
  /** 이런 상황에서 빛납니다 — situations where this trait shines. */
  shines: Bilingual;
};

export type Option = { label: Bilingual; score: number };

export type Question = {
  id: number;
  dimension: Dimension;
  /** Short context label shown above the question. */
  category: Bilingual;
  prompt: Bilingual;
  options: [Option, Option, Option, Option];
};

/** Dimension-intro screens shown once before the first question of each section. */
export const DIMENSION_INTROS: Record<
  Dimension,
  { ordinal: Bilingual; title: Bilingual; question: Bilingual }
> = {
  EI: {
    ordinal: { ko: "첫 번째 분석", en: "First analysis" },
    title: { ko: "외향, 내향", en: "Extrovert — Introvert" },
    question: {
      ko: "당신은 어디서 에너지를 얻나요?",
      en: "Where do you draw your energy from?",
    },
  },
  SN: {
    ordinal: { ko: "두 번째 분석", en: "Second analysis" },
    title: { ko: "현실, 직관", en: "Sensing — Intuition" },
    question: {
      ko: "당신은 무엇을 믿나요?",
      en: "What do you trust?",
    },
  },
  TF: {
    ordinal: { ko: "세 번째 분석", en: "Third analysis" },
    title: { ko: "논리, 감정", en: "Thinking — Feeling" },
    question: {
      ko: "당신은 어떻게 결정하나요?",
      en: "How do you make decisions?",
    },
  },
  JP: {
    ordinal: { ko: "네 번째 분석", en: "Fourth analysis" },
    title: { ko: "계획, 즉흥", en: "Planning — Improvising" },
    question: {
      ko: "당신은 어떻게 사나요?",
      en: "How do you live your life?",
    },
  },
};

// ─────────────────────── Level descriptions (32) ───────────────────────

export const LEVELS: Record<Side, Record<Level, LevelInfo>> = {
  E: {
    4: {
      title: { ko: "사람 속에서 켜지는 에너지 스위치", en: "Energy Vampire" },
      persona: {
        ko: "당신은 에너지를 주는 게 아니라 빨아먹는 사람이에요. 사람들 속에서 진짜로 살아있는 느낌을 받아요. 혼자 있으면 1시간도 못 견뎌요. 누구라도 옆에 있어야 하고 조용한 건 못 참아요.",
        en: "You don't give energy — you take it. You feel truly alive only when surrounded by people. An hour alone is too long. Anyone, please. Silence is unbearable.",
      },
      factCheck: {
        ko: "당신이 나간 파티에서 모두가 집에 와서 뻗어있어요. 당신만 혼자 '왜 이렇게 일찍 끝났지?' 하고 있어요.",
        en: "After a party you ran, everyone else gets home and collapses. Only you are sitting there asking 'why did it end so early?'",
      },
      hiddenStrength: {
        ko: "아무리 어색한 자리도 당신이 들어가면 살아나요. 분위기 메이커가 필요한 자리에 당신만 한 사람이 없어요.",
        en: "Any awkward room comes alive the moment you walk in. When a vibe needs to be sparked, no one does it like you.",
      },
      shines: {
        ko: "축하 자리, 큰 모임, 처음 시작하는 자리. 당신이 없으면 분위기가 안 살아요.",
        en: "Celebrations, big gatherings, kickoff events. Without you, the energy just doesn't show up.",
      },
    },
    3: {
      title: { ko: "약속이 있어야 살아나는 사교형", en: "Social Type" },
      persona: {
        ko: "사람이 있어야 충전돼요. 혼자 있으면 뭔가 허전하고 심심해요. 약속이 줄줄이 잡혀 있어야 하루가 알찬 느낌이에요. 그래서 캘린더가 늘 빡빡해요.",
        en: "People charge you up. Alone time feels hollow and dull. Your day only feels full when there's a string of plans on it. Your calendar is always packed.",
      },
      factCheck: {
        ko: "혼자 있는 시간이 너무 부족해서 본인을 돌볼 시간이 없어요. 가끔은 그 약속들 중 하나가 본인을 위한 시간이어야 해요.",
        en: "You give so little time to yourself that you forget to actually take care of you. One of those plans should sometimes be a plan with yourself.",
      },
      hiddenStrength: {
        ko: "사람 사이의 분위기를 빠르게 읽고 만들어요. 어디 가도 친구가 생겨요.",
        en: "You read social energy fast and shape it on the fly. You make friends wherever you land.",
      },
      shines: {
        ko: "팀 프로젝트, 새로운 환경, 처음 만나는 사람들 사이에서. 어색함을 깨는 건 거의 당신 몫이에요.",
        en: "Team projects, new environments, rooms full of strangers. Breaking the ice is basically your job.",
      },
    },
    2: {
      title: { ko: "내 사람 앞에서 켜지는 외향형", en: "Selective Extrovert" },
      persona: {
        ko: "외향적이지만 아무하고나 친해지진 않아요. 좋아하는 사람들과 있으면 에너지 폭발하지만, 모르는 사람들 사이에선 거리를 둬요. 본인이 컨트롤할 수 있는 사회생활을 좋아해요.",
        en: "Extroverted, but selective about who gets in. With your people, you go all-in. With strangers, you keep distance. You like a social life you can actually control.",
      },
      factCheck: {
        ko: "당신이 '낯가린다'고 말하는 거, 상대방은 '도도하다'고 들을 수 있어요. 친해지기 전까지의 그 갭이 꽤 커요.",
        en: "You say you're 'shy at first,' but new people read it as 'aloof.' That gap before they earn the real you is wider than you think.",
      },
      hiddenStrength: {
        ko: "선별된 인간관계라서 깊이가 있어요. 친한 사람한테는 진짜 잘해요.",
        en: "Your circle is small but deep. Inner-circle treatment from you is very real.",
      },
      shines: {
        ko: "익숙한 그룹, 친한 사람들과의 모임. 거기선 당신이 분위기 메이커예요.",
        en: "Familiar groups, friend circles. There, you're the spark.",
      },
    },
    1: {
      title: { ko: "외향 모드가 가능한 경계형", en: "Borderline (E-leaning)" },
      persona: {
        ko: "외향인 척하는 내향인이거나 내향인 척하는 외향인이에요. 본인도 헷갈려요. 사람을 좋아하긴 하는데 너무 많으면 지쳐요.",
        en: "Either an introvert pretending to be extroverted, or vice versa. Even you aren't sure. You like people, just not too many of them at once.",
      },
      factCheck: {
        ko: "MBTI 테스트마다 결과가 달라요. 그게 당연한 거예요, 정확히 경계선이니까요.",
        en: "Your MBTI test results keep flipping. That's the point — you're literally on the border.",
      },
      hiddenStrength: {
        ko: "외향 모드와 내향 모드를 자유롭게 오가요. 상황에 맞게 변신하는 카멜레온이에요.",
        en: "You toggle between modes as needed. A social chameleon.",
      },
      shines: {
        ko: "외향과 내향이 뒤섞인 자리에서 다리 역할을 잘해요.",
        en: "Mixed groups where you bridge the loud and the quiet.",
      },
    },
  },
  I: {
    1: {
      title: { ko: "혼자 충전도 필요한 경계형", en: "Borderline (I-leaning)" },
      persona: {
        ko: "내향이긴 하지만 사람 자체가 싫은 건 아니에요. 그냥 에너지를 선택적으로 써요. 친한 사람들이랑은 잘 놀고, 모르는 사람한테는 거리를 둬요.",
        en: "Introverted, but not antisocial. You spend energy selectively. With your people you're warm; with strangers you keep distance.",
      },
      factCheck: {
        ko: "본인이 '내향'이라고 말하지만 사실은 '에너지 절약형 외향'에 가까워요. 진짜 내향인은 친한 친구 만나는 것도 부담스러워해요.",
        en: "You call yourself an introvert, but you're closer to an 'energy-saving extrovert.' True introverts dread meeting even close friends.",
      },
      hiddenStrength: {
        ko: "외향과 내향의 균형감각이 있어요. 두 세계를 다 이해해요.",
        en: "You sit in the middle and understand both worlds.",
      },
      shines: {
        ko: "내향인을 외향 자리에 끌고 가야 할 때, 외향인을 진정시켜야 할 때. 통역사 역할을 해요.",
        en: "Translating between the loud and the quiet — you do that naturally.",
      },
    },
    2: {
      title: { ko: "혼자 있어야 돌아오는 충전형", en: "Recharging Introvert" },
      persona: {
        ko: "혼자 있어야 충전돼요. 사람 만나면 재밌긴 한데 집에 오면 방전돼요. 그래서 약속 사이엔 회복 시간이 꼭 필요해요. 사람이 싫은 게 아니라, 에너지가 한정돼 있을 뿐이에요.",
        en: "Alone time is mandatory for you. People are fun but draining. You need recovery time between plans. It's not that you dislike people — your energy is just finite.",
      },
      factCheck: {
        ko: "친구들이 '왜 이렇게 잘 안 만나?'라고 물어요. 당신은 한 달에 한두 번이면 충분한데 그들은 매주 보고 싶어해요. 거기서 오해가 생겨요.",
        en: "Friends ask why you never come out. You think monthly is plenty; they expected weekly. That gap turns into misunderstandings.",
      },
      hiddenStrength: {
        ko: "혼자 있는 시간을 잘 활용해서 깊이 있는 결과물을 만들어요. 외부 자극에 휩쓸리지 않아요.",
        en: "Your alone time isn't empty — it's where your deepest work happens. You aren't swayed by outside noise.",
      },
      shines: {
        ko: "긴 호흡으로 집중해야 하는 일, 깊이 있는 1:1 대화.",
        en: "Long-form focus work and one-on-one conversations that go deep.",
      },
    },
    3: {
      title: { ko: "집에서 가장 안정되는 은둔형", en: "Hermit" },
      persona: {
        ko: "약속이 잡히면 취소하고 싶고 집이 제일 편해요. 사람 만나는 게 일처럼 느껴져요. 만나기 전에는 부담스럽고, 만나는 동안엔 즐겁지만, 끝나면 진이 빠져요. 그래서 점점 더 안 만나게 돼요.",
        en: "Every plan tempts you to cancel. Home is the only place that feels safe. Before: dread. During: actually fun. After: completely drained. So you go out less and less.",
      },
      factCheck: {
        ko: "약속을 미루고 미루다가 결국 안 보게 된 친구들이 늘어나요. 당신은 잘 지내고 있다고 생각하지만, 그들은 당신이 자연스럽게 멀어졌다고 느껴요.",
        en: "The list of friends you've ghosted by postponing keeps growing. You think you're fine; they think you drifted away.",
      },
      hiddenStrength: {
        ko: "혼자만의 세계에서 진짜 좋아하는 일에 깊이 빠질 수 있어요. 외부 평가에 흔들리지 않아요.",
        en: "In your private world, you go deep on the things you actually love. Outside opinion barely reaches you.",
      },
      shines: {
        ko: "혼자만의 작업, 깊이 있는 사고, 자기만의 분야를 파는 일.",
        en: "Solo work, deep thinking, mastering a niche by yourself.",
      },
    },
    4: {
      title: { ko: "혼자만의 세계가 깊은 타입", en: "Total Hermit" },
      persona: {
        ko: "당신에게 사람은 에너지 드레인 그 자체예요. 혼자가 가장 편하고, 그게 문제라고 생각하지도 않아요. 약속은 거의 잡지 않아요. 잡혀도 가까스로 가요.",
        en: "People are pure energy drains to you. Alone is your default and you see no problem with that. You almost never make plans, and when you do, you barely show up.",
      },
      factCheck: {
        ko: "마지막으로 먼저 연락한 게 언제인지 기억 안 나죠? 연락 안 해도 친구라고 생각하는데, 상대방도 그렇게 생각하는지는 모르는 거예요.",
        en: "Can you remember the last time you reached out first? You assume the friendship is fine without contact, but you don't actually know they feel the same.",
      },
      hiddenStrength: {
        ko: "외부 자극 없이도 스스로 만족할 줄 알아요. 자기 충족형이에요. 외로움을 잘 견뎌요.",
        en: "You can be content with no outside stimulation. Fully self-sufficient. You don't crumble in solitude.",
      },
      shines: {
        ko: "방해 없이 깊이 파는 일, 혼자 결정하고 책임지는 자리.",
        en: "Deep solo work, roles where you decide and own everything alone.",
      },
    },
  },
  S: {
    4: {
      title: { ko: "증거가 있어야 움직이는 현실파", en: "Extreme Realist" },
      persona: {
        ko: "꿈? 비전? 그게 밥 먹여줘요? 지금 눈앞의 것만 믿어요. 추상적인 얘기하면 졸려요. '그럴 수도 있다'는 가설은 무의미해요. 직접 보고 만져서 증명되어야 해요.",
        en: "Dreams? Vision? Does that pay rent? Only what's right in front of you is real. Abstract talk puts you to sleep. 'Might happen' is meaningless. Show me, prove it.",
      },
      factCheck: {
        ko: "당신이 '현실적'이라고 말하는 게 가끔은 '상상력 부족'이에요. 모든 큰 변화는 처음엔 비현실적이었어요. 비현실을 다 거르면 혁신은 못 만나요.",
        en: "What you call 'realistic' sometimes means 'no imagination.' Every major shift in history started as unrealistic. Filter all of it out and you never meet innovation.",
      },
      hiddenStrength: {
        ko: "허황된 일에 시간 안 써요. 실패할 일은 미리 알아봐요. 자원 낭비가 가장 적어요.",
        en: "You don't waste time on fantasy. You spot doomed ideas early. Almost zero resource waste.",
      },
      shines: {
        ko: "리스크 관리, 운영, 안정적인 실행. 누군가는 현실을 봐야 해요.",
        en: "Risk management, operations, steady execution. Someone has to keep the floor solid.",
      },
    },
    3: {
      title: { ko: "구체적인 근거를 보는 현실주의자", en: "Realist" },
      persona: {
        ko: "계획은 구체적이어야 하고 증거가 있어야 믿어요. 가능성보다 현실, 추상보다 구체가 중요해요. '그냥 느낌으로'는 당신 사전에 없어요. 항상 데이터와 사실을 본 뒤에 움직여요.",
        en: "Plans need to be concrete. Evidence required. Reality over possibility, specifics over abstractions. 'Just a feeling' doesn't exist in your vocabulary. You move only after the data is in.",
      },
      factCheck: {
        ko: "다른 사람이 '꿈 같은 얘기'를 할 때 당신은 즉시 현실 검증 모드로 들어가요. 그게 상대방에겐 '꿈을 짓밟는다'로 들릴 수 있어요.",
        en: "When someone shares a dream, you flip straight into reality-check mode. To them, it can feel like you're stomping on it.",
      },
      hiddenStrength: {
        ko: "안 될 일은 미리 거르고, 될 일은 정확히 실행해요. 시간 낭비가 적어요.",
        en: "You filter out the doomed early and execute the rest precisely. Very little wasted motion.",
      },
      shines: {
        ko: "운영, 실행, 디테일이 중요한 일. 큰 그림보다 정확한 실행이 더 필요한 자리.",
        en: "Operations, execution, detail-heavy roles. Where precision matters more than vision.",
      },
    },
    2: {
      title: { ko: "가능성을 실행으로 바꾸는 현실형", en: "Practical Imaginer" },
      persona: {
        ko: "현실적이지만 가끔 상상도 해요. 단, 실현 가능한 것만요. 새로운 아이디어를 들으면 일단 '실제로 어떻게 할 건데?'를 묻고 싶어요. 가능성과 현실의 다리를 놓는 사람이에요.",
        en: "Realistic, but occasionally imaginative — only about things that could actually happen. When you hear a wild idea, your first instinct is 'okay, but how?' You bridge possibility and reality.",
      },
      factCheck: {
        ko: "재미있는 아이디어를 낸 사람한테 '이거 어떻게 실행할 건데?'라고 물어요. 김 빼는 사람으로 보일 수 있어요.",
        en: "You ask 'but how would you actually do that?' a lot. People can read it as deflating their excitement.",
      },
      hiddenStrength: {
        ko: "상상력과 실행력을 둘 다 갖췄어요. 아이디어를 진짜로 만드는 사람이에요.",
        en: "Imagination and execution at once. You actually turn ideas into things.",
      },
      shines: {
        ko: "기획에서 실행으로 넘어가는 단계, 비즈니스 검증, 아이디어 검토.",
        en: "The handoff from concept to delivery. Business validation, idea triage.",
      },
    },
    1: {
      title: { ko: "현실 쪽으로 기운 균형형", en: "Borderline (S-leaning)" },
      persona: {
        ko: "현실과 가능성 사이를 왔다갔다 해요. 상황에 따라 달라져요. 어떨 땐 팩트 위주, 어떨 땐 직관적으로 결정해요.",
        en: "You drift between reality and possibility depending on the day. Sometimes data-first, sometimes intuition-first.",
      },
      factCheck: {
        ko: "테스트마다 S/N이 바뀌는 건 이상한 게 아니라 진짜 그쪽이라는 거예요.",
        en: "Your S/N flipping every test isn't a bug — it's the result.",
      },
      hiddenStrength: {
        ko: "현실 감각과 가능성 사이의 균형. 한쪽으로 치우치지 않아요.",
        en: "A natural balance between practicality and possibility. Neither side dominates.",
      },
      shines: {
        ko: "구체와 추상이 같이 필요한 일, 기획자 역할.",
        en: "Roles needing both concrete and abstract thinking — strategy + planning.",
      },
    },
  },
  N: {
    1: {
      title: { ko: "가능성 쪽으로 기운 균형형", en: "Borderline (N-leaning)" },
      persona: {
        ko: "아이디어는 많은데 현실 감각도 있어요. 그래서 실제로 뭔가를 만들어요. 머릿속 상상이 그냥 상상으로 끝나지 않아요.",
        en: "Lots of ideas, plus enough realism to actually ship them. Your imagination doesn't just stay in your head.",
      },
      factCheck: {
        ko: "주변 사람들이 '너 너무 평범한데?'라고 해요. N답지 않다고요. 그래도 이게 당신이에요.",
        en: "People say you seem 'too normal' for an N. That is, in fact, you.",
      },
      hiddenStrength: {
        ko: "상상과 실행 사이를 빠르게 오갈 수 있어요. 양쪽 다 잘해요.",
        en: "You move fast between dreaming and doing. Good at both.",
      },
      shines: {
        ko: "기획-실행 모두 필요한 1인 프로젝트, 창업, 메이커 일.",
        en: "Solo projects, startups, maker work — anywhere you have to think and execute.",
      },
    },
    2: {
      title: { ko: "아이디어가 먼저 떠오르는 몽상가", en: "Dreamer" },
      persona: {
        ko: "아이디어가 끊임없이 나와요. 실행은… 나중에요. 지금은 구상 중이에요. 머릿속에 노트북 100개가 동시에 열려 있는 느낌이에요. 정리는 못 했어요.",
        en: "Ideas keep arriving. Execution? Later. You're still ideating. Mentally it's like 100 browser tabs are open. None are organized.",
      },
      factCheck: {
        ko: "지난 1년 동안 '이거 만들어야겠다'고 생각한 게 몇 개예요? 그중 시작한 게 몇 개? 끝낸 건 몇 개? 그 갭이 당신의 현실이에요.",
        en: "How many things did you say you'd build this year? How many did you start? How many did you finish? That gap is your reality.",
      },
      hiddenStrength: {
        ko: "남들이 못 보는 가능성을 봐요. 한 번씩 진짜 신박한 아이디어가 나와요.",
        en: "You see angles no one else does. Every so often something truly original comes out of you.",
      },
      shines: {
        ko: "초기 기획, 브레인스토밍, 새로운 시각이 필요한 자리.",
        en: "Early-stage ideation, brainstorming, anywhere a fresh angle matters.",
      },
    },
    3: {
      title: { ko: "다음 장면을 먼저 보는 미래형", en: "Futurist" },
      persona: {
        ko: "지금보다 10년 후가 더 재밌어요. 현실의 디테일은 지루해요. 큰 그림만 봐요. 머릿속엔 늘 '만약 이렇게 되면…'이라는 시나리오가 돌아가요. 그게 당신의 디폴트 모드예요.",
        en: "Ten years from now is more interesting than today. Present-day details bore you — you only see the big picture. Your default state is running 'what if…' simulations in the background.",
      },
      factCheck: {
        ko: "현재의 디테일을 자꾸 놓쳐요. 큰 그림은 그렸는데 작은 부분에서 늘 사고가 나요. 미래만 보면 오늘 발을 헛디뎌요.",
        en: "You miss the small stuff. The big picture's locked in but you keep tripping on the details. Eyes on the future, foot in the pothole.",
      },
      hiddenStrength: {
        ko: "남들이 5년 후를 볼 때 당신은 10년 후를 봐요. 트렌드를 미리 읽어요.",
        en: "When others look 5 years ahead, you're already at year 10. You spot trends early.",
      },
      shines: {
        ko: "전략, 비전 설정, 장기 계획. 미래를 먼저 그려야 하는 자리.",
        en: "Strategy, vision-setting, long-horizon planning.",
      },
    },
    4: {
      title: { ko: "머릿속 세계가 먼저 달리는 타입", en: "Pure Dreamer" },
      persona: {
        ko: "현실이요? 그게 중요한가요? 머릿속엔 이미 완벽한 세계가 있어요. 실행은 남들이 하면 되죠. 당신의 일은 비전을 그리는 거예요. 디테일은 디테일러들에게 맡겨요.",
        en: "Reality? Is that important? You already have a perfect world in your head. Execution is someone else's job. You paint the vision; others fill in the details.",
      },
      factCheck: {
        ko: "머릿속에 완벽한 아이디어가 있어요. 근데 실행한 게 몇 개예요? 아이디어는 실행되지 않으면 그냥 꿈이에요.",
        en: "You have a perfect idea in your head. But how many have you actually executed? An unexecuted idea is just a dream.",
      },
      hiddenStrength: {
        ko: "남들이 상상조차 못 한 영역을 상상해요. 그 자체로 가치가 있어요.",
        en: "You imagine territory others can't even see. That alone has real value.",
      },
      shines: {
        ko: "비전이 필요한 초기 단계, 큰 변화를 그려야 하는 자리.",
        en: "Earliest stages of anything new, drawing the big shift before it exists.",
      },
    },
  },
  T: {
    4: {
      title: { ko: "감정보다 기준이 먼저 서는 타입", en: "Borderline Sociopath" },
      persona: {
        ko: "감정은 비효율적이에요. 논리로 모든 걸 처리해요. 상대방이 상처받았는지엔 큰 관심 없어요. 틀렸으면 틀린 거고, 맞았으면 맞은 거예요. 단순해요.",
        en: "Emotions are inefficient. Logic handles everything. Whether someone got hurt is not your concern. Wrong is wrong, right is right. Simple.",
      },
      factCheck: {
        ko: "당신이 '팩트'라고 말하는 것들이 상대방엔 상처로 들릴 수 있어요. 맞는 말도 타이밍과 방식이 있어요. 진실은 항상 직접적으로 말해야 하는 게 아니에요.",
        en: "What you call 'just facts' can land like a wound. Even true things have a time and a delivery. Truth doesn't always have to be said directly.",
      },
      hiddenStrength: {
        ko: "감정에 흔들리지 않는 결단력. 어려운 결정을 망설임 없이 해요. 누군가는 해야 할 일을 당신이 해요.",
        en: "Decisiveness untouched by emotion. Hard calls without flinching. The thing nobody else wants to do — you do it.",
      },
      shines: {
        ko: "구조조정, 손절, 냉정한 판단이 필요한 순간. 다른 사람들이 못 하는 일을 당신이 해요.",
        en: "Restructuring, cutting losses, ice-cold judgment moments. The work others can't bring themselves to do.",
      },
    },
    3: {
      title: { ko: "상황을 구조로 보는 논리형", en: "Cold Logician" },
      persona: {
        ko: "공감을 못 하는 게 아니에요. 하는데 감정보다 사실이 먼저예요. 누가 울면 왜 우는지 원인 파악부터 하고 해결책을 찾아드리는 게 위로라고 생각해요.",
        en: "It's not that you can't empathize — you do, but facts come first. When someone cries, you start by diagnosing the cause and offering a solution. That, to you, is comfort.",
      },
      factCheck: {
        ko: "친구가 '그냥 들어줘'라고 할 때 당신은 이미 해결책 3가지를 준비하고 있어요. 그게 상대방을 지치게 할 수 있어요. 가끔은 그냥 고개만 끄덕여도 돼요.",
        en: "When a friend says 'just listen,' you already have three solutions queued up. That can wear them out. Sometimes just nodding is enough.",
      },
      hiddenStrength: {
        ko: "감정에 휩쓸리지 않아서 중요한 순간에 냉정한 판단을 해요. 모두가 패닉할 때 당신은 이미 움직이고 있어요.",
        en: "You don't get swept by emotion, which means clear judgment when it counts. While everyone panics, you're already moving.",
      },
      shines: {
        ko: "위기 상황, 중요한 결정, 감정적이 되면 안 되는 순간. 당신이 가장 필요한 때예요.",
        en: "Crises, high-stakes decisions, moments where emotion would ruin the call. This is exactly when you're needed.",
      },
    },
    2: {
      title: { ko: "감정보다 기준을 먼저 보는 타입", en: "Logic First" },
      persona: {
        ko: "감정을 이해하려고 노력해요. 근데 결국 결정은 머리로 해요. 데이터와 논리가 우선이고, 감정은 참고 자료예요. 실용적인 친절을 베풀어요.",
        en: "You try to understand feelings. But final decisions come from the head. Logic leads, emotion is reference material. Your kindness is practical.",
      },
      factCheck: {
        ko: "당신은 '논리적으로 친절하다'고 생각하지만 상대방은 '계산적이다'로 받아들일 수 있어요.",
        en: "You think you're 'logically kind.' Some people read it as 'calculating.'",
      },
      hiddenStrength: {
        ko: "감정과 논리의 비율을 잘 맞춰요. 결정이 감정으로 흐트러지지 않아요.",
        en: "You hit a healthy ratio between heart and head. Emotion doesn't derail your decisions.",
      },
      shines: {
        ko: "팀 리더, 의사결정자, 합리적 균형이 필요한 자리.",
        en: "Team lead, decision-maker, anywhere balance is the actual job.",
      },
    },
    1: {
      title: { ko: "분석 쪽으로 기운 균형형", en: "Borderline (T-leaning)" },
      persona: {
        ko: "논리적이고 싶은데 감정도 많이 신경 써요. T인지 F인지 테스트마다 달라요. 머리로 결정하려 하지만 끝에 가서 마음이 흔들려요.",
        en: "You want to be logical but feelings creep in. T or F? Depends on the test that day. The head leads but the heart edits.",
      },
      factCheck: {
        ko: "결정의 50%는 논리, 50%는 감정인데, 둘 다 만족 못 시켜서 자주 후회해요.",
        en: "Half logic, half emotion in every choice — and neither half is fully satisfied. So you second-guess often.",
      },
      hiddenStrength: {
        ko: "양쪽을 다 이해해서 중재자 역할을 잘해요. T와 F 사이의 통역사예요.",
        en: "You see both sides, which makes you a great mediator. The translator between T and F.",
      },
      shines: {
        ko: "갈등 조정, 인간관계 문제, 양쪽 입장을 다 봐야 하는 일.",
        en: "Conflict resolution, relationship issues, anywhere both sides matter.",
      },
    },
  },
  F: {
    1: {
      title: { ko: "공감 쪽으로 기운 균형형", en: "Borderline (F-leaning)" },
      persona: {
        ko: "공감을 잘 하는데 가끔은 냉정하게 볼 수도 있어요. 상황에 따라 달라요. 마음과 머리 사이를 자주 오가요.",
        en: "Empathic, but capable of cold-eyed assessment when needed. Situational. You move between heart and head often.",
      },
      factCheck: {
        ko: "T 친구한테는 '너무 감정적'이고 F 친구한테는 '너무 차갑다'고 들어요. 어느 쪽도 만족 못 시켜요.",
        en: "T friends call you too emotional, F friends call you too cold. You can't win either room.",
      },
      hiddenStrength: {
        ko: "상황에 따라 모드를 전환할 수 있어요. 상대방을 잘 읽어요.",
        en: "You switch modes by context. Excellent at reading the room.",
      },
      shines: {
        ko: "다양한 사람을 상대해야 하는 자리, 중재 역할.",
        en: "Roles with varied people and mediation needs.",
      },
    },
    2: {
      title: { ko: "사람의 맥락을 놓치지 않는 공감형", en: "Empath" },
      persona: {
        ko: "상대방 감정이 먼저 느껴져요. 해결보다 공감이 중요해요. 근데 본인 감정도 잘 챙겨요. 들어주는 게 곧 해결이라는 걸 알아요. 듣는 능력이 강점이에요.",
        en: "You sense others' feelings first. Empathy before solutions. You also take care of your own feelings, though. You know that listening is itself the solution.",
      },
      factCheck: {
        ko: "당신은 잘 들어주는데, 정작 본인은 잘 안 털어놔요. 받기만 하는 관계가 늘면 지쳐요. 본인도 누구한테 의지해도 돼요.",
        en: "You're a great listener but you rarely open up yourself. One-sided relationships pile up and exhaust you. It's okay to lean on someone too.",
      },
      hiddenStrength: {
        ko: "사람의 마음을 빠르게 알아채요. 신뢰를 쌓는 속도가 빨라요.",
        en: "You read people fast and earn trust quickly.",
      },
      shines: {
        ko: "상담, 인사, 케어, 사람을 다루는 일.",
        en: "Counseling, HR, care work — anything people-facing.",
      },
    },
    3: {
      title: { ko: "분위기를 깊게 흡수하는 타입", en: "Emotional Sponge" },
      persona: {
        ko: "주변 감정을 다 흡수해요. 누가 힘들면 같이 힘들어요. 경계선이 필요한데 어떻게 긋는지 몰라요. 분위기에 따라 본인 기분도 출렁여요.",
        en: "You absorb every emotion in the room. When someone struggles, you struggle. You need boundaries but don't know how to set them. Your mood rides whatever's in the air.",
      },
      factCheck: {
        ko: "남의 감정을 책임질 필요는 없어요. 그 사람의 슬픔을 당신이 짊어진다고 그 사람이 안 슬퍼지는 거 아니에요. 당신만 무거워질 뿐이에요.",
        en: "You aren't responsible for other people's feelings. Carrying their sadness doesn't lighten theirs — it only weighs you down.",
      },
      hiddenStrength: {
        ko: "남들이 못 느끼는 미세한 감정 변화를 알아채요. 분위기 감지력이 최고예요.",
        en: "You catch micro-shifts no one else senses. Your room-radar is unmatched.",
      },
      shines: {
        ko: "관계의 기류를 읽어야 하는 자리, 감정노동이 필요한 자리.",
        en: "Roles where reading the relational current is the actual skill.",
      },
    },
    4: {
      title: { ko: "마음의 파도를 크게 느끼는 타입", en: "Emotional Overload" },
      persona: {
        ko: "감정이 너무 많아서 가끔 본인도 감당이 안 돼요. 드라마 보다가 울고, 광고 보다가 울어요. 감정이 디폴트 상태예요. 모든 결정에 감정이 깊게 관여해요.",
        en: "You have so many feelings even you can't keep up. You cry at dramas, you cry at commercials. Emotion is your default state. Every decision is emotionally tinted.",
      },
      factCheck: {
        ko: "감정이 너무 강해서 결정이 흐려져요. 객관적으로 봐야 할 순간에도 감정이 먼저 와요. 당신을 지키려면 가끔 감정을 잠시 떼어놓는 연습이 필요해요.",
        en: "Emotions run so hot that decisions blur. Even when you need to stay objective, feeling arrives first. To protect yourself, you need to learn to set the feeling aside, briefly.",
      },
      hiddenStrength: {
        ko: "예술, 글, 음악, 사람을 다루는 일에서 깊이가 달라요. 감정이 곧 자산이에요.",
        en: "In art, writing, music, and any people-driven craft, your depth is unmatched. Emotion is your asset.",
      },
      shines: {
        ko: "창작, 연기, 사람의 마음을 움직여야 하는 일.",
        en: "Creating, performing, anything that needs to move a heart.",
      },
    },
  },
  J: {
    4: {
      title: { ko: "모든 변수를 정리하고 싶은 사람", en: "Control Freak" },
      persona: {
        ko: "계획 없이는 못 움직여요. 갑작스러운 변경은 스트레스예요. 다른 사람이 계획을 안 지키면 화가 나요. 모든 게 예측 가능해야 마음이 편해요.",
        en: "You can't move without a plan. Last-minute changes are pure stress. When others don't follow the plan, you get genuinely angry. Predictability = peace.",
      },
      factCheck: {
        ko: "당신의 계획이 틀어졌을 때 제일 힘든 사람은 당신이에요. 세상은 당신의 계획대로 돌아가지 않아요. 그 사실을 받아들이는 연습이 필요해요.",
        en: "When your plan derails, the person who suffers most is you. The world does not run on your schedule. Accepting that takes practice.",
      },
      hiddenStrength: {
        ko: "복잡한 일을 체계로 만들어요. 카오스를 질서로 바꾸는 능력이 있어요.",
        en: "You turn complex chaos into clean systems. Order is your superpower.",
      },
      shines: {
        ko: "큰 프로젝트 운영, 다단계 일정, 복잡한 시스템 관리.",
        en: "Large programs, multi-stage schedules, complex systems.",
      },
    },
    3: {
      title: { ko: "계획표가 있어야 편한 사람", en: "Planner" },
      persona: {
        ko: "할 일 리스트가 없으면 불안해요. 일정이 정해져 있어야 편해요. 즉흥은 가끔만 괜찮아요. 캘린더와 To-Do가 당신의 안전벨트예요.",
        en: "Without a to-do list you're anxious. A locked schedule equals comfort. Spontaneity is fine, occasionally. Calendar and tasks are your seatbelts.",
      },
      factCheck: {
        ko: "계획대로 안 되면 짜증이 확 나요. 다른 사람이 시간 안 지키면 당신만 스트레스 받아요. 세상은 당신의 계획대로 굴러가지 않아요.",
        en: "Off-plan = instant frustration. When others run late, only you stress. The world doesn't run on your timeline.",
      },
      hiddenStrength: {
        ko: "마감, 약속, 책임. 당신이 맡으면 무조건 끝나요. 신뢰의 결정체예요.",
        en: "Deadlines, commitments, ownership. If it's on your plate, it ships. Pure reliability.",
      },
      shines: {
        ko: "프로젝트 PM, 운영, 일정 관리, 책임이 중요한 자리.",
        en: "PM, ops, scheduling, anywhere accountability is the core skill.",
      },
    },
    2: {
      title: { ko: "유연함을 남겨두는 계획형", en: "Flexible Planner" },
      persona: {
        ko: "계획을 세우지만 유연하게 바꿀 수 있어요. 완벽하지 않아도 괜찮아요. 80% 정도의 계획으로 움직이고 20%는 즉흥이에요. 변화가 있어도 흔들리지 않아요.",
        en: "You make plans but adjust them on the fly. Imperfect is fine. About 80% planned, 20% improvised. Change doesn't rattle you.",
      },
      factCheck: {
        ko: "완벽주의 J들은 당신이 '대충 산다'고 말해요. 그런데 당신은 그게 합리적이라고 생각해요. 둘 다 맞아요.",
        en: "Strict J types call you 'sloppy.' You call yourself 'reasonable.' You're both right.",
      },
      hiddenStrength: {
        ko: "체계와 적응력의 황금비율. 계획은 있는데 변화에 약하지 않아요.",
        en: "The sweet spot between structure and adaptability. Planned but not brittle.",
      },
      shines: {
        ko: "프로젝트 관리, 일정 조정, 변수 많은 환경.",
        en: "Project management, schedule juggling, environments with many moving parts.",
      },
    },
    1: {
      title: { ko: "정리 쪽으로 기운 균형형", en: "Borderline (J-leaning)" },
      persona: {
        ko: "계획도 세우고 즉흥도 즐겨요. 그때그때 달라요. 상황에 따라 모드를 바꿀 수 있어요.",
        en: "You plan, you also improvise. It depends on the day. You shift modes by situation.",
      },
      factCheck: {
        ko: "어떨 때는 너무 계획적, 어떨 때는 너무 즉흥적. 스스로도 어떤 사람인지 헷갈려요.",
        en: "Sometimes super planned, sometimes purely improvised. Even you can't pin yourself down.",
      },
      hiddenStrength: {
        ko: "유연성과 구조 둘 다 가졌어요. 한쪽으로 굳어지지 않았어요.",
        en: "You have both flexibility and structure. Not locked into either extreme.",
      },
      shines: {
        ko: "변화가 많은 환경, 조정 역할.",
        en: "High-change environments, coordination roles.",
      },
    },
  },
  P: {
    1: {
      title: { ko: "열어두기 쪽으로 기운 균형형", en: "Borderline (P-leaning)" },
      persona: {
        ko: "즉흥적이지만 중요한 건 미리 준비해요. 완전 자유롭진 않아요. 큰 줄기는 잡고 디테일은 즉흥이에요.",
        en: "Spontaneous, but you prep the important things. Not fully free-spirited. Big strokes locked, details improvised.",
      },
      factCheck: {
        ko: "P인 척하지만 사실은 J에 가까운 시간 관리를 해요. 진짜 P들은 당신처럼 마감을 안 지키지 않아요.",
        en: "You call yourself a P, but your time management leans J. Real P's don't hit deadlines like you do.",
      },
      hiddenStrength: {
        ko: "유연하지만 책임감도 있어요. 이 균형이 어른의 모습이에요.",
        en: "Flexible but reliable. That balance is what 'adult' actually looks like.",
      },
      shines: {
        ko: "변수 있는 환경에서 기본 골격은 챙기는 일.",
        en: "Volatile environments where the skeleton still has to hold.",
      },
    },
    2: {
      title: { ko: "흐름을 보며 움직이는 즉흥형", en: "Spontaneous" },
      persona: {
        ko: "계획은 답답해요. 그때그때 결정하는 게 더 재밌어요. 근데 가끔 후회해요. 미리 정해놓은 게 너무 많으면 숨이 막혀요. 가능성을 열어두는 게 좋아요.",
        en: "Plans feel suffocating. In-the-moment decisions are more fun — though occasionally you regret them. Too much pre-decided feels claustrophobic. You like keeping doors open.",
      },
      factCheck: {
        ko: "'그때그때 결정한다'는 게 자유롭게 들리지만, 사실 결정 미루는 거예요. 결국 누군가는 정리해야 하는 일이 생겨요.",
        en: "'Deciding in the moment' sounds free, but it's also just deferring. Eventually someone has to clean up.",
      },
      hiddenStrength: {
        ko: "변화에 빠르게 적응해요. 새로운 기회를 잘 잡아요.",
        en: "You adapt fast and grab new opportunities while others are still adjusting.",
      },
      shines: {
        ko: "변화가 많은 환경, 새로운 만남, 기회를 빨리 포착해야 할 때.",
        en: "Fluid environments, new connections, fast opportunity capture.",
      },
    },
    3: {
      title: { ko: "선택지를 열어두는 자유형", en: "Free Spirit" },
      persona: {
        ko: "마감이 있어야 시작해요. 계획은 참고용이에요. 인생은 즉흥이 맞아요. 미리 다 정해놓으면 재미가 없어요. 흐름을 따라가는 게 진짜예요.",
        en: "Deadlines are your only ignition. Plans are just suggestions. Life is meant to be improvised. Pre-decided = no fun. Riding the flow is the real thing.",
      },
      factCheck: {
        ko: "마감 직전의 집중력이 인생의 디폴트가 됐어요. 멋있어 보이지만 사실 본인 몸이 망가지고 있어요. 매번 벼랑끝 모드로 사는 건 결국 안 좋아요.",
        en: "Last-minute crunch has become your default mode. Looks impressive, but your body is paying the bill. Living on the cliff edge wears you down.",
      },
      hiddenStrength: {
        ko: "압박 속에서 더 잘해요. 단기간 폭발적인 집중이 가능해요.",
        en: "You perform better under pressure. Short bursts of explosive focus are your specialty.",
      },
      shines: {
        ko: "긴급 상황, 즉시 반응이 필요한 일, 창의적인 즉흥.",
        en: "Emergencies, fast-reaction work, creative improvisation.",
      },
    },
    4: {
      title: { ko: "즉흥이 기본값인 자유형", en: "Pure Chaos" },
      persona: {
        ko: "계획이요? 그게 뭐예요? 오늘 할 일을 오늘 알아요. 근데 신기하게 어떻게든 돼요. 모든 게 마지막 순간에 정해져요. 그 압박 속에서 살아요.",
        en: "Plans? What are those? You find out today's agenda today. Somehow it always works out. Everything gets decided at the last second. You live in that pressure.",
      },
      factCheck: {
        ko: "'어떻게든 되더라'는 경험이 몇 번이나 됐어요? 운이 좋았던 거예요. 언젠가 안 될 수도 있어요.",
        en: "How many times has 'somehow it worked out' actually happened? You got lucky. One day it won't.",
      },
      hiddenStrength: {
        ko: "예측 불가의 환경에서 가장 잘 살아남아요. 적응력은 최고예요.",
        en: "You survive best when nothing is predictable. Adaptability is your peak skill.",
      },
      shines: {
        ko: "재난, 즉흥 대응, 빠른 의사결정.",
        en: "Disasters, improvised response, rapid decision-making.",
      },
    },
  },
};

// ─────────────────────── 28 questions (7 per dimension) ───────────────────────

const opt = (
  ko: string,
  en: string,
  score: number,
): Option => ({ label: { ko, en }, score });

export const QUESTIONS: Question[] = [
  // ─── E/I ───
  {
    id: 1,
    dimension: "EI",
    category: { ko: "에너지 충전 방식", en: "How you recharge" },
    prompt: {
      ko: "긴 하루 후 나를 충전하는 방법:",
      en: "How you recharge after a long day:",
    },
    options: [
      opt("단톡에 사람을 모아 바로 약속을 잡는다", "Gather people in a chat and make plans right away", +4),
      opt("편한 사람 한두 명과 가볍게 수다 떤다", "Chat lightly with one or two comfortable people", +2.5),
      opt("혼자 좋아하는 콘텐츠를 보며 회복한다", "Recharge alone with content I like", -2.5),
      opt("알림을 끄고 아무에게도 반응하지 않는다", "Turn off notifications and respond to no one", -4),
    ],
  },
  {
    id: 2,
    dimension: "EI",
    category: { ko: "사회적 자극 반응", en: "Social trigger reaction" },
    prompt: {
      ko: "갑자기 파티에 초대받았다:",
      en: "Suddenly invited to a party:",
    },
    options: [
      opt("누가 오는지 묻기도 전에 갈 준비를 한다", "Start getting ready before even asking who is going", +4),
      opt("인사 돌리고 분위기 좋을 때 일찍 나온다", "Say hello around the room and leave while the mood is good", +1.5),
      opt("친한 사람이 없으면 자연스럽게 빠질 이유를 찾는다", "If no close friend is going, look for a natural reason to skip", -2.5),
      opt("초대만 봐도 에너지가 빠져 바로 거절한다", "The invite alone drains me, so I decline right away", -4),
    ],
  },
  {
    id: 3,
    dimension: "EI",
    category: { ko: "낯선 사람 대처", en: "Around strangers" },
    prompt: {
      ko: "처음 보는 사람들과 있을 때:",
      en: "Around strangers, you usually:",
    },
    options: [
      opt("내가 먼저 말 건다", "Strike up the first conversation", +4),
      opt("분위기 보다가 낀다", "Read the room, then join in", +2),
      opt("말 걸어주길 기다린다", "Wait to be approached", -2),
      opt("최대한 빨리 나가고 싶다", "Just want to leave ASAP", -4),
    ],
  },
  {
    id: 4,
    dimension: "EI",
    category: { ko: "여가 시간 선택", en: "Free time" },
    prompt: {
      ko: "주말 계획이 없다:",
      en: "Free weekend, no plans:",
    },
    options: [
      opt("뭔가 사람 만날 걸 만든다", "Make plans to meet people", +3.5),
      opt("적당히 나갔다 온다", "Go out for a bit, come back", +1.5),
      opt("집에서 쉬는 게 최고다", "Home is the best", -2),
      opt("드디어 혼자만의 시간이다", "Finally — alone time", -3.5),
    ],
  },
  {
    id: 5,
    dimension: "EI",
    category: { ko: "에너지 정점", en: "Peak energy" },
    prompt: {
      ko: "내가 제일 에너지 넘칠 때:",
      en: "You feel most alive when:",
    },
    options: [
      opt("여러 사람 반응을 주고받으며 말이 붙을 때", "When I trade reactions with a lively group", +4),
      opt("친한 사람들과 깊지 않아도 계속 웃을 때", "When I keep laughing with familiar people", +2.5),
      opt("혼자 좋아하는 것에 오래 몰입할 때", "When I stay absorbed in what I like alone", -2),
      opt("아무도 나를 찾지 않는 시간이 길게 생길 때", "When no one needs me for a long stretch", -3.5),
    ],
  },
  {
    id: 6,
    dimension: "EI",
    category: { ko: "혼밥 감각", en: "Eating alone" },
    prompt: {
      ko: "혼자 밥 먹는 것:",
      en: "Eating alone:",
    },
    options: [
      opt("빈자리 하나가 신경 쓰여 누구라도 부른다", "The empty seat bothers me, so I call someone", +4),
      opt("짧게 먹는 날이면 혼자도 괜찮다", "If it is a quick meal, alone is fine", +2),
      opt("메뉴와 속도를 내 마음대로 정해서 편하다", "I like choosing the menu and pace myself", -2),
      opt("말 안 해도 되는 식사라 제일 좋다", "It is the best because I do not have to talk", -4),
    ],
  },
  {
    id: 7,
    dimension: "EI",
    category: { ko: "SNS 사용 이유", en: "Why you use social media" },
    prompt: {
      ko: "SNS를 하는 이유:",
      en: "Why you use social media:",
    },
    options: [
      opt("댓글과 DM으로 계속 연결돼 있으려고", "To stay connected through comments and DMs", +3.5),
      opt("올린 뒤 반응을 확인하는 재미가 있어서", "Because checking reactions after posting is fun", +2),
      opt("남들 근황만 조용히 훑어보려고", "To quietly skim other people's updates", -2),
      opt("내 생활을 굳이 밖에 열고 싶지 않아서", "Because I do not want to open my life outward much", -3.5),
    ],
  },

  // ─── S/N ───
  {
    id: 8,
    dimension: "SN",
    category: { ko: "프로젝트 시작점", en: "Project kickoff" },
    prompt: {
      ko: "새 프로젝트 시작할 때:",
      en: "Starting a new project:",
    },
    options: [
      opt("필요한 자료와 제약 조건부터 확인한다", "Check needed data and constraints first", +4),
      opt("당장 실행할 첫 단계부터 정한다", "Define the first practical step", +2.5),
      opt("이 일이 어디로 이어질지 큰 흐름을 그린다", "Map where this could lead", -2),
      opt("가능한 방향을 넓게 펼쳐보고 싶다", "Open up every possible direction first", -4),
    ],
  },
  {
    id: 9,
    dimension: "SN",
    category: { ko: "조언 스타일", en: "Advice style" },
    prompt: {
      ko: "친구가 고민 상담을 한다:",
      en: "Friend brings you a problem:",
    },
    options: [
      opt("먼저 상황을 정리하고 원인을 짚어준다", "First organize the situation and identify the cause", +4),
      opt("오늘 바로 해볼 수 있는 행동을 제안한다", "Suggest one action they can try today", +2.5),
      opt("친구가 진짜 원하는 방향을 같이 찾아본다", "Explore what they truly want from here", -2),
      opt("뜻밖의 선택지까지 넓게 던져본다", "Offer unexpected options they may not have considered", -3.5),
    ],
  },
  {
    id: 10,
    dimension: "SN",
    category: { ko: "계획 디테일", en: "Trip planning" },
    prompt: {
      ko: "여행 계획을 짤 때:",
      en: "Planning a trip:",
    },
    options: [
      opt("모든 일정 분단위로 짠다", "Schedule every minute", +4),
      opt("꼭 갈 곳만 찍어두고 사이 시간은 비워둔다", "Mark the must-visit spots and leave gaps open", +2),
      opt("그날의 분위기에 맞춰 동네만 정해둔다", "Choose the neighborhood and follow the day’s mood", -2),
      opt("도착해서 배고픔과 날씨에 맞춰 정한다", "Decide after arriving based on hunger and weather", -4),
    ],
  },
  {
    id: 11,
    dimension: "SN",
    category: { ko: "정보 전달 방식", en: "Explaining things" },
    prompt: {
      ko: "설명할 때 나는:",
      en: "When you explain something:",
    },
    options: [
      opt("상대가 따라 할 수 있게 순서대로 보여준다", "Show it step by step so they can follow", +3.5),
      opt("핵심 사실만 짧게 말하고 바로 결론을 준다", "Give only the key facts and the conclusion", +2),
      opt("비유나 장면으로 느낌이 오게 만든다", "Use a metaphor or scene so it clicks", -2),
      opt("먼저 왜 중요한지 큰 흐름부터 보여준다", "Start with why it matters in the bigger picture", -3.5),
    ],
  },
  {
    id: 12,
    dimension: "SN",
    category: { ko: "미래 인식", en: "View of the future" },
    prompt: {
      ko: "미래에 대해:",
      en: "About the future:",
    },
    options: [
      opt("연도별로 해야 할 일이 꽤 분명하다", "I can name what needs to happen by year", +3.5),
      opt("가까운 목표부터 현실적으로 잡아둔다", "I set realistic near-term goals first", +2),
      opt("정확한 계획보다 되고 싶은 모습이 먼저 있다", "I see who I want to become before the exact plan", -2),
      opt("하나로 정하기보다 여러 가능성을 열어두고 싶다", "I prefer keeping several possibilities open", -3.5),
    ],
  },
  {
    id: 13,
    dimension: "SN",
    category: { ko: "뉴스 소비 방식", en: "Reading the news" },
    prompt: {
      ko: "뉴스를 볼 때:",
      en: "When you read the news:",
    },
    options: [
      opt("숫자와 출처부터 확인한다", "Check the numbers and sources first", +4),
      opt("누가 무엇을 했는지 순서대로 정리한다", "Put who did what in order", +2),
      opt("이 일이 사람들에게 어떤 의미인지 본다", "Look at what it means for people", -2),
      opt("이후에 무엇으로 번질지 상상한다", "Imagine what it could lead to next", -4),
    ],
  },
  {
    id: 14,
    dimension: "SN",
    category: { ko: "쇼핑 패턴", en: "Shopping pattern" },
    prompt: {
      ko: "쇼핑할 때:",
      en: "When you shop:",
    },
    options: [
      opt("목록에 없던 건 마음에 들어도 내려놓는다", "If it is not on the list, I put it back even if I like it", +3.5),
      opt("가격과 후기를 비교한 뒤 필요한 것만 산다", "Compare price and reviews, then buy only what is needed", +2),
      opt("매장이나 피드에서 꽂히면 일단 장바구니에 넣는다", "If it catches me in a shop or feed, I add it to the cart", -2),
      opt("새 콘셉트가 떠오르면 세트로 한꺼번에 산다", "If a new concept hits, I buy the whole set at once", -3.5),
    ],
  },

  // ─── T/F ───
  {
    id: 15,
    dimension: "TF",
    category: { ko: "팩트 vs 배려", en: "Facts vs feelings" },
    prompt: {
      ko: "친구가 틀린 말을 한다:",
      en: "A friend says something wrong:",
    },
    options: [
      opt("그 자리에서 근거를 들어 바로잡는다", "Correct it on the spot with evidence", +4),
      opt("대화가 끝나기 전 조용히 사실을 알려준다", "Quietly tell them the fact before the conversation ends", +2.5),
      opt("사람들 앞인지 둘만 있는지 보고 정한다", "Decide based on whether others are there", -1),
      opt("틀린 걸 알아도 마음 상할까 봐 넘긴다", "Even if I know it is wrong, I let it pass to avoid hurting them", -3.5),
    ],
  },
  {
    id: 16,
    dimension: "TF",
    category: { ko: "결정 기준", en: "Decision basis" },
    prompt: {
      ko: "중요한 결정을 할 때:",
      en: "Making an important decision:",
    },
    options: [
      opt("표를 만들어 장단점과 숫자로 고른다", "Make a table and choose by pros, cons, and numbers", +4),
      opt("근거를 먼저 보고 마음은 마지막에 확인한다", "Check the evidence first and feelings last", +2.5),
      opt("관련된 사람에게 어떤 영향이 갈지 같이 본다", "Consider how it will affect the people involved", 0),
      opt("몸이 계속 당기는 쪽을 믿고 움직인다", "Trust the direction my body keeps leaning toward", -3.5),
    ],
  },
  {
    id: 17,
    dimension: "TF",
    category: { ko: "공감 반응", en: "Reaction to tears" },
    prompt: {
      ko: "누군가 울고 있다:",
      en: "Someone is crying in front of you:",
    },
    options: [
      opt("무슨 일이 있었는지 차분히 물어본다", "Calmly ask what happened", +4),
      opt("지금 필요한 도움을 바로 찾아준다", "Look for the help they need right now", +2.5),
      opt("먼저 곁에 있어주고 감정을 받아준다", "Stay beside them and receive the feeling first", -1.5),
      opt("감정이 같이 올라와 한동안 말없이 있어준다", "Feel it with them and sit quietly for a while", -4),
    ],
  },
  {
    id: 18,
    dimension: "TF",
    category: { ko: "감상 방식", en: "Watching style" },
    prompt: {
      ko: "드라마/영화 볼 때:",
      en: "Watching dramas or movies:",
    },
    options: [
      opt("설정 오류나 개연성이 먼저 걸린다", "Continuity and plot logic catch me first", +3.5),
      opt("전개가 시원하면 깊게 따지지 않는다", "If the pacing works, I do not overthink it", +2),
      opt("인물의 선택이 왜 그랬는지 따라간다", "I follow why each character chose that", -1),
      opt("인물 감정에 들어가서 같이 흔들린다", "I get pulled into the character's feelings", -3.5),
    ],
  },
  {
    id: 19,
    dimension: "TF",
    category: { ko: "상처 회복", en: "Hurt response" },
    prompt: {
      ko: "나는 상처를:",
      en: "When you get hurt by words:",
    },
    options: [
      opt("맞는 말이면 바로 고칠 부분부터 본다", "If it is true, I look at what to fix first", +4),
      opt("잠깐 찔리지만 다른 일로 금방 전환한다", "It stings briefly, then I switch to something else", +2.5),
      opt("그 말투와 상황을 몇 번 다시 떠올린다", "I replay the tone and situation a few times", -2),
      opt("괜찮은 척해도 말 한마디가 오래 남는다", "Even if I act fine, one sentence stays for a long time", -3.5),
    ],
  },
  {
    id: 20,
    dimension: "TF",
    category: { ko: "친구의 나쁜 선택", en: "Friend's bad choice" },
    prompt: {
      ko: "친구가 나쁜 선택을 했다:",
      en: "Your friend made a bad choice:",
    },
    options: [
      opt("위험한 부분을 바로 짚는다. 알아야 하니까", "Point out the risk directly because they need to know", +4),
      opt("예상되는 결과를 보여주며 다시 생각하게 한다", "Show likely consequences so they reconsider", +2.5),
      opt("상처받지 않게 조심스럽게 걱정을 전한다", "Share my concern carefully so it does not hurt", -1.5),
      opt("결정은 존중하되 곁에는 있어준다", "Respect their choice and stay beside them", -3.5),
    ],
  },
  {
    id: 21,
    dimension: "TF",
    category: { ko: "칭찬받는 반응", en: "Reaction to praise" },
    prompt: {
      ko: "칭찬받았을 때:",
      en: "When you get praised:",
    },
    options: [
      opt("어떤 점이 좋았는지 구체적으로 알고 싶다", "I want to know exactly what worked well", +3.5),
      opt("고맙다고 하고 다음 개선점도 같이 떠올린다", "Say thanks, then also think of the next improvement", +1.5),
      opt("나를 좋게 봐준 마음이 고맙게 느껴진다", "I feel grateful that they saw me warmly", -2),
      opt("그 말 하나가 오래 힘이 된다", "That one sentence gives me energy for a long time", -3.5),
    ],
  },

  // ─── J/P ───
  {
    id: 22,
    dimension: "JP",
    category: { ko: "하루 시작 방식", en: "Morning routine" },
    prompt: {
      ko: "아침에 일어나면:",
      en: "When you wake up:",
    },
    options: [
      opt("앱을 열어 오늘 할 일을 순서대로 확인한다", "Open the app and check today's tasks in order", +4),
      opt("꼭 해야 할 두세 가지만 머릿속에 잡는다", "Hold only two or three must-dos in my head", +2.5),
      opt("첫 일정 전까지는 몸 가는 대로 움직인다", "Until the first plan, I move by feel", -2),
      opt("일단 누워서 오늘이 어떤 날인지 감을 본다", "Stay in bed first and sense what kind of day it is", -4),
    ],
  },
  {
    id: 23,
    dimension: "JP",
    category: { ko: "마감 대처", en: "Deadline behavior" },
    prompt: {
      ko: "마감이 있을 때:",
      en: "When there's a deadline:",
    },
    options: [
      opt("초반에 큰 틀을 끝내고 마지막엔 확인만 한다", "Finish the main structure early and only check at the end", +3.5),
      opt("중간 체크포인트를 잡아두고 나눠서 한다", "Set midpoints and split the work", +2),
      opt("압박이 와야 집중돼서 전날 몰아친다", "I focus when pressure arrives, so I sprint the day before", -2.5),
      opt("마감 당일의 긴장감으로 겨우 불을 붙인다", "The deadline-day tension is what finally lights the fire", -4),
    ],
  },
  {
    id: 24,
    dimension: "JP",
    category: { ko: "준비 타이밍", en: "Packing timing" },
    prompt: {
      ko: "여행 짐 싸기:",
      en: "Packing for a trip:",
    },
    options: [
      opt("체크리스트를 만들고 일주일 전부터 채운다", "Make a checklist and start filling it a week ahead", +4),
      opt("필수품만 먼저 챙기고 나머지는 며칠 전 정리한다", "Pack essentials first and sort the rest a few days before", +2.5),
      opt("전날 밤에 옷을 펼쳐놓고 그때그때 고른다", "Lay things out the night before and decide as I go", -2),
      opt("출발 직전에 눈에 보이는 것부터 가방에 넣는다", "Right before leaving, I throw in whatever I see first", -3.5),
    ],
  },
  {
    id: 25,
    dimension: "JP",
    category: { ko: "변화 대응", en: "Adapting to change" },
    prompt: {
      ko: "계획이 갑자기 바뀌면:",
      en: "Plans suddenly change:",
    },
    options: [
      opt("바뀐 이유와 새 일정을 바로 확인해야 한다", "I need the reason and new schedule right away", +4),
      opt("아쉽지만 가능한 대안을 빠르게 다시 짠다", "I am bummed, but quickly rebuild a workable option", +2.5),
      opt("일단 움직이면서 맞춰도 된다고 본다", "I think we can adjust while moving", -2),
      opt("정해진 게 풀리면 오히려 선택지가 많아져 좋다", "When fixed plans loosen, I like having more options", -3.5),
    ],
  },
  {
    id: 26,
    dimension: "JP",
    category: { ko: "공간 정리", en: "Space tidiness" },
    prompt: {
      ko: "내 방/책상 상태:",
      en: "Your room or desk:",
    },
    options: [
      opt("물건마다 자리가 정해져 있고 바로 돌려놓는다", "Every item has a place and goes back there", +3.5),
      opt("보이는 곳은 깔끔하게 유지하려고 한다", "I try to keep visible areas clean", +2),
      opt("쓰는 물건은 손 닿는 곳에 펼쳐둔다", "I leave active items within reach", -2),
      opt("남이 보면 혼돈이지만 내 동선에는 맞다", "It looks chaotic to others but fits my flow", -3.5),
    ],
  },
  {
    id: 27,
    dimension: "JP",
    category: { ko: "빈 시간 활용", en: "Free time usage" },
    prompt: {
      ko: "갑자기 생긴 빈 시간:",
      en: "Unexpected free time:",
    },
    options: [
      opt("미뤄둔 일을 하나 골라 바로 끝낸다", "Pick one delayed task and finish it", +4),
      opt("언젠가 하려던 작은 계획 하나를 꺼낸다", "Pull out one small plan I meant to do someday", +2),
      opt("그 순간 끌리는 곳으로 바로 움직인다", "Move toward whatever draws me in that moment", -2),
      opt("뭘 할지 고르다 시간이 다 지나간다", "Time passes while I choose what to do", -3.5),
    ],
  },
  {
    id: 28,
    dimension: "JP",
    category: { ko: "답장 패턴", en: "Reply pattern" },
    prompt: {
      ko: "이메일/문자 답장:",
      en: "Replying to messages:",
    },
    options: [
      opt("읽으면 바로 처리한다. 남겨두는 게 싫다", "If I read it, I handle it right away", +3.5),
      opt("답장할 시간을 정해두고 한 번에 처리한다", "Batch replies at a time I set aside", +1.5),
      opt("머릿속으로 답한 뒤 실제 전송을 미룬다", "Reply in my head, then delay sending it", -2),
      opt("흐름이 오면 답하고 아니면 며칠 지나간다", "Reply when the mood hits, otherwise days pass", -3.5),
    ],
  },
];

// ─────────────────────── Type taglines (16 MBTI codes) ───────────────────────

export const TYPE_TAGLINES: Record<string, Bilingual> = {
  ESTJ: { ko: "현실을 정리해 굴러가게 만드는 사람", en: "Cold Pragmatic Planner" },
  ESTP: { ko: "상황을 보고 바로 몸이 먼저 나가는 사람", en: "Realistic Improviser" },
  ESFJ: { ko: "사람과 일을 동시에 챙기는 생활 관리자", en: "Warm Practical Planner" },
  ESFP: { ko: "지금 이 순간을 살려내는 분위기 스위치", en: "Vivid Social Improviser" },
  ENTJ: { ko: "큰 그림을 실행표로 바꾸는 추진가", en: "Driving Visionary Commander" },
  ENTP: { ko: "가능성에 불을 붙이는 질문러", en: "Endless Possibility Debater" },
  ENFJ: { ko: "사람의 방향까지 함께 보는 리더", en: "People-First Visionary" },
  ENFP: { ko: "아이디어와 감정이 같이 뛰는 자유형", en: "Inspired Free Spirit" },
  ISTJ: { ko: "말보다 결과로 신뢰를 쌓는 사람", en: "Quiet Realistic Executor" },
  ISTP: { ko: "조용히 뜯어보고 정확히 고치는 사람", en: "Quiet Pragmatic Analyst" },
  ISFJ: { ko: "눈에 안 띄게 관계를 지탱하는 사람", en: "Devoted Realistic Guardian" },
  ISFP: { ko: "조용하지만 취향과 선이 분명한 사람", en: "Quiet Sensitive Wanderer" },
  INTJ: { ko: "머릿속 설계도를 현실에 맞추는 전략가", en: "Strategic Visionary Architect" },
  INTP: { ko: "생각의 지도를 혼자 끝까지 펼치는 사람", en: "Pondering Possibility Researcher" },
  INFJ: { ko: "사람 마음의 결을 깊게 읽는 안내자", en: "Deep Insightful Guide" },
  INFP: { ko: "마음속 기준선이 조용히 뚜렷한 사람", en: "Inner Meaning Seeker" },
};

// ─────────────────────── Scoring ───────────────────────

export type DimResult = {
  dimension: Dimension;
  side: Side;        // E/I/S/N/T/F/J/P
  level: Level;      // 1..4
  rawSum: number;
  rawAvg: number;
};

export type FullResult = {
  E: DimResult;
  S: DimResult;
  T: DimResult;
  J: DimResult;
  /** 4-letter MBTI code (e.g. "ENTJ") */
  code: string;
  /** Detail string (e.g. "E3 / N4 / T4 / J2") */
  detail: string;
};

function bucket(avg: number): Level {
  const a = Math.abs(avg);
  if (a >= 3.5) return 4;
  if (a >= 2.5) return 3;
  if (a >= 1.5) return 2;
  return 1;
}

function dimResult(
  scores: number[],
  positive: Side,
  negative: Side,
  dimension: Dimension,
): DimResult {
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = sum / scores.length;
  const side = avg >= 0 ? positive : negative;
  const level = bucket(avg);
  return { dimension, side, level, rawSum: sum, rawAvg: avg };
}

export function computeResult(answers: number[]): FullResult {
  const ei = dimResult(answers.slice(0, 7), "E", "I", "EI");
  const sn = dimResult(answers.slice(7, 14), "S", "N", "SN");
  const tf = dimResult(answers.slice(14, 21), "T", "F", "TF");
  const jp = dimResult(answers.slice(21, 28), "J", "P", "JP");
  const code = `${ei.side}${sn.side}${tf.side}${jp.side}`;
  const detail = `${ei.side}${ei.level} / ${sn.side}${sn.level} / ${tf.side}${tf.level} / ${jp.side}${jp.level}`;
  return { E: ei, S: sn, T: tf, J: jp, code, detail };
}

/** One-line summary phrase for the 4-letter MBTI code. */
export function comboTagline(result: FullResult, locale: "ko" | "en"): string {
  return TYPE_TAGLINES[result.code]?.[locale] ?? result.code;
}
