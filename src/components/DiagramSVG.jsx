/**
 * DiagramSVG — Parametric SVG recreation of the 4-Squares puzzle.
 *
 * Layout (500×500 SVG):
 *   A = top-right quadrant  (x:250-500, y:0-250)   — Q1 diagonal answer
 *   B = top-left quadrant   (x:0-250,   y:0-250)   — Q2 cell-division answer
 *   C = bottom-left quadrant(x:0-250,   y:250-500) — Q3 staircase answer
 *   D = bottom-right quadrant(x:250-500,y:250-500) — Q4 seven strips answer
 *
 * Gray cells (inner L-shape at the cross intersection):
 *   • B's bottom-right: (125,125)-(250,250)
 *   • A's bottom-left:  (250,125)-(375,250)
 *   • C's top-right:    (125,250)-(250,375)
 */

const S  = 500;      // SVG size
const q  = S / 4;   // 125 — quarter
const H  = S / 2;   // 250 — half
const hq = q / 2;   // 62.5 — half-quarter

const CYAN       = '#00f5ff';
const CYAN_DIM   = 'rgba(0,245,255,0.5)';
const PINK       = '#ff006e';
const BG         = '#04080f';
const GRAY_FILL  = '#0d1425';
const STROKE_W   = 2;
const INNER_W    = 1.5;
const ANS_W      = 2.5;

export default function DiagramSVG({ showQ1 = false, showQ2 = false, showQ3 = false, showQ4 = false }) {
  // Q4: 7 equal horizontal strips in D — 6 dividing lines
  const stripLines = Array.from({ length: 6 }, (_, i) => H + (i + 1) * (H / 7));

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width="100%"
      height="100%"
      style={{ display: 'block', filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.22))' }}
    >
      <defs>
        <filter id="aGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={S+40} height={S+40}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="cGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="grayGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f1830" />
          <stop offset="100%" stopColor="#080d1a" />
        </linearGradient>
      </defs>

      {/* ── Background ── */}
      <rect x={0} y={0} width={S} height={S} fill={BG} />

      {/* ── Gray shaded cells ── */}
      <rect x={q}   y={q}   width={q} height={q} fill="url(#grayGrad)" />
      <rect x={2*q} y={q}   width={q} height={q} fill="url(#grayGrad)" />
      <rect x={q}   y={2*q} width={q} height={q} fill="url(#grayGrad)" />
      {/* Subtle cyan tint over gray */}
      <rect x={q}   y={q}   width={q} height={q} fill="rgba(0,245,255,0.05)" />
      <rect x={2*q} y={q}   width={q} height={q} fill="rgba(0,245,255,0.05)" />
      <rect x={q}   y={2*q} width={q} height={q} fill="rgba(0,245,255,0.05)" />

      {/* ── Outer border ── */}
      <rect x={1} y={1} width={S-2} height={S-2}
        fill="none" stroke={CYAN} strokeWidth={STROKE_W} filter="url(#cGlow)" />

      {/* ── Main midlines (cross) ── */}
      <line x1={H} y1={0} x2={H} y2={S} stroke={CYAN} strokeWidth={STROKE_W} />
      <line x1={0} y1={H} x2={S} y2={H} stroke={CYAN} strokeWidth={STROKE_W} />

      {/* ── Gray cell inner borders ── */}
      {/* Left edge of gray band: x=q, from y=q to y=3q */}
      <line x1={q}   y1={q}   x2={q}   y2={3*q} stroke={CYAN_DIM} strokeWidth={INNER_W} />
      {/* Right edge of top-right gray cell: x=3q, from y=q to y=2q */}
      <line x1={3*q} y1={q}   x2={3*q} y2={2*q} stroke={CYAN_DIM} strokeWidth={INNER_W} />
      {/* Top edge of gray band: y=q, from x=q to x=3q */}
      <line x1={q}   y1={q}   x2={3*q} y2={q}   stroke={CYAN_DIM} strokeWidth={INNER_W} />
      {/* Bottom edge of C's gray cell: y=3q, from x=q to x=2q */}
      <line x1={q}   y1={3*q} x2={2*q} y2={3*q} stroke={CYAN_DIM} strokeWidth={INNER_W} />

      {/* ── Quadrant labels ── */}
      <text x={S-28} y={28}   textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900">A</text>
      <text x={28}   y={28}   textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900">B</text>
      <text x={28}   y={S-28} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900">C</text>
      <text x={S-28} y={S-28} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900">D</text>

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q1 ANSWER: Diagonal in A (top-right quadrant)        */}
      {/* Line from top-right corner (500,0) → (375,125)       */}
      {showQ1 && (
        <line x1={S} y1={0} x2={3*q} y2={q}
          stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q2 ANSWER: Reveal 3 white cells in B (top-left)      */}
      {/* Extend x=q upward: y=0→q; extend y=q leftward: x=0→q */}
      {showQ2 && (
        <>
          <line x1={q} y1={0} x2={q} y2={q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
          <line x1={0} y1={q} x2={q} y2={q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q3 ANSWER: Staircase in C (bottom-left quadrant)     */}
      {showQ3 && (
        <>
          {/* Horizontal lines */}
          <line x1={0} y1={2*q + hq} x2={q} y2={2*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
          <line x1={0} y1={3*q} x2={hq} y2={3*q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
          <line x1={0} y1={3*q + hq} x2={2*q} y2={3*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />

          {/* Vertical lines */}
          <line x1={hq} y1={H} x2={hq} y2={S}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
          <line x1={q + hq} y1={3*q} x2={q + hq} y2={S}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
          <line x1={q} y1={3*q + hq} x2={q} y2={S}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q4 ANSWER: 7 equal horizontal strips in D            */}
      {showQ4 && stripLines.map((y, i) => (
        <line key={i} x1={H} y1={y} x2={S} y2={y}
          stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round" />
      ))}
    </svg>
  );
}
