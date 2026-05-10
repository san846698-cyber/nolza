// Traffic Hell — Rush Hour style sliding-block puzzle.
// Grid: 6x6. Player car (red) is always horizontal length 2.
// Exit: right edge at row 2 (the row the player starts in).

export type Orientation = "h" | "v";
export type Length = 2 | 3;

export interface Car {
  id: string;
  x: number; // column 0..5 (top-left corner)
  y: number; // row 0..5 (top-left corner)
  length: Length;
  orientation: Orientation;
  color: string;
}

export interface Level {
  id: number;
  cars: Car[]; // cars[0] must be the player car (id "R", color red, h, len 2)
}

export const GRID = 6;
export const EXIT_ROW = 2;
export const PLAYER_COLOR = "#ef4444";

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#14b8a6", // teal
  "#84cc16", // lime
  "#d946ef", // fuchsia
  "#0ea5e9", // sky
  "#6366f1", // indigo
  "#f43f5e", // rose
  "#a3e635", // lime-light
];

function c(
  id: string,
  x: number,
  y: number,
  length: Length,
  orientation: Orientation,
  idx: number,
): Car {
  return {
    id,
    x,
    y,
    length,
    orientation,
    color: COLORS[idx % COLORS.length],
  };
}

function player(x: number, y: number): Car {
  return {
    id: "R",
    x,
    y,
    length: 2,
    orientation: "h",
    color: PLAYER_COLOR,
  };
}

