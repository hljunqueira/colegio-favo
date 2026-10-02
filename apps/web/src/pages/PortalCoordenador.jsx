import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, CheckCircle2, Megaphone, LogOut, FileSignature, ExternalLink,
  UserCircle, Bell, ArrowRight, XCircle, Library, CalendarDays, LayoutGrid, Plus, Trash2
} from "lucide-react";
import { clearSession, getUser, authHeader, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { NotificationBell } from "@/components/ui/NotificationBell";

import { API, BACKEND_URL } from "@/lib/api";

export default function PortalCoordenador() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Coord. Pedagógica", id: "" };
  const [view, setView] = useState("planos");
  const [announcement, setAnnouncement] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState("GERAL");
  
  const [loading, setLoading] = useState(true);
  const [avisos, setAvisos] = useState([]);
  const [events, setEvents] = useState([]);
  const [books, setBooks] = useState([]);

  // States dinâmicos do banco
  const [planos, setPlanos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [showMatriculaModal, setShowMatriculaModal] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [feedbackTexto, setFeedbackTexto] = useState("");
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [deleteConfirmEventId, setDeleteConfirmEventId] = useState(null);
  const [newEventForm, setNewEventForm] = useState({ titulo: "", descricao: "", dataHora: "", tipo: "evento_escolar" });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEventForm.titulo || !newEventForm.dataHora) {
      toast.error("Preencha título e data do evento.");
      return;
    }
    try {
      await axios.post(`${API}/events`, newEventForm, authHeader());
      toast.success("Novo evento acadêmico criado!");
      setShowEventModal(false);
      setNewEventForm({ titulo: "", descricao: "", dataHora: "", tipo: "evento_escolar" });
      const evs = await axios.get(`${API}/events`, authHeader());
      setEvents(evs.data);
    } catch {
      toast.error("Erro ao criar evento.");
    }
  };

  const confirmDeleteEvent = async () => {
    if (!deleteConfirmEventId) return;
    try {
      await axios.delete(`${API}/events/${deleteConfirmEventId}`, authHeader());
      toast.success("Evento removido do calendário.");
      setDeleteConfirmEventId(null);
      const evs = await axios.get(`${API}/events`, authHeader());
      setEvents(evs.data);
    } catch {
      toast.error("Erro ao remover evento.");
    }
  };

  const [newMatriculaForm, setNewMatriculaForm] = useState({
    nomeAluno: "",
    dataNascimento: "",
    seriePretendida: "1º Ano",
    nomeResponsavel: "",
    emailResponsavel: "",
    telefoneResponsavel: "",
    cpfResponsavel: ""
  });

  const loadData = async () => {
    try {
      const [avisosRes, eventsRes, booksRes, planosRes, contatosRes, matriculasRes] = await Promise.all([
        axios.get(`${API}/avisos`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
        axios.get(`${API}/library/livros`, authHeader()),
        axios.get(`${API}/lessons/planos`, authHeader()),
        axios.get(`${API}/teachers/contatos`, authHeader()),
        axios.get(`${API}/matriculas/pendentes`, authHeader())
      ]);
      setAvisos(avisosRes.data.filter(a => a.destinatario === "COORDINATOR" || a.destinatario === "GERAL"));
      setEvents(eventsRes.data);
      setBooks(booksRes.data);
      setPlanos(planosRes.data);
      setContatos(contatosRes.data);
      setMatriculas(matriculasRes.data);
      setLoading(false);
    } catch {
      toast.error("Erro ao carregar dados do portal.");
      setLoading(false);
    }
  };

  const reloadMatriculas = async () => {
    try {
      const res = await axios.get(`${API}/matriculas/pendentes`, authHeader());
      setMatriculas(res.data);
    } catch {
      toast.error("Erro ao recarregar matrículas.");
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

  const handleApprovePlan = async (id, status) => {
    try {
      await axios.patch(`${API}/lessons/planos/analisar/${id}`, { status }, authHeader());
      toast.success(status === "aprovado" ? "Plano de aula APROVADO!" : "Plano de aula retornado para ajustes.");
      const res = await axios.get(`${API}/lessons/planos`, authHeader());
      setPlanos(res.data);
    } catch {
      toast.error("Erro ao analisar plano de aula.");
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/matriculas/gerar-link`, newMatriculaForm, authHeader());
      toast.success("Link de matrícula gerado!");
      const link = `${window.location.origin}/matricula/enviar/${res.data.token}`;
      navigator.clipboard.writeText(link);
      toast.info("Link copiado para a área de transferência!");
      setShowMatriculaModal(false);
      setNewMatriculaForm({
        nomeAluno: "",
        dataNascimento: "",
        seriePretendida: "1º Ano",
        nomeResponsavel: "",
        emailResponsavel: "",
        telefoneResponsavel: "",
        cpfResponsavel: ""
      });
      reloadMatriculas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao gerar link de matrícula.");
    }
  };

  const handleAnalyse = async (id, status, obs = "") => {
    try {
      await axios.patch(`${API}/matriculas/analisar/${id}`, { status, observacoes: obs }, authHeader());
      toast.success(`Matrícula ${status === "aprovado" ? "aprovada" : "recusada"} com sucesso!`);
      setSelectedMatricula(null);
      setFeedbackTexto("");
      reloadMatriculas();
    } catch {
      toast.error("Erro ao salvar análise.");
    }
  };

  const handleEfetivar = async (id) => {
    try {
      const res = await axios.post(`${API}/matriculas/efetivar/${id}`, {}, authHeader());
      toast.success(`Matrícula efetivada com sucesso! Aluno cadastrado sob o número ${res.data.matricula}.`);
      reloadMatriculas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao efetivar matrícula.");
    }
  };

  const publishAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle || !announcement) {
      toast.error("Por favor, preencha título e mensagem do comunicado.");
      return;
    }
    try {
      await axios.post(`${API}/avisos`, {
        titulo: announcementTitle,
        texto: announcement,
        categoria: "Pedagógico",
        destinatario: announcementTarget
      }, authHeader());
      toast.success("Comunicado publicado com sucesso!");
      setAnnouncementTitle("");
      setAnnouncement("");
      const res = await axios.get(`${API}/avisos`, authHeader());
      setAvisos(res.data.filter(a => a.destinatario === "COORDINATOR" || a.destinatario === "GERAL"));
    } catch {
      toast.error("Erro ao publicar comunicado.");
    }
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "planos", label: "Planos Pedagógicos", icon: CheckCircle2 },
    { key: "pub-mural", label: "Publicar Mural", icon: Megaphone },
    { key: "matriculas", label: "Matrículas Digitais", icon: FileSignature },
    { key: "pessoas", label: "Pessoas & Contatos", icon: Users },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "biblioteca", label: "Biblioteca", icon: Library },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="coordenador-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo.jpg" alt="Colégio Favo" className="w-10 h-10 rounded-lg object-cover" />
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
            <NotificationBell />
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
                  {planos.map((p) => (
                    <div key={p.id} className="p-5 bg-cream rounded-2xl border border-ink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          p.status === "aprovado" ? "bg-emerald-50 text-emerald-700" : p.status === "ajustar" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {p.status === "aprovado" ? "Aprovado" : p.status === "ajustar" ? "Ajustar" : "Pendente"}
                        </span>
                        <h4 className="font-display font-bold text-base text-ink mt-2">
                          {p.titulo} {p.turma && `· ${p.turma.nome}`}
                        </h4>
                        <p className="font-body text-xs text-ink-2 mt-1 leading-relaxed max-w-xl">
                          <strong>Professor:</strong> {p.professor?.user?.name || "Docente"} <br />
                          {p.conteudo}
                        </p>
                      </div>
                      {p.status === "pendente" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => handleApprovePlan(p.id, "aprovado")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-colors"
                            title="Aprovar Plano"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleApprovePlan(p.id, "ajustar")}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-colors"
                            title="Recusar / Devolver para Ajustes"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {planos.length === 0 && (
                    <p className="p-8 text-center text-ink-2">Nenhum plano de aula submetido para avaliação.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "mural" && (
            <div className="space-y-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Mural de Avisos</h3>
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

          {view === "pub-mural" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm max-w-xl">
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Publicar Comunicado Geral</h3>
              <form onSubmit={publishAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-semibold">Título do Aviso</Label>
                  <Input 
                    value={announcementTitle} 
                    onChange={(e) => setAnnouncementTitle(e.target.value)} 
                    placeholder="Ex: Entrega de Boletins / Feira de Ciências" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-semibold">Público Destinatário</Label>
                  <select 
                    value={announcementTarget} 
                    onChange={(e) => setAnnouncementTarget(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none font-body"
                  >
                    <option value="GERAL">Geral (Todos os Portais)</option>
                    <option value="STUDENT">Alunos</option>
                    <option value="PARENT">Pais / Responsáveis</option>
                    <option value="TEACHER">Professores</option>
                    <option value="STAFF">Funcionários</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-semibold">Mensagem do Comunicado</Label>
                  <textarea 
                    value={announcement} 
                    onChange={(e) => setAnnouncement(e.target.value)} 
                    rows={6}
                    placeholder="Digite a mensagem que deseja disparar..." 
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none font-body"
                    required
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
              <h3 className="font-display font-extrabold text-xl mb-4 text-ink">Lista de Contatos do Colégio Favo</h3>
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase font-semibold">
                    <th className="py-3">Nome</th>
                    <th className="py-3">E-mail</th>
                    <th className="py-3">Papel / Cargo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {contatos.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 font-semibold text-ink">{c.name}</td>
                      <td className="py-3 text-ink-2">{c.email}</td>
                      <td className="py-3 font-bold uppercase text-amber-800">{c.role?.name || "Sem Função"}</td>
                    </tr>
                  ))}
                  {contatos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-ink-2">Nenhum contato encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {view === "agenda" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Calendário Acadêmico (Eventos Gerais)</h3>
                  <p className="text-xs text-ink-2 mt-0.5">Gerencie os eventos institucionais, reuniões pedagógicas e conselhos de classe.</p>
                </div>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="bg-dark text-cream hover:bg-amber hover:text-dark px-5 py-2.5 rounded-full font-bold text-xs transition-colors shrink-0 flex items-center gap-2"
                >
                  <Plus size={16} /> Novo Evento Acadêmico
                </button>
              </div>

              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-ink/5 hover:bg-cream-2/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        e.tipo === "prova" ? "bg-red-500" :
                        e.tipo === "trabalho" ? "bg-amber-500" :
                        e.tipo === "reuniao" ? "bg-purple-500" : "bg-emerald-500"
                      }`} />
                      <div>
                        <h4 className="font-body font-semibold text-sm text-ink">{e.titulo}</h4>
                        <p className="text-[11px] text-ink-2">{e.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-ink-2">{new Date(e.dataHora).toLocaleDateString('pt-BR')}</span>
                      <button 
                        onClick={() => setDeleteConfirmEventId(e.id)}
                        className="text-ink-3 hover:text-red-600 transition-colors p-1"
                        title="Excluir evento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="p-8 text-center text-ink-2">Nenhum evento letivo cadastrado.</p>
                )}
              </div>

              {/* Modal Novo Evento */}
              {showEventModal && (
                <div className="fixed inset-0 bg-dark/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <form onSubmit={handleCreateEvent} className="bg-white border border-ink/10 rounded-3xl p-6 shadow-xl space-y-4 max-w-md w-full">
                    <div className="flex justify-between items-center border-b border-ink/5 pb-2">
                      <h4 className="font-display font-black text-sm text-ink uppercase tracking-wide">
                        Novo Evento Acadêmico
                      </h4>
                      <button type="button" onClick={() => setShowEventModal(false)} className="text-ink-3 hover:text-ink">✕</button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Título do Evento *</Label>
                      <Input value={newEventForm.titulo} onChange={e => setNewEventForm({...newEventForm, titulo: e.target.value})} required placeholder="Ex: Conselho de Classe 1º Trimestre" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Data e Hora *</Label>
                      <Input type="datetime-local" value={newEventForm.dataHora} onChange={e => setNewEventForm({...newEventForm, dataHora: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Tipo de Evento</Label>
                      <select
                        value={newEventForm.tipo}
                        onChange={e => setNewEventForm({...newEventForm, tipo: e.target.value})}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                      >
                        <option value="evento_escolar">Evento Escolar</option>
                        <option value="reuniao">Reunião Pedagógica</option>
                        <option value="prova">Avaliação / Prova</option>
                        <option value="trabalho">Entrega de Trabalho</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Descrição / Detalhes</Label>
                      <Input value={newEventForm.descricao} onChange={e => setNewEventForm({...newEventForm, descricao: e.target.value})} placeholder="Pauta ou informações gerais..." />
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-ink/5">
                      <button type="button" onClick={() => setShowEventModal(false)} className="px-4 py-2 bg-cream text-ink-2 rounded-full text-xs font-semibold hover:bg-cream-3">Cancelar</button>
                      <button type="submit" className="px-5 py-2 bg-dark text-cream rounded-full text-xs font-semibold hover:bg-amber hover:text-dark">Salvar Evento</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {view === "matriculas" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Matrículas & Envio de Documentos</h3>
                  <p className="text-xs text-ink-2 mt-0.5">Gerencie pré-matrículas, gere links para envio de documentos e efetive alunos.</p>
                </div>
                <button
                  onClick={() => setShowMatriculaModal(true)}
                  className="bg-dark text-cream hover:bg-amber hover:text-dark px-5 py-2.5 rounded-full font-bold text-xs transition-colors shrink-0"
                >
                  + Gerar Link de Matrícula
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body border-collapse">
                  <thead>
                    <tr className="border-b border-ink/10 text-ink-3 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Aluno</th>
                      <th className="py-3 px-4">Responsável</th>
                      <th className="py-3 px-4">Série</th>
                      <th className="py-3 px-4">Criado em</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matriculas.map(m => (
                      <tr key={m.id} className="border-b border-ink/5 hover:bg-cream/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-ink">{m.nomeAluno}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-ink-2">{m.nomeResponsavel}</div>
                          <div className="text-[10px] text-ink-3">CPF: {m.cpfResponsavel}</div>
                        </td>
                        <td className="py-3 px-4">{m.seriePretendida}</td>
                        <td className="py-3 px-4">{new Date(m.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            m.status === "efetivada" ? "bg-emerald-100 text-emerald-800" :
                            m.status === "aprovado" ? "bg-blue-100 text-blue-800" :
                            m.status === "em_analise" ? "bg-amber-100 text-amber-800" :
                            m.status === "rejeitado" ? "bg-red-100 text-red-800" :
                            "bg-slate-100 text-slate-800"
                          }>
                            {m.status === "efetivada" ? "Efetivada" :
                             m.status === "aprovado" ? "Aprovada" :
                             m.status === "em_analise" ? "Aguardando Análise" :
                             m.status === "rejeitado" ? "Recusada / Ajustar" :
                             "Pendente Documentos"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {m.status === "em_analise" && (
                              <button
                                onClick={() => {
                                  setSelectedMatricula(m);
                                  setFeedbackTexto("");
                                }}
                                className="bg-amber text-dark px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-dark transition-colors"
                              >
                                Analisar Docs
                              </button>
                            )}
                            {m.status === "aprovado" && (
                              <button
                                onClick={() => handleEfetivar(m.id)}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                              >
                                Efetivar Aluno
                              </button>
                            )}
                            {m.status === "pendente_documentos" && (
                              <button
                                onClick={() => {
                                  const link = `${window.location.origin}/matricula/enviar/${m.token}`;
                                  navigator.clipboard.writeText(link);
                                  toast.info("Link de matrícula copiado para envio!");
                                }}
                                className="border border-ink/10 text-ink-2 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-cream-2 transition-colors"
                              >
                                Copiar Link
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {matriculas.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-ink-2">Nenhuma pré-matrícula cadastrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal Gerar Link */}
              {showMatriculaModal && (
                <div className="fixed inset-0 bg-dark/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <form onSubmit={handleCreateLink} className="bg-white border border-ink/10 rounded-3xl p-6 shadow-xl space-y-4 max-w-md w-full">
                    <div className="flex justify-between items-center border-b border-ink/5 pb-2">
                      <h4 className="font-display font-black text-sm text-ink uppercase tracking-wide">
                        Novo Link de Matrícula
                      </h4>
                      <button type="button" onClick={() => setShowMatriculaModal(false)} className="text-ink-3 hover:text-ink">✕</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Nome do Aluno</Label>
                        <Input value={newMatriculaForm.nomeAluno} onChange={e => setNewMatriculaForm({...newMatriculaForm, nomeAluno: e.target.value})} required placeholder="Ex: Felipe Silva" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Série Pretendida</Label>
                        <select
                          value={newMatriculaForm.seriePretendida}
                          onChange={e => setNewMatriculaForm({...newMatriculaForm, seriePretendida: e.target.value})}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                        >
                          <option value="Berçário">Berçário</option>
                          <option value="Maternal I">Maternal I</option>
                          <option value="Maternal II">Maternal II</option>
                          <option value="Infantil 3">Infantil 3</option>
                          <option value="1º Ano">1º Ano</option>
                          <option value="2º Ano">2º Ano</option>
                          <option value="3º Ano">3º Ano</option>
                          <option value="4º Ano">4º Ano</option>
                          <option value="5º Ano">5º Ano</option>
                          <option value="6º Ano">6º Ano</option>
                          <option value="7º Ano">7º Ano</option>
                          <option value="8º Ano">8º Ano</option>
                          <option value="9º Ano">9º Ano</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Data de Nascimento</Label>
                        <Input type="date" value={newMatriculaForm.dataNascimento} onChange={e => setNewMatriculaForm({...newMatriculaForm, dataNascimento: e.target.value})} required />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">CPF do Responsável</Label>
                        <Input value={newMatriculaForm.cpfResponsavel} onChange={e => setNewMatriculaForm({...newMatriculaForm, cpfResponsavel: e.target.value})} required placeholder="000.000.000-00" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Nome do Responsável</Label>
                      <Input value={newMatriculaForm.nomeResponsavel} onChange={e => setNewMatriculaForm({...newMatriculaForm, nomeResponsavel: e.target.value})} required placeholder="Ex: Roberto Silva" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">E-mail</Label>
                        <Input type="email" value={newMatriculaForm.emailResponsavel} onChange={e => setNewMatriculaForm({...newMatriculaForm, emailResponsavel: e.target.value})} required placeholder="email@exemplo.com" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Telefone</Label>
                        <Input value={newMatriculaForm.telefoneResponsavel} onChange={e => setNewMatriculaForm({...newMatriculaForm, telefoneResponsavel: e.target.value})} required placeholder="11999999999" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-ink/5">
                      <button type="button" onClick={() => setShowMatriculaModal(false)} className="px-4 py-2 bg-cream text-ink-2 rounded-full text-xs font-semibold hover:bg-cream-3">Cancelar</button>
                      <button type="submit" className="px-5 py-2 bg-dark text-cream rounded-full text-xs font-semibold hover:bg-amber hover:text-dark">Gerar Link</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Modal Analisar Docs */}
              {selectedMatricula && (
                <div className="fixed inset-0 bg-dark/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <div className="bg-white border border-ink/10 rounded-3xl p-6 shadow-xl space-y-4 max-w-lg w-full">
                    <div className="flex justify-between items-center border-b border-ink/5 pb-2">
                      <div>
                        <h4 className="font-display font-black text-sm text-ink uppercase tracking-wide">
                          Análise de Documentos
                        </h4>
                        <p className="text-[10px] text-ink-3 mt-0.5">Aluno: {selectedMatricula.nomeAluno} · Resp: {selectedMatricula.nomeResponsavel}</p>
                      </div>
                      <button type="button" onClick={() => setSelectedMatricula(null)} className="text-ink-3 hover:text-ink">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedMatricula.documentos?.map(doc => {
                        const docLabels = {
                          certidao_nascimento: "Certidão de Nascimento",
                          carteira_vacina: "Carteira de Vacinação",
                          comprovante_residencia: "Comprovante de Residência",
                          documento_responsavel: "Documento Responsável"
                        };
                        return (
                          <div key={doc.id} className="border border-ink/10 rounded-xl p-3 bg-cream/10 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-ink">{docLabels[doc.tipo] || doc.tipo}</span>
                            <a
                              href={`${BACKEND_URL}${doc.fileUrl.replace('/favo-api', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 font-bold"
                            >
                              Verificar <ExternalLink size={10} />
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-ink/5">
                      <Label className="text-[10px] font-bold">Feedback / Motivo da Recusa (opcional)</Label>
                      <textarea
                        value={feedbackTexto}
                        onChange={e => setFeedbackTexto(e.target.value)}
                        placeholder="Ex: A certidão está ilegível ou cortada. Favor reenviar..."
                        rows={2}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none font-body"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleAnalyse(selectedMatricula.id, "rejeitado", feedbackTexto)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Recusar Documentos
                      </button>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setSelectedMatricula(null)} className="px-4 py-2 bg-cream text-ink-2 rounded-full text-xs font-semibold hover:bg-cream-3">Cancelar</button>
                        <button
                          type="button"
                          onClick={() => handleAnalyse(selectedMatricula.id, "aprovado")}
                          className="px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Aprovar Todos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        open={!!deleteConfirmEventId}
        onOpenChange={(open) => !open && setDeleteConfirmEventId(null)}
        title="Excluir Evento do Calendário"
        description="Tem certeza de que deseja remover este evento do calendário acadêmico? Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteEvent}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}
