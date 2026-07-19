import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutGrid, CalendarDays, GraduationCap, UtensilsCrossed, 
  LogOut, UserCircle, Bell, ChevronRight, CheckCircle2, FileText, Loader2
} from "lucide-react";
import { clearSession, getUser, authHeader, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalAluno() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Aluno Favo", id: "" };
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [view, setView] = useState("mural");

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${API}/students/dashboard`, {
        ...authHeader(),
        params: { userId: user.id }
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Erro ao carregar portal do aluno.");
      clearSession();
      navigate("/portal");
    }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    loadDashboard();
  }, [navigate]);

  const student = data?.student || null;

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const exportPDF = () => {
    window.print();
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "boletim", label: "Boletim", icon: GraduationCap },
    { key: "cardapio", label: "Cardápio", icon: UtensilsCrossed },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-2 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="aluno-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo-oficial.png" alt="Colégio Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
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
              Olá, {student?.name?.split(" ")[0]} 🐝
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Aluno
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-l border-ink/10 pl-4">
              <UserCircle size={24} className="text-ink-2" />
              <span className="text-xs font-semibold text-ink-2 hidden sm:inline">{student?.name} · {student?.turma}</span>
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
                        Participe das oficinas preparatórias para a Feira de Ciências que começam nesta quarta-feira na sala multimídia!
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">🎨</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Oficina de Teatro e Criatividade</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        Inscrições abertas na secretaria. Vagas limitadas para alunos do turno da tarde.
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
                {student?.agenda.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5 hover:bg-cream-2/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${e.type === "avaliacao" ? "bg-amber" : "bg-blue-500"}`} />
                      <div>
                        <h4 className="font-body font-semibold text-sm">{e.title}</h4>
                        <p className="text-[11px] text-ink-2">{e.disciplina}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-ink-2">{new Date(e.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
                {student?.agenda.length === 0 && (
                  <p className="p-8 text-center text-ink-2">Nenhum compromisso agendado.</p>
                )}
              </div>
            </div>
          )}

          {view === "boletim" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-extrabold text-xl text-ink">Meu Boletim Escolar</h3>
                <button 
                  onClick={exportPDF}
                  className="inline-flex items-center gap-2 bg-dark text-cream hover:bg-amber hover:text-dark px-4 py-2 rounded-full font-body text-xs font-semibold transition-colors"
                >
                  <FileText size={14} /> Imprimir Boletim (PDF)
                </button>
              </div>

              <div id="boletim-table-pdf" className="p-4 bg-white border border-ink/10 rounded-2xl overflow-x-auto">
                <div className="mb-4 border-b pb-3">
                  <h2 className="font-display font-bold text-lg text-ink">Colégio Favo de Mel</h2>
                  <p className="font-body text-xs text-ink-2">Aluno: {student?.name} | Matrícula: {student?.matricula} | Turma: {student?.turma}</p>
                </div>
                <table className="w-full text-left border-collapse font-body text-xs">
                  <thead>
                    <tr className="border-b border-ink/5 text-ink-2 uppercase tracking-wider font-semibold">
                      <th className="py-3">Matéria / Disciplina</th>
                      <th className="py-3 text-center">B1</th>
                      <th className="py-3 text-center">B2</th>
                      <th className="py-3 text-center">B3</th>
                      <th className="py-3 text-center">B4</th>
                      <th className="py-3 text-center">Faltas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {student?.boletim.map((b) => (
                      <tr key={b.id} className="hover:bg-cream-2/50 transition-colors">
                        <td className="py-3 font-semibold text-ink">{b.disciplina}</td>
                        <td className="py-3 text-center">{b.b1 !== null ? b.b1 : "—"}</td>
                        <td className="py-3 text-center">{b.b2 !== null ? b.b2 : "—"}</td>
                        <td className="py-3 text-center">{b.b3 !== null ? b.b3 : "—"}</td>
                        <td className="py-3 text-center">{b.b4 !== null ? b.b4 : "—"}</td>
                        <td className="py-3 text-center text-red-500 font-bold">{b.faltas}</td>
                      </tr>
                    ))}
                    {student?.boletim.length === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-ink-2">Nenhuma nota lançada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "cardapio" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Cardápio da Semana</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {student?.cardapio.map((c, i) => (
                  <div key={i} className="p-4 bg-cream rounded-2xl border border-ink/5">
                    <p className="font-body text-xs font-semibold text-amber uppercase">{c.dia}</p>
                    <p className="font-body text-sm text-ink mt-2 leading-relaxed">{c.refeicao}</p>
                  </div>
                ))}
                {student?.cardapio.length === 0 && (
                  <p className="p-8 text-center text-ink-2">Nenhum cardápio cadastrado.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media print {
          aside, header, button {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          #boletim-table-pdf {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