export const LEVELS: Level[] = [
  // L1: 2 cars
  {
    id: 1,
    cars: [
      player(0, 2),
      c("a", 3, 1, 2, "v", 0),
    ],
  },
  // L2: 3 cars
  {
    id: 2,
    cars: [
      player(0, 2),
      c("a", 3, 1, 2, "v", 0),
      c("b", 5, 0, 3, "v", 1),
    ],
  },
  // L3: 4 cars
  {
    id: 3,
    cars: [
      player(0, 2),
      c("a", 2, 2, 2, "v", 0),
      c("b", 4, 1, 3, "v", 1),
      c("c", 5, 2, 2, "v", 2),
    ],
  },
  // L4: 5 cars
  {
    id: 4,
    cars: [
      player(0, 2),
      c("a", 2, 0, 2, "v", 0),
      c("b", 3, 2, 2, "v", 1),
      c("c", 4, 1, 2, "v", 2),
      c("d", 5, 2, 2, "v", 3),
    ],
  },
  // L5: 6 cars
  {
    id: 5,
    cars: [
      player(0, 2),
      c("a", 0, 0, 3, "h", 0),
      c("b", 2, 1, 2, "v", 1),
      c("c", 3, 2, 2, "v", 2),
      c("d", 4, 0, 3, "v", 3),
      c("e", 5, 3, 2, "v", 4),
    ],
  },
  // L6: 7 cars
  {
    id: 6,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 2, 0, 2, "v", 1),
      c("c", 3, 1, 2, "v", 2),
      c("d", 4, 0, 3, "v", 3),
      c("e", 5, 3, 3, "v", 4),
      c("f", 0, 5, 3, "h", 5),
    ],
  },
  // L7: 8 cars
  {
    id: 7,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "v", 0),
      c("b", 1, 0, 2, "h", 1),
      c("c", 3, 0, 2, "v", 2),
      c("d", 4, 0, 2, "v", 3),
      c("e", 5, 0, 3, "v", 4),
      c("f", 2, 3, 2, "v", 5),
      c("g", 3, 5, 3, "h", 6),
    ],
  },
  // L8: 9 cars
  {
    id: 8,
    cars: [
      player(0, 2),
      c("a", 2, 0, 3, "h", 0),
      c("b", 5, 0, 2, "v", 1),
      c("c", 0, 0, 2, "v", 2),
      c("d", 1, 0, 2, "v", 3),
      c("e", 3, 1, 2, "v", 4),
      c("f", 4, 2, 3, "v", 5),
      c("g", 2, 4, 2, "h", 6),
      c("h", 0, 5, 2, "h", 7),
    ],
  },
  // L9: 10 cars
  {
    id: 9,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "v", 0),
      c("b", 1, 0, 3, "h", 1),
      c("c", 4, 0, 2, "v", 2),
      c("d", 5, 0, 3, "v", 3),
      c("e", 1, 3, 2, "v", 4),
      c("f", 2, 2, 2, "v", 5),
      c("g", 3, 2, 2, "v", 6),
      c("h", 0, 5, 2, "h", 7),
      c("i", 4, 3, 2, "v", 8),
    ],
  },
  // L10: 11 cars
  {
    id: 10,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 2, 0, 2, "h", 1),
      c("c", 4, 0, 2, "v", 2),
      c("d", 5, 0, 3, "v", 3),
      c("e", 0, 3, 2, "v", 4),
      c("f", 1, 3, 2, "v", 5),
      c("g", 2, 2, 2, "v", 6),
      c("h", 3, 2, 2, "v", 7),
      c("i", 4, 3, 2, "v", 8),
      c("j", 2, 5, 2, "h", 9),
    ],
  },
  // L11: 12 cars
  {
    id: 11,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 3, 0, 3, "h", 1),
      c("c", 5, 4, 2, "v", 2),
      c("d", 0, 3, 2, "v", 3),
      c("e", 5, 1, 2, "v", 4),
      c("f", 2, 1, 2, "v", 5),
      c("g", 3, 1, 2, "v", 6),
      c("h", 4, 2, 3, "v", 7),
      c("i", 2, 4, 2, "h", 8),
      c("j", 1, 5, 2, "h", 9),
      c("k", 3, 5, 2, "h", 10),
    ],
  },
  // L12: 13 cars (L11 + h-bar at row 1)
  {
    id: 12,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 3, 0, 3, "h", 1),
      c("c", 5, 4, 2, "v", 2),
      c("d", 0, 3, 2, "v", 3),
      c("e", 5, 1, 2, "v", 4),
      c("f", 2, 1, 2, "v", 5),
      c("g", 3, 1, 2, "v", 6),
      c("h", 4, 2, 3, "v", 7),
      c("i", 2, 4, 2, "h", 8),
      c("j", 1, 5, 2, "h", 9),
      c("k", 3, 5, 2, "h", 10),
      c("l", 0, 1, 2, "h", 11),
    ],
  },
  // L13: 14 cars
  {
    id: 13,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 3, 0, 3, "h", 1),
      c("c", 5, 4, 2, "v", 2),
      c("d", 0, 3, 2, "v", 3),
      c("e", 5, 1, 2, "v", 4),
      c("f", 2, 1, 2, "v", 5),
      c("g", 3, 1, 2, "v", 6),
      c("h", 4, 2, 3, "v", 7),
      c("i", 2, 4, 2, "h", 8),
      c("j", 1, 5, 2, "h", 9),
      c("k", 3, 5, 2, "h", 10),
      c("l", 0, 1, 2, "h", 11),
      c("m", 2, 3, 2, "h", 12),
    ],
  },
  // L14: 13 cars — randomized search produced this 25-move config.
  {
    id: 14,
    cars: [
      player(0, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 2, 0, 2, "h", 1),
      c("c", 4, 0, 3, "v", 2),
      c("d", 5, 0, 2, "v", 3),
      c("e", 1, 1, 3, "h", 4),
      c("f", 0, 3, 2, "v", 5),
      c("g", 1, 4, 2, "v", 6),
      c("h", 2, 3, 2, "v", 7),
      c("i", 3, 3, 2, "h", 8),
      c("j", 3, 4, 2, "h", 9),
      c("k", 5, 4, 2, "v", 10),
      c("l", 2, 5, 3, "h", 11),
    ],
  },
  // L15: 13 cars — final boss, randomized search 36-move config.
  // Player starts at (1,2) instead of (0,2) for this puzzle.
  {
    id: 15,
    cars: [
      player(1, 2),
      c("a", 0, 0, 2, "h", 0),
      c("b", 2, 1, 2, "h", 1),
      c("c", 4, 0, 3, "v", 2),
      c("d", 5, 0, 2, "v", 3),
      c("e", 0, 1, 2, "v", 4),
      c("f", 0, 3, 2, "v", 5),
      c("g", 1, 3, 2, "v", 6),
      c("h", 2, 3, 2, "v", 7),
      c("i", 3, 2, 2, "v", 8),
      c("j", 4, 3, 2, "h", 9),
      c("k", 5, 4, 2, "v", 10),
      c("l", 3, 4, 2, "h", 11),
      c("m", 1, 5, 3, "h", 12),
    ],
  },
];

// ─── Validation helpers ──────────────────────────────────────────────────

export function carCells(car: Car): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  for (let i = 0; i < car.length; i++) {
    if (car.orientation === "h") cells.push([car.x + i, car.y]);
    else cells.push([car.x, car.y + i]);
  }
  return cells;
}

export function inBounds(car: Car): boolean {
  if (car.x < 0 || car.y < 0) return false;
  if (car.orientation === "h") {
    return car.x + car.length <= GRID && car.y < GRID;
  }
  return car.x < GRID && car.y + car.length <= GRID;
}

export function buildOccupancy(cars: Car[]): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: GRID }, () =>
    Array(GRID).fill(null),
  );
  for (const car of cars) {
    for (const [x, y] of carCells(car)) {
      if (x >= 0 && y >= 0 && x < GRID && y < GRID) grid[y][x] = car.id;
    }
  }
  return grid;
}

export function isWin(playerCar: Car): boolean {
  // Player car wins when its right edge reaches the right wall.
  return playerCar.x + playerCar.length === GRID && playerCar.y === EXIT_ROW;
}
