import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import Diagram0 from './diagrams/Diagram0';
import Diagram1 from './diagrams/Diagram1';
import Diagram2 from './diagrams/Diagram2';
import Diagram3 from './diagrams/Diagram3';
import Diagram4 from './diagrams/Diagram4';

const DiagramComponents = [Diagram0, Diagram1, Diagram2, Diagram3, Diagram4];

// ── Floating particles (title + thank-you) ─────────────────────────────
function Particles({ count = 35, colors = ['#00f5ff', '#ff006e', '#bf00ff'] }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    })),
    [count, colors]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
        }}
          animate={{ y: [0, -40, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── NeonRain (thank-you slide) ─────────────────────────────────────────
function NeonRain() {
  const drops = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      dur: Math.random() * 1.5 + 1,
      delay: Math.random() * 4,
      h: Math.random() * 80 + 30,
      color: ['#00f5ff44', '#ff006e44', '#ffec0044', '#bf00ff44'][i % 4],
    })),
    []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {drops.map(d => (
        <motion.div key={d.id} style={{
          position: 'absolute',
          left: `${d.x}%`,
          width: 1,
          height: d.h,
          background: `linear-gradient(to bottom, transparent, ${d.color})`,
        }}
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ── ScanLine (moving horizontal line) ─────────────────────────────────
function ScanLine() {
  return (
    <motion.div style={{
      position: 'absolute', left: 0, right: 0, height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.6), transparent)',
      boxShadow: '0 0 8px #00f5ff',
      pointerEvents: 'none', zIndex: 5,
    }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ── LAYOUT: TITLE (Slide 1) ────────────────────────────────────────────
function TitleLayout({ slide }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>
      <Particles count={45} />
      <ScanLine />

      {/* Top label */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: '1em' }}
        animate={{ opacity: 0.55, letterSpacing: '0.5em' }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(0.6rem, 1.5vw, 0.9rem)',
          color: '#ff006e',
          textTransform: 'uppercase',
          marginBottom: 24,
          textShadow: '0 0 10px #ff006e88',
        }}
      >
        ▸ CRITICAL THINKING ▸
      </motion.p>

      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4, type: 'spring', stiffness: 80 }}
      >
        <h1
          className="glitch-text crt-flicker"
          data-text={slide.title}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(4.5rem, 14vw, 11rem)',
            fontWeight: 900,
            color: '#00f5ff',
            textShadow: '0 0 20px #00f5ff, 0 0 50px #00f5ff44, 0 0 100px #00f5ff22',
            letterSpacing: '0.12em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          {slide.title}
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.65, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
          fontWeight: 500,
          color: '#bf00ff',
          letterSpacing: '0.25em',
          marginTop: 22,
          textShadow: '0 0 14px #bf00ff88',
        }}
      >
        A  ·  F U N  ·  P U Z Z L E
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'min(400px, 60vw)' }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #00f5ff, #ff006e, transparent)',
          boxShadow: '0 0 12px rgba(0,245,255,0.5)',
          marginTop: 32,
        }}
      />

      {/* Blink prompt */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: 70,
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(0.6rem, 1.3vw, 0.8rem)',
          color: '#00f5ff',
          letterSpacing: '0.25em',
          textShadow: '0 0 8px #00f5ff',
        }}
      >
        [ CLICK OR PRESS → TO BEGIN ]
      </motion.p>
    </div>
  );
}

// ── Shared text animate helper ─────────────────────────────────────────
const textIn = (delay) => ({
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

const lineIn = (delay) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { delay, duration: 0.4 },
});

