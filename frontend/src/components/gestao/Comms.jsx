import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Megaphone, Plus, Trash2, Inbox, Phone, Mail, Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STATUS = ["novo", "em contato", "matriculado", "arquivado"];
const SC = { novo: "bg-honey text-dark", "em contato": "bg-amber text-cream", matriculado: "bg-moss text-cream", arquivado: "bg-ink/20 text-ink" };

export const Comunicados = () => {
  const [avisos, setAvisos] = useState([]);
  const [a, setA] = useState({ titulo: "", texto: "", categoria: "Geral" });
  const load = async () => setAvisos((await axios.get(`${API}/avisos`, authHeader())).data);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!a.titulo || !a.texto) { toast.error("Preencha título e texto."); return; }
    try { const { data } = await axios.post(`${API}/avisos`, a, authHeader()); setAvisos((x) => [data, ...x]); setA({ titulo: "", texto: "", categoria: "Geral" }); toast.success("Comunicado publicado no portal!"); }
    catch { toast.error("Erro ao publicar."); }
  };
  const del = async (id) => { setAvisos((x) => x.filter((v) => v.id !== id)); try { await axios.delete(`${API}/avisos/${id}`, authHeader()); toast.success("Removido"); } catch { toast.error("Erro"); } };

  return (
    <div data-testid="gestao-comunicados">
      <div className="flex items-center gap-3 mb-6"><Megaphone className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Comunicados</h1><Badge className="bg-honey text-dark font-body">{avisos.length}</Badge></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={create} data-testid="aviso-form" className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-4 h-fit">
          <p className="font-display font-bold text-lg text-ink">Novo comunicado</p>
          <Input data-testid="aviso-titulo" placeholder="Título" value={a.titulo} onChange={(e) => setA({ ...a, titulo: e.target.value })} className="font-body" />
          <Select value={a.categoria} onValueChange={(v) => setA({ ...a, categoria: v })}>
            <SelectTrigger data-testid="aviso-categoria" className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Geral">Geral</SelectItem><SelectItem value="Evento">Evento</SelectItem><SelectItem value="Urgente">Urgente</SelectItem></SelectContent>
          </Select>
          <Textarea data-testid="aviso-texto" placeholder="Mensagem para os responsáveis" value={a.texto} onChange={(e) => setA({ ...a, texto: e.target.value })} className="font-body min-h-[120px]" />
          <button type="submit" data-testid="aviso-submit" className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors"><Plus size={16} /> Publicar no portal</button>
        </form>
        <div className="space-y-3">
          {avisos.map((v) => (
            <div key={v.id} data-testid={`aviso-${v.id}`} className="bg-cream rounded-2xl border border-ink/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div><Badge className="bg-honey text-dark font-body mb-2">{v.categoria}</Badge><h3 className="font-display font-bold text-ink">{v.titulo}</h3><p className="font-body text-sm mt-1" style={{ color: "var(--ink-2)" }}>{v.texto}</p></div>
                <button onClick={() => del(v.id)} data-testid={`delete-aviso-${v.id}`} className="text-ink-2 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Contatos = () => {
  const [leads, setLeads] = useState([]);
  useEffect(() => { axios.get(`${API}/admin/leads`, authHeader()).then((r) => setLeads(r.data)); }, []);
  const setStatus = async (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try { await axios.patch(`${API}/admin/leads/${id}`, { status }, authHeader()); toast.success("Status atualizado"); } catch { toast.error("Erro"); }
  };
  return (
    <div data-testid="gestao-contatos">
      <div className="flex items-center gap-3 mb-6"><Inbox className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Contatos & Matrículas</h1><Badge className="bg-honey text-dark font-body" data-testid="leads-count">{leads.length}</Badge></div>
      {leads.length === 0 ? <p className="font-body text-sm text-ink-2" data-testid="empty-state">Nenhum contato ainda.</p> : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <div key={l.id} data-testid={`lead-${l.id}`} className="bg-cream rounded-2xl border border-ink/10 p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap"><p className="font-display font-bold text-lg text-ink">{l.parent_name}</p>{l.program && <Badge variant="outline" className="font-body border-amber text-amber">{l.program}</Badge>}</div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm" style={{ color: "var(--ink-2)" }}>
                  <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {l.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone size={13} /> {l.phone}</span>
                  {l.child_name && <span className="inline-flex items-center gap-1.5"><Baby size={13} /> {l.child_name}</span>}
                </div>
                {l.message && <p className="font-body text-sm text-ink-2 max-w-xl pt-1">{l.message}</p>}
              </div>
              <Select value={l.status} onValueChange={(v) => setStatus(l.id, v)}>
                <SelectTrigger data-testid={`status-${l.id}`} className={`w-[160px] font-body border-0 ${SC[l.status] || ""}`}><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
