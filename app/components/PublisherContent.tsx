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
  test: { ko: "성향 테스트", en: "personality test" },
  compatibility: { ko: "관계 테스트", en: "compatibility test" },
  fortune: { ko: "운세형 콘텐츠", en: "fortune-style experience" },
  game: { ko: "미니게임", en: "mini game" },
};

const DEFAULT_TYPE_LABEL: Localized = {
  ko: "인터랙티브 콘텐츠",
  en: "interactive experience",
};

const CATEGORY_COPY: Record<string, { method: Localized; result: Localized; share: Localized }> = {
  test: {
    method: {
      ko: "질문을 빠르게 넘기기보다 실제로 자주 하는 선택을 기준으로 답하면 결과 설명이 더 자연스럽게 읽힙니다.",
      en: "Answer with the choice you would actually make most often, rather than trying to force a perfect result.",
    },
    result: {
      ko: "결과는 정답이나 진단이 아니라, 선택 패턴을 읽기 쉬운 이야기와 키워드로 정리한 엔터테인먼트 해석입니다.",
      en: "Results are not a diagnosis; they turn your answer pattern into readable keywords and a short interpretation.",
    },
    share: {
      ko: "친구와 결과 문장을 비교하면 서로가 같은 상황을 얼마나 다르게 받아들이는지 가볍게 이야기해볼 수 있습니다.",
      en: "Sharing works well because friends can compare how differently they read the same situations.",
    },
  },
  compatibility: {
    method: {
      ko: "두 사람의 이름이나 간단한 정보를 넣고 결과를 확인하세요. 입력값은 결과 링크를 만들 때 필요한 범위에서만 사용됩니다.",
      en: "Enter the two names or simple details requested by the page, then read the result together.",
    },
    result: {
      ko: "결과는 관계를 단정하지 않고, 두 사람의 분위기와 케미를 이야기처럼 풀어내는 가벼운 궁합 콘텐츠입니다.",
      en: "The result does not judge a relationship; it frames the pair's chemistry as a playful story.",
    },
    share: {
      ko: "결과 링크를 보내면 상대가 바로 같은 결과를 열어볼 수 있어, 대화의 첫 문장으로 쓰기 좋습니다.",
      en: "The result link is easy to send and gives the other person a simple starting point for conversation.",
    },
  },
  fortune: {
    method: {
      ko: "이름이나 생년월일처럼 페이지에서 요청하는 값을 입력한 뒤, 결과의 키워드와 설명을 천천히 읽어보세요.",
      en: "Enter the requested name or date details, then read the keywords and interpretation at your own pace.",
    },
    result: {
      ko: "운세형 결과는 재미와 자기 성찰을 위한 콘텐츠이며 실제 미래, 건강, 재정, 관계 판단을 대신하지 않습니다.",
      en: "Fortune-style results are for fun and reflection, not for real-life medical, financial, or relationship decisions.",
    },
    share: {
      ko: "친구와 서로의 키워드를 비교하면 비슷한 점과 다른 점을 쉽게 발견할 수 있습니다.",
      en: "It is fun to compare keywords with friends and notice what feels similar or different.",
    },
  },
  game: {
    method: {
      ko: "화면의 규칙을 먼저 확인하고 한 판을 짧게 플레이해보세요. 대부분의 게임은 브라우저에서 바로 끝까지 즐길 수 있습니다.",
      en: "Read the on-screen rule once, then play a short round directly in the browser.",
    },
    result: {
      ko: "점수나 기록은 순위 경쟁보다 나의 반응, 감각, 선택을 가볍게 확인하는 용도로 설계되어 있습니다.",
      en: "Scores and records are designed as light feedback on your reaction, timing, or choices.",
    },
    share: {
      ko: "짧은 기록이나 의외의 결과를 공유하면 친구가 바로 다시 도전하기 쉽습니다.",
      en: "Short scores and surprising outcomes make it easy for a friend to try one more round.",
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
  "joseon-couple": {
    intro: {
      ko: "조선시대 커플 궁합은 두 사람의 이름을 바탕으로 조선의 신분, 역할, 만남의 장면을 엮어 하나의 짧은 로맨스 기록처럼 보여주는 테스트입니다.",
      en: "Joseon Couple turns two names into a short period-romance record with roles, status, and a meeting scene from old Korea.",
    },
    method: {
      ko: "두 사람의 이름과 성별을 입력하면 같은 계산 흐름으로 인연 유형, 점수, 장면별 해석이 만들어집니다. 결과 공유 링크도 같은 입력값으로 복원됩니다.",
      en: "Enter two names and genders; the same deterministic flow creates the bond type, score, and scene-based reading.",
    },
    result: {
      ko: "결과는 실제 궁합 판단이 아니라, 조선시대 이야기 문법을 빌린 창작형 관계 콘텐츠입니다. 제목, 기록, 장면, 한 줄 대사를 함께 읽으면 더 재미있습니다.",
      en: "The result is fictional entertainment, not a real compatibility judgment. Read the title, record, scenes, and line together.",
    },
    share: {
      ko: "공유 링크는 전체 내용을 스포하기보다 두 사람의 조선 인연을 열어보게 만드는 미리보기로 작동합니다.",
      en: "The shared link works as a teaser, inviting the other person to open the Joseon bond without spoiling the whole story.",
    },
    faq: [
      {
        q: { ko: "결과가 새로고침해도 같나요?", en: "Will the result stay the same after refreshing?" },
        a: { ko: "같은 이름과 성별 조합이면 같은 결과가 나오도록 설계되어 있습니다.", en: "Yes. The same names and genders produce the same restored result." },
      },
      {
        q: { ko: "실제 궁합으로 봐도 되나요?", en: "Is this real relationship advice?" },
        a: { ko: "아니요. 친구나 연인과 웃으며 읽는 창작형 엔터테인먼트 콘텐츠입니다.", en: "No. It is a fictional entertainment test to enjoy together." },
      },
      {
        q: { ko: "공유 링크에는 무엇이 들어가나요?", en: "What is inside the share link?" },
        a: { ko: "결과를 다시 열기 위한 최소 입력값만 사용하며, 설명에는 원본 쿼리 문자열을 노출하지 않습니다.", en: "It uses only the minimum values needed to restore the result and does not expose the raw query in preview copy." },
      },
    ],
  },
  "friend-match": {
    intro: {
      ko: "Friend Match는 두 사람의 이름과 생년 정보를 바탕으로 친구 사이의 리듬, 거리감, 장난 포인트를 읽어보는 관계 테스트입니다.",
      en: "Friend Match reads the rhythm, distance, and inside-joke energy between two friends from simple inputs.",
    },
    method: {
      ko: "두 사람의 정보를 입력하고 결과 카드의 점수, 관계 키워드, 한 줄 설명을 함께 확인하세요.",
      en: "Enter both people, then compare the score, relationship keywords, and short explanation on the result card.",
    },
    result: {
      ko: "결과는 친구 관계를 평가하기보다, 서로가 이미 알고 있는 분위기를 말로 정리해 대화하기 쉽게 만드는 콘텐츠입니다.",
      en: "The result is meant to describe the vibe you already feel, not to grade a friendship.",
    },
    share: {
      ko: "카카오톡 공유가 가능하면 그대로 사용하고, 아니면 링크 복사 방식으로 같은 결과를 보낼 수 있습니다.",
      en: "If KakaoTalk sharing is available it is used; otherwise the same result can be sent with a copied link.",
    },
    faq: [
      {
        q: { ko: "친구가 아니어도 할 수 있나요?", en: "Can I use it with someone who is not a close friend?" },
        a: { ko: "가능합니다. 가족, 동료, 썸 상대처럼 비교해보고 싶은 두 사람이라면 가볍게 즐길 수 있습니다.", en: "Yes. It works for any two people you want to compare lightly." },
      },
      {
        q: { ko: "점수가 낮으면 관계가 나쁜 건가요?", en: "Does a low score mean the relationship is bad?" },
        a: { ko: "아닙니다. 점수는 이야기 장치이며 실제 관계의 좋고 나쁨을 판단하지 않습니다.", en: "No. The score is a storytelling device, not a real judgment." },
      },
    ],
  },
  saju: {
    intro: {
      ko: "사주 리딩은 전통 명리 콘셉트를 현대적인 카드 형식으로 풀어, 나의 기질과 균형을 가볍게 읽어보는 운세형 콘텐츠입니다.",
      en: "Saju Reading turns a traditional East Asian astrology concept into a modern card-style personality reading.",
    },
    method: {
      ko: "입력 화면에서 요청하는 정보를 넣고, 오행의 균형과 키워드별 설명을 차례대로 읽어보세요.",
      en: "Enter the requested details, then read the element balance and keyword-based interpretation.",
    },
    result: {
      ko: "이 결과는 자기이해를 돕는 엔터테인먼트이며 실제 운명, 건강, 직업, 투자 판단을 대신하지 않습니다.",
      en: "This is entertainment for reflection and does not replace real decisions about life, health, work, or money.",
    },
    share: {
      ko: "친구와 서로의 오행 키워드를 비교하면 닮은 점과 다른 점을 자연스럽게 이야기할 수 있습니다.",
      en: "Comparing element keywords with friends makes the result easier to discuss.",
    },
    faq: [
      {
        q: { ko: "정확한 사주 상담인가요?", en: "Is this a professional Saju consultation?" },
        a: { ko: "아니요. 전통 콘셉트를 빌린 재미용 웹 콘텐츠입니다.", en: "No. It is a web entertainment experience inspired by the concept." },
      },
      {
        q: { ko: "결과를 저장할 수 있나요?", en: "Can I save the result?" },
        a: { ko: "결과 카드 저장 기능이 제공되는 화면에서는 이미지로 저장해 다시 볼 수 있습니다.", en: "Where supported, you can save the result card as an image." },
      },
    ],
  },
  "kdrama-couple": {
    intro: {
      ko: "K-drama Couple은 두 사람의 이름과 설정을 넣어 드라마 제목, 장르, 시청자 반응처럼 읽히는 커플 결과를 만드는 테스트입니다.",
      en: "K-Drama Couple turns two people into a fictional drama title, genre, chemistry score, and viewer reaction.",
    },
    method: {
      ko: "두 주인공 정보를 입력하면 장르와 케미 점수, 줄거리 포인트, 공유 멘트가 한 번에 만들어집니다.",
      en: "Enter both leads to generate a genre, chemistry score, plot hook, and shareable summary.",
    },
    result: {
      ko: "결과는 실제 연애 판단이 아니라, K-drama 문법으로 두 사람의 케미를 상상해보는 창작형 콘텐츠입니다.",
      en: "The result is fictional entertainment that imagines chemistry through K-drama tropes.",
    },
    share: {
      ko: "친구에게 보내면 상대가 우리 조합을 드라마처럼 읽어볼 수 있어 반응을 보기 좋습니다.",
      en: "It is built to send to someone so they can read the pairing like a drama pitch.",
    },
    faq: [
      {
        q: { ko: "실명 대신 별명을 써도 되나요?", en: "Can I use nicknames?" },
        a: { ko: "네. 별명이나 이니셜을 넣어도 결과를 즐길 수 있습니다.", en: "Yes. Nicknames or initials work fine." },
      },
      {
        q: { ko: "결과는 랜덤인가요?", en: "Is the result random?" },
        a: { ko: "입력값을 바탕으로 일관된 결과가 나오도록 구성되어 있습니다.", en: "It is generated from the inputs so the same setup stays consistent." },
      },
    ],
  },
  joseon: {
    intro: {
      ko: "Joseon Life는 이름을 넣어 조선시대 속 나의 신분, 하루, 운명 키워드를 짧은 이야기처럼 읽어보는 세계관형 테스트입니다.",
      en: "Joseon Life turns your name into a short world-building result about your role, daily life, and destiny in old Korea.",
    },
    method: {
      ko: "이름을 입력하고 결과 화면에서 신분, 성격 키워드, 조선식 하루 설명을 순서대로 읽어보세요.",
      en: "Enter a name, then read the role, personality keywords, and old-Korea daily-life description in order.",
    },
    result: {
      ko: "결과는 역사 고증보다 가볍게 즐기는 상상 콘텐츠에 가깝습니다. 실제 인물 평가가 아니라 조선시대 콘셉트로 보는 캐릭터 카드입니다.",
      en: "The result is a playful character card, not a historical or personal judgment.",
    },
    share: {
      ko: "친구와 서로의 조선시대 신분을 비교하면 누가 궁궐형인지, 누가 장터형인지 자연스럽게 이야기거리가 됩니다.",
      en: "It is fun to compare roles with friends and imagine who belongs in the palace, market, or scholar's room.",
    },
    faq: [
      qa("실제 조선시대 신분과 관련이 있나요?", "Is it historically accurate?", "아니요. 조선시대 분위기를 빌린 창작형 엔터테인먼트 테스트입니다.", "No. It is a fictional entertainment test inspired by the Joseon setting."),
      qa("별명으로 해도 되나요?", "Can I use a nickname?", "네. 별명, 영어 이름, 짧은 닉네임으로도 결과를 볼 수 있습니다.", "Yes. Nicknames, English names, and short handles work too."),
      qa("결과가 매번 바뀌나요?", "Does the result change every time?", "같은 이름이면 같은 흐름의 결과가 나오도록 구성되어 있습니다.", "The same name is designed to produce the same result flow."),
    ],
  },
  "korean-name": {
    intro: {
      ko: "Korean Name Generator는 영어 이름이나 닉네임을 바탕으로 한국식 이름과 그 이름이 주는 분위기를 제안하는 가벼운 이름 콘텐츠입니다.",
      en: "Korean Name Generator suggests a Korean-style name and a short vibe reading from your name or nickname.",
    },
    method: {
      ko: "이름을 입력하면 한국식 이름, 발음 느낌, 어울리는 이미지가 카드 형태로 정리됩니다.",
      en: "Enter a name to get a Korean-style name, pronunciation vibe, and a short image description.",
    },
    result: {
      ko: "결과는 공식 번역이나 법적 이름 추천이 아니라, 한국어 이름의 분위기를 재미있게 탐색하는 콘텐츠입니다.",
      en: "The result is not an official translation or legal naming suggestion; it is a fun way to explore Korean-name vibes.",
    },
    share: {
      ko: "친구에게 보내면 서로에게 어울리는 한국식 이름을 골라주거나, 결과 이미지로 가볍게 대화할 수 있습니다.",
      en: "Sharing makes it easy to compare Korean-style names and talk about which one feels right.",
    },
    faq: [
      qa("실제 개명에 써도 되나요?", "Can I use it for an official name change?", "아니요. 재미용 이름 제안이며 공식 번역이나 작명 상담을 대신하지 않습니다.", "No. It is a playful suggestion and does not replace official translation or naming advice."),
      qa("한국어를 몰라도 사용할 수 있나요?", "Can I use it if I do not know Korean?", "네. 결과에는 이름 느낌과 설명이 함께 제공되어 가볍게 읽을 수 있습니다.", "Yes. The result includes a vibe explanation so it is readable without Korean fluency."),
      qa("이름을 저장하나요?", "Do you store my name?", "페이지에서 결과를 만들기 위한 값으로만 사용되며, 별도의 계정 저장 흐름은 없습니다.", "It is used to create the result on the page and there is no separate account-saving flow."),
    ],
  },
  "mbti-depth": {
    intro: {
      ko: "MBTI Depth는 익숙한 MBTI 코드를 짧은 질문 흐름으로 다시 읽고, 강점과 긴장 지점을 조금 더 깊게 정리해주는 성향 테스트입니다.",
      en: "MBTI Depth revisits familiar MBTI-style patterns with a short question flow and a more detailed personality reading.",
    },
    method: {
      ko: "각 질문에서 평소 나에게 더 가까운 선택지를 고르면 최종 코드, 핵심 태그, 관계와 일상에서 드러나는 특징이 정리됩니다.",
      en: "Choose what feels closest to you, then read the final code, key tag, and everyday behavior notes.",
    },
    result: {
      ko: "결과는 자기 이해를 돕는 엔터테인먼트 해석이며 심리 진단이나 상담을 대신하지 않습니다.",
      en: "The result is entertainment for self-reflection and does not replace psychological diagnosis or counseling.",
    },
    share: {
      ko: "친구와 결과 코드를 비교하면 같은 MBTI라도 어떤 문장이 더 잘 맞는지 이야기하기 좋습니다.",
      en: "Comparing results helps friends talk about which descriptions feel accurate beyond the four-letter code.",
    },
    faq: [
      qa("공식 MBTI 검사인가요?", "Is this an official MBTI assessment?", "아니요. MBTI식 성향 언어를 차용한 재미용 테스트입니다.", "No. It is an entertainment test inspired by MBTI-style language."),
      qa("결과가 마음에 들지 않으면 어떻게 하나요?", "What if the result feels off?", "질문에 다시 답해보거나, 결과 문장 중 맞는 부분만 가볍게 참고해보세요.", "You can retake it or simply keep the parts that feel useful."),
      qa("친구와 비교해도 되나요?", "Can I compare it with friends?", "네. 서로 다른 선택 패턴을 비교하는 용도로 가장 잘 맞습니다.", "Yes. It is especially useful as a light comparison with friends."),
    ],
  },
  kbti: {
    intro: {
      ko: "KBTI는 한국식 밈 감성과 성향 키워드를 섞어 나의 반응 방식, 말투, 관계 스타일을 짧고 가볍게 읽는 테스트입니다.",
      en: "KBTI mixes Korean internet humor with personality keywords to read your reactions, tone, and relationship style.",
    },
    method: {
      ko: "상황별 선택지를 고르면 나와 가까운 KBTI 타입과 대표 문장, 추천 관계 키워드가 정리됩니다.",
      en: "Pick responses to get a KBTI type, signature line, and relationship keywords.",
    },
    result: {
      ko: "결과는 한국식 밈 언어를 활용한 성향 요약입니다. 실제 성격을 단정하지 않고 대화용 키워드로 읽어주세요.",
      en: "The result is a Korean-internet-style summary for conversation, not a fixed definition of your personality.",
    },
    share: {
      ko: "짧은 타입명이 있어 친구에게 보내기 쉽고, 서로의 결과를 놀리듯 비교하기 좋습니다.",
      en: "The short type label makes it easy to send and compare with friends.",
    },
    faq: [
      qa("KBTI는 무엇인가요?", "What is KBTI?", "놀자.fun에서 가볍게 만든 한국식 성향 테스트 콘셉트입니다.", "It is a light Korean-style personality test concept on nolza.fun."),
      qa("결과를 진지하게 믿어야 하나요?", "Should I take it seriously?", "재미와 대화를 위한 콘텐츠로만 봐주세요.", "Treat it as entertainment and a conversation starter."),
      qa("영어로도 볼 수 있나요?", "Is English supported?", "사이트 언어 전환이 가능한 화면에서는 영어 설명도 함께 확인할 수 있습니다.", "Where the page supports language switching, English copy is available too."),
    ],
  },
  attachment: {
    intro: {
      ko: "Attachment Style Test는 관계에서 내가 가까워지는 방식, 불안해지는 순간, 거리감을 조절하는 습관을 돌아보게 하는 심리 테스트입니다.",
      en: "Attachment Style Test helps you reflect on closeness, anxiety, and distance in relationships.",
    },
    method: {
      ko: "연애나 친밀한 관계에서 실제로 자주 하는 반응에 가깝게 답하면 결과 문장이 더 자연스럽게 맞아떨어집니다.",
      en: "Answer based on what you usually do in close relationships for a more useful reading.",
    },
    result: {
      ko: "결과는 애착 유형을 쉽게 설명하기 위한 엔터테인먼트 해석이며 전문 상담이나 진단을 대신하지 않습니다.",
      en: "The result is an accessible entertainment explanation of attachment patterns, not counseling or diagnosis.",
    },
    share: {
      ko: "가까운 친구나 연인과 공유하면 서로가 관계에서 무엇을 편안하게 느끼는지 조심스럽게 이야기해볼 수 있습니다.",
      en: "Sharing can gently start a conversation about what feels safe or difficult in relationships.",
    },
    faq: [
      qa("상담 결과처럼 봐도 되나요?", "Is this a counseling result?", "아니요. 관계 성향을 가볍게 돌아보는 콘텐츠입니다.", "No. It is a light reflection tool, not professional counseling."),
      qa("결과가 불편하면 어떻게 하나요?", "What if the result feels uncomfortable?", "불편한 문장은 내려놓고, 필요하면 신뢰할 수 있는 사람이나 전문가와 이야기해보세요.", "You can set aside uncomfortable parts and talk with someone you trust if needed."),
      qa("반복해서 해도 되나요?", "Can I retake it?", "네. 최근 관계 경험에 따라 답이 달라질 수 있습니다.", "Yes. Your answers may change with recent relationship experiences."),
    ],
  },
  password: {
    intro: {
      ko: "Password Personality는 비밀번호를 만들 때 드러나는 습관을 소재로, 나의 보안 감각과 성격 밈을 연결해보는 짧은 테스트입니다.",
      en: "Password Personality turns password-making habits into a short reading about security instincts and personality memes.",
    },
    method: {
      ko: "실제 비밀번호를 입력하지 말고, 화면이 요구하는 가상의 선택지만 고르세요. 민감한 정보는 넣지 않는 것이 좋습니다.",
      en: "Do not enter a real password. Use the fictional choices on the page and avoid sensitive information.",
    },
    result: {
      ko: "결과는 보안 진단이 아니라 습관을 웃으며 돌아보는 콘텐츠입니다. 실제 비밀번호 관리에는 별도의 보안 원칙을 따르세요.",
      en: "The result is not a security audit; use separate best practices for real password management.",
    },
    share: {
      ko: "결과만 공유하면 실제 비밀번호 없이도 서로의 보안 성향을 가볍게 놀려볼 수 있습니다.",
      en: "Sharing only the result lets friends compare security vibes without exposing real passwords.",
    },
    faq: [
      qa("실제 비밀번호를 넣어도 되나요?", "Should I enter a real password?", "아니요. 실제 비밀번호나 개인정보는 입력하지 마세요.", "No. Never enter real passwords or private information."),
      qa("보안 점검 도구인가요?", "Is this a security checker?", "아니요. 보안 습관을 소재로 한 재미용 테스트입니다.", "No. It is an entertainment test inspired by security habits."),
    ],
  },
  traffic: {
    intro: {
      ko: "Traffic Survival은 복잡한 이동 상황에서 내가 어떤 판단을 하는지 빠르게 확인하는 반응형 미니게임입니다.",
      en: "Traffic Survival is a quick reaction game about how you respond to busy movement and timing situations.",
    },
    method: {
      ko: "화면의 흐름을 보고 안전한 타이밍에 움직이거나 선택하세요. 짧은 플레이 안에서 집중력과 판단 리듬이 드러납니다.",
      en: "Watch the flow and move or choose at the right moment. Short rounds reveal focus and timing rhythm.",
    },
    result: {
      ko: "점수는 운전 능력이나 실제 안전 판단을 평가하지 않습니다. 브라우저 안에서 즐기는 간단한 반응 기록입니다.",
      en: "The score does not evaluate real driving or safety judgment; it is a browser-game record.",
    },
    share: {
      ko: "기록을 공유하면 친구가 바로 같은 상황에 도전할 수 있어 재도전 놀이가 됩니다.",
      en: "Sharing a record makes it easy for friends to try the same challenge.",
    },
    faq: [
      qa("실제 교통 안전 교육인가요?", "Is this real traffic safety training?", "아니요. 교통 상황을 소재로 한 미니게임입니다.", "No. It is a mini game inspired by traffic scenarios."),
      qa("모바일에서도 가능한가요?", "Can I play on mobile?", "네. 모바일 브라우저에서도 짧게 플레이할 수 있도록 구성되어 있습니다.", "Yes. It is designed for short play in mobile browsers too."),
    ],
  },
  ahmolla: {
    intro: {
      ko: "Ahmolla는 선택지가 애매할 때의 마음을 짧은 밈형 테스트로 풀어보는 가벼운 성향 콘텐츠입니다.",
      en: "Ahmolla is a light meme-style test about how you react when choices feel unclear.",
    },
    method: {
      ko: "상황을 보고 가장 먼저 드는 반응을 고르세요. 깊게 고민하기보다 즉흥적인 선택이 결과와 더 잘 맞습니다.",
      en: "Pick the first reaction that comes to mind. Instinctive answers work better than overthinking.",
    },
    result: {
      ko: "결과는 결정력, 회피, 장난기 같은 키워드를 밈처럼 보여주는 요약입니다.",
      en: "The result summarizes decision-making, avoidance, or playful energy as a meme-like reading.",
    },
    share: {
      ko: "친구와 보내면 서로의 '아 몰라' 순간을 비교하며 가볍게 웃을 수 있습니다.",
      en: "Sharing lets friends compare their own 'I don't know' moments.",
    },
    faq: [
      qa("정답이 있나요?", "Are there right answers?", "없습니다. 가장 내 반응에 가까운 선택을 고르면 됩니다.", "No. Just choose what feels closest to your reaction."),
      qa("진지한 성격 테스트인가요?", "Is it a serious personality test?", "아니요. 짧고 가벼운 밈형 엔터테인먼트입니다.", "No. It is a short meme-style entertainment test."),
    ],
  },
  "aqua-fishing": {
    intro: {
      ko: "Aqua Fishing은 물속 분위기에서 타이밍을 맞춰 낚는 브라우저 미니게임입니다. 짧은 플레이 안에 집중과 손맛을 담았습니다.",
      en: "Aqua Fishing is a browser mini game about timing your catch in an underwater mood.",
    },
    method: {
      ko: "화면의 움직임을 보고 적절한 순간에 조작하세요. 처음에는 천천히 감을 잡고, 기록을 갱신하며 플레이하면 좋습니다.",
      en: "Watch the movement and act at the right moment. Start slow, then try to improve your record.",
    },
    result: {
      ko: "기록은 플레이 감각을 비교하기 위한 가벼운 피드백입니다. 실제 낚시 실력과는 관련이 없습니다.",
      en: "Records are light gameplay feedback and are not related to real fishing skill.",
    },
    share: {
      ko: "잡은 기록이나 플레이 감상을 공유하면 친구가 바로 한 판 더 도전하기 쉽습니다.",
      en: "Sharing a record makes it easy for a friend to jump in for one more round.",
    },
    faq: [
      qa("설치가 필요한가요?", "Do I need to install anything?", "아니요. 브라우저에서 바로 실행되는 미니게임입니다.", "No. It runs directly in the browser."),
      qa("조작이 어려우면 어떻게 하나요?", "What if the controls feel hard?", "처음 몇 판은 타이밍을 익히는 용도로 플레이해보세요.", "Use the first few rounds to learn the timing."),
      qa("모바일에서 할 수 있나요?", "Can I play on mobile?", "네. 터치 조작이 가능한 환경을 기준으로도 즐길 수 있습니다.", "Yes. It is playable in touch-friendly environments too."),
    ],
  },
  "salary-melt": {
    intro: {
      ko: "Salary Melt는 월급이 어디로 사라지는지 농담처럼 추적해보는 생활형 미니 콘텐츠입니다.",
      en: "Salary Melt is a light life-simulation piece about where your paycheck seems to disappear.",
    },
    method: {
      ko: "화면에서 묻는 금액이나 소비 상황을 넣고, 어떤 항목이 가장 빠르게 지갑을 녹이는지 확인해보세요.",
      en: "Enter the requested amount or spending situation to see what melts your wallet fastest.",
    },
    result: {
      ko: "결과는 재무 상담이 아니라 소비 습관을 웃으며 돌아보기 위한 가벼운 설명입니다.",
      en: "The result is not financial advice; it is a playful look at spending habits.",
    },
    share: {
      ko: "친구와 공유하면 서로의 월급 소멸 포인트를 비교하며 현실적인 공감을 나눌 수 있습니다.",
      en: "Sharing helps friends compare the very relatable ways money disappears.",
    },
    faq: [
      qa("재테크 조언인가요?", "Is this financial advice?", "아니요. 소비 공감형 엔터테인먼트 콘텐츠입니다.", "No. It is entertainment based on relatable spending patterns."),
      qa("정확한 가계부 기능인가요?", "Is it an exact budgeting tool?", "아닙니다. 실제 예산 관리는 별도 도구를 사용해주세요.", "No. Please use a dedicated tool for real budgeting."),
    ],
  },
  timevalue: {
    intro: {
      ko: "Time Value는 내가 쓰는 시간이 어떤 감정과 가치로 바뀌는지 가볍게 계산해보는 인터랙티브 콘텐츠입니다.",
      en: "Time Value is an interactive piece about what your time turns into emotionally and practically.",
    },
    method: {
      ko: "시간, 선택, 상황을 입력하거나 고르면 결과가 나의 하루 사용 방식을 짧게 정리합니다.",
      en: "Enter or choose time-related details to get a short reading about how you spend a day.",
    },
    result: {
      ko: "결과는 시간 관리 진단이 아니라, 지금의 우선순위를 돌아보게 하는 재미용 해석입니다.",
      en: "The result is not a productivity diagnosis; it is a playful reflection on priorities.",
    },
    share: {
      ko: "친구와 결과를 비교하면 같은 시간을 서로 얼마나 다르게 느끼는지 이야기하기 좋습니다.",
      en: "Sharing helps friends compare how differently the same amount of time can feel.",
    },
    faq: [
      qa("생산성 평가인가요?", "Is this a productivity evaluation?", "아니요. 시간 감각을 소재로 한 가벼운 콘텐츠입니다.", "No. It is a light experience based on time perception."),
      qa("정확한 계산인가요?", "Is the calculation exact?", "실제 회계나 생산성 계산이 아니라 읽기 쉬운 결과를 위한 단순화된 흐름입니다.", "It is simplified for a readable result, not accounting or productivity math."),
    ],
  },
  hangang: {
    intro: {
      ko: "Hangang Mood는 한강의 장면을 빌려 오늘의 기분과 어울리는 분위기를 찾아보는 감성형 콘텐츠입니다.",
      en: "Hangang Mood uses the Han River as a mood setting to find a scene that fits your day.",
    },
    method: {
      ko: "지금의 기분과 가까운 선택을 고르면 한강의 시간대, 장면, 짧은 문장이 결과로 정리됩니다.",
      en: "Choose what matches your mood to get a Han River time, scene, and short line.",
    },
    result: {
      ko: "결과는 감정 진단이 아니라 오늘의 분위기를 가볍게 말로 붙여보는 콘텐츠입니다.",
      en: "The result is not an emotional diagnosis; it is a light label for today's mood.",
    },
    share: {
      ko: "친구와 공유하면 서로의 오늘 분위기를 길게 설명하지 않아도 짧게 전할 수 있습니다.",
      en: "Sharing gives friends a quick way to show today's mood without a long explanation.",
    },
    faq: [
      qa("서울에 살아야 재미있나요?", "Do I need to live in Seoul?", "아니요. 한강은 분위기 장치일 뿐, 누구나 감성 카드처럼 읽을 수 있습니다.", "No. The Han River is just the mood setting and anyone can enjoy it."),
      qa("기분이 안 좋을 때 해도 되나요?", "Can I use it when I feel down?", "가볍게 읽는 콘텐츠로만 봐주세요. 힘든 상태가 계속되면 주변 사람이나 전문가에게 도움을 요청하세요.", "Treat it lightly. If difficult feelings continue, consider talking to someone you trust or a professional."),
    ],
  },
  silence: {
    intro: {
      ko: "Silence Test는 조용한 상황에서 내가 얼마나 오래 버티고, 어떤 감각에 먼저 반응하는지 살펴보는 미니 경험입니다.",
      en: "Silence Test is a mini experience about how you react to quiet moments and subtle tension.",
    },
    method: {
      ko: "화면의 흐름을 따라 조용히 진행해보세요. 빠르게 넘기기보다 잠깐 멈춰 보는 시간이 결과의 핵심입니다.",
      en: "Follow the screen quietly. A short pause matters more than rushing through.",
    },
    result: {
      ko: "결과는 집중력이나 정신 상태를 진단하지 않고, 침묵을 견디는 방식에 대한 짧은 해석을 제공합니다.",
      en: "The result does not diagnose focus or mental state; it offers a short reading about your reaction to silence.",
    },
    share: {
      ko: "같은 조용한 상황을 친구가 어떻게 받아들이는지 비교하면 의외로 다른 반응을 볼 수 있습니다.",
      en: "Sharing lets friends compare surprisingly different reactions to the same quiet setting.",
    },
    faq: [
      qa("소리를 켜야 하나요?", "Do I need sound?", "페이지 안내에 따라 진행하면 되며, 주변이 조용할수록 분위기를 느끼기 좋습니다.", "Follow the page instructions; a quiet environment helps the mood."),
      qa("심리 진단인가요?", "Is this a psychological diagnosis?", "아니요. 짧은 분위기형 웹 콘텐츠입니다.", "No. It is a short mood-based web experience."),
    ],
  },
  stimulation: {
    intro: {
      ko: "Stimulation Test는 자극적인 선택과 차분한 선택 사이에서 내가 어느 쪽으로 끌리는지 가볍게 읽어보는 성향 콘텐츠입니다.",
      en: "Stimulation Test is a light personality piece about whether you lean toward calm or intense choices.",
    },
    method: {
      ko: "상황별로 더 끌리는 반응을 고르면 자극 선호도와 일상에서 나타나는 패턴이 짧게 정리됩니다.",
      en: "Choose the response that draws you in to get a short reading about stimulation preference.",
    },
    result: {
      ko: "결과는 감각 선호를 재미있게 표현한 것이며 건강 상태나 주의력 문제를 판단하지 않습니다.",
      en: "The result is a playful expression of sensory preference, not a health or attention assessment.",
    },
    share: {
      ko: "친구와 결과를 비교하면 누가 새로운 자극을 찾고 누가 안정감을 선호하는지 쉽게 이야기할 수 있습니다.",
      en: "Sharing helps friends compare who seeks novelty and who prefers steadiness.",
    },
    faq: [
      qa("결과가 나를 규정하나요?", "Does the result define me?", "아니요. 순간의 선택을 바탕으로 한 가벼운 요약입니다.", "No. It is a light summary based on momentary choices."),
      qa("의학적 테스트인가요?", "Is this a medical test?", "아닙니다. 건강이나 주의력 관련 판단에는 사용할 수 없습니다.", "No. It should not be used for health or attention-related judgment."),
    ],
  },
  scale: {
    intro: {
      ko: "Scale of Things는 익숙한 사물부터 거대한 세계까지 크기 감각을 눈으로 비교해보는 인터랙티브 탐색 콘텐츠입니다.",
      en: "Scale of Things is an interactive exploration that compares familiar objects with much larger scales.",
    },
    method: {
      ko: "화면의 축을 움직이며 서로 다른 크기의 대상을 살펴보세요. 숫자만 보는 것보다 위치와 비율을 함께 보는 데 초점을 둡니다.",
      en: "Move through the scale and compare objects by position and proportion, not just numbers.",
    },
    result: {
      ko: "이 페이지는 퀴즈 점수보다 시각적 이해를 돕기 위한 콘텐츠입니다. 실제 과학 수업처럼 엄밀한 측정 도구는 아닙니다.",
      en: "This page is built for visual understanding rather than exact scientific measurement.",
    },
    share: {
      ko: "의외로 큰 대상이나 작은 대상을 발견했을 때 친구에게 보내면 같은 장면을 바로 보여줄 수 있습니다.",
      en: "Sharing is useful when you find a surprisingly large or tiny comparison worth showing.",
    },
    faq: [
      qa("정확한 과학 데이터인가요?", "Is the data scientifically exact?", "대표적인 크기 감각을 보여주기 위한 콘텐츠이며 정밀 측정값으로 사용하면 안 됩니다.", "It shows representative scale impressions and should not be used as precise measurement data."),
      qa("어떻게 즐기면 좋나요?", "How should I use it?", "가장 작은 것부터 큰 것까지 천천히 넘기며 예상과 다른 지점을 찾아보세요.", "Move slowly from small to large and notice where your expectations change."),
    ],
  },
  resonance: {
    intro: {
      ko: "Resonance는 공명이라는 과학 개념을 짧은 조작과 시각 효과로 체감해보는 교육형 미니 콘텐츠입니다.",
      en: "Resonance is a short educational mini experience that visualizes the science concept of resonance.",
    },
    method: {
      ko: "화면의 조작을 따라 진폭이 커지는 순간을 관찰하세요. 설명 문단과 함께 보면 개념을 더 쉽게 이해할 수 있습니다.",
      en: "Use the on-screen controls and watch the amplitude grow, then read the explanation for context.",
    },
    result: {
      ko: "결과나 수치는 공명 개념을 쉽게 보여주기 위한 단순화된 표현입니다. 전문 실험 데이터로 보지는 말아주세요.",
      en: "The values are simplified to explain the concept and are not professional experimental data.",
    },
    share: {
      ko: "직관적인 움직임이 있어 과학 개념을 친구에게 짧게 보여주거나 대화 소재로 보내기 좋습니다.",
      en: "The motion makes the concept easy to show to a friend as a quick science conversation starter.",
    },
    faq: [
      qa("물리 수업 자료로 써도 되나요?", "Can I use it as physics class material?", "개념 소개용으로는 참고할 수 있지만 정밀한 수업 자료나 실험값은 아닙니다.", "It can introduce the concept, but it is not precise class or lab material."),
      qa("결과가 왜 크게 흔들리나요?", "Why does it shake more?", "특정 리듬이 맞을 때 에너지가 쌓이는 공명 느낌을 시각적으로 표현한 것입니다.", "It visualizes the idea that energy builds when the rhythm matches the natural frequency."),
    ],
  },
  rewind: {
    intro: {
      ko: "Rewind는 여러 시대와 장면을 넘기며 과거의 분위기를 짧게 체험하는 타임슬립형 콘텐츠입니다.",
      en: "Rewind is a time-jump experience where you move through short scenes from different eras.",
    },
    method: {
      ko: "되감기 버튼을 누르며 시대가 바뀌는 장면과 문장을 읽어보세요. 빠르게 넘겨도 좋고 마음에 드는 시대에 멈춰도 좋습니다.",
      en: "Use the rewind action to move through eras, reading each scene as it appears.",
    },
    result: {
      ko: "결과는 역사 교과서가 아니라 시대 분위기를 압축한 짧은 웹 콘텐츠입니다.",
      en: "The result is not a history textbook; it is a compact mood-based web experience.",
    },
    share: {
      ko: "마음에 드는 시대나 장면을 발견하면 친구에게 보내 같은 분위기를 함께 이야기할 수 있습니다.",
      en: "Sharing a favorite era or scene lets friends talk about the same mood.",
    },
    faq: [
      qa("역사적으로 정확한가요?", "Is it historically exact?", "시대의 분위기를 가볍게 보여주는 콘텐츠이며 세부 고증은 단순화되어 있습니다.", "It lightly conveys era moods and simplifies historical detail."),
      qa("모든 장면을 봐야 하나요?", "Do I need to see every scene?", "아니요. 짧게 넘기며 마음에 드는 장면만 즐겨도 됩니다.", "No. You can skim and enjoy only the scenes you like."),
    ],
  },
  "korean-pronunciation": {
    intro: {
      ko: "Korean Pronunciation은 한국어 발음의 느낌을 짧은 예시와 함께 확인하는 언어 놀이형 콘텐츠입니다.",
      en: "Korean Pronunciation is a language-play page for exploring the feel of Korean sounds through short examples.",
    },
    method: {
      ko: "화면의 단어나 안내를 따라 읽어보고, 어떤 소리가 어렵거나 재미있게 느껴지는지 확인해보세요.",
      en: "Follow the words or prompts on the page and notice which sounds feel tricky or fun.",
    },
    result: {
      ko: "결과는 전문 발음 평가가 아니라 한국어 소리를 친근하게 접하기 위한 콘텐츠입니다.",
      en: "The result is not a professional pronunciation evaluation; it is a friendly introduction to Korean sounds.",
    },
    share: {
      ko: "친구와 공유하면 서로 어려워하는 발음이나 재미있는 소리를 비교해볼 수 있습니다.",
      en: "Sharing helps friends compare which sounds feel difficult or amusing.",
    },
    faq: [
      qa("한국어 수업을 대신하나요?", "Does this replace Korean lessons?", "아니요. 학습 보조용으로 가볍게 즐기는 콘텐츠입니다.", "No. It is a light companion for language curiosity."),
      qa("발음을 녹음하나요?", "Does it record my voice?", "페이지가 별도로 요청하지 않는 한 음성 저장 기능은 사용하지 않습니다.", "Unless the page explicitly asks, it does not use a voice-saving flow."),
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
      sub: isTest ? "짧게 답하고 결과를 읽는 테스트" : "브라우저에서 바로 즐기는 짧은 콘텐츠",
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
  const koTitle = game.ko.title;
  const enTitle = game.en.title;
  const koType = TYPE_LABEL[kind]?.ko ?? DEFAULT_TYPE_LABEL.ko;
  const enType = TYPE_LABEL[kind]?.en ?? DEFAULT_TYPE_LABEL.en;
  return {
    ko: `${koTitle}는 "${game.ko.sub}"를 주제로 만든 ${koType}입니다. 짧게 시작할 수 있지만 결과를 읽고 비교할 수 있도록 설명과 맥락을 함께 제공합니다.`,
    en: `${enTitle} is a ${enType} built around "${game.en.sub}". It is quick to start, but includes context so the result is readable and shareable.`,
  };
}

function defaultFaq(game: ContentGame, kind: ContentType): ContentOverride["faq"] {
  const isGame = kind === "game";
  const isCompatibility = kind === "compatibility";
  return [
    {
      q: {
        ko: `${game.ko.title}는 무료인가요?`,
        en: `Is ${game.en.title} free to use?`,
      },
      a: {
        ko: "네. 별도 설치 없이 브라우저에서 바로 이용할 수 있습니다.",
        en: "Yes. You can use it directly in the browser without installation.",
      },
    },
    {
      q: {
        ko: isGame ? "점수는 무엇을 의미하나요?" : "결과는 얼마나 진지하게 봐야 하나요?",
        en: isGame ? "What does the score mean?" : "How seriously should I take the result?",
      },
      a: {
        ko: isGame
          ? "점수는 플레이 기록을 비교하기 위한 가벼운 기준이며 실력이나 능력을 단정하지 않습니다."
          : "결과는 재미와 자기 성찰을 위한 해석이며 전문적인 진단이나 조언을 대신하지 않습니다.",
        en: isGame
          ? "The score is a light comparison marker and does not define your actual ability."
          : "The result is for fun and reflection, not a professional diagnosis or advice.",
      },
    },
    {
      q: {
        ko: isCompatibility ? "결과를 상대에게 보내도 되나요?" : "결과를 친구와 공유해도 되나요?",
        en: isCompatibility ? "Can I send the result to the other person?" : "Can I share the result with friends?",
      },
      a: {
        ko: "네. 공유 버튼이나 링크 복사 기능이 있는 페이지에서는 같은 결과 또는 테스트 페이지를 쉽게 보낼 수 있습니다.",
        en: "Yes. Pages with a share or copy-link button make it easy to send the result or test page.",
      },
    },
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
            <h3>{t("플레이 방법", "How to play")}</h3>
            <p>{t(method.ko, method.en)}</p>
          </section>
          <section>
            <h3>{t("결과 읽는 법", "How to read the result")}</h3>
            <p>{t(result.ko, result.en)}</p>
          </section>
          <section>
            <h3>{t("공유하면 재미있는 이유", "Why it is shareable")}</h3>
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
            <h3>{t("관련 테스트 추천", "Related picks")}</h3>
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
