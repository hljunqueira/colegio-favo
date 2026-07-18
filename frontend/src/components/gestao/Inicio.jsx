import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, UserCog, Wallet, Inbox, Megaphone, ArrowUpRight,
} from "lucide-react";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CARDS = [
  { key: "alunos", label: "Alunos ativos", icon: GraduationCap, to: "alunos" },
  { key: "turmas", label: "Turmas", icon: Users, to: "turmas" },
  { key: "professores", label: "Professores", icon: UserCog, to: "professores" },
  { key: "contatos_novos", label: "Novos contatos", icon: Inbox, to: "contatos" },
  { key: "comunicados", label: "Comunicados", icon: Megaphone, to: "comunicados" },
];

export const Inicio = ({ go }) => {
  const [s, setS] = useState(null);
  useEffect(() => {
    axios.get(`${API}/gestao/stats`, authHeader()).then((r) => setS(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="gestao-inicio">
      <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink mb-1">Painel de gestão</h1>
      <p className="font-body text-sm mb-8" style={{ color: "var(--ink-2)" }}>Visão geral do Centro Educacional Favo de Mel.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="col-span-2 lg:col-span-3 rounded-2xl bg-dark p-6 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-honey"><Wallet size={20} /><span className="font-body text-xs tracking-widest uppercase">Mensalidades em aberto</span></div>
            <p className="font-display font-extrabold text-cream text-4xl mt-2">{s ? brl(s.mensalidades_abertas) : "—"}</p>
          </div>
          <button onClick={() => go("financeiro")} className="inline-flex items-center gap-2 bg-honey text-dark px-5 py-3 rounded-full font-body text-sm font-semibold hover:bg-cream transition-colors">
            Ver financeiro <ArrowUpRight size={16} />
          </button>
        </motion.div>

        {CARDS.map((c, i) => (
          <motion.button
            key={c.key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => go(c.to)}
            data-testid={`stat-${c.key}`}
            className="text-left rounded-2xl bg-cream border border-ink/10 p-5 hover:border-amber transition-colors group"
          >
            <c.icon className="text-amber" size={22} />
            <p className="font-body text-xs tracking-widest uppercase mt-4" style={{ color: "var(--ink-2)" }}>{c.label}</p>
            <p className="font-display font-extrabold text-3xl text-ink">{s ? s[c.key] : "—"}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
