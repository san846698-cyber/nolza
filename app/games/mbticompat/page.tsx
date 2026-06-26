"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";

const MBTI_LIST = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

type Loc = { ko: string; en: string };

type Match = { type: string; reason: Loc };

type Compat = {
  best: Match;
  worst: Match;
  work: Match;
  friend: Match;
  famous: Loc[];
};

const DATA: Record<string, Compat> = {
  INTJ: { best: { type: "ENFP", reason: { ko: "차가운 두뇌와 따뜻한 감성의 조화", en: "A cool mind meets a warm heart" } }, worst: { type: "ESFP", reason: { ko: "체계 vs 즉흥의 충돌", en: "Structure clashes with spontaneity" } }, work: { type: "INTP", reason: { ko: "전략과 분석의 시너지", en: "Strategy and analysis in sync" } }, friend: { type: "ENTP", reason: { ko: "지적 토론 파트너", en: "An intellectual debate partner" } }, famous: [{ ko: "일론 머스크", en: "Elon Musk" }, { ko: "뉴턴", en: "Isaac Newton" }] },
  INTP: { best: { type: "ENTJ", reason: { ko: "아이디어 → 실행으로", en: "Ideas turned into action" } }, worst: { type: "ESFJ", reason: { ko: "감성 vs 논리 충돌", en: "Feelings clash with logic" } }, work: { type: "INTJ", reason: { ko: "심도 깊은 분석 콜라보", en: "Deep analytical collaboration" } }, friend: { type: "INTP", reason: { ko: "끝없는 가설 토론", en: "Endless debates over theories" } }, famous: [{ ko: "아인슈타인", en: "Albert Einstein" }, { ko: "빌 게이츠", en: "Bill Gates" }] },
  ENTJ: { best: { type: "INTP", reason: { ko: "비전과 분석의 결합", en: "Vision paired with analysis" } }, worst: { type: "ISFP", reason: { ko: "통제 vs 자유", en: "Control versus freedom" } }, work: { type: "ENTP", reason: { ko: "리더 + 혁신가", en: "A leader plus an innovator" } }, friend: { type: "ENTJ", reason: { ko: "비슷한 에너지", en: "Matching energy levels" } }, famous: [{ ko: "스티브 잡스", en: "Steve Jobs" }, { ko: "나폴레옹", en: "Napoleon" }] },
  ENTP: { best: { type: "INFJ", reason: { ko: "혁신가 + 통찰가", en: "An innovator plus a visionary" } }, worst: { type: "ISFJ", reason: { ko: "혁신 vs 안정", en: "Innovation versus stability" } }, work: { type: "INTJ", reason: { ko: "아이디어 → 실행", en: "Ideas into execution" } }, friend: { type: "ENFP", reason: { ko: "끊임없는 자극", en: "Constant inspiration" } }, famous: [{ ko: "레오나르도 다빈치", en: "Leonardo da Vinci" }] },
  INFJ: { best: { type: "ENTP", reason: { ko: "조용한 깊이 + 자극", en: "Quiet depth meets a spark" } }, worst: { type: "ESTP", reason: { ko: "내면 vs 외향 액션", en: "Inner world versus outward action" } }, work: { type: "INFP", reason: { ko: "가치 공유", en: "Shared values" } }, friend: { type: "INFJ", reason: { ko: "말 안 해도 통함", en: "Understood without a word" } }, famous: [{ ko: "간디", en: "Gandhi" }, { ko: "마틴 루터 킹", en: "Martin Luther King Jr." }] },
  INFP: { best: { type: "ENFJ", reason: { ko: "이상주의자들의 만남", en: "Two idealists meeting" } }, worst: { type: "ESTJ", reason: { ko: "감성 vs 규율", en: "Feelings versus discipline" } }, work: { type: "INFJ", reason: { ko: "조용한 시너지", en: "Quiet synergy" } }, friend: { type: "ENFP", reason: { ko: "공감 + 자유", en: "Empathy and freedom" } }, famous: [{ ko: "윌리엄 셰익스피어", en: "William Shakespeare" }] },
  ENFJ: { best: { type: "INFP", reason: { ko: "리더 + 영감의 조합", en: "A leader plus an inspirer" } }, worst: { type: "ISTP", reason: { ko: "감성 vs 실용", en: "Emotion versus pragmatism" } }, work: { type: "ENFP", reason: { ko: "팀의 분위기 메이커", en: "The team's mood-makers" } }, friend: { type: "INFJ", reason: { ko: "마음을 알아줌", en: "Truly gets your heart" } }, famous: [{ ko: "오바마", en: "Barack Obama" }, { ko: "오프라 윈프리", en: "Oprah Winfrey" }] },
  ENFP: { best: { type: "INTJ", reason: { ko: "발산 + 수렴의 균형", en: "Balancing spark and focus" } }, worst: { type: "ISTJ", reason: { ko: "자유 vs 규칙", en: "Freedom versus rules" } }, work: { type: "ENFJ", reason: { ko: "에너지 폭발", en: "Explosive energy together" } }, friend: { type: "ENTP", reason: { ko: "함께 있으면 신남", en: "Always a blast together" } }, famous: [{ ko: "월트 디즈니", en: "Walt Disney" }] },
  ISTJ: { best: { type: "ESFP", reason: { ko: "원칙 + 즉흥의 보완", en: "Principles and spontaneity balance out" } }, worst: { type: "ENFP", reason: { ko: "규칙 vs 자유", en: "Rules versus freedom" } }, work: { type: "ISTJ", reason: { ko: "체계적 협력", en: "Systematic teamwork" } }, friend: { type: "ISFJ", reason: { ko: "조용한 신뢰", en: "Quiet, steady trust" } }, famous: [{ ko: "조지 워싱턴", en: "George Washington" }] },
  ISFJ: { best: { type: "ESTP", reason: { ko: "조심성 + 모험", en: "Caution paired with adventure" } }, worst: { type: "ENTP", reason: { ko: "안정 vs 변화", en: "Stability versus change" } }, work: { type: "ISTJ", reason: { ko: "꼼꼼함의 조합", en: "A duo of meticulous minds" } }, friend: { type: "ESFJ", reason: { ko: "서로 챙김", en: "Looking out for each other" } }, famous: [{ ko: "테레사 수녀", en: "Mother Teresa" }] },
  ESTJ: { best: { type: "ISFP", reason: { ko: "지도자 + 예술가", en: "A leader plus an artist" } }, worst: { type: "INFP", reason: { ko: "효율 vs 감성", en: "Efficiency versus emotion" } }, work: { type: "ESFJ", reason: { ko: "조직 운영의 달인들", en: "Masters of running an organization" } }, friend: { type: "ESTJ", reason: { ko: "비슷한 결", en: "Cut from the same cloth" } }, famous: [{ ko: "헨리 포드", en: "Henry Ford" }] },
  ESFJ: { best: { type: "ISFP", reason: { ko: "케어 + 감수성", en: "Caring meets sensitivity" } }, worst: { type: "INTP", reason: { ko: "감정 vs 무관심", en: "Emotion versus detachment" } }, work: { type: "ENFJ", reason: { ko: "사람 챙기는 듀오", en: "A people-first duo" } }, friend: { type: "ESFJ", reason: { ko: "친목의 천재들", en: "Geniuses of friendship" } }, famous: [{ ko: "테일러 스위프트", en: "Taylor Swift" }] },
  ISTP: { best: { type: "ESFJ", reason: { ko: "쿨함 + 따뜻함", en: "Cool meets warm" } }, worst: { type: "ENFJ", reason: { ko: "거리감 vs 친밀감", en: "Distance versus closeness" } }, work: { type: "INTJ", reason: { ko: "기술 + 전략", en: "Technical skill plus strategy" } }, friend: { type: "ISTP", reason: { ko: "조용히 같이 있기", en: "Comfortable in silence together" } }, famous: [{ ko: "클린트 이스트우드", en: "Clint Eastwood" }] },
  ISFP: { best: { type: "ESTJ", reason: { ko: "예술 + 추진력", en: "Artistry plus drive" } }, worst: { type: "ENTJ", reason: { ko: "유연 vs 통제", en: "Flexibility versus control" } }, work: { type: "INFP", reason: { ko: "감성의 시너지", en: "A meeting of sensibilities" } }, friend: { type: "ESFP", reason: { ko: "현재를 즐김", en: "Living in the moment" } }, famous: [{ ko: "밥 딜런", en: "Bob Dylan" }] },
  ESTP: { best: { type: "ISFJ", reason: { ko: "모험 + 안정", en: "Adventure meets stability" } }, worst: { type: "INFJ", reason: { ko: "행동 vs 사색", en: "Action versus reflection" } }, work: { type: "ESTJ", reason: { ko: "현장 추진력", en: "Drive on the front line" } }, friend: { type: "ESFP", reason: { ko: "리얼 텐션", en: "Real, lively chemistry" } }, famous: [{ ko: "어니스트 헤밍웨이", en: "Ernest Hemingway" }] },
  ESFP: { best: { type: "ISTJ", reason: { ko: "흥 + 신중함", en: "Fun meets prudence" } }, worst: { type: "INTJ", reason: { ko: "즉흥 vs 계획", en: "Spontaneity versus planning" } }, work: { type: "ESFJ", reason: { ko: "팀 분위기 메이커", en: "The team's mood-makers" } }, friend: { type: "ENFP", reason: { ko: "에너지 더블", en: "Double the energy" } }, famous: [{ ko: "엘비스 프레슬리", en: "Elvis Presley" }] },
};

