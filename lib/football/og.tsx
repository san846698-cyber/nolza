import { ImageResponse } from "next/og";
import {
  isPlayerKey,
  playerName,
  posLabel,
  styleLabel,
  type FootballTestConfig,
} from "./engine";

// 결과/기본 공유 카드(1200x630). 모티프: ⚽ + 국기(🇰🇷)/지구본(🌍) — twemoji 로 렌더(국기 깨짐 없음).
// 배경은 테스트별 테마(한국=레드 / 글로벌=블루). 새 일러스트 없이 이모지만 사용.
const SIZE = { width: 1200, height: 630 };
const OG_BG = "linear-gradient(135deg, #0a1322 0%, #0c1626 52%, #122036 100%)";
const OPTS = { ...SIZE, emoji: "twemoji" as const };

function cleanTag(tag: string): string {
  return tag.replace(/^#/, "").replace(/_/g, " ");
}

export async function renderFootballOg(
  config: FootballTestConfig,
  url: URL,
): Promise<ImageResponse> {
  const theme = config.ogTheme ?? { bg: OG_BG, accent: config.accent };
  const accent = theme.accent;
  const motif = config.ogMotif ?? "";
  const en = config.localized === true && url.searchParams.get("lang") === "en";
  const keyParam = url.searchParams.get("key");
  const key = isPlayerKey(config, keyParam) ? keyParam : null;

  const kicker = en ? config.ogKickerEn ?? config.ogKicker : config.ogKicker;
  const def = en ? config.ogDefaultEn ?? config.ogDefault : config.ogDefault;

  // ── 기본 카드: ⚽ + 모티프 + 큰 제목 ──
  if (!key) {
    const names = config.positions.map((p) => (en ? p.en ?? p.ko : p.ko));
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: theme.bg, color: "#ffffff", fontFamily: "Noto Sans KR, sans-serif", padding: "64px 72px" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 27, fontWeight: 900, letterSpacing: 3, color: accent }}>{kicker}</div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 76, fontWeight: 900, lineHeight: 1.04, maxWidth: 680 }}>{def.title}</div>
            <div style={{ display: "flex", marginTop: 18, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>{def.sub}</div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 28, fontWeight: 800, color: accent }}>{def.line}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              {names.map((name) => (
                <div key={name} style={{ display: "flex", border: `1px solid ${accent}`, background: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "8px 16px", borderRadius: 999, fontSize: 23, fontWeight: 800 }}>{name}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 330 }}>
            <div style={{ display: "flex", fontSize: 210, lineHeight: 1 }}>⚽</div>
            {motif ? <div style={{ display: "flex", fontSize: 92, lineHeight: 1, marginTop: 18 }}>{motif}</div> : null}
          </div>
          <div style={{ position: "absolute", right: 72, bottom: 40, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
        </div>
      ),
      OPTS,
    );
  }

  const p = config.players[key];
  const name = playerName(p, en);
  const pos = posLabel(config, p.pos, en);
  const style = styleLabel(config, p.style, en);
  const tags = (en ? p.tagsEn ?? p.tags : p.tags).slice(0, 3).map(cleanTag);
  const eyebrow = en ? "You play like" : "나랑 닮은 축구선수";

  // ── 결과 카드: 테마 배경 + 대형 등번호 + 선수명 (+ ⚽ 모티프) ──
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: theme.bg, color: "#ffffff", fontFamily: "Noto Sans KR, sans-serif" }}>
        {/* 좌측: 대형 등번호 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 420, height: "100%", background: "rgba(0,0,0,0.28)", borderRight: `4px solid ${accent}` }}>
          <div style={{ display: "flex", fontSize: 232, fontWeight: 900, lineHeight: 1, color: accent }}>{p.jersey}</div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 30, fontWeight: 800, color: "rgba(255,255,255,0.82)" }}>{pos}</div>
        </div>
        {/* 우측: 텍스트 */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "64px 64px 64px 56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 2, color: accent }}>{eyebrow}</div>
            <div style={{ display: "flex", fontSize: 34, lineHeight: 1 }}>⚽{motif}</div>
          </div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 92, fontWeight: 900, lineHeight: 1.02 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 30, fontWeight: 900, color: "rgba(255,255,255,0.92)" }}>{pos} · {style}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ display: "flex", border: `1px solid ${accent}`, background: "rgba(255,255,255,0.10)", color: "#ffffff", padding: "10px 18px", borderRadius: 999, fontSize: 24, fontWeight: 800 }}>{tag}</div>
            ))}
          </div>
          <div style={{ position: "absolute", right: 56, bottom: 40, display: "flex", fontSize: 22, fontWeight: 800, letterSpacing: 1, color: "rgba(255,255,255,0.7)" }}>nolza.fun</div>
        </div>
      </div>
    ),
    OPTS,
  );
}
