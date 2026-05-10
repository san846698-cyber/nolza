"use client";

import Link from "next/link";
import { useState } from "react";

const MBTI_LIST = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

type Compat = {
  best: { type: string; reason: string };
  worst: { type: string; reason: string };
  work: { type: string; reason: string };
  friend: { type: string; reason: string };
  famous: string[];
};

const DATA: Record<string, Compat> = {
  INTJ: { best: { type: "ENFP", reason: "차가운 두뇌와 따뜻한 감성의 조화" }, worst: { type: "ESFP", reason: "체계 vs 즉흥의 충돌" }, work: { type: "INTP", reason: "전략과 분석의 시너지" }, friend: { type: "ENTP", reason: "지적 토론 파트너" }, famous: ["일론 머스크","뉴턴"] },
  INTP: { best: { type: "ENTJ", reason: "아이디어 → 실행으로" }, worst: { type: "ESFJ", reason: "감성 vs 논리 충돌" }, work: { type: "INTJ", reason: "심도 깊은 분석 콜라보" }, friend: { type: "INTP", reason: "끝없는 가설 토론" }, famous: ["아인슈타인","빌 게이츠"] },
  ENTJ: { best: { type: "INTP", reason: "비전과 분석의 결합" }, worst: { type: "ISFP", reason: "통제 vs 자유" }, work: { type: "ENTP", reason: "리더 + 혁신가" }, friend: { type: "ENTJ", reason: "비슷한 에너지" }, famous: ["스티브 잡스","나폴레옹"] },
  ENTP: { best: { type: "INFJ", reason: "혁신가 + 통찰가" }, worst: { type: "ISFJ", reason: "혁신 vs 안정" }, work: { type: "INTJ", reason: "아이디어 → 실행" }, friend: { type: "ENFP", reason: "끊임없는 자극" }, famous: ["레오나르도 다빈치"] },
  INFJ: { best: { type: "ENTP", reason: "조용한 깊이 + 자극" }, worst: { type: "ESTP", reason: "내면 vs 외향 액션" }, work: { type: "INFP", reason: "가치 공유" }, friend: { type: "INFJ", reason: "말 안 해도 통함" }, famous: ["간디","마틴 루터 킹"] },
  INFP: { best: { type: "ENFJ", reason: "이상주의자들의 만남" }, worst: { type: "ESTJ", reason: "감성 vs 규율" }, work: { type: "INFJ", reason: "조용한 시너지" }, friend: { type: "ENFP", reason: "공감 + 자유" }, famous: ["윌리엄 셰익스피어"] },
  ENFJ: { best: { type: "INFP", reason: "리더 + 영감의 조합" }, worst: { type: "ISTP", reason: "감성 vs 실용" }, work: { type: "ENFP", reason: "팀의 분위기 메이커" }, friend: { type: "INFJ", reason: "마음을 알아줌" }, famous: ["오바마","오프라 윈프리"] },
  ENFP: { best: { type: "INTJ", reason: "발산 + 수렴의 균형" }, worst: { type: "ISTJ", reason: "자유 vs 규칙" }, work: { type: "ENFJ", reason: "에너지 폭발" }, friend: { type: "ENTP", reason: "함께 있으면 신남" }, famous: ["월트 디즈니"] },
  ISTJ: { best: { type: "ESFP", reason: "원칙 + 즉흥의 보완" }, worst: { type: "ENFP", reason: "규칙 vs 자유" }, work: { type: "ISTJ", reason: "체계적 협력" }, friend: { type: "ISFJ", reason: "조용한 신뢰" }, famous: ["조지 워싱턴"] },
  ISFJ: { best: { type: "ESTP", reason: "조심성 + 모험" }, worst: { type: "ENTP", reason: "안정 vs 변화" }, work: { type: "ISTJ", reason: "꼼꼼함의 조합" }, friend: { type: "ESFJ", reason: "서로 챙김" }, famous: ["테레사 수녀"] },
  ESTJ: { best: { type: "ISFP", reason: "지도자 + 예술가" }, worst: { type: "INFP", reason: "효율 vs 감성" }, work: { type: "ESFJ", reason: "조직 운영의 달인들" }, friend: { type: "ESTJ", reason: "비슷한 결" }, famous: ["헨리 포드"] },
  ESFJ: { best: { type: "ISFP", reason: "케어 + 감수성" }, worst: { type: "INTP", reason: "감정 vs 무관심" }, work: { type: "ENFJ", reason: "사람 챙기는 듀오" }, friend: { type: "ESFJ", reason: "친목의 천재들" }, famous: ["테일러 스위프트"] },
  ISTP: { best: { type: "ESFJ", reason: "쿨함 + 따뜻함" }, worst: { type: "ENFJ", reason: "거리감 vs 친밀감" }, work: { type: "INTJ", reason: "기술 + 전략" }, friend: { type: "ISTP", reason: "조용히 같이 있기" }, famous: ["클린트 이스트우드"] },
  ISFP: { best: { type: "ESTJ", reason: "예술 + 추진력" }, worst: { type: "ENTJ", reason: "유연 vs 통제" }, work: { type: "INFP", reason: "감성의 시너지" }, friend: { type: "ESFP", reason: "현재를 즐김" }, famous: ["밥 딜런"] },
  ESTP: { best: { type: "ISFJ", reason: "모험 + 안정" }, worst: { type: "INFJ", reason: "행동 vs 사색" }, work: { type: "ESTJ", reason: "현장 추진력" }, friend: { type: "ESFP", reason: "리얼 텐션" }, famous: ["어니스트 헤밍웨이"] },
  ESFP: { best: { type: "ISTJ", reason: "흥 + 신중함" }, worst: { type: "INTJ", reason: "즉흥 vs 계획" }, work: { type: "ESFJ", reason: "팀 분위기 메이커" }, friend: { type: "ENFP", reason: "에너지 더블" }, famous: ["엘비스 프레슬리"] },
};

