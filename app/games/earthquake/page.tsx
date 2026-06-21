"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Level = {
  mag: number;
  title: { ko: string; en: string };
  feel: { ko: string; en: string };
  damage: { ko: string; en: string };
  emoji: string;
  color: string;
};

const LEVELS: Level[] = [
  { mag: 1, title: { ko: "거의 못 느낌", en: "Barely felt" }, feel: { ko: "지진계만 감지", en: "Detected only by seismographs" }, damage: { ko: "없음", en: "None" }, emoji: "🌳", color: "#34C759" },
  { mag: 2, title: { ko: "민감한 사람만", en: "Felt only by the sensitive" }, feel: { ko: "조용한 실내에서 미약하게", en: "Faintly, in quiet indoor settings" }, damage: { ko: "없음", en: "None" }, emoji: "🌳", color: "#34C759" },
  { mag: 3, title: { ko: "트럭 지나가는 느낌", en: "Like a truck passing by" }, feel: { ko: "실내 정지 중인 사람만 느낌", en: "Felt only by people at rest indoors" }, damage: { ko: "거의 없음", en: "Almost none" }, emoji: "🚚", color: "#34C759" },
  { mag: 4, title: { ko: "분명히 흔들림", en: "Clearly shaking" }, feel: { ko: "그릇·문이 덜그덕거림", en: "Dishes and doors rattle" }, damage: { ko: "경미", en: "Minor" }, emoji: "🚪", color: "#FFD60A" },
  { mag: 5, title: { ko: "물건이 떨어짐", en: "Objects fall" }, feel: { ko: "선반 물건 떨어지고 액자 흔들", en: "Items fall off shelves, picture frames sway" }, damage: { ko: "약한 균열", en: "Light cracks" }, emoji: "📚", color: "#FFD60A" },
  { mag: 6, title: { ko: "건물 균열", en: "Buildings crack" }, feel: { ko: "벽에 균열, 무거운 가구 이동", en: "Walls crack, heavy furniture shifts" }, damage: { ko: "오래된 건물 부분 붕괴", en: "Partial collapse of older buildings" }, emoji: "🏠", color: "#FF9500" },
  { mag: 7, title: { ko: "심각한 피해", en: "Severe damage" }, feel: { ko: "내진설계 안 된 건물 붕괴", en: "Non-earthquake-resistant buildings collapse" }, damage: { ko: "광역 피해, 사상자 발생", en: "Widespread damage, casualties" }, emoji: "🏚️", color: "#FF3B30" },
  { mag: 8, title: { ko: "재앙급", en: "Catastrophic" }, feel: { ko: "지반 단열, 도로 균열", en: "Ground ruptures, roads crack open" }, damage: { ko: "도시 단위 피해", en: "City-wide devastation" }, emoji: "💥", color: "#FF3B30" },
  { mag: 9, title: { ko: "극단적 재앙", en: "Extreme catastrophe" }, feel: { ko: "지면이 물결치고 모든 게 무너짐", en: "The ground ripples and everything collapses" }, damage: { ko: "수십만 명 사상 가능", en: "Hundreds of thousands of casualties possible" }, emoji: "🌪️", color: "#FF3B30" },
];

type HistoryEntry = {
  year: number;
  mag: number;
  place: { ko: string; en: string };
  note: { ko: string; en: string };
};

const KOREAN_HISTORY: HistoryEntry[] = [
  { year: 2016, mag: 5.8, place: { ko: "경주", en: "Gyeongju" }, note: { ko: "기상청 관측 사상 최대", en: "Largest in KMA observation history" } },
  { year: 2017, mag: 5.4, place: { ko: "포항", en: "Pohang" }, note: { ko: "주택 1500여 가구 피해", en: "Over 1,500 homes damaged" } },
  { year: 2024, mag: 4.8, place: { ko: "전북 부안", en: "Buan, North Jeolla" }, note: { ko: "최근 발생", en: "Recent occurrence" } },
  { year: 1978, mag: 5.0, place: { ko: "충북 속리산", en: "Mt. Songnisan, North Chungcheong" }, note: { ko: "근현대 최초 관측", en: "First modern instrumental observation" } },
];

