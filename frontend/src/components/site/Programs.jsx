import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROGRAMS } from "@/lib/content";

export const Programs = () => {
  return (
    <section id="turmas" className="py-28 sm:py-40 bg-cream-2" data-testid="programs-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-body text-xs tracking-[0.25em] uppercase text-amber font-semibold">
              Nossos segmentos
            </span>
            <h2 className="mt-5 font-display font-extrabold tracking-tighter text-ink text-5xl sm:text-6xl leading-[0.9]">
              Do berçário<br />ao 9º ano.
            </h2>
          </div>
          <p className="max-w-sm font-body text-base" style={{ color: "var(--ink-2)" }}>
            Educação Infantil e Ensino Fundamental em ambientes pensados para cada fase do desenvolvimento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROGRAMS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`relative rounded-[1.75rem] overflow-hidden bg-dark group ${i % 2 === 1 ? "lg:mt-12" : ""}`}
              data-testid={`program-card-${p.title}`}
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif-ed text-3xl text-honey">{p.n}</span>
                  <ArrowUpRight className="text-honey opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-extrabold tracking-tight text-xl text-cream">
                  {p.title}
                </h3>
                <p className="font-body text-xs tracking-widest uppercase text-honey mt-1 mb-3">{p.age}</p>
                <p className="font-body text-sm text-cream/70 leading-relaxed">{p.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
