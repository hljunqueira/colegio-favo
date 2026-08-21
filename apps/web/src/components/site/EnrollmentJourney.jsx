import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Calendar, MessageCircle, FileText, HeartHandshake } from "lucide-react";
import { ENROLLMENT_STEPS as DEFAULT_STEPS } from "@/lib/content";

const STEP_ICONS = [
  Calendar,
  MessageCircle,
  FileText,
  HeartHandshake
];

export const EnrollmentJourney = ({ items }) => {
  const steps = (items && items.length > 0) ? items : DEFAULT_STEPS;

  return (
    <section id="passo-a-passo" className="py-28 sm:py-36 bg-[#FDFBF7] relative border-b border-ink/10 overflow-hidden" data-testid="enrollment-journey-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs font-black tracking-widest uppercase text-amber bg-amber/10 border border-amber/20 px-3.5 py-1.5 rounded-full">
              JORNADA SIMPLES & DIGITAL
            </span>
            <h2 className="mt-5 font-display font-black tracking-tighter text-ink text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Como fazer parte do <br />
              <span className="font-serif-ed italic font-normal text-amber">Colégio Favo</span> em 4 passos.
            </h2>
            <p className="mt-6 font-body text-base sm:text-lg text-ink/70">
              Desenhamos um processo acolhedor, rápido e sem complicações para que a entrada do seu filho seja um momento leve e inesquecível.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length] || CheckCircle;
            return (
              <motion.div
                key={s.id || idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                data-testid={`enrollment-step-${idx}`}
                className="bg-white p-8 rounded-3xl border border-ink/10 shadow-sm hover:shadow-xl hover:border-amber/40 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-serif-ed text-5xl font-normal text-amber/80">
                      {s.step || `0${idx + 1}`}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-amber/10 text-amber flex items-center justify-center group-hover:bg-amber group-hover:text-dark transition-all duration-300">
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-ink mb-3 group-hover:text-amber transition-colors">
                    {s.title}
                  </h3>

                  <p className="font-body text-sm sm:text-base leading-relaxed text-ink/70">
                    {s.desc || s.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-ink/5 flex items-center gap-2 text-xs font-bold text-ink/40 group-hover:text-amber transition-colors">
                  <span>ETAPA 0{idx + 1}</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <motion.a
            href="#contato"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            data-testid="cta-iniciar-matricula"
            className="inline-flex items-center gap-3 bg-amber text-dark px-10 py-5 rounded-full font-body font-black text-base hover:bg-dark hover:text-cream transition-all duration-300 shadow-lg shadow-amber/20 hover:scale-105"
          >
            INICIAR MATRÍCULA ONLINE <ArrowRight size={18} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};
