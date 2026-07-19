import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, CalendarDays, GraduationCap, UtensilsCrossed, 
  LogOut, UserCircle, Bell, ChevronRight, CheckCircle2 
} from "lucide-react";
import { clearSession, getUser } from "@/lib/auth";

export default function PortalAluno() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Lucas Favo de Mel" };
  const [view, setView] = useState("mural");

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "boletim", label: "Boletim", icon: GraduationCap },
    { key: "cardapio", label: "Cardápio", icon: UtensilsCrossed },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="aluno-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Aluno</span>
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
              Olá, {user.name.split(" ")[0]} 🐝
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Aluno
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-ink-2 hover:bg-cream rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full" />
            </button>
            <div className="flex items-center gap-2 border-l border-ink/10 pl-4">
              <UserCircle size={24} className="text-ink-2" />
              <span className="text-xs font-semibold text-ink-2 hidden sm:inline">Lucas · 3º Ano</span>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="p-6 sm:p-8 flex-grow">
          {view === "mural" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mural de Avisos</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">📢</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Feira de Ciências 2026</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        Lembramos a todos os alunos que os projetos para a Feira de Ciências devem ser entregues até sexta-feira!
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">🎨</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Oficina de Artes - Nova Escala</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        Os horários das oficinas de artes foram atualizados. Verifique sua agenda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "agenda" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Minha Agenda</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber" />
                    <div>
                      <h4 className="font-body font-semibold text-sm">Prova de Matemática</h4>
                      <p className="text-[11px] text-ink-2">Geometria e Frações</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-ink-2">Amanhã · 08:30</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div>
                      <h4 className="font-body font-semibold text-sm">Trabalho de História</h4>
                      <p className="text-[11px] text-ink-2">Colonização do Brasil</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-ink-2">Sexta · 13:30</span>
                </div>
              </div>
            </div>
          )}

          {view === "boletim" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Boletim Escolar</h3>
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase tracking-wider font-semibold">
                    <th className="py-3">Matéria</th>
                    <th className="py-3">B1</th>
                    <th className="py-3">B2</th>
                    <th className="py-3">B3</th>
                    <th className="py-3">B4</th>
                    <th className="py-3">Faltas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  <tr>
                    <td className="py-3 font-semibold">Matemática</td>
                    <td className="py-3">8.5</td>
                    <td className="py-3">9.0</td>
                    <td className="py-3">—</td>
                    <td className="py-3">—</td>
                    <td className="py-3 text-red-500 font-semibold">2</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Português</td>
                    <td className="py-3">9.2</td>
                    <td className="py-3">9.5</td>
                    <td className="py-3">—</td>
                    <td className="py-3">—</td>
                    <td className="py-3">0</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">História</td>
                    <td className="py-3">8.0</td>
                    <td className="py-3">8.8</td>
                    <td className="py-3">—</td>
                    <td className="py-3">—</td>
                    <td className="py-3 text-red-500 font-semibold">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {view === "cardapio" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Cardápio do Dia</h3>
              <div className="p-5 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                <span className="text-3xl">🍲</span>
                <div>
                  <h4 className="font-display font-bold text-base text-ink">Almoço Especial</h4>
                  <p className="font-body text-xs text-ink-2 mt-1 leading-relaxed">
                    Arroz integral, feijão carioca, cubos de peito de frango grelhados, salada de tomate com alface e suco natural de uva.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
