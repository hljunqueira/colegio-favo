import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, GraduationCap, School, Layers, UserPlus, ArrowLeftRight, 
  FileText, Bell, LogOut, Menu, X, LayoutGrid, Printer, BookOpen, ShieldCheck 
} from "lucide-react";
import { clearSession, getUser, authHeader } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/ui/NotificationBell";

// Importa submódulos reutilizáveis da Secretaria
import { Alunos } from "@/components/gestao/Alunos";
import { Professores, Turmas } from "@/components/gestao/CrudLists";
import { 
  Series, 
  Disciplinas, 
  Matriculas, 
  Transferencias 
} from "@/components/gestao/SecretariaModules";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalSecretaria() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Secretaria Geral", email: "", role: "SECRETARIA" };

  const [view, setView] = useState("hub");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados para emissão de declarações
  const [alunosList, setAlunosList] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [tipoDeclaracao, setTipoDeclaracao] = useState("matricula");

  // Guarda de Rota (Route Guard RBAC)
  useEffect(() => {
    const role = (user.role || "").toLowerCase();
    if (role === "student" || role === "aluno") {
      navigate("/portal/aluno", { replace: true });
    } else if (role === "parent" || role === "pais") {
      navigate("/portal/pais", { replace: true });
    }
  }, [user, navigate]);

  // Carrega alunos para o gerador de declarações
  useEffect(() => {
    axios.get(`${API}/gestao/alunos`, authHeader())
      .then(res => setAlunosList(res.data || []))
      .catch(() => {});
  }, []);

  const logout = () => {
    clearSession();
    toast.success("Sessão encerrada com sucesso.");
    navigate("/portal", { replace: true });
  };

  const menuItems = [
    { key: "hub", label: "Visão Geral", icon: LayoutGrid },
    { key: "alunos", label: "Alunos & Prontuários", icon: Users },
    { key: "professores", label: "Professores", icon: GraduationCap },
    { key: "turmas", label: "Turmas & Salas", icon: School },
    { key: "series", label: "Séries & Disciplinas", icon: Layers },
    { key: "matricula", label: "Matrícula Digital", icon: UserPlus },
    { key: "transferencias", label: "Rematrículas & Trocas", icon: ArrowLeftRight },
    { key: "declaracoes", label: "Emissão de Declarações", icon: FileText },
  ];

  const cards = [
    { key: "alunos", label: "Alunos & Prontuários", desc: "Gestão completa de prontuários e dados cadastrais", icon: Users, color: "bg-honey/10 text-amber" },
    { key: "matricula", label: "Matrícula Digital", desc: "Wizard de pré-matrículas e consulta de CEP", icon: UserPlus, color: "bg-moss/10 text-moss" },
    { key: "transferencias", label: "Transferências & Rematrículas", desc: "Análise de troca de turmas e renovação", icon: ArrowLeftRight, color: "bg-sky-500/10 text-sky-500" },
    { key: "declaracoes", label: "Emissão de Declarações", icon: FileText, desc: "Atestados de matrícula e frequência em PDF", color: "bg-purple-500/10 text-purple-500" },
    { key: "turmas", label: "Turmas & Salas", desc: "Visualização de salas e capacidade por turno", icon: School, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "series", label: "Séries & Disciplinas", desc: "Matrizes curriculares e anos letivos", icon: Layers, color: "bg-rose-500/10 text-rose-500" },
  ];

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dark text-cream min-h-screen sticky top-0 shrink-0 border-r border-ink/10">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber text-dark flex items-center justify-center font-display font-black text-lg">
            F
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-wide text-cream uppercase">Favo de Mel</h1>
            <p className="text-[10px] text-cream/60 font-medium">Portal da Secretaria</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                view === item.key
                  ? "bg-amber text-dark font-bold shadow-md"
                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-xs">
            <ShieldCheck size={16} className="text-amber" />
            <span className="truncate text-cream/80 text-[11px] font-semibold">{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} /> Sair do Portal
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior */}
        <header className="bg-white border-b border-ink/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink-2 hover:bg-cream rounded-xl"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="font-display font-extrabold text-lg text-ink">Portal da Secretaria Geral</h2>
              <p className="text-xs text-ink-2 hidden sm:block">Atendimento ao aluno, matrículas e emissão de documentos oficiais.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="text-xs font-bold text-ink-2 bg-cream px-3 py-1.5 rounded-full border border-ink/5 hidden sm:inline">
              {user.email || user.name}
            </span>
          </div>
        </header>

        {/* Drawer Responsivo Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-dark/60 z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 bg-dark text-cream h-full p-4 space-y-2 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-amber">Portal Secretaria</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-cream/70"><X size={18} /></button>
              </div>
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setView(item.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                    view === item.key ? "bg-amber text-dark font-bold" : "text-cream/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="pt-6">
                <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-xs text-rose-400 font-semibold bg-white/5 rounded-xl">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <main className="p-6 sm:p-8 flex-grow">
          {view === "hub" && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-honey/20 to-amber-500/10 border border-honey/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-ink">Central da Secretaria Escolar</h2>
                  <p className="text-sm text-ink-2 mt-1.5">Atendimento ao aluno, matrículas digitais e emissão de declarações timbradas.</p>
                </div>
                <button
                  onClick={() => setView("declaracoes")}
                  className="bg-dark text-cream font-bold text-xs px-5 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors shadow-sm self-start md:self-auto shrink-0 flex items-center gap-2"
                >
                  <FileText size={16} /> Emitir Declaração ➔
                </button>
              </div>

              {/* Indicadores Executivos de Atendimento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-ink/10 p-6 rounded-3xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-ink-2 uppercase tracking-wider">Total de Alunos</span>
                  <div className="font-display font-black text-3xl text-ink">{alunosList.length || "—"}</div>
                  <p className="text-[11px] text-ink-3">Alunos ativos no prontuário</p>
                </div>

                <div className="bg-white border border-ink/10 p-6 rounded-3xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-amber uppercase tracking-wider">Matrícula Digital</span>
                  <div className="font-display font-black text-3xl text-amber">Ativo</div>
                  <button onClick={() => setView("matricula")} className="text-xs font-bold text-amber hover:underline block pt-1">
                    Abrir Formulário ➔
                  </button>
                </div>

                <div className="bg-white border border-ink/10 p-6 rounded-3xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Transferências</span>
                  <div className="font-display font-black text-3xl text-sky-600">Gestão</div>
                  <button onClick={() => setView("transferencias")} className="text-xs font-bold text-sky-600 hover:underline block pt-1">
                    Ver Trocas & Rematrículas ➔
                  </button>
                </div>

                <div className="bg-white border border-ink/10 p-6 rounded-3xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Declarações</span>
                  <div className="font-display font-black text-3xl text-purple-600">PDF</div>
                  <button onClick={() => setView("declaracoes")} className="text-xs font-bold text-purple-600 hover:underline block pt-1">
                    Gerar Atestados ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === "alunos" && <Alunos onBack={() => setView("hub")} />}
          {view === "professores" && <Professores onBack={() => setView("hub")} />}
          {view === "turmas" && <Turmas onBack={() => setView("hub")} />}
          {view === "series" && (
            <div className="space-y-8">
              <Series onBack={() => setView("hub")} />
              <Disciplinas onBack={() => setView("hub")} />
            </div>
          )}
          {view === "matricula" && <Matriculas onBack={() => setView("hub")} />}
          {view === "transferencias" && <Transferencias onBack={() => setView("hub")} />}

          {/* MÓDULO DE EMISSÃO DE DECLARAÇÕES */}
          {view === "declaracoes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between print:hidden">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-ink">Emissão de Declarações Oficiais</h3>
                  <p className="text-xs text-ink-2">Gere atestados de matrícula e frequência timbrados para impressão.</p>
                </div>
                {selectedAluno && (
                  <button
                    onClick={printDocument}
                    className="inline-flex items-center gap-2 bg-dark text-cream hover:bg-amber hover:text-dark px-5 py-2.5 rounded-full text-xs font-bold transition-colors"
                  >
                    <Printer size={16} /> Imprimir Declaração (PDF)
                  </button>
                )}
              </div>

              {/* Formulário de Seleção do Aluno */}
              <div className="bg-white border border-ink/10 rounded-3xl p-6 shadow-sm space-y-4 max-w-xl print:hidden">
                <div>
                  <label className="text-xs font-bold text-ink-2 block mb-1">Selecione o Aluno *</label>
                  <select
                    onChange={(e) => {
                      const found = alunosList.find(a => a.id === e.target.value);
                      setSelectedAluno(found || null);
                    }}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-body focus:outline-none"
                  >
                    <option value="">-- Escolha um aluno cadastrado --</option>
                    {alunosList.map(a => (
                      <option key={a.id} value={a.id}>{a.name} (Matrícula: {a.matricula || "—"})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-2 block mb-1">Tipo de Documento</label>
                  <select
                    value={tipoDeclaracao}
                    onChange={(e) => setTipoDeclaracao(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-body focus:outline-none"
                  >
                    <option value="matricula">Declaração de Matrícula Regular</option>
                    <option value="frequencia">Declaração de Frequência Escolar</option>
                    <option value="historico">Histórico Escolar Simplificado</option>
                  </select>
                </div>
              </div>

              {/* DOCUMENTO TIMBRADO IMPRESSO */}
              {selectedAluno ? (
                <div className="bg-white border border-ink/20 rounded-3xl p-8 sm:p-12 shadow-lg max-w-3xl mx-auto space-y-8 font-body print:border-none print:shadow-none print:p-0">
                  <div className="text-center border-b border-ink/10 pb-6 space-y-1">
                    <h1 className="font-display font-black text-2xl text-ink uppercase tracking-wide">Centro Educacional Favo de Mel</h1>
                    <p className="text-xs text-ink-2">Educação Infantil e Ensino Fundamental</p>
                    <p className="text-[10px] text-ink-3">CNPJ: 00.000.000/0001-00 · Rua das Flores, 123 · Tel: (11) 4002-8922</p>
                  </div>

                  <div className="text-center py-4">
                    <h2 className="font-display font-extrabold text-lg text-ink uppercase tracking-wider underline">
                      {tipoDeclaracao === "matricula" && "DECLARAÇÃO DE MATRÍCULA"}
                      {tipoDeclaracao === "frequencia" && "DECLARAÇÃO DE FREQUÊNCIA ESCOLAR"}
                      {tipoDeclaracao === "historico" && "HISTÓRICO ESCOLAR SIMPLIFICADO"}
                    </h2>
                  </div>

                  <div className="text-sm leading-relaxed text-ink text-justify space-y-4">
                    <p>
                      Declaramos para os devidos fins de direito que o(a) aluno(a) <strong className="uppercase">{selectedAluno.name}</strong>, 
                      matriculado(a) sob o registro <strong>Nº {selectedAluno.matricula || "2026-001"}</strong>, encontra-se regularmente 
                      matriculado(a) e frequentando o ano letivo de <strong>2026</strong> nesta instituição de ensino no curso de Educação Fundamental.
                    </p>
                    {tipoDeclaracao === "frequencia" && (
                      <p>
                        Atestamos ainda que o(a) referido(a) estudante possui assiduidade regular às aulas e atividades pedagógicas programadas, 
                        cumprindo com a frequência exigida pela legislação educacional vigente.
                      </p>
                    )}
                  </div>

                  <div className="pt-12 text-center space-y-8">
                    <p className="text-xs text-ink-2">São Paulo, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>
                    <div className="pt-8 flex flex-col items-center">
                      <div className="w-64 border-t border-ink/40" />
                      <span className="text-xs font-bold text-ink mt-2">Secretaria Geral Escolar</span>
                      <span className="text-[10px] text-ink-3">Centro Educacional Favo de Mel</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-cream border border-ink/10 rounded-2xl p-12 text-center text-ink-2 print:hidden">
                  <FileText size={32} className="mx-auto text-amber mb-2" />
                  <p className="text-sm font-semibold">Selecione um aluno acima para visualizar a prévia da declaração timbrada.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
