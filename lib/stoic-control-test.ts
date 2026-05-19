export type StoicControlId =
  | "present-action"
  | "others-opinion"
  | "future"
  | "emotions"
  | "outcome"
  | "relationships"
  | "perfect-self"
  | "past";

export type LocalText = {
  ko: string;
  en: string;
};

export type StoicChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<StoicControlId, number>>;
};

export type StoicQuestion = {
  id: string;
  targetDimension: string;
  rationale: string;
  prompt: LocalText;
  choices: StoicChoice[];
};

export type StoicResult = {
  id: StoicControlId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  cannotControl: LocalText;
  canChoose: LocalText;
  reflection: LocalText;
  hint: LocalText;
  shareLine: LocalText;
};

export type StoicAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<StoicControlId, number>>;
};

export const STOIC_RESULTS: StoicResult[] = [
  {
    id: "present-action",
    title: { ko: "지금 할 수 있는 행동으로 돌아오는 사람", en: "Returning to Present Action" },
    oneLiner: {
      ko: "불안한 순간에도 지금 선택할 수 있는 작은 행동을 찾는 사람",
      en: "Even under stress, you look for the small action available now.",
    },
    description: {
      ko: "당신은 불확실한 상황에서 모든 것을 붙잡기보다, 지금 손에 있는 행동으로 마음을 돌리려는 편입니다. 결과나 평가를 완전히 내려놓는 것은 아니지만, 멈춰 있기보다 다음 한 걸음을 정하면 조금 안정됩니다.",
      en: "In uncertain moments, you tend to return to what can be done now instead of trying to hold everything at once. You do not ignore outcomes or opinions, but choosing a next step helps you feel steadier.",
    },
    cannotControl: {
      ko: "상대의 반응, 최종 결과, 우연한 변수, 이미 지나간 장면.",
      en: "Other people's reactions, final outcomes, chance variables, and scenes that have already passed.",
    },
    canChoose: {
      ko: "지금 확인할 정보, 오늘의 작은 행동, 다음에 건넬 말, 내가 지킬 태도.",
      en: "Information you can check now, a small action today, the next words you choose, and the attitude you keep.",
    },
    reflection: {
      ko: "통제할 수 없는 것을 전부 내려놓기는 어렵지만, 지금 할 수 있는 일 하나는 마음을 현재로 데려옵니다.",
      en: "It is hard to let go of everything outside your control, but one available action can bring your mind back to the present.",
    },
    hint: {
      ko: "불안이 커질 때는 “지금 내가 실제로 할 수 있는 가장 작은 행동은?”이라고 물어보세요.",
      en: "When anxiety grows, ask: \"What is the smallest thing I can actually do now?\"",
    },
    shareLine: {
      ko: "나는 스토아 철학 테스트에서 지금 할 수 있는 행동으로 돌아오는 사람 유형이 나왔다.",
      en: "My Stoic Control result is Returning to Present Action.",
    },
  },
  {
    id: "others-opinion",
    title: { ko: "타인의 평가를 통제하려는 사람", en: "Trying to Control How Others See You" },
    oneLiner: {
      ko: "남들이 나를 어떻게 볼지에 마음이 오래 머무는 사람",
      en: "Your mind lingers on how others may see you.",
    },
    description: {
      ko: "당신은 자신의 행동보다 그 행동이 어떻게 보일지를 먼저 생각할 때가 있습니다. 좋은 인상을 남기고 싶은 마음이 크지만, 그만큼 타인의 시선이 마음의 방향을 자주 흔들 수 있어요.",
      en: "You may think about how your actions will look before thinking about the actions themselves. Wanting to leave a good impression is natural, but other people's gaze can pull your mind around.",
    },
    cannotControl: {
      ko: "타인이 나를 완전히 이해하는 방식, 그들의 평가, 그날의 기분.",
      en: "How fully others understand you, their judgments, and their mood that day.",
    },
    canChoose: {
      ko: "내가 지키고 싶은 태도, 설명할 수 있는 만큼의 말, 이후의 행동.",
      en: "The attitude you keep, the words you can offer, and what you do next.",
    },
    reflection: {
      ko: "타인의 평가는 내 손 안에 완전히 들어오지 않습니다. 내가 다룰 수 있는 것은 내가 선택한 태도와 행동입니다.",
      en: "Other people's opinions never fully sit in your hands. What you can handle is the attitude and action you choose.",
    },
    hint: {
      ko: "오늘은 ‘어떻게 보일까?’보다 ‘나는 어떤 태도로 행동하고 싶은가?’를 먼저 물어보세요.",
      en: "Today, ask 'What attitude do I want to act from?' before 'How will this look?'",
    },
    shareLine: {
      ko: "나는 타인의 평가를 놓기 어려운 스토아 타입이래.",
      en: "My Stoic control pattern is trying to control how others see me.",
    },
  },
  {
    id: "future",
    title: { ko: "미래를 통제하려는 사람", en: "Trying to Control the Future" },
    oneLiner: {
      ko: "아직 오지 않은 일을 머릿속에서 여러 번 살아보는 사람",
      en: "You live through future scenarios many times in your head.",
    },
    description: {
      ko: "당신은 미래의 변수들을 미리 계산하며 불안을 줄이려는 편입니다. 준비하는 힘은 좋지만, 아직 오지 않은 일을 너무 오래 붙잡으면 오늘의 에너지까지 먼저 써버릴 수 있어요.",
      en: "You try to reduce anxiety by calculating future variables in advance. Preparation is useful, but holding the future too tightly can spend today's energy early.",
    },
    cannotControl: {
      ko: "모든 변수, 타이밍, 우연, 아직 일어나지 않은 사람들의 선택.",
      en: "Every variable, timing, chance, and choices people have not made yet.",
    },
    canChoose: {
      ko: "오늘 할 수 있는 준비, 확인할 수 있는 정보, 지금의 작은 행동.",
      en: "Today's preparation, information you can check, and the small action available now.",
    },
    reflection: {
      ko: "미래 전체는 내 것이 아니지만, 오늘의 준비는 내 것입니다.",
      en: "The whole future is not yours, but today's preparation is.",
    },
    hint: {
      ko: "머릿속 시나리오를 하나 줄이고, 실제로 할 수 있는 작은 준비 하나를 적어보세요.",
      en: "Put down one mental scenario and write one small preparation you can actually do.",
    },
    shareLine: {
      ko: "나는 아직 오지 않은 미래를 자꾸 붙잡는 타입이래.",
      en: "My Stoic control pattern is trying to control the future.",
    },
  },
  {
    id: "emotions",
    title: { ko: "감정을 통제하려는 사람", en: "Trying to Control Your Emotions" },
    oneLiner: {
      ko: "흔들리면 안 된다고 스스로를 다그치는 사람",
      en: "You push yourself not to be shaken.",
    },
    description: {
      ko: "당신은 감정이 올라오는 것 자체를 약함처럼 느낄 때가 있습니다. 그래서 불안, 서운함, 화를 빨리 정리하려 하지만, 감정은 명령만으로 바로 사라지지는 않아요.",
      en: "You may treat the arrival of emotion as weakness. You try to quickly organize anxiety, hurt, or anger, but emotions do not disappear by command.",
    },
    cannotControl: {
      ko: "감정이 처음 올라오는 속도, 몸의 긴장, 순간적인 흔들림.",
      en: "The first rise of emotion, body tension, and the first moment of being shaken.",
    },
    canChoose: {
      ko: "감정 뒤에 이어질 말과 행동, 쉬어갈 시간, 나를 다루는 방식.",
      en: "The words and actions after the feeling, a pause, and how you treat yourself.",
    },
    reflection: {
      ko: "감정은 명령으로 사라지지 않습니다. 다만 감정 뒤의 행동은 선택할 수 있습니다.",
      en: "Emotions do not vanish by command. But the action after an emotion can be chosen.",
    },
    hint: {
      ko: "‘이 감정이 없어져야 해’보다 ‘이 감정이 있는 채로 무엇을 선택할까?’를 물어보세요.",
      en: "Instead of 'This feeling must disappear,' ask 'What can I choose while this feeling is here?'",
    },
    shareLine: {
      ko: "나는 감정까지 통제하려다 지치는 타입이래.",
      en: "My Stoic control pattern is trying to control my emotions.",
    },
  },
  {
    id: "outcome",
    title: { ko: "결과를 통제하려는 사람", en: "Trying to Control the Outcome" },
    oneLiner: {
      ko: "과정보다 결과가 마음을 더 크게 흔드는 사람",
      en: "The outcome shakes you more than the process.",
    },
    description: {
      ko: "당신은 노력보다 결과가 어떻게 나올지를 더 오래 붙잡을 수 있습니다. 잘하고 싶은 마음이 큰 만큼, 아직 나오지 않은 결과가 현재의 마음까지 크게 흔들 때가 있어요.",
      en: "You may hold onto the outcome longer than the effort itself. Because you care about doing well, an unfinished result can disturb the present.",
    },
    cannotControl: {
      ko: "최종 평가, 상대의 반응, 운과 환경, 결과가 나오는 방식.",
      en: "Final evaluation, other people's reactions, luck, context, and how results arrive.",
    },
    canChoose: {
      ko: "과정에 들이는 성실함, 마무리의 태도, 결과 뒤의 다음 행동.",
      en: "Your sincerity in the process, your attitude at the finish, and the next action after the result.",
    },
    reflection: {
      ko: "결과는 여러 조건의 합이지만, 과정에 담는 태도는 내 선택입니다.",
      en: "An outcome is a sum of many conditions; the attitude you put into the process is yours.",
    },
    hint: {
      ko: "오늘의 기준을 결과가 아니라 ‘내가 과정에 무엇을 담았는가’로 한 번 바꿔보세요.",
      en: "Try measuring today by what you put into the process, not only by the result.",
    },
    shareLine: {
      ko: "나는 결과를 놓기 어려운 스토아 타입이래.",
      en: "My Stoic control pattern is trying to control the outcome.",
    },
  },
  {
    id: "relationships",
    title: { ko: "관계의 흐름을 통제하려는 사람", en: "Trying to Control Relationships" },
    oneLiner: {
      ko: "멀어지는 느낌을 견디기 어려운 사람",
      en: "Distance in relationships is hard for you to sit with.",
    },
    description: {
      ko: "당신은 관계의 거리, 답장, 분위기 변화를 오래 신경 쓰는 편입니다. 가까움을 소중히 여기기 때문에 작은 변화도 크게 느껴질 수 있어요.",
      en: "You may spend a long time thinking about distance, replies, and shifts in mood. Because closeness matters to you, small changes can feel large.",
    },
    cannotControl: {
      ko: "상대의 마음, 답장 속도, 관계가 흘러가는 모든 속도.",
      en: "The other person's heart, reply speed, and every pace of the relationship.",
    },
    canChoose: {
      ko: "내 진심을 전하는 방식, 나의 경계, 기다리는 동안 나를 돌보는 태도.",
      en: "How you express sincerity, your boundaries, and how you care for yourself while waiting.",
    },
    reflection: {
      ko: "상대의 마음은 소유할 수 없지만, 나의 진심과 경계는 선택할 수 있습니다.",
      en: "You cannot possess another person's heart, but you can choose your sincerity and boundaries.",
    },
    hint: {
      ko: "상대의 반응을 붙잡기 전에, 내가 지금 지키고 싶은 관계의 태도를 먼저 정리해보세요.",
      en: "Before holding onto their reaction, name the relationship attitude you want to keep.",
    },
    shareLine: {
      ko: "나는 관계의 흐름을 통제하고 싶어지는 타입이래.",
      en: "My Stoic control pattern is trying to control relationships.",
    },
  },
  {
    id: "perfect-self",
    title: { ko: "완벽한 나를 통제하려는 사람", en: "Trying to Control Your Perfect Self" },
    oneLiner: {
      ko: "실수 없는 나를 만들려다 지치는 사람",
      en: "You get tired trying to become someone who never slips.",
    },
    description: {
      ko: "당신은 부족한 모습을 보이는 것을 쉽게 받아들이지 못할 수 있습니다. 더 나은 사람이 되고 싶은 마음이 강하지만, 완벽한 나만 허락하려 하면 숨 쉴 공간이 줄어들어요.",
      en: "You may struggle to accept showing your unfinished parts. Wanting to improve is meaningful, but allowing only a perfect self can shrink your breathing room.",
    },
    cannotControl: {
      ko: "실수 없는 인간이 되는 것, 매 순간 흔들리지 않는 모습, 모두에게 완성되어 보이는 일.",
      en: "Becoming a person without mistakes, never being shaken, and appearing complete to everyone.",
    },
    canChoose: {
      ko: "실수 뒤의 회복, 배우려는 태도, 나를 너무 거칠게 대하지 않는 방식.",
      en: "Recovery after mistakes, a learning attitude, and a less harsh way of treating yourself.",
    },
    reflection: {
      ko: "인간은 완성품이 아니라 훈련 중인 존재입니다.",
      en: "A human being is not a finished product, but a being in practice.",
    },
    hint: {
      ko: "오늘은 완벽한 내가 아니라, 회복 가능한 나를 기준으로 삼아보세요.",
      en: "Today, measure yourself by being recoverable, not perfect.",
    },
    shareLine: {
      ko: "나는 완벽한 나를 통제하려다 지치는 타입이래.",
      en: "My Stoic control pattern is trying to control my perfect self.",
    },
  },
  {
    id: "past",
    title: { ko: "지나간 일을 통제하려는 사람", en: "Trying to Control the Past" },
    oneLiner: {
      ko: "이미 지난 장면을 마음속에서 계속 고쳐 쓰는 사람",
      en: "You keep rewriting scenes that have already passed.",
    },
    description: {
      ko: "당신은 과거의 말, 선택, 실수를 자주 다시 떠올릴 수 있습니다. 그때 다르게 했더라면 어땠을지 생각하며, 이미 지나간 장면을 마음속에서 여러 번 고쳐 쓰는 편이에요.",
      en: "You may often replay old words, choices, and mistakes. Your mind rewrites scenes that already passed, wondering what would have happened if you had acted differently.",
    },
    cannotControl: {
      ko: "이미 끝난 말, 지나간 선택, 그때의 분위기와 반응.",
      en: "Words already spoken, choices already made, and the mood and reactions of that moment.",
    },
    canChoose: {
      ko: "그 일을 해석하는 방식, 다음에 다르게 해볼 작은 선택, 오늘의 방향.",
      en: "How you interpret it, the small choice you can try next time, and today's direction.",
    },
    reflection: {
      ko: "과거는 바꿀 수 없지만, 그 일을 해석하는 방식은 조금씩 달라질 수 있습니다.",
      en: "The past cannot be changed, but the way you interpret it can slowly change.",
    },
    hint: {
      ko: "후회가 올라오면 ‘그때의 나에게 정보가 지금만큼 있었나?’를 조용히 물어보세요.",
      en: "When regret rises, ask gently: 'Did I know then what I know now?'",
    },
    shareLine: {
      ko: "나는 지나간 일을 마음속에서 자주 고쳐 쓰는 타입이래.",
      en: "My Stoic control pattern is trying to control the past.",
    },
  },
];

