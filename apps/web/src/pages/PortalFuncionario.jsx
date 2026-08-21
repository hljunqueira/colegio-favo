import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Megaphone, CalendarRange, PenTool, LogOut, 
  UserCircle, Bell, Plus, Settings, Library, CalendarDays, LayoutGrid
} from "lucide-react";
import { clearSession, getUser, authHeader, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalFuncionario() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Secretaria Favo", id: "" };
  const [view, setView] = useState("mural");
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqDept, setReqDept] = useState("secretaria");
  
  const [loading, setLoading] = useState(true);
  const [avisos, setAvisos] = useState([]);
  const [events, setEvents] = useState([]);
  const [books, setBooks] = useState([]);

  // States dinâmicos do banco
  const [funcionarioId, setFuncionarioId] = useState("");
  const [escalas, setEscalas] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const loadData = async () => {
    try {
      const [avisosRes, eventsRes, booksRes] = await Promise.all([
        axios.get(`${API}/avisos`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
        axios.get(`${API}/library/livros`, authHeader())
      ]);
      setAvisos(avisosRes.data.filter(a => a.destinatario === "STAFF" || a.destinatario === "GERAL"));
      setEvents(eventsRes.data);
      setBooks(booksRes.data);

      // Buscar perfil real de funcionário
      const profRes = await axios.get(`${API}/teachers/funcionario/profile?userId=${user.id}`, authHeader());
      if (profRes.data) {
        setFuncionarioId(profRes.data.id);
        const [escalasRes, solicitacoesRes] = await Promise.all([
          axios.get(`${API}/teachers/funcionario/escalas?funcionarioId=${profRes.data.id}`, authHeader()),
          axios.get(`${API}/teachers/funcionario/solicitacoes?funcionarioId=${profRes.data.id}`, authHeader())
        ]);
        setEscalas(escalasRes.data);
        setSolicitacoes(solicitacoesRes.data);
      }

      setLoading(false);
    } catch {
      toast.error("Erro ao carregar dados do portal.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    loadData();
  }, [navigate]);

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc) {
      toast.error("Por favor, preencha o título e a descrição da solicitação.");
      return;
    }
    try {
      await axios.post(`${API}/teachers/funcionario/solicitacoes`, {
        funcionarioId,
        titulo: reqTitle,
        descricao: reqDesc,
        setorDestino: reqDept
      }, authHeader());
      toast.success("Solicitação de suprimento/manutenção enviada com sucesso!");
      setReqTitle("");
      setReqDesc("");
      const res = await axios.get(`${API}/teachers/funcionario/solicitacoes?funcionarioId=${funcionarioId}`, authHeader());
      setSolicitacoes(res.data);
    } catch {
      toast.error("Erro ao enviar chamado.");
    }
  };

  const menuItems = [
    { key: "mural", label: "Mural Interno", icon: LayoutGrid },
    { key: "escala", label: "Minha Escala", icon: CalendarRange },
    { key: "solicitacoes", label: "Solicitações", icon: PenTool },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "biblioteca", label: "Biblioteca", icon: Library },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="funcionario-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Colégio Favo" className="w-10 h-10 rounded-lg object-cover" />
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
              <h3 className="font-display font-extrabold text-xl mb-1 text-ink">Minha Escala de Horário</h3>
              <p className="text-xs text-ink-2 mb-6">Confira seus turnos e setores de trabalho cadastrados.</p>
              <div className="space-y-3">
                {escalas.map((es) => (
                  <div key={es.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5">
                    <div>
                      <h4 className="font-body font-semibold text-sm">Escala - {es.setorTrabalho}</h4>
                      <p className="text-[10px] text-ink-2">Setor de Atuação Operacional</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {es.diaSemana} · {es.horarioEntrada} - {es.horarioSaida}
                    </span>
                  </div>
                ))}
                {escalas.length === 0 && (
                  <p className="p-8 text-center text-xs text-ink-2">Nenhuma escala cadastrada no momento.</p>
                )}
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
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none font-body"
                    >
                      <option value="secretaria">Secretaria Geral / Suprimentos</option>
                      <option value="manutencao">Manutenção e Reparos</option>
                      <option value="ti">Tecnologia (T.I)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Título do Pedido</Label>
                    <Input 
                      value={reqTitle} 
                      onChange={(e) => setReqTitle(e.target.value)} 
                      placeholder="Ex: Aquisição de resmas de papel" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs font-semibold">Descrição do Pedido / Chamado</Label>
                    <textarea 
                      value={reqDesc} 
                      onChange={(e) => setReqDesc(e.target.value)} 
                      rows={4}
                      placeholder="Descreva detalhadamente a necessidade..." 
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none font-body"
                      required
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
                  {solicitacoes.map((s) => (
                    <div key={s.id} className="p-3 bg-cream rounded-xl border border-ink/5">
                      <h5 className="font-body font-semibold text-xs text-ink">{s.titulo}</h5>
                      <p className="text-[10px] text-ink-2 mt-0.5">{s.descricao}</p>
                      <p className={`text-[9px] font-bold mt-1 uppercase ${
                        s.status === "resolvido" ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        Status: {s.status}
                      </p>
                    </div>
                  ))}
                  {solicitacoes.length === 0 && (
                    <p className="text-center text-xs text-ink-3 py-6">Nenhum chamado aberto.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "mural" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mural de Avisos Internos</h3>
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

          {view === "agenda" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
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
                            <span className="text-[10px] text-ink-3">Apenas Consulta</span>
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
        </main>
      </div>
    </div>
  );
}
