import { motion } from "framer-motion";
import { MANIFESTO, IMAGES } from "@/lib/content";

export const Manifesto = () => {
  return (
    <section id="filosofia" className="py-28 sm:py-40 bg-cream" data-testid="manifesto-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20"
        >
          <span className="font-body text-xs tracking-[0.25em] uppercase text-amber font-semibold">
            Nossa filosofia
          </span>
          <h2 className="mt-5 font-display font-extrabold tracking-tighter text-ink text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
            Aprender é um<br />
            <span className="font-serif-ed italic font-normal text-amber">doce</span> caminho.
          </h2>
        </motion.div>

        <div className="space-y-2">
          {MANIFESTO.map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-12 border-t border-ink/10 items-start group"
            >
              <div className="md:col-span-3 font-serif-ed text-7xl sm:text-8xl leading-none text-amber/90">
                {m.n}
              </div>
              <h3 className="md:col-span-4 font-display font-extrabold tracking-tight text-3xl sm:text-4xl text-ink group-hover:text-amber transition-colors duration-300">
                {m.title}
              </h3>
              <p className="md:col-span-5 font-body text-base sm:text-lg" style={{ color: "var(--ink-2)" }}>
                {m.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