export const STOIC_QUESTIONS: StoicQuestion[] = [
  {
    "id": "sc_01",
    "targetDimension": "present-action/future/others-opinion/perfect-self",
    "rationale": "A disrupted plan reveals what the user tries to control first under pressure.",
    "prompt": {
      "ko": "계획했던 일이 갑자기 틀어졌습니다. 사람들이 이미 결과를 기다리고 있는 상황입니다.\n\n당신에게 가장 가까운 반응은?",
      "en": "Something you planned suddenly goes off track. People are already waiting for the result.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "지금 내가 다시 정할 수 있는 부분부터 본다.",
          "en": "I first look at what I can decide again right now."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "앞으로 일이 계속 꼬일까 봐 여러 경우를 돌려본다.",
          "en": "I run through scenarios in case things keep going wrong."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "사람들이 나를 어떻게 볼지 신경 쓰인다.",
          "en": "I worry about how people will see me."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "이런 일에 흔들리는 내가 답답해서 스스로를 다그친다.",
          "en": "I scold myself for being shaken by this."
        },
        "weights": {
          "emotions": 1,
          "perfect-self": 1
        }
      }
    ]
  },
  {
    "id": "sc_02",
    "targetDimension": "present-action/outcome/future/others-opinion",
    "rationale": "Waiting for feedback separates controllable next action from outcome control.",
    "prompt": {
      "ko": "중요한 피드백을 기다리는 중입니다. 아직 할 수 있는 답은 없고, 시간만 지나갑니다.\n\n가장 먼저 신경 쓰이는 것은?",
      "en": "You are waiting for important feedback. There is no answer yet, and time keeps passing.\n\nWhat bothers you first?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "기다리는 동안 할 수 있는 다음 작은 일을 정한다.",
          "en": "I choose one small next action I can do while waiting."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "결과가 기대와 다르면 어떻게 할지 머릿속이 바쁘다.",
          "en": "My mind gets busy with what I will do if the result disappoints me."
        },
        "weights": {
          "outcome": 2,
          "future": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "평가하는 사람이 나를 어떻게 판단할지가 걸린다.",
          "en": "I worry how the evaluator will judge me."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "앞으로의 흐름이 어디로 갈지 계속 계산한다.",
          "en": "I keep calculating where things may go from here."
        },
        "weights": {
          "future": 2
        }
      }
    ]
  },
  {
    "id": "sc_03",
    "targetDimension": "emotions/perfect-self/present-action/past",
    "rationale": "Emotional rise tests whether the target of control is feeling, image, action, or past wording.",
    "prompt": {
      "ko": "대화 중 감정이 예상보다 크게 올라왔습니다. 상대는 아직 차분하게 말하고 있습니다.\n\n가장 가까운 반응은?",
      "en": "During a conversation, your emotion rises more than expected. The other person is still speaking calmly.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "감정이 티 나지 않게 바로 눌러야 할 것 같다.",
          "en": "I feel I need to press the emotion down immediately."
        },
        "weights": {
          "emotions": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "이 정도로 흔들리면 안 된다고 나를 다그친다.",
          "en": "I scold myself that I should not be this shaken."
        },
        "weights": {
          "perfect-self": 2,
          "emotions": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "잠깐 멈추고 다음 말을 어떻게 할지 고른다.",
          "en": "I pause briefly and choose what to say next."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "조금 전 말을 다르게 했어야 했나 되감는다.",
          "en": "I rewind whether I should have said the earlier words differently."
        },
        "weights": {
          "past": 2
        }
      }
    ]
  },
  {
    "id": "sc_04",
    "targetDimension": "relationships/others-opinion/future/present-action",
    "rationale": "Late reply tests relationship flow control versus current action.",
    "prompt": {
      "ko": "가까운 사람이 평소보다 늦게 답합니다. 특별한 이유는 아직 모릅니다.\n\n무엇이 가장 불편한가요?",
      "en": "Someone close replies later than usual. You do not know the reason yet.\n\nWhat feels most uncomfortable?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "관계의 분위기가 달라졌을까 봐 신경 쓰인다.",
          "en": "I worry the relationship mood may have changed."
        },
        "weights": {
          "relationships": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "상대가 나를 어떻게 생각하는지 자꾸 궁금하다.",
          "en": "I keep wondering what they think of me."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "앞으로도 계속 이런 식이면 어쩌나 생각한다.",
          "en": "I think about what if it keeps being like this."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "오늘 내가 할 일을 먼저 해두고 나중에 확인한다.",
          "en": "I do what I need to do today and check later."
        },
        "weights": {
          "present-action": 2
        }
      }
    ]
  },
  {
    "id": "sc_05",
    "targetDimension": "past/perfect-self/others-opinion/present-action",
    "rationale": "Public mistake offers multiple control targets around image, past, and recovery.",
    "prompt": {
      "ko": "사람들 앞에서 작은 실수를 했습니다. 상황은 지나갔지만 장면이 반복해서 떠오릅니다.\n\n가장 먼저 붙잡게 되는 것은?",
      "en": "You make a small mistake in front of people. The moment has passed, but the scene keeps replaying.\n\nWhat do you hold onto first?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "그 순간으로 돌아가 고치고 싶어진다.",
          "en": "I want to go back and fix that moment."
        },
        "weights": {
          "past": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "실수 없는 사람처럼 보이고 싶었다는 생각이 든다.",
          "en": "I realize I wanted to look like someone who does not make mistakes."
        },
        "weights": {
          "perfect-self": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "사람들이 그 장면을 어떻게 기억할지 신경 쓰인다.",
          "en": "I worry how people will remember that moment."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "다음에 덜 흔들리도록 하나만 정리한다.",
          "en": "I note one thing that can help me be steadier next time."
        },
        "weights": {
          "present-action": 2
        }
      }
    ]
  },
  {
    "id": "sc_06",
    "targetDimension": "future/present-action/emotions/perfect-self",
    "rationale": "Unclear season tests future scenario control versus present practice.",
    "prompt": {
      "ko": "앞으로 몇 달이 어떻게 흘러갈지 잘 보이지 않습니다. 정해진 답이 없어서 불안하고 집중이 잘 안 됩니다.\n\n가장 가까운 모습은?",
      "en": "You cannot clearly see how the next few months will unfold. With no fixed answer, your mind feels scattered.\n\nWhat are you most likely to do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "가능한 경우의 수를 계속 머릿속에서 돌려본다.",
          "en": "I keep running possible scenarios in my head."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "오늘 확인할 수 있는 정보 하나부터 본다.",
          "en": "I start with one piece of information I can check today."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "불안하지 않아야 한다고 스스로를 조인다.",
          "en": "I tighten up, thinking I should not feel anxious."
        },
        "weights": {
          "emotions": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "완전히 준비되기 전에는 움직이면 안 될 것 같다.",
          "en": "It feels like I should not move until I am fully ready."
        },
        "weights": {
          "perfect-self": 2
        }
      }
    ]
  },
  {
    "id": "sc_07",
    "targetDimension": "relationships/past/present-action/emotions",
    "rationale": "Relationship distance tests desire to control relational flow and past causes.",
    "prompt": {
      "ko": "친한 사람과의 분위기가 전보다 조금 멀어진 것 같습니다. 정확한 사건은 떠오르지 않습니다.\n\n가장 가까운 반응은?",
      "en": "The mood with someone close feels a bit farther than before. No exact event comes to mind.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "관계가 다시 예전처럼 돌아와야 안심될 것 같다.",
          "en": "I feel I will relax only if the relationship returns to how it was."
        },
        "weights": {
          "relationships": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "지난 대화에서 뭘 잘못했는지 되짚는다.",
          "en": "I replay past conversations to find what I did wrong."
        },
        "weights": {
          "past": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "지금 확인할 수 있는 말 한마디를 조심스럽게 건넨다.",
          "en": "I carefully say one thing I can check right now."
        },
        "weights": {
          "present-action": 2,
          "relationships": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "신경 쓰이는 마음 자체를 빨리 없애고 싶다.",
          "en": "I want the feeling of caring about it to disappear quickly."
        },
        "weights": {
          "emotions": 2
        }
      }
    ]
  },
  {
    "id": "sc_08",
    "targetDimension": "outcome/present-action/others-opinion/future",
    "rationale": "Effort-result mismatch separates process orientation from outcome control.",
    "prompt": {
      "ko": "노력한 만큼 결과가 나오지 않았습니다. 과정은 분명 있었지만 숫자는 기대보다 낮습니다.\n\n무엇이 가장 붙잡히나요?",
      "en": "The result does not match your effort. The process was real, but the number is lower than expected.\n\nWhat holds your mind most?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "결과가 낮으면 과정도 의미가 줄어드는 것 같다.",
          "en": "If the result is low, the process feels less meaningful too."
        },
        "weights": {
          "outcome": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "과정에서 남은 것과 다음 행동을 분리해서 본다.",
          "en": "I separate what remains from the process and what action comes next."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "주변이 내 노력을 알아줄지 신경 쓰인다.",
          "en": "I care whether people will recognize my effort."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "다음 결과도 이렇게 나오면 어쩌나 걱정된다.",
          "en": "I worry the next result may come out like this too."
        },
        "weights": {
          "future": 2
        }
      }
    ]
  },
  {
    "id": "sc_09",
    "targetDimension": "present-action/outcome/perfect-self/emotions",
    "rationale": "Boundary message tests controllable wording versus perfect self and emotional control.",
    "prompt": {
      "ko": "누군가에게 가능한 범위를 말해야 합니다. 상대가 실망할 수도 있지만 계속 맞춰주긴 어렵습니다.\n\n가장 가까운 반응은?",
      "en": "You need to tell someone what you can realistically do. They may be disappointed, but you cannot keep adjusting to everything.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "내가 선택할 수 있는 범위를 차분히 말한다.",
          "en": "I calmly state the range I can choose."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "상대가 어떤 반응을 보일지 결과가 계속 걸린다.",
          "en": "I keep worrying about what reaction will result."
        },
        "weights": {
          "outcome": 2,
          "relationships": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "완벽한 문장을 찾느라 말을 미루게 된다.",
          "en": "I delay speaking while searching for the perfect wording."
        },
        "weights": {
          "perfect-self": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "불편한 감정을 티 내지 않으려고 먼저 눌러본다.",
          "en": "I first try to press down the uncomfortable emotion."
        },
        "weights": {
          "emotions": 2
        }
      }
    ]
  },
  {
    "id": "sc_10",
    "targetDimension": "past/future/present-action/perfect-self",
    "rationale": "Old choice scenario tests past rewriting and future spillover.",
    "prompt": {
      "ko": "예전 선택 하나가 문득 떠오릅니다. 지금 당장 바꿀 수는 없지만 후회와 걱정이 섞입니다.\n\n가장 가까운 생각은?",
      "en": "An old choice suddenly comes to mind. You cannot change it now, but your mind gets complicated.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "그때로 돌아가 다르게 고르고 싶어진다.",
          "en": "I want to go back and choose differently."
        },
        "weights": {
          "past": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "그 선택이 앞으로도 계속 영향을 줄까 봐 걱정된다.",
          "en": "I worry that choice may keep affecting the future."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "지금 배울 점과 오늘 할 일을 나눠본다.",
          "en": "I separate what I can learn from it and what I can do today."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "그때의 나도 더 완벽했어야 했다고 느낀다.",
          "en": "I feel my past self should have been more perfect."
        },
        "weights": {
          "perfect-self": 2
        }
      }
    ]
  },
  {
    "id": "sc_11",
    "targetDimension": "others-opinion/outcome/present-action/relationships",
    "rationale": "Visible work scenario captures social evaluation and final outcome control.",
    "prompt": {
      "ko": "당신의 작업물이 여러 사람에게 공개됩니다. 이미 제출해야 하는 시간은 정해져 있습니다.\n\n가장 신경 쓰이는 것은?",
      "en": "Your work will be shown to several people. The submission time is already set.\n\nWhat bothers you most?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "사람들이 나를 어떤 사람으로 볼지 신경 쓰인다.",
          "en": "I worry what kind of person people will think I am."
        },
        "weights": {
          "others-opinion": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "최종 결과가 기대에 못 미칠까 봐 붙잡힌다.",
          "en": "I get stuck on whether the final result will meet expectations."
        },
        "weights": {
          "outcome": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "부족하더라도 마감 안에서 할 수 있는 보완을 정한다.",
          "en": "Even if it is lacking, I choose what I can improve within the deadline."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "반응에 따라 관계나 이미지가 달라질까 봐 걱정된다.",
          "en": "I worry reactions may change my image or relationships."
        },
        "weights": {
          "relationships": 1,
          "others-opinion": 1
        }
      }
    ]
  },
  {
    "id": "sc_12",
    "targetDimension": "emotions/present-action/future/past",
    "rationale": "Quiet night scenario tests default mental control target when alone.",
    "prompt": {
      "ko": "밤에 혼자 있으니 생각이 길어집니다. 특별한 사건은 없는데 생각이 쉽게 멈추지 않습니다.\n\n가장 자주 돌아오는 쪽은?",
      "en": "At night alone, your thoughts get longer. Nothing specific happened, but your mind does not stop easily.\n\nWhat returns most often?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "이 감정을 빨리 정리하고 잠들고 싶다.",
          "en": "I want to organize this feeling quickly and sleep."
        },
        "weights": {
          "emotions": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "오늘은 여기까지라고 정하고 작은 루틴을 한다.",
          "en": "I decide today is enough and do a small routine."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내일 이후 벌어질 가능성을 계속 생각한다.",
          "en": "I keep thinking about what might happen tomorrow and after."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "이미 지나간 말이나 선택이 다시 떠오른다.",
          "en": "Words or choices that already passed return to mind."
        },
        "weights": {
          "past": 2
        }
      }
    ]
  },
  {
    "id": "sc_13",
    "targetDimension": "present-action/relationships/emotions/others-opinion",
    "rationale": "Cancelled plan tests response to disappointment and relational uncertainty.",
    "prompt": {
      "ko": "기대하던 약속이 취소되었습니다. 상대의 사정은 이해되지만 아쉬움은 남습니다.\n\n가장 가까운 반응은?",
      "en": "A plan you were looking forward to is cancelled. You understand their reason, but disappointment remains.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "아쉬움은 인정하고 오늘 시간을 어떻게 쓸지 정한다.",
          "en": "I admit the disappointment and decide how to use today’s time."
        },
        "weights": {
          "present-action": 2,
          "emotions": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "나를 덜 중요하게 생각하는 건 아닌지 신경 쓰인다.",
          "en": "I worry they may not see me as important."
        },
        "weights": {
          "relationships": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내가 아쉬워하는 모습 자체가 싫다.",
          "en": "I dislike seeing myself disappointed."
        },
        "weights": {
          "emotions": 2,
          "perfect-self": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "섭섭해하면 부담스러운 사람으로 보일까 걱정된다.",
          "en": "I worry I may look burdensome if I show disappointment."
        },
        "weights": {
          "others-opinion": 2
        }
      }
    ]
  },
  {
    "id": "sc_14",
    "targetDimension": "future/outcome/present-action/others-opinion",
    "rationale": "Uncertain offer scenario tests future and outcome control versus next action.",
    "prompt": {
      "ko": "새로운 제안이 왔지만 조건이 아직 불확실합니다. 마음은 끌리지만 확답하기 어렵습니다.\n\n가장 먼저 하는 쪽은?",
      "en": "A new offer comes in, but the conditions are still unclear. You are interested, but it is hard to answer firmly.\n\nWhat do you do first?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "조건이 어떻게 변할지 경우의 수를 계속 계산한다.",
          "en": "I keep calculating how the conditions might change."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "최종 선택이 틀릴까 봐 결과가 먼저 걱정된다.",
          "en": "I worry first that the final choice may be wrong."
        },
        "weights": {
          "outcome": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "지금 확인할 질문을 정리해서 물어본다.",
          "en": "I organize the questions I can ask now."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "다른 사람들이 이 선택을 어떻게 볼지 떠오른다.",
          "en": "I think about how others would see this choice."
        },
        "weights": {
          "others-opinion": 2
        }
      }
    ]
  },
  {
    "id": "sc_15",
    "targetDimension": "perfect-self/emotions/past/present-action",
    "rationale": "Self-disappointment tests perfect self, emotion control, past replay, and action.",
    "prompt": {
      "ko": "오늘의 내가 마음에 들지 않습니다. 특별히 큰 잘못은 없지만 기대한 모습과 다릅니다.\n\n가장 가까운 반응은?",
      "en": "You do not like yourself today. Nothing huge went wrong, but you are different from what you expected.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "더 괜찮은 모습이어야 했다고 스스로를 몰아붙인다.",
          "en": "I push myself that I should have been a better version."
        },
        "weights": {
          "perfect-self": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "이런 기분부터 빨리 없애야 할 것 같다.",
          "en": "I feel I need to get rid of this mood quickly."
        },
        "weights": {
          "emotions": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "오늘 어디서부터 어긋났는지 되감는다.",
          "en": "I rewind where the day started going off."
        },
        "weights": {
          "past": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내일 나아질 수 있는 작은 행동 하나를 정한다.",
          "en": "I choose one small action that can make tomorrow better."
        },
        "weights": {
          "present-action": 2
        }
      }
    ]
  },
  {
    "id": "sc_16",
    "targetDimension": "present-action/future/relationships/outcome",
    "rationale": "Team uncertainty closes with practical present action versus external flow control.",
    "prompt": {
      "ko": "팀 일정이 흔들리고 각자 말이 조금씩 다릅니다. 당장 모든 것을 정리하기는 어렵습니다.\n\n당신에게 가장 가까운 모습은?",
      "en": "A team schedule is unstable, and everyone is saying slightly different things. It is hard to organize everything immediately.\n\nWhat are you most likely to do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "지금 확인 가능한 담당, 시간, 다음 단계만 먼저 정리한다.",
          "en": "I first clarify only the owner, time, and next step that can be checked now."
        },
        "weights": {
          "present-action": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "앞으로 더 꼬일 가능성이 계속 떠오른다.",
          "en": "I keep seeing ways this could get more tangled later."
        },
        "weights": {
          "future": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "사람들 사이 흐름이 틀어질까 봐 신경 쓰인다.",
          "en": "I worry the flow between people may become strained."
        },
        "weights": {
          "relationships": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "최종 결과가 엉망이 될까 봐 계속 신경 쓰인다.",
          "en": "My mind gets stuck on whether the final result will be messy."
        },
        "weights": {
          "outcome": 2
        }
      }
    ]
  }
];

