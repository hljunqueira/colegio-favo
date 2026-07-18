import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Inbox, Phone, Mail, Baby, Loader2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("favo_token");

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/leads`, auth);
      setLeads(data);
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

  const logout = () => {
    localStorage.removeItem("favo_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream-2" data-testid="admin-dashboard">
      <header className="bg-dark">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 hex-clip bg-honey flex items-center justify-center">
              <span className="font-display font-black text-dark">F</span>
            </span>
            <span className="font-display font-extrabold tracking-tight text-cream">Painel · Favo de Mel</span>
          </div>
          <button onClick={logout} data-testid="logout-btn" className="inline-flex items-center gap-2 text-cream/80 hover:text-honey font-body text-sm transition-colors">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Inbox className="text-amber" />
          <h1 className="font-display font-extrabold tracking-tight text-3xl text-ink">
            Contatos & Matrículas
          </h1>
          <Badge className="bg-honey text-dark font-body" data-testid="leads-count">{leads.length}</Badge>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-ink-2 font-body py-20 justify-center">
            <Loader2 className="animate-spin" /> Carregando...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 font-body text-ink-2" data-testid="empty-state">
            Nenhum contato ainda.
          </div>
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
      </main>
    </div>
  );
}
