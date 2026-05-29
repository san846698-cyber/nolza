export type ThinkingPatternId =
  | "catastrophizing"
  | "all-or-nothing"
  | "mind-reading"
  | "overgeneralization"
  | "emotional-reasoning"
  | "should-statements"
  | "discounting-positive"
  | "personalization"
  | "balanced-perspective";

export type LocalText = {
  ko: string;
  en: string;
};

export type ThinkingChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<ThinkingPatternId, number>>;
};

export type ThinkingQuestion = {
  id: string;
  targetDimension: string;
  rationale: string;
  prompt: LocalText;
  choices: ThinkingChoice[];
};

export type ThinkingResult = {
  id: ThinkingPatternId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  flow: LocalText;
  reframe: LocalText;
  strength: LocalText;
  caution: LocalText;
  shareLine: LocalText;
};

export type ThinkingAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<ThinkingPatternId, number>>;
};

export const THINKING_RESULTS: ThinkingResult[] = [
  {
    id: "catastrophizing",
    title: { ko: "걱정이 먼저 달려가는 예보관", en: "Catastrophizing" },
    oneLiner: {
      ko: "작은 신호 하나에도 마음속 경보가 빠르게 켜지는 타입입니다.",
      en: "Small uncertainty can quickly become the worst-case scenario.",
    },
    description: {
      ko: "당신은 문제가 생기면 가장 나쁜 경우부터 떠올리며 마음의 안전거리를 확보하려는 편입니다. 덕분에 위험을 빨리 감지하지만, 아직 일어나지 않은 일까지 오늘의 부담으로 끌고 올 때가 있어요. 불안이 올라올수록 '확정된 사실'과 '가능한 시나리오'를 나눠보는 것이 도움이 됩니다.",
      en: "When something feels uncertain, your mind may jump to what could go wrong. It is less about being weak and more about trying to prepare before getting hurt.",
    },
    flow: {
      ko: "작은 신호를 보면 마음이 빠르게 다음 위험을 계산하고, 아직 일어나지 않은 장면까지 먼저 그려볼 수 있어요.",
      en: "A small signal can make your mind map the next risk and picture scenes that have not happened yet.",
    },
    reframe: {
      ko: "지금 불안하다는 사실이, 반드시 나쁜 일이 일어난다는 증거는 아닐 수 있어요.",
      en: "Feeling anxious right now is not proof that something bad is definitely happening.",
    },
    strength: {
      ko: "위험을 빨리 감지하고 준비하려는 힘이 있습니다.",
      en: "You notice risk early and prepare quickly.",
    },
    caution: {
      ko: "가능성 하나를 확정된 결말처럼 느끼면 마음이 너무 빨리 지칠 수 있습니다.",
      en: "One possibility can start feeling like a fixed ending, which can exhaust you.",
    },
    shareLine: {
      ko: "나는 생각이 꼬이면 최악의 경우부터 예보하는 타입이래.",
      en: "My thinking tends to turn on catastrophizing first.",
    },
  },
  {
    id: "all-or-nothing",
    title: { ko: "완벽과 실패 사이가 좁은 사람", en: "All-or-Nothing Thinking" },
    oneLiner: {
      ko: "중간 점수보다 선명한 결론이 먼저 보이는 타입입니다.",
      en: "Things can feel like either success or failure, with little middle ground.",
    },
    description: {
      ko: "당신은 잘하고 싶은 기준이 분명해서, 작은 실수도 전체 결과를 흔드는 것처럼 느낄 수 있습니다. 이 기준은 완성도를 높이는 힘이지만, 70점짜리 시작까지 실패로 보이게 만들 수 있어요. 완벽하지 않아도 고쳐갈 수 있는 결과라면 이미 앞으로 가고 있는 중입니다.",
      en: "You may see clear outcomes before nuance. Because your standards matter, a partial success or small mistake can feel much bigger than it is.",
    },
    flow: {
      ko: "한 부분이 마음에 들지 않으면 전체가 흔들린 것처럼 느껴지고, '괜찮은 편'이라는 평가가 잘 들어오지 않을 수 있어요.",
      en: "When one part feels off, the whole thing can seem ruined, and 'good enough' may not register easily.",
    },
    reframe: {
      ko: "완벽하지 않은 결과도 실패가 아니라, 조정 가능한 중간 단계일 수 있어요.",
      en: "An imperfect result may be an adjustable middle step, not a failure.",
    },
    strength: {
      ko: "기준이 분명하고 대충 넘기지 않는 힘이 있습니다.",
      en: "You have clear standards and do not settle carelessly.",
    },
    caution: {
      ko: "중간 성과를 인정하지 못하면 시작과 지속이 모두 어려워질 수 있습니다.",
      en: "If you cannot accept middle progress, both starting and continuing become harder.",
    },
    shareLine: {
      ko: "나는 완벽 아니면 실패처럼 느껴질 때가 있는 타입이래.",
      en: "My thinking sometimes gets caught in all-or-nothing mode.",
    },
  },
  {
    id: "mind-reading",
    title: { ko: "표정 사이를 읽는 레이더", en: "Mind Reading" },
    oneLiner: {
      ko: "말보다 말투와 답장 텀에서 먼저 의미를 찾는 타입입니다.",
      en: "You quickly guess what others might be thinking about you.",
    },
    description: {
      ko: "당신은 상대의 표정, 말투, 답장 속도에서 미묘한 변화를 빠르게 잡아냅니다. 그 섬세함은 관계를 살피는 장점이지만, 확인하지 않은 추측이 사실처럼 굳어지면 마음이 먼저 지칩니다. 강한 느낌이 들수록 한 문장으로 확인할 여지를 남겨두세요.",
      en: "You read meaning quickly from expressions, tone, and response time. That sensitivity can be useful, but unconfirmed guesses may become heavy.",
    },
    flow: {
      ko: "상대가 별말을 하지 않아도 '혹시 나를 이상하게 봤나?' 같은 생각이 먼저 지나갈 수 있습니다.",
      en: "Even without clear evidence, thoughts like 'Did they judge me?' may appear first.",
    },
    reframe: {
      ko: "내가 읽은 분위기는 단서일 수 있지만, 아직 확인된 사실은 아닐 수 있어요.",
      en: "The mood you sensed may be a clue, but it may not be confirmed fact yet.",
    },
    strength: {
      ko: "분위기와 사람의 미묘한 변화를 잘 알아차립니다.",
      en: "You notice subtle changes in people and atmosphere.",
    },
    caution: {
      ko: "추측이 쌓이면 실제 대화보다 머릿속 대화가 더 커질 수 있습니다.",
      en: "Too many guesses can make the conversation in your head louder than the real one.",
    },
    shareLine: {
      ko: "나는 표정과 말투 사이를 너무 잘 읽는 타입이래.",
      en: "I have a strong mind-reading thinking habit.",
    },
  },
  {
    id: "overgeneralization",
    title: { ko: "한 장면을 전체로 번역하는 사람", en: "Overgeneralization" },
    oneLiner: {
      ko: "한 번의 일이 오래된 패턴처럼 크게 번지는 타입입니다.",
      en: "One event can start feeling like the whole pattern.",
    },
    description: {
      ko: "당신은 한 번의 실패나 실망을 과거의 비슷한 장면들과 빠르게 연결하는 편입니다. 그래서 패턴을 빨리 알아차리는 힘이 있지만, 아직 다른 가능성이 남아 있을 때도 결론이 커질 수 있어요. '늘'이나 '항상'이 떠오를 때는 예외 한 가지를 일부러 찾아보세요.",
      en: "One failure or disappointment may feel like it will keep repeating. Your mind quickly connects similar hurts into a larger pattern.",
    },
    flow: {
      ko: "한 번 어긋난 일이 생기면 '역시 나는 늘 이래'처럼 과거와 미래가 한꺼번에 붙을 수 있습니다.",
      en: "When one thing goes wrong, the past and future may attach to it: 'This always happens to me.'",
    },
    reframe: {
      ko: "이번 일이 반복처럼 느껴져도, 아직 모든 경우를 증명한 것은 아닐 수 있어요.",
      en: "Even if this feels like a pattern, it may not prove every future case.",
    },
    strength: {
      ko: "비슷한 흐름을 빨리 감지하고 패턴을 찾는 힘이 있습니다.",
      en: "You detect patterns and repeated signals quickly.",
    },
    caution: {
      ko: "한 장면이 너무 커지면 새로운 가능성을 보기 어려워질 수 있습니다.",
      en: "If one scene grows too large, it becomes harder to see new possibilities.",
    },
    shareLine: {
      ko: "나는 한 장면이 전체 패턴처럼 커질 때가 있는 타입이래.",
      en: "I tend to expand one event into a bigger pattern.",
    },
  },
  {
    id: "emotional-reasoning",
    title: { ko: "감정의 온도를 사실로 믿는 사람", en: "Emotional Reasoning" },
    oneLiner: {
      ko: "마음이 뜨거워지면 상황도 그만큼 심각하게 보이는 타입입니다.",
      en: "When you feel anxious, the danger can feel real.",
    },
    description: {
      ko: "당신은 감정 신호가 선명해서, 불안하거나 서운한 순간에는 그 느낌이 곧 현실의 증거처럼 다가올 수 있습니다. 덕분에 마음의 변화를 빨리 알아차리지만, 감정이 강한 날에는 확인보다 결론이 먼저 나기도 해요. 감정을 무시하기보다 '이 느낌이 알려주는 것'과 '아직 확인할 것'을 나눠보세요.",
      en: "When a feeling becomes strong, it may start to feel like evidence. Your emotional signals are vivid, so facts and feelings can move close together.",
    },
    flow: {
      ko: "불편함이 올라오면 '내가 이렇게 느끼는 데는 이유가 있을 거야'라는 생각이 먼저 힘을 얻을 수 있습니다.",
      en: "When discomfort rises, the thought 'If I feel this way, there must be a reason' can become convincing.",
    },
    reframe: {
      ko: "감정은 중요한 신호지만, 모든 신호가 그대로 결론이 되지는 않을 수 있어요.",
      en: "A feeling is an important signal, but not every signal needs to become a conclusion.",
    },
    strength: {
      ko: "자신의 감정 변화를 빠르게 알아차립니다.",
      en: "You notice emotional changes quickly.",
    },
    caution: {
      ko: "감정이 강한 날에는 사실 확인보다 결론이 먼저 날 수 있습니다.",
      en: "On emotionally intense days, conclusions may arrive before fact-checking.",
    },
    shareLine: {
      ko: "나는 감정의 온도가 올라가면 상황도 크게 보이는 타입이래.",
      en: "When my emotions get strong, they can feel like facts.",
    },
  },
  {
    id: "should-statements",
    title: { ko: "해야 한다에 묶이는 기준 관리자", en: "Should Statements" },
    oneLiner: {
      ko: "스스로에게 적용하는 기준선이 누구보다 선명한 타입입니다.",
      en: "You can get tied to 'I should' and 'I must.'",
    },
    description: {
      ko: "당신은 스스로에게 높은 기준을 두고, 그 기준을 지키려는 책임감이 강합니다. 그래서 믿고 맡길 수 있는 사람이지만, 쉬어야 하는 순간에도 '이러면 안 된다'는 문장이 먼저 올라올 수 있어요. 기준을 낮추는 것이 아니라, 지금 가능한 기준으로 다시 조정하는 연습이 필요합니다.",
      en: "You hold yourself to high standards, and stepping away from them can feel pressuring. Your responsibility is real, but 'should' can become tight.",
    },
    flow: {
      ko: "쉬고 싶거나 실수했을 때도 '이러면 안 되는데'라는 문장이 먼저 떠오를 수 있습니다.",
      en: "Even when you need rest or make a mistake, 'I should not be like this' may appear first.",
    },
    reframe: {
      ko: "해야 한다는 말 뒤에, 정말 원하는 것과 지금 가능한 것을 따로 물어봐도 괜찮아요.",
      en: "Behind 'I should,' it is okay to ask what you truly want and what is possible right now.",
    },
    strength: {
      ko: "책임감이 있고 기준을 지키려는 힘이 있습니다.",
      en: "You are responsible and try to honor your standards.",
    },
    caution: {
      ko: "기준이 너무 단단하면 나를 돌보는 선택까지 잘못처럼 느껴질 수 있습니다.",
      en: "If standards become too rigid, even caring for yourself can feel wrong.",
    },
    shareLine: {
      ko: "나는 해야 한다는 기준선에 자주 묶이는 타입이래.",
      en: "I often get tied to 'I should.'",
    },
  },
  {
    id: "discounting-positive",
    title: { ko: "잘한 일에 형광펜을 못 긋는 사람", en: "Discounting the Positive" },
    oneLiner: {
      ko: "칭찬은 빨리 넘기고 아쉬운 부분은 오래 붙잡는 타입입니다.",
      en: "Good things feel expected, while flaws look bigger.",
    },
    description: {
      ko: "당신은 좋은 결과를 얻어도 '이 정도는 당연하지' 하고 넘긴 뒤, 부족했던 부분을 더 오래 들여다보는 편입니다. 이 눈은 성장에 도움이 되지만, 잘한 사실까지 지워버리면 자신감이 쌓일 자리가 줄어듭니다. 다음 개선점을 적기 전에 오늘 실제로 해낸 것 하나를 먼저 표시해보세요.",
      en: "You may struggle to receive good results or praise, while flaws stand out more. Wanting to do better can make achievements pass by too quickly.",
    },
    flow: {
      ko: "칭찬을 들어도 '운이 좋았어' 혹은 '그 정도는 당연해'라고 넘기고, 부족했던 장면을 더 오래 붙잡을 수 있습니다.",
      en: "Even after praise, you may think 'I was lucky' or 'That was expected,' while holding onto what was lacking.",
    },
    reframe: {
      ko: "부족한 점을 보는 눈과 별개로, 잘한 부분도 실제로 존재한 결과일 수 있어요.",
      en: "Seeing what was lacking does not erase the real parts you did well.",
    },
    strength: {
      ko: "더 나아질 지점을 세밀하게 찾는 힘이 있습니다.",
      en: "You can spot precise areas for improvement.",
    },
    caution: {
      ko: "좋은 결과를 계속 지우면 자신감이 쌓일 자리가 줄어들 수 있습니다.",
      en: "If you keep erasing good results, confidence has less room to build.",
    },
    shareLine: {
      ko: "나는 잘한 일보다 부족한 점에 먼저 형광펜 치는 타입이래.",
      en: "I tend to skip what I did well and focus on what was missing.",
    },
  },
  {
    id: "personalization",
    title: { ko: "분위기의 책임을 먼저 떠안는 사람", en: "Personalization" },
    oneLiner: {
      ko: "상황이 어긋나면 내 몫부터 찾는 책임감 강한 타입입니다.",
      en: "When something goes wrong, you first look for your own responsibility.",
    },
    description: {
      ko: "당신은 일이 꼬이거나 분위기가 식으면 내가 놓친 부분부터 떠올리는 편입니다. 관계를 책임 있게 다루려는 태도는 장점이지만, 모두의 감정과 변수까지 혼자 들고 있으면 쉽게 무거워질 수 있어요. 내 영향이 있는 부분과 내 몫이 아닌 부분을 분리해도 관계를 덜 소중히 여기는 것은 아닙니다.",
      en: "Among many possible causes, you may look for your own fault first. It can come from responsibility, but it may also make you carry too much alone.",
    },
    flow: {
      ko: "분위기가 어색해지거나 일이 틀어지면 '내가 뭘 잘못했나?'라는 질문이 빠르게 올라올 수 있습니다.",
      en: "When the mood shifts or something goes wrong, 'What did I do wrong?' can rise quickly.",
    },
    reframe: {
      ko: "내가 영향을 준 부분이 있을 수는 있지만, 모든 원인이 나 하나로 모이진 않을 수 있어요.",
      en: "You may have influenced part of it, but not every cause has to point only to you.",
    },
    strength: {
      ko: "자신의 역할을 돌아보고 관계를 책임 있게 다루려는 힘이 있습니다.",
      en: "You reflect on your role and try to handle relationships responsibly.",
    },
    caution: {
      ko: "내 몫이 아닌 일까지 떠안으면 마음이 쉽게 무거워질 수 있습니다.",
      en: "Taking on what is not yours can make your mind heavy.",
    },
    shareLine: {
      ko: "나는 분위기가 어긋나면 내 책임부터 찾는 타입이래.",
      en: "When things go wrong, I tend to blame myself first.",
    },
  },
  {
    id: "balanced-perspective",
    title: { ko: "결론을 잠깐 보류할 줄 아는 사람", en: "Balanced Perspective" },
    oneLiner: {
      ko: "마음이 흔들려도 한 번 더 정보를 기다릴 줄 아는 타입입니다.",
      en: "You can feel unsettled without rushing to a conclusion.",
    },
    description: {
      ko: "당신은 불편한 상황에서도 한 번의 신호만으로 전체를 판단하지 않으려는 편입니다. 감정이 올라와도 잠시 멈추고, 아직 모르는 정보가 있다는 것을 인정할 수 있어요. 다만 차분함이 감정 무시로 바뀌지 않도록, 같은 불편함이 반복될 때는 이유를 구체적으로 살피는 것이 좋습니다.",
      en: "Even when a situation feels uncomfortable, you tend not to judge the whole picture from one signal. You can pause, notice your feelings, and leave room for missing context.",
    },
    flow: {
      ko: "마음이 흔들릴 때도 '아직은 모른다'는 문장을 중간에 둘 수 있습니다. 그래서 생각이 너무 빨리 한쪽으로 치우치는 것을 줄이는 편입니다.",
      en: "When your mind starts moving, you can place 'I do not know yet' in the middle. That helps your thoughts avoid swinging too far too fast.",
    },
    reframe: {
      ko: "지금 판단할 정보가 부족할 수도 있습니다. 조금 더 보고, 필요한 만큼만 확인해도 괜찮습니다.",
      en: "There may not be enough information to judge yet. It is okay to wait, observe, and check only what is needed.",
    },
    strength: {
      ko: "상황을 크게 키우기 전에 한 번 멈추는 힘이 있습니다.",
      en: "You can pause before making a situation larger than it is.",
    },
    caution: {
      ko: "차분함이 감정 무시로 바뀌지 않도록, 불편함이 반복될 때는 이유를 살펴보는 것이 좋습니다.",
      en: "Just make sure calmness does not become ignoring your feelings when the same discomfort keeps repeating.",
    },
    shareLine: {
      ko: "나는 생각이 흔들려도 결론을 잠깐 보류할 줄 아는 타입이래.",
      en: "My thinking pattern is Balanced Perspective. I tend to pause before jumping to conclusions.",
    },
  },
];

