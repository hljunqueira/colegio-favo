import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SCHOOL } from "@/lib/content";

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <img
    src="/svg-whatsapp.png"
    alt="WhatsApp"
    style={{ width: size, height: size }}
    className={`${className} object-contain`}
  />
);

export const WhatsAppFloat = ({ configs }) => {
  const [open, setOpen] = useState(false);
  const phone = configs?.school_phone || "(48) 99627-5127";
  const phoneRaw = configs?.school_phone_raw || "5548996275127";
  const msg = encodeURIComponent("Olá! Gostaria de saber mais sobre o Centro Educacional Favo de Mel. 🐝");
  const link = `https://wa.me/${phoneRaw}?text=${msg}`;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3" data-testid="whatsapp-float">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-cream border border-ink/10 rounded-2xl shadow-2xl p-5 w-72"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-white border border-ink/10 flex items-center justify-center shadow-sm">
                  <WhatsAppIcon size={20} />
                </span>
                <div>
                  <p className="font-display font-bold text-ink text-sm leading-tight">Favo de Mel</p>
                  <p className="font-body text-[11px] text-emerald-600 font-semibold mt-0.5">{phone}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} data-testid="whatsapp-close" aria-label="Fechar">
                <X size={16} className="text-ink-2" />
              </button>
            </div>
            <p className="font-body text-sm mt-4 mb-4 leading-relaxed" style={{ color: "var(--ink-2)" }}>
              Olá! 👋 Tire suas dúvidas sobre matrículas, turmas e visitas. Responderemos rapidinho!
            </p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              data-testid="whatsapp-cta"
              className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1eb457] text-white font-body font-semibold py-2.5 px-4 rounded-full transition-colors shadow-sm"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <WhatsAppIcon size={14} />
              </span>
              Fale conosco agora
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        data-testid="whatsapp-toggle"
        aria-label="Fale conosco no WhatsApp"
        className="relative w-[60px] h-[60px] rounded-full bg-white border border-ink/10 shadow-xl flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" />
        {open ? <X className="text-ink relative" size={24} /> : <WhatsAppIcon className="relative" size={32} />}
      </motion.button>
    </div>
  );
};
