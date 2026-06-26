import Image from "next/image";
import type { Game, Skin } from "@/lib/games-home";
import ScaleMotif from "./motifs/Scale";
import AuctionMotif from "./motifs/Auction";
import RewindMotif from "./motifs/Rewind";
import ReactMotif from "./motifs/React";
import KbtiMotif from "./motifs/Kbti";
import IjyMotif from "./motifs/Ijy";
import SceneChoiceMotif from "./motifs/SceneChoice";
import PoliticalTypeMotif from "./motifs/PoliticalType";

const REGISTRY: Record<string, React.FC<{ skin: Skin }>> = {
  scale: ScaleMotif,
  auction: AuctionMotif,
  rewind: RewindMotif,
  react: ReactMotif,
  kbti: KbtiMotif,
  ijy: IjyMotif,
  "scene-choice": SceneChoiceMotif,
  "political-type": PoliticalTypeMotif,
};

// 게임 플레이 성향 테스트용 커버 (목록 썸네일). 게임 톤에 맞춰 아트/이모지/역할색.
type ToneKey = "lol" | "valorant" | "pubg" | "overwatch" | "fbkr" | "fbglobal";
type CoverCfg = {
  tone: ToneKey;
  name: string;
  label?: string; // 하단 보조 라벨 (기본: "플레이 성향 테스트")
  artBase?: string;
  artExt?: string;
  arts?: string[];
  emojis?: string[];
  flag?: string; // 국기 SVG 코드 → /images/flags/{flag}.svg (이모지 대신 또렷한 플래그 칩)
  roles?: [string, string][];
};

const TONE_BG: Record<ToneKey, string> = {
  lol: "linear-gradient(135deg, #0b1124, #14223c)",
  valorant: "linear-gradient(135deg, #0f1923, #16242f)",
  pubg: "linear-gradient(135deg, #1b160d, #2a2110)",
  overwatch: "linear-gradient(135deg, #111b2b, #18283c)",
  fbkr: "linear-gradient(140deg, #2a0608 0%, #9e1418 52%, #6e0f12 100%)",
  fbglobal: "linear-gradient(140deg, #101a44 0%, #2a3d8f 48%, #5b3a9e 100%)",
};
const TONE_ACCENT: Record<ToneKey, string> = {
  lol: "#ffd166",
  valorant: "#ff4655",
  pubg: "#f2a900",
  overwatch: "#f99e1a",
  fbkr: "#ffe08a",
  fbglobal: "#7cc4ff",
};

// 발로란트 아트는 셸 복구 후 다운로드되면 arts를 채워 라인업으로 업그레이드.
// 축구 테스트: ⚽ 이모지 + (한국=kr.svg 플래그 칩 / 글로벌=🌍). 새 일러스트 없이 이모지·기존 에셋만.
const COVERS: Record<string, CoverCfg> = {
  "lol-playstyle": { tone: "lol", name: "롤", artBase: "/images/tests/lol/art", artExt: "jpg", arts: ["Yasuo", "Zed", "Teemo"] },
  "valorant-playstyle": { tone: "valorant", name: "발로란트", artBase: "/images/tests/valorant/art", artExt: "png", arts: ["jett", "raze", "omen"] },
  "pubg-playstyle": { tone: "pubg", name: "배그", emojis: ["🔫", "🎯", "🌿", "🚗"] },
  "overwatch-playstyle": { tone: "overwatch", name: "오버워치", roles: [["탱", "#4a9eff"], ["딜", "#ff6b5e"], ["힐", "#7bd17b"]] },
  "football-kr": { tone: "fbkr", name: "한국 축구선수", label: "포지션 성향 테스트", flag: "kr" },
  "football-global": { tone: "fbglobal", name: "글로벌 축구선수", label: "포지션 성향 테스트" },
};

export default function Thumb({ game, skin }: { game: Game; skin: Skin }) {
  if (game.thumb) {
    return (
      <Image
        src={game.thumb}
        alt=""
        fill
        quality={90}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
        style={{ objectFit: "cover" }}
      />
    );
  }
  const Motif = game.art ? REGISTRY[game.art] : undefined;
  if (Motif) return <Motif skin={skin} />;
  if (COVERS[game.id]) return <PlaystyleCover game={game} />;
  return <TitleCard game={game} />;
}

