// The inspector's working parts: selection, the Elements tree, live CSS toggles, --accent, the
// box model, the grid overlay, device mode and the Console. The page is complete without any of it.
import { accents, registry, type InspectorData } from './registry';

// The page's container-query breakpoint (inspector.css).
const NARROW = 560;
// Classes the inspector itself adds; the tree and selectors leave them out.
const STATE_CLASSES = ['is-inspected', 'is-hovered', 'show-grid'];
const wide = matchMedia('(min-width: 720px)');
const accentHexes = accents.map(([hex]) => hex);

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
const span = (className: string, text: string) => {
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  return node;
};
/** `8 8 8 8` → `8`, `8 4 8 4` → `8 4` */
const shorthand = (sides: number[]) => {
  const [t, r, b, l] = sides.map(Math.round);
  if (t === r && r === b && b === l) return `${t}`;
  if (t === b && r === l) return `${t} ${r}`;
  return `${t} ${r} ${b} ${l}`;
};

let frameObserver: ResizeObserver | undefined;
let leaveInspectMode = () => {};
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') leaveInspectMode();
});

document.addEventListener('astro:page-load', () => {
  const root = document.documentElement;
  if (root.dataset.lens !== 'web') return;

  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector);
  const viewport = $('.viewport');
  const frame = $('.vp-frame');
  const page = $('.page');
  const overlay = $('.overlay');
  const nav = $('.site-nav');
  const devtools = $('#devtools');
  const toggle = $('.dt-toggle');
  const tree = $('[data-tree]');
  const crumb = $('[data-crumb]');
  const styles = $('[data-styles]');
  const log = $('[data-log]');
  const chips = $('[data-chips]');
  const input = $<HTMLInputElement>('#con-in');
  const inspectButton = $('[data-inspect-mode]');
  const deviceButton = $('[data-device-toggle]');
  const deviceSize = $('[data-device-size]');
  const json = $('#inspector-data')?.textContent;
  if (!viewport || !frame || !page || !overlay || !devtools || !toggle || !tree || !crumb || !styles) return;
  if (!log || !chips || !input || !inspectButton || !deviceButton || !deviceSize || !json) return;
  const data: InspectorData = JSON.parse(json);

  const all = (id: string) => [...page.querySelectorAll<HTMLElement>(`[data-inspect="${id}"]`)];
  const first = (id: string) => page.querySelector<HTMLElement>(`[data-inspect="${id}"]`);
  /** The inspectable ids on this page, in registry order. */
  const ids = Object.keys(registry).filter((id) => first(id));
  if (!ids.length) return;

  const state = {
    sel: ids.includes('h1') ? 'h1' : ids[0],
    inspect: false,
    /** Unticked declarations, as `id.property`. */
    off: new Set<string>(),
    /** Grid containers showing their overlay. */
    grid: new Set<string>(),
    accent: accentHexes[0],
  };

  // ── Naming elements the way the Elements panel does ──
  const selectorOf = (node: Element) => {
    const cls = [...node.classList].find((c) => !STATE_CLASSES.includes(c));
    return node.localName + (cls ? `.${cls}` : node.id ? `#${node.id}` : '');
  };
  const pathOf = (node: Element) => {
    const parts: string[] = [];
    for (let n: Element | null = node; n && n !== page; n = n.parentElement) parts.unshift(selectorOf(n));
    return ['html', 'body', ...parts].join(' › ');
  };
  /** Position and size inside the viewport frame, which the overlay shares. */
  const rectIn = (node: Element) => {
    const f = frame.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return { x: r.left - f.left, y: r.top - f.top, w: r.width, h: r.height };
  };

  // ── Overlay: one label for the selection, or one chip per element in inspect mode ──
  function placeOverlay() {
    overlay!.textContent = '';
    const place = (node: HTMLElement, id: string) => {
      const target = first(id);
      if (!target) return;
      const r = rectIn(target);
      // Above the element; below it when there is no room above (the nav at the top of the page),
      // as real devtools do. Cards carry theirs inside the top-right corner, clear of the grid's own.
      const above = r.y - 26;
      node.style.transform =
        id === 'card'
          ? `translate(${r.x + r.w - 8}px, ${r.y + 8}px) translateX(-100%)`
          : `translate(${r.x}px, ${above < viewport!.scrollTop ? r.y + r.h + 4 : above}px)`;
      if (id === state.sel) node.textContent = `${selectorOf(target)}  ${Math.round(r.w)} × ${Math.round(r.h)}`;
      overlay!.append(node);
    };
    if (!state.inspect) {
      const label = span('inspect-label', '');
      label.setAttribute('aria-hidden', 'true');
      place(label, state.sel);
      return;
    }
    for (const id of ids) {
      const target = first(id);
      if (!target) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'inspect-chip';
      chip.dataset.chip = id;
      chip.textContent = target.localName;
      chip.setAttribute('aria-label', `Inspect ${selectorOf(target)}`);
      chip.setAttribute('aria-pressed', String(id === state.sel));
      chip.addEventListener('click', () => {
        select(id);
        overlay!.querySelector<HTMLElement>(`[data-chip="${id}"]`)?.focus({ preventScroll: true });
      });
      place(chip, id);
    }
  }

  // ── Elements tree: an outline of the real page, opened as far as the inspectable elements ──
  const rows: HTMLElement[] = [];
  const badges = new Map<string, HTMLButtonElement>();

  const openTag = (tag: string, attrs: [string, string][]) => [
    span('t-tag', `<${tag}`),
    ...attrs.flatMap(([name, value]) => [' ', span('t-attr', name), '="', span('t-val', value), '"']),
    span('t-tag', '>'),
  ];
  const attrsOf = (node: Element) => {
    const attrs: [string, string][] = [];
    const cls = [...node.classList].filter((c) => !STATE_CLASSES.includes(c)).join(' ');
    if (cls) attrs.push(['class', cls]);
    if (node.id) attrs.push(['id', node.id]);
    const href = node.getAttribute('href');
    if (href) attrs.push(['href', href]);
    return attrs;
  };
  const clip = (text: string) => {
    const t = text.replace(/\s+/g, ' ').trim();
    return t.length > 28 ? `${t.slice(0, 24)}…` : t;
  };

  function addRow(level: number, parts: (Node | string)[], id?: string) {
    const row = document.createElement('div');
    row.className = 'tree-row';
    row.dataset.id = id ?? '';
    row.style.setProperty('--indent', `${6 + level * 14}px`);
    if (id) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tree-btn';
      button.append(...parts);
      button.addEventListener('click', () => select(id, true));
      button.addEventListener('mouseenter', () => hover(id));
      button.addEventListener('mouseleave', () => hover(null));
      button.addEventListener('focus', () => hover(id));
      button.addEventListener('blur', () => hover(null));
      row.append(button);
      if (registry[id].grid) {
        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'grid-badge';
        badge.textContent = 'grid';
        badge.setAttribute('aria-label', 'Toggle grid overlay');
        badge.addEventListener('click', () => {
          if (!state.grid.delete(id)) state.grid.add(id);
          syncGrid();
        });
        badges.set(id, badge);
        row.append(badge);
      }
    } else {
      const plain = document.createElement('div');
      plain.className = 'tree-plain';
      plain.append(...parts);
      row.append(plain);
    }
    rows.push(row);
    tree!.append(row);
  }

  function walk(node: Element, level: number) {
    const id = (node as HTMLElement).dataset.inspect;
    const known = id && id in registry ? id : undefined;
    const tag = node.localName;
    if (node.querySelector('[data-inspect]')) {
      addRow(level, openTag(tag, attrsOf(node)), known);
      for (const child of node.children) walk(child, level + 1);
      addRow(level, [span('t-tag', `</${tag}>`)]);
      return;
    }
    const inner = node.childElementCount ? '…' : clip(node.textContent ?? '');
    addRow(
      level,
      [...openTag(tag, attrsOf(node)), span(inner === '…' ? 't-mut' : 't-txt', inner), span('t-tag', `</${tag}>`)],
      known,
    );
  }

  function buildTree() {
    tree!.textContent = '';
    addRow(0, openTag('html', [
      ['lang', root.lang],
      ['data-lens', 'web'],
    ]));
    addRow(1, openTag('body', []));
    for (const child of page!.children) walk(child, 2);
    addRow(1, [span('t-tag', '</body>')]);
    addRow(0, [span('t-tag', '</html>')]);
  }

  /** The grid badge exists only while its element is a grid; the overlay goes with it. */
  function syncGrid() {
    for (const [id, badge] of badges) {
      const target = first(id);
      if (!target) continue;
      const isGrid = getComputedStyle(target).display === 'grid';
      if (!isGrid) state.grid.delete(id);
      badge.hidden = !isGrid;
      badge.setAttribute('aria-pressed', String(state.grid.has(id)));
      target.classList.toggle('show-grid', state.grid.has(id));
    }
  }

  // ── Selection and hover ──
  function select(id: string, reveal = false) {
    state.sel = id;
    for (const node of page!.querySelectorAll<HTMLElement>('[data-inspect]')) {
      const selected = node.dataset.inspect === id;
      node.classList.toggle('is-inspected', selected);
      if (selected) node.classList.remove('is-hovered');
    }
    let scrolled = false;
    for (const row of rows) {
      const selected = row.dataset.id === id;
      row.classList.toggle('is-selected', selected);
      if (selected) row.classList.remove('is-hovered');
      row.querySelector('.tree-btn')?.setAttribute('aria-pressed', String(selected));
      if (selected && !scrolled) {
        // Keep the selected row in sight without scrolling anything but the tree.
        const t = tree!.getBoundingClientRect();
        const r = row.getBoundingClientRect();
        if (r.top < t.top) tree!.scrollTop -= t.top - r.top;
        else if (r.bottom > t.bottom) tree!.scrollTop += r.bottom - t.bottom;
        scrolled = true;
      }
    }
    const target = first(id);
    // Bring the element into the viewport pane when it is selected from the tree, clear of the
    // sticky nav with room for its label. The nav itself is always in sight.
    if (reveal && target && target !== nav) {
      const r = rectIn(target);
      const top = viewport!.scrollTop;
      const height = viewport!.clientHeight;
      const clear = (nav?.offsetHeight ?? 0) + 32;
      if (r.y < top + clear || r.y + Math.min(r.h, height - clear) > top + height) {
        viewport!.scrollTop = Math.max(0, r.y - clear);
      }
    }
    renderStyles();
    placeOverlay();
  }

  function hover(id: string | null) {
    for (const node of page!.querySelectorAll<HTMLElement>('[data-inspect]')) {
      node.classList.toggle('is-hovered', !!id && node.dataset.inspect === id && id !== state.sel);
    }
    for (const row of rows) row.classList.toggle('is-hovered', !!id && row.dataset.id === id && id !== state.sel);
  }

  // ── Styles pane: the element's rule, :root's --accent and the box model ──
  function renderStyles() {
    const target = first(state.sel);
    if (!target) return;
    const { decls } = registry[state.sel];
    const selector = esc(selectorOf(target));
    crumb!.textContent = pathOf(target);

    // Re-rendering replaces the controls; hand focus back to the one that had it.
    const active = document.activeElement instanceof HTMLElement && styles!.contains(document.activeElement) ? document.activeElement : null;
    const refocus = active?.dataset.prop
      ? `[data-prop="${active.dataset.prop}"]`
      : active?.dataset.accent && `[data-accent="${active.dataset.accent}"]`;

    const narrow = frame!.clientWidth <= NARROW;
    const rule = decls
      .map(({ prop, value, narrow: narrowValue }) => {
        const off = state.off.has(`${state.sel}.${prop}`);
        return (
          `<label class="decl${off ? ' is-off' : ''}"><input type="checkbox"${off ? '' : ' checked'} data-prop="${prop}">` +
          `<span><span class="p">${prop}</span><span class="punct">: </span>` +
          `<span class="v">${esc(narrow && narrowValue ? narrowValue : value)}</span><span class="punct">;</span></span></label>`
        );
      })
      .join('');
    const swatches = accents
      .map(
        ([hex, name]) =>
          `<button type="button" class="swatch" data-accent="${hex}" aria-pressed="${state.accent === hex}" ` +
          `aria-label="Set --accent to ${name}"><span style="background:${hex}"></span></button>`,
      )
      .join('');

    const cs = getComputedStyle(target);
    const sides = (name: string, suffix = '') =>
      ['top', 'right', 'bottom', 'left'].map((side) => parseFloat(cs.getPropertyValue(`${name}-${side}${suffix}`)) || 0);
    const margin = sides('margin');
    const border = sides('border', '-width');
    const padding = sides('padding');
    const box = target.getBoundingClientRect();
    const width = box.width - padding[1] - padding[3] - border[1] - border[3];
    const height = box.height - padding[0] - padding[2] - border[0] - border[2];

    styles!.innerHTML =
      `<div class="rule-end rule-end--muted">element.style {<br>}</div>` +
      `<div class="rule-head"><span><b>${selector}</b> {</span><span class="rule-src">${data.stylesheet}:${data.sources[state.sel]}</span></div>` +
      `${rule}<div class="rule-end">}</div>` +
      `<div class="rule-head"><span><b>:root</b> {</span><span class="rule-src">${data.stylesheet}:${data.accentLine}</span></div>` +
      `<div class="swatches"><span><span class="p">--accent</span><span class="punct">: </span></span>${swatches}<span>${state.accent};</span></div>` +
      `<div class="rule-end">}</div>` +
      `<div class="boxmodel"><div class="bm-title">box model · ${selector}</div>` +
      `<div class="bm bm-margin"><div class="bm-row"><span>margin</span><span>${shorthand(margin)}</span></div>` +
      `<div class="bm bm-border"><div class="bm-row"><span>border</span><span>${shorthand(border)}</span></div>` +
      `<div class="bm bm-padding"><div class="bm-row"><span>padding</span><span>${shorthand(padding)}</span></div>` +
      `<div class="bm-content">${Math.round(width)} × ${Math.round(height)}</div></div></div></div></div>`;

    if (refocus) styles!.querySelector<HTMLElement>(refocus)?.focus({ preventScroll: true });
  }

  /** Everything that reads measurements from the page. */
  const refresh = () => {
    syncGrid();
    renderStyles();
    placeOverlay();
    deviceSize.textContent = `${frame.clientWidth} × ${viewport.clientHeight}`;
  };

  // Unticking a declaration overrides it inline on every match; ticking removes the override.
  function toggleDecl(id: string, prop: string) {
    const decl = registry[id].decls.find((d) => d.prop === prop);
    if (!decl) return;
    const key = `${id}.${prop}`;
    const turnOn = state.off.delete(key);
    if (!turnOn) state.off.add(key);
    for (const target of all(id)) {
      for (const [p, value] of Object.entries({ [prop]: decl.off, ...decl.also })) {
        if (turnOn) target.style.removeProperty(p);
        else target.style.setProperty(p, value);
      }
    }
    refresh();
  }
  styles.addEventListener('change', (event) => {
    const { prop } = (event.target as HTMLElement).dataset;
    if (prop) toggleDecl(state.sel, prop);
  });

  function setAccent(hex: string) {
    state.accent = hex;
    root.style.setProperty('--accent', hex);
  }
  styles.addEventListener('click', (event) => {
    const hex = (event.target as Element).closest<HTMLElement>('[data-accent]')?.dataset.accent;
    if (!hex) return;
    setAccent(hex);
    try {
      localStorage.setItem('web-accent', hex);
    } catch {}
    renderStyles();
  });

  // ── Toolbar: open/close, tabs, inspect mode, device mode ──
  const tabs = [...devtools.querySelectorAll<HTMLElement>('[data-tab]')];
  const panels = [...devtools.querySelectorAll<HTMLElement>('[data-panel]')];

  function setOpen(open: boolean) {
    root.dataset.devtools = open ? 'open' : 'closed';
    toggle!.setAttribute('aria-pressed', String(open));
    if (open) requestAnimationFrame(refresh);
  }
  function setTab(name: string) {
    for (const tab of tabs) tab.setAttribute('aria-pressed', String(tab.dataset.tab === name));
    for (const panel of panels) panel.hidden = panel.dataset.panel !== name;
    if (name === 'console') input!.focus({ preventScroll: true });
  }
  function setInspect(on: boolean) {
    state.inspect = on;
    inspectButton!.setAttribute('aria-pressed', String(on));
    if (on) setTab('elements');
    placeOverlay();
  }
  leaveInspectMode = () => {
    if (state.inspect) setInspect(false);
  };

  toggle.addEventListener('click', () => setOpen(root.dataset.devtools !== 'open'));
  $('[data-close]')?.addEventListener('click', () => {
    setOpen(false);
    toggle.focus();
  });
  for (const tab of tabs) tab.addEventListener('click', () => setTab(tab.dataset.tab ?? 'elements'));
  inspectButton.addEventListener('click', () => setInspect(!state.inspect));
  deviceButton.addEventListener('click', () => {
    const phone = viewport.dataset.device !== 'phone';
    viewport.dataset.device = phone ? 'phone' : 'desktop';
    deviceButton.setAttribute('aria-pressed', String(phone));
    deviceSize.hidden = !phone;
  });
  $('[data-open-console]')?.addEventListener('click', () => {
    setOpen(true);
    setTab('console');
    // Stacked below the viewport on narrow windows: bring it into sight.
    if (!wide.matches) devtools.scrollIntoView({ block: 'start' });
  });

  // ── Console ──
  function line(kind: 'in' | 'ret' | 'err' | 'out', text: string) {
    const row = document.createElement('div');
    row.className = `con-line ${kind}`;
    const prefix = span('pfx', { in: '›', ret: '←', err: '✕', out: '' }[kind]);
    prefix.setAttribute('aria-hidden', 'true');
    row.append(prefix, span('txt', text));
    log!.append(row);
    log!.scrollTop = log!.scrollHeight;
  }
  const commands: Record<string, () => void> = {
    help: () => line('out', `Try: ${[...Object.keys(data.commands), 'inspect', 'clear'].map((c) => `${c}()`).join('  ')}`),
    inspect: () => {
      line('out', 'Inspect mode on. Click any tag on the page.');
      setInspect(true);
    },
    clear: () => {
      log.textContent = '';
      line('out', 'Console was cleared');
    },
  };
  for (const [name, { kind, text }] of Object.entries(data.commands)) commands[name] = () => line(kind, text);

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;
    line('in', text);
    const name = text
      .replace(/^femi\./i, '')
      .replace(/\(\s*\)\s*;?\s*$/, '')
      .trim()
      .toLowerCase();
    if (Object.hasOwn(commands, name)) commands[name]();
    else line('err', `Uncaught ReferenceError: ${name.replace(/[^\w$.]/g, '').slice(0, 24) || 'that'} is not defined`);
  }
  for (const name of ['help', ...Object.keys(data.commands), 'clear']) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = `${name}()`;
    chip.addEventListener('click', () => run(chip.textContent ?? ''));
    chips.append(chip);
  }
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    run(input.value);
    input.value = '';
  });

  // ── Boot ──
  try {
    const stored = localStorage.getItem('web-accent');
    if (stored && accentHexes.includes(stored)) setAccent(stored);
  } catch {}
  const host = $('[data-url-host]');
  if (host && location.host) host.textContent = location.host;

  line('in', 'femi.hello()');
  line('ret', `"Hi, I'm Femi. This page is the portfolio; the panel you're in is the proof. Type help() to look around."`);

  buildTree();
  setOpen(root.dataset.devtools ? root.dataset.devtools === 'open' : wide.matches);
  select(state.sel);

  // Sizes change with the window, device mode, toggled CSS and late fonts.
  // The overlay scrolls with the page, but the stuck nav does not: keep its label or chip on it.
  let placing = 0;
  viewport.addEventListener(
    'scroll',
    () => {
      if (placing || (!state.inspect && state.sel !== 'nav')) return;
      placing = requestAnimationFrame(() => {
        placing = 0;
        placeOverlay();
      });
    },
    { passive: true },
  );

  frameObserver?.disconnect();
  frameObserver = new ResizeObserver(refresh);
  frameObserver.observe(frame);
  document.fonts.ready.then(refresh);
});
