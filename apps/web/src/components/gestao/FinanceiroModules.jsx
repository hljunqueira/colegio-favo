import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Wallet, TrendingUp, TrendingDown, QrCode, AlertCircle, LineChart, Plus, ArrowLeft, 
  FileBarChart, Copy, CheckCircle2, DollarSign, MessageCircle, Search, Trash2, Edit 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { authHeader } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

// Importa o componente original de mensalidades
import { Financeiro } from "./ReadLists";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// --- MAIN UNIFIED FINANCEIRO COMPONENT ---
export const FinanceiroGeral = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "mensalidades", label: "Mensalidades", desc: "Listagem e baixa de mensalidades escolares", icon: Wallet, color: "bg-honey/10 text-amber" },
    { key: "receitas", label: "Receitas", desc: "Controle de receitas recebidas e conciliação", icon: TrendingUp, color: "bg-moss/10 text-moss" },
    { key: "despesas", label: "Despesas", desc: "Contas a pagar e fornecedores", icon: TrendingDown, color: "bg-rose-500/10 text-rose-500" },
    { key: "pix", label: "PIX & Boletos", desc: "Geração de cobranças automáticas e PIX", icon: QrCode, color: "bg-sky-500/10 text-sky-500" },
    { key: "inadimplencia", label: "Inadimplência", desc: "Régua de cobrança e histórico em atraso", icon: AlertCircle, color: "bg-purple-500/10 text-purple-500" },
    { key: "fluxo", label: "Fluxo de Caixa", desc: "Projeções financeiras e balanços", icon: LineChart, color: "bg-emerald-500/10 text-emerald-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "mensalidades":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para o Financeiro</button>
            <Financeiro />
          </div>
        );
      case "receitas":
        return <Receitas onBack={() => setTab("hub")} />;
      case "despesas":
        return <Despesas onBack={() => setTab("hub")} />;
      case "pix":
        return <Pix onBack={() => setTab("hub")} />;
      case "fluxo":
        return <Fluxo onBack={() => setTab("hub")} />;
      case "inadimplencia":
        return <Inadimplencia onBack={() => setTab("hub")} />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {cards.map((c) => (
              <button
                key={c.key}
                onClick={() => setTab(c.key)}
                className="bg-cream border border-ink/10 rounded-2xl p-6 text-left hover:border-amber hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[160px]"
              >
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-ink group-hover:text-amber transition-colors">{c.label}</h3>
                  <p className="font-body text-xs mt-1 leading-tight" style={{ color: "var(--ink-2)" }}>{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );
    }
  };

  return renderContent();
};