export default function MBTICompat() {
  const [mbti, setMbti] = useState<string>("INTJ");
  const [copied, setCopied] = useState(false);
  const data = DATA[mbti];

  const handleShare = async () => {
    const text = `내 MBTI ${mbti}, 찰떡궁합은 ${data.best.type} → nolza.fun/games/mbticompat`;
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
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            MBTI <span className="text-accent">찰떡 궁합</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            내 MBTI를 선택하면 베스트/워스트 + 직장·친구 케이스별 궁합을 알려드려요.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label className="text-sm font-medium text-gray-300">내 MBTI</label>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {MBTI_LIST.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMbti(t)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                  mbti === t
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-bg hover:border-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
            <div className="text-xs text-emerald-300">💖 최고 궁합</div>
            <div className="mt-2 text-3xl font-black tabular-nums">{data.best.type}</div>
            <div className="mt-2 text-sm text-gray-300">{data.best.reason}</div>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
            <div className="text-xs text-accent">⚠️ 최악 궁합</div>
            <div className="mt-2 text-3xl font-black tabular-nums">{data.worst.type}</div>
            <div className="mt-2 text-sm text-gray-300">{data.worst.reason}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-gray-500">💼 직장 궁합</div>
            <div className="mt-2 text-2xl font-black tabular-nums">{data.work.type}</div>
            <div className="mt-2 text-sm text-gray-400">{data.work.reason}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-gray-500">🧑‍🤝‍🧑 친구 궁합</div>
            <div className="mt-2 text-2xl font-black tabular-nums">{data.friend.type}</div>
            <div className="mt-2 text-sm text-gray-400">{data.friend.reason}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 md:col-span-2">
            <div className="text-xs text-gray-500">⭐ 같은 MBTI 유명인</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.famous.map((f) => (
                <span key={f} className="rounded-full border border-border bg-bg px-3 py-1 text-sm">
                  {f}
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
            {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
