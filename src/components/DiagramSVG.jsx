import { motion } from 'framer-motion';

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
const STROKE_W   = 2;
const INNER_W    = 1.5;
const ANS_W      = 2.5;

const drawTransition = {
  duration: 0.8,
  ease: "easeInOut"
};

export default function DiagramSVG({ diagram = 0 }) {
  const showQ1 = diagram >= 1;
  const showQ2 = diagram >= 2;
  const showQ3 = diagram >= 3;
  const showQ4 = diagram >= 4;

  // Q4: 7 equal horizontal strips in D — 6 dividing lines
  const stripLines = Array.from({ length: 6 }, (_, i) => H + (i + 1) * (H / 7));

  return (
    <svg
      viewBox={`-40 -40 580 580`}
      width="100%"
      height="100%"
      style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.22))' }}
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
      <rect x={-40} y={-40} width={580} height={580} fill={BG} />

      {/* ── Gray shaded cells ── */}
      <motion.rect x={q}   y={q}   width={q} height={q} fill="url(#grayGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.rect x={2*q} y={q}   width={q} height={q} fill="url(#grayGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.rect x={q}   y={2*q} width={q} height={q} fill="url(#grayGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
      
      {/* Subtle cyan tint over gray */}
      <motion.rect x={q}   y={q}   width={q} height={q} fill="rgba(0,245,255,0.05)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.rect x={2*q} y={q}   width={q} height={q} fill="rgba(0,245,255,0.05)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.rect x={q}   y={2*q} width={q} height={q} fill="rgba(0,245,255,0.05)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q1 ANSWER: Diagonal in A (top-right quadrant)        */}
      {/* Line from top-right corner (500,0) → (375,125)       */}
      {showQ1 && (
        <motion.line x1={S} y1={0} x2={3*q} y2={q}
          stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={drawTransition}
        />
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q2 ANSWER: Reveal 3 white cells in B (top-left)      */}
      {/* Extend x=q upward: y=0→q; extend y=q leftward: x=0→q */}
      {showQ2 && (
        <>
          <motion.line x1={q} y1={0} x2={q} y2={q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={drawTransition}
          />
          <motion.line x1={0} y1={q} x2={q} y2={q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...drawTransition, delay: 0.3 }}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q3 ANSWER: Staircase in C (bottom-left quadrant)     */}
      {showQ3 && (
        <>
          {/* Horizontal lines */}
          <motion.line x1={hq} y1={2*q + hq} x2={q} y2={2*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0 }} />
          <motion.line x1={0} y1={3*q} x2={hq} y2={3*q}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.4 }} />
          <motion.line x1={hq} y1={3*q + hq} x2={q + hq} y2={3*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.8 }} />

          {/* Vertical lines */}
          <motion.line x1={hq} y1={2*q + hq} x2={hq} y2={3*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }} />
          <motion.line x1={q + hq} y1={3*q} x2={q + hq} y2={3*q + hq}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.6 }} />
          <motion.line x1={q} y1={3*q + hq} x2={q} y2={S}
            stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 1.0 }} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* Q4 ANSWER: 7 equal horizontal strips in D            */}
      {showQ4 && stripLines.map((y, i) => (
        <motion.line key={i} x1={H} y1={y} x2={S} y2={y}
          stroke={PINK} strokeWidth={ANS_W} filter="url(#aGlow)" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.12 }}
        />
      ))}

      {/* ── Outer border ── */}
      <motion.rect x={1} y={1} width={S-2} height={S-2}
        fill="none" stroke={CYAN} strokeWidth={STROKE_W} filter="url(#cGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* ── Main midlines (cross) ── */}
      <motion.line x1={H} y1={0} x2={H} y2={S} stroke={CYAN} strokeWidth={STROKE_W}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.line x1={0} y1={H} x2={S} y2={H} stroke={CYAN} strokeWidth={STROKE_W}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
      />

      {/* ── Gray cell inner borders ── */}
      <motion.line x1={q}   y1={q}   x2={q}   y2={3*q} stroke={CYAN_DIM} strokeWidth={INNER_W}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }} />
      <motion.line x1={3*q} y1={q}   x2={3*q} y2={2*q} stroke={CYAN_DIM} strokeWidth={INNER_W}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }} />
      <motion.line x1={q}   y1={q}   x2={3*q} y2={q}   stroke={CYAN_DIM} strokeWidth={INNER_W}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }} />
      <motion.line x1={q}   y1={3*q} x2={2*q} y2={3*q} stroke={CYAN_DIM} strokeWidth={INNER_W}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }} />

      {/* ── Quadrant labels ── */}
      <motion.text x={S-20} y={-22}   textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }}>A</motion.text>
      <motion.text x={20}   y={-22}   textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }}>B</motion.text>
      <motion.text x={20}   y={S+22} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }}>C</motion.text>
      <motion.text x={S-20} y={S+22} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,245,255,0.32)" fontFamily="Orbitron,sans-serif" fontSize="19" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }}>D</motion.text>
    </svg>
  );
}
