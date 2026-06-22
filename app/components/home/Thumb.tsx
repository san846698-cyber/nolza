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
type ToneKey = "lol" | "valorant" | "pubg" | "overwatch";
type CoverCfg = {
  tone: ToneKey;
  name: string;
  artBase?: string;
  artExt?: string;
  arts?: string[];
  emojis?: string[];
  roles?: [string, string][];
};

const TONE_BG: Record<ToneKey, string> = {
  lol: "linear-gradient(135deg, #0b1124, #14223c)",
  valorant: "linear-gradient(135deg, #0f1923, #16242f)",
  pubg: "linear-gradient(135deg, #1b160d, #2a2110)",
  overwatch: "linear-gradient(135deg, #111b2b, #18283c)",
};
const TONE_ACCENT: Record<ToneKey, string> = {
  lol: "#ffd166",
  valorant: "#ff4655",
  pubg: "#f2a900",
  overwatch: "#f99e1a",
};

// 발로란트 아트는 셸 복구 후 다운로드되면 arts를 채워 라인업으로 업그레이드.
const COVERS: Record<string, CoverCfg> = {
  "lol-playstyle": { tone: "lol", name: "롤", artBase: "/images/tests/lol/art", artExt: "jpg", arts: ["Yasuo", "Zed", "Teemo"] },
  "valorant-playstyle": { tone: "valorant", name: "발로란트", artBase: "/images/tests/valorant/art", artExt: "png", arts: ["jett", "raze", "omen"] },
  "pubg-playstyle": { tone: "pubg", name: "배그", emojis: ["🔫", "🎯", "🌿", "🚗"] },
  "overwatch-playstyle": { tone: "overwatch", name: "오버워치", roles: [["탱", "#4a9eff"], ["딜", "#ff6b5e"], ["힐", "#7bd17b"]] },
};

export default function Thumb({ game, skin }: { game: Game; skin: Skin }) {
  if (game.thumb) {
    return (
      <Image
        src={game.thumb}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
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
      {cfg.arts && cfg.artBase ? (
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

      {cfg.emojis ? (
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "7%", fontSize: "clamp(22px, 8vw, 40px)" }}>
          {cfg.emojis.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      ) : null}

      {cfg.roles ? (
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
          플레이 성향 테스트
        </span>
      </div>
    </div>
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
