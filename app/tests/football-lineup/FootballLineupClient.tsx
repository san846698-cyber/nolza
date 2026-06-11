"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AdBottom } from "@/app/components/Ads";
import { ShareCard } from "@/app/components/ShareCard";

type Role = "GK" | "DF" | "MF" | "FW";

type Player = {
  id: string;
  no: string;
  name: string;
  role: Role;
};

type Slot = {
  id: string;
  label: string;
  role: Role;
  x: number;
  y: number;
};

type Formation = {
  id: string;
  name: string;
  slots: Slot[];
};

type DragState = {
  playerId: string;
  originSlotId: string | null;
  x: number;
  y: number;
  overSlotId: string | null;
};

const PLAYERS: Player[] = [
  { id: "gk1", no: "1", name: "조현우", role: "GK" },
  { id: "df1", no: "4", name: "김민재", role: "DF" },
  { id: "df2", no: "15", name: "정승현", role: "DF" },
  { id: "df3", no: "22", name: "설영우", role: "DF" },
  { id: "df4", no: "2", name: "이기제", role: "DF" },
  { id: "df5", no: "3", name: "김진수", role: "DF" },
  { id: "mf1", no: "5", name: "박용우", role: "MF" },
  { id: "mf2", no: "6", name: "황인범", role: "MF" },
  { id: "mf3", no: "10", name: "이재성", role: "MF" },
  { id: "mf4", no: "18", name: "이강인", role: "MF" },
  { id: "mf5", no: "13", name: "백승호", role: "MF" },
  { id: "fw1", no: "7", name: "손흥민", role: "FW" },
  { id: "fw2", no: "11", name: "황희찬", role: "FW" },
  { id: "fw3", no: "9", name: "조규성", role: "FW" },
  { id: "fw4", no: "20", name: "오현규", role: "FW" },
  { id: "fw5", no: "17", name: "정우영", role: "FW" },
];

