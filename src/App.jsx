import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { slides } from './slides/slideData';
import SlideRenderer from './components/SlideRenderer';

export default function App() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [total]);

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
      <div className="slide-area">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
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
