import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Inbox, Phone, Mail, Baby, Loader2, Megaphone, Plus, Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STATUS = ["novo", "em contato", "matriculado", "arquivado"];
const STATUS_COLOR = {
  novo: "bg-honey text-dark",
  "em contato": "bg-amber text-cream",
  matriculado: "bg-moss text-cream",
  arquivado: "bg-ink/20 text-ink",
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [aviso, setAviso] = useState({ titulo: "", texto: "", categoria: "Geral" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("favo_token");

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const load = async () => {
    try {
      const [l, a] = await Promise.all([
        axios.get(`${API}/admin/leads`, auth),
        axios.get(`${API}/avisos`, auth),
      ]);
      setLeads(l.data);
      setAvisos(a.data);
    } catch {
      localStorage.removeItem("favo_token");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await axios.patch(`${API}/admin/leads/${id}`, { status }, auth);
      toast.success("Status atualizado");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const createAviso = async (e) => {
    e.preventDefault();
    if (!aviso.titulo || !aviso.texto) {
      toast.error("Preencha título e texto.");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/avisos`, aviso, auth);
      setAvisos((a) => [data, ...a]);
      setAviso({ titulo: "", texto: "", categoria: "Geral" });
      toast.success("Comunicado publicado no portal!");
    } catch {
      toast.error("Erro ao publicar");
    }
  };

  const deleteAviso = async (id) => {
    setAvisos((a) => a.filter((x) => x.id !== id));
    try {
      await axios.delete(`${API}/avisos/${id}`, auth);
      toast.success("Comunicado removido");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const logout = () => {
    localStorage.removeItem("favo_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream-2" data-testid="admin-dashboard">
      <header className="bg-dark">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
            <span className="font-display font-extrabold tracking-tight text-cream">Painel · Favo de Mel</span>
          </div>
          <button onClick={logout} data-testid="logout-btn" className="inline-flex items-center gap-2 text-cream/80 hover:text-honey font-body text-sm transition-colors">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">
        {loading ? (
          <div className="flex items-center gap-2 text-ink-2 font-body py-20 justify-center">
            <Loader2 className="animate-spin" /> Carregando...
          </div>
        ) : (
        <Tabs defaultValue="contatos">
          <TabsList data-testid="admin-tabs" className="mb-8">
            <TabsTrigger value="contatos" data-testid="tab-contatos">Contatos & Matrículas</TabsTrigger>
            <TabsTrigger value="comunicados" data-testid="tab-comunicados">Comunicados</TabsTrigger>
          </TabsList>

          <TabsContent value="contatos">
            <div className="flex items-center gap-3 mb-8">
              <Inbox className="text-amber" />
              <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Contatos recebidos</h1>
              <Badge className="bg-honey text-dark font-body" data-testid="leads-count">{leads.length}</Badge>
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-20 font-body text-ink-2" data-testid="empty-state">Nenhum contato ainda.</div>
            ) : (
              <div className="grid gap-4">
                {leads.map((l) => (
                  <div key={l.id} data-testid={`lead-${l.id}`} className="bg-cream rounded-2xl border border-ink/10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display font-bold text-lg text-ink">{l.parent_name}</p>
                        {l.program && <Badge variant="outline" className="font-body border-amber text-amber">{l.program}</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm" style={{ color: "var(--ink-2)" }}>
                        <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {l.email}</span>
                        <span className="inline-flex items-center gap-1.5"><Phone size={13} /> {l.phone}</span>
                        {l.child_name && <span className="inline-flex items-center gap-1.5"><Baby size={13} /> {l.child_name}</span>}
                      </div>
                      {l.message && <p className="font-body text-sm text-ink-2 max-w-xl pt-1">{l.message}</p>}
                    </div>
                    <div className="shrink-0">
                      <Select value={l.status} onValueChange={(v) => setStatus(l.id, v)}>
                        <SelectTrigger data-testid={`status-${l.id}`} className={`w-[160px] font-body border-0 ${STATUS_COLOR[l.status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comunicados">
            <div className="flex items-center gap-3 mb-8">
              <Megaphone className="text-amber" />
              <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Comunicados do portal</h1>
              <Badge className="bg-honey text-dark font-body" data-testid="avisos-count">{avisos.length}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={createAviso} data-testid="aviso-form" className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-4 h-fit">
                <p className="font-display font-bold text-lg text-ink">Novo comunicado</p>
                <Input data-testid="aviso-titulo" placeholder="Título" value={aviso.titulo} onChange={(e) => setAviso({ ...aviso, titulo: e.target.value })} className="font-body" />
                <Select value={aviso.categoria} onValueChange={(v) => setAviso({ ...aviso, categoria: v })}>
                  <SelectTrigger data-testid="aviso-categoria" className="font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea data-testid="aviso-texto" placeholder="Mensagem para os responsáveis" value={aviso.texto} onChange={(e) => setAviso({ ...aviso, texto: e.target.value })} className="font-body min-h-[120px]" />
                <button type="submit" data-testid="aviso-submit" className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">
                  <Plus size={16} /> Publicar no portal
                </button>
              </form>

              <div className="space-y-3">
                {avisos.length === 0 ? (
                  <p className="font-body text-sm text-ink-2">Nenhum comunicado publicado.</p>
                ) : avisos.map((a) => (
                  <div key={a.id} data-testid={`aviso-${a.id}`} className="bg-cream rounded-2xl border border-ink/10 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge className="bg-honey text-dark font-body mb-2">{a.categoria}</Badge>
                        <h3 className="font-display font-bold text-ink">{a.titulo}</h3>
                        <p className="font-body text-sm mt-1" style={{ color: "var(--ink-2)" }}>{a.texto}</p>
                      </div>
                      <button onClick={() => deleteAviso(a.id)} data-testid={`delete-aviso-${a.id}`} aria-label="Remover" className="text-ink-2 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>
    </div>
  );
}
