// Builds the ledger (Table 1). Runs at build time; "verify chain" repeats it in the browser.
import { createHash } from 'node:crypto';

export const GENESIS = '0'.repeat(64);

/**
 * @template {{ slug: string, date: string, title: string }} E
 * @param {E[]} entries oldest first; `date` is YYYY-MM
 */
export function buildChain(entries) {
  let prev = GENESIS;
  return entries.map((entry, height) => {
    const hash = createHash('sha256').update(`${prev}|${entry.slug}|${entry.date}|${entry.title}`).digest('hex');
    const block = { ...entry, height, prev, hash };
    prev = hash;
    return block;
  });
}
