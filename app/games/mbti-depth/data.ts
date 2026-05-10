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
    title: { ko: "외향 — 내향", en: "Extrovert — Introvert" },
    question: {
      ko: "당신은 어디서 에너지를 얻나요?",
      en: "Where do you draw your energy from?",
    },
  },
  SN: {
    ordinal: { ko: "두 번째 분석", en: "Second analysis" },
    title: { ko: "현실 — 직관", en: "Sensing — Intuition" },
    question: {
      ko: "당신은 무엇을 믿나요?",
      en: "What do you trust?",
    },
  },
  TF: {
    ordinal: { ko: "세 번째 분석", en: "Third analysis" },
    title: { ko: "논리 — 감정", en: "Thinking — Feeling" },
    question: {
      ko: "당신은 어떻게 결정하나요?",
      en: "How do you make decisions?",
    },
  },
  JP: {
    ordinal: { ko: "네 번째 분석", en: "Fourth analysis" },
    title: { ko: "계획 — 즉흥", en: "Planning — Improvising" },
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
      title: { ko: "에너지 뱀파이어", en: "Energy Vampire" },
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
      title: { ko: "사교형", en: "Social Type" },
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
      title: { ko: "선택적 외향", en: "Selective Extrovert" },
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
      title: { ko: "경계선 (E 쪽)", en: "Borderline (E-leaning)" },
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
      title: { ko: "경계선 (I 쪽)", en: "Borderline (I-leaning)" },
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
      title: { ko: "충전형 내향", en: "Recharging Introvert" },
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
      title: { ko: "은둔형", en: "Hermit" },
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
      title: { ko: "완전 은둔", en: "Total Hermit" },
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
      title: { ko: "극현실주의자", en: "Extreme Realist" },
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
      title: { ko: "현실주의자", en: "Realist" },
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
      title: { ko: "중간형 현실", en: "Practical Imaginer" },
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
      title: { ko: "경계선 (S 쪽)", en: "Borderline (S-leaning)" },
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
      title: { ko: "경계선 (N 쪽)", en: "Borderline (N-leaning)" },
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
      title: { ko: "몽상가", en: "Dreamer" },
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
      title: { ko: "미래주의자", en: "Futurist" },
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
      title: { ko: "완전 몽상가", en: "Pure Dreamer" },
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
      title: { ko: "거의 사이코패스", en: "Borderline Sociopath" },
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
      title: { ko: "냉정한 논리주의자", en: "Cold Logician" },
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
      title: { ko: "논리 우선", en: "Logic First" },
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
      title: { ko: "경계선 (T 쪽)", en: "Borderline (T-leaning)" },
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
      title: { ko: "경계선 (F 쪽)", en: "Borderline (F-leaning)" },
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
      title: { ko: "공감형", en: "Empath" },
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
      title: { ko: "감정 스펀지", en: "Emotional Sponge" },
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
      title: { ko: "감정 과부하", en: "Emotional Overload" },
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
      title: { ko: "통제 광", en: "Control Freak" },
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
      title: { ko: "계획주의자", en: "Planner" },
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
      title: { ko: "중간형 계획", en: "Flexible Planner" },
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
      title: { ko: "경계선 (J 쪽)", en: "Borderline (J-leaning)" },
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
      title: { ko: "경계선 (P 쪽)", en: "Borderline (P-leaning)" },
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
      title: { ko: "즉흥형", en: "Spontaneous" },
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
      title: { ko: "자유형", en: "Free Spirit" },
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
      title: { ko: "완전 카오스", en: "Pure Chaos" },
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
      opt("친구들 만나서 떠든다", "Meet friends and chat loudly", +4),
      opt("적당한 사람들과 가볍게 논다", "Hang out lightly with a few", +2.5),
      opt("혼자 조용히 쉰다", "Quiet time, alone", -2.5),
      opt("완전히 혼자 아무것도 안 한다", "Total solitude, doing nothing", -4),
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
      opt("신난다, 바로 간다", "Excited — going right now", +4),
      opt("가긴 가는데 일찍 나온다", "Will go, but leave early", +1.5),
      opt("핑계 찾아본다", "Looking for excuses", -2.5),
      opt("절대 안 간다", "Absolutely not", -4),
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
      opt("사람들 사이에 있을 때", "Surrounded by people", +4),
      opt("친한 사람들이랑 있을 때", "With close friends", +2.5),
      opt("혼자 좋아하는 거 할 때", "Alone, doing what I love", -2),
      opt("완전히 아무도 없을 때", "Completely by myself", -3.5),
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
      opt("어색하다 누구라도 부른다", "Awkward — I'd call someone", +4),
      opt("가끔은 괜찮다", "Sometimes okay", +2),
      opt("오히려 편하다", "Actually comfortable", -2),
      opt("제일 좋다", "It's the best", -4),
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
      opt("사람들이랑 소통하려고", "To stay connected with people", +3.5),
      opt("관심받는 게 좋아서", "I like the attention", +2),
      opt("그냥 보기만 한다", "I just lurk", -2),
      opt("거의 안 한다", "I barely use it", -3.5),
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
      opt("구체적인 계획과 데이터부터", "Concrete plan + data first", +4),
      opt("현실적인 목표 먼저", "Realistic goals first", +2.5),
      opt("큰 그림 그리고 세부는 나중에", "Big picture, details later", -2),
      opt("일단 상상부터 한다", "Imagine wildly first", -4),
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
      opt("현실적인 해결책을 준다", "Give a practical solution", +4),
      opt("실질적인 조언을 한다", "Give grounded advice", +2.5),
      opt("가능성을 같이 탐색한다", "Explore possibilities together", -2),
      opt("아이디어를 쏟아낸다", "Pour out ideas", -3.5),
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
      opt("주요 일정만 잡는다", "Lock in the major stuff", +2),
      opt("대략적인 방향만 정한다", "Rough direction only", -2),
      opt("그냥 가서 생각한다", "Show up and figure it out", -4),
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
      opt("구체적인 예시와 데이터로", "With specific examples + data", +3.5),
      opt("사실 위주로 간결하게", "Concise, fact-driven", +2),
      opt("비유와 개념으로", "Metaphors and concepts", -2),
      opt("큰 그림과 가능성으로", "Big picture and possibility", -3.5),
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
      opt("구체적인 계획이 있다", "I have a concrete plan", +3.5),
      opt("현실적인 목표가 있다", "I have realistic goals", +2),
      opt("막연하지만 비전이 있다", "Vague but a vision exists", -2),
      opt("가능성이 무한하다고 생각한다", "Possibilities are infinite", -3.5),
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
      opt("팩트와 수치 위주로 본다", "Facts and figures first", +4),
      opt("사건의 흐름을 파악한다", "Follow the story arc", +2),
      opt("의미와 영향을 생각한다", "Think about meaning and impact", -2),
      opt("미래 시나리오를 상상한다", "Imagine future scenarios", -4),
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
      opt("필요한 것만 산다", "Only what I need", +3.5),
      opt("미리 조사하고 산다", "Research first, then buy", +2),
      opt("끌리면 산다", "If I'm drawn to it, I buy", -2),
      opt("영감받으면 충동구매한다", "Inspired = impulse buy", -3.5),
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
      opt("바로 지적한다. 틀린 건 틀린 거", "Correct them. Wrong is wrong", +4),
      opt("부드럽게 사실을 말한다", "Gently state the facts", +2.5),
      opt("상황 봐서 말한다", "Depends on the situation", -1),
      opt("상처받을까봐 그냥 넘긴다", "Let it slide so they're not hurt", -3.5),
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
      opt("100% 논리와 데이터로", "100% logic and data", +4),
      opt("주로 논리, 감정은 참고", "Mostly logic, feelings as input", +2.5),
      opt("논리와 감정 반반", "Half logic, half feelings", 0),
      opt("느낌이 더 중요하다", "Gut feeling matters most", -3.5),
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
      opt("왜 우는지 원인 파악부터", "Identify the root cause first", +4),
      opt("해결책을 찾아준다", "Find them a solution", +2.5),
      opt("일단 공감하고 나서 도움", "Empathize first, then help", -1.5),
      opt("같이 울 것 같다", "I'd cry too, probably", -4),
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
      opt("스토리 개연성이 먼저 보인다", "I notice plot holes first", +3.5),
      opt("재밌으면 됐다", "Fun is fun, that's enough", +2),
      opt("감정 이입도 하고 분석도 한다", "Both feel and analyze", -1),
      opt("완전히 감정 이입해서 본다", "Fully emotionally invested", -3.5),
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
      opt("잘 안 받는다. 사실이면 맞는 말", "Rarely. If it's true, it's true", +4),
      opt("받긴 하는데 금방 넘긴다", "I get hurt but move on fast", +2.5),
      opt("받고 한동안 생각한다", "It stays with me for a while", -2),
      opt("오래 간다. 말 한마디가 크다", "It lingers. Words matter so much", -3.5),
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
      opt("바로 말한다. 알아야 하니까", "I tell them right away — they should know", +4),
      opt("결과를 보여주며 설득한다", "Show them the consequences and persuade", +2.5),
      opt("조심스럽게 의견을 말한다", "Carefully offer my opinion", -1.5),
      opt("본인이 결정한 거니까 지지한다", "It's their call — I support them", -3.5),
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
      opt("당연한 결과다", "It's the expected outcome", +3.5),
      opt("기분 좋지만 티 안 낸다", "Feels good but I hide it", +1.5),
      opt("기분 좋고 더 잘하고 싶다", "Feels good — motivates me", -2),
      opt("엄청 기분 좋고 오래 기억한다", "Huge mood — I remember it forever", -3.5),
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
      opt("오늘 할 일 리스트 확인한다", "Check today's to-do list", +4),
      opt("대략적인 계획을 머릿속에 그린다", "Sketch a rough mental plan", +2.5),
      opt("그때그때 생각한다", "Figure it out as I go", -2),
      opt("일어난 것만으로도 대단하다", "Just being awake is an achievement", -4),
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
      opt("미리미리 끝낸다", "Finish way ahead of time", +3.5),
      opt("적당히 미리 한다", "Get it done early-ish", +2),
      opt("마감 전날 한다", "Day before, every time", -2.5),
      opt("마감 당일 한다", "Day of, every time", -4),
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
      opt("일주일 전에 다 싼다", "Packed a week in advance", +4),
      opt("2-3일 전에 싼다", "Packed 2–3 days before", +2.5),
      opt("전날 밤에 싼다", "Night before", -2),
      opt("당일 아침에 싼다", "Morning of departure", -3.5),
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
      opt("스트레스 받는다. 미리 알았어야지", "Stressed. Should've been warned", +4),
      opt("아쉽지만 적응한다", "Bummed, but I adapt", +2.5),
      opt("괜찮다. 어떻게든 된다", "Fine. It works out", -2),
      opt("오히려 좋다. 즉흥이 재밌다", "Even better — spontaneity rules", -3.5),
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
      opt("항상 정리돼 있다", "Always organized", +3.5),
      opt("대체로 깔끔하다", "Mostly clean", +2),
      opt("약간 어수선하다", "A bit messy", -2),
      opt("카오스지만 나는 어디있는지 안다", "Chaos, but I know where everything is", -3.5),
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
      opt("밀린 할 일을 처리한다", "Tackle the backlog", +4),
      opt("계획했던 것 중 하나 한다", "Do one of the things I'd planned", +2),
      opt("하고 싶은 거 즉흥으로 한다", "Whatever I feel like, in the moment", -2),
      opt("아무것도 안 하다 끝난다", "End up doing nothing", -3.5),
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
      opt("바로 답장한다", "Reply right away", +3.5),
      opt("읽고 시간날 때 답장한다", "Read it, reply when free", +1.5),
      opt("나중에 하려다 까먹는다", "Mean to reply later, forget", -2),
      opt("읽씹이 기본이다", "Read and ignore is my default", -3.5),
    ],
  },
];

