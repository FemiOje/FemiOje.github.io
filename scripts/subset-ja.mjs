// Cuts Shippori Mincho down to the Japanese glyphs the Ma lens is allowed to use
// (DESIGN.md › Japanese vocabulary), so the page loads one small file per weight
// instead of ten unicode-range slices. Re-run with `pnpm fonts:ja` if that list changes.
import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const GLYPHS = '間玄関作品経歴便り一二三四五期会フェミ';
const WEIGHTS = [400, 500];

for (const weight of WEIGHTS) {
  const source = await readFile(
    new URL(`../node_modules/@fontsource/shippori-mincho/files/shippori-mincho-japanese-${weight}-normal.woff2`, import.meta.url),
  );
  const subset = await subsetFont(source, GLYPHS, { targetFormat: 'woff2' });
  const out = new URL(`../src/lenses/classic/fonts/shippori-mincho-ma-${weight}.woff2`, import.meta.url);
  await writeFile(out, subset);
  console.log(`${weight}: ${subset.length} bytes`);
}
