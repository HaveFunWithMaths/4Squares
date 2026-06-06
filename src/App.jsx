import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { slides } from './slides/slideData';
import SlideRenderer from './components/SlideRenderer';
import { playClickSound, playRevealSound, setMuted } from './utils/audio';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [muted, setMutedState] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const total = slides.length;
  
  const prevCurrent = useRef(0);
  const isFirstMount = useRef(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);

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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState(m => {
      const next = !m;
      setMuted(next);
      return next;
    });
  }, []);

  const toggleHelp = useCallback(() => {
    setShowHelp(h => !h);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (key === 'h' || e.key === '?') {
        e.preventDefault();
        toggleHelp();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, toggleFullscreen, toggleMute, toggleHelp]);

  // Handle click events (desktop tap navigation)
  const handleAreaClick = (e) => {
    if (Date.now() - lastTouchTime < 100) return;
    if (e.target.closest('button') || e.target.closest('.controls-container') || e.target.closest('.help-modal')) return;
    if (e.clientX > window.innerWidth / 2) goNext();
    else goPrev();
  };

  // Touch Swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 80) {
      if (deltaX > 0) goNext();
      else goPrev();
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // Tap navigation fallback for mobile
      if (e.target.closest('button') || e.target.closest('.controls-container') || e.target.closest('.help-modal')) return;
      if (touchEndX > window.innerWidth / 2) goNext();
      else goPrev();
    }
    setLastTouchTime(Date.now());
  };

  // Fullscreen event listener to sync visual states
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  // Slide sound plays on index update
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const prevSlide = slides[prevCurrent.current];
    const currentSlide = slides[current];
    prevCurrent.current = current;

    const isAnswerReveal =
      currentSlide.variant === 'diagram' &&
      prevSlide &&
      prevSlide.variant === 'diagram' &&
      currentSlide.diagram > prevSlide.diagram;

    if (isAnswerReveal) {
      playRevealSound();
    } else {
      playClickSound();
    }
  }, [current]);

  const progress = ((current + 1) / total) * 100;

  return (
    <div 
      className="app-root" 
      onClick={handleAreaClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Floating Controls */}
      <div className="controls-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="control-btn" 
          onClick={toggleHelp} 
          aria-label="Keyboard Shortcuts"
          title="Shortcuts (H)"
        >
          ?
        </button>
        <button 
          className="control-btn" 
          onClick={toggleMute} 
          aria-label="Toggle Sound"
          title={muted ? "Unmute (M)" : "Mute (M)"}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button 
          className="control-btn" 
          onClick={toggleFullscreen} 
          aria-label="Toggle Fullscreen"
          title="Fullscreen (F)"
        >
          {isFullscreen ? '❐' : '⛶'}
        </button>
      </div>

      {/* Slide content area */}
      <div className="slide-area" style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <SlideRenderer
            slide={slides[current]}
            slideIndex={current}
            onNext={goNext}
          />
        </div>
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

      {/* Help / Shortcut Modal Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="help-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleHelp}
          >
            <motion.div
              className="help-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="help-title">SHORTCUTS & CONTROLS</h2>
              <div className="help-grid">
                <div className="help-row">
                  <span className="help-key">→ / Space</span>
                  <span className="help-desc">Next Slide</span>
                </div>
                <div className="help-row">
                  <span className="help-key">←</span>
                  <span className="help-desc">Previous Slide</span>
                </div>
                <div className="help-row">
                  <span className="help-key">F</span>
                  <span className="help-desc">Toggle Fullscreen</span>
                </div>
                <div className="help-row">
                  <span className="help-key">M</span>
                  <span className="help-desc">Toggle Sound</span>
                </div>
                <div className="help-row">
                  <span className="help-key">H / ?</span>
                  <span className="help-desc">Help Menu</span>
                </div>
                <div className="help-row">
                  <span className="help-key">Swipe L/R</span>
                  <span className="help-desc">Mobile Navigation</span>
                </div>
              </div>
              <button className="help-close-btn" onClick={toggleHelp}>CLOSE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
