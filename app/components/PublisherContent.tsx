"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { GAMES, type ContentType, type Game } from "@/lib/games-home";
import { getGuideByGameId } from "@/lib/guides";

type Localized = { ko: string; en: string };
type ContentGame = Pick<Game, "id" | "href" | "cat" | "ko" | "en" | "type" | "category">;

type ContentOverride = {
  intro: Localized;
  method: Localized;
  result: Localized;
  share: Localized;
  faq: Array<{ q: Localized; a: Localized }>;
};

const TYPE_LABEL: Record<ContentType, Localized> = {
  test: { ko: "심리/성향 테스트", en: "personality test" },
  compatibility: { ko: "관계 테스트", en: "compatibility test" },
  fortune: { ko: "운세형 콘텐츠", en: "fortune-style experience" },
  game: { ko: "브라우저 게임", en: "browser game" },
};

const DEFAULT_TYPE_LABEL: Localized = {
  ko: "인터랙티브 콘텐츠",
  en: "interactive experience",
};

const CATEGORY_COPY: Record<string, { method: Localized; result: Localized; share: Localized }> = {
  test: {
    method: {
      ko: "문항을 풀 때는 이상적인 대답보다 실제 반응에 가까운 선택지를 고르는 것이 좋습니다. 결과는 선택 패턴을 읽기 쉬운 이야기로 바꿔 보여줍니다.",
      en: "Choose the answer closest to your real reaction rather than the most ideal answer. The result turns your pattern into a readable story.",
    },
    result: {
      ko: "결과는 재미와 자기성찰을 위한 엔터테인먼트입니다. 의학적, 심리학적, 법률적, 재정적 또는 전문적인 진단과 조언을 대신하지 않습니다.",
      en: "Results are entertainment for fun and self-reflection. They do not replace medical, psychological, legal, financial, or other professional advice.",
    },
    share: {
      ko: "친구와 결과를 비교하면 같은 상황을 서로 얼마나 다르게 받아들이는지 가볍게 이야기해볼 수 있습니다.",
      en: "Sharing results helps friends compare how differently they respond to the same situations.",
    },
  },
  compatibility: {
    method: {
      ko: "이름이나 간단한 입력값을 넣고 결과를 함께 읽어보세요. 입력값은 결과를 만들기 위한 최소한의 정보로 사용됩니다.",
      en: "Enter the simple details requested by the page and read the result together.",
    },
    result: {
      ko: "관계형 결과는 실제 관계를 판정하지 않습니다. 두 사람의 분위기를 이야기처럼 풀어보는 공유용 콘텐츠입니다.",
      en: "Compatibility results do not judge real relationships; they frame the pair's mood as a playful story.",
    },
    share: {
      ko: "결과 링크를 보내면 상대가 같은 결과를 바로 열어보고 대화를 이어갈 수 있습니다.",
      en: "A result link lets the other person open the same result and continue the conversation.",
    },
  },
  fortune: {
    method: {
      ko: "이름, 날짜, 선택값처럼 페이지에서 요청하는 정보를 입력하고 결과 카드의 키워드와 설명을 천천히 읽어보세요.",
      en: "Enter the requested name, date, or choices, then read the keywords and result card at your own pace.",
    },
    result: {
      ko: "운세형 결과는 재미와 상상을 위한 콘텐츠입니다. 실제 미래, 건강, 재정, 관계 결정을 판단하는 근거가 아닙니다.",
      en: "Fortune-style results are for fun and imagination, not for real decisions about the future, health, money, or relationships.",
    },
    share: {
      ko: "친구와 서로의 키워드를 비교하면 같은 주제도 다르게 읽히는 지점을 발견할 수 있습니다.",
      en: "Comparing keywords with friends makes it easy to notice what feels similar or different.",
    },
  },
  game: {
    method: {
      ko: "화면의 규칙을 확인하고 바로 플레이하세요. 대부분의 게임은 브라우저에서 짧게 끝까지 즐길 수 있습니다.",
      en: "Read the on-screen rule and play directly in the browser. Most games are designed for quick rounds.",
    },
    result: {
      ko: "점수와 기록은 능력 평가가 아니라 플레이 경험을 비교하기 위한 가벼운 표시입니다.",
      en: "Scores and records are light comparison markers, not evaluations of real ability.",
    },
    share: {
      ko: "짧은 기록이나 의외의 결과를 공유하면 친구가 바로 다시 도전하기 쉽습니다.",
      en: "Short scores and surprising outcomes make it easy for friends to try another round.",
    },
  },
};

