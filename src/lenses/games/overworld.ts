// The overworld map: one canvas, one winding road, a player who walks between levels and picks up
// a coin per road. The level list under it is the real navigation; this is the enhancement.
import { MAP as M } from './palette';
import { progress, save, visit } from './progress';
import { buildings, coinFrames, pixelCanvas, playerFrames, rock, tree, type BuildingKind } from './sprites';

export interface MapNode {
  /** `world:node`, matching its dialog's `data-node`. */
  id: string;
  sprite: BuildingKind;
  label: string;
  /** Set on a level. */
  slug?: string;
  /** Set on a node that leads to another world. */
  to?: number;
}

const T = 16;
const COLS = 20;
const ROWS = 11;
const W = COLS * T;
const H = ROWS * T;

/** The road, in tiles: START, up to seven games, then GOAL. */
const ROUTE = [[1, 8], [5, 8], [5, 3], [9, 3], [9, 7], [13, 7], [13, 2], [17, 2], [17, 7]];
const RIVER = 11;
const POND = { x: 1, y: 1, w: 3, h: 2 };
const SEED = 11;
const SPEED = 72;
const TOAST_MS = 3200;

const KEYS: Record<string, [number, number]> = {
  arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1],
  a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1],
};

const point = (i: number) => ({ x: ROUTE[i][0] * T + 8, y: ROUTE[i][1] * T + 8 });
const distance = (a: number, b: number) => Math.abs(point(a).x - point(b).x) + Math.abs(point(a).y - point(b).y);
const heading = (a: number, b: number) => [Math.sign(ROUTE[b][0] - ROUTE[a][0]), Math.sign(ROUTE[b][1] - ROUTE[a][1])];
const isWater = (x: number, y: number) =>
  x === RIVER || (x >= POND.x && x < POND.x + POND.w && y >= POND.y && y < POND.y + POND.h);

// Same seed, same map on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ground, water, roads, bridges, trees and rocks for a world of `count` nodes. Drawn once, reused every frame. */
function paintTerrain(count: number) {
  const { canvas, ctx, rect } = pixelCanvas(W, H);
  const road = new Set<string>();
  const segments = Array.from({ length: count - 1 }, (_, i) => [point(i), point(i + 1)]);
  for (let i = 0; i < count - 1; i++) {
    const [dx, dy] = heading(i, i + 1);
    for (let [x, y] = ROUTE[i]; ; x += dx, y += dy) {
      road.add(`${x},${y}`);
      if (x === ROUTE[i + 1][0] && y === ROUTE[i + 1][1]) break;
    }
  }
  const nearRoad = (x: number, y: number) =>
    [-1, 0, 1].some((dx) => [-1, 0, 1].some((dy) => road.has(`${x + dx},${y + dy}`)));

  rect(M.ground, 0, 0, W, H);
  const tuft = seeded(SEED);
  for (let i = 0; i < COLS * ROWS * 2; i++) rect(M.groundD, Math.floor(tuft() * (W - 2)), Math.floor(tuft() * H), 2);

  const water: [number, number][] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!isWater(x, y)) continue;
      if (!road.has(`${x},${y}`)) water.push([x, y]);
      rect(M.water, x * T, y * T, T, T);
      // The river runs off the map, so the map's edge is not a bank.
      const bank = (nx: number, ny: number) => ny >= 0 && ny < ROWS && !isWater(nx, ny);
      if (bank(x - 1, y)) rect(M.waterD, x * T, y * T, 1, T);
      if (bank(x + 1, y)) rect(M.waterD, x * T + T - 1, y * T, 1, T);
      if (bank(x, y - 1)) rect(M.waterD, x * T, y * T, T, 1);
      if (bank(x, y + 1)) rect(M.waterD, x * T, y * T + T - 1, T, 1);
    }
  }

  // Edges first, then fills, so corners join cleanly.
  for (const [half, colour] of [[6, M.roadEdge], [5, M.road]] as const) {
    for (const [a, b] of segments) {
      const x = Math.min(a.x, b.x) - half;
      const y = Math.min(a.y, b.y) - half;
      rect(colour, x, y, Math.abs(a.x - b.x) + half * 2, Math.abs(a.y - b.y) + half * 2);
    }
  }

  // A road over water becomes a bridge.
  for (const [a, b] of segments) {
    const across = a.y === b.y;
    for (const key of road) {
      const [x, y] = key.split(',').map(Number);
      const onSegment = across
        ? y * T + 8 === a.y && x * T + 8 > Math.min(a.x, b.x) && x * T + 8 < Math.max(a.x, b.x)
        : x * T + 8 === a.x && y * T + 8 > Math.min(a.y, b.y) && y * T + 8 < Math.max(a.y, b.y);
      if (!onSegment || !isWater(x, y)) continue;
      const plank = (along: number, colour: string, from = -7, size = 14) =>
        across ? rect(colour, x * T + along, a.y + from, 1, size) : rect(colour, a.x + from, y * T + along, size, 1);
      for (let along = -1; along <= T; along++) plank(along, along % 4 === 3 ? M.woodD : M.wood);
      for (let along = -1; along <= T; along++) [-7, 6].forEach((rail) => plank(along, M.ink, rail, 1));
    }
  }

  // Every tile takes three draws whether or not it is used, so the trees stay put from world to world.
  const scatter = seeded(SEED);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const [kind, a, b] = [scatter(), scatter(), scatter()];
      if (isWater(x, y) || nearRoad(x, y)) continue;
      const px = x * T + Math.floor(a * 3);
      const py = y * T + Math.floor(b * 2);
      if (kind < 0.16) {
        rect(M.shadow, px + 2, py + 14, 10, 2);
        ctx.drawImage(tree, px, py);
      } else if (kind < 0.21) {
        rect(M.shadow, px + 3, py + 13, 8, 2);
        ctx.drawImage(rock, px + 2, py + 7);
      } else if (kind < 0.3) {
        rect(M.road, px + 4, py + 6);
        rect(M.road, px + 9, py + 10);
      }
    }
  }
  return { layer: canvas, water };
}