const yellowTextIn = (delay) => ({
  initial: { opacity: 0, y: 15, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: {
    delay,
    duration: 0.6,
    type: 'spring',
    stiffness: 140,
    damping: 14
  },
});

// ── LAYOUT: DIAGRAM (most slides) ─────────────────────────────────────
function DiagramLayout({ slide }) {
  const { font1, font2, font3, diagram } = slide;
  const DiagramComp = DiagramComponents[diagram];
  const isQLabel = /^Q\d$/.test((font1 || '').trim());

  return (
    <div className="diagram-layout">
      {/* ── LEFT: Diagram panel ── */}
      <motion.div
        {...{
          initial: { opacity: 0, x: -36 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        }}
        className="diagram-panel"
      >
        {/* Corner dots */}
        {[{ top: 8, right: 8 }, { bottom: 8, left: 8 }].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 5, height: 5, borderRadius: '50%',
            background: '#00f5ff', boxShadow: '0 0 8px #00f5ff',
          }} />
        ))}
        {/* Scan line in diagram */}
        <motion.div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)',
          pointerEvents: 'none', zIndex: 3,
        }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <DiagramComp />
      </motion.div>

      {/* ── RIGHT: Text panel ── */}
      <div className="text-panel">
        {/* Font1 */}
        {font1 && (
          <motion.div {...textIn(0.15)}>
            {isQLabel ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }} className="q-label-container">
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                  color: 'rgba(0,245,255,0.6)',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                }}>QUESTION</span>
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 900,
                  color: '#00f5ff',
                  textShadow: '0 0 16px #00f5ff, 0 0 32px #00f5ff44',
                  letterSpacing: '0.08em',
                  animation: 'neonPulse 2.5s ease-in-out infinite',
                }}>{font1}</span>
              </div>
            ) : (
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 'clamp(0.75rem, 1.3vw, 1rem)',
                color: 'rgba(0,245,255,0.72)',
                lineHeight: 1.75,
                letterSpacing: '0.02em',
                margin: 0,
              }}>{font1}</p>
            )}
          </motion.div>
        )}

        {/* Divider 1 */}
        <motion.div {...lineIn(0.3)} style={{
          height: 1,
          background: 'linear-gradient(90deg, #ff006e, rgba(255,0,110,0.1))',
          boxShadow: '0 0 8px rgba(255,0,110,0.5)',
          transformOrigin: 'left',
        }} className="text-divider" />

        {/* Font2 */}
        {font2 && (
          <motion.div {...textIn(0.35)}>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1.4rem, 2.8vw, 2.6rem)',
              fontWeight: 700,
              color: '#e8e8ff',
              lineHeight: 1.25,
              textShadow: '0 0 18px rgba(255,0,110,0.25)',
              margin: 0,
            }}>
              {font2.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          </motion.div>
        )}

        {/* Font3 */}
        {font3 && (
          <>
            <motion.div {...lineIn(0.52)} style={{
              height: 1,
              background: 'linear-gradient(90deg, #ffec00, rgba(255,236,0,0.08))',
              boxShadow: '0 0 6px rgba(255,236,0,0.4)',
              transformOrigin: 'left',
            }} className="text-divider" />
            <motion.div {...yellowTextIn(0.57)}>
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                fontWeight: 700,
                color: '#ffec00',
                textShadow: '0 0 12px rgba(255,236,0,0.7), 0 0 24px rgba(255,236,0,0.35)',
                lineHeight: 1.45,
                letterSpacing: '0.06em',
                margin: 0,
                animation: 'neonPulseYellow 2s ease-in-out infinite',
              }}>{font3}</p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

