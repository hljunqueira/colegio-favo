import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutGrid, CalendarDays, GraduationCap, Wallet, 
  LogOut, UserCircle, Bell, ShieldCheck, QrCode, Copy, FileText, HeartPulse, Loader2, Library
} from "lucide-react";
import { clearSession, getUser, authHeader, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PortalPais() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Responsável Financeiro", id: "" };
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [view, setView] = useState("mural");
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [avisos, setAvisos] = useState([]);
  const [events, setEvents] = useState([]);
  const [books, setBooks] = useState([]);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${API}/parents/dashboard`, {
        ...authHeader(),
        params: { userId: user.id }
      });
      setData(res.data);

      const [avisosRes, eventsRes, booksRes] = await Promise.all([
        axios.get(`${API}/avisos`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
        axios.get(`${API}/library/livros`, authHeader())
      ]);
      setAvisos(avisosRes.data.filter(a => a.destinatario === "PARENT" || a.destinatario === "GERAL"));
      setEvents(eventsRes.data);
      setBooks(booksRes.data);

      setLoading(false);
    } catch (err) {
      toast.error("Erro ao carregar dados do portal.");
      clearSession();
      navigate("/portal");
    }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    loadDashboard();
  }, [navigate]);

  const filhos = data?.filhos || [];
  const selectedChild = filhos[selectedChildIndex] || null;

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const copyPix = () => {
    navigator.clipboard.writeText("00020101021226850014br.gov.bcb.pix2563https://pix.escolafavodemel.com.br/qr/invoice12345");
    toast.success("Código PIX copiado com sucesso!");
  };

  // Cálculo de estatísticas de frequência do filho selecionado
  const freqStats = useMemo(() => {
    if (!selectedChild || !selectedChild.frequencia.length) return { rate: "100%", presencas: 0, faltas: 0 };
    const total = selectedChild.frequencia.length;
    const presencas = selectedChild.frequencia.filter(f => f.presente).length;
    const faltas = total - presencas;
    const rate = Math.round((presencas / total) * 100) + "%";
    return { rate, presencas, faltas };
  }, [selectedChild]);

  // Exportação em PDF do Boletim via print do navegador
  const exportPDF = () => {
    window.print();
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "frequencia", label: "Frequência", icon: Bell },
    { key: "boletim", label: "Boletim", icon: GraduationCap },
    { key: "anamnese", label: "Ficha de Saúde", icon: HeartPulse },
    { key: "biblioteca", label: "Biblioteca", icon: Library },
    { key: "financeiro", label: "Financeiro", icon: Wallet },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-2 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="pais-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo-oficial.png" alt="Colégio Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
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
              Olá, {data?.responsavel?.name?.split(" ")[0]} 🐝
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Responsável
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dynamic Child Selector */}
            {filhos.length > 0 && (
              <div className="flex items-center gap-1 bg-cream-2 border border-ink/5 rounded-full p-1 text-xs">
                {filhos.map((filho, idx) => (
                  <button 
                    key={filho.id}
                    onClick={() => setSelectedChildIndex(idx)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                      selectedChildIndex === idx ? "bg-honey text-dark shadow-sm" : "text-ink-2"
                    }`}
                  >
                    {filho.name.split(" ")[0]} ({filho.turma})
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 border-l border-ink/10 pl-4">
              <UserCircle size={24} className="text-ink-2" />
              <span className="text-xs font-semibold text-ink-2 hidden sm:inline">{data?.responsavel?.email}</span>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="p-6 sm:p-8 flex-grow">
          {filhos.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-ink/5 text-center">
              <p className="font-body text-ink-2">Nenhum aluno está vinculado ao seu CPF no momento. Entre em contato com a secretaria.</p>
            </div>
          ) : (
            <>
              {view === "mural" && (
                <div className="space-y-6">
                  <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mural de Avisos - {selectedChild?.name}</h3>
                    <div className="space-y-4">
                      {avisos.map((av) => (
                        <div key={av.id} className="p-4 bg-cream rounded-2xl border border-ink/5 flex items-start gap-4">
                          <span className="p-2 bg-amber/10 text-amber rounded-xl shrink-0">📢</span>
                          <div>
                            <div className="flex gap-2 items-center mb-1">
                              <Badge className="bg-honey text-dark font-body text-[9px] uppercase">{av.categoria}</Badge>
                              <span className="text-[10px] text-ink-3">{new Date(av.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <h4 className="font-display font-bold text-sm text-ink">{av.titulo}</h4>
                            <p className="font-body text-xs text-ink-2 mt-1">{av.texto}</p>
                          </div>
                        </div>
                      ))}
                      {avisos.length === 0 && (
                        <p className="p-8 text-center text-ink-2">Nenhum comunicado no mural.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {view === "frequencia" && (
                <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Registro de Frequência - {selectedChild?.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <p className="text-xs text-emerald-800 font-semibold uppercase">Frequência Geral</p>
                      <p className="text-3xl font-extrabold text-emerald-950 mt-1">{freqStats.rate}</p>
                    </div>
                    <div className="p-4 bg-honey/10 border border-honey/20 rounded-2xl">
                      <p className="text-xs text-amber-800 font-semibold uppercase">Presenças Contabilizadas</p>
                      <p className="text-3xl font-extrabold text-amber-950 mt-1">{freqStats.presencas}</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="text-xs text-red-800 font-semibold uppercase">Faltas Registradas</p>
                      <p className="text-3xl font-extrabold text-red-950 mt-1">{freqStats.faltas}</p>
                    </div>
                  </div>

                  <div className="border border-ink/5 rounded-2xl overflow-hidden mt-6">
                    <table className="w-full text-left font-body text-xs border-collapse">
                      <thead>
                        <tr className="bg-cream border-b border-ink/5 text-ink-2 font-semibold">
                          <th className="p-4">Data da Chamada</th>
                          <th className="p-4">Status de Presença</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/5">
                        {selectedChild?.frequencia.map(f => (
                          <tr key={f.id} className="hover:bg-cream-2/50 transition-colors">
                            <td className="p-4">{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4">
                              <Badge className={f.presente ? "bg-emerald-100 text-emerald-800 font-body" : "bg-red-100 text-red-800 font-body"}>
                                {f.presente ? "Presente" : "Falta"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                        {selectedChild?.frequencia.length === 0 && (
                          <tr><td colSpan={2} className="p-8 text-center text-ink-2">Nenhum registro de chamada lançado para este aluno.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {view === "boletim" && (
                <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-extrabold text-xl text-ink">Boletim Escolar de {selectedChild?.name}</h3>
                    <button 
                      onClick={exportPDF}
                      className="inline-flex items-center gap-2 bg-dark text-cream hover:bg-amber hover:text-dark px-4 py-2 rounded-full font-body text-xs font-semibold transition-colors"
                    >
                      <FileText size={14} /> Exportar Boletim (PDF)
                    </button>
                  </div>
                  
                  <div id="boletim-table-pdf" className="p-4 bg-white border border-ink/10 rounded-2xl overflow-x-auto">
                    <div className="mb-4 border-b pb-3">
                      <h2 className="font-display font-bold text-lg text-ink">Colégio Favo de Mel</h2>
                      <p className="font-body text-xs text-ink-2">Aluno: {selectedChild?.name} | Matrícula: {selectedChild?.matricula} | Turma: {selectedChild?.turma}</p>
                    </div>
                    <table className="w-full text-left border-collapse font-body text-xs">
                      <thead>
                        <tr className="border-b border-ink/5 text-ink-2 uppercase tracking-wider font-semibold">
                          <th className="py-3">Matéria / Disciplina</th>
                          <th className="py-3">Prova 1</th>
                          <th className="py-3">Prova 2</th>
                          <th className="py-3">Trabalho</th>
                          <th className="py-3">Média Trimestral</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/5">
                        {selectedChild?.boletim.map((n) => (
                          <tr key={n.id} className="hover:bg-cream-2/50 transition-colors">
                            <td className="py-3 font-semibold">{n.disciplina}</td>
                            <td className="py-3">{n.p1 !== null ? n.p1 : "—"}</td>
                            <td className="py-3">{n.p2 !== null ? n.p2 : "—"}</td>
                            <td className="py-3">{n.trabalho !== null ? n.trabalho : "—"}</td>
                            <td className={`py-3 font-bold ${n.mediaFinal >= 7.0 ? "text-emerald-600" : "text-amber"}`}>
                              {n.mediaFinal !== null ? n.mediaFinal : "—"}
                            </td>
                          </tr>
                        ))}
                        {selectedChild?.boletim.length === 0 && (
                          <tr><td colSpan={5} className="py-8 text-center text-ink-2">Nenhuma nota lançada neste período.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {view === "anamnese" && (
                <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-display font-extrabold text-xl mb-4 text-ink flex items-center gap-2">
                    <HeartPulse className="text-red-500 animate-pulse" /> Ficha de Saúde (Anamnese) - {selectedChild?.name}
                  </h3>
                  
                  {selectedChild?.anamnese ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                      <div className="space-y-4 bg-cream p-5 rounded-2xl border border-ink/5">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Restrições Alimentares</p>
                          <p className="text-ink font-bold mt-1">{selectedChild.anamnese.restricoesAlimentares || "Nenhuma restrição declarada."}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Alergias Conocidas</p>
                          <p className="text-ink font-bold mt-1">{selectedChild.anamnese.alergias || "Nenhuma alergia declarada."}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Medicamentos de Uso Contínuo</p>
                          <p className="text-ink font-bold mt-1">{selectedChild.anamnese.medicamentosContinuos || "Nenhum medicamento contínuo."}</p>
                        </div>
                      </div>

                      <div className="space-y-4 bg-cream p-5 rounded-2xl border border-ink/5">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Tipo Sanguíneo</p>
                          <p className="text-red-600 font-extrabold text-lg mt-1">{selectedChild.anamnese.tipoSanguineo || "Não informado."}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Contato de Emergência</p>
                          <p className="text-ink font-bold mt-1">{selectedChild.anamnese.contatoEmergencia}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ink-2 font-semibold">Observações Médicas</p>
                          <p className="text-ink font-bold mt-1">{selectedChild.anamnese.observacoesMedicas || "Nenhuma observação."}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="p-8 text-center text-ink-2">Nenhuma ficha de anamnese cadastrada para este aluno.</p>
                  )}
                </div>
              )}

              {view === "financeiro" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Invoice List */}
                  <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
                    <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mensalidades - {selectedChild?.name}</h3>
                    <div className="space-y-4">
                      {selectedChild?.financeiro.map((f) => (
                        <div key={f.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                          <div>
                            <p className="font-body font-bold text-sm">Mensalidade Escolar Ref. {f.ref}</p>
                            <p className={`text-[11px] font-semibold ${f.status === "pago" ? "text-emerald-600" : "text-amber"}`}>
                              Vencimento: {f.vencimento}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-extrabold text-sm text-ink">{brl(f.valor)}</p>
                            <Badge className={f.status === "pago" ? "bg-emerald-100 text-emerald-800 font-body mt-1" : "bg-amber/10 text-amber font-body mt-1"}>
                              {f.status === "pago" ? "Pago" : "Aberto"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {selectedChild?.financeiro.length === 0 && (
                        <p className="p-8 text-center text-ink-2">Nenhum registro de mensalidade ativo.</p>
                      )}
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
                        Acesse a mensalidade do {selectedChild?.name} rapidamente copiando a chave Pix copia-e-cola abaixo.
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

              {view === "agenda" && (
                <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Agenda do Aluno (Avaliações e Tarefas)</h3>
                    <div className="space-y-4">
                      {selectedChild?.agenda?.map((e) => (
                        <div key={e.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5 hover:bg-cream-2/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full bg-honey`} />
                            <div>
                              <h4 className="font-body font-semibold text-sm">{e.title}</h4>
                              <p className="text-[11px] text-ink-2">{e.disciplina}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-ink-2">{new Date(e.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      ))}
                      {(!selectedChild?.agenda || selectedChild.agenda.length === 0) && (
                        <p className="p-8 text-center text-ink-2">Nenhum compromisso agendado.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Calendário Acadêmico (Eventos Gerais)</h3>
                    <div className="space-y-4">
                      {events.map((e) => (
                        <div key={e.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5 hover:bg-cream-2/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-moss" />
                            <div>
                              <h4 className="font-body font-semibold text-sm">{e.titulo}</h4>
                              <p className="text-[11px] text-ink-2">{e.descricao}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-ink-2">{new Date(e.dataHora).toLocaleDateString('pt-BR')}</span>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="p-8 text-center text-ink-2">Nenhum evento letivo cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {view === "biblioteca" && (
                <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm space-y-6">
                  <h3 className="font-display font-extrabold text-xl text-ink">Biblioteca Escolar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {books.map(l => (
                      <div key={l.id} className="bg-cream border border-ink/10 rounded-2xl p-5 flex gap-4 shadow-sm relative overflow-hidden">
                        {l.capaUrl ? (
                          <img src={l.capaUrl} alt={l.titulo} className="w-16 h-24 object-cover rounded-md shadow-sm border border-ink/5 shrink-0" />
                        ) : (
                          <div className="w-16 h-24 bg-cream-2 rounded-md flex items-center justify-center text-ink-2 border border-ink/5 shrink-0">
                            <Library size={24} />
                          </div>
                        )}
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <h4 className="font-display font-bold text-sm text-ink leading-tight mb-1">{l.titulo}</h4>
                            <p className="font-body text-xs text-ink-2">{l.autor}</p>
                            <Badge className={`mt-2 text-[9px] uppercase font-body ${l.isDigital ? "bg-moss/10 text-moss" : "bg-amber/10 text-amber"}`}>
                              {l.isDigital ? "Digital" : "Físico"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs font-body pt-2 border-t border-ink/5 mt-2">
                            {l.isDigital ? (
                              <a 
                                href={l.urlLeitura} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 font-bold text-moss hover:text-amber transition-colors"
                              >
                                Ler Online 📖
                              </a>
                            ) : (
                              <>
                                <span className="text-ink-2">Qtd: {l.quantidade}</span>
                                <button 
                                  onClick={() => toast.success(`Solicitação de reserva registrada para "${l.titulo}"!`)}
                                  className="text-[10px] bg-dark text-cream hover:bg-amber hover:text-dark px-2.5 py-1 rounded-full font-semibold transition-colors"
                                >
                                  Reservar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {books.length === 0 && (
                      <p className="p-8 text-center text-ink-2 col-span-full">Nenhum livro no acervo.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <style>{`
        @media print {
          aside, header, button, .bg-honey {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          body, .min-h-screen {
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
