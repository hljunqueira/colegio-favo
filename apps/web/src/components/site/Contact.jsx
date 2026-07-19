import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MapPin, Phone, Star, Instagram, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SCHOOL } from "@/lib/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Contact = ({ configs }) => {
  const [form, setForm] = useState({
    parent_name: "", email: "", phone: "", child_name: "", program: "", message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.parent_name || !form.email || !form.phone) {
      toast.error("Preencha nome, e-mail e telefone.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, form);
      toast.success("Recebemos seu contato! Em breve retornaremos. 🐝");
      setForm({ parent_name: "", email: "", phone: "", child_name: "", program: "", message: "" });
    } catch {
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-28 sm:py-40 bg-dark" data-testid="contact-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <span className="font-body text-sm tracking-[0.3em] uppercase text-honey font-black block mb-4">
          FALE CONOSCO
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display font-black tracking-tighter text-cream leading-[0.85] text-[13vw] lg:text-[10vw] mb-16"
        >
          VENHA NOS<br /><span className="text-stroke-cream">CONHECER</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4" data-testid="contact-address">
              <MapPin className="text-honey shrink-0 mt-1" />
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-honey mb-1">Endereço</p>
                <p className="font-body text-cream/90 text-lg">{configs?.school_address || ""}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-honey shrink-0 mt-1" />
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-honey mb-1">Telefone</p>
                <a href={`tel:${configs?.school_phone_raw || ""}`} className="font-body text-cream/90 text-lg hover:text-honey transition-colors">
                  {configs?.school_phone || ""}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="text-honey shrink-0 mt-1 fill-honey" />
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-honey mb-1">Avaliação Google</p>
                <p className="font-display font-extrabold text-cream text-2xl">{configs?.school_rating || ""} <span className="font-body font-normal text-base text-cream/60">/ {configs?.school_reviews || ""} avaliações</span></p>
              </div>
            </div>
            <a
              href={configs?.school_instagram || "#"}
              target="_blank"
              rel="noreferrer"
              data-testid="instagram-link"
              className="inline-flex items-center gap-2 text-cream/80 hover:text-honey transition-colors font-body"
            >
              <Instagram size={18} /> @{configs?.school_instagram ? configs.school_instagram.split("/").filter(Boolean).pop() : "escola"}
            </a>

            <div className="rounded-2xl overflow-hidden h-64 border border-cream/10 mt-4">
              <iframe
                title="Mapa Favo de Mel"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3)" }}
                loading="lazy"
                src="https://www.google.com/maps?q=Balne%C3%A1rio+Arroio+do+Silva+SC&output=embed"
              />
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={submit}
            data-testid="lead-form"
            className="bg-cream rounded-[1.75rem] p-7 sm:p-9 space-y-5"
          >
            <p className="font-display font-extrabold tracking-tight text-2xl text-ink">Agende uma visita</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input data-testid="input-parent-name" placeholder="Seu nome *" value={form.parent_name} onChange={(e) => update("parent_name", e.target.value)} className="font-body" />
              <Input data-testid="input-phone" placeholder="Telefone *" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="font-body" />
            </div>
            <Input data-testid="input-email" type="email" placeholder="E-mail *" value={form.email} onChange={(e) => update("email", e.target.value)} className="font-body" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input data-testid="input-child-name" placeholder="Nome da criança" value={form.child_name} onChange={(e) => update("child_name", e.target.value)} className="font-body" />
              <Select value={form.program} onValueChange={(v) => update("program", v)}>
                <SelectTrigger data-testid="select-program" className="font-body">
                  <SelectValue placeholder="Turma de interesse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Berçário & Maternal">Berçário & Maternal</SelectItem>
                  <SelectItem value="Educação Infantil">Educação Infantil</SelectItem>
                  <SelectItem value="Fundamental I">Fundamental I (1º–5º)</SelectItem>
                  <SelectItem value="Fundamental II">Fundamental II (6º–9º)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea data-testid="input-message" placeholder="Mensagem (opcional)" value={form.message} onChange={(e) => update("message", e.target.value)} className="font-body min-h-[110px]" />
            <button
              type="submit"
              disabled={loading}
              data-testid="submit-lead"
              className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-4 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : "Quero agendar"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
