/** Small interface marks; the larger illustrations are copied from the actual product. */
export function ProductIcon({ name, size = 18 }: { name: 'check' | 'arrow' | 'external' | 'back' | 'document' | 'search' | 'code' | 'link' | 'close' | 'question'; size?: number }) {
  const paths = {
    check: 'm5 12 4 4L19 6', arrow: 'M4 12h15m-6-6 6 6-6 6',
    external: 'M7 17 17 7M7 7h10v10', back: 'M20 12H5m6-6-6 6 6 6',
    document: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6',
    search: 'm16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16',
    link: 'm10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
    close: 'm6 6 12 12M18 6 6 18', question: 'M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 3m0 3v1',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
