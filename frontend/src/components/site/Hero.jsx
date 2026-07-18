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

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} id="inicio" className="relative min-h-screen pt-28 pb-10 overflow-hidden" data-testid="hero-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end min-h-[calc(100vh-7rem)]">
        {/* Left: kinetic type */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-8 h-8 hex-clip bg-honey" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-amber font-semibold">
              {SCHOOL.tagline}
            </span>
          </motion.div>

          <h1 className="font-display font-black tracking-tighter leading-[0.85] text-ink text-[19vw] sm:text-[15vw] lg:text-[11vw]">
            <MaskedLine i={0}>FAVO</MaskedLine>
            <MaskedLine i={1} className="text-amber italic font-serif-ed font-normal lowercase">de</MaskedLine>
            <MaskedLine i={2}>MEL</MaskedLine>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            <p className="max-w-sm font-body text-base" style={{ color: "var(--ink-2)" }}>
              Um lugar onde cada criança é acolhida, aprende brincando e floresce no seu tempo.
            </p>
            <a
              href="#contato"
              data-testid="hero-cta"
              className="inline-flex items-center gap-2 bg-dark text-cream px-7 py-4 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors duration-300 w-fit"
            >
              Agende uma visita <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right: clipped parallax image + rating */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
            className="relative h-[46vh] lg:h-[70vh] rounded-[2rem] overflow-hidden"
          >
            <motion.img
              src={IMAGES.hero}
              alt="Criança brincando sob a luz do sol"
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -bottom-5 -left-2 lg:-left-8 bg-cream border border-ink/10 rounded-2xl px-5 py-4 shadow-xl"
            data-testid="google-rating-badge"
          >
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-honey text-honey" />
              ))}
            </div>
            <p className="font-display font-extrabold text-ink text-lg leading-none">
              {SCHOOL.rating} <span className="font-body font-medium text-xs" style={{ color: "var(--ink-2)" }}>· {SCHOOL.reviews} avaliações no Google</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