// ─────────────────────── Type taglines (16 MBTI codes) ───────────────────────

export const TYPE_TAGLINES: Record<string, Bilingual> = {
  ESTJ: { ko: "냉정한 현실 계획형", en: "Cold Pragmatic Planner" },
  ESTP: { ko: "즉흥적 현실 행동가", en: "Realistic Improviser" },
  ESFJ: { ko: "따뜻한 현실 계획형", en: "Warm Practical Planner" },
  ESFP: { ko: "활기찬 즉흥 사교형", en: "Vivid Social Improviser" },
  ENTJ: { ko: "추진하는 비전 사령관", en: "Driving Visionary Commander" },
  ENTP: { ko: "끝없는 가능성 토론가", en: "Endless Possibility Debater" },
  ENFJ: { ko: "사람 중심의 비전가", en: "People-First Visionary" },
  ENFP: { ko: "영감 가득한 자유 영혼", en: "Inspired Free Spirit" },
  ISTJ: { ko: "묵묵한 현실 수행자", en: "Quiet Realistic Executor" },
  ISTP: { ko: "조용한 실용 분석가", en: "Quiet Pragmatic Analyst" },
  ISFJ: { ko: "헌신적인 현실 수호자", en: "Devoted Realistic Guardian" },
  ISFP: { ko: "조용한 감성 자유인", en: "Quiet Sensitive Wanderer" },
  INTJ: { ko: "전략적 비전 설계자", en: "Strategic Visionary Architect" },
  INTP: { ko: "사색하는 가능성 탐구자", en: "Pondering Possibility Researcher" },
  INFJ: { ko: "깊이 있는 통찰 안내자", en: "Deep Insightful Guide" },
  INFP: { ko: "내면의 의미 탐구자", en: "Inner Meaning Seeker" },
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
