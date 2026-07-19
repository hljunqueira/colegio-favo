import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, ClipboardList, BookOpen, Scroll, 
  LogOut, UserCircle, Bell, Plus, CheckCircle2 
} from "lucide-react";
import { clearSession, getUser } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PortalProfessor() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Prof. Ana Paula" };
  const [view, setView] = useState("turmas");
  const [selectedClass, setSelectedClass] = useState("3o-ano");
  const [planTitle, setPlanTitle] = useState("");
  const [planDesc, setPlanDesc] = useState("");

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const submitPlan = (e) => {
    e.preventDefault();
    if (!planTitle || !planDesc) {
      toast.error("Por favor, preencha o plano de aula.");
      return;
    }
    toast.success("Plano de aula submetido para avaliação da Coordenação!");
    setPlanTitle("");
    setPlanDesc("");
  };

  const menuItems = [
    { key: "turmas", label: "Minhas Turmas", icon: BookOpen },
    { key: "chamada", label: "Chamada Diária", icon: ClipboardList },
    { key: "notas", label: "Lançar Notas", icon: GraduationCap },
    { key: "planos", label: "Planos de Aula", icon: Scroll },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="professor-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Professor</span>
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
              Olá, {user.name} 👩‍🏫
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Professor
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-cream-2 border border-ink/5 rounded-full p-1 text-xs">
              <button 
                onClick={() => setSelectedClass("3o-ano")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedClass === "3o-ano" ? "bg-honey text-dark shadow-sm" : "text-ink-2"
                }`}
              >
                3º Ano A (Matutino)
              </button>
              <button 
                onClick={() => setSelectedClass("4o-ano")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedClass === "4o-ano" ? "bg-honey text-dark shadow-sm" : "text-ink-2"
                }`}
              >
                4º Ano B (Vespertino)
              </button>
            </div>
            
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
          {view === "turmas" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-lg mb-2">3º Ano A - Ensino Fundamental</h3>
                <p className="text-xs text-ink-2 mb-4">Língua Portuguesa & Matemática</p>
                <div className="flex justify-between items-center text-xs font-semibold text-ink-2 pt-4 border-t border-ink/5">
                  <span>24 Alunos Matriculados</span>
                  <button onClick={() => setView("chamada")} className="text-amber hover:underline">Fazer Chamada</button>
                </div>
              </div>
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-lg mb-2">4º Ano B - Ensino Fundamental</h3>
                <p className="text-xs text-ink-2 mb-4">Matemática & Ciências</p>
                <div className="flex justify-between items-center text-xs font-semibold text-ink-2 pt-4 border-t border-ink/5">
                  <span>18 Alunos Matriculados</span>
                  <button onClick={() => { setSelectedClass("4o-ano"); setView("chamada"); }} className="text-amber hover:underline">Fazer Chamada</button>
                </div>
              </div>
            </div>
          )}

          {view === "chamada" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Chamada Diária - {selectedClass === "3o-ano" ? "3º Ano A" : "4º Ano B"}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-cream rounded-xl border border-ink/5">
                  <span className="text-sm font-semibold">Ana Julia Santos</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-ink/10 accent-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-cream rounded-xl border border-ink/5">
                  <span className="text-sm font-semibold">Bruno Henrique Lima</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-ink/10 accent-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-cream rounded-xl border border-ink/5">
                  <span className="text-sm font-semibold">Lucas Favo de Mel</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-ink/10 accent-emerald-500" />
                </div>
              </div>
              <button 
                onClick={() => toast.success("Presenças registradas com sucesso!")}
                className="mt-6 bg-dark text-cream font-body font-semibold px-6 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors"
              >
                Salvar Pauta
              </button>
            </div>
          )}

          {view === "notas" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Lançamento de Notas</h3>
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase font-semibold">
                    <th className="py-3">Aluno</th>
                    <th className="py-3">Avaliação 1</th>
                    <th className="py-3">Trabalho 1</th>
                    <th className="py-3">Média Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  <tr>
                    <td className="py-3 font-semibold">Ana Julia Santos</td>
                    <td className="py-3"><Input className="w-16 h-8 text-xs font-body" defaultValue="9.5" /></td>
                    <td className="py-3"><Input className="w-16 h-8 text-xs font-body" defaultValue="10.0" /></td>
                    <td className="py-3 text-emerald-600 font-bold">9.75</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Lucas Favo de Mel</td>
                    <td className="py-3"><Input className="w-16 h-8 text-xs font-body" defaultValue="8.5" /></td>
                    <td className="py-3"><Input className="w-16 h-8 text-xs font-body" defaultValue="9.0" /></td>
                    <td className="py-3 text-emerald-600 font-bold">8.75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {view === "planos" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Enviar Novo Plano de Aula</h3>
                <form onSubmit={submitPlan} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Título do Conteúdo</Label>
                    <Input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} placeholder="Ex: Multiplicação com 2 dígitos" className="font-body" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Detalhamento e Recursos</Label>
                    <textarea 
                      value={planDesc} 
                      onChange={(e) => setPlanDesc(e.target.value)} 
                      rows={5}
                      placeholder="Descreva as atividades, materiais necessários e métodos de avaliação..." 
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-body"
                    />
                  </div>
                  <button type="submit" className="bg-honey hover:bg-honey-dark text-dark font-body font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                    <Plus size={16} /> Submeter Plano
                  </button>
                </form>
              </div>

              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h4 className="font-display font-bold text-base mb-4">Meus Planos Enviados</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-cream rounded-xl border border-ink/5">
                    <h5 className="font-body font-semibold text-xs text-ink">Geometria Básica</h5>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">Status: Aprovado</p>
                  </div>
                  <div className="p-3 bg-cream rounded-xl border border-ink/5">
                    <h5 className="font-body font-semibold text-xs text-ink">Frações no Cotidiano</h5>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">Status: Em Análise</p>
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