export default function MBTICompat() {
  const { t, locale } = useLocale();
  const [mbti, setMbti] = useState<string>("INTJ");
  const [copied, setCopied] = useState(false);
  const data = DATA[mbti];

  const handleShare = async () => {
    const text = t(
      `내 MBTI ${mbti}, 찰떡궁합은 ${data.best.type} → nolza.fun/games/mbticompat`,
      `My MBTI is ${mbti}, and my perfect match is ${data.best.type} → nolza.fun/games/mbticompat`,
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
            {t("← nolza 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            MBTI <span className="text-accent">{t("찰떡 궁합", "Perfect Match")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "내 MBTI를 선택하면 베스트/워스트 + 직장·친구 케이스별 궁합을 알려드려요.",
              "Pick your MBTI to see your best and worst matches, plus compatibility for work and friendship.",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label className="text-sm font-medium text-gray-300">{t("내 MBTI", "Your MBTI")}</label>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {MBTI_LIST.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMbti(type)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                  mbti === type
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-bg hover:border-accent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
            <div className="text-xs text-emerald-300">{t("💖 최고 궁합", "💖 Best match")}</div>
            <div className="mt-2 text-3xl font-black tabular-nums">{data.best.type}</div>
            <div className="mt-2 text-sm text-gray-300">{t(data.best.reason.ko, data.best.reason.en)}</div>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
            <div className="text-xs text-accent">{t("⚠️ 최악 궁합", "⚠️ Worst match")}</div>
            <div className="mt-2 text-3xl font-black tabular-nums">{data.worst.type}</div>
            <div className="mt-2 text-sm text-gray-300">{t(data.worst.reason.ko, data.worst.reason.en)}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-gray-500">{t("💼 직장 궁합", "💼 Work match")}</div>
            <div className="mt-2 text-2xl font-black tabular-nums">{data.work.type}</div>
            <div className="mt-2 text-sm text-gray-400">{t(data.work.reason.ko, data.work.reason.en)}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-gray-500">{t("🧑‍🤝‍🧑 친구 궁합", "🧑‍🤝‍🧑 Friend match")}</div>
            <div className="mt-2 text-2xl font-black tabular-nums">{data.friend.type}</div>
            <div className="mt-2 text-sm text-gray-400">{t(data.friend.reason.ko, data.friend.reason.en)}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 md:col-span-2">
            <div className="text-xs text-gray-500">{t("⭐ 같은 MBTI 유명인", "⭐ Famous people with your MBTI")}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.famous.map((f) => (
                <span key={f.en} className="rounded-full border border-border bg-bg px-3 py-1 text-sm">
                  {locale === "ko" ? f.ko : f.en}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            {copied ? t("✓ 복사됐어요", "✓ Copied") : t("📋 친구에게 공유하기", "📋 Share with friends")}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← nolza 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
