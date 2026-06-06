import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export default function SlideWrapper({ children, slideKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.38, ease: [0.77, 0, 0.175, 1] }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          inset: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
