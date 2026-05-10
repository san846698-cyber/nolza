// Standalone verifier: BFS-checks all 15 levels are solvable.
// Run: node lib/traffic/verify.mjs

const GRID = 6;
const EXIT_ROW = 2;

const RAW = [
  // L1
  [["R", 0, 2, 2, "h"], ["a", 3, 1, 2, "v"]],
  // L2
  [["R", 0, 2, 2, "h"], ["a", 3, 1, 2, "v"], ["b", 5, 0, 3, "v"]],
  // L3
  [["R", 0, 2, 2, "h"], ["a", 2, 2, 2, "v"], ["b", 4, 1, 3, "v"], ["c", 5, 2, 2, "v"]],
  // L4
  [["R", 0, 2, 2, "h"], ["a", 2, 0, 2, "v"], ["b", 3, 2, 2, "v"], ["c", 4, 1, 2, "v"], ["d", 5, 2, 2, "v"]],
  // L5
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 3, "h"], ["b", 2, 1, 2, "v"], ["c", 3, 2, 2, "v"], ["d", 4, 0, 3, "v"], ["e", 5, 3, 2, "v"]],
  // L6
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 2, 0, 2, "v"], ["c", 3, 1, 2, "v"], ["d", 4, 0, 3, "v"], ["e", 5, 3, 3, "v"], ["f", 0, 5, 3, "h"]],
  // L7
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "v"], ["b", 1, 0, 2, "h"], ["c", 3, 0, 2, "v"], ["d", 4, 0, 2, "v"], ["e", 5, 0, 3, "v"], ["f", 2, 3, 2, "v"], ["g", 3, 5, 3, "h"]],
  // L8
  [["R", 0, 2, 2, "h"], ["a", 2, 0, 3, "h"], ["b", 5, 0, 2, "v"], ["c", 0, 0, 2, "v"], ["d", 1, 0, 2, "v"], ["e", 3, 1, 2, "v"], ["f", 4, 2, 3, "v"], ["g", 2, 4, 2, "h"], ["h", 0, 5, 2, "h"]],
  // L9
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "v"], ["b", 1, 0, 3, "h"], ["c", 4, 0, 2, "v"], ["d", 5, 0, 3, "v"], ["e", 1, 3, 2, "v"], ["f", 2, 2, 2, "v"], ["g", 3, 2, 2, "v"], ["h", 0, 5, 2, "h"], ["i", 4, 3, 2, "v"]],
  // L10
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 2, 0, 2, "h"], ["c", 4, 0, 2, "v"], ["d", 5, 0, 3, "v"], ["e", 0, 3, 2, "v"], ["f", 1, 3, 2, "v"], ["g", 2, 2, 2, "v"], ["h", 3, 2, 2, "v"], ["i", 4, 3, 2, "v"], ["j", 2, 5, 2, "h"]],
  // L11
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 3, 0, 3, "h"], ["c", 5, 4, 2, "v"], ["d", 0, 3, 2, "v"], ["e", 5, 1, 2, "v"], ["f", 2, 1, 2, "v"], ["g", 3, 1, 2, "v"], ["h", 4, 2, 3, "v"], ["i", 2, 4, 2, "h"], ["j", 1, 5, 2, "h"], ["k", 3, 5, 2, "h"]],
  // L12
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 3, 0, 3, "h"], ["c", 5, 4, 2, "v"], ["d", 0, 3, 2, "v"], ["e", 5, 1, 2, "v"], ["f", 2, 1, 2, "v"], ["g", 3, 1, 2, "v"], ["h", 4, 2, 3, "v"], ["i", 2, 4, 2, "h"], ["j", 1, 5, 2, "h"], ["k", 3, 5, 2, "h"], ["l", 0, 1, 2, "h"]],
  // L13
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 3, 0, 3, "h"], ["c", 5, 4, 2, "v"], ["d", 0, 3, 2, "v"], ["e", 5, 1, 2, "v"], ["f", 2, 1, 2, "v"], ["g", 3, 1, 2, "v"], ["h", 4, 2, 3, "v"], ["i", 2, 4, 2, "h"], ["j", 1, 5, 2, "h"], ["k", 3, 5, 2, "h"], ["l", 0, 1, 2, "h"], ["m", 2, 3, 2, "h"]],
  // L14: search-found 25-move layout
  [["R", 0, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 2, 0, 2, "h"], ["c", 4, 0, 3, "v"], ["d", 5, 0, 2, "v"], ["e", 1, 1, 3, "h"], ["f", 0, 3, 2, "v"], ["g", 1, 4, 2, "v"], ["h", 2, 3, 2, "v"], ["i", 3, 3, 2, "h"], ["j", 3, 4, 2, "h"], ["k", 5, 4, 2, "v"], ["l", 2, 5, 3, "h"]],
  // L15: search-found 36-move layout (player starts at col 1)
  [["R", 1, 2, 2, "h"], ["a", 0, 0, 2, "h"], ["b", 2, 1, 2, "h"], ["c", 4, 0, 3, "v"], ["d", 5, 0, 2, "v"], ["e", 0, 1, 2, "v"], ["f", 0, 3, 2, "v"], ["g", 1, 3, 2, "v"], ["h", 2, 3, 2, "v"], ["i", 3, 2, 2, "v"], ["j", 4, 3, 2, "h"], ["k", 5, 4, 2, "v"], ["l", 3, 4, 2, "h"], ["m", 1, 5, 3, "h"]],
];