export function calculateStoicResult(answers: StoicAnswer[]): StoicResult {
  const scores = STOIC_RESULTS.reduce<Record<StoicControlId, number>>(
    (acc, result) => {
      acc[result.id] = 0;
      return acc;
    },
    {} as Record<StoicControlId, number>,
  );
  const lastWeightedHit = STOIC_RESULTS.reduce<Record<StoicControlId, number>>(
    (acc, result) => {
      acc[result.id] = -1;
      return acc;
    },
    {} as Record<StoicControlId, number>,
  );

  answers.forEach((answer, index) => {
    let highestWeight = 0;
    Object.values(answer.weights).forEach((value) => {
      highestWeight = Math.max(highestWeight, value ?? 0);
    });

    Object.entries(answer.weights).forEach(([key, value]) => {
      const id = key as StoicControlId;
      scores[id] += value ?? 0;
      if ((value ?? 0) === highestWeight) lastWeightedHit[id] = index;
    });
  });

  const winner = STOIC_RESULTS.reduce<StoicControlId>((best, result) => {
    const id = result.id;
    if (scores[id] > scores[best]) return id;
    if (scores[id] < scores[best]) return best;
    if (lastWeightedHit[id] > lastWeightedHit[best]) return id;
    return best;
  }, STOIC_RESULTS[0].id);

  return STOIC_RESULTS.find((result) => result.id === winner) ?? STOIC_RESULTS[0];
}

export function getStoicResultById(id: string | null | undefined): StoicResult | null {
  return STOIC_RESULTS.find((result) => result.id === id) ?? null;
}
