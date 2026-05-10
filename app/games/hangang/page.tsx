"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";

type Section = {
  depth: number;
  bg: string;
  title: string;
  emoji: string;
  description: string;
};

const SECTIONS: Section[] = [
  { depth: 0, bg: "#7DC4E0", title: "한강 수면", emoji: "🦆", description: "오리배가 둥둥 떠다닙니다." },
  { depth: 1, bg: "#3D8FBF", title: "수영하는 사람", emoji: "🏊", description: "여름엔 가끔 수영하는 사람이 보입니다." },
  { depth: 3, bg: "#1E5C8E", title: "물고기들", emoji: "🐟", description: "잉어와 붕어가 무리지어 헤엄칩니다." },
  { depth: 5, bg: "#173E68", title: "버려진 자전거", emoji: "🚲", description: "왜 한강에 자전거가 있을까요." },
  { depth: 8, bg: "#0F2A50", title: "한강철교 기둥", emoji: "🏗️", description: "거대한 콘크리트가 어둠 속에." },
  { depth: 12, bg: "#091B3A", title: "메기", emoji: "🐡", description: "1m가 넘는 메기가 지나갑니다." },
  { depth: 15, bg: "#040E25", title: "어둠 시작", emoji: "🌑", description: "햇빛이 거의 닿지 않는 영역." },
  { depth: 20, bg: "#000000", title: "한강 최대 수심", emoji: "🌊", description: "당신은 한강 바닥을 봤습니다." },
];

export default function DeepGame() {
  const [scrollY, setScrollY] = useState(0);
  const [docHeight, setDocHeight] = useState(1);

  useEffect(() => {
    const update = () => {
      const sy = window.scrollY;
      const dh = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollY(sy);
      setDocHeight(dh);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const ratio = Math.min(1, Math.max(0, scrollY / docHeight));
  const currentDepth = -20 * ratio;

  return (
    <main className="relative page-in">
      <Link
        href="/"
        className="back-arrow dark"
        aria-label="home"
        style={{ position: "fixed", color: "rgba(255,255,255,0.85)" }}
      >
        ←
      </Link>

      {/* Fixed horizon line + depth indicator */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-40"
        style={{
          height: 1,
          background: "rgba(255,255,255,0.25)",
        }}
      />
      <div
        className="pointer-events-none fixed left-5 z-40 font-mono"
        style={{
          top: 80,
          fontSize: 15,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.1em",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        }}
      >
        {currentDepth.toFixed(1)}m
      </div>

      {SECTIONS.map((s, idx) => (
        <section
          key={s.depth}
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
          style={{ backgroundColor: s.bg, transition: "background-color 0.6s ease" }}
        >
          {s.depth < 8 && (
            <>
              {Array.from({ length: 7 }).map((_, b) => (
                <span
                  key={b}
                  className="bubble"
                  style={{
                    left: `${5 + b * 13}%`,
                    width: `${6 + (b % 3) * 3}px`,
                    height: `${6 + (b % 3) * 3}px`,
                    animationDelay: `${b * 0.7}s`,
                    animationDuration: `${4 + b * 0.4}s`,
                  }}
                />
              ))}
            </>
          )}

          <div
            className="relative z-10 flex w-full max-w-3xl flex-col gap-12 md:flex-row md:items-center md:justify-between"
            style={{ color: idx === 0 ? "#1a1a1a" : "#fff" }}
          >
            {/* Emoji on left */}
            <div className="text-center md:flex-1">
              <div style={{ fontSize: 96 }}>{s.emoji}</div>
            </div>

            {/* Text on right */}
            <div className="md:flex-1">
              <div
                className="font-mono"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  opacity: 0.6,
                }}
              >
                -{s.depth}m
              </div>
              <h2
                style={{
                  marginTop: 6,
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  lineHeight: 1.6,
                  opacity: 0.85,
                }}
              >
                {s.description}
              </p>
            </div>
          </div>
        </section>
      ))}

      <div style={{ background: "#000", padding: "24px 16px" }}>
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