export default function EarthquakeGame() {
  const { t, locale } = useLocale();
  const [mag, setMag] = useState(5.0);
  const [copied, setCopied] = useState(false);

  const level = useMemo(() => {
    const idx = Math.min(LEVELS.length - 1, Math.floor(mag - 1));
    return LEVELS[Math.max(0, idx)];
  }, [mag]);

  const seoulImpact = useMemo(() => {
    if (mag < 4) return t("거의 영향 없음", "Almost no impact");
    if (mag < 5) return t("건물이 흔들리는 정도, 큰 피해 없음", "Buildings sway, but no major damage");
    if (mag < 6) return t("유리창 깨짐, 내진 미설계 건물 일부 손상", "Windows shatter, some non-earthquake-resistant buildings damaged");
    if (mag < 7) return t("오래된 건물 붕괴 가능, 인명 피해 우려", "Older buildings may collapse; casualties feared");
    if (mag < 8) return t("수도권 광역 피해, 대규모 인명 피해", "Region-wide damage across the capital area, mass casualties");
    return t("서울이 마비됩니다. 상상하기 힘든 재앙급", "Seoul is paralyzed — catastrophe beyond imagination");
  }, [mag, locale]);

  const handleShare = async () => {
    const text = t(
      `규모 ${mag.toFixed(1)} 지진: ${level.title.ko}. 서울에 발생한다면 → ${seoulImpact} | nolza.fun/games/earthquake`,
      `Magnitude ${mag.toFixed(1)} earthquake: ${level.title.en}. If it struck Seoul → ${seoulImpact} | nolza.fun/games/earthquake`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shake = mag >= 5;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("지진 규모 ", "Feel an ")}
            <span className="text-accent">{t("체감", "earthquake")}</span>
            {t("하기", "'s magnitude")}
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "슬라이더로 규모를 조절해보세요. 한국 발생 이력과 비교해드려요.",
              "Adjust the magnitude with the slider. We'll compare it to Korea's earthquake history.",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">{t("규모 (Magnitude)", "Magnitude")}</div>
          <div
            className="mt-2 text-7xl font-black tabular-nums md:text-8xl"
            style={{ color: level.color }}
          >
            {mag.toFixed(1)}
          </div>
          <input
            type="range"
            min={1}
            max={9}
            step={0.1}
            value={mag}
            onChange={(e) => setMag(Number(e.target.value))}
            className="mt-4 w-full accent-[#FF3B30]"
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>1.0</span>
            <span>9.0</span>
          </div>
        </div>

        <div
          className={`mt-6 rounded-2xl border p-6 md:p-8 ${shake ? "animate-pulse" : ""}`}
          style={{ borderColor: level.color, backgroundColor: `${level.color}15` }}
        >
          <div className="text-7xl md:text-8xl">{level.emoji}</div>
          <div className="mt-3 text-2xl font-black md:text-4xl">{t(level.title.ko, level.title.en)}</div>
          <div className="mt-3 text-sm text-gray-300 md:text-base">
            <div>
              <span className="text-gray-500">{t("느낌:", "Feel:")}</span> {t(level.feel.ko, level.feel.en)}
            </div>
            <div className="mt-1">
              <span className="text-gray-500">{t("피해:", "Damage:")}</span> {t(level.damage.ko, level.damage.en)}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8">
          <div className="text-xs text-accent">{t("서울에서 발생한다면? 🏙️", "What if it struck Seoul? 🏙️")}</div>
          <p className="mt-2 text-base text-gray-300 md:text-lg">{seoulImpact}</p>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">{t("한국 지진 발생 이력", "Korea's earthquake history")}</div>
          <ul className="mt-3 space-y-2">
            {KOREAN_HISTORY.map((h) => {
              const isClose = Math.abs(h.mag - mag) < 0.3;
              return (
                <li
                  key={`${h.year}-${h.place.ko}`}
                  className={`rounded-xl border px-4 py-3 ${
                    isClose ? "border-accent bg-accent/10" : "border-border bg-bg"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">
                      {h.year} · {t(h.place.ko, h.place.en)}
                    </span>
                    <span className="font-mono tabular-nums text-accent">
                      M{h.mag}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{t(h.note.ko, h.note.en)}</div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            {copied ? t("✓ 복사됐어요", "✓ COPIED") : t("📋 친구에게 공유하기", "📋 Share with a friend")}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
