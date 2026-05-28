import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  onDone?: () => void;
  durationMs?: number;
}

export function SplashScreen({ onDone, durationMs = 1700 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="h-[2px] bg-[var(--color-green)]"
              initial={{ width: 0 }}
              animate={{ width: 72 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight text-[var(--color-fg)] md:text-5xl">
              Greenbook Assistant
            </h1>
            <motion.p
              className="mt-3 text-sm uppercase tracking-widest text-[var(--color-fg-muted)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              for aspiring quants
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