export const THINKING_QUESTIONS: ThinkingQuestion[] = [
  {
    "id": "tp_01",
    "targetDimension": "balanced-perspective/personalization/catastrophizing/emotional-reasoning",
    "rationale": "Delayed reply with mixed evidence measures automatic interpretation without direct trait wording.",
    "prompt": {
      "ko": "오랜만에 친구에게 진지한 고민을 보냈습니다. 반나절이 지났고, 친구는 다른 단체방에는 짧게 반응한 것 같습니다.\n\n당신에게 가장 가까운 반응은?",
      "en": "You send a serious concern to a friend after a long time. Half a day passes, and they seem to have reacted briefly in another group chat.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "바쁠 수도 있다고 보고 오늘은 추가 메시지를 참는다.",
          "en": "I assume they may be busy and hold back from sending more today."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "내 문장이 부담스러웠는지 다시 읽고 표현을 탓한다.",
          "en": "I reread my wording and blame the way I phrased it."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "이제 중요한 얘기는 누구에게도 못 꺼낼 것 같아진다.",
          "en": "I start feeling like I will not be able to bring up important things with anyone."
        },
        "weights": {
          "catastrophizing": 2,
          "overgeneralization": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "속상한 감정이 강해서 실제로 피하는 것처럼 믿어진다.",
          "en": "Because the hurt feels strong, it seems like they really are avoiding me."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      }
    ]
  },
  {
    "id": "tp_02",
    "targetDimension": "balanced-perspective/all-or-nothing/mind-reading/discounting-positive",
    "rationale": "Mixed feedback reveals whether nuance, social guessing, or perfection filters dominate.",
    "prompt": {
      "ko": "열심히 한 작업에 “좋은데 조금만 더 정리되면 좋겠다”는 말을 들었습니다.\n\n가장 먼저 남는 생각은?",
      "en": "You hear, “This is good, but it could be organized a bit more,” about work you tried hard on.\n\nWhat thought stays first?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "좋았던 부분은 표시하고 고칠 부분은 따로 체크한다.",
          "en": "I mark what worked and check what needs revision separately."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "정리가 부족했다는 말 하나로 전체가 실패처럼 보인다.",
          "en": "One comment about organization makes the whole thing look like failure."
        },
        "weights": {
          "all-or-nothing": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "겉으로는 좋다 했지만 속으로는 별로라 했을 것 같다.",
          "en": "They said it was good, but I feel they secretly thought it was poor."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "칭찬은 넘기고 수정할 부분만 메모장에 남긴다.",
          "en": "I pass over the praise and leave only the revision point in my notes."
        },
        "weights": {
          "discounting-positive": 2
        }
      }
    ]
  },
  {
    "id": "tp_03",
    "targetDimension": "balanced-perspective/mind-reading/personalization/overgeneralization",
    "rationale": "Group silence is ambiguous and reduces obvious ideal-self responding.",
    "prompt": {
      "ko": "단체방에 보낸 말에 잠깐 반응이 없습니다. 곧 다른 얘기로 넘어가긴 했지만, 조금 민망했습니다.\n\n가장 가까운 생각은?",
      "en": "Your message in a group chat gets no reaction for a moment. The chat soon moves on, but that moment stays.\n\nWhat thought comes closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "타이밍이 안 맞았을 수도 있어 대화 흐름을 더 본다.",
          "en": "I watch the chat longer because the timing may simply have been off."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "사람들이 내 말을 어색하다고 여겼을 것 같다.",
          "en": "It feels like people thought my message was awkward."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내 말 때문에 흐름이 끊겼다고 책임을 느낀다.",
          "en": "I feel responsible, as if my message broke the flow."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "또 이런 반응일 것 같아 다음엔 말을 줄이게 된다.",
          "en": "I expect the same reaction next time, so I speak less."
        },
        "weights": {
          "overgeneralization": 2
        }
      }
    ]
  },
  {
    "id": "tp_04",
    "targetDimension": "balanced-perspective/should-statements/emotional-reasoning/catastrophizing",
    "rationale": "A changed plan tests uncertainty tolerance and rules about how one should react.",
    "prompt": {
      "ko": "기대했던 일정이 갑자기 바뀌었습니다. 큰 손해는 없지만 조금 실망스럽고 어수선합니다.\n\n가장 가까운 반응은?",
      "en": "A schedule you were looking forward to suddenly changes. Nothing major is lost, but your mind feels unsettled.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "아쉽지만 바뀐 조건에서 가능한 선택지를 다시 고른다.",
          "en": "I feel disappointed, then choose again from the new options."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "이 정도 변경에 흔들리면 안 된다고 나를 몰아붙인다.",
          "en": "I push myself that I should not be shaken by this small change."
        },
        "weights": {
          "should-statements": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "불편함이 큰 걸 보면 실제로 문제가 생긴 것 같다.",
          "en": "Because the discomfort is strong, it seems like a real problem happened."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "이후 일정도 줄줄이 꼬일 장면을 미리 떠올린다.",
          "en": "I picture later plans getting tangled one after another."
        },
        "weights": {
          "catastrophizing": 2
        }
      }
    ]
  },
  {
    "id": "tp_05",
    "targetDimension": "balanced-perspective/personalization/mind-reading/emotional-reasoning",
    "rationale": "A quiet friend gives ambiguous social data that supports multiple plausible readings.",
    "prompt": {
      "ko": "친구가 오늘따라 조용합니다. 나에게만 그런 건지, 그냥 피곤한 건지 애매합니다.\n\n당신에게 가까운 생각은?",
      "en": "A friend is quieter than usual today. It is unclear whether it is about you or they are just tired.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "컨디션 문제일 수 있어 먼저 물어볼 타이밍을 본다.",
          "en": "It may be their condition, so I wait for a moment to ask."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "내가 한 말 중 거슬렸을 부분을 먼저 찾는다.",
          "en": "I first look for what I may have said wrong."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "조용한 태도가 나를 불편해한다는 신호처럼 보인다.",
          "en": "Their quietness looks like a signal that they are uncomfortable with me."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내 마음이 불편하니 관계가 실제로 틀어진 것 같다.",
          "en": "Because I feel uneasy, it seems the relationship is actually off."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      }
    ]
  },
  {
    "id": "tp_06",
    "targetDimension": "balanced-perspective/discounting-positive/all-or-nothing/should-statements",
    "rationale": "Receiving praise tests whether positive information can be integrated.",
    "prompt": {
      "ko": "누군가 당신이 한 일을 칭찬했습니다. 그런데 당신 눈에는 부족한 부분도 보입니다.\n\n가장 가까운 반응은?",
      "en": "Someone praises something you did. But you can still see the weak parts.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "어색해도 고맙다고 말하고 부족한 점은 따로 본다.",
          "en": "Even if it feels awkward, I say thanks and look at improvements separately."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "그 정도는 운이 좋았거나 누구나 할 수 있었다고 넘긴다.",
          "en": "I brush it off as luck or something anyone could have done."
        },
        "weights": {
          "discounting-positive": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "완벽하지 않은 부분이 보여 잘했다고 말하기 어렵다.",
          "en": "Because I see the imperfect part, it is hard to call it good."
        },
        "weights": {
          "all-or-nothing": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "칭찬받기 전에 더 완성도 있게 했어야 한다고 다그친다.",
          "en": "I push myself that it should have been more complete before being praised."
        },
        "weights": {
          "should-statements": 2
        }
      }
    ]
  },
  {
    "id": "tp_07",
    "targetDimension": "balanced-perspective/catastrophizing/overgeneralization/personalization",
    "rationale": "A single failed attempt tests expansion from event to global meaning.",
    "prompt": {
      "ko": "며칠 준비한 일이 예상보다 잘 풀리지 않았습니다. 완전히 망한 건 아니지만 기대와 다릅니다.\n\n밤에 가장 가까운 생각은?",
      "en": "Something you prepared for days does not go as expected. It is not a total disaster, but it differs from your hopes.\n\nWhat thought comes closest at night?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "어긋난 부분을 표시하고 다음 조정 하나를 정한다.",
          "en": "I mark what went off and choose one next adjustment."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "다음 일도 같은 흐름으로 망가질 장면을 떠올린다.",
          "en": "I picture the next thing going badly in the same way."
        },
        "weights": {
          "catastrophizing": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "역시 나는 이런 종류의 일을 늘 못한다고 결론낸다.",
          "en": "I conclude that I am always bad at this kind of thing."
        },
        "weights": {
          "overgeneralization": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내가 더 꼼꼼했으면 막았을 거라고 내 몫부터 찾는다.",
          "en": "I look for my part first, thinking I could have prevented it by being more careful."
        },
        "weights": {
          "personalization": 2
        }
      }
    ]
  },
  {
    "id": "tp_08",
    "targetDimension": "balanced-perspective/mind-reading/emotional-reasoning/should-statements",
    "rationale": "Public mistake can trigger inferred judgment, emotional proof, or self-rules.",
    "prompt": {
      "ko": "사람들 앞에서 작은 실수를 했습니다. 누군가는 거의 신경 쓰지 않는 것 같지만, 장면이 떠오릅니다.\n\n가장 가까운 생각은?",
      "en": "You make a small mistake in front of people. Some seem barely aware of it, but the scene returns to mind.\n\nWhat thought comes closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "민망하지만 작은 실수로 적고 다음 일로 넘어간다.",
          "en": "It is embarrassing, but I label it a small mistake and move on."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "사람들이 그 장면을 계속 떠올릴 거라고 예상한다.",
          "en": "I assume people will keep remembering that scene."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "부끄러움이 커서 실제 실수도 크게 느껴진다.",
          "en": "Because the embarrassment is strong, the mistake feels large too."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "그 정도 실수도 하지 말았어야 한다고 되뇐다.",
          "en": "I repeat that I should not have made even that small mistake."
        },
        "weights": {
          "should-statements": 2
        }
      }
    ]
  },
  {
    "id": "tp_09",
    "targetDimension": "balanced-perspective/personalization/mind-reading/catastrophizing",
    "rationale": "Unclear invitation exclusion captures common automatic social interpretations.",
    "prompt": {
      "ko": "친구들이 당신 없이 만난 걸 나중에 알았습니다. 특별히 숨긴 것 같지는 않지만 조금 서운했습니다.\n\n가장 가까운 생각은?",
      "en": "You later learn friends met without you. It does not seem intentionally hidden, but it bothers you.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "전체 상황을 모르니 바로 의미를 정하지 않는다.",
          "en": "I do not know the full situation, so I do not decide what it means yet."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "내가 불편한 사람이라 초대에서 빠졌다고 느낀다.",
          "en": "It feels like I was left out because I am uncomfortable to be around."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "그들이 일부러 나를 빼고 만났을 거라고 추측한다.",
          "en": "I guess they intentionally met without me."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "이 일이 관계가 멀어지는 시작일까 봐 걱정된다.",
          "en": "I worry this may be the start of the relationship drifting."
        },
        "weights": {
          "catastrophizing": 2
        }
      }
    ]
  },
  {
    "id": "tp_10",
    "targetDimension": "balanced-perspective/all-or-nothing/discounting-positive/overgeneralization",
    "rationale": "Mixed outcome tests rigid evaluation and positive discounting.",
    "prompt": {
      "ko": "결과가 나쁘진 않은데 기대만큼 좋지도 않습니다. 주변은 괜찮다고 하지만 당신은 애매합니다.\n\n가장 가까운 반응은?",
      "en": "The result is not bad, but not as good as you hoped. Others say it is fine, but you feel unsure.\n\nWhat reaction feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "괜찮은 부분과 아쉬운 부분을 표로 나눠 본다.",
          "en": "I split the okay parts and disappointing parts into a table."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "기대에 못 미친 순간 성공 목록에서 빼버린다.",
          "en": "Once it misses expectations, I remove it from the success list."
        },
        "weights": {
          "all-or-nothing": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "괜찮았다는 말은 흘리고 부족한 점만 다시 본다.",
          "en": "I let the 'it was fine' part pass and review only the flaws."
        },
        "weights": {
          "discounting-positive": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "늘 마지막에는 이렇게 애매하게 끝난다고 묶어버린다.",
          "en": "I bundle it into a pattern that things always end lukewarm for me."
        },
        "weights": {
          "overgeneralization": 2
        }
      }
    ]
  },
  {
    "id": "tp_11",
    "targetDimension": "balanced-perspective/emotional-reasoning/catastrophizing/personalization",
    "rationale": "Tired-day interpretation tests thought habit under low resources.",
    "prompt": {
      "ko": "오늘은 유난히 예민하고 지친 날입니다. 평소라면 넘겼을 말도 크게 느껴집니다.\n\n어떤 해석이 가장 가깝나요?",
      "en": "Today you feel unusually sensitive and tired. Words you would usually pass over feel bigger.\n\nWhich interpretation feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "오늘 컨디션 영향도 있다고 보고 답을 늦춘다.",
          "en": "I see my condition may be affecting it and delay my response."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "이렇게 힘든 걸 보면 실제 문제가 큰 것 같다.",
          "en": "Because I feel this bad, the real problem must be serious."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "앞으로도 계속 이런 상태일 장면을 미리 걱정한다.",
          "en": "I worry in advance that I will keep feeling this way."
        },
        "weights": {
          "catastrophizing": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내 예민함 때문에 상황이 커졌다고 내 탓부터 한다.",
          "en": "I blame myself first, thinking my sensitivity made the situation bigger."
        },
        "weights": {
          "personalization": 2
        }
      }
    ]
  },
  {
    "id": "tp_12",
    "targetDimension": "balanced-perspective/should-statements/all-or-nothing/discounting-positive",
    "rationale": "Starting something new tests rigid standards before action.",
    "prompt": {
      "ko": "새로운 일을 시작하려는데 아직 서툴 게 뻔합니다. 그래도 해보고 싶은 마음은 있습니다.\n\n가장 가까운 생각은?",
      "en": "You are about to start something new, and you will obviously be clumsy at first. Still, you want to try.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "처음부터 잘할 필요는 없다고 보고 10분만 시작한다.",
          "en": "I decide I do not need to be good from the start and try ten minutes."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "준비가 충분하지 않으면 시작하면 안 된다고 멈춘다.",
          "en": "I stop because if I am not fully prepared, I should not start."
        },
        "weights": {
          "should-statements": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "잘 못 할 거면 시작해도 의미가 없다고 본다.",
          "en": "If I cannot do it well, I see little point in starting."
        },
        "weights": {
          "all-or-nothing": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "해낸 부분보다 부족한 점만 보일 것 같아 망설인다.",
          "en": "I hesitate because I expect to see only what is lacking."
        },
        "weights": {
          "discounting-positive": 2
        }
      }
    ]
  },
  {
    "id": "tp_13",
    "targetDimension": "balanced-perspective/mind-reading/personalization/emotional-reasoning",
    "rationale": "Cold tone offers ambiguous evidence and four plausible interpretations.",
    "prompt": {
      "ko": "상대의 말투가 평소보다 차갑게 느껴졌습니다. 문장만 보면 특별히 공격적이진 않습니다.\n\n가장 가까운 해석은?",
      "en": "Someone’s tone feels colder than usual. The words themselves are not especially aggressive.\n\nWhat interpretation feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "말투만으로는 부족해서 다음 대화를 기다려본다.",
          "en": "Tone alone is not enough, so I wait for the next exchange."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "상대가 나에게 실망했거나 화났다고 읽는다.",
          "en": "I read it as them being disappointed in me or angry."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내가 무언가 건드렸는지 대화 내용을 되짚는다.",
          "en": "I replay the conversation to see whether I touched a nerve."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "불편함이 커서 실제로 문제가 있는 것처럼 믿어진다.",
          "en": "Because the discomfort is strong, it feels like there is a real problem."
        },
        "weights": {
          "emotional-reasoning": 2
        }
      }
    ]
  },
  {
    "id": "tp_14",
    "targetDimension": "balanced-perspective/overgeneralization/should-statements/catastrophizing",
    "rationale": "A low-productivity day tests globalizing, rule pressure, and future threat.",
    "prompt": {
      "ko": "하루 종일 계획만큼 해내지 못했습니다. 완전히 쉰 것도 아니고, 성과가 큰 것도 아닙니다.\n\n밤에 가까운 생각은?",
      "en": "You did not get as much done today as planned. You did not fully rest either, and the output was not big.\n\nWhat thought comes up at night?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "오늘은 느린 날이었다고 보고 내일 할 일 하나만 정한다.",
          "en": "I treat today as a slower day and set only one task for tomorrow."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "나는 늘 이런 식으로 흐트러지는 사람이라고 묶는다.",
          "en": "I label myself as someone who always falls apart like this."
        },
        "weights": {
          "overgeneralization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "이 정도는 해냈어야 한다며 밤에도 나를 몰아붙인다.",
          "en": "I push myself at night, saying I should have done at least this much."
        },
        "weights": {
          "should-statements": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "이러다 중요한 것들을 전부 놓칠 장면을 걱정한다.",
          "en": "I worry about a scene where I end up losing all the important things."
        },
        "weights": {
          "catastrophizing": 2
        }
      }
    ]
  },
  {
    "id": "tp_15",
    "targetDimension": "balanced-perspective/personalization/mind-reading/discounting-positive",
    "rationale": "Small praise from authority tests self-blame, social inference, and positive integration.",
    "prompt": {
      "ko": "상사가 짧게 “수고했어요”라고 말했습니다. 표정은 평범했고, 긴 피드백은 없었습니다.\n\n가장 가까운 생각은?",
      "en": "A supervisor briefly says, “Good work.” Their expression is neutral, and there is no long feedback.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "짧아도 긍정 피드백으로 받고 다음 일로 넘어간다.",
          "en": "Even if it is brief, I take it as positive feedback and move on."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "더 말이 없는 걸 보며 내가 뭘 놓쳤는지 찾는다.",
          "en": "Because there is nothing more, I look for what I may have missed."
        },
        "weights": {
          "personalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "표정이 담담해서 예의상 한 말이라고 추측한다.",
          "en": "Because their face was neutral, I guess it was just politeness."
        },
        "weights": {
          "mind-reading": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "잘한 부분보다 보완할 점부터 메모한다.",
          "en": "I note what needs improvement before what went well."
        },
        "weights": {
          "discounting-positive": 2
        }
      }
    ]
  },
  {
    "id": "tp_16",
    "targetDimension": "balanced-perspective/catastrophizing/all-or-nothing/overgeneralization",
    "rationale": "Conflict aftermath tests whether one scene becomes a fixed story.",
    "prompt": {
      "ko": "가까운 사람과 의견이 부딪혔습니다. 대화는 끝났지만 마음은 아직 조용하지 않습니다.\n\n가장 가까운 생각은?",
      "en": "You clash with someone close. The conversation is over, but your mind is not quiet yet.\n\nWhat thought feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "관계에도 이런 대화가 생길 수 있다고 보고 시간을 둔다.",
          "en": "I accept that relationships can have these conversations and give it time."
        },
        "weights": {
          "balanced-perspective": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "관계가 예전처럼 돌아가지 않을 장면을 걱정한다.",
          "en": "I worry about the relationship not returning to how it was."
        },
        "weights": {
          "catastrophizing": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "한 번 부딪혔으니 관계가 이미 깨진 것처럼 본다.",
          "en": "Because we clashed once, I see the relationship as already broken."
        },
        "weights": {
          "all-or-nothing": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "역시 가까워지면 늘 이런 일이 생긴다고 묶는다.",
          "en": "I bundle it into 'this always happens when people get close.'"
        },
        "weights": {
          "overgeneralization": 2
        }
      }
    ]
  }
];

export function calculateThinkingResult(answers: ThinkingAnswer[]): ThinkingResult {
  const scores = new Map<ThinkingPatternId, number>();
  for (const result of THINKING_RESULTS) scores.set(result.id, 0);

  for (const answer of answers) {
    for (const [id, value] of Object.entries(answer.weights) as Array<[ThinkingPatternId, number]>) {
      scores.set(id, (scores.get(id) ?? 0) + value);
    }
  }

  let winner = THINKING_RESULTS[0];
  let bestScore = -Infinity;
  for (const result of THINKING_RESULTS) {
    const score = scores.get(result.id) ?? 0;
    if (score > bestScore) {
      winner = result;
      bestScore = score;
    }
  }
  return winner;
}

export function getThinkingResultById(id: string | null | undefined): ThinkingResult | null {
  if (!id) return null;
  return THINKING_RESULTS.find((result) => result.id === id) ?? null;
}
