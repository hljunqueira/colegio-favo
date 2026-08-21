import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, MessageSquare } from "lucide-react";
import { FAQ_ITEMS as DEFAULT_FAQ } from "@/lib/content";

export const Faq = ({ items, configs }) => {
  const faqList = (items && items.length > 0) ? items : DEFAULT_FAQ;
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const whatsappNumber = configs?.school_phone_raw || "5548996275127";

  return (
    <section id="faq" className="py-28 sm:py-36 bg-[#F5F0E6] relative border-b border-ink/10" data-testid="faq-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber/10 border border-amber/20 mb-4">
              <HelpCircle size={14} className="text-amber" />
              <span className="font-body text-xs font-black tracking-widest uppercase text-amber">
                DÚVIDAS FREQUENTES
              </span>
            </div>

            <h2 className="font-display font-black tracking-tighter text-ink text-5xl sm:text-6xl leading-[0.95] mb-6">
              Respostas claras para as <br />
              <span className="font-serif-ed italic font-normal text-amber">suas principais</span> perguntas.
            </h2>

            <p className="font-body text-base text-ink/70 mb-8 leading-relaxed">
              Separamos as dúvidas mais comuns dos pais ao ingressar no Colégio Favo. Se precisar de mais informações, nossa equipe está sempre online no WhatsApp.
            </p>

            <div className="bg-cream p-7 rounded-3xl border border-ink/10 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-ink">
                <div className="w-10 h-10 rounded-xl bg-amber/20 text-amber flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base">Ainda tem dúvidas?</h4>
                  <p className="font-body text-xs text-ink/60">Converse em tempo real com nossa coordenação</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20as%20matr%C3%ADculas%20do%20Col%C3%A9gio%20Favo.`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="cta-faq-whatsapp"
                className="w-full text-center py-3.5 px-6 rounded-full bg-dark text-cream font-body text-sm font-bold hover:bg-amber hover:text-dark transition-all duration-300 shadow-md"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  data-testid={`faq-item-${idx}`}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-cream border-amber/40 shadow-md"
                      : "bg-cream/60 border-ink/10 hover:border-amber/20 hover:bg-cream"
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-lg sm:text-xl text-ink leading-snug">
                      {item.q || item.title}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "bg-amber text-dark" : "bg-dark/5 text-ink/60"
                      }`}
                    >
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                      >
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 font-body text-sm sm:text-base leading-relaxed text-ink/75 border-t border-ink/5">
                          {item.a || item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
