import { defineConfig, fontProviders } from 'astro/config';

// Fonts are self-hosted: Latin from the installed @fontsource packages, and the handful
// of approved Japanese glyphs from a hand-made subset (see scripts/subset-ja.mjs).
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD';
const JAPANESE = 'U+3040-30FF,U+4E00-9FFF';

const latin = (pkg, weight) => ({
  src: [`@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`],
  weight,
  style: 'normal',
  unicodeRange: [LATIN],
});
const japanese = (weight) => ({
  src: [`./src/lenses/classic/fonts/shippori-mincho-ma-${weight}.woff2`],
  weight,
  style: 'normal',
  unicodeRange: [JAPANESE],
});

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Shippori Mincho',
      cssVariable: '--font-mincho',
      fallbacks: ['Hiragino Mincho ProN', 'Yu Mincho', 'serif'],
      options: {
        variants: [latin('shippori-mincho', 400), latin('shippori-mincho', 500), japanese(400), japanese(500)],
      },
    },
    {
      // Variable, with the optical-size axis, so display sizes pick up the Display design.
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Zen Kaku Gothic New',
      cssVariable: '--font-gothic',
      fallbacks: ['Hiragino Sans', 'Yu Gothic', 'system-ui', 'sans-serif'],
      options: { variants: [latin('zen-kaku-gothic-new', 400)] },
    },
  ],
});
