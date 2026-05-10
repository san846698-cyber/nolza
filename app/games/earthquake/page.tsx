"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Level = { mag: number; title: string; feel: string; damage: string; emoji: string; color: string };

const LEVELS: Level[] = [
  { mag: 1, title: "거의 못 느낌", feel: "지진계만 감지", damage: "없음", emoji: "🌳", color: "#34C759" },
  { mag: 2, title: "민감한 사람만", feel: "조용한 실내에서 미약하게", damage: "없음", emoji: "🌳", color: "#34C759" },
  { mag: 3, title: "트럭 지나가는 느낌", feel: "실내 정지 중인 사람만 느낌", damage: "거의 없음", emoji: "🚚", color: "#34C759" },
  { mag: 4, title: "분명히 흔들림", feel: "그릇·문이 덜그덕거림", damage: "경미", emoji: "🚪", color: "#FFD60A" },
  { mag: 5, title: "물건이 떨어짐", feel: "선반 물건 떨어지고 액자 흔들", damage: "약한 균열", emoji: "📚", color: "#FFD60A" },
  { mag: 6, title: "건물 균열", feel: "벽에 균열, 무거운 가구 이동", damage: "오래된 건물 부분 붕괴", emoji: "🏠", color: "#FF9500" },
  { mag: 7, title: "심각한 피해", feel: "내진설계 안 된 건물 붕괴", damage: "광역 피해, 사상자 발생", emoji: "🏚️", color: "#FF3B30" },
  { mag: 8, title: "재앙급", feel: "지반 단열, 도로 균열", damage: "도시 단위 피해", emoji: "💥", color: "#FF3B30" },
  { mag: 9, title: "극단적 재앙", feel: "지면이 물결치고 모든 게 무너짐", damage: "수십만 명 사상 가능", emoji: "🌪️", color: "#FF3B30" },
];

const KOREAN_HISTORY = [
  { year: 2016, mag: 5.8, place: "경주", note: "기상청 관측 사상 최대" },
  { year: 2017, mag: 5.4, place: "포항", note: "주택 1500여 가구 피해" },
  { year: 2024, mag: 4.8, place: "전북 부안", note: "최근 발생" },
  { year: 1978, mag: 5.0, place: "충북 속리산", note: "근현대 최초 관측" },
];

export default function EarthquakeGame() {
  const [mag, setMag] = useState(5.0);
  const [copied, setCopied] = useState(false);

  const level = useMemo(() => {
    const idx = Math.min(LEVELS.length - 1, Math.floor(mag - 1));
    return LEVELS[Math.max(0, idx)];
  }, [mag]);

  const seoulImpact = useMemo(() => {
    if (mag < 4) return "거의 영향 없음";
    if (mag < 5) return "건물이 흔들리는 정도, 큰 피해 없음";
    if (mag < 6) return "유리창 깨짐, 내진 미설계 건물 일부 손상";
    if (mag < 7) return "오래된 건물 붕괴 가능, 인명 피해 우려";
    if (mag < 8) return "수도권 광역 피해, 대규모 인명 피해";
    return "서울이 마비됩니다. 상상하기 힘든 재앙급";
  }, [mag]);

  const handleShare = async () => {
    const text = `규모 ${mag.toFixed(1)} 지진: ${level.title}. 서울에 발생한다면 → ${seoulImpact} | nolza.fun/games/earthquake`;
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
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            지진 규모 <span className="text-accent">체감</span>하기
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            슬라이더로 규모를 조절해보세요. 한국 발생 이력과 비교해드려요.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">규모 (Magnitude)</div>
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
          <div className="mt-3 text-2xl font-black md:text-4xl">{level.title}</div>
          <div className="mt-3 text-sm text-gray-300 md:text-base">
            <div>
              <span className="text-gray-500">느낌:</span> {level.feel}
            </div>
            <div className="mt-1">
              <span className="text-gray-500">피해:</span> {level.damage}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8">
          <div className="text-xs text-accent">서울에서 발생한다면? 🏙️</div>
          <p className="mt-2 text-base text-gray-300 md:text-lg">{seoulImpact}</p>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">한국 지진 발생 이력</div>
          <ul className="mt-3 space-y-2">
            {KOREAN_HISTORY.map((h) => {
              const isClose = Math.abs(h.mag - mag) < 0.3;
              return (
                <li
                  key={`${h.year}-${h.place}`}
                  className={`rounded-xl border px-4 py-3 ${
                    isClose ? "border-accent bg-accent/10" : "border-border bg-bg"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">
                      {h.year} · {h.place}
                    </span>
                    <span className="font-mono tabular-nums text-accent">
                      M{h.mag}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{h.note}</div>
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
