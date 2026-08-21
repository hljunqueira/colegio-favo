import { motion } from "framer-motion";
import { HeartHandshake, Utensils, Globe2, Music, Sprout, ShieldCheck, Sparkles } from "lucide-react";
import { DIFFERENTIALS as DEFAULT_DIFFS } from "@/lib/content";

const ICON_MAP = {
  HeartHandshake: HeartHandshake,
  Utensils: Utensils,
  Globe2: Globe2,
  Music: Music,
  Sprout: Sprout,
  ShieldCheck: ShieldCheck,
};

export const Differentials = ({ items }) => {
  const diffs = (items && items.length > 0) ? items : DEFAULT_DIFFS;

  return (
    <section id="diferenciais" className="py-28 sm:py-36 bg-[#F5F0E6] border-y border-ink/10 relative overflow-hidden" data-testid="differentials-section">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-moss/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber/10 border border-amber/20 mb-4">
              <Sparkles size={14} className="text-amber" />
              <span className="font-body text-xs font-black tracking-widest uppercase text-amber">
                POR QUE O COLÉGIO FAVO?
              </span>
            </div>
            <h2 className="font-display font-black tracking-tighter text-ink text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Pilares que formam <br />
              <span className="font-serif-ed italic font-normal text-amber">crianças felizes</span> e autônomas.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-base sm:text-lg max-w-md text-ink/70"
          >
            Aliamos carinho genuíno a uma infraestrutura completa, promovendo o desenvolvimento cognitivo, motor e socioemocional em cada etapa da infância.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {diffs.map((d, i) => {
            const IconComponent = ICON_MAP[d.icon] || Sparkles;
            return (
              <motion.div
                key={d.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                data-testid={`differential-card-${i}`}
                className="bg-cream p-8 sm:p-10 rounded-3xl border border-ink/10 shadow-sm hover:shadow-xl hover:border-amber/40 transition-all duration-500 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber/10 text-amber flex items-center justify-center group-hover:bg-amber group-hover:text-dark transition-all duration-500 shadow-sm">
                      <IconComponent size={28} />
                    </div>
                    {d.tag && (
                      <span className="text-[11px] font-black font-body uppercase tracking-wider px-3 py-1 rounded-full bg-dark/5 text-ink/70 group-hover:bg-amber/15 group-hover:text-amber transition-colors">
                        {d.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-2xl text-ink mb-3 group-hover:text-amber transition-colors duration-300">
                    {d.title}
                  </h3>

                  <p className="font-body text-sm sm:text-base leading-relaxed text-ink/70">
                    {d.desc || d.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-ink/5 flex items-center justify-between text-xs font-bold text-ink/40 group-hover:text-amber transition-colors">
                  <span>DIFERENCIAL 0{i + 1}</span>
                  <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
