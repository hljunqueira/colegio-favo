import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { SCHOOL } from "@/lib/content";

export const WhatsAppFloat = () => {
  const [open, setOpen] = useState(false);
  const msg = encodeURIComponent("Olá! Gostaria de saber mais sobre o Centro Educacional Favo de Mel. 🐝");
  const link = `https://wa.me/${SCHOOL.phoneRaw}?text=${msg}`;

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
                <span className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle size={18} className="text-white" />
                </span>
                <div>
                  <p className="font-display font-bold text-ink text-sm leading-tight">Favo de Mel</p>
                  <p className="font-body text-xs text-emerald-600">online agora</p>
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
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb457] text-white font-body font-semibold py-3 rounded-full transition-colors"
            >
              <MessageCircle size={16} /> Fale conosco agora
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
        className="relative w-15 h-15 w-[60px] h-[60px] rounded-full bg-[#25D366] shadow-xl flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {open ? <X className="text-white relative" /> : <MessageCircle className="text-white relative" size={28} />}
      </motion.button>
    </div>
  );
};