/** Starts the map inside `root` (`[data-overworld]`). Returns a function that stops it. */
export function mountOverworld(root: HTMLElement, worlds: MapNode[][]) {
  const canvas = root.querySelector('canvas')!;
  const frame = canvas.parentElement!;
  const ctx = canvas.getContext('2d')!;
  const toast = root.querySelector<HTMLElement>('.toast')!;
  const dialogs = document.querySelectorAll<HTMLElement>('.dialog[data-node]');
  const rows = document.querySelectorAll<HTMLAnchorElement>('a[data-level]');
  const hud = (name: string) => document.querySelector<HTMLElement>(`[data-hud="${name}"]`);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stop = new AbortController();
  const { signal } = stop;

  const levelCount = worlds.flat().filter(({ slug }) => slug).length;
  const coinCount = worlds.reduce((sum, nodes) => sum + nodes.length - 1, 0);

  let world = 0;
  let nodes = worlds[0];
  let terrain = paintTerrain(nodes.length);
  let labels: HTMLElement[] = [];
  /** The node the player stands on, or last stood on. */
  let at = 0;
  /** A road being walked: `done` px along it, heading for `target`. */
  let walk: { from: number; to: number; done: number; target: number } | undefined;
  let facing: 'left' | 'right' = 'right';
  let sparks: { x: number; y: number; born: number }[] = [];
  let time = 0;
  let scale = 1;

  // ── State → page ──
  const toasts: string[][] = [];
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  function nextToast() {
    const next = toasts.shift();
    toast.classList.toggle('show', !!next);
    if (!next) return (toastTimer = undefined);
    toast.replaceChildren(document.createElement('i'), next[0], Object.assign(document.createElement('span'), { textContent: next[1] }));
    toastTimer = setTimeout(nextToast, TOAST_MS);
  }
  function achieve(name: string, detail: string) {
    if (progress.shown.includes(name)) return;
    progress.shown.push(name);
    toasts.push([name, detail]);
    if (!toastTimer) nextToast();
  }

  function sync() {
    const node = nodes[at];
    labels.forEach((label, i) => {
      label.classList.toggle('on', i === at);
      label.classList.toggle('done', progress.visited.includes(nodes[i].slug ?? ''));
    });
    for (const dialog of dialogs) dialog.hidden = dialog.dataset.node !== node.id;
    for (const row of rows) {
      const done = progress.visited.includes(row.dataset.level!);
      const status = row.querySelector('.st')!;
      status.textContent = done ? 'visited' : 'not yet';
      status.classList.toggle('done', done);
      if (row.dataset.level === node.slug) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    }
    const set = (name: string, text: string) => hud(name)?.replaceChildren(text);
    set('coins', `${progress.coins.length}/${coinCount}`);
    set('levels', `${progress.visited.length}/${levelCount}`);
    set('world', `${world + 1}/${worlds.length}`);
    if (progress.visited.length >= levelCount) achieve('explorer', 'visited every level');
    if (progress.coins.length >= coinCount) achieve('coin collector', `picked up all ${coinCount} coins`);
    save();
  }

  function arrive() {
    const node = nodes[at];
    progress.at = node.id;
    if (node.slug) visit(node.slug);
    sync();
  }

  function enterWorld(next: number, node: number) {
    world = next;
    nodes = worlds[world];
    terrain = paintTerrain(nodes.length);
    for (const label of labels) label.remove();
    labels = nodes.map((node, i) => {
      const { x, y } = point(i);
      const label = document.createElement('span');
      label.className = `lbl${x < 40 ? ' l' : x > 290 ? ' r' : ''}`;
      label.textContent = node.label;
      label.setAttribute('aria-hidden', 'true');
      label.style.left = `${(x / W) * 100}%`;
      label.style.top = `${((y - 19) / H) * 100}%`;
      return frame.appendChild(label);
    });
    at = node;
    walk = undefined;
    arrive();
  }

  /** Follows a world node into its world, arriving at the matching end of the road. */
  function travel() {
    const { to } = nodes[at];
    if (to !== undefined && !walk) enterWorld(to, to > world ? 0 : worlds[to].length - 1);
  }

  // ── Movement ──
  function face(from: number, to: number) {
    const [dx] = heading(from, to);
    if (dx) facing = dx < 0 ? 'left' : 'right';
  }

  function go(target: number) {
    if (!nodes[target]) return;
    if (!walk) {
      if (target === at) return;
      walk = { from: at, to: at + Math.sign(target - at), done: 0, target };
    } else {
      walk.target = target;
      const ahead = walk.to > walk.from ? target >= walk.to : target <= walk.to;
      // The target is behind: turn round where the player stands.
      if (!ahead) walk = { from: walk.to, to: walk.from, done: distance(walk.from, walk.to) - walk.done, target };
    }
    face(walk.from, walk.to);
  }

  /** Takes the road that leaves in this direction. False when there is none. */
  function steer(dx: number, dy: number) {
    const from = walk ? walk.to : at;
    const options = walk ? [walk.from, 2 * walk.to - walk.from] : [at - 1, at + 1];
    const next = options.find((i) => {
      if (!nodes[i]) return false;
      const [hx, hy] = heading(from, i);
      return hx === dx && hy === dy;
    });
    if (next === undefined) return !!walk;
    go(next);
    return true;
  }

  function step(dt: number) {
    if (!walk) return;
    let before = walk.done;
    walk.done += (still ? 1500 : SPEED) * dt;
    for (;;) {
      const length = distance(walk.from, walk.to);
      const coin = `${world}:${Math.min(walk.from, walk.to)}`;
      if (before < length / 2 && walk.done >= length / 2 && !progress.coins.includes(coin)) {
        progress.coins.push(coin);
        const [a, b] = [point(walk.from), point(walk.to)];
        if (!still) sparks.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, born: time });
        sync();
      }
      if (walk.done < length) return;
      at = walk.to;
      if (at === walk.target) {
        walk = undefined;
        return arrive();
      }
      walk = { from: at, to: at + Math.sign(walk.target - at), done: walk.done - length, target: walk.target };
      before = 0;
      face(walk.from, walk.to);
    }
  }

  // ── Drawing ──
  const rect = (colour: string, x: number, y: number, w = 1, h = 1) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);
  };

  function draw() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(terrain.layer, 0, 0);

    const beat = Math.floor(time * 2);
    for (const [x, y] of terrain.water) {
      const phase = (beat + x * 3 + y * 5) % 4;
      rect(M.waterL, x * T + 2 + phase * 3, y * T + 4, 3);
      rect(M.waterL, x * T + 11 - phase * 3, y * T + 11, 2);
    }

    for (let road = 0; road < nodes.length - 1; road++) {
      if (progress.coins.includes(`${world}:${road}`)) continue;
      const [a, b] = [point(road), point(road + 1)];
      const frame = coinFrames[Math.floor(time * 8) % 4];
      const [x, y] = [(a.x + b.x) / 2, (a.y + b.y) / 2];
      rect(M.shadow, x - 3, y + 4, 6, 2);
      ctx.drawImage(frame, x - frame.width / 2, y - 5);
    }

    nodes.forEach((node, i) => {
      const { x, y } = point(i);
      const current = !walk && i === at;
      rect(M.shadow, x - 7, y + 1, 14, 2);
      if (current) {
        // The ring round the current level, pulsing by a pixel.
        const [hw, hh] = [12 + (beat % 2), 6 + (beat % 2)];
        const cy = y + 2;
        rect(M.ink, x - hw + 2, cy - hh, hw * 2 - 4);
        rect(M.ink, x - hw + 2, cy + hh, hw * 2 - 4);
        rect(M.ink, x - hw, cy - hh + 2, 1, hh * 2 - 3);
        rect(M.ink, x + hw - 1, cy - hh + 2, 1, hh * 2 - 3);
        for (const [px, py] of [[x - hw + 1, cy - hh + 1], [x + hw - 2, cy - hh + 1], [x - hw + 1, cy + hh - 1], [x + hw - 2, cy + hh - 1]]) rect(M.ink, px, py);
      }
      const top = y - 16 - (current ? 3 : 0);
      ctx.drawImage(buildings[node.sprite], x - 9, top);
      // Torch flicker
      if (node.sprite === 'onchain' && beat % 2) for (const tx of [2, 13]) rect(M.goldL, x - 8 + tx, top + 9);
    });

    sparks = sparks.filter(({ born }) => time - born < 0.45);
    for (const { x, y, born } of sparks) {
      const age = time - born;
      for (const dx of [-3, -1, 1, 3]) rect(M.gold, Math.round(x + dx * (1 + age * 3)), Math.round(y - 6 - age * 30 + Math.abs(dx) * age * 12));
    }

    let { x, y } = point(at);
    if (walk) {
      const [a, b] = [point(walk.from), point(walk.to)];
      const along = Math.min(walk.done / distance(walk.from, walk.to), 1);
      x = Math.round(a.x + (b.x - a.x) * along);
      y = Math.round(a.y + (b.y - a.y) * along);
    }
    // On the road the player walks its middle; at a level they step forward, clear of the building.
    const feet = y + (walk ? 2 : 7);
    const bob = walk ? 0 : beat % 2;
    rect(M.shadow, x - 5, feet, 10, 2);
    ctx.drawImage(playerFrames[facing][walk ? Math.floor(time * 8) % 2 : 0], x - 6, feet - 13 - bob);
  }

  // ── Loop: runs only while the map is on screen in a visible tab ──
  let raf = 0;
  let last = 0;
  let onScreen = false;
  /** At least 35% in view: the arrow keys belong to the map. */
  let inView = false;
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    // The first frame's timestamp can predate `last`.
    const dt = Math.min(Math.max(now - last, 0) / 1000, 0.1);
    last = now;
    if (!still) time += dt;
    step(dt);
    draw();
  }
  function run() {
    cancelAnimationFrame(raf);
    raf = 0;
    if (!onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  const seen = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      inView = entry.intersectionRatio >= 0.35;
      run();
    },
    { threshold: [0, 0.35] },
  );
  seen.observe(root);
  document.addEventListener('visibilitychange', run, { signal });

  // Whole-number scale: each map pixel covers the same number of canvas pixels.
  const sized = new ResizeObserver(() => {
    scale = Math.max(1, Math.ceil((canvas.clientWidth * devicePixelRatio) / W));
    if (canvas.width === W * scale) return;
    canvas.width = W * scale;
    canvas.height = H * scale;
    draw();
  });
  sized.observe(canvas);

  // ── Input ──
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as Element).closest?.('input, textarea, select, [contenteditable]')) return;
      const focused = document.activeElement === canvas;
      if (!focused && !inView) return;
      const direction = KEYS[event.key.toLowerCase()];
      if (direction) {
        // No road that way: leave the key to the page, so it still scrolls.
        if (steer(...direction)) event.preventDefault();
      } else if (event.key === 'Enter' && focused && !walk) {
        document.querySelector<HTMLElement>('.dialog:not([hidden]) [data-primary]')?.click();
      }
    },
    { signal },
  );

  canvas.addEventListener(
    'click',
    (event) => {
      const box = canvas.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * W;
      const y = ((event.clientY - box.top) / box.height) * H;
      // Aim at the building, which stands a little above its spot on the road.
      const near = nodes
        .map((_, i) => ({ i, d: Math.hypot(point(i).x - x, point(i).y - 5 - y) }))
        .sort((a, b) => a.d - b.d)[0];
      if (near.d <= 15) go(near.i);
    },
    { signal },
  );

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element;
      if (target.closest('[data-next]')) return go((walk?.target ?? at) + 1);
      if (target.closest('[data-travel]')) return travel();

      // A level in the list: the first click walks there, the second follows the link.
      // Keyboard activation and modified clicks go straight to the page.
      const row = target.closest<HTMLAnchorElement>('a[data-level]');
      if (!row || event.detail === 0 || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const [w, i] = row.dataset.node!.split(':').map(Number);
      if (w === world && i === at && !walk) return;
      event.preventDefault();
      if (w !== world) enterWorld(w, w > world ? 0 : worlds[w].length - 1);
      go(i);
      root.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
    },
    // Capture, to get in before the client router takes the link.
    { signal, capture: true },
  );

  // Back from a level page, or a reload: stand where the visitor left off.
  const [savedWorld, savedNode] = (progress.at ?? '0:0').split(':').map(Number);
  if (worlds[savedWorld]?.[savedNode]) enterWorld(savedWorld, savedNode);
  else enterWorld(0, 0);

  return () => {
    stop.abort();
    seen.disconnect();
    sized.disconnect();
    cancelAnimationFrame(raf);
    clearTimeout(toastTimer);
    for (const label of labels) label.remove();
  };
}
