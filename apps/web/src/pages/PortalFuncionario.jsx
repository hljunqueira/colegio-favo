import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Megaphone, CalendarRange, PenTool, LogOut, 
  UserCircle, Bell, Plus, Settings 
} from "lucide-react";
import { clearSession, getUser } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PortalFuncionario() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Secretaria Favo" };
  const [view, setView] = useState("mural");
  const [reqTitle, setReqTitle] = useState("");
  const [reqDept, setReqDept] = useState("secretaria");

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const submitRequest = (e) => {
    e.preventDefault();
    if (!reqTitle) {
      toast.error("Por favor, descreva a solicitação.");
      return;
    }
    toast.success("Solicitação enviada com sucesso ao setor de suprimentos/manutenção!");
    setReqTitle("");
  };

  const menuItems = [
    { key: "mural", label: "Mural Interno", icon: Megaphone },
    { key: "escala", label: "Minha Escala", icon: CalendarRange },
    { key: "solicitacoes", label: "Solicitações", icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="funcionario-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Staff</span>
        </div>
        <nav className="flex flex-col gap-1 flex-grow">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                view === item.key ? "bg-honey text-dark font-semibold" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5 transition-colors mt-auto"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-ink/5 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-lg sm:text-xl text-ink">
              Olá, {user.name} 🛠️
            </h2>
            <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Funcionário
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-ink-2 hover:bg-cream rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full" />
            </button>
            <div className="flex items-center gap-2 border-l border-ink/10 pl-4">
              <UserCircle size={24} className="text-ink-2" />
              <span className="text-xs font-semibold text-ink-2 hidden sm:inline">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="p-6 sm:p-8 flex-grow">
          {view === "mural" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Comunicados Internos</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">📢</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Reunião Geral Administrativa</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        Pedimos a presença de todos os funcionários de apoio na sexta-feira às 17:30 para alinhamento pedagógico e operacional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "escala" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Minha Escala de Horário</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                  <div>
                    <h4 className="font-body font-semibold text-sm">Escala Matutina - Recepção</h4>
                    <p className="text-[10px] text-ink-2">Entrada Principal do Centro Educacional</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Seg. a Sex. · 07:00 - 12:00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                  <div>
                    <h4 className="font-body font-semibold text-sm">Escala Vespertina - Apoio Interno</h4>
                    <p className="text-[10px] text-ink-2">Administrativo Central</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Seg. a Sex. · 13:30 - 17:30</span>
                </div>
              </div>
            </div>
          )}

          {view === "solicitacoes" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Nova Solicitação de Recurso</h3>
                <form onSubmit={submitRequest} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Setor/Departamento Destinatário</Label>
                    <select 
                      value={reqDept} 
                      onChange={(e) => setReqDept(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body"
                    >
                      <option value="secretaria">Secretaria Geral / Suprimentos</option>
                      <option value="manutencao">Manutenção e Reparos</option>
                      <option value="ti">Tecnologia (T.I)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Descrição do Pedido / Chamado</Label>
                    <textarea 
                      value={reqTitle} 
                      onChange={(e) => setReqTitle(e.target.value)} 
                      rows={5}
                      placeholder="Descreva detalhadamente a necessidade..." 
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-body"
                    />
                  </div>
                  <button type="submit" className="bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream font-body font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                    <Plus size={16} /> Enviar Solicitação
                  </button>
                </form>
              </div>

              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h4 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                  <Settings size={16} className="text-ink-2" /> Minhas Solicitações
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-cream rounded-xl border border-ink/5">
                    <h5 className="font-body font-semibold text-xs text-ink">Papel Sulfite A4 (2 Caixas)</h5>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">Status: Concluído</p>
                  </div>
                  <div className="p-3 bg-cream rounded-xl border border-ink/5">
                    <h5 className="font-body font-semibold text-xs text-ink">Manutenção do Ar Condicionado</h5>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">Status: Em Andamento</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
