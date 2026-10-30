// What the inspector can take apart. Each entry is keyed by the element's `data-inspect` id and
// names the rule in inspector.css that styles it; the build (sources.ts) fails if a declaration
// here is not in that rule, so the Styles pane never shows CSS the page does not have.

export interface Decl {
  prop: string;
  /** The value as written in inspector.css. */
  value: string;
  /** What the property becomes when its checkbox is unticked. */
  off: string;
  /** The value the page's container query swaps in on a narrow frame. */
  narrow?: string;
  /** Other properties to set while this one is off, so the element stays readable. */
  also?: Record<string, string>;
}

export interface Rule {
  /** The selector as written in inspector.css. */
  rule: string;
  /** A grid container: gets the `grid` badge and overlay. */
  grid?: boolean;
  decls: Decl[];
}

export const registry: Record<string, Rule> = {
  nav: {
    rule: '.site-nav',
    decls: [
      { prop: 'display', value: 'flex', off: 'block' },
      { prop: 'justify-content', value: 'space-between', off: 'normal' },
      { prop: 'align-items', value: 'center', off: 'normal' },
      { prop: 'gap', value: '24px', off: '0' },
      { prop: 'padding-block', value: '18px', off: '0' },
      { prop: 'border-bottom', value: '1px solid var(--line)', off: 'none' },
    ],
  },
  h1: {
    rule: '.hero__title',
    decls: [
      { prop: 'font-size', value: '64px', off: '32px', narrow: '40px' },
      { prop: 'font-weight', value: '700', off: '400' },
      { prop: 'letter-spacing', value: '-0.025em', off: 'normal' },
      { prop: 'line-height', value: '1', off: 'normal' },
      { prop: 'max-width', value: '12ch', off: 'none' },
    ],
  },
  lead: {
    rule: '.hero__lead',
    decls: [
      { prop: 'font-size', value: '19px', off: '16px', narrow: '17px' },
      { prop: 'line-height', value: '1.6', off: 'normal' },
      { prop: 'color', value: 'var(--ink-3)', off: 'var(--ink)' },
      { prop: 'max-width', value: '46ch', off: 'none' },
    ],
  },
  cta: {
    rule: 'a.btn',
    decls: [
      { prop: 'background', value: 'var(--accent)', off: 'transparent', also: { color: 'var(--accent)' } },
      { prop: 'padding', value: '14px 22px', off: '0' },
      { prop: 'font-weight', value: '700', off: '400' },
      { prop: 'text-decoration', value: 'none', off: 'underline' },
    ],
  },
  grid: {
    rule: '.projects__grid',
    grid: true,
    decls: [
      { prop: 'display', value: 'grid', off: 'block' },
      { prop: 'grid-template-columns', value: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', off: 'none' },
      { prop: 'gap', value: '16px', off: '0' },
    ],
  },
  card: {
    rule: '.card',
    decls: [
      { prop: 'border', value: '1px solid var(--line)', off: 'none' },
      { prop: 'padding', value: '20px', off: '0' },
      { prop: 'background', value: 'var(--card-bg)', off: 'transparent' },
    ],
  },
  about: {
    rule: '.about',
    decls: [
      { prop: 'display', value: 'grid', off: 'block' },
      { prop: 'grid-template-columns', value: '180px minmax(0, 1fr)', off: 'none', narrow: '1fr' },
      { prop: 'column-gap', value: '32px', off: '0' },
      { prop: 'border-top', value: '1px solid var(--ink)', off: 'none' },
      { prop: 'padding-top', value: '28px', off: '0' },
    ],
  },
  // The project page's fact sheet.
  specs: {
    rule: '.facts',
    grid: true,
    decls: [
      { prop: 'display', value: 'grid', off: 'block' },
      { prop: 'grid-template-columns', value: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', off: 'none' },
      { prop: 'gap', value: '16px 24px', off: '0' },
    ],
  },
};

/** The values `--accent` can take; the first is the default. */
export const accents: [hex: string, name: string][] = [
  ['#1F3BD6', 'ultramarine'],
  ['#0B6E4F', 'green'],
  ['#B4410E', 'rust'],
  ['#15171C', 'ink'],
];

/** What the page hands the inspector script (the JSON in `#inspector-data`). */
export interface InspectorData {
  stylesheet: string;
  /** Line of each registry rule in the stylesheet. */
  sources: Record<string, number>;
  accentLine: number;
  /** Console commands answered from the site's content. */
  commands: Record<string, { kind: 'ret' | 'out'; text: string }>;
}
