import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Star, ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { SCHOOL } from "@/lib/content";

const line = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 },
  }),
};

const MaskedLine = ({ children, i, className }) => (
  <span className="block overflow-hidden py-2 -my-2 px-1 text-center w-full">
    <motion.span variants={line} custom={i} initial="hidden" animate="show" className={`block text-center ${className || ""}`}>
      {children}
    </motion.span>
  </span>
);

// Golden Pollen Particles
const POLLEN_PARTICLES = [
  { id: 1, top: "20%", left: "14%", size: 6, delay: 0, duration: 6 },
  { id: 2, top: "35%", left: "86%", size: 8, delay: 1.2, duration: 7 },
  { id: 3, top: "65%", left: "18%", size: 5, delay: 2.4, duration: 5.5 },
  { id: 4, top: "75%", left: "92%", size: 7, delay: 0.8, duration: 8 },
  { id: 5, top: "18%", left: "70%", size: 5, delay: 3, duration: 6.5 },
  { id: 6, top: "50%", left: "28%", size: 9, delay: 1.8, duration: 7.5 },
  { id: 7, top: "45%", left: "6%", size: 6, delay: 2.2, duration: 6 },
  { id: 8, top: "60%", left: "80%", size: 6, delay: 3.5, duration: 7 },
];

export const Hero = ({ configs }) => {
  const ref = useRef(null);
  const mascotRef = useRef(null);

  // Parallax Scroll Tracking inspired by Apple & UP Ideias
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax Transforms
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  // Bee Morph & Scroll Parallax
  const beeScrollY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const beeScrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  // Orbiting Rings
  const orbitRotateCw = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbitRotateCcw = useTransform(scrollYProgress, [0, 1], [0, -160]);

  // Interactive 3D Mouse Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e) => {
    if (!mascotRef.current) return;
    const rect = mascotRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseClientX = e.clientX - rect.left;
    const mouseClientY = e.clientY - rect.top;
    const xPct = mouseClientX / width - 0.5;
    const yPct = mouseClientY / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const phoneRaw = configs?.school_phone_raw || "5548996275127";
  const tagline = configs?.school_tagline || SCHOOL.tagline;

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative min-h-[94vh] pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center bg-[#FDFBF7]"
      data-testid="hero-section"
    >
      {/* Background Honeycomb Texture with Parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-25 pointer-events-none z-0 select-none will-change-transform"
      >
        <img
          src="/fundo.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Floating Golden Pollen Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {POLLEN_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-10, -90, -180],
              x: [0, (p.id % 2 === 0 ? 1 : -1) * 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            className="rounded-full bg-gradient-to-tr from-amber to-honey shadow-[0_0_12px_rgba(255,176,29,0.9)] blur-[0.5px]"
          />
        ))}
      </div>

      {/* Warm Ambient Glow Behind Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber/20 via-honey/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Central Content Container */}
      <motion.div
        style={{ y: textY, opacity: contentOpacity }}
        className="max-w-[1300px] mx-auto px-5 sm:px-8 w-full flex flex-col items-center text-center z-20 relative will-change-transform"
      >
        
        {/* Title + Logo aligned on the right side of the title */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 mb-8">
          
          {/* Main Kinetic Heading */}
          <h1 className="font-display font-black tracking-tighter leading-[0.9] text-ink text-6xl sm:text-7xl lg:text-[6.8vw] uppercase flex flex-col items-center text-center">
            <MaskedLine i={0} className="w-full text-center">COLÉGIO</MaskedLine>
            <MaskedLine i={1} className="w-full text-center text-amber">FAVO</MaskedLine>
          </h1>

          {/* Logo Mascot on the Right of Title */}
          <motion.div
            ref={mascotRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              y: beeScrollY,
              scale: beeScrollScale,
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }}
            className="relative flex items-center justify-center cursor-pointer will-change-transform select-none"
          >
            {/* Layer 1: Dashed Geometric Ring */}
            <motion.div
              style={{ rotate: orbitRotateCw }}
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border border-dashed border-amber/30 pointer-events-none"
            />

            {/* Layer 2: Outer Thin Ring */}
            <motion.div
              style={{ rotate: orbitRotateCcw }}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border border-honey/20 pointer-events-none"
            />

            {/* Layer 3: Organic Floating Bee Mascot */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 flex items-center justify-center group"
            >
              {/* Dynamic Breathing Golden Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber/30 via-honey/30 to-transparent rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              <img
                src="/logo-favo-oficial.png"
                alt="Colégio Favo"
                className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(230,138,0,0.35)] transform group-hover:scale-108 transition-transform duration-300 pointer-events-none"
              />
            </motion.div>
          </motion.div>

        </div>

        {/* Institutional Subtitle (Centered) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-base sm:text-lg text-ink/75 max-w-2xl mx-auto leading-relaxed mb-8 text-center"
        >
          {tagline}. Um espaço de afeto, acolhimento e aprendizado que estimula a curiosidade e o protagonismo de cada criança.
        </motion.p>

        {/* Central Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#contato"
            data-testid="hero-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-dark text-cream px-8 py-4 rounded-full font-body font-bold text-sm hover:bg-amber hover:text-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Agende uma visita <ArrowRight size={16} />
          </a>

          <a
            href={`https://wa.me/${phoneRaw}?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20matr%C3%ADculas%20do%20Col%C3%A9gio%20Favo.`}
            target="_blank"
            rel="noreferrer"
            data-testid="hero-whatsapp-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-cream/80 backdrop-blur-md border border-ink/15 text-ink hover:border-amber hover:text-amber px-7 py-4 rounded-full font-body font-bold text-sm transition-all duration-300 shadow-sm"
          >
            <img src="/svg-whatsapp.png" alt="" className="w-5 h-5 object-contain" />
            Falar no WhatsApp
          </a>
        </motion.div>

        {/* Trust Mini Badges (Centered) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 pt-6 border-t border-ink/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-ink/60"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber" />
              ))}
            </div>
            <span className="text-ink font-bold">4.4 no Google</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-amber" />
            <span>Balneário Arroio do Silva - SC</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-moss" />
            <span>Ambiente Seguro & Monitorado</span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};
