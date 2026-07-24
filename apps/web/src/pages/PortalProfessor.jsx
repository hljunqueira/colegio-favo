import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  GraduationCap, ClipboardList, BookOpen, Scroll, 
  LogOut, UserCircle, Bell, Plus, CheckCircle2, Library, CalendarDays, LayoutGrid, Megaphone, Settings, Trash2, Edit, Menu, X
} from "lucide-react";
import { clearSession, getUser, authHeader, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { NotificationBell } from "@/components/ui/NotificationBell";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const monthsName = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function PortalProfessor() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Prof. Ana Paula", id: "" };
  const [view, setView] = useState("hub");
  const [selectedClass, setSelectedClass] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [avisos, setAvisos] = useState([]);
  const [events, setEvents] = useState([]);
  const [books, setBooks] = useState([]);

  // Novos states dinâmicos do banco
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({}); // { alunoId: boolean }
  const [notasValores, setNotasValores] = useState({}); // { alunoId: { avaliacao: string, trabalho: string } }
  
  const [professorId, setProfessorId] = useState("");
  const [planosEnviados, setPlanosEnviados] = useState([]);

  // States de Gerenciamento da Agenda (AgendaEvento)
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [deleteConfirmEventId, setDeleteConfirmEventId] = useState(null);
  const [eventForm, setEventForm] = useState({ titulo: "", descricao: "", dataHora: "", tipo: "prova", turmaId: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States de Configurações
  const [profileName, setProfileName] = useState(user.name || "");
  const [profileEmail, setProfileEmail] = useState(user.email || "");
  const [profilePassword, setProfilePassword] = useState("");
  const fileInputRef = useRef(null);
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem(`avatar_${user?.id}`) || "");

  const loadData = async () => {
    try {
      const [avisosRes, eventsRes, booksRes, turmasRes] = await Promise.all([
        axios.get(`${API}/avisos`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
        axios.get(`${API}/library/livros`, authHeader()),
        axios.get(`${API}/teachers/turmas`, authHeader())
      ]);
      setAvisos(avisosRes.data.filter(a => a.destinatario === "TEACHER" || a.destinatario === "GERAL"));
      setEvents(eventsRes.data);
      setBooks(booksRes.data);
      setTurmas(turmasRes.data);
      if (turmasRes.data.length > 0) {
        setSelectedClass(turmasRes.data[0].id);
      }

      // Buscar perfil real do professor logado e planos dele
      const profRes = await axios.get(`${API}/teachers/profile?userId=${user.id}`, authHeader());
      if (profRes.data) {
        setProfessorId(profRes.data.id);
        const planosRes = await axios.get(`${API}/lessons/planos/professor/${profRes.data.id}`, authHeader());
        setPlanosEnviados(planosRes.data);
      }

      setLoading(false);
    } catch {
      toast.error("Erro ao carregar dados do portal.");
      setLoading(false);
    }
  };

  const loadAlunos = async (turmaId) => {
    if (!turmaId) return;
    try {
      const res = await axios.get(`${API}/teachers/alunos?turmaId=${turmaId}`, authHeader());
      setAlunos(res.data);
      // Prepara estados de presença/notas iniciais
      const initialPres = {};
      const initialNotas = {};
      res.data.forEach(a => {
        initialPres[a.id] = true;
        const noteEval = a.notas?.find(n => n.p1 !== null)?.p1 || "";
        const noteWork = a.notas?.find(n => n.trabalho !== null)?.trabalho || "";
        initialNotas[a.id] = { avaliacao: noteEval.toString(), trabalho: noteWork.toString() };
      });
      setPresencas(initialPres);
      setNotasValores(initialNotas);
    } catch {
      toast.error("Erro ao carregar alunos desta turma.");
    }
  };

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    loadData();
  }, [navigate]);

  useEffect(() => {
    loadAlunos(selectedClass);
  }, [selectedClass]);

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const submitPlan = async (e) => {
    e.preventDefault();
    if (!planTitle || !planDesc) {
      toast.error("Por favor, preencha o plano de aula.");
      return;
    }
    try {
      await axios.post(`${API}/lessons/planos`, {
        professorId,
        turmaId: selectedClass,
        titulo: planTitle,
        conteudo: planDesc,
        objetivos: "Desenvolver competências e habilidades da série."
      }, authHeader());
      toast.success("Plano de aula submetido para avaliação da Coordenação!");
      setPlanTitle("");
      setPlanDesc("");
      const planosRes = await axios.get(`${API}/lessons/planos/professor/${professorId}`, authHeader());
      setPlanosEnviados(planosRes.data);
    } catch {
      toast.error("Erro ao submeter plano de aula.");
    }
  };

  // Handlers da Chamada Diária
  const handleSaveChamada = async () => {
    try {
      const list = Object.keys(presencas).map(id => ({ alunoId: id, presente: presencas[id] }));
      await axios.post(`${API}/teachers/chamada`, {
        data: new Date().toISOString(),
        turmaId: selectedClass,
        presencas: list
      }, authHeader());
      toast.success("Chamada diária salva e registrada no histórico!");
    } catch {
      toast.error("Erro ao registrar pauta de presença.");
    }
  };

  // Handlers do Lançamento de Notas
  const handleSaveNotas = async () => {
    try {
      await Promise.all(
        Object.keys(notasValores).map(async (alunoId) => {
          const notesObj = notasValores[alunoId];
          const promises = [];
          if (notesObj.avaliacao !== "") {
            promises.push(axios.post(`${API}/teachers/notas`, {
              alunoId,
              disciplina: "Matemática",
              valor: parseFloat(notesObj.avaliacao),
              tipo: "avaliacao"
            }, authHeader()));
          }
          if (notesObj.trabalho !== "") {
            promises.push(axios.post(`${API}/teachers/notas`, {
              alunoId,
              disciplina: "Matemática",
              valor: parseFloat(notesObj.trabalho),
              tipo: "trabalho"
            }, authHeader()));
          }
          return Promise.all(promises);
        })
      );
      toast.success("Boletim de notas atualizado com sucesso!");
      loadAlunos(selectedClass);
    } catch {
      toast.error("Erro ao atualizar notas.");
    }
  };

  // Handlers de Gerenciamento da Agenda de Alunos
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.titulo || !eventForm.dataHora) {
      toast.error("Preencha título e data do evento.");
      return;
    }
    try {
      if (editingEventId) {
        await axios.patch(`${API}/events/${editingEventId}`, eventForm, authHeader());
        toast.success("Compromisso da agenda atualizado!");
      } else {
        await axios.post(`${API}/events`, eventForm, authHeader());
        toast.success("Novo compromisso adicionado à agenda!");
      }
      setShowEventModal(false);
      setEditingEventId(null);
      setEventForm({ titulo: "", descricao: "", dataHora: "", tipo: "prova", turmaId: selectedClass });
      const evs = await axios.get(`${API}/events`, authHeader());
      setEvents(evs.data);
    } catch {
      toast.error("Erro ao salvar compromisso.");
    }
  };

  const handleEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventForm({
      titulo: ev.titulo,
      descricao: ev.descricao,
      dataHora: ev.dataHora ? ev.dataHora.slice(0, 16) : "",
      tipo: ev.tipo,
      turmaId: ev.turmaId || selectedClass
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (id) => {
    setDeleteConfirmEventId(id);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteConfirmEventId) return;
    try {
      await axios.delete(`${API}/events/${deleteConfirmEventId}`, authHeader());
      toast.success("Evento removido da agenda.");
      setDeleteConfirmEventId(null);
      const evs = await axios.get(`${API}/events`, authHeader());
      setEvents(evs.data);
    } catch {
      toast.error("Erro ao excluir evento.");
    }
  };

  // Handlers do Perfil e Upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API}/site-config/upload`, formData, {
        headers: {
          ...authHeader().headers,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data?.url) {
        const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url.replace('/favo-api', '')}`;
        localStorage.setItem(`avatar_${user?.id}`, fullUrl);
        setUserAvatar(fullUrl);
        toast.success("Foto de perfil atualizada!");
      }
    } catch {
      toast.error("Erro ao fazer upload da foto.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    toast.success("Configurações atualizadas!");
  };

  const menuItems = [
    { key: "mural", label: "Mural", icon: LayoutGrid },
    { key: "turmas", label: "Minhas Turmas", icon: BookOpen },
    { key: "chamada", label: "Chamada Diária", icon: ClipboardList },
    { key: "notas", label: "Lançar Notas", icon: GraduationCap },
    { key: "planos", label: "Planos de Aula", icon: Scroll },
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "biblioteca", label: "Biblioteca", icon: Library },
    { key: "config", label: "Configurações", icon: Settings },
  ];

  const cards = [
    { key: "mural", label: "Mural de Avisos", desc: "Avisos e comunicados da escola", icon: Megaphone, bg: "bg-[#fffaf0] border-[#fbeed5]" },
    { key: "turmas", label: "Minhas Turmas", desc: "Ver turmas e séries vinculadas", icon: BookOpen, bg: "bg-[#f4f9f4] border-[#e1e9e1]" },
    { key: "chamada", label: "Chamada Diária", desc: "Registrar presença e faltas", icon: ClipboardList, bg: "bg-[#eef4ff] border-[#d9e5fc]" },
    { key: "notas", label: "Lançar Notas", desc: "Inserir notas de provas e trabalhos", icon: GraduationCap, bg: "bg-[#fdf2f8] border-[#fbcfe8]" },
    { key: "planos", label: "Planos de Aula", desc: "Criar e submeter planos pedagógicos", icon: Scroll, bg: "bg-[#faf5ff] border-[#f3e8ff]" },
    { key: "agenda", label: "Agenda Escolar", desc: "Calendário interativo de atividades", icon: CalendarDays, bg: "bg-[#f0fdf4] border-[#dcfce7]" },
    { key: "biblioteca", label: "Biblioteca", desc: "Consultar acervo de livros", icon: Library, bg: "bg-[#f0fdfa] border-[#ccfbf1]" },
    { key: "config", label: "Configurações", desc: "Gerenciar dados e avatar", icon: Settings, bg: "bg-[#f8fafc] border-[#f1f5f9]" },
  ];

  return (
    <div className="min-h-screen bg-cream-2 flex font-body text-ink" data-testid="professor-dashboard">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5 text-cream border-r border-white/5 font-body shrink-0 z-30">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <img src="/logo-favo-oficial.png" alt="Centro Educacional Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <span className="font-display font-extrabold tracking-tight text-cream block text-sm leading-tight">Portal Professor</span>
            <span className="text-[10px] text-cream/50 uppercase tracking-widest font-semibold block mt-0.5">Favo de Mel</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                view === item.key || (view === "hub" && item.key === "mural")
                  ? "bg-honey text-dark font-bold shadow-sm" 
                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5 transition-colors mt-auto font-body"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-dark text-cream p-5 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo-favo-oficial.png" alt="Favo de Mel" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-display font-extrabold text-sm text-cream">Portal Professor</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-cream/70 hover:text-cream">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-grow">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setView(item.key); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    view === item.key ? "bg-honey text-dark font-bold" : "text-cream/70 hover:bg-white/5 hover:text-cream"
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5 mt-auto">
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-ink/5 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-ink-2 hover:bg-cream rounded-lg transition-colors"
              title="Abrir menu"
            >
              <Menu size={22} />
            </button>
            <h2 className="font-display font-extrabold text-base md:text-xl text-ink">
              Olá, {profileName || user.name} 📚
            </h2>
            <Badge className="bg-[#eef4ff] text-blue-800 font-semibold border-0 text-xs hidden sm:inline-flex">
              Docente
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-ink-2 hover:bg-cream rounded-full transition-colors relative" title="Notificações">
              <Bell size={20} />
              {avisos.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber rounded-full animate-pulse" />}
            </button>
            <div className="flex items-center gap-2 border-l border-ink/10 pl-4">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-ink-2 block leading-none">{profileName || user.name}</span>
                <span className="text-[9px] text-ink-3">Professor</span>
              </div>
              <div 
                onClick={handleAvatarClick}
                className="w-8 h-8 rounded-full bg-honey text-dark flex items-center justify-center font-display font-bold shrink-0 shadow-sm border border-ink/5 cursor-pointer relative overflow-hidden group hover:opacity-90 transition-opacity ml-2"
                title="Alterar foto de perfil"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(profileName || user?.name)}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-cream">📷</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              <NotificationBell />
              <button 
                onClick={logout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="p-6 sm:p-8 flex-grow max-w-[1400px] mx-auto w-full">
          {view === "hub" && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-honey/20 to-amber-500/10 border border-honey/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-ink">Bem-vindo(a) ao seu Painel, {profileName || user.name}!</h2>
                  <p className="text-sm text-ink-2 mt-1.5">Acompanhe suas turmas, registre chamadas diárias e lance notas dos alunos.</p>
                </div>
                <button
                  onClick={() => setView("chamada")}
                  className="bg-amber text-dark font-bold text-xs px-5 py-3 rounded-full hover:bg-amber-600 transition-colors shadow-sm self-start md:self-auto shrink-0"
                >
                  Fazer Chamada Hoje ➔
                </button>
              </div>

              {/* Grid de Informações Principais */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Turmas sob sua Regência */}
                <div className="lg:col-span-2 bg-white border border-ink/10 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-4">
                    <h3 className="font-display font-extrabold text-lg text-ink">Suas Turmas Ativas</h3>
                    <button onClick={() => setView("turmas")} className="text-xs font-bold text-amber hover:underline">Ver todas</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {turmas.slice(0, 4).map((t) => (
                      <div key={t.id} className="bg-cream border border-ink/5 rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-ink">{t.nome}</h4>
                          <p className="text-xs text-ink-2 mt-0.5">{t.serie} · Turno {t.turno}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedClass(t.id); setView("chamada"); }}
                          className="text-xs font-bold text-amber hover:underline mt-4 text-left"
                        >
                          Lançar Frequência ➔
                        </button>
                      </div>
                    ))}
                    {turmas.length === 0 && (
                      <p className="text-xs text-ink-2 col-span-full py-4 text-center">Nenhuma turma cadastrada no momento.</p>
                    )}
                  </div>
                </div>

                {/* Avisos do Corpo Docente */}
                <div className="bg-white border border-ink/10 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-4">
                    <h3 className="font-display font-extrabold text-lg text-ink">Avisos Recentes</h3>
                    <button onClick={() => setView("comms")} className="text-xs font-bold text-amber hover:underline">Ver mural</button>
                  </div>
                  <div className="space-y-3">
                    {avisos.slice(0, 3).map((a) => (
                      <div key={a.id} className="p-3 bg-cream/60 rounded-xl border border-ink/5 space-y-1">
                        <span className="text-[10px] font-bold text-amber uppercase tracking-wider">{a.tag || "Pedagógico"}</span>
                        <h5 className="font-display font-bold text-xs text-ink">{a.titulo}</h5>
                        <p className="text-[11px] text-ink-2 line-clamp-2">{a.conteudo}</p>
                      </div>
                    ))}
                    {avisos.length === 0 && (
                      <p className="text-xs text-ink-2 py-4 text-center">Nenhum aviso no momento.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "turmas" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {turmas.map((t) => (
                <div key={t.id} className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-lg mb-2">{t.nome} - Ensino Fundamental</h3>
                    <p className="text-xs text-ink-2 mb-4">{t.serie} · Turno {t.turno}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-2 pt-4 border-t border-ink/5">
                    <span>Ano Letivo: {t.ano}</span>
                    <button 
                      onClick={() => { setSelectedClass(t.id); setView("chamada"); }} 
                      className="text-amber hover:underline font-bold"
                    >
                      Fazer Chamada ➔
                    </button>
                  </div>
                </div>
              ))}
              {turmas.length === 0 && (
                <p className="p-8 text-center text-ink-2 col-span-full">Nenhuma turma vinculada.</p>
              )}
            </div>
          )}

          {view === "chamada" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Chamada Diária</h3>
                  <p className="text-xs text-ink-2 mt-0.5">Selecione os alunos presentes na aula de hoje.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink-2">Turma:</span>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)} 
                    className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                  >
                    {turmas.map(t => (
                      <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {alunos.map((a) => (
                  <label key={a.id} className="flex items-center justify-between p-3.5 bg-cream rounded-xl border border-ink/5 cursor-pointer hover:bg-cream-2/40 transition-colors select-none">
                    <span className="text-sm font-semibold">{a.user?.name}</span>
                    <input 
                      type="checkbox" 
                      checked={!!presencas[a.id]} 
                      onChange={(e) => setPresencas({ ...presencas, [a.id]: e.target.checked })}
                      className="w-5 h-5 rounded border-ink/10 accent-emerald-500 cursor-pointer" 
                    />
                  </label>
                ))}
                {alunos.length === 0 && (
                  <p className="p-8 text-center text-ink-2">Nenhum aluno matriculado nesta turma.</p>
                )}
              </div>
              {alunos.length > 0 && (
                <button 
                  onClick={handleSaveChamada}
                  className="mt-6 bg-dark text-cream font-body font-semibold px-6 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors"
                >
                  Salvar Pauta
                </button>
              )}
            </div>
          )}

          {view === "notas" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Lançamento de Notas</h3>
                  <p className="text-xs text-ink-2 mt-0.5">Insira as notas de avaliação e trabalho dos alunos.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink-2">Turma:</span>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)} 
                    className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                  >
                    {turmas.map(t => (
                      <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="w-full text-left border-collapse font-body text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-ink/5 text-ink-2 uppercase font-semibold">
                    <th className="py-3">Aluno</th>
                    <th className="py-3">Avaliação (Prova)</th>
                    <th className="py-3">Trabalho Prático</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {alunos.map((a) => (
                    <tr key={a.id}>
                      <td className="py-3 font-semibold">{a.user?.name}</td>
                      <td className="py-3">
                        <Input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="Nota (0-10)" 
                          className="w-24 h-8 text-xs font-body"
                          value={notasValores[a.id]?.avaliacao || ""} 
                          onChange={(e) => setNotasValores({
                            ...notasValores,
                            [a.id]: { ...notasValores[a.id], avaliacao: e.target.value }
                          })}
                        />
                      </td>
                      <td className="py-3">
                        <Input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="Nota (0-10)" 
                          className="w-24 h-8 text-xs font-body"
                          value={notasValores[a.id]?.trabalho || ""} 
                          onChange={(e) => setNotasValores({
                            ...notasValores,
                            [a.id]: { ...notasValores[a.id], trabalho: e.target.value }
                          })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {alunos.length === 0 ? (
                <p className="p-8 text-center text-ink-2">Nenhum aluno nesta turma para lançar notas.</p>
              ) : (
                <button 
                  onClick={handleSaveNotas}
                  className="mt-6 bg-dark text-cream font-body font-semibold px-6 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors"
                >
                  Salvar Notas
                </button>
              )}
            </div>
          )}

          {view === "planos" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="font-display font-extrabold text-xl text-ink">Enviar Novo Plano de Aula</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-2">Turma:</span>
                    <select 
                      value={selectedClass} 
                      onChange={(e) => setSelectedClass(e.target.value)} 
                      className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                    >
                      {turmas.map(t => (
                        <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
                      ))}
                    </select>
                  </div>
                </div>
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
                  {planosEnviados.map((p) => (
                    <div key={p.id} className="p-3 bg-cream rounded-xl border border-ink/5">
                      <div className="flex justify-between items-start">
                        <h5 className="font-body font-semibold text-xs text-ink">{p.titulo}</h5>
                        {p.turma && <span className="text-[9px] bg-dark/5 px-1.5 py-0.5 rounded text-ink-2 font-semibold uppercase">{p.turma.nome}</span>}
                      </div>
                      <p className="text-[10px] text-ink-2 mt-1 line-clamp-2">{p.conteudo}</p>
                      <p className={`text-[10px] font-bold mt-1.5 uppercase ${
                        p.status === "aprovado" ? "text-emerald-600" : p.status === "ajustar" ? "text-red-500" : "text-amber-600"
                      }`}>
                        Status: {p.status === "aprovado" ? "Aprovado" : p.status === "ajustar" ? "Ajustar" : "Em Análise"}
                      </p>
                    </div>
                  ))}
                  {planosEnviados.length === 0 && (
                    <p className="text-center text-xs text-ink-3 py-6">Nenhum plano enviado ainda.</p>
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

          {view === "agenda" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Agenda de Atividades & Provas</h3>
                  <p className="text-xs text-ink-2 mt-0.5">Clique em qualquer dia para adicionar um evento ou clique em um evento existente para editar/excluir.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-cream p-2 rounded-2xl border border-ink/5">
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="p-1.5 hover:bg-white rounded-xl text-ink font-bold transition-all text-xs"
                  >
                    ◀ Anterior
                  </button>
                  <span className="font-display font-extrabold text-sm text-ink uppercase tracking-wide px-2 min-w-[120px] text-center">
                    {monthsName[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="p-1.5 hover:bg-white rounded-xl text-ink font-bold transition-all text-xs"
                  >
                    Próximo ▶
                  </button>
                </div>
              </div>

              {/* Grid de Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 text-center font-display font-bold text-xs text-ink-2 border-b border-ink/5 pb-2">
                {daysOfWeek.map(d => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>

              {/* Grid do Calendário */}
              <div className="grid grid-cols-7 gap-1 bg-cream-2 border border-ink/5 rounded-2xl overflow-hidden shadow-inner">
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDayIndex = new Date(year, month, 1).getDay();
                  const lastDay = new Date(year, month + 1, 0).getDate();
                  const prevLastDay = new Date(year, month, 0).getDate();

                  const cells = [];
                  for (let i = firstDayIndex - 1; i >= 0; i--) {
                    const d = prevLastDay - i;
                    cells.push({ day: d, isCurrent: false, date: new Date(year, month - 1, d) });
                  }
                  for (let i = 1; i <= lastDay; i++) {
                    cells.push({ day: i, isCurrent: true, date: new Date(year, month, i) });
                  }
                  const nextDays = 42 - cells.length;
                  for (let i = 1; i <= nextDays; i++) {
                    cells.push({ day: i, isCurrent: false, date: new Date(year, month + 1, i) });
                  }

                  return cells.map((cell, idx) => {
                    const cellDateStr = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, '0')}-${String(cell.date.getDate()).padStart(2, '0')}`;
                    const cellEvents = events.filter(e => e.dataHora && e.dataHora.slice(0, 10) === cellDateStr);

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setEditingEventId(null);
                          setEventForm({ titulo: "", descricao: "", dataHora: `${cellDateStr}T08:00`, tipo: "prova", turmaId: selectedClass });
                          setShowEventModal(true);
                        }}
                        className={`min-h-[100px] bg-white border border-ink/5 p-2 flex flex-col justify-between hover:bg-amber/5 transition-colors cursor-pointer relative ${
                          !cell.isCurrent ? "opacity-40 bg-cream/30" : ""
                        }`}
                      >
                        <span className={`text-[10px] font-bold self-start ${cell.isCurrent ? "text-ink" : "text-ink-3"}`}>
                          {cell.day}
                        </span>
                        <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[70px]">
                          {cellEvents.map(e => (
                            <div 
                              key={e.id}
                              onClick={(evt) => {
                                evt.stopPropagation();
                                handleEditEvent(e);
                              }}
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold truncate text-white ${
                                e.tipo === "prova" ? "bg-red-500 hover:bg-red-600" : e.tipo === "trabalho" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                              }`}
                              title={`${e.titulo}${e.turma ? ` (${e.turma.nome})` : ""}`}
                            >
                              {e.titulo}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Event Management Modal */}
              {showEventModal && (
                <div className="fixed inset-0 bg-dark/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <form onSubmit={handleSaveEvent} className="bg-white border border-ink/10 rounded-3xl p-6 shadow-xl space-y-4 max-w-md w-full">
                    <div className="flex justify-between items-center border-b border-ink/5 pb-2">
                      <h4 className="font-display font-black text-sm text-ink uppercase tracking-wide">
                        {editingEventId ? "Editar Evento da Agenda" : "Cadastrar Novo Evento"}
                      </h4>
                      <button 
                        type="button" 
                        onClick={() => setShowEventModal(false)}
                        className="text-ink-3 hover:text-ink text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Título do Compromisso</Label>
                      <Input value={eventForm.titulo} onChange={(e) => setEventForm({ ...eventForm, titulo: e.target.value })} required placeholder="Ex: Avaliação de Matemática" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Tipo</Label>
                        <select 
                          value={eventForm.tipo} 
                          onChange={(e) => setEventForm({ ...eventForm, tipo: e.target.value })} 
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                        >
                          <option value="prova">Prova / Exame</option>
                          <option value="trabalho">Trabalho Prático</option>
                          <option value="evento_escolar">Evento Escolar</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Turma Vinculada</Label>
                        <select 
                          value={eventForm.turmaId} 
                          onChange={(e) => setEventForm({ ...eventForm, turmaId: e.target.value })} 
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-body focus:outline-none"
                        >
                          <option value="">Geral (Sem turma)</option>
                          {turmas.map(t => (
                            <option key={t.id} value={t.id}>{t.nome}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Data e Hora de Entrega/Realização</Label>
                      <Input type="datetime-local" value={eventForm.dataHora} onChange={(e) => setEventForm({ ...eventForm, dataHora: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold">Instruções / Detalhes</Label>
                      <textarea 
                        value={eventForm.descricao} 
                        onChange={(e) => setEventForm({ ...eventForm, descricao: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none font-body"
                        rows={3}
                        placeholder="Instruções sobre o conteúdo da prova..."
                      />
                    </div>
                    <div className="flex gap-2 justify-between pt-4 border-t border-ink/5">
                      {editingEventId ? (
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowEventModal(false);
                            handleDeleteEvent(editingEventId);
                          }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-bold transition-colors"
                        >
                          Excluir Evento
                        </button>
                      ) : <div />}
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => setShowEventModal(false)}
                          className="px-4 py-2 bg-cream text-ink-2 rounded-full text-xs font-semibold hover:bg-cream-3 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2 bg-dark text-cream rounded-full text-xs font-semibold hover:bg-amber hover:text-dark transition-colors"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
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

          {view === "config" && (
            <div className="bg-white border border-ink/5 rounded-3xl p-6 shadow-sm max-w-xl">
              <h3 className="font-display font-extrabold text-xl mb-1 text-ink">Configurações da Conta</h3>
              <p className="text-xs text-ink-2 mb-6">Atualize suas informações pessoais e foto de perfil.</p>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-cream rounded-2xl border border-ink/5">
                  <div 
                    onClick={handleAvatarClick}
                    className="w-16 h-16 rounded-full bg-honey text-dark flex items-center justify-center font-display font-extrabold text-lg shrink-0 shadow-sm border border-ink/5 cursor-pointer relative overflow-hidden group hover:opacity-90 transition-opacity"
                    title="Alterar foto de perfil"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(profileName || user?.name)}</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-cream">📷</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-body font-bold text-sm text-ink">{profileName}</h4>
                    <p className="text-xs text-ink-2 uppercase tracking-wider font-semibold mt-0.5">{user.role}</p>
                    <p className="text-[10px] text-ink-3 mt-1">Clique no avatar para alterar a foto</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nome Completo</Label>
                  <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Endereço de E-mail</Label>
                  <Input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Senha de Acesso (Deixe em branco para não alterar)</Label>
                  <Input type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} placeholder="Nova senha..." />
                </div>

                <button 
                  type="submit"
                  className="bg-dark text-cream font-body font-semibold px-6 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        open={!!deleteConfirmEventId}
        onOpenChange={(open) => !open && setDeleteConfirmEventId(null)}
        title="Excluir Evento da Agenda"
        description="Tem certeza de que deseja remover este compromisso da agenda escolar? Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteEvent}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}

const getInitials = (name) => {
  return (name || "").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
};
