import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ArrowDown } from "lucide-react";
import { SCHOOL, IMAGES } from "@/lib/content";

const line = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.35 + i * 0.12 },
  }),
};

const MaskedLine = ({ children, i, className }) => (
  <span className="block overflow-hidden">
    <motion.span variants={line} custom={i} initial="hidden" animate="show" className={`block ${className || ""}`}>
      {children}
    </motion.span>
  </span>
);

export const Hero = ({ configs }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} id="inicio" className="relative min-h-screen pt-28 pb-10 overflow-hidden" data-testid="hero-section">
      {/* Background texture */}
      <div className="absolute inset-0 w-full h-full opacity-35 pointer-events-none z-0 select-none">
        <img 
          src="/fundo.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-7rem)] z-10 relative">
        {/* Left: kinetic type centered inside column */}
        <div className="lg:col-span-7 flex flex-col items-center text-center justify-center">
          <div className="overflow-visible mb-2">
            <motion.h1
              variants={line}
              custom={0}
              initial="hidden"
              animate="show"
              className="font-display font-black tracking-tighter uppercase text-ink text-4xl sm:text-6xl lg:text-[5rem] leading-none"
            >
              Centro Educacional
            </motion.h1>
          </div>

          <h1 className="font-display font-black tracking-tighter leading-[0.85] text-ink text-[12vw] sm:text-[10vw] lg:text-[7.5vw] flex flex-col items-center">
            <MaskedLine i={1} className="">FAVO</MaskedLine>
            <MaskedLine i={2} className="text-amber italic font-serif-ed font-normal lowercase my-2">de</MaskedLine>
            <MaskedLine i={3} className="">MEL</MaskedLine>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center mt-6"
          >
            <span className="font-body text-xs tracking-[0.18em] uppercase text-dark font-black bg-cream/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-dark/10">
              {configs?.school_tagline}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 z-10 w-full flex justify-center lg:justify-end lg:pr-[2%]"
          >
            <a
              href="#contato"
              data-testid="hero-cta"
              className="inline-flex items-center gap-2 bg-dark text-cream px-8 py-4 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Agende uma visita <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right: video container */}
        <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0 min-h-[550px]">
          {/* Video container */}
          <div className="relative w-[280px] h-[497px] flex items-center justify-center lg:-translate-x-12 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-[280px] h-[497px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-amber/30 bg-dark"
            >
              <video
                src="/video-favo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
