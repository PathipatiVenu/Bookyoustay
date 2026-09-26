import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves } from "lucide-react";

const SESSION_KEY = "bys_splash_seen";
const EASE = [0.16, 1, 0.3, 1] as const;

export default function WelcomeSplash() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");

    const exitTimer = setTimeout(() => setExiting(true), 2100);
    const removeTimer = setTimeout(() => setVisible(false), 2900);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #FDFBF7 0%, #F7F0E4 45%, #EAD9BC 100%)",
          }}
          animate={exiting ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {/* ambient wave lines */}
          <svg
            className="pointer-events-none absolute bottom-0 left-0 w-full opacity-40"
            viewBox="0 0 1440 200"
            fill="none"
          >
            <motion.path
              d="M0 120 Q 360 60 720 120 T 1440 120 V200 H0 Z"
              fill="#C5A880"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 1.2 }}
            />
          </svg>

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(197,168,128,0.45) 0%, rgba(197,168,128,0) 70%)",
              }}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-[--color-bronze] shadow-[0_0_24px_rgba(197,168,128,0.55)] backdrop-blur-sm"
              >
                <Waves size={22} strokeWidth={1.6} />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="font-display max-w-md text-2xl leading-snug text-[--color-charcoal] sm:text-3xl"
            >
              Curated Coastal Sanctuaries
              <span className="block text-[--color-bronze]">Bapatla &amp; Chirala</span>
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
              className="mt-8 h-[2px] overflow-hidden rounded-full bg-[--color-border-soft]"
            >
              <motion.div
                className="h-full bg-[--color-bronze]"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.3, delay: 0.65, ease: EASE }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
