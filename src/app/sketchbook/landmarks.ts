/**
 * Boxes a page measures for its figure script, in stage coordinates (which are the viewport's
 * while the page is pinned). A page publishes them here; the shell hands them to the script.
 * Measured from offsets, so the copy's entrance transform and the scroll position do not leak in.
 */
export type Box = { x: number; y: number; w: number; h: number };

const store = new Map<string, unknown>();
export const setMarks = (id: string, marks: unknown) => { store.set(id, marks); };
export const getMarks = (id: string) => store.get(id);

/** The box of `el` relative to the stage, through `within` (a positioned child of the stage that contains it). */
export function elementBox(el: HTMLElement, within: HTMLElement): Box {
  const r = el.getBoundingClientRect(), w = within.getBoundingClientRect();
  return { x: within.offsetLeft + (r.left - w.left), y: within.offsetTop + (r.top - w.top), w: r.width, h: r.height };
}

/** One box per word of the text inside `el`, via Ranges, so the markup stays a single text node. */
export function wordBoxes(el: HTMLElement, within: HTMLElement): Box[] {
  const out: Box[] = [];
  const w = within.getBoundingClientRect();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent ?? '';
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const range = document.createRange();
      range.setStart(n, m.index);
      range.setEnd(n, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      if (r.width > 0) out.push({ x: within.offsetLeft + (r.left - w.left), y: within.offsetTop + (r.top - w.top), w: r.width, h: r.height });
    }
  }
  return out;
}
