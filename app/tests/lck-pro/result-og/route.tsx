import { ImageResponse } from "next/og";
import { LCK_PLAYERS, LCK_STYLES, isLckPlayerKey, posKo } from "@/lib/playstyle/lck";

// 결과별 공유 카드(1200x630). 실제 선수 사진은 OG에 임베드하지 않고 타이포 카드로(저작권 안전·즉시 동작).
export const runtime = "nodejs";
export const revalidate = 86400;

const SIZE = { width: 1200, height: 630 };
const OG_BG = "linear-gradient(135deg, #0a1322 0%, #0c1626 52%, #122036 100%)";
const ACCENT = "#C8AA6E";
const CYAN = "#63b3e8";

function cleanTag(tag: string): string {
  return tag.replace(/^#/, "").replace(/_/g, " ");
}

export async function GET(req: Request): Promise<ImageResponse> {
  const url = new URL(req.url);
  const typeParam = url.searchParams.get("type");
  const key = isLckPlayerKey(typeParam) ? typeParam : null;

  if (!key) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif", padding: "84px 88px" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 900, letterSpacing: 4, color: ACCENT }}>LCK PRO TEST</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 78, fontWeight: 900, lineHeight: 1.06 }}>LCK 프로게이머 성향 테스트</div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 33, fontWeight: 700, color: "rgba(214,224,240,.86)" }}>너랑 가장 닮은 LCK 선수는 누구?</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 29, fontWeight: 800, color: CYAN }}>탑 · 정글 · 미드 · 원딜 · 서폿</div>
          <div style={{ position: "absolute", right: 88, bottom: 48, display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(214,224,240,0.7)" }}>nolza.fun</div>
        </div>
      ),
      SIZE,
    );
  }

  const p = LCK_PLAYERS[key];
  const tags = p.tags.slice(0, 2).map(cleanTag);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: OG_BG, color: "#f4f7ff", fontFamily: "Noto Sans KR, sans-serif" }}>
        <div style={{ display: "flex", width: 18, height: "100%", background: ACCENT }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "70px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 27, fontWeight: 900, letterSpacing: 2, color: ACCENT }}>나랑 닮은 LCK 프로</div>
            <div style={{ display: "flex", padding: "6px 18px", borderRadius: 999, background: ACCENT, color: "#1c1505", fontSize: 24, fontWeight: 900 }}>{posKo(p.pos)}</div>
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 104, fontWeight: 900, lineHeight: 1.0 }}>{p.name}상</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 32, fontWeight: 900, color: CYAN }}>{posKo(p.pos)} · {LCK_STYLES[p.style]}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ display: "flex", border: `1px solid ${ACCENT}`, background: "rgba(150,190,235,0.08)", color: "#e6eefc", padding: "10px 18px", borderRadius: 999, fontSize: 26, fontWeight: 800 }}>{tag}</div>
            ))}
          </div>
          <div style={{ position: "absolute", right: 80, bottom: 40, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "rgba(214,224,240,0.7)" }}>nolza.fun</div>
            <div style={{ display: "flex", fontSize: 16, fontWeight: 600, color: "rgba(170,184,208,0.6)" }}>비공식 팬 콘텐츠</div>
          </div>
        </div>
      </div>
    ),
    SIZE,
  );
}
