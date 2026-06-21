"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Type = "건성" | "지성" | "복합성" | "민감성";

const TYPE_LABEL: Record<Type, { ko: string; en: string }> = {
  건성: { ko: "건성", en: "Dry" },
  지성: { ko: "지성", en: "Oily" },
  복합성: { ko: "복합성", en: "Combination" },
  민감성: { ko: "민감성", en: "Sensitive" },
};

type LocalizedText = { ko: string; en: string };

type Question = {
  q: LocalizedText;
  options: { text: LocalizedText; type: Type }[];
};

const QUESTIONS: Question[] = [
  {
    q: { ko: "Q1. 세안 후 30분 뒤 피부 상태?", en: "Q1. How does your skin feel 30 minutes after cleansing?" },
    options: [
      { text: { ko: "당기고 푸석거림", en: "Tight and flaky" }, type: "건성" },
      { text: { ko: "T존이 번들거림", en: "T-zone gets shiny" }, type: "복합성" },
      { text: { ko: "전체적으로 번들거림", en: "Shiny all over" }, type: "지성" },
      { text: { ko: "붉어짐 / 가려움", en: "Redness / itchiness" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q2. 평소 모공 상태?", en: "Q2. What are your pores usually like?" },
    options: [
      { text: { ko: "거의 안 보임", en: "Barely visible" }, type: "건성" },
      { text: { ko: "T존만 큼", en: "Large only in the T-zone" }, type: "복합성" },
      { text: { ko: "전체적으로 큼", en: "Large all over" }, type: "지성" },
      { text: { ko: "잘 모르겠음", en: "Not sure" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q3. 트러블이 자주 나는 부위?", en: "Q3. Where do breakouts appear most?" },
    options: [
      { text: { ko: "거의 안 남", en: "Almost never" }, type: "건성" },
      { text: { ko: "이마/턱/볼 다양", en: "Forehead, chin, cheeks—varies" }, type: "복합성" },
      { text: { ko: "이마·코·턱 (T존)", en: "Forehead, nose, chin (T-zone)" }, type: "지성" },
      { text: { ko: "볼이 자주 빨개짐", en: "Cheeks often turn red" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q4. 화장이 잘 먹는가?", en: "Q4. Does makeup go on smoothly?" },
    options: [
      { text: { ko: "각질이 들떠요", en: "Dead skin flakes show" }, type: "건성" },
      { text: { ko: "T존만 들뜸", en: "Only the T-zone gets patchy" }, type: "복합성" },
      { text: { ko: "금방 무너짐", en: "It breaks down quickly" }, type: "지성" },
      { text: { ko: "성분에 따라 다름", en: "Depends on the ingredients" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q5. 새 화장품 사용 시?", en: "Q5. When you try a new product?" },
    options: [
      { text: { ko: "별 반응 없음", en: "No real reaction" }, type: "건성" },
      { text: { ko: "가끔 트러블", en: "Occasional breakouts" }, type: "복합성" },
      { text: { ko: "여드름이 잘 남", en: "Acne flares up easily" }, type: "지성" },
      { text: { ko: "따끔거리거나 빨개짐", en: "Stings or turns red" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q6. 계절별 피부 변화?", en: "Q6. How does your skin change with the seasons?" },
    options: [
      { text: { ko: "겨울에 매우 건조", en: "Very dry in winter" }, type: "건성" },
      { text: { ko: "여름엔 지성, 겨울엔 건성", en: "Oily in summer, dry in winter" }, type: "복합성" },
      { text: { ko: "여름 내내 번들번들", en: "Shiny all summer long" }, type: "지성" },
      { text: { ko: "환절기에 매우 예민", en: "Very reactive between seasons" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q7. 표정 주름은?", en: "Q7. What about expression lines?" },
    options: [
      { text: { ko: "잘 보임 (탄력 부족)", en: "Noticeable (lacking elasticity)" }, type: "건성" },
      { text: { ko: "보통", en: "Average" }, type: "복합성" },
      { text: { ko: "거의 없음", en: "Hardly any" }, type: "지성" },
      { text: { ko: "잘 모름", en: "Not sure" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q8. 수분크림 흡수?", en: "Q8. How does moisturizer absorb?" },
    options: [
      { text: { ko: "금방 흡수, 또 발라야 함", en: "Absorbs fast, needs reapplying" }, type: "건성" },
      { text: { ko: "부분에 따라 다름", en: "Varies by area" }, type: "복합성" },
      { text: { ko: "잘 흡수 안 됨", en: "Doesn't absorb well" }, type: "지성" },
      { text: { ko: "성분 보고 신중히 사용", en: "Use carefully, checking ingredients" }, type: "민감성" },
    ],
  },
  {
    q: { ko: "Q9. 자외선 노출 시?", en: "Q9. When exposed to UV/sunlight?" },
    options: [
      { text: { ko: "쉽게 빨개지고 가려움", en: "Reddens and itches easily" }, type: "민감성" },
      { text: { ko: "쉽게 그을림", en: "Tans easily" }, type: "건성" },
      { text: { ko: "기름 분비 늘어남", en: "Oil production increases" }, type: "지성" },
      { text: { ko: "별 변화 없음", en: "Not much change" }, type: "복합성" },
    ],
  },
  {
    q: { ko: "Q10. 피부톤은?", en: "Q10. What's your skin tone like?" },
    options: [
      { text: { ko: "창백한 편", en: "On the pale side" }, type: "건성" },
      { text: { ko: "균일하지 않음", en: "Uneven" }, type: "복합성" },
      { text: { ko: "노르스름 ", en: "Yellowish" }, type: "지성" },
      { text: { ko: "잦은 홍조", en: "Frequent flushing" }, type: "민감성" },
    ],
  },
];

const RECOMMEND: Record<
  Type,
  { celebs: string[]; routine: LocalizedText[]; emoji: string }
> = {
  건성: {
    emoji: "🥀",
    celebs: ["송혜교", "김태희", "수지"],
    routine: [
      { ko: "유분 많은 클렌저 (오일/밀크 타입)", en: "Rich cleanser (oil or milk type)" },
      { ko: "히알루론산 토너 듬뿍", en: "Plenty of hyaluronic acid toner" },
      { ko: "고보습 크림 + 페이스 오일", en: "Deeply hydrating cream + face oil" },
      { ko: "각질 제거는 주 1회 이하", en: "Exfoliate once a week or less" },
    ],
  },
  지성: {
    emoji: "✨",
    celebs: ["전소민", "박명수", "데프콘"],
    routine: [
      { ko: "산뜻한 폼 클렌저, 더블 클렌징 권장", en: "Light foaming cleanser; double cleansing recommended" },
      { ko: "BHA(살리실산) 토너 주 2~3회", en: "BHA (salicylic acid) toner 2–3 times a week" },
      { ko: "젤 타입 수분크림", en: "Gel-type moisturizer" },
      { ko: "유분 컨트롤 마스크팩", en: "Oil-control mask sheets" },
    ],
  },
  복합성: {
    emoji: "🌗",
    celebs: ["이병헌", "유재석", "아이유"],
    routine: [
      { ko: "약산성 클렌저", en: "Mildly acidic cleanser" },
      { ko: "T존엔 BHA, 볼엔 보습 토너", en: "BHA on the T-zone, hydrating toner on cheeks" },
      { ko: "부위별 다른 크림 사용", en: "Use different creams by area" },
      { ko: "주 1~2회 클레이 마스크 (T존만)", en: "Clay mask 1–2 times a week (T-zone only)" },
    ],
  },
  민감성: {
    emoji: "🌸",
    celebs: ["박은빈", "한지민", "지창욱"],
    routine: [
      { ko: "무향·무알콜 클렌저", en: "Fragrance-free, alcohol-free cleanser" },
      { ko: "센텔라/판테놀 진정 토너", en: "Calming toner with centella / panthenol" },
      { ko: "성분 단순한 보습 크림", en: "Moisturizer with a simple ingredient list" },
      { ko: "자극적인 성분(향료, 알코올) 회피", en: "Avoid irritants (fragrance, alcohol)" },
    ],
  },
};

export default function SkinTypeGame() {
  const { t, locale } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Type[]>([]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const counts: Record<Type, number> = {
      건성: 0, 지성: 0, 복합성: 0, 민감성: 0,
    };
    for (const t of answers) counts[t]++;
    const top = (Object.entries(counts) as [Type, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    return { type: top, ...RECOMMEND[top] };
  }, [answers]);

  const answer = (t: Type) => {
    setAnswers((a) => [...a, t]);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleShare = async () => {
    if (!result) return;
    const typeLabel = t(TYPE_LABEL[result.type].ko, TYPE_LABEL[result.type].en);
    const text = t(
      `내 피부타입은 ${typeLabel} ${result.emoji} (비슷한 연예인: ${result.celebs[0]}) → nolza.fun/games/skintype`,
      `My skin type is ${typeLabel} ${result.emoji} (celeb match: ${result.celebs[0]}) → nolza.fun/games/skintype`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to Nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {locale === "ko" ? (
              <>
                내 <span className="text-accent">피부 타입</span>은?
              </>
            ) : (
              <>
                What&apos;s My <span className="text-accent">Skin Type</span>?
              </>
            )}
          </h1>
        </header>

        {!result && step < QUESTIONS.length && (
          <>
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div className="h-full bg-accent transition-[width]" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="text-xs text-gray-500">{step + 1}/{QUESTIONS.length}</div>
              <div className="mt-3 text-xl font-bold md:text-2xl">{t(QUESTIONS[step].q.ko, QUESTIONS[step].q.en)}</div>
              <div className="mt-6 flex flex-col gap-2">
                {QUESTIONS[step].options.map((o, i) => (
                  <button key={i} type="button" onClick={() => answer(o.type)} className="rounded-xl border border-border bg-bg px-4 py-3 text-left text-base hover:border-accent">
                    {t(o.text.ko, o.text.en)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-7xl md:text-8xl">{result.emoji}</div>
              <div className="mt-4 text-xs text-accent">{t("당신의 피부 타입", "Your skin type")}</div>
              <div className="mt-1 text-4xl font-black md:text-6xl">{t(TYPE_LABEL[result.type].ko, TYPE_LABEL[result.type].en)}</div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-bg p-4">
                  <div className="text-xs text-gray-500">{t("비슷한 연예인", "Celeb matches")}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.celebs.map((c) => (
                      <span key={c} className="rounded-full border border-border px-3 py-1 text-sm">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-bg p-4">
                  <div className="text-xs text-gray-500">{t("추천 루틴", "Recommended routine")}</div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    {result.routine.map((r, i) => (
                      <li key={i}>{i + 1}. {t(r.ko, r.en)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                {t("↻ 다시 하기", "↻ Try again")}
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? t("✓ 복사됐어요", "✓ Copied") : t("📋 친구에게 공유하기", "📋 Share with friends")}
              </button>
            </div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to Nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
