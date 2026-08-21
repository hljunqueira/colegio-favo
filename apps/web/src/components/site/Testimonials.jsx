import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS as DEFAULT_TESTIMONIALS, SCHOOL } from "@/lib/content";

export const Testimonials = ({ items, configs }) => {
  const testimonials = (items && items.length > 0) ? items : DEFAULT_TESTIMONIALS;
  const rating = configs?.school_rating || SCHOOL.rating;
  const reviewsCount = configs?.school_reviews || SCHOOL.reviews;

  return (
    <section id="depoimentos" className="py-28 sm:py-36 bg-[#212B22] text-cream relative overflow-hidden" data-testid="testimonials-section">
      <div className="absolute top-1/2 -left-48 -translate-y-1/2 w-96 h-96 bg-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 -translate-y-1/2 w-96 h-96 bg-amber/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/10 border border-cream/20 mb-4">
              <Star size={14} className="text-amber fill-amber" />
              <span className="font-body text-xs font-black tracking-widest uppercase text-cream">
                VOZES DA NOSSA COLMEIA
              </span>
            </div>
            <h2 className="font-display font-black tracking-tighter text-cream text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              O que dizem as famílias que <br />
              <span className="font-serif-ed italic font-normal text-amber">confiam em nós</span> todos os dias.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-cream/10 backdrop-blur-md p-6 rounded-3xl border border-cream/15 flex items-center gap-5 w-fit"
          >
            <div className="text-center">
              <div className="font-display font-black text-4xl text-amber">{rating}</div>
              <div className="flex text-amber gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber" />
                ))}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-cream/20" />
            <div>
              <div className="font-display font-bold text-base text-cream">Avaliação no Google</div>
              <div className="font-body text-xs text-cream/70 mt-0.5">Mais de {reviewsCount} avaliações reais</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              data-testid={`testimonial-card-${idx}`}
              className="bg-[#2A372B] p-8 sm:p-10 rounded-3xl border border-cream/10 flex flex-col justify-between relative hover:border-amber/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 text-amber">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber" />
                    ))}
                  </div>
                  <Quote size={32} className="text-cream/10" />
                </div>

                <p className="font-serif-ed italic text-xl sm:text-2xl leading-relaxed text-cream/90 mb-8">
                  "{item.text || item.description}"
                </p>
              </div>

              <div className="pt-6 border-t border-cream/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber/20 text-amber font-display font-black flex items-center justify-center text-lg border border-amber/30">
                  {item.name ? item.name.charAt(0) : "F"}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-cream flex items-center gap-1.5">
                    {item.name}
                    <CheckCircle2 size={14} className="text-amber" />
                  </h4>
                  <p className="font-body text-xs text-cream/60">
                    {item.role || item.extra || "Responsável"} {item.city && `· ${item.city}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