function qa(koQ: string, enQ: string, koA: string, enA: string): ContentOverride["faq"][number] {
  return {
    q: { ko: koQ, en: enQ },
    a: { ko: koA, en: enA },
  };
}

const OVERRIDES: Record<string, ContentOverride> = {
  "political-type": {
    intro: {
      ko: "정치성향 테스트는 정당 지지나 투표 성향을 묻지 않고, 사회 이슈를 바라볼 때 어떤 가치 기준을 먼저 떠올리는지 읽어보는 테스트입니다. 자유와 질서, 평등과 경쟁, 복지와 시장, 변화와 안정, 개인 책임과 사회 책임 사이에서 당신의 판단 습관을 가볍게 확인할 수 있습니다.",
      en: "Political Orientation Test does not ask about party support or voting intent. It reads the value standards you tend to use when thinking about social issues, from freedom and order to welfare, markets, change, stability, and responsibility.",
    },
    method: {
      ko: "16개의 상황형 질문에서 가장 그럴듯한 답이 아니라, 실제로 당신이 먼저 떠올릴 기준에 가까운 선택지를 고르세요. 각 선택지는 -3부터 +3까지의 점수로 계산되어 진보, 중도, 보수 스펙트럼 위의 위치를 만듭니다.",
      en: "For each of the 16 scenario questions, choose the option closest to the standard you would actually use first. Each answer contributes a score from -3 to +3 and places you on a progressive, centrist, or conservative spectrum.",
    },
    result: {
      ko: "결과는 정치적 조언이나 투표 추천이 아닙니다. 강한 진보형부터 강한 보수형까지 7가지 유형으로 사회를 판단하는 기준, 강점, 주의할 점, 잘 맞는 대화 방식을 설명하는 자기이해 콘텐츠입니다.",
      en: "The result is not political advice or voting guidance. It is a self-reflection result across seven types, explaining your standards, strengths, cautions, and conversation style.",
    },
    share: {
      ko: "친구와 비교할 때는 누가 맞고 틀린지보다 서로가 어떤 가치를 먼저 보는지 이야기해보세요. 이 테스트는 낙인보다 대화를 시작하기 위한 콘텐츠로 쓰는 것이 좋습니다.",
      en: "When comparing with friends, focus on which values each person notices first rather than who is right or wrong. Use the result to start conversation, not to label people.",
    },
    faq: [
      qa(
        "정당 지지나 투표 성향을 알려주나요?",
        "Does it reveal party support or voting intent?",
        "아닙니다. 실제 정당, 정치인, 선거 선택을 묻지 않으며 사회 이슈를 보는 가치 기준만 가볍게 읽어봅니다.",
        "No. It does not ask about real parties, politicians, or election choices. It only reads value tendencies around social issues.",
      ),
      qa(
        "진보나 보수 결과가 좋고 나쁨을 뜻하나요?",
        "Does a progressive or conservative result mean good or bad?",
        "아닙니다. 결과는 가치 기준의 차이를 설명할 뿐이며 특정 성향을 조롱하거나 평가하지 않습니다.",
        "No. Results explain different value standards and do not mock or rank any orientation.",
      ),
      qa(
        "결과를 어떻게 활용하면 좋나요?",
        "How should I use the result?",
        "사회 이슈를 볼 때 내가 무엇을 먼저 걱정하고 무엇을 먼저 지키려 하는지 확인하는 참고로 활용하세요.",
        "Use it as a reference for noticing what you worry about first and what you try to protect first in social debates.",
      ),
    ],
  },
  "breaking-point": {
    intro: {
      ko: "나를 차갑게 만드는 순간은 관계 속에서 마음이 닫히는 지점을 살펴보는 심리 테스트입니다. 상처를 바로 표현하는지, 조용히 물러나는지, 이유를 설명하려 하는지 같은 반응 차이를 결과로 읽어봅니다.",
      en: "Breaking Point explores what makes you turn cold in relationships, from immediate hurt to quiet withdrawal or boundary-setting.",
    },
    method: {
      ko: "각 상황에서 실제로 가장 먼저 할 것 같은 반응을 고르세요. 좋은 사람처럼 보이는 선택보다 몸이 먼저 향하는 선택이 더 자연스럽습니다.",
      en: "Pick what you would actually do first in each situation, not the answer that sounds most polished.",
    },
    result: {
      ko: "결과는 관계 진단이 아니라 상처와 거리두기 반응을 읽는 참고용 콘텐츠입니다. 내 마음이 닫히는 조건을 알아차리는 데 초점을 둡니다.",
      en: "The result is not a relationship diagnosis; it is a reflection on hurt, distance, and boundaries.",
    },
    share: {
      ko: "친구와 비교할 때는 누가 더 차가운지보다 서로 어떤 순간에 상처받는지 이야기해보면 좋습니다.",
      en: "When sharing, compare what hurts each of you rather than who is colder.",
    },
    faq: [
      qa("결과가 실제 성격을 뜻하나요?", "Does the result define my personality?", "아닙니다. 문항 선택을 바탕으로 만든 엔터테인먼트 해석입니다.", "No. It is an entertainment reading based on your choices."),
      qa("관계 문제 해결에 써도 되나요?", "Can this solve relationship issues?", "대화의 시작점으로는 쓸 수 있지만 실제 갈등 해결은 서로의 대화와 맥락이 필요합니다.", "It can start a conversation, but real conflicts need context and communication."),
      qa("친구에게 보내도 괜찮나요?", "Can I send it to a friend?", "가능합니다. 다만 상대를 단정하거나 놀리는 용도로 쓰지 않는 것이 좋습니다.", "Yes, but avoid using it to label or mock someone."),
    ],
  },
  "deep-fear": {
    intro: {
      ko: "당신 안의 가장 깊은 공포는 귀신이나 괴물을 맞히는 퀴즈가 아니라, 일상 속 불편한 장면에서 어떤 심리적 위협에 민감한지 읽어보는 심리 호러 테스트입니다.",
      en: "Deep Fear is not a ghost quiz. It reads which psychological threat you are most sensitive to in quiet, unsettling everyday scenes.",
    },
    method: {
      ko: "가장 무서워 보이는 선택지가 아니라 그 순간 내 머릿속에 가장 먼저 떠오를 생각을 고르세요.",
      en: "Choose the thought that would come first, not simply the option that looks scariest.",
    },
    result: {
      ko: "공포 결과는 진단이 아닙니다. 버려짐, 들킴, 통제 상실, 반복, 망각처럼 내가 민감하게 반응하는 감정의 주제를 이야기로 보여줍니다.",
      en: "Fear results are not diagnosis. They frame themes like abandonment, exposure, loss of control, repetition, and being forgotten.",
    },
    share: {
      ko: "친구와 결과를 비교하면 사람마다 무서워하는 장면이 얼마나 다른지 조용히 이야기해볼 수 있습니다.",
      en: "Sharing reveals how differently people experience fear.",
    },
    faq: [
      qa("점프스케어가 있나요?", "Are there jump scares?", "없습니다. 조용한 심리적 분위기의 문항과 결과를 중심으로 구성했습니다.", "No. The test focuses on quiet psychological atmosphere."),
      qa("공포증을 진단하나요?", "Does it diagnose phobias?", "아닙니다. 재미와 자기성찰을 위한 콘텐츠입니다.", "No. It is for entertainment and reflection."),
      qa("결과가 불편하면 어떻게 하나요?", "What if the result feels uncomfortable?", "언제든 중단해도 됩니다. 불편함이 오래 지속되면 가까운 사람이나 전문가와 이야기하세요.", "You can stop anytime. If distress lingers, talk to someone you trust or a professional."),
    ],
  },
  "thinking-pattern": {
    intro: {
      ko: "인지왜곡 테스트는 일상적인 상황에서 생각이 어떤 방향으로 먼저 꼬이는지 살펴보는 콘텐츠입니다. 각 문항은 짧은 상황과 그때 떠오르는 생각을 함께 제시합니다.",
      en: "Thinking Pattern Test explores how your thoughts tend to twist in everyday situations through short contexts and statements.",
    },
    method: {
      ko: "상황을 읽은 뒤, 제시된 생각이 나에게 얼마나 자주 떠오르는지 1점부터 7점 사이에서 고르세요.",
      en: "Read the context, then rate how often the statement appears in your mind on a 1 to 7 scale.",
    },
    result: {
      ko: "결과는 생각 습관을 진단하지 않습니다. 내가 자주 쓰는 해석 방식을 알아차리기 위한 참고용 엔터테인먼트입니다.",
      en: "The result does not diagnose thinking problems; it helps you notice a repeated interpretation style.",
    },
    share: {
      ko: "친구와 비교하면 같은 상황에서도 누군가는 최악을 상상하고, 누군가는 자기 탓으로 돌리는 차이를 볼 수 있습니다.",
      en: "Sharing shows how different people interpret the same situation.",
    },
    faq: [
      qa("인지왜곡이 있으면 문제가 있나요?", "Is cognitive distortion a problem?", "누구에게나 나타날 수 있는 생각 습관입니다. 결과는 참고용으로만 읽어주세요.", "It can happen to anyone. Read the result as a reference only."),
      qa("전문 검사를 대신하나요?", "Does it replace a professional assessment?", "아닙니다. 심리학적 진단이나 상담을 대신하지 않습니다.", "No. It does not replace psychological diagnosis or counseling."),
      qa("어떻게 읽으면 좋나요?", "How should I read it?", "나를 비난하기보다 내가 자주 먼저 내리는 결론을 알아차리는 데 사용하세요.", "Use it to notice your automatic conclusions, not to blame yourself."),
    ],
  },
  "defense-mechanism": {
    intro: {
      ko: "방어기제 테스트는 불편한 감정이 올라올 때 내 마음이 어떻게 나를 지키려 하는지 살펴보는 테스트입니다. 회피, 합리화, 부정, 투사처럼 익숙한 반응을 일상 상황으로 풀었습니다.",
      en: "Defense Mechanism Test explores how your mind protects you when uncomfortable feelings rise.",
    },
    method: {
      ko: "비슷한 상황에서 실제로 자주 하는 반응을 고르세요. 답은 좋고 나쁨이 아니라 어떤 보호 방식에 가까운지를 보여줍니다.",
      en: "Choose what you actually tend to do. Answers show a protective style, not good or bad behavior.",
    },
    result: {
      ko: "결과는 임상 진단이 아닙니다. 불편한 감정을 다룰 때 내가 익숙하게 쓰는 반응을 알아차리는 데 초점을 둡니다.",
      en: "The result is not clinical diagnosis; it helps you notice a familiar response to discomfort.",
    },
    share: {
      ko: "결과를 공유할 때는 상대를 분석하기보다 '나는 이런 순간에 이렇게 피하더라'처럼 자기 이야기로 읽어보세요.",
      en: "When sharing, use it as your own reflection rather than a way to analyze someone else.",
    },
    faq: [
      qa("방어기제는 나쁜 건가요?", "Are defense mechanisms bad?", "아닙니다. 마음을 보호하는 자연스러운 반응이지만 너무 반복되면 대화를 막을 수 있습니다.", "No. They protect the mind, but repeated patterns can block communication."),
      qa("결과로 치료가 필요한지 알 수 있나요?", "Can it tell if I need therapy?", "알 수 없습니다. 전문 진단이나 상담을 대신하지 않습니다.", "No. It does not replace diagnosis or counseling."),
      qa("정답이 있나요?", "Are there right answers?", "없습니다. 실제 나와 가까운 반응을 고르는 것이 가장 좋습니다.", "No. The best answer is the one closest to your real reaction."),
    ],
  },
  joseon: {
    intro: {
      ko: "조선시대 나의 일대기는 이름 하나로 가상의 조선 생애 기록을 만들어보는 세계관형 테스트입니다. 신분, 하루의 장면, 인생의 전환점이 짧은 전기처럼 이어집니다.",
      en: "My Life in Joseon turns a name into a fictional Joseon-era life record with role, scenes, and destiny.",
    },
    method: {
      ko: "이름을 입력하고 결과의 신분, 성격 키워드, 사건 문장을 순서대로 읽어보세요. 본명 대신 별명이나 이니셜을 써도 됩니다.",
      en: "Enter a name and read the role, personality keywords, and story scenes in order. Nicknames work too.",
    },
    result: {
      ko: "결과는 역사 고증이나 사주가 아니라 조선 분위기를 빌린 창작형 엔터테인먼트입니다.",
      en: "The result is fictional entertainment inspired by Joseon, not historical evidence or fortune telling.",
    },
    share: {
      ko: "친구와 서로의 조선 캐릭터를 비교하면 궁궐, 장터, 서재처럼 다른 분위기의 이야기가 만들어집니다.",
      en: "Sharing lets friends compare their fictional Joseon characters and settings.",
    },
    faq: [
      qa("역사적으로 정확한가요?", "Is it historically accurate?", "아닙니다. 조선 분위기를 빌린 창작형 콘텐츠입니다.", "No. It is fictional content inspired by the Joseon setting."),
      qa("본명을 넣어도 되나요?", "Can I use my real name?", "가능하지만 결과 공유 시 이름이 보일 수 있으니 부담스럽다면 별명을 사용하세요.", "Yes, but use a nickname if you do not want your name visible when sharing."),
      qa("결과가 매번 같나요?", "Does the result stay the same?", "같은 입력값에서는 같은 흐름의 결과가 나오도록 구성되어 있습니다.", "The same input is designed to restore the same result flow."),
    ],
  },
  kbti: {
    intro: {
      ko: "KBTI는 한국식 일상 감각으로 성향을 가볍게 읽어보는 테스트입니다. 익숙한 MBTI식 코드보다 생활 속 반응과 분위기에 초점을 둡니다.",
      en: "KBTI is a Korean-style personality test focused on everyday reactions and social mood.",
    },
    method: {
      ko: "각 문항에서 나에게 더 자연스러운 선택지를 고르세요. 오래 분석하기보다 평소의 말투와 행동을 떠올리는 것이 좋습니다.",
      en: "Choose what feels more natural in each question. Think of your usual tone and behavior.",
    },
    result: {
      ko: "결과는 성격 진단이 아니라 친구와 비교하기 좋은 엔터테인먼트형 성향 설명입니다.",
      en: "The result is not a personality diagnosis; it is a shareable entertainment-style profile.",
    },
    share: {
      ko: "친구와 결과를 비교하면 같은 유형처럼 보여도 어떤 문장이 더 맞는지 다르게 느끼는 지점을 이야기할 수 있습니다.",
      en: "Sharing helps friends compare which lines feel accurate, even when types seem similar.",
    },
    faq: [
      qa("공식 MBTI인가요?", "Is this official MBTI?", "아닙니다. MBTI식 언어에서 영감을 받은 재미용 테스트입니다.", "No. It is an entertainment test inspired by MBTI-style language."),
      qa("결과가 안 맞으면요?", "What if it feels inaccurate?", "그날의 기분과 선택에 따라 달라질 수 있으니 맞는 부분만 가볍게 참고하세요.", "Mood and choices can affect results; keep only what feels useful."),
      qa("SNS에 공유해도 되나요?", "Can I share it on social media?", "가능합니다. 다만 결과에 표시되는 정보가 괜찮은지 먼저 확인하세요.", "Yes. Check that you are comfortable with any visible information first."),
    ],
  },
  ahmolla: {
    intro: {
      ko: "아 몰라는 선택지가 너무 많을 때 결국 아무거나 고르고 싶어지는 마음을 게임으로 만든 짧은 결정 피로 콘텐츠입니다. 선택을 미루다가 어디까지 가는지, 포기 버튼 앞에서 얼마나 버티는지 가볍게 확인합니다.",
      en: "Ah, Whatever is a short decision-fatigue game about the moment when too many choices make you want to pick anything. It turns hesitation, giving up, and overthinking into a playful result.",
    },
    method: {
      ko: "화면에 나오는 선택지를 따라가다가 더 이상 고르기 싫어지는 순간을 느껴보세요. 규칙은 단순하지만, 계속 선택을 요구받는 과정 자체가 이 게임의 핵심입니다.",
      en: "Follow the choices on screen and notice when you no longer want to choose. The rules are simple, but the repeated pressure to decide is the point of the game.",
    },
    result: {
      ko: "결과는 실제 결정력이나 성격을 평가하지 않습니다. 몇 번의 선택 끝에 멈췄는지를 바탕으로 만든 재미용 해석이며, 집중력이나 의지력의 진지한 측정값이 아닙니다.",
      en: "The result does not judge your real decision-making ability or personality. It is an entertainment reading based on how long you kept choosing, not a serious measure of focus or willpower.",
    },
    share: {
      ko: "친구와 비교할 때는 누가 더 우유부단한지 몰아가기보다, 누가 더 빨리 '아 몰라' 모드가 되는지 웃으면서 이야기해보세요.",
      en: "When sharing, compare who reaches the 'whatever' point faster without turning it into a real judgment. It works best as a light conversation starter.",
    },
    faq: [
      qa("점수가 낮으면 결정력이 부족한 건가요?", "Does a low result mean I am bad at decisions?", "아닙니다. 이 게임은 반복 선택 상황을 장난스럽게 풀어낸 콘텐츠이며 실제 능력 평가가 아닙니다.", "No. This is a playful take on repeated choices, not an ability test."),
      qa("결과를 진지하게 봐야 하나요?", "Should I take the result seriously?", "가볍게 읽어주세요. 결과 문장은 웃고 공유하기 위한 해석입니다.", "Read it lightly. Result lines are written for fun and sharing."),
      qa("친구에게 보내도 되나요?", "Can I send it to friends?", "가능합니다. 서로를 놀리기보다 각자 언제 선택 피로를 느끼는지 이야기해보면 좋습니다.", "Yes. Use it to talk about when each person gets tired of choosing, not to mock anyone."),
    ],
  },
  nunchi: {
    intro: {
      ko: "눈치 측정기는 대화와 상황 속에서 '지금 눌러야 하는 타이밍'을 감으로 읽어보는 짧은 사회 감각 게임입니다. 말의 내용보다 분위기, 멈칫하는 순간, 기다려야 할 타이밍을 보는 데 초점을 둡니다.",
      en: "Nunchi-meter is a short social-timing game about reading the moment. It focuses on mood, pauses, and when to act rather than on memorizing facts.",
    },
    method: {
      ko: "각 라운드에서 문장을 읽고, 행동해야 한다고 느끼는 순간 버튼을 누르세요. 어떤 장면은 누르지 않고 기다리는 것이 더 좋은 선택일 수 있습니다.",
      en: "Read each scene and press when you feel it is the right moment to act. In some rounds, not pressing and waiting is the better choice.",
    },
    result: {
      ko: "점수는 실제 사회성이나 인간관계 능력을 평가하지 않습니다. 게임 속 상황에서 타이밍을 어떻게 읽었는지 보여주는 가벼운 기록입니다.",
      en: "The score does not measure real social skill or relationship ability. It is a light marker of how you read timing inside these game scenes.",
    },
    share: {
      ko: "친구와 점수를 비교하면 누가 더 빠르게 눈치챘는지, 누가 끝까지 기다렸는지 이야기하기 쉽습니다. 결과는 장난스럽게 비교하는 용도로만 읽어주세요.",
      en: "Sharing makes it easy to compare who acted quickly and who waited longer. Treat the result as a friendly comparison only.",
    },
    faq: [
      qa("눈치 점수가 낮으면 사회성이 낮은 건가요?", "Does a low score mean poor social skill?", "아닙니다. 제한된 게임 장면에서의 타이밍 결과일 뿐 실제 사회성을 판단하지 않습니다.", "No. It only reflects timing in limited game scenes and does not judge real social ability."),
      qa("정답이 항상 하나인가요?", "Is there always one right answer?", "게임 안에서는 점수 기준이 있지만 실제 대화에서는 맥락과 관계가 더 중요합니다.", "The game has scoring rules, but real conversations depend on context and relationships."),
      qa("결과를 어떻게 공유하면 좋나요?", "How should I share the result?", "점수로 줄 세우기보다 서로 다른 타이밍 감각을 비교하는 식으로 즐겨주세요.", "Use it to compare different timing instincts rather than ranking people."),
    ],
  },
  react: {
    intro: {
      ko: "반응속도 게임은 화면이 초록색으로 바뀌는 순간을 기다렸다가 최대한 빠르게 누르는 5라운드 미니 챌린지입니다. 짧은 집중, 타이밍, 손의 반응을 가볍게 확인합니다.",
      en: "Reaction Speed is a five-round mini challenge where you wait for green and tap as quickly as possible. It is a quick check of focus, timing, and reflex.",
    },
    method: {
      ko: "너무 일찍 누르면 그 라운드는 다시 시작됩니다. 다섯 번의 기록을 모아 평균 반응속도를 계산하고, 가장 빠른 기록과 평균 기준 차이도 함께 보여줍니다.",
      en: "Tap too early and the round restarts. After five valid taps, the game calculates your average reaction time and shows your fastest tap and comparison markers.",
    },
    result: {
      ko: "결과는 실제 운동 능력, 집중력, 신경 반응을 진단하지 않습니다. 기기 상태, 화면 주사율, 손 위치, 그날 컨디션에 따라 달라지는 재미용 기록입니다.",
      en: "The result does not diagnose athletic ability, focus, or neurological reflexes. Device speed, screen refresh rate, hand position, and your condition can all affect the number.",
    },
    share: {
      ko: "친구와 평균 ms를 비교하거나 가장 빠른 한 번의 기록을 자랑해보세요. 다만 결과는 진지한 능력 평가보다 다시 도전하게 만드는 가벼운 기록으로 보는 것이 좋습니다.",
      en: "Compare average milliseconds with friends or brag about your fastest tap. Treat it as a replayable mini score, not a serious ability ranking.",
    },
    faq: [
      qa("반응속도 점수가 실제 능력인가요?", "Is the reaction time my real ability?", "아닙니다. 브라우저와 기기 환경의 영향을 받는 게임 기록입니다.", "No. It is a browser-game score affected by device and browser conditions."),
      qa("왜 너무 일찍 누르면 다시 시작되나요?", "Why does tapping early restart the round?", "예상으로 누르는 것과 실제 신호에 반응하는 것을 구분하기 위한 게임 규칙입니다.", "It separates guessing from reacting to the actual signal."),
      qa("친구와 비교해도 괜찮나요?", "Can I compare with friends?", "네. 같은 기기나 비슷한 환경에서 비교하면 더 재미있지만, 결과는 가볍게만 봐주세요.", "Yes. It is more fun on similar devices, but keep the comparison light."),
    ],
  },
  timesense: {
    intro: {
      ko: "시간 감각 게임은 화면 없이 몸으로 시간을 세어보는 조용한 타이밍 챌린지입니다. 목표 초를 보고 시작한 뒤, 어둠 속에서 시간이 지났다고 느끼는 순간 다시 누릅니다.",
      en: "Time Sense is a quiet timing challenge where you count seconds without watching the screen. See the target, start, then tap again when you feel the time has passed.",
    },
    method: {
      ko: "각 라운드는 서로 다른 목표 시간을 제시합니다. 실제로 멈춘 시간과 목표 시간의 차이를 바탕으로 정확도를 계산하고, 여러 라운드의 평균으로 최종 결과를 보여줍니다.",
      en: "Each round gives a different target duration. The game compares your stopped time with the target and averages multiple rounds into a final accuracy result.",
    },
    result: {
      ko: "정확도는 실제 시간 감각이나 집중력을 전문적으로 측정하지 않습니다. 주변 소리, 긴장감, 기기 조작 타이밍에 따라 달라지는 재미용 기록입니다.",
      en: "Accuracy is not a professional measure of time perception or concentration. Sound, tension, device handling, and timing can all change the result.",
    },
    share: {
      ko: "친구와 비교하면 누가 시간을 빠르게 느끼는지, 누가 오래 버티는지 쉽게 이야기할 수 있습니다. 결과는 가볍게 공유하고 다시 도전하는 기록으로 즐겨주세요.",
      en: "Sharing lets friends compare who feels time faster or slower. Treat the score as a light replayable result.",
    },
    faq: [
      qa("정확도가 낮으면 시간 감각이 나쁜 건가요?", "Does low accuracy mean I have bad time sense?", "아닙니다. 몇 번의 게임 라운드 결과일 뿐 실제 능력 판단이 아닙니다.", "No. It is only a few game rounds, not a real ability judgment."),
      qa("소리를 듣고 세어도 되나요?", "Can I count using sound?", "가능하지만 조용한 곳에서 마음속으로 세면 게임의 의도에 더 가깝습니다.", "You can, but counting internally in a quiet place is closer to the intended challenge."),
      qa("결과를 어떻게 비교하면 좋나요?", "How should I compare results?", "최종 정확도뿐 아니라 어떤 목표 시간에서 흔들렸는지도 함께 보면 더 재미있습니다.", "Compare not only final accuracy, but also which target duration felt hardest."),
    ],
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fallbackGame(pathname: string): ContentGame | null {
  const segments = pathname.split("/").filter(Boolean);
  const area = segments[0];
  const slug = segments[1];
  if ((area !== "games" && area !== "tests") || !slug) return null;

  const title = titleFromSlug(slug);
  const isTest = area === "tests";
  return {
    id: slug,
    href: `/${area}/${slug}`,
    cat: isTest ? "self" : "play",
    ko: {
      title,
      sub: isTest ? "짧게 답하고 결과를 읽는 테스트" : "브라우저에서 바로 즐기는 콘텐츠",
      kicker: isTest ? "테스트" : "미니 콘텐츠",
    },
    en: {
      title,
      sub: isTest ? "A quick test with a readable result" : "A short browser experience",
      kicker: isTest ? "Test" : "Mini experience",
    },
    type: isTest ? "test" : "game",
    category: isTest ? "tests" : "mini-games",
  };
}

function findGame(pathname: string): ContentGame | null {
  const cleanPath = pathname.split("?")[0];
  const direct = GAMES.find((game) => game.href === cleanPath);
  if (direct) return direct;

  const segments = cleanPath.split("/").filter(Boolean);
  const base =
    segments[0] === "games" || segments[0] === "tests"
      ? `${segments[0]}/${segments[1] ?? ""}`
      : "";
  return GAMES.find((game) => game.href === `/${base}` || game.id === segments[1]) ?? fallbackGame(cleanPath);
}

function contentKind(game: ContentGame): ContentType {
  return game.type ?? (game.category === "mini-games" ? "game" : "test");
}

function defaultIntro(game: ContentGame, kind: ContentType): Localized {
  const koType = TYPE_LABEL[kind]?.ko ?? DEFAULT_TYPE_LABEL.ko;
  const enType = TYPE_LABEL[kind]?.en ?? DEFAULT_TYPE_LABEL.en;
  return {
    ko: `${game.ko.title}는 "${game.ko.sub}"를 주제로 만든 ${koType}입니다. 짧게 시작할 수 있지만 결과를 읽고 공유할 수 있도록 설명과 관련 콘텐츠를 함께 제공합니다.`,
    en: `${game.en.title} is a ${enType} built around "${game.en.sub}". It is quick to start and includes context for reading and sharing the result.`,
  };
}

function defaultFaq(game: ContentGame, kind: ContentType): ContentOverride["faq"] {
  const isGame = kind === "game";
  return [
    qa(
      `${game.ko.title}는 무료인가요?`,
      `Is ${game.en.title} free to use?`,
      "네. 별도 설치 없이 브라우저에서 바로 이용할 수 있습니다.",
      "Yes. You can use it directly in the browser without installation.",
    ),
    qa(
      isGame ? "점수는 무엇을 의미하나요?" : "결과를 얼마나 진지하게 봐야 하나요?",
      isGame ? "What does the score mean?" : "How seriously should I take the result?",
      isGame
        ? "점수는 플레이 기록을 비교하기 위한 가벼운 표시이며 실제 능력을 평가하지 않습니다."
        : "결과는 재미와 자기성찰을 위한 해석이며 전문적인 진단이나 조언을 대신하지 않습니다.",
      isGame
        ? "The score is a light comparison marker and does not evaluate real ability."
        : "The result is for fun and reflection, not professional diagnosis or advice.",
    ),
    qa(
      "친구와 공유해도 되나요?",
      "Can I share it with friends?",
      "네. 공유 버튼이나 링크 복사 기능이 있는 페이지에서는 결과나 테스트 페이지를 쉽게 보낼 수 있습니다.",
      "Yes. Pages with share or copy-link actions make it easy to send the result or page.",
    ),
  ];
}

function relatedGames(game: ContentGame): Game[] {
  return GAMES.filter(
    (item) =>
      item.id !== game.id &&
      (item.category === game.category || item.type === game.type || item.cat === game.cat),
  ).slice(0, 4);
}

export default function PublisherContent() {
  const pathname = usePathname() ?? "";
  const { locale, t } = useLocale();
  const game = findGame(pathname);

  if (!game) return null;

  const kind = contentKind(game);
  const typeCopy = CATEGORY_COPY[kind] ?? CATEGORY_COPY.test;
  const override = OVERRIDES[game.id];
  const intro = override?.intro ?? defaultIntro(game, kind);
  const method = override?.method ?? typeCopy.method;
  const result = override?.result ?? typeCopy.result;
  const share = override?.share ?? typeCopy.share;
  const faq = override?.faq ?? defaultFaq(game, kind);
  const related = relatedGames(game);
  const label = TYPE_LABEL[kind] ?? DEFAULT_TYPE_LABEL;
  const guide = getGuideByGameId(game.id);

  return (
    <aside className="publisher-content" lang={locale}>
      <div className="publisher-content__inner">
        <p className="publisher-content__eyebrow">
          {t("콘텐츠 안내", "Content guide")} · {t(label.ko, label.en)}
        </p>
        <h2>{t(`${game.ko.title} 소개`, `About ${game.en.title}`)}</h2>
        <p className="publisher-content__lead">{t(intro.ko, intro.en)}</p>

        {guide ? (
          <section className="publisher-content__guide" aria-label="관련 가이드">
            <div>
              <h3>{guide.publisherLinkLabel}</h3>
              <p>{guide.publisherLinkDescription}</p>
            </div>
            <Link href={guide.href}>가이드 읽기</Link>
          </section>
        ) : null}

        <div className="publisher-content__grid">
          <section>
            <h3>{t("이용 방법", "How to use")}</h3>
            <p>{t(method.ko, method.en)}</p>
          </section>
          <section>
            <h3>{t("결과 해석", "How to read the result")}</h3>
            <p>{t(result.ko, result.en)}</p>
          </section>
          <section>
            <h3>{t("공유 팁", "Sharing tip")}</h3>
            <p>{t(share.ko, share.en)}</p>
          </section>
        </div>

        <section className="publisher-content__faq">
          <h3>{t("자주 묻는 질문", "FAQ")}</h3>
          <div>
            {faq.map((item, index) => (
              <details key={item.q.en} open={index === 0}>
                <summary>{t(item.q.ko, item.q.en)}</summary>
                <p>{t(item.a.ko, item.a.en)}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 ? (
          <section className="publisher-content__related">
            <h3>{t("관련 콘텐츠", "Related picks")}</h3>
            <div>
              {related.map((item) => (
                <Link key={item.id} href={item.href}>
                  <strong>{t(item.ko.title, item.en.title)}</strong>
                  <span>{t(item.ko.sub, item.en.sub)}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
