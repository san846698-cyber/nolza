import { ImageResponse } from "next/og";
import { isTypeKey, type PlaystyleConfig } from "./core";

// 결과별 공유 카드(1200x630) 공용 렌더러. 전 화면 다크 네이비 + 게임별 악센트.
// - media "art": 좌측 캐릭터 아트 + 우측 텍스트 (롤·발로란트)
// - media "emoji"/"role": 타이포 중심 카드 (배그/오버워치) — Satori 이모지 의존 없이 견고.
const SIZE = { width: 1200, height: 630 };
const OG_BG = "linear-gradient(135deg, #0a1322 0%, #0c1626 52%, #122036 100%)";
const CARD = "linear-gradient(135deg, #14223c, #0a1124)";
const CYAN = "#63b3e8";

async function loadArt(origin: string, artBase: string, img: string, ext: string): Promise<string | null> {
  try {
    const res = await fetch(`${origin}${artBase}/${img}.${ext}`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : "png";
    return `data:image/${mime};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

function cleanTag(tag: string): string {
  return tag.replace(/^#/, "").replace(/_/g, " ");
}

export async function renderPlaystyleOg(
  config: PlaystyleConfig,
  url: URL,
): Promise<ImageResponse> {
  const accent = config.theme.accent;
  const ext = config.artExt ?? "png";
  const typeParam = url.searchParams.get("type");
  const key = isTypeKey(config, typeParam) ? typeParam : null;

  // ── 기본 카드 (결과 미지정) ──
  if (!key) {
    let coverArts: string[] = [];
    if (config.media === "art" && config.artBase) {
      const artBase = config.artBase;
      const imgs = Object.values(config.types)
        .map((t) => t.img)
        .filter((v): v is string => Boolean(v))
        .slice(0, 5);
      coverArts = (
        await Promise.all(imgs.map((img) => loadArt(url.origin, artBase, img, ext)))
      ).filter((src): src is string => Boolean(src));
    }

    if (coverArts.length) {
      return new ImageResponse(
        (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif", padding: "52px 72px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 25, fontWeight: 900, letterSpacing: 4, color: accent }}>{config.ogKicker}</div>
              <div style={{ display: "flex", marginTop: 10, fontSize: 70, fontWeight: 900 }}>{config.ogDefault.title}</div>
            </div>
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
              {coverArts.map((src, i) => (
                <div key={i} style={{ display: "flex", width: 184, height: 272, borderRadius: 18, overflow: "hidden", border: `2px solid ${accent}`, background: CARD }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" width={184} height={272} style={{ width: 184, height: 272, objectFit: "cover", objectPosition: "center top" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: CYAN }}>{config.ogDefault.line}</div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 800, letterSpacing: 1, color: "rgba(214,224,240,0.7)" }}>© Riot Games · nolza.fun</div>
            </div>
          </div>
        ),
        SIZE,
      );
    }

    const typeNames = Object.values(config.types).map((t) => t.ko);
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif", padding: "72px 80px" }}>
          <div style={{ display: "flex", fontSize: 27, fontWeight: 900, letterSpacing: 4, color: accent }}>{config.ogKicker}</div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 76, fontWeight: 900, lineHeight: 1.06 }}>{config.ogDefault.title}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 31, fontWeight: 700, color: "rgba(214,224,240,.86)" }}>{config.ogDefault.sub}</div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 28, fontWeight: 800, color: CYAN }}>{config.ogDefault.line}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            {typeNames.map((name) => (
              <div key={name} style={{ display: "flex", border: `1px solid ${accent}`, background: "rgba(150,190,235,0.06)", color: "#e6eefc", padding: "8px 16px", borderRadius: 999, fontSize: 24, fontWeight: 800 }}>{name}</div>
            ))}
          </div>
          <div style={{ position: "absolute", right: 80, bottom: 44, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(214,224,240,0.7)" }}>nolza.fun</div>
        </div>
      ),
      SIZE,
    );
  }

  const type = config.types[key];
  const tags = type.tags.slice(0, 2).map(cleanTag);

  // ── media "art": 좌측 아트 + 우측 텍스트 ──
  if (config.media === "art" && config.artBase && type.img) {
    const art = await loadArt(url.origin, config.artBase, type.img, ext);
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif" }}>
          <div style={{ position: "relative", display: "flex", width: 470, height: "100%", background: CARD }}>
            {art ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={art} alt="" width={470} height={630} style={{ width: 470, height: 630, objectFit: "cover", objectPosition: "center top" }} />
            ) : (
              <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", color: accent, fontSize: 56, fontWeight: 900 }}>{type.pair}</div>
            )}
            <div style={{ position: "absolute", top: 0, right: 0, width: 160, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0), #0a0f1f)" }} />
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "64px 64px 64px 40px", background: OG_BG }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 900, letterSpacing: 2, color: accent }}>나의 {config.gameLabel} 성향</div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 82, fontWeight: 900, lineHeight: 1.04 }}>{type.ko}</div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 29, fontWeight: 900, color: CYAN }}>{type.en} · {config.pairLabel} {type.pair}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              {tags.map((tag) => (
                <div key={tag} style={{ display: "flex", border: `1px solid ${accent}`, background: "rgba(150,190,235,0.08)", color: "#cfe2ff", padding: "10px 18px", borderRadius: 999, fontSize: 26, fontWeight: 800 }}>{tag}</div>
              ))}
            </div>
            <div style={{ position: "absolute", right: 64, bottom: 44, display: "flex", fontSize: 22, fontWeight: 800, letterSpacing: 1, color: "rgba(214,224,240,0.7)" }}>© Riot Games · nolza.fun</div>
          </div>
        </div>
      ),
      SIZE,
    );
  }

  // ── media "emoji"/"role": 타이포 카드 ──
  const roleColor = type.role ? config.roleColors?.[type.role] ?? accent : accent;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif" }}>
        <div style={{ display: "flex", width: 18, height: "100%", background: roleColor }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "70px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 27, fontWeight: 900, letterSpacing: 2, color: accent }}>나의 {config.gameLabel} 성향</div>
            {type.role ? (
              <div style={{ display: "flex", padding: "6px 18px", borderRadius: 999, background: roleColor, color: "#0a0f1f", fontSize: 24, fontWeight: 900 }}>{type.role}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 96, fontWeight: 900, lineHeight: 1.02 }}>{type.ko}</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 32, fontWeight: 900, color: CYAN }}>{type.en} · {config.pairLabel} {type.pair}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ display: "flex", border: `1px solid ${accent}`, background: "rgba(150,190,235,0.08)", color: "#cfe2ff", padding: "10px 18px", borderRadius: 999, fontSize: 26, fontWeight: 800 }}>{tag}</div>
            ))}
          </div>
          <div style={{ position: "absolute", right: 80, bottom: 44, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(214,224,240,0.7)" }}>nolza.fun</div>
        </div>
      </div>
    ),
    SIZE,
  );
}