const FORMATIONS: Formation[] = [
  {
    id: "3-3-4",
    name: "3-3-4",
    slots: [
      slot("gk", "GK", "GK", 50, 92),
      slot("cb-l", "CB", "DF", 31, 75),
      slot("cb-c", "CB", "DF", 50, 78),
      slot("cb-r", "CB", "DF", 69, 75),
      slot("mf-l", "MF", "MF", 24, 56),
      slot("mf-c", "MF", "MF", 50, 50),
      slot("mf-r", "MF", "MF", 76, 56),
      slot("fw-l", "LW", "FW", 23, 28),
      slot("fw-ml", "ST", "FW", 42, 22),
      slot("fw-mr", "ST", "FW", 58, 22),
      slot("fw-r", "RW", "FW", 77, 28),
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: [
      slot("gk", "GK", "GK", 50, 92),
      slot("lb", "LB", "DF", 20, 75),
      slot("cb-l", "CB", "DF", 40, 78),
      slot("cb-r", "CB", "DF", 60, 78),
      slot("rb", "RB", "DF", 80, 75),
      slot("dm-l", "DM", "MF", 41, 58),
      slot("dm-r", "DM", "MF", 59, 58),
      slot("am-l", "LW", "MF", 24, 38),
      slot("am-c", "AM", "MF", 50, 34),
      slot("am-r", "RW", "MF", 76, 38),
      slot("st", "ST", "FW", 50, 18),
    ],
  },
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: [
      slot("gk", "GK", "GK", 50, 92),
      slot("lb", "LB", "DF", 20, 75),
      slot("cb-l", "CB", "DF", 40, 78),
      slot("cb-r", "CB", "DF", 60, 78),
      slot("rb", "RB", "DF", 80, 75),
      slot("cm-l", "CM", "MF", 35, 55),
      slot("cm-c", "CM", "MF", 50, 49),
      slot("cm-r", "CM", "MF", 65, 55),
      slot("lw", "LW", "FW", 24, 28),
      slot("st", "ST", "FW", 50, 18),
      slot("rw", "RW", "FW", 76, 28),
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    slots: [
      slot("gk", "GK", "GK", 50, 92),
      slot("cb-l", "CB", "DF", 31, 76),
      slot("cb-c", "CB", "DF", 50, 79),
      slot("cb-r", "CB", "DF", 69, 76),
      slot("wb-l", "LWB", "MF", 18, 57),
      slot("cm-l", "CM", "MF", 42, 58),
      slot("cm-r", "CM", "MF", 58, 58),
      slot("wb-r", "RWB", "MF", 82, 57),
      slot("ss-l", "SS", "FW", 39, 34),
      slot("ss-r", "SS", "FW", 61, 34),
      slot("st", "ST", "FW", 50, 18),
    ],
  },
];

const ROLE_LABEL: Record<Role, string> = {
  GK: "골키퍼",
  DF: "수비",
  MF: "미드필더",
  FW: "공격",
};

const ROLE_COLOR: Record<Role, string> = {
  GK: "#f4d348",
  DF: "#2f8cff",
  MF: "#ff9f1c",
  FW: "#ff293b",
};

function slot(id: string, label: string, role: Role, x: number, y: number): Slot {
  return { id, label, role, x, y };
}

function initialLineup(formation: Formation) {
  const byRole = {
    GK: PLAYERS.filter((player) => player.role === "GK"),
    DF: PLAYERS.filter((player) => player.role === "DF"),
    MF: PLAYERS.filter((player) => player.role === "MF"),
    FW: PLAYERS.filter((player) => player.role === "FW"),
  };
  const used = new Set<string>();

  return Object.fromEntries(
    formation.slots.map((slotItem) => {
      const player = byRole[slotItem.role].find((candidate) => !used.has(candidate.id));
      if (player) used.add(player.id);
      return [slotItem.id, player?.id ?? ""];
    }),
  );
}

export default function FootballLineupClient() {
  const pitchRef = useRef<HTMLDivElement | null>(null);
  const suppressClickRef = useRef(false);
  const [formationId, setFormationId] = useState(FORMATIONS[0].id);
  const formation = FORMATIONS.find((item) => item.id === formationId) ?? FORMATIONS[0];
  const [lineups, setLineups] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(FORMATIONS.map((item) => [item.id, initialLineup(item)])),
  );
  const [players, setPlayers] = useState(PLAYERS);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);

  const lineup = lineups[formation.id] ?? {};
  const placedIds = useMemo(() => new Set(Object.values(lineup).filter(Boolean)), [lineup]);
  const benchPlayers = players.filter((player) => !placedIds.has(player.id));
  const selectedPlayer = players.find((player) => player.id === selectedPlayerId) ?? null;
  const selectedSlot = formation.slots.find((slotItem) => slotItem.id === selectedSlotId) ?? null;
  const selectedSlotPlayer =
    selectedSlot ? players.find((player) => player.id === lineup[selectedSlot.id]) ?? null : null;
  const draggedPlayer = drag ? players.find((player) => player.id === drag.playerId) ?? null : null;

  const setLineup = (updater: (current: Record<string, string>) => Record<string, string>) => {
    setLineups((current) => ({
      ...current,
      [formation.id]: updater(current[formation.id] ?? {}),
    }));
  };

  const placePlayer = (playerId: string, targetSlotId: string) => {
    setLineup((current) => {
      const next = { ...current };
      const originSlotId = Object.entries(next).find(([, id]) => id === playerId)?.[0];
      const targetPlayerId = next[targetSlotId] ?? "";

      if (originSlotId && originSlotId !== targetSlotId) {
        next[originSlotId] = targetPlayerId;
      }
      next[targetSlotId] = playerId;
      return next;
    });
    setSelectedPlayerId(playerId);
    setSelectedSlotId(targetSlotId);
  };

  const clearSlot = (slotId: string) => {
    setLineup((current) => ({ ...current, [slotId]: "" }));
    setSelectedSlotId(slotId);
  };

  const findNearestSlot = (clientX: number, clientY: number) => {
    const rect = pitchRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const closest = formation.slots.reduce<{ id: string; distance: number } | null>(
      (best, slotItem) => {
        const x = rect.left + (slotItem.x / 100) * rect.width;
        const y = rect.top + (slotItem.y / 100) * rect.height;
        const distance = Math.hypot(clientX - x, clientY - y);
        if (!best || distance < best.distance) return { id: slotItem.id, distance };
        return best;
      },
      null,
    );

    const threshold = Math.max(54, Math.min(rect.width, rect.height) * 0.11);
    return closest && closest.distance <= threshold ? closest.id : null;
  };

  const startDrag = (
    playerId: string,
    originSlotId: string | null,
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setSelectedPlayerId(playerId);
    setSelectedSlotId(originSlotId);
    setDrag({
      playerId,
      originSlotId,
      x: event.clientX,
      y: event.clientY,
      overSlotId: findNearestSlot(event.clientX, event.clientY),
    });
  };

  useEffect(() => {
    if (!drag) return;

    const move = (event: PointerEvent) => {
      setDrag((current) =>
        current
          ? {
              ...current,
              x: event.clientX,
              y: event.clientY,
              overSlotId: findNearestSlot(event.clientX, event.clientY),
            }
          : null,
      );
    };

    const end = () => {
      setDrag((current) => {
        if (current?.overSlotId) {
          placePlayer(current.playerId, current.overSlotId);
          suppressClickRef.current = true;
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 80);
        }
        return null;
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end, { once: true });
    window.addEventListener("pointercancel", end, { once: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [drag, formation]);

  const handleSlotClick = (slotId: string) => {
    if (suppressClickRef.current) return;
    setSelectedSlotId(slotId);
    if (selectedPlayerId) {
      placePlayer(selectedPlayerId, slotId);
      return;
    }
    const playerId = lineup[slotId];
    if (playerId) setSelectedPlayerId(playerId);
  };

  const updatePlayer = (key: "no" | "name", value: string) => {
    if (!selectedPlayerId) return;
    const trimmed = key === "no" ? value.replace(/[^\d]/g, "").slice(0, 2) : value.slice(0, 8);
    setPlayers((current) =>
      current.map((player) =>
        player.id === selectedPlayerId ? { ...player, [key]: trimmed } : player,
      ),
    );
  };

  const reset = () => {
    setLineups((current) => ({ ...current, [formation.id]: initialLineup(formation) }));
    setSelectedPlayerId(null);
    setSelectedSlotId(null);
  };

  const shareText = () => {
    const list = formation.slots
      .map((slotItem) => {
        const player = players.find((item) => item.id === lineup[slotItem.id]);
        return player ? `${slotItem.label} ${player.no}. ${player.name}` : `${slotItem.label} -`;
      })
      .join("\n");
    return `나의 대한민국 대표팀 ${formation.name}\n${list}`;
  };

  const copyLineup = async () => {
    try {
      await navigator.clipboard.writeText(shareText());
      setCopyStatus("라인업이 복사됐어요");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("복사에 실패했어요");
    }
  };

  return (
    <main className="lineup-page">
      <header className="lineup-topbar">
        <Link href="/" className="lineup-brand">
          nolza.fun
        </Link>
        <span>World Cup Manager Mode</span>
      </header>

      <section className="lineup-shell">
        <div className="lineup-head">
          <p>대한민국 대표팀 전술판</p>
          <h1>등번호와 이름만 올려서 나만의 베스트11 만들기</h1>
          <span>선수를 고르고 포지션을 누르세요. 데스크톱에서는 끌어다 놓을 수도 있어요.</span>
        </div>

        <div className="lineup-layout">
          <section className="field-panel" aria-label="축구 전술판">
            <div className="formation-tabs" data-share-card-skip="true">
              {FORMATIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === formation.id ? "active" : ""}
                  onClick={() => {
                    setFormationId(item.id);
                    setSelectedSlotId(null);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <ShareCard
              filename={`korea-lineup-${formation.name}`}
              showButton
              locale="ko"
              buttonLabel={{ ko: "이미지 저장", en: "Save image" }}
              buttonClassName="image-save"
              backgroundColor="#17380f"
            >
              {({ cardRef }) => (
                <div className="field-card" ref={cardRef}>
                  <div className="field-title">
                    <span>KOREA XI</span>
                    <strong>{formation.name}</strong>
                  </div>
                  <div className={`pitch ${drag ? "is-dragging" : ""}`} ref={pitchRef}>
                    <span className="box box-top" />
                    <span className="box box-bottom" />
                    <span className="goal goal-top" />
                    <span className="goal goal-bottom" />
                    <span className="center-line" />
                    <span className="center-circle" />
                    {formation.slots.map((slotItem) => {
                      const player = players.find((item) => item.id === lineup[slotItem.id]);
                      const selected = selectedSlotId === slotItem.id;
                      const isDropTarget = drag?.overSlotId === slotItem.id;
                      const isDraggingSource = Boolean(player && drag?.playerId === player.id);
                      return (
                        <button
                          key={slotItem.id}
                          type="button"
                          className={`player-token ${selected ? "selected" : ""} ${isDropTarget ? "drop-target" : ""} ${isDraggingSource ? "dragging-source" : ""}`}
                          style={{
                            left: `${slotItem.x}%`,
                            top: `${slotItem.y}%`,
                            "--jersey": player ? ROLE_COLOR[player.role] : "rgba(255,255,255,0.16)",
                          } as CSSProperties}
                          onClick={() => handleSlotClick(slotItem.id)}
                          onPointerDown={(event) => {
                            if (player) startDrag(player.id, slotItem.id, event);
                          }}
                          aria-label={`${slotItem.label} ${player ? `${player.no}번 ${player.name}` : "비어 있음"}`}
                        >
                          <Jersey player={player} label={slotItem.label} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </ShareCard>

            <div className="field-actions" data-share-card-skip="true">
              <button type="button" onClick={copyLineup}>
                텍스트 복사
              </button>
              <button type="button" onClick={reset}>
                초기화
              </button>
              {copyStatus ? <span>{copyStatus}</span> : null}
            </div>
          </section>

          <aside className="coach-panel" aria-label="선수 선택과 편집">
            <div className="selection-box">
              <p>현재 선택</p>
              <strong>
                {selectedPlayer
                  ? `${selectedPlayer.no}. ${selectedPlayer.name}`
                  : selectedSlotPlayer
                    ? `${selectedSlotPlayer.no}. ${selectedSlotPlayer.name}`
                    : "선수를 선택하세요"}
              </strong>
              <span>{selectedSlot ? `${selectedSlot.label} 포지션` : "후보 명단이나 필드에서 선택"}</span>
            </div>

            <div className="editor-box">
              <label>
                등번호
                <input
                  inputMode="numeric"
                  value={selectedPlayer?.no ?? ""}
                  onChange={(event) => updatePlayer("no", event.target.value)}
                  disabled={!selectedPlayer}
                />
              </label>
              <label>
                이름
                <input
                  value={selectedPlayer?.name ?? ""}
                  onChange={(event) => updatePlayer("name", event.target.value)}
                  disabled={!selectedPlayer}
                />
              </label>
              {selectedSlot ? (
                <button type="button" onClick={() => clearSlot(selectedSlot.id)}>
                  이 자리 비우기
                </button>
              ) : null}
            </div>

            <div className="bench-list">
              {(["FW", "MF", "DF", "GK"] as Role[]).map((role) => {
                const rolePlayers = benchPlayers.filter((player) => player.role === role);
                if (rolePlayers.length === 0) return null;
                return (
                  <section key={role}>
                    <h2>{ROLE_LABEL[role]}</h2>
                    <div>
                      {rolePlayers.map((player) => (
                        <button
                          key={player.id}
                          type="button"
                          className={`bench-jersey ${selectedPlayerId === player.id ? "active" : ""} ${drag?.playerId === player.id ? "dragging-source" : ""}`}
                          style={{ "--jersey": ROLE_COLOR[player.role] } as CSSProperties}
                          onClick={() => setSelectedPlayerId(player.id)}
                          onPointerDown={(event) => startDrag(player.id, null, event)}
                        >
                          <Jersey player={player} />
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <AdBottom />
      {draggedPlayer ? (
        <div
          className="drag-ghost"
          style={{
            left: drag?.x ?? 0,
            top: drag?.y ?? 0,
            "--jersey": ROLE_COLOR[draggedPlayer.role],
          } as CSSProperties}
          aria-hidden
        >
          <Jersey player={draggedPlayer} />
        </div>
      ) : null}
      <style jsx global>{styles}</style>
    </main>
  );
}

function Jersey({ player, label }: { player?: Player | null; label?: string }) {
  return (
    <span className={`jersey ${player ? "" : "jersey--empty"}`}>
      <span className="jersey-neck" aria-hidden />
      <span className="jersey-label">{label}</span>
      {player ? (
        <>
          <span className="jersey-number">{player.no}</span>
          <span className="jersey-name">{player.name}</span>
        </>
      ) : (
        <span className="jersey-name">배치</span>
      )}
    </span>
  );
}

const styles = `
  .lineup-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 10% 0%, rgba(255, 44, 66, 0.16), transparent 32rem),
      linear-gradient(135deg, #07130a 0%, #112f18 42%, #0f1b24 100%);
    color: #f8faf0;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .lineup-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0;
    color: rgba(248, 250, 240, 0.74);
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .lineup-brand {
    color: #ffffff;
    text-decoration: none;
    font-size: 18px;
  }

  .lineup-shell {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 20px 0 64px;
  }

  .lineup-head {
    display: grid;
    gap: 10px;
    margin-bottom: 20px;
  }

  .lineup-head p {
    margin: 0;
    color: #ff5668;
    font-size: 14px;
    font-weight: 900;
  }

  .lineup-head h1 {
    max-width: 760px;
    margin: 0;
    color: #fffef7;
    font-size: clamp(32px, 5vw, 62px);
    line-height: 1.02;
    letter-spacing: 0;
  }

  .lineup-head span {
    max-width: 680px;
    color: rgba(248, 250, 240, 0.74);
    font-size: 16px;
    line-height: 1.65;
  }

  .lineup-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 18px;
    align-items: start;
  }

  .field-panel,
  .coach-panel {
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(3, 10, 6, 0.44);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  }

  .field-panel {
    padding: 14px;
  }

  .formation-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }

  .formation-tabs button,
  .field-actions button,
  .editor-box button {
    min-height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    font-weight: 900;
    cursor: pointer;
  }

  .formation-tabs button.active,
  .field-actions button:first-child {
    background: #e81f3d;
    border-color: #ff6e80;
  }

  :global(.image-save) {
    width: 100%;
    min-height: 46px;
    margin-top: 12px;
    border: 0;
    background: #ffffff;
    color: #132414;
    font-weight: 950;
    cursor: pointer;
  }

  .field-card {
    overflow: hidden;
    background: #163d12;
  }

  .field-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    background: linear-gradient(90deg, #0b1f0c, #234f18);
    color: #ffffff;
  }

  .field-title span {
    font-size: 13px;
    font-weight: 950;
    color: rgba(255, 255, 255, 0.7);
  }

  .field-title strong {
    font-size: 34px;
    line-height: 1;
  }

  .pitch {
    position: relative;
    aspect-ratio: 7 / 10;
    min-height: 520px;
    border: 3px solid rgba(255, 255, 255, 0.56);
    background-color: #4f9b2b;
    background-image:
      linear-gradient(90deg, rgba(255,255,255,0.08) 0 12.5%, transparent 12.5% 25%, rgba(255,255,255,0.08) 25% 37.5%, transparent 37.5% 50%, rgba(255,255,255,0.08) 50% 62.5%, transparent 62.5% 75%, rgba(255,255,255,0.08) 75% 87.5%, transparent 87.5%),
      linear-gradient(0deg, rgba(255,255,255,0.05) 0 10%, transparent 10% 20%, rgba(255,255,255,0.05) 20% 30%, transparent 30% 40%, rgba(255,255,255,0.05) 40% 50%, transparent 50% 60%, rgba(255,255,255,0.05) 60% 70%, transparent 70% 80%, rgba(255,255,255,0.05) 80% 90%, transparent 90%);
  }

  .pitch.is-dragging {
    cursor: grabbing;
  }

  .box,
  .goal,
  .center-line,
  .center-circle {
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0.58);
  }

  .box {
    left: 22%;
    width: 56%;
    height: 15%;
    border: 2px solid rgba(255, 255, 255, 0.58);
  }

  .box-top { top: 0; border-top: 0; }
  .box-bottom { bottom: 0; border-bottom: 0; }

  .goal {
    left: 40%;
    width: 20%;
    height: 5%;
    border: 2px solid rgba(255, 255, 255, 0.58);
  }

  .goal-top { top: 0; border-top: 0; }
  .goal-bottom { bottom: 0; border-bottom: 0; }

  .center-line {
    left: 0;
    right: 0;
    top: 50%;
    border-top: 2px solid rgba(255, 255, 255, 0.58);
  }

  .center-circle {
    left: 50%;
    top: 50%;
    width: 24%;
    aspect-ratio: 1;
    border: 2px solid rgba(255, 255, 255, 0.58);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .player-token {
    position: absolute;
    z-index: 2;
    width: clamp(72px, 12vw, 96px);
    height: clamp(76px, 13vw, 106px);
    padding: 0;
    border: 0;
    background: transparent;
    transform: translate(-50%, -50%);
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .player-token.selected {
    filter: drop-shadow(0 0 0.55rem rgba(255, 255, 255, 0.9));
  }

  .player-token.drop-target {
    z-index: 4;
    transform: translate(-50%, -50%) scale(1.08);
  }

  .player-token.dragging-source {
    opacity: 0.38;
  }

  .jersey {
    position: relative;
    display: grid;
    grid-template-rows: 16px 1fr auto;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 8px 9px 10px;
    color: #ffffff;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.38);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.24), transparent 34%),
      var(--jersey);
    clip-path: polygon(17% 4%, 35% 0, 42% 10%, 58% 10%, 65% 0, 83% 4%, 100% 24%, 86% 41%, 79% 31%, 79% 100%, 21% 100%, 21% 31%, 14% 41%, 0 24%);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  }

  .jersey::after {
    content: "";
    position: absolute;
    inset: 9px 18px auto;
    height: 34px;
    border-top: 2px solid rgba(255, 255, 255, 0.22);
    border-radius: 50%;
    pointer-events: none;
  }

  .jersey--empty {
    border: 1px dashed rgba(255, 255, 255, 0.42);
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.84);
    box-shadow: none;
  }

  .jersey-neck {
    width: 20px;
    height: 10px;
    border-radius: 0 0 999px 999px;
    background: rgba(12, 20, 12, 0.42);
  }

  .jersey-label {
    align-self: start;
    font-size: 10px;
    font-weight: 950;
    line-height: 1;
    opacity: 0.86;
  }

  .jersey-number {
    margin-top: -2px;
    font-size: clamp(22px, 4.2vw, 34px);
    font-weight: 1000;
    line-height: 0.9;
  }

  .jersey-name {
    width: 100%;
    overflow-wrap: anywhere;
    font-size: clamp(10px, 2vw, 13px);
    font-weight: 950;
    line-height: 1.05;
    letter-spacing: 0;
  }

  .drag-ghost {
    position: fixed;
    z-index: 9999;
    width: 92px;
    height: 102px;
    pointer-events: none;
    transform: translate(-50%, -50%) rotate(-2deg) scale(1.04);
    filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.36));
  }

  .field-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }

  .field-actions button {
    flex: 1 1 130px;
  }

  .field-actions span {
    width: 100%;
    color: #bdf7c4;
    font-size: 13px;
    font-weight: 800;
  }

  .coach-panel {
    display: grid;
    gap: 14px;
    padding: 14px;
  }

  .selection-box,
  .editor-box,
  .bench-list section {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    padding: 14px;
  }

  .selection-box p,
  .bench-list h2 {
    margin: 0 0 8px;
    color: #ffdc60;
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
  }

  .selection-box strong {
    display: block;
    font-size: 24px;
    line-height: 1.18;
  }

  .selection-box span {
    display: block;
    margin-top: 8px;
    color: rgba(248, 250, 240, 0.66);
    font-size: 13px;
  }

  .editor-box {
    display: grid;
    grid-template-columns: 86px 1fr;
    gap: 10px;
  }

  .editor-box label {
    display: grid;
    gap: 6px;
    color: rgba(248, 250, 240, 0.7);
    font-size: 12px;
    font-weight: 900;
  }

  .editor-box input {
    width: 100%;
    min-height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: #ffffff;
    color: #10210f;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 900;
  }

  .editor-box button {
    grid-column: 1 / -1;
  }

  .bench-list {
    display: grid;
    gap: 10px;
  }

  .bench-list section div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .bench-list .bench-jersey {
    width: 72px;
    height: 82px;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .bench-list .bench-jersey.active {
    filter: drop-shadow(0 0 0.5rem rgba(255, 255, 255, 0.82));
  }

  .bench-list .bench-jersey.dragging-source {
    opacity: 0.42;
  }

  @media (max-width: 900px) {
    .lineup-layout {
      grid-template-columns: 1fr;
    }

    .coach-panel {
      order: -1;
    }

    .pitch {
      min-height: auto;
    }

    .formation-tabs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .lineup-topbar,
    .lineup-shell {
      width: min(100% - 20px, 1180px);
    }

    .field-panel,
    .coach-panel {
      padding: 10px;
    }

    .field-title {
      padding: 12px;
    }

    .field-title strong {
      font-size: 26px;
    }

    .player-token {
      width: 62px;
      height: 72px;
    }

    .bench-list .bench-jersey {
      width: 64px;
      height: 74px;
    }

    .drag-ghost {
      width: 72px;
      height: 82px;
    }

    .editor-box {
      grid-template-columns: 78px 1fr;
    }
  }
`;
