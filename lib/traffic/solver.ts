// BFS solver for the Traffic Hell board.
// Each "move" = one car slides any number of cells in one direction.

import { Car, GRID, EXIT_ROW } from "./levels";

interface Snapshot {
  // For each car, the variable axis position (x for horizontal, y for vertical).
  positions: number[];
}

interface CarMeta {
  id: string;
  length: 2 | 3;
  orientation: "h" | "v";
  fixed: number; // y for horizontal (constant), x for vertical
}

function snapshot(cars: Car[]): Snapshot {
  return {
    positions: cars.map((c) => (c.orientation === "h" ? c.x : c.y)),
  };
}

function key(s: Snapshot): string {
  return s.positions.join(",");
}

function buildMeta(cars: Car[]): CarMeta[] {
  return cars.map((c) => ({
    id: c.id,
    length: c.length,
    orientation: c.orientation,
    fixed: c.orientation === "h" ? c.y : c.x,
  }));
}

function buildGrid(meta: CarMeta[], pos: number[]): Int8Array {
  // Single 36-byte grid: -1 empty, else car index.
  const grid = new Int8Array(GRID * GRID).fill(-1);
  for (let i = 0; i < meta.length; i++) {
    const m = meta[i];
    if (m.orientation === "h") {
      const y = m.fixed;
      const x = pos[i];
      for (let k = 0; k < m.length; k++) grid[y * GRID + (x + k)] = i;
    } else {
      const x = m.fixed;
      const y = pos[i];
      for (let k = 0; k < m.length; k++) grid[(y + k) * GRID + x] = i;
    }
  }
  return grid;
}

function isWinSnapshot(meta: CarMeta[], pos: number[]): boolean {
  // Player is index 0. It wins when its x + length == GRID.
  const p = meta[0];
  return p.orientation === "h" && p.fixed === EXIT_ROW && pos[0] + p.length === GRID;
}

function* generateMoves(
  meta: CarMeta[],
  pos: number[],
): Generator<number[]> {
  const grid = buildGrid(meta, pos);
  for (let i = 0; i < meta.length; i++) {
    const m = meta[i];
    const p = pos[i];
    if (m.orientation === "h") {
      const y = m.fixed;
      // slide left
      for (let nx = p - 1; nx >= 0; nx--) {
        if (grid[y * GRID + nx] !== -1) break;
        const next = pos.slice();
        next[i] = nx;
        yield next;
      }
      // slide right
      for (let nx = p + 1; nx + m.length <= GRID; nx++) {
        if (grid[y * GRID + (nx + m.length - 1)] !== -1) break;
        const next = pos.slice();
        next[i] = nx;
        yield next;
      }
    } else {
      const x = m.fixed;
      // slide up
      for (let ny = p - 1; ny >= 0; ny--) {
        if (grid[ny * GRID + x] !== -1) break;
        const next = pos.slice();
        next[i] = ny;
        yield next;
      }
      // slide down
      for (let ny = p + 1; ny + m.length <= GRID; ny++) {
        if (grid[(ny + m.length - 1) * GRID + x] !== -1) break;
        const next = pos.slice();
        next[i] = ny;
        yield next;
      }
    }
  }
}

export interface SolveResult {
  moves: number;
}

/** BFS for the minimum number of moves to win. Returns null if unsolvable. */
export function solve(cars: Car[]): SolveResult | null {
  const meta = buildMeta(cars);
  const start = snapshot(cars);
  if (isWinSnapshot(meta, start.positions)) return { moves: 0 };

  const seen = new Set<string>();
  seen.add(key(start));
  let frontier: number[][] = [start.positions];
  let depth = 0;

  while (frontier.length > 0) {
    depth++;
    const next: number[][] = [];
    for (const pos of frontier) {
      for (const np of generateMoves(meta, pos)) {
        const k = np.join(",");
        if (seen.has(k)) continue;
        seen.add(k);
        if (isWinSnapshot(meta, np)) return { moves: depth };
        next.push(np);
      }
    }
    frontier = next;
    if (depth > 200) break; // safety cap
  }
  return null;
}
