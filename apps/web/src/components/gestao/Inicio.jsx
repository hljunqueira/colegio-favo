import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, UserCog, Wallet, Inbox, Megaphone, ArrowUpRight,
  Library, ShieldCheck, ScrollText, CheckSquare
} from "lucide-react";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CARDS = [
  { key: "alunos", label: "Alunos ativos", icon: GraduationCap, to: "secretaria" },
  { key: "turmas", label: "Turmas", icon: Users, to: "secretaria" },
  { key: "professores", label: "Professores", icon: UserCog, to: "secretaria" },
  { key: "funcionarios", label: "Funcionários", icon: ShieldCheck, to: "administracao" },
  { key: "usuarios", label: "Usuários Logáveis", icon: UserCog, to: "administracao" },
  { key: "livros", label: "Acervo de Livros", icon: Library, to: "biblioteca" },
  { key: "contatos_novos", label: "Novos contatos", icon: Inbox, to: "comunicacao" },
  { key: "comunicados", label: "Comunicados", icon: Megaphone, to: "comunicacao" },
  { key: "solicitacoes", label: "Solicitações Pendentes", icon: CheckSquare, to: "administracao" }
];

export const Inicio = ({ go }) => {
  const [s, setS] = useState(null);
  
  useEffect(() => {
    axios.get(`${API}/gestao/stats`, authHeader())
      .then((r) => setS(r.data))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="gestao-inicio" className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="col-span-2 lg:col-span-3 rounded-2xl bg-dark p-6 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-honey">
              <Wallet size={20} />
              <span className="font-body text-xs tracking-widest uppercase">Mensalidades em aberto</span>
            </div>
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
            className="text-left rounded-2xl bg-cream border border-ink/10 p-5 hover:border-amber transition-colors group flex flex-col justify-between min-h-[140px]"
          >
            <c.icon className="text-amber transition-transform group-hover:scale-105" size={22} />
            <div>
              <p className="font-body text-xs tracking-widest uppercase mt-4 leading-tight" style={{ color: "var(--ink-2)" }}>{c.label}</p>
              <p className="font-display font-extrabold text-3xl text-ink mt-1">{s ? s[c.key] : "—"}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
