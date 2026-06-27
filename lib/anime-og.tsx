import { ImageResponse } from "next/og";
import { getAnimeResult, type AnimeTestConfig } from "@/lib/anime-test";

// 캐릭터 테스트 공유 카드(1200x630) — 텍스트 + 시그니처색 + 이모지(twemoji)만. 저작권 이미지 0개.
const SIZE = { width: 1200, height: 630 };
const OPTS = { ...SIZE, emoji: "twemoji" as const };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun";

export function animeDefaultOg(config: AnimeTestConfig, lang: "ko" | "en" = "ko"): ImageResponse {
  const pick = (t: { ko: string; en: string }) => t[lang];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", background: config.ogBg, color: "#fff", fontFamily: "Noto Sans KR, sans-serif", padding: "60px 76px" }}>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 3, color: config.accent }}>{config.ogKicker}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 64, fontWeight: 900, lineHeight: 1.04, maxWidth: 1000, color: "#ffffff" }}>{pick(config.title)}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.86)", maxWidth: 940 }}>{pick(config.subtitle)}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 26, maxWidth: 1010 }}>
          {config.results.map((r) => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 7, border: `1px solid ${r.color}`, background: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "6px 13px", borderRadius: 999, fontSize: 21, fontWeight: 800 }}>
              <span>{r.emoji}</span>
              <span>{pick(r.name)}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 80, bottom: 44, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
      </div>
    ),
    OPTS,
  );
}

export function animeResultOg(config: AnimeTestConfig, key: string, lang: "ko" | "en" = "ko"): ImageResponse {
  const r = getAnimeResult(config, key);
  const pick = (t: { ko: string; en: string }) => t[lang];
  if (!r) return animeDefaultOg(config, lang);
  const photo = `${SITE}/images/tests/${config.testId}/${r.key}.jpg`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: config.ogBg, color: "#ffffff", fontFamily: "Noto Sans KR, sans-serif", padding: "0 72px" }}>
        {/* 캐릭터 사진 */}
        <div style={{ display: "flex", width: 430, height: 430, borderRadius: 30, overflow: "hidden", border: `8px solid ${r.color}`, boxShadow: "0 24px 64px rgba(0,0,0,0.45)", flexShrink: 0 }}>
          <img src={photo} width={430} height={430} style={{ width: 430, height: 430, objectFit: "cover", borderRadius: 22 }} />
        </div>
        {/* 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 58, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 900, letterSpacing: 2, color: config.accent }}>{pick(config.eyebrow)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
            <div style={{ display: "flex", fontSize: 72, lineHeight: 1 }}>{r.emoji}</div>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 900, lineHeight: 1.04, color: r.color, maxWidth: 470 }}>{pick(r.name)}</div>
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.92)", maxWidth: 540 }}>{pick(r.oneLiner)}</div>
        </div>
        {/* 워터마크 */}
        <div style={{ position: "absolute", right: 64, bottom: 38, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
          <div style={{ display: "flex", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>{lang === "en" ? "Unofficial fan content" : "비공식 팬 콘텐츠"}</div>
        </div>
      </div>
    ),
    OPTS,
  );
}
