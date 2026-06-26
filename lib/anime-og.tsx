import { ImageResponse } from "next/og";
import { getAnimeResult, type AnimeTestConfig } from "@/lib/anime-test";

// 캐릭터 테스트 공유 카드(1200x630) — 텍스트 + 시그니처색 + 이모지(twemoji)만. 저작권 이미지 0개.
const SIZE = { width: 1200, height: 630 };
const OPTS = { ...SIZE, emoji: "twemoji" as const };

export function animeDefaultOg(config: AnimeTestConfig): ImageResponse {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", background: config.ogBg, color: "#fff", fontFamily: "Noto Sans KR, sans-serif", padding: "60px 76px" }}>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 3, color: config.accent }}>{config.ogKicker}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 64, fontWeight: 900, lineHeight: 1.04, maxWidth: 1000, color: "#ffffff" }}>{config.title.ko}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.86)", maxWidth: 940 }}>{config.subtitle.ko}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 26, maxWidth: 1010 }}>
          {config.results.map((r) => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 7, border: `1px solid ${r.color}`, background: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "6px 13px", borderRadius: 999, fontSize: 21, fontWeight: 800 }}>
              <span>{r.emoji}</span>
              <span>{r.name.ko}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 80, bottom: 44, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
      </div>
    ),
    OPTS,
  );
}

export function animeResultOg(config: AnimeTestConfig, key: string): ImageResponse {
  const r = getAnimeResult(config, key);
  if (!r) return animeDefaultOg(config);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: config.ogBg, color: "#ffffff", fontFamily: "Noto Sans KR, sans-serif" }}>
        <div style={{ display: "flex", width: 20, height: "100%", background: r.color }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "64px 72px" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 2, color: config.accent }}>{config.eyebrow.ko}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 14 }}>
            <div style={{ display: "flex", fontSize: 120, lineHeight: 1 }}>{r.emoji}</div>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 900, lineHeight: 1.02, color: r.color }}>{r.name.ko}</div>
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.9)", maxWidth: 940 }}>{r.oneLiner.ko}</div>
          <div style={{ position: "absolute", right: 72, bottom: 44, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
            <div style={{ display: "flex", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>비공식 팬 콘텐츠</div>
          </div>
        </div>
      </div>
    ),
    OPTS,
  );
}
