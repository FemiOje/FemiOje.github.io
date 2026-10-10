// Poster cards rotate their colour field and geometric motif by the project's place in the lens order.
const fields = ['cobalt', 'sky', 'ice'] as const;
const motifs = ['circle', 'bars', 'quarter'] as const;

export type Field = (typeof fields)[number];
export type MotifKind = (typeof motifs)[number];

export const posterField = (index: number): Field => fields[index % fields.length];
export const posterMotif = (index: number): MotifKind => motifs[index % motifs.length];
/** `01`, `02`, … for numerals, card numbers and counts. */
export const pad = (n: number) => String(n).padStart(2, '0');
