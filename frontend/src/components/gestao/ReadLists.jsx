import { useEffect, useState } from "react";
import axios from "axios";
import { Wallet, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const Financeiro = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => { axios.get(`${API}/gestao/financeiro`, authHeader()).then((r) => setRows(r.data)); }, []);
  const total = rows.reduce((a, c) => a + (c.valor || 0), 0);
  const aberto = rows.filter((r) => r.status === "aberto").reduce((a, c) => a + c.valor, 0);
  return (
    <div data-testid="gestao-financeiro">
      <div className="flex items-center gap-3 mb-6"><Wallet className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Mensalidades</h1></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-cream border border-ink/10 p-5"><p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--ink-2)" }}>Total lançado</p><p className="font-display font-extrabold text-2xl text-ink">{brl(total)}</p></div>
        <div className="rounded-2xl bg-dark p-5"><p className="font-body text-xs uppercase tracking-widest text-honey">Em aberto</p><p className="font-display font-extrabold text-2xl text-cream">{brl(aberto)}</p></div>
        <div className="rounded-2xl bg-cream border border-ink/10 p-5"><p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--ink-2)" }}>Lançamentos</p><p className="font-display font-extrabold text-2xl text-ink">{rows.length}</p></div>
      </div>
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
            <th className="p-4 font-semibold">Aluno</th><th className="p-4 font-semibold">Referência</th><th className="p-4 font-semibold">Vencimento</th><th className="p-4 font-semibold text-right">Valor</th><th className="p-4 font-semibold">Status</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid="financeiro-row" className="border-t border-ink/5">
                <td className="p-4 font-semibold text-ink">{r.aluno}</td>
                <td className="p-4">{r.ref}</td>
                <td className="p-4">{r.vencimento}</td>
                <td className="p-4 text-right font-semibold">{brl(r.valor)}</td>
                <td className="p-4"><Badge className={r.status === "pago" ? "bg-emerald-600 text-white font-body" : "bg-amber text-cream font-body"}>{r.status === "pago" ? "Pago" : "Em aberto"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SimpleTable = ({ testid, icon: Icon, title, endpoint, cols }) => {
  const [rows, setRows] = useState([]);
  useEffect(() => { axios.get(`${API}${endpoint}`, authHeader()).then((r) => setRows(r.data)); }, [endpoint]);
  return (
    <div data-testid={testid}>
      <div className="flex items-center gap-3 mb-6"><Icon className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">{title}</h1><Badge className="bg-honey text-dark font-body">{rows.length}</Badge></div>
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>{cols.map((c) => <th key={c.key} className="p-4 font-semibold">{c.label}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-ink/5">
                {cols.map((c) => <td key={c.key} className="p-4 text-ink">{c.render ? c.render(r) : (r[c.key] || "—")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center font-body text-sm text-ink-2">Nenhum registro.</p>}
      </div>
    </div>
  );
};

export const Responsaveis = () => (
  <SimpleTable testid="gestao-responsaveis" icon={Users} title="Responsáveis" endpoint="/gestao/responsaveis"
    cols={[{ key: "name", label: "Nome" }, { key: "email", label: "E-mail" }, { key: "role", label: "Perfil" }]} />
);

export const Usuarios = () => (
  <SimpleTable testid="gestao-usuarios" icon={ShieldCheck} title="Usuários do sistema" endpoint="/gestao/usuarios"
    cols={[{ key: "name", label: "Nome" }, { key: "email", label: "E-mail" }, {
      key: "role", label: "Perfil", render: (r) => <Badge className={r.role === "admin" ? "bg-moss text-cream font-body" : "bg-honey text-dark font-body"}>{r.role}</Badge>,
    }]} />
);
