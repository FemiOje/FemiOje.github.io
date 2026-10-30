// Renders the brand files the site serves from their SVG masters in brand/. Re-run with
// `pnpm brand` after changing brand/mark.svg or brand/social-card.svg.
//   public/favicon.svg          brand/mark.svg as is: the page header and the tab show one drawing
//   public/favicon.ico          32px, for browsers and crawlers that skip SVG icons
//   public/apple-touch-icon.png 180px, for iOS home screens
//   public/og.png               1200 × 630 social card, shared by every page
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const file = (path) => new URL(`../${path}`, import.meta.url);
const favicon = await readFile(file('brand/mark.svg'));
await writeFile(file('public/favicon.svg'), favicon);

const png = (svg, size) => sharp(svg, { density: 72 * Math.ceil(size / 32) }).resize(size, size).png().toBuffer();

// An ICO file can carry a PNG as is: a 6 byte header, one 16 byte directory entry, then the image.
const ico32 = await png(favicon, 32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico32.length, 14);
header.writeUInt32LE(22, 18); // image offset
await writeFile(file('public/favicon.ico'), Buffer.concat([header, ico32]));

await writeFile(file('public/apple-touch-icon.png'), await png(favicon, 180));

await sharp(await readFile(file('brand/social-card.svg'))).png().toFile(file('public/og.png').pathname);
console.log('favicon.ico, apple-touch-icon.png, og.png');
