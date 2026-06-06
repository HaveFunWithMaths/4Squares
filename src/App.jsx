import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { slides } from './slides/slideData';
import SlideRenderer from './components/SlideRenderer';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 1,
  }),
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;

  const goNext = useCallback(() => {
    setCurrent(c => {
      if (c < total - 1) {
        setDirection(1);
        return c + 1;
      }
      return c;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent(c => {
      if (c > 0) {
        setDirection(-1);
        return c - 1;
      }
      return c;
    });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const handleAreaClick = (e) => {
    if (e.target.closest('button')) return;
    if (e.clientX > window.innerWidth / 2) goNext();
    else goPrev();
  };

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="app-root" onClick={handleAreaClick}>
      {/* Animated neon grid background */}
      <div className="bg-grid" />

      {/* CRT / scanline overlays */}
      <div className="scanlines" />
      <div className="vignette" />

      {/* Corner decorators */}
      <div className="corner-decorator tl" />
      <div className="corner-decorator tr" />
      <div className="corner-decorator bl" />
      <div className="corner-decorator br" />

      {/* Slide content area */}
      <div className="slide-area" style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 220, damping: 28 },
              opacity: { duration: 0.2 }
            }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}
          >
            <SlideRenderer
              slide={slides[current]}
              slideIndex={current}
              onNext={goNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <motion.div
          className="progress-bar-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Slide counter */}
      <div className="slide-counter">
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Navigation buttons */}
      <button
        className="nav-btn prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        aria-label="Previous slide"
      >◀</button>
      <button
        className="nav-btn next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        aria-label="Next slide"
      >▶</button>
    </div>
  );
}