function checkOverlap(cars) {
  const grid = new Int8Array(GRID * GRID).fill(-1);
  for (let i = 0; i < cars.length; i++) {
    const [, x, y, l, o] = cars[i];
    if (o === "h") {
      if (x + l > GRID || y >= GRID) return `out-of-bounds: ${cars[i][0]}`;
      for (let k = 0; k < l; k++) {
        if (grid[y * GRID + (x + k)] !== -1)
          return `overlap at (${x + k},${y}) — ${cars[i][0]} vs ${cars[grid[y * GRID + (x + k)]][0]}`;
        grid[y * GRID + (x + k)] = i;
      }
    } else {
      if (x >= GRID || y + l > GRID) return `out-of-bounds: ${cars[i][0]}`;
      for (let k = 0; k < l; k++) {
        if (grid[(y + k) * GRID + x] !== -1)
          return `overlap at (${x},${y + k}) — ${cars[i][0]} vs ${cars[grid[(y + k) * GRID + x]][0]}`;
        grid[(y + k) * GRID + x] = i;
      }
    }
  }
  return null;
}

function buildGrid(meta, pos) {
  const grid = new Int8Array(GRID * GRID).fill(-1);
  for (let i = 0; i < meta.length; i++) {
    const m = meta[i];
    if (m.o === "h") {
      const y = m.f, x = pos[i];
      for (let k = 0; k < m.l; k++) grid[y * GRID + (x + k)] = i;
    } else {
      const x = m.f, y = pos[i];
      for (let k = 0; k < m.l; k++) grid[(y + k) * GRID + x] = i;
    }
  }
  return grid;
}

function solve(cars) {
  const meta = cars.map(([, x, y, l, o]) => ({ l, o, f: o === "h" ? y : x }));
  const startPos = cars.map(([, x, y, , o]) => (o === "h" ? x : y));
  const isWin = (pos) => {
    const m0 = meta[0];
    return m0.o === "h" && m0.f === EXIT_ROW && pos[0] + m0.l === GRID;
  };
  if (isWin(startPos)) return 0;
  const seen = new Set();
  seen.add(startPos.join(","));
  let frontier = [startPos];
  let depth = 0;
  while (frontier.length > 0) {
    depth++;
    const next = [];
    for (const pos of frontier) {
      const grid = buildGrid(meta, pos);
      for (let i = 0; i < meta.length; i++) {
        const m = meta[i];
        const p = pos[i];
        if (m.o === "h") {
          const y = m.f;
          for (let nx = p - 1; nx >= 0; nx--) {
            if (grid[y * GRID + nx] !== -1) break;
            const np = pos.slice(); np[i] = nx;
            const k = np.join(",");
            if (seen.has(k)) continue;
            seen.add(k);
            if (isWin(np)) return depth;
            next.push(np);
          }
          for (let nx = p + 1; nx + m.l <= GRID; nx++) {
            if (grid[y * GRID + (nx + m.l - 1)] !== -1) break;
            const np = pos.slice(); np[i] = nx;
            const k = np.join(",");
            if (seen.has(k)) continue;
            seen.add(k);
            if (isWin(np)) return depth;
            next.push(np);
          }
        } else {
          const x = m.f;
          for (let ny = p - 1; ny >= 0; ny--) {
            if (grid[ny * GRID + x] !== -1) break;
            const np = pos.slice(); np[i] = ny;
            const k = np.join(",");
            if (seen.has(k)) continue;
            seen.add(k);
            if (isWin(np)) return depth;
            next.push(np);
          }
          for (let ny = p + 1; ny + m.l <= GRID; ny++) {
            if (grid[(ny + m.l - 1) * GRID + x] !== -1) break;
            const np = pos.slice(); np[i] = ny;
            const k = np.join(",");
            if (seen.has(k)) continue;
            seen.add(k);
            if (isWin(np)) return depth;
            next.push(np);
          }
        }
      }
    }
    frontier = next;
    if (depth > 200) return null;
  }
  return null;
}

let allOk = true;
for (let i = 0; i < RAW.length; i++) {
  const cars = RAW[i];
  const overlap = checkOverlap(cars);
  if (overlap) {
    console.log(`L${i + 1}: BAD LAYOUT — ${overlap}`);
    allOk = false;
    continue;
  }
  const t0 = Date.now();
  const moves = solve(cars);
  const ms = Date.now() - t0;
  if (moves === null) {
    console.log(`L${i + 1}: UNSOLVABLE (${cars.length} cars, ${ms}ms)`);
    allOk = false;
  } else {
    console.log(`L${i + 1}: ${moves} moves (${cars.length} cars, ${ms}ms)`);
  }
}

process.exit(allOk ? 0 : 1);
