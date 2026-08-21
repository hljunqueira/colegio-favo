import { motion } from "framer-motion";
import { FACILITIES as DEFAULT_FACILITIES } from "@/lib/content";
import { Compass, Sparkles } from "lucide-react";

export const Facilities = ({ items }) => {
  const facilities = (items && items.length > 0) ? items : DEFAULT_FACILITIES;

  return (
    <section id="estrutura" className="py-28 sm:py-36 bg-cream relative" data-testid="facilities-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-moss/10 border border-moss/20 mb-4">
              <Compass size={14} className="text-moss" />
              <span className="font-body text-xs font-black tracking-widest uppercase text-moss">
                NOSSA ESTRUTURA
              </span>
            </div>
            <h2 className="font-display font-black tracking-tighter text-ink text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Espaços pensados para <br />
              <span className="font-serif-ed italic font-normal text-amber">explorar e criar</span> com segurança.
            </h2>
          </motion.div>

          <motion.a
            href="#contato"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="cta-agendar-visita-estrutura"
            className="inline-flex items-center gap-2 bg-dark text-cream px-8 py-4 rounded-full font-body text-sm font-bold hover:bg-amber hover:text-dark transition-all duration-300 shadow-md w-fit"
          >
            <Sparkles size={16} /> AGENDAR TOUR PRESENCIAL
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
              data-testid={`facility-card-${idx}`}
              className="group bg-white rounded-3xl overflow-hidden border border-ink/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-ink/5">
                <img
                  src={item.img || item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {(item.badge || item.extra) && (
                  <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-md text-ink text-xs font-black px-3.5 py-1.5 rounded-full border border-dark/10 shadow-sm">
                    {item.badge || item.extra}
                  </span>
                )}
              </div>

              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-ink mb-2.5 group-hover:text-amber transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm sm:text-base leading-relaxed text-ink/70">
                    {item.desc || item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/5 flex items-center gap-2 text-xs font-extrabold text-amber tracking-wider uppercase">
                  <span>Espaço 0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                  <span className="text-ink/40">Ambiente Seguro</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
