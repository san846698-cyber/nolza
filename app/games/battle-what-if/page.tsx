"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { AdMobileSticky } from "../../components/Ads";
import { BATTLE_ENTRIES } from "@/lib/battle-what-if";

const SERIF = "var(--font-noto-serif-kr), serif";
const BG = "#1a1410";
const PAPER = "#241a14";
const FG = "#f4ecd8";
const ACCENT = "#c9a66b";
const DIM = "#a89880";
const BORDER = "rgba(244,236,216,0.18)";

export default function BattleWhatIfHub() {
  const { t } = useLocale();

  return (
    <main
      className="page-in"
      style={{
        minHeight: "100svh",
        backgroundColor: BG,
        color: FG,
        fontFamily: SERIF,
        position: "relative",
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          color: DIM,
          fontSize: 22,
          textDecoration: "none",
          zIndex: 5,
        }}
      >
        ←
      </Link>

      <div className="mx-auto" style={{ maxWidth: 760, padding: "96px 24px 96px" }}>
        <div className="text-center">
          <div
            style={{
              fontSize: 13,
              color: ACCENT,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("전쟁의 갈림길", "Crossroads of War")}
          </div>
          <h1
            style={{
              marginTop: 22,
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.5px",
            }}
          >
            {t("당신이 지휘관이라면", "If you were the commander")}
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 17,
              color: DIM,
              lineHeight: 1.85,
              letterSpacing: "-0.1px",
              maxWidth: 560,
              margin: "22px auto 0",
            }}
          >
            {t(
              "역사 속 다섯 번의 명전투. 한 전투에 들어가 다섯 번의 결단을 내리고, 그 결과를 사료와 학자 분석에 비춰 평가받습니다.",
              "Five great battles. Step into one, make five decisions, and see the outcome weighed against ancient sources and modern scholarship.",
            )}
          </p>
        </div>

        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {BATTLE_ENTRIES.map((entry) => (
            <BattleCard key={entry.id} entry={entry} />
          ))}
        </div>

        <p
          style={{
            marginTop: 64,
            fontSize: 13,
            color: DIM,
            lineHeight: 1.9,
            letterSpacing: "0.02em",
            textAlign: "center",
            padding: "0 8px",
          }}
        >
          {t(
            "모든 사실·서사·사상자 수치는 1차 사료(폴리비오스·리비우스 등)와 학자 분석(Goldsworthy, Lazenby, Daly 외)에 근거합니다.",
            "All facts, narratives, and casualty figures are grounded in primary sources (Polybius, Livy, etc.) and modern scholarship (Goldsworthy, Lazenby, Daly, and others).",
          )}
        </p>
      </div>
      <AdMobileSticky />
    </main>
  );
}

function BattleCard({ entry }: { entry: (typeof BATTLE_ENTRIES)[number] }) {
  const { t } = useLocale();
  const disabled = !entry.available;

  const inner = (
    <div
      style={{
        padding: "24px 22px",
        background: PAPER,
        border: `1px solid ${disabled ? "rgba(244,236,216,0.06)" : BORDER}`,
        borderRadius: 6,
        height: "100%",
        position: "relative",
        opacity: disabled ? 0.55 : 1,
        transition: "border-color 200ms, transform 80ms",
        cursor: disabled ? "default" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.borderColor = ACCENT;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.borderColor = BORDER;
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: ACCENT,
          letterSpacing: "0.18em",
          fontWeight: 600,
        }}
      >
        {t(entry.era.ko, entry.era.en)}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.3px",
          lineHeight: 1.3,
        }}
      >
        {t(entry.title.ko, entry.title.en)}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 14,
          color: DIM,
          fontStyle: "italic",
        }}
      >
        {t(entry.commander.ko, entry.commander.en)}
      </div>
      <p
        style={{
          marginTop: 16,
          fontSize: 14,
          color: FG,
          lineHeight: 1.7,
          letterSpacing: "-0.1px",
        }}
      >
        {t(entry.tagline.ko, entry.tagline.en)}
      </p>
      <div
        style={{
          marginTop: 18,
          fontSize: 12,
          color: disabled ? DIM : ACCENT,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {disabled ? t("준비 중", "Coming soon") : t("지휘를 시작한다 →", "Take command →")}
      </div>
    </div>
  );

  if (disabled || !entry.href) return inner;
  return (
    <Link href={entry.href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  );
}
