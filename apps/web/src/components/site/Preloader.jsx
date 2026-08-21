import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      if (onFinish) onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#212B22] flex flex-col items-center justify-center select-none"
          data-testid="site-preloader"
        >
          {/* Ambient Glow */}
          <div className="absolute w-96 h-96 bg-amber/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Showcase with Elastic Reveal */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-4 z-10"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-3 bg-white/10 backdrop-blur-md border border-amber/30 shadow-2xl flex items-center justify-center"
            >
              <img
                src="/logo-favo-oficial.png"
                alt="Colégio Favo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,176,29,0.5)]"
              />
            </motion.div>

            <div className="text-center mt-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-cream tracking-tight uppercase">
                COLÉGIO <span className="text-amber">FAVO</span>
              </h2>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-honey/80 font-bold mt-1">
                Educação com Afeto
              </p>
            </div>
          </motion.div>

          {/* Golden Progress Bar */}
          <div className="mt-10 w-48 sm:w-56 h-[3px] bg-cream/15 overflow-hidden rounded-full z-10 relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-amber to-honey shadow-[0_0_15px_rgba(255,176,29,0.9)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
