import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Megaphone, Plus, Trash2, Inbox, Phone, Mail, Baby, ArrowLeft, 
  MessagesSquare, PartyPopper, CheckCircle2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authHeader } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

import { API } from "@/lib/api";
const STATUS = ["novo", "em contato", "matriculado", "arquivado"];
const SC = { novo: "bg-honey text-dark", "em contato": "bg-amber text-cream", matriculado: "bg-moss text-cream", arquivado: "bg-ink/20 text-ink" };

// --- MAIN UNIFIED COMUNICAÇÃO COMPONENT ---
export const Comunicacao = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "comunicados", label: "Comunicados", desc: "Publicação de avisos oficiais no portal", icon: Megaphone, color: "bg-amber/10 text-amber" },
    { key: "contatos", label: "Contatos & Leads", desc: "Acompanhamento de novos contatos e matrículas", icon: Inbox, color: "bg-moss/10 text-moss" },
    { key: "mensagens", label: "Mensagens & Chat", desc: "Chat e mensagens diretas com as famílias", icon: MessagesSquare, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "eventos", label: "Eventos & Festividades", desc: "Planejamento e engajamento em eventos", icon: PartyPopper, color: "bg-rose-500/10 text-rose-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "comunicados":
        return <Comunicados onBack={() => setTab("hub")} />;
      case "contatos":
        return <Contatos onBack={() => setTab("hub")} />;
      case "mensagens":
        return <Mensagens onBack={() => setTab("hub")} />;
      case "eventos":
        return <Eventos onBack={() => setTab("hub")} />;
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
      title="Voltar para a Comunicação"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. COMUNICADOS ---
const Comunicados = ({ onBack }) => {
  const [avisos, setAvisos] = useState([]);
  const [a, setA] = useState({ titulo: "", texto: "", categoria: "Geral", destinatario: "GERAL" });
  const [deleteConfirmAvisoId, setDeleteConfirmAvisoId] = useState(null);
  
  const load = async () => setAvisos((await axios.get(`${API}/avisos`, authHeader())).data);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!a.titulo || !a.texto) { toast.error("Preencha título e texto."); return; }
    try { 
      const { data } = await axios.post(`${API}/avisos`, a, authHeader()); 
      setAvisos((x) => [data, ...x]); 
      setA({ titulo: "", texto: "", categoria: "Geral", destinatario: "GERAL" }); 
      toast.success("Comunicado publicado no portal!"); 
    } catch { 
      toast.error("Erro ao publicar."); 
    }
  };

  const del = (id) => { 
    setDeleteConfirmAvisoId(id);
  };

  const confirmDel = async () => {
    if (!deleteConfirmAvisoId) return;
    try { 
      await axios.delete(`${API}/avisos/${deleteConfirmAvisoId}`, authHeader()); 
      setAvisos((x) => x.filter((v) => v.id !== deleteConfirmAvisoId));
      setDeleteConfirmAvisoId(null);
      toast.success("Removido com sucesso"); 
    } catch { 
      toast.error("Erro ao remover."); 
    } 
  };

  const translateDestinatario = (dest) => {
    const map = {
      GERAL: "Geral",
      PARENT: "Pais / Responsáveis",
      STUDENT: "Alunos",
      COORDINATOR: "Coordenadores",
      TEACHER: "Professores",
      STAFF: "Funcionários"
    };
    return map[dest] || dest;
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Comunicados Oficiais" icon={Megaphone} onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={create} className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-4 h-fit">
          <p className="font-display font-bold text-lg text-ink">Novo comunicado</p>
          <Input placeholder="Título" value={a.titulo} onChange={(e) => setA({ ...a, titulo: e.target.value })} className="font-body" />
          <div className="grid grid-cols-2 gap-4">
            <Select value={a.categoria} onValueChange={(v) => setA({ ...a, categoria: v })}>
              <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={a.destinatario} onValueChange={(v) => setA({ ...a, destinatario: v })}>
              <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GERAL">Geral (Todos)</SelectItem>
                <SelectItem value="PARENT">Pais / Responsáveis</SelectItem>
                <SelectItem value="STUDENT">Alunos</SelectItem>
                <SelectItem value="COORDINATOR">Coordenadores</SelectItem>
                <SelectItem value="TEACHER">Professores</SelectItem>
                <SelectItem value="STAFF">Funcionários</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Mensagem do comunicado..." value={a.texto} onChange={(e) => setA({ ...a, texto: e.target.value })} className="font-body min-h-[120px]" />
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors"><Plus size={16} /> Publicar no portal</button>
        </form>
        <div className="space-y-3">
          {avisos.map((v) => (
            <div key={v.id} className="bg-cream rounded-2xl border border-ink/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-honey text-dark font-body">{v.categoria}</Badge>
                    <Badge variant="outline" className="border-dark/20 text-dark/70 font-body text-[10px]">Para: {translateDestinatario(v.destinatario)}</Badge>
                  </div>
                  <h3 className="font-display font-bold text-ink">{v.titulo}</h3>
                  <p className="font-body text-sm mt-1 text-ink-2">{v.texto}</p>
                </div>
                <button onClick={() => del(v.id)} className="text-ink-2 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteConfirmAvisoId}
        onOpenChange={(open) => !open && setDeleteConfirmAvisoId(null)}
        title="Remover Comunicado Oficial"
        description="Tem certeza de que deseja remover este comunicado do portal? Ele deixará de ser exibido aos usuários."
        onConfirm={confirmDel}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
};

// --- 2. CONTATOS ---
const Contatos = ({ onBack }) => {
  const [leads, setLeads] = useState([]);
  
  useEffect(() => { 
    axios.get(`${API}/admin/leads`, authHeader()).then((r) => setLeads(r.data)); 
  }, []);

  const setStatus = async (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try { 
      await axios.patch(`${API}/admin/leads/${id}`, { status }, authHeader()); 
      toast.success("Status atualizado"); 
    } catch { 
      toast.error("Erro"); 
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Contatos & Leads" icon={Inbox} onBack={onBack} />
      {leads.length === 0 ? <p className="font-body text-sm text-ink-2">Nenhum contato ainda.</p> : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <div key={l.id} className="bg-cream rounded-2xl border border-ink/10 p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-display font-bold text-lg text-ink">{l.parent_name}</p>
                  {l.program && <Badge variant="outline" className="font-body border-amber text-amber">{l.program}</Badge>}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm text-ink-2">
                  <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {l.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone size={13} /> {l.phone}</span>
                  {l.child_name && <span className="inline-flex items-center gap-1.5"><Baby size={13} /> {l.child_name}</span>}
                </div>
                {l.message && <p className="font-body text-sm text-ink-2 max-w-xl pt-1">{l.message}</p>}
              </div>
              <Select value={l.status} onValueChange={(v) => setStatus(l.id, v)}>
                <SelectTrigger className={`w-[160px] font-body border-0 ${SC[l.status] || ""}`}><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 3. MENSAGENS / CHAT ---
const Mensagens = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Mensagens & Chat" icon={MessagesSquare} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Portal de mensagens direta integradas às famílias dos alunos.</p>
      </div>
    </div>
  );
};

// --- 4. EVENTOS ---
const Eventos = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Eventos Escolares" icon={PartyPopper} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Confirmação de presença em eventos pedagógicos e festividades.</p>
      </div>
    </div>
  );
};
