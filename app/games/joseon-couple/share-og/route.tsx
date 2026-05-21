import { ImageResponse } from "next/og";
import { getJoseonCoupleSharePreview } from "@/lib/result-preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const preview = getJoseonCoupleSharePreview(requestUrl.searchParams.get("s"));
  const locale = preview?.locale ?? "ko";
  const isKo = locale === "ko";
  const names = preview
    ? `${preview.names[0]} x ${preview.names[1]}`
    : isKo
      ? "두 사람의 조선 인연"
      : "A Joseon bond";
  const teaser =
    preview?.teaser ??
    (isKo
      ? "조선시대에서 만난 두 사람의 운명은?"
      : "What kind of fate would you share in Joseon?");
  const resultTitle =
    preview?.resultTitle ?? (isKo ? "조선시대 커플 궁합" : "Joseon Couple Match");
  const kicker = isKo ? "조선시대 커플 궁합" : "JOSEON COUPLE MATCH";
  const prompt = isKo
    ? "조선시대에서 만난 두 사람의 운명은?"
    : "What happens when two names meet in Joseon?";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 20% 18%, rgba(168,85,247,0.34), transparent 34%), radial-gradient(circle at 86% 16%, rgba(236,72,153,0.28), transparent 30%), linear-gradient(135deg, #171225 0%, #27172f 52%, #0f172a 100%)",
          color: "#fff8ef",
          fontFamily: '"Noto Sans KR", Arial, sans-serif',
          padding: "70px 84px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 34,
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 34,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: -120,
            width: 430,
            height: 430,
            borderRadius: 215,
            background: "rgba(79,70,229,0.22)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #a855f7, #7c3aed 54%, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 20px 44px rgba(124,58,237,0.38)",
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#ffffff",
                    display: "flex",
                    transform: "translateX(-3px)",
                  }}
                >
                  N
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    top: 20,
                    width: 0,
                    height: 0,
                    borderTop: "12px solid transparent",
                    borderBottom: "12px solid transparent",
                    borderLeft: "21px solid #b7d5ff",
                    display: "flex",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    fontWeight: 900,
                    letterSpacing: "0.18em",
                    color: "#d8b4fe",
                  }}
                >
                  nolza.fun
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 6,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "rgba(255,248,239,0.58)",
                    letterSpacing: "0.12em",
                  }}
                >
                  VIRAL TEST PLAYGROUND
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0abfc",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {kicker}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 72,
              maxWidth: 950,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#f9a8d4",
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "0.02em",
              }}
            >
              {names}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: "#fff8ef",
                fontSize: resultTitle.length > 18 ? 62 : 72,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {resultTitle}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 30,
                maxWidth: 860,
                color: "rgba(255,248,239,0.82)",
                fontSize: 35,
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {teaser}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "auto",
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.13)",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "rgba(255,248,239,0.66)",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {prompt}
            </div>
            <div
              style={{
                display: "flex",
                color: "#c4b5fd",
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "0.12em",
              }}
            >
              PLAY AT NOLZA.FUN
            </div>
          </div>
        </div>
      </div>
    ),
    SIZE,
  );
}