// ── LAYOUT: TEXT-ONLY (slides 9, 15) ──────────────────────────────────
function TextLayout({ slide, slideIndex }) {
  const isOK = slideIndex === 8;   // Slide 9 "OK!!"
  const isReady = slideIndex === 14;  // Slide 15 "Be ready..."

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {isOK && (
        <>
          {/* Flash burst */}
          <motion.div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)',
          }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
          />
          <motion.h2
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, type: 'spring', stiffness: 250, damping: 15 }}
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(5rem, 18vw, 16rem)',
              fontWeight: 900,
              color: '#39ff14',
              textShadow: '0 0 30px #39ff14, 0 0 60px #39ff1455, 0 0 120px #39ff1422',
              letterSpacing: '0.08em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            {slide.font1}
          </motion.h2>
        </>
      )}

      {isReady && (
        <>
          <Particles count={20} colors={['#ff006e', '#ffec00']} />
          {/* Pulsing warning dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: '#ff006e', boxShadow: '0 0 24px #ff006e',
              marginBottom: 36,
            }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'min(500px, 70vw)' }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              height: 1, marginBottom: 28,
              background: 'linear-gradient(90deg, transparent, #ff006e, transparent)',
              boxShadow: '0 0 10px #ff006e',
            }}
          />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
              fontWeight: 700,
              color: '#ff006e',
              textShadow: '0 0 22px rgba(255,0,110,0.6)',
              lineHeight: 1.15,
              maxWidth: 800,
              margin: 0,
              letterSpacing: '0.03em',
              animation: 'neonPulsePink 2s ease-in-out infinite',
            }}
          >
            {slide.font1}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'min(300px, 50vw)' }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              height: 1, marginTop: 36,
              background: 'linear-gradient(90deg, transparent, #ff006e, transparent)',
              boxShadow: '0 0 10px #ff006e',
            }}
          />
        </>
      )}
    </div>
  );
}

// ── LAYOUT: THANK YOU (Slide 21) ───────────────────────────────────────
function ThankYouLayout({ slide }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      textAlign: 'center', padding: '40px',
    }}>
      <NeonRain />
      <Particles count={40} colors={['#00f5ff', '#ff006e', '#ffec00', '#bf00ff']} />

      {/* THANK YOU label */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(0.65rem, 1.4vw, 0.95rem)',
          letterSpacing: '0.55em',
          color: '#00f5ff',
          textTransform: 'uppercase',
          margin: '0 0 20px',
          textShadow: '0 0 12px #00f5ff88',
        }}
      >
        ✦  THANK YOU  ✦
      </motion.p>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 70 }}
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: 'clamp(3rem, 9vw, 8rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #00f5ff 0%, #bf00ff 40%, #ff006e 70%, #ffec00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          margin: '0 0 28px',
          filter: 'drop-shadow(0 0 24px rgba(0,245,255,0.4))',
          textAlign: 'center',
        }}
      >
        {slide.title}
      </motion.h1>

      {/* Gradient divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'min(480px, 70vw)' }}
        transition={{ delay: 0.9, duration: 0.9 }}
        style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #00f5ff, #bf00ff, #ff006e, #ffec00, transparent)',
          boxShadow: '0 0 16px rgba(0,245,255,0.5)',
          borderRadius: 2,
        }}
      />

      {/* Insight text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)',
          color: '#00f5ff',
          marginTop: 30,
          letterSpacing: '0.12em',
          textShadow: '0 0 8px #00f5ff55',
        }}
      >
        THE MIND IS LIMITLESS  ·  KEEP EXPLORING
      </motion.p>

      {/* Puzzle stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.45, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{
          marginTop: 40,
          display: 'flex', gap: 40,
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
          color: '#ff006e',
          letterSpacing: '0.2em',
        }}
      >
        <span>2 EQUAL</span>
        <span>·</span>
        <span>3 EQUAL</span>
        <span>·</span>
        <span>4 EQUAL</span>
        <span>·</span>
        <span>7 EQUAL</span>
      </motion.div>
    </div>
  );
}

// ── LAYOUT: QUOTE ──────────────────────────────────────────────────────
function QuoteLayout({ slide }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px',
      position: 'relative', overflow: 'hidden',
    }}>
      <Particles count={25} colors={['#ffec00', '#00f5ff', '#bf00ff']} />

      {/* Quotation mark icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(5rem, 12vw, 10rem)',
          fontWeight: 900,
          color: '#00f5ff',
          lineHeight: 0.8,
          marginBottom: -20,
          userSelect: 'none',
        }}
      >
        “
      </motion.div>

      {/* Quote text */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
          fontWeight: 700,
          color: '#e8e8ff',
          textShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
          lineHeight: 1.25,
          maxWidth: 900,
          margin: '0 0 24px',
          letterSpacing: '0.02em',
        }}
      >
        {slide.quote}
      </motion.h2>

      {/* Divider line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'min(200px, 40vw)' }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #ff006e, transparent)',
          boxShadow: '0 0 8px #ff006e',
          marginBottom: 24,
        }}
      />

      {/* Author */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(1rem, 2vw, 1.4rem)',
          color: '#ff006e',
          textShadow: '0 0 10px rgba(255, 0, 110, 0.4)',
          letterSpacing: '0.15em',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        — {slide.author}
      </motion.p>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────
export default function SlideRenderer({ slide, slideIndex, onNext }) {
  switch (slide.variant) {
    case 'title': return <TitleLayout slide={slide} />;
    case 'diagram': return <DiagramLayout slide={slide} />;
    case 'text': return <TextLayout slide={slide} slideIndex={slideIndex} />;
    case 'quote': return <QuoteLayout slide={slide} />;
    case 'thankyou': return <ThankYouLayout slide={slide} onNext={onNext} />;
    default: return null;
  }
}
