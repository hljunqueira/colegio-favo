import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, CalendarDays, GraduationCap, Wallet, 
  LogOut, UserCircle, Bell, ShieldCheck, QrCode, Copy 
} from "lucide-react";
import { clearSession, getUser } from "@/lib/auth";
import { toast } from "sonner";

export default function PortalPais() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Responsável Financeiro" };
  const [view, setView] = useState("mural");
  const [selectedChild, setSelectedChild] = useState("lucas");

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const copyPix = () => {
    navigator.clipboard.writeText("00020101021226850014br.gov.bcb.pix2563https://pix.escolafavodemel.com.br/qr/invoice12345");
    toast.success("Código PIX copiado com sucesso!");
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "frequencia", label: "Frequência", icon: CalendarDays },
    { key: "boletim", label: "Boletim", icon: GraduationCap },
    { key: "financeiro", label: "Financeiro", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="pais-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Pais</span>
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
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Responsável
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Child Selector */}
            <div className="flex items-center gap-1 bg-cream-2 border border-ink/5 rounded-full p-1 text-xs">
              <button 
                onClick={() => setSelectedChild("lucas")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedChild === "lucas" ? "bg-honey text-dark shadow-sm" : "text-ink-2"
                }`}
              >
                Lucas (3º Ano)
              </button>
              <button 
                onClick={() => setSelectedChild("mario")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedChild === "mario" ? "bg-honey text-dark shadow-sm" : "text-ink-2"
                }`}
              >
                Mário (Infantil IV)
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
          {view === "mural" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mural de Avisos - {selectedChild === "lucas" ? "Lucas" : "Mário"}</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">📢</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Rematrícula Escolar 2027</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        Prezados responsáveis, o prazo para garantir a vaga de seu filho com desconto especial encerra no próximo dia 30.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                    <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">🩺</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink">Campanha de Vacinação e Saúde</h4>
                      <p className="font-body text-xs text-ink-2 mt-1">
                        A equipe de saúde da prefeitura fará uma visita para conferência de carteiras de vacina na quarta-feira.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "frequencia" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Registro de Frequência</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <p className="text-xs text-emerald-800 font-semibold uppercase">Presenças</p>
                  <p className="text-3xl font-extrabold text-emerald-950 mt-1">94%</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <p className="text-xs text-amber-800 font-semibold uppercase">Faltas Justificadas</p>
                  <p className="text-3xl font-extrabold text-amber-950 mt-1">3</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-xs text-red-800 font-semibold uppercase">Faltas não justificadas</p>
                  <p className="text-3xl font-extrabold text-red-950 mt-1">2</p>
                </div>
              </div>
            </div>
          )}

          {view === "boletim" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Boletim Escolar de {selectedChild === "lucas" ? "Lucas" : "Mário"}</h3>
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase tracking-wider font-semibold">
                    <th className="py-3">Matéria</th>
                    <th className="py-3">B1</th>
                    <th className="py-3">B2</th>
                    <th className="py-3">B3</th>
                    <th className="py-3">B4</th>
                    <th className="py-3">Média</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {selectedChild === "lucas" ? (
                    <>
                      <tr>
                        <td className="py-3 font-semibold">Matemática</td>
                        <td className="py-3">8.5</td>
                        <td className="py-3">9.0</td>
                        <td className="py-3">—</td>
                        <td className="py-3">—</td>
                        <td className="py-3 text-emerald-600 font-semibold">8.75</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold">Português</td>
                        <td className="py-3">9.2</td>
                        <td className="py-3">9.5</td>
                        <td className="py-3">—</td>
                        <td className="py-3">—</td>
                        <td className="py-3 text-emerald-600 font-semibold">9.35</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="py-3 font-semibold">Coord. Motora</td>
                        <td className="py-3">Excelente</td>
                        <td className="py-3">Excelente</td>
                        <td className="py-3">—</td>
                        <td className="py-3">—</td>
                        <td className="py-3 text-emerald-600 font-semibold">Apto</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold">Socialização</td>
                        <td className="py-3">Bom</td>
                        <td className="py-3">Excelente</td>
                        <td className="py-3">—</td>
                        <td className="py-3">—</td>
                        <td className="py-3 text-emerald-600 font-semibold">Apto</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {view === "financeiro" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Invoice List */}
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mensalidades</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                    <div>
                      <p className="font-body font-bold text-sm">Matrícula Escolar Ref. 07/2026</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">Vencimento: 10/07/2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-extrabold text-sm text-ink">R$ 850,00</p>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-semibold mt-1">
                        Pago
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                    <div>
                      <p className="font-body font-bold text-sm">Mensalidade Escolar Ref. 08/2026</p>
                      <p className="text-[11px] text-amber-600 font-semibold">Vencimento: 10/08/2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-extrabold text-sm text-ink">R$ 850,00</p>
                      <span className="inline-block bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-semibold mt-1">
                        Aberto
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PIX Payment Panel */}
              <div className="bg-[#1b2b22] text-cream rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-honey mb-4">
                    <QrCode size={20} />
                  </div>
                  <h4 className="font-display font-bold text-lg mb-2">Pagar com Pix</h4>
                  <p className="font-body text-xs text-cream/70 leading-relaxed mb-6">
                    Acesse a mensalidade de Agosto rapidamente gerando o Pix copia-e-cola abaixo.
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cream/60 truncate pr-4">
                      00020101021226850014br.gov.bcb.pix2563https://pix.escolafavodemel.com.br...
                    </span>
                    <button 
                      onClick={copyPix}
                      className="p-2 bg-honey text-dark rounded-lg hover:bg-honey/80 transition-colors shrink-0"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-cream/50">
                  <ShieldCheck size={12} className="text-honey" /> Pagamento com baixa instantânea
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