const ModuleHeader = ({ title, icon: Icon, onBack }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/5">
    <button 
      onClick={onBack}
      className="p-2 hover:bg-cream-2 rounded-full text-ink-2 hover:text-ink transition-colors flex items-center justify-center"
      title="Voltar para o Financeiro"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. RECEITAS ---
const Receitas = ({ onBack }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API}/gestao/financeiro`, authHeader()).then(r => setItems(r.data));
  }, []);

  const total = items.filter(i => i.status === "pago").reduce((acc, c) => acc + (c.valor || 0), 0);

  return (
    <div className="space-y-6">
      <ModuleHeader title="Receitas Conciliadas" icon={TrendingUp} onBack={onBack} />
      <div className="bg-gradient-to-r from-emerald-500/10 to-moss/20 border border-emerald-500/20 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-ink-2 uppercase tracking-wider block">Total de Receitas Confirmadas</span>
          <h3 className="font-display font-black text-3xl text-emerald-700 mt-1">{brl(total)}</h3>
        </div>
        <div className="p-3 bg-emerald-600 text-white rounded-2xl">
          <TrendingUp size={28} />
        </div>
      </div>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Descrição / Responsável</th>
              <th className="p-4 font-semibold">Valor</th>
              <th className="p-4 font-semibold">Vencimento</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{i.aluno?.name ? `Mensalidade - ${i.aluno.name}` : "Receita Diversa"}</td>
                <td className="p-4 text-emerald-700 font-bold">{brl(i.valor)}</td>
                <td className="p-4 text-ink-2">{new Date(i.vencimento).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <Badge className={i.status === "pago" ? "bg-moss/10 text-moss" : "bg-amber/15 text-amber"}>
                    {i.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 2. DESPESAS ---
const Despesas = ({ onBack }) => {
  const [despesas, setDespesas] = useState([
    { id: 1, fornecedor: "CPFL Energia", categoria: "Infraestrutura", valor: 3450.00, vencimento: "2026-07-28", status: "Pendente" },
    { id: 2, fornecedor: "SABESP Água", categoria: "Infraestrutura", valor: 1280.50, vencimento: "2026-07-29", status: "Pago" },
    { id: 3, fornecedor: "Editora Moderna - Material Didático", categoria: "Pedagógico", valor: 8900.00, vencimento: "2026-08-05", status: "Pendente" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fornecedor: "", categoria: "Infraestrutura", valor: "", vencimento: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.fornecedor || !form.valor || !form.vencimento) return;
    setDespesas(prev => [{ id: Date.now(), ...form, valor: parseFloat(form.valor), status: "Pendente" }, ...prev]);
    toast.success("Despesa cadastrada no contas a pagar!");
    setOpen(false);
    setForm({ fornecedor: "", categoria: "Infraestrutura", valor: "", vencimento: "" });
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setDespesas(despesas.filter(d => d.id !== deleteConfirmId));
    toast.success("Despesa removida do contas a pagar.");
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Despesas & Contas a Pagar" icon={TrendingDown} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors">
          + Nova Despesa
        </button>
      </div>

      <div className="bg-gradient-to-r from-rose-500/10 to-red-500/20 border border-rose-500/20 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-ink-2 uppercase tracking-wider block">Total de Custos / Despesas Previstas</span>
          <h3 className="font-display font-black text-3xl text-rose-700 mt-1">{brl(total)}</h3>
        </div>
        <div className="p-3 bg-rose-600 text-white rounded-2xl">
          <TrendingDown size={28} />
        </div>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Lançamento de Conta a Pagar</h4>
          <Input placeholder="Fornecedor / Descrição *" value={form.fornecedor} onChange={e => setForm({ ...form, fornecedor: e.target.value })} required />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" step="0.01" placeholder="Valor (R$) *" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required />
            <Input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Salvar Despesa</button>
          </div>
        </form>
      )}

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Fornecedor</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold">Valor</th>
              <th className="p-4 font-semibold">Vencimento</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map(d => (
              <tr key={d.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{d.fornecedor}</td>
                <td className="p-4 text-ink-2">{d.categoria}</td>
                <td className="p-4 text-rose-600 font-bold">{brl(d.valor)}</td>
                <td className="p-4 text-ink-2">{new Date(d.vencimento).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <Badge className={d.status === "Pago" ? "bg-moss/10 text-moss" : "bg-red-500/10 text-red-500"}>
                    {d.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setDeleteConfirmId(d.id)} className="text-ink-2 hover:text-red-500 transition-colors p-1" title="Excluir despesa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        title="Remover Despesa"
        description="Tem certeza de que deseja remover este lançamento do contas a pagar?"
        onConfirm={confirmDelete}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
};

// --- 3. PIX & BOLETOS ---
const Pix = ({ onBack }) => {
  const pixKey = "00020101021226850014br.gov.bcb.pix2563https://pix.escolafavodemel.com.br/qr/invoice";

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copia-e-cola copiada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Cobrança Automática & PIX Dinâmico" icon={QrCode} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 sm:p-8 space-y-6 max-w-xl">
        <div>
          <h3 className="font-display font-bold text-lg text-ink mb-1">Chave Oficial PIX do Colégio Favo</h3>
          <p className="text-xs text-ink-2">Utilizada para recebimento automatizado de mensalidades e taxas.</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-ink/10 flex items-center justify-between gap-3">
          <code className="text-xs font-mono text-ink-2 truncate max-w-xs">{pixKey}</code>
          <button 
            onClick={copyPix}
            className="inline-flex items-center gap-1.5 bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            <Copy size={14} /> Copiar Chave
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. FLUXO DE CAIXA ---
const Fluxo = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Balanço & Fluxo de Caixa" icon={LineChart} onBack={onBack} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cream border border-ink/10 rounded-2xl p-5">
          <span className="text-xs font-bold text-ink-2 block">Entradas Totais</span>
          <span className="font-display font-black text-xl text-emerald-600 block mt-1">{brl(145800)}</span>
        </div>
        <div className="bg-cream border border-ink/10 rounded-2xl p-5">
          <span className="text-xs font-bold text-ink-2 block">Saídas Totais</span>
          <span className="font-display font-black text-xl text-rose-600 block mt-1">{brl(42100)}</span>
        </div>
        <div className="bg-cream border border-ink/10 rounded-2xl p-5">
          <span className="text-xs font-bold text-ink-2 block">Saldo Operacional Liquidado</span>
          <span className="font-display font-black text-xl text-amber block mt-1">{brl(103700)}</span>
        </div>
      </div>
    </div>
  );
};

// --- 5. INADIMPLÊNCIA ---
const Inadimplencia = ({ onBack }) => {
  const [devedores, setDevedores] = useState([]);

  useEffect(() => {
    axios.get(`${API}/gestao/financeiro`, authHeader()).then(r => {
      setDevedores(r.data.filter(i => i.status === "atrasado" || i.status === "aberto"));
    });
  }, []);

  const sendWhatsAppReminder = (d) => {
    const text = encodeURIComponent(`Olá! Lembramos que a mensalidade de ${d.aluno?.name || "seu filho(a)"} no valor de ${brl(d.valor)} encontra-se em aberto. Qualquer dúvida, entre em contato conosco.`);
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Monitoramento de Inadimplência" icon={AlertCircle} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Aluno / Família</th>
              <th className="p-4 font-semibold">Valor em Atraso</th>
              <th className="p-4 font-semibold">Vencimento Original</th>
              <th className="p-4 text-right">Régua de Cobrança</th>
            </tr>
          </thead>
          <tbody>
            {devedores.map(d => (
              <tr key={d.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{d.aluno?.name || "Aluno Favo"}</td>
                <td className="p-4 text-rose-600 font-bold">{brl(d.valor)}</td>
                <td className="p-4 text-ink-2">{new Date(d.vencimento).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => sendWhatsAppReminder(d)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors"
                  >
                    <MessageCircle size={14} /> Lembrar via WhatsApp
                  </button>
                </td>
              </tr>
            ))}
            {devedores.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-2">Nenhuma mensalidade em atraso no momento!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

