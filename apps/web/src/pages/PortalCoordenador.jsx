import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, CheckCircle2, Megaphone, LogOut, 
  UserCircle, Bell, ArrowRight, XCircle 
} from "lucide-react";
import { clearSession, getUser } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PortalCoordenador() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Coord. Pedagógica" };
  const [view, setView] = useState("planos");
  const [announcement, setAnnouncement] = useState("");

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const publishAnnouncement = (e) => {
    e.preventDefault();
    if (!announcement) {
      toast.error("Por favor, digite a mensagem do comunicado.");
      return;
    }
    toast.success("Comunicado geral publicado no mural dos pais e alunos!");
    setAnnouncement("");
  };

  const menuItems = [
    { key: "planos", label: "Planos Pedagógicos", icon: CheckCircle2 },
    { key: "mural", label: "Publicar Mural", icon: Megaphone },
    { key: "pessoas", label: "Pessoas & Contatos", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="coordenador-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Coordenação</span>
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
              Olá, {user.name} 🏫
            </h2>
            <span className="bg-[#eef4ff] text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Coordenador
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
          {view === "planos" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Aprovação de Planos de Aula</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-cream rounded-2xl border border-ink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-amber bg-amber/5 px-2 py-0.5 rounded-full">Pendente</span>
                      <h4 className="font-display font-bold text-base text-ink mt-2">Frações no Cotidiano - 3º Ano A</h4>
                      <p className="font-body text-xs text-ink-2 mt-1 leading-relaxed max-w-xl">
                        <strong>Enviado por:</strong> Prof. Ana Paula. Introdução prática utilizando fatias de pizza e simulações lúdicas na cantina.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => toast.success("Plano de aula APROVADO com sucesso!")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        onClick={() => toast.error("Plano de aula devolvido com apontamento.")}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "mural" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Publicar Comunicado Geral</h3>
              <form onSubmit={publishAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-semibold">Mensagem do Comunicado</Label>
                  <textarea 
                    value={announcement} 
                    onChange={(e) => setAnnouncement(e.target.value)} 
                    rows={6}
                    placeholder="Digite a mensagem que deseja disparar no mural pedagógico dos pais e alunos..." 
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-body"
                  />
                </div>
                <button type="submit" className="bg-honey hover:bg-honey-dark text-dark font-body font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                  <Megaphone size={16} /> Publicar Comunicado
                </button>
              </form>
            </div>
          )}

          {view === "pessoas" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Lista de Contatos</h3>
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase font-semibold">
                    <th className="py-3">Nome</th>
                    <th className="py-3">Papel</th>
                    <th className="py-3">Turma Relacionada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  <tr>
                    <td className="py-3 font-semibold">Prof. Ana Paula</td>
                    <td className="py-3">Docente</td>
                    <td className="py-3">3º Ano A & 4º Ano B</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Lucas Favo de Mel</td>
                    <td className="py-3">Aluno</td>
                    <td className="py-3">3º Ano A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