function PlaystyleCover({ game }: { game: Game }) {
  const cfg = COVERS[game.id];
  if (!cfg) return <TitleCard game={game} />;
  const accent = TONE_ACCENT[cfg.tone];
  const isFootball = cfg.tone === "fbkr" || cfg.tone === "fbglobal";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        background: TONE_BG[cfg.tone],
      }}
    >
      {isFootball ? <FootballMotif cfg={cfg} accent={accent} /> : null}

      {!isFootball && cfg.arts && cfg.artBase ? (
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${cfg.arts.length}, 1fr)` }}>
          {cfg.arts.map((c) => (
            <div key={c} style={{ position: "relative", overflow: "hidden" }}>
              <Image
                src={`${cfg.artBase}/${c}.${cfg.artExt ?? "jpg"}`}
                alt=""
                fill
                sizes="120px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {!isFootball && (cfg.emojis || cfg.flag) ? (
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8%", fontSize: "clamp(22px, 8vw, 40px)" }}>
          {cfg.emojis?.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
          {cfg.flag ? (
            // SVG 국기는 next/image 최적화기가 막으므로(기본 dangerouslyAllowSVG=false) 일반 img 로 직접 로드.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/images/flags/${cfg.flag}.svg`}
              alt=""
              style={{
                width: "clamp(34px, 13vw, 60px)",
                height: "clamp(23px, 8.7vw, 40px)",
                objectFit: "cover",
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.65)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
              }}
            />
          ) : null}
        </div>
      ) : null}

      {!isFootball && cfg.roles ? (
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {cfg.roles.map(([label, color]) => (
            <div
              key={label}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}26`, color, fontWeight: 900, fontSize: "clamp(15px, 5vw, 26px)" }}
            >
              {label}
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,11,24,0.12) 0%, rgba(6,11,24,0.22) 45%, rgba(6,11,24,0.86) 100%)" }} />

      <div style={{ position: "relative", padding: "10px 12px" }}>
        <span style={{ display: "block", fontWeight: 900, fontSize: "clamp(16px, 5vw, 24px)", color: "#fff", lineHeight: 1.05, textShadow: "0 1px 6px rgba(0,0,0,.6)" }}>
          {cfg.name}
        </span>
        <span style={{ display: "block", marginTop: 2, fontWeight: 800, fontSize: "clamp(9px, 2.8vw, 12px)", color: accent }}>
          {cfg.label ?? "플레이 성향 테스트"}
        </span>
      </div>
    </div>
  );
}

// 월드컵 느낌 축구 커버: 🏆 + 국기(kr.svg)/지구본(🌍) + ⚽ + 광채 glow + 색종이 confetti.
// 새 일러스트 없이 이모지 + CSS 그라데이션/글로우만 사용. FIFA 공식 로고/트로피 이미지 미사용.
const FB_CONFETTI: Record<"fbkr" | "fbglobal", string[]> = {
  fbkr: ["#FFE08A", "#ffffff", "#ff7a7a", "#ffd166"],
  fbglobal: ["#7cc4ff", "#ffffff", "#b39ddb", "#9b8aff"],
};
const CONFETTI_POS = [
  { x: "12%", y: "16%", r: 25 },
  { x: "84%", y: "13%", r: -18 },
  { x: "23%", y: "72%", r: 40 },
  { x: "72%", y: "76%", r: -30 },
  { x: "47%", y: "9%", r: 12 },
  { x: "7%", y: "48%", r: -22 },
  { x: "91%", y: "50%", r: 35 },
  { x: "60%", y: "86%", r: -8 },
];

function FootballMotif({ cfg, accent }: { cfg: CoverCfg; accent: string }) {
  const palette = FB_CONFETTI[cfg.tone as "fbkr" | "fbglobal"] ?? ["#ffffff"];
  return (
    <>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 60%)` }} />
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        {CONFETTI_POS.map((c, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: "clamp(4px, 1.6vw, 8px)",
              height: "clamp(3px, 1vw, 5px)",
              background: palette[i % palette.length],
              transform: `rotate(${c.r}deg)`,
              borderRadius: 1,
              opacity: 0.9,
              boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
      <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "7%" }}>
        <span style={{ fontSize: "clamp(26px, 10vw, 50px)", filter: `drop-shadow(0 3px 8px ${accent}aa)` }}>🏆</span>
        {cfg.flag ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/flags/${cfg.flag}.svg`}
            alt=""
            style={{ width: "clamp(30px, 12vw, 54px)", height: "clamp(20px, 8vw, 36px)", objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          />
        ) : (
          <span style={{ fontSize: "clamp(22px, 8.5vw, 44px)" }}>🌍</span>
        )}
        <span style={{ fontSize: "clamp(22px, 8.5vw, 44px)" }}>⚽</span>
      </div>
    </>
  );
}

// 썸네일 미설정 테스트 공통 폴백: 빈 네모 대신 제목 + 색상 카드.
function TitleCard({ game }: { game: Game }) {
  const p = game.palette;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px",
        textAlign: "center",
        background: `linear-gradient(135deg, ${p.paper}, ${p.bg})`,
        color: p.ink,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "clamp(14px, 4vw, 20px)", lineHeight: 1.2, wordBreak: "keep-all", overflow: "hidden" }}>
        {game.ko.title}
      </span>
    </div>
  );
}
