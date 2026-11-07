/** The drawings page's slot math (no React): when each piece starts, and which is on top at a progress. */
export const FIRST = 0.05, STEP = 0.15, COUNT = 6;
/** The progress at which piece i starts. */
export const startOf = (i: number) => FIRST + i * STEP;
/** Which piece is on top at p (-1 before the first). */
export const topAt = (p: number) => Math.min(COUNT - 1, Math.floor((p - FIRST) / STEP));
