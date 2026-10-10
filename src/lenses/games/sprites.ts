// Every sprite on the map, drawn in code from the map palette. Nothing here is copied from a game.
import { MAP as M, PLAYER as P } from './palette';

export type BuildingKind = 'house' | 'castle' | 'sign-next' | 'sign-back' | 'onchain' | 'jam' | 'multiplayer' | 'other';

type Rect = (colour: string, x: number, y: number, w?: number, h?: number) => void;

export function pixelCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const rect: Rect = (colour, x, y, rw = 1, rh = 1) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, rw, rh);
  };
  return { canvas, ctx, rect };
}

/** Draws a sprite and wraps it in a 1px ink outline; the result is 2px larger each way. */
function stamp(w: number, h: number, draw: (rect: Rect) => void) {
  const art = pixelCanvas(w, h);
  draw(art.rect);
  const ink = pixelCanvas(w, h);
  ink.ctx.drawImage(art.canvas, 0, 0);
  ink.ctx.globalCompositeOperation = 'source-in';
  ink.rect(M.ink, 0, 0, w, h);
  const out = pixelCanvas(w + 2, h + 2);
  for (const [dx, dy] of [[0, 1], [2, 1], [1, 0], [1, 2]]) out.ctx.drawImage(ink.canvas, dx, dy);
  out.ctx.drawImage(art.canvas, 1, 1);
  return out.canvas;
}

const sign = (next: boolean) => (r: Rect) => {
  r(M.woodD, 7, 8, 2, 8);
  r(M.wood, 2, 2, 12, 7);
  r(M.road, 3, 3, 10, 5);
  r(M.ink, 5, 5, 6);
  r(M.ink, next ? 9 : 6, 4, 1, 3);
};

const draw: Record<BuildingKind, (r: Rect) => void> = {
  // START
  house(r) {
    r(M.rock, 11, 1, 2, 3);
    [[6, 4], [4, 8], [3, 10], [2, 12], [1, 14]].forEach(([x, w], i) => r(M.woodD, x, 2 + i, w));
    r(M.wood, 6, 2, 4);
    r(M.road, 3, 7, 10, 9);
    r(M.roadEdge, 3, 15, 10);
    r(M.woodD, 7, 11, 3, 5);
    r(M.gold, 4, 9, 2, 2);
    r(M.gold, 11, 9, 2, 2);
  },
  // GOAL
  castle(r) {
    r(M.rock, 2, 8, 12, 8);
    r(M.rock, 2, 6, 2, 2);
    r(M.rock, 12, 6, 2, 2);
    r(M.rockL, 2, 8, 12);
    r(M.rockL, 6, 5, 4, 11);
    r(M.rockL, 5, 4, 6, 2);
    r(M.ink, 7, 11, 2, 5);
    r(M.ink, 4, 11, 1, 2);
    r(M.ink, 11, 11, 1, 2);
    r(M.ink, 7, 0, 1, 4);
    r(M.gold, 8, 0, 3, 2);
  },
  'sign-next': sign(true),
  'sign-back': sign(false),
  // Dungeon mouth with torches
  onchain(r) {
    r(M.rock, 3, 3, 10);
    r(M.rock, 2, 4, 12);
    r(M.rock, 1, 5, 14, 11);
    r(M.rockL, 4, 4, 6);
    r(M.rockL, 2, 6, 2);
    r(M.ink, 6, 8, 4);
    r(M.ink, 5, 9, 6, 7);
    for (const x of [2, 13]) {
      r(M.woodD, x, 10, 1, 3);
      r(M.gold, x, 8, 1, 2);
    }
  },
  // Tent
  jam(r) {
    for (let y = 3; y < 16; y++) {
      const half = 1 + Math.floor(((y - 3) * 7) / 12);
      for (let x = 8 - half; x < 8 + half; x++) r((x >> 1) % 2 ? M.road : M.waterD, x, y);
    }
    for (let y = 10; y < 16; y++) {
      const half = 1 + Math.floor((y - 10) / 2);
      r(M.ink, 8 - half, y, half * 2);
    }
    r(M.ink, 7, 0, 1, 3);
    r(M.leafD, 8, 0, 3, 2);
  },
  // City block
  multiplayer(r) {
    r(M.rock, 1, 6, 5, 10);
    r(M.rockL, 6, 2, 5, 14);
    r(M.waterD, 11, 8, 4, 8);
    for (const [x, y] of [[2, 8], [4, 11], [7, 4], [9, 7], [7, 10], [9, 13], [12, 13]]) r(M.ink, x, y, 1, 2);
    for (const [x, y] of [[4, 8], [2, 11], [9, 4], [7, 7], [9, 10], [12, 10]]) r(M.gold, x, y, 1, 2);
  },
  // Scroll
  other(r) {
    r(M.road, 3, 5, 10, 9);
    for (const y of [4, 13]) {
      r(M.wood, 2, y, 12, 2);
      r(M.woodD, 2, y, 1, 2);
      r(M.woodD, 13, y, 1, 2);
    }
    r(M.roadEdge, 5, 7, 6);
    r(M.roadEdge, 5, 9, 5);
    r(M.roadEdge, 5, 11, 6);
  },
};

