/** The point stays on the stroke; the shaft keeps a natural drawing angle. */
export default function DrawingPencil({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g className="drawingPencil" transform={`translate(${x} ${y}) rotate(128) scale(${scale})`}>
      <path d="M0 0 L-13 -3.2 L-13 3.2 Z" fill="#d3b58b" stroke="#51483a" strokeWidth=".65" />
      <path d="M0 0 L-4 -1 L-4 1 Z" fill="#25241f" />
      <path d="M-13 -3.2 H-73 Q-76 -3.2 -76 0 Q-76 3.2 -73 3.2 H-13 Z" fill="#596253" stroke="#30392e" strokeWidth=".7" />
      <path d="M-16 -1.3 H-71" stroke="#a9b09c" strokeWidth=".8" />
      <path d="M-70 -3.2 V3.2" stroke="#c6b99a" strokeWidth="1.5" />
    </g>
  );
}