/** 18 × 18: a 16 × 16 building in its outline. */
export const buildings = Object.fromEntries(
  Object.entries(draw).map(([kind, fn]) => [kind, stamp(16, 16, fn)]),
) as Record<BuildingKind, HTMLCanvasElement>;

export const tree = stamp(12, 14, (r) => {
  r(M.trunk, 5, 10, 2, 4);
  r(M.leaf, 3, 0, 6);
  r(M.leaf, 1, 1, 10);
  r(M.leaf, 0, 2, 12, 6);
  r(M.leaf, 1, 8, 10);
  r(M.leaf, 3, 9, 6);
  r(M.leafL, 3, 1, 4);
  r(M.leafL, 1, 3, 2, 2);
  r(M.leafL, 5, 3, 2);
  r(M.leafD, 9, 4, 2, 2);
  r(M.leafD, 7, 6, 4, 2);
  r(M.leafD, 3, 8, 6);
});

export const rock = stamp(8, 6, (r) => {
  r(M.rock, 2, 0, 4);
  r(M.rock, 1, 1, 6);
  r(M.rock, 0, 2, 8, 4);
  r(M.rockL, 2, 1, 3);
  r(M.rockL, 1, 2, 2);
});

/** The coin's four-frame spin. */
export const coinFrames = [6, 4, 2, 4].map((w) =>
  stamp(w, 6, (r) => {
    if (w === 2) r(M.gold, 0, 0, 2, 6);
    else {
      r(M.gold, 1, 0, w - 2, 6);
      r(M.gold, 0, 1, w, 4);
      r(M.goldD, w - 2, 4);
    }
    r(M.goldL, w === 2 ? 0 : 1, 1, 1, 2);
  }),
);

// The player, facing right. The outline is in the rows.
const ink: Record<string, string> = {
  o: M.ink, h: P.hair, s: P.skin, g: P.scarf, t: P.tunic, T: P.tunicD, p: P.trousers,
};
const BODY = [
  '...oooooo...',
  '..ohhhhhho..',
  '.ohhhhhhhho.',
  '.ohhsssssho.',
  '.ohssssosso.',
  '.ohssssssso.',
  '..osssssso..',
  '.oggggggggo.',
  '.otttttttTo.',
  'ostttttttTso',
  '.otttttttTo.',
  '..oppppppo..',
];
const LEGS = [
  ['..oppooppo..', '..ooo..ooo..'],
  ['.oppo..oppo.', '.ooo....ooo.'],
];

function player(legs: string[], mirrored: boolean) {
  const { canvas, rect } = pixelCanvas(12, 14);
  [...BODY, ...legs].forEach((row, y) =>
    [...row].forEach((c, x) => c !== '.' && rect(ink[c], mirrored ? 11 - x : x, y)),
  );
  return canvas;
}

/** 12 × 14, two walking frames per facing. */
export const playerFrames = {
  right: LEGS.map((legs) => player(legs, false)),
  left: LEGS.map((legs) => player(legs, true)),
};

/** The brand mark: the player's head, into a 20 × 20 canvas. */
export function drawBrand(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 20, 20);
  ctx.drawImage(playerFrames.right[0], 0, 0, 12, 8, 4, 6, 12, 8);
}

/** A building into a 20 × 20 canvas, for the level dialog. */
export function drawBuilding(canvas: HTMLCanvasElement, kind: BuildingKind) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 20, 20);
  ctx.drawImage(buildings[kind], 1, 1);
}
