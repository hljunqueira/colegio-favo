import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  PencilRuler, NotebookPen, ClipboardCheck, BookMarked, ClipboardList, Plus, 
  Search, ArrowLeft, FolderOpen, CalendarDays, AlertTriangle 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// --- MAIN UNIFIED PEDAGÓGICO COMPONENT ---
export const Pedagogico = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "planoaula", label: "Plano de Aula", desc: "Elaboração e submissão de planos BNCC", icon: PencilRuler, color: "bg-amber/10 text-amber" },
    { key: "diario", label: "Diário de Classe", desc: "Registro diário de conteúdos programáticos", icon: NotebookPen, color: "bg-moss/10 text-moss" },
    { key: "chamada", label: "Chamada & Frequência", desc: "Chamada diária e alertas de falta", icon: ClipboardCheck, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "notas", label: "Notas & Avaliações", desc: "Fechamento de boletins e avaliações", icon: BookMarked, color: "bg-rose-500/10 text-rose-500" },
    { key: "atividades", label: "Atividades", desc: "Criação, entrega e feedback de tarefas", icon: ClipboardList, color: "bg-sky-500/10 text-sky-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "planoaula":
        return <PlanoAula onBack={() => setTab("hub")} />;
      case "diario":
        return <Diario onBack={() => setTab("hub")} />;
      case "chamada":
        return <Chamada onBack={() => setTab("hub")} />;
      case "notas":
        return <Notas onBack={() => setTab("hub")} />;
      case "atividades":
        return <Atividades onBack={() => setTab("hub")} />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {cards.map((c) => (
              <button
                key={c.key}
                onClick={() => setTab(c.key)}
                className="bg-cream border border-ink/10 rounded-2xl p-6 text-left hover:border-amber hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[160px]"
              >
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-ink group-hover:text-amber transition-colors">{c.label}</h3>
                  <p className="font-body text-xs mt-1 leading-tight" style={{ color: "var(--ink-2)" }}>{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );
    }
  };

  return renderContent();
};

const ModuleHeader = ({ title, icon: Icon, onBack }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/5">
    <button 
      onClick={onBack}
      className="p-2 hover:bg-cream-2 rounded-full text-ink-2 hover:text-ink transition-colors flex items-center justify-center"
      title="Voltar para o Pedagógico"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. PLANO DE AULA ---
// --- 1. PLANO DE AULA ---
const PlanoAula = ({ onBack }) => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/lessons/planos`, authHeader());
      setPlanos(res.data);
    } catch {
      toast.error("Erro ao carregar planos de aula.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAnalisar = async (id, status) => {
    try {
      await axios.patch(`${API}/lessons/planos/analisar/${id}`, { status }, authHeader());
      toast.success(status === "aprovado" ? "Plano de aula APROVADO!" : "Plano de aula retornado para ajustes.");
      load();
    } catch {
      toast.error("Erro ao analisar plano.");
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Planos de Aula (BNCC)" icon={PencilRuler} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-4">
        <h3 className="font-display font-bold text-lg text-ink">Planos de Aula Submetidos</h3>
        {loading ? (
          <p className="text-xs text-ink-2">Carregando planos...</p>
        ) : planos.length === 0 ? (
          <p className="text-xs text-ink-2 py-4">Nenhum plano de aula submetido até o momento.</p>
        ) : (
          <div className="space-y-3">
            {planos.map((p) => (
              <div key={p.id} className="p-4 bg-white rounded-xl border border-ink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={p.status === "aprovado" ? "bg-moss/10 text-moss" : p.status === "ajustar" ? "bg-red-500/10 text-red-500" : "bg-amber/15 text-amber"}>
                      {p.status}
                    </Badge>
                    {p.turma && <Badge variant="outline" className="text-[10px] font-body">{p.turma.nome}</Badge>}
                  </div>
                  <h4 className="font-display font-bold text-base text-ink">{p.titulo}</h4>
                  <p className="font-body text-xs text-ink-2 mt-1 max-w-xl">
                    <strong>Docente:</strong> {p.professor?.user?.name || "Professor"} <br />
                    {p.conteudo}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleAnalisar(p.id, "aprovado")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Aprovar
                  </button>
                  <button 
                    onClick={() => handleAnalisar(p.id, "ajustar")}
                    className="bg-amber hover:bg-amber-dark text-dark px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Ajustar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. DIÁRIO DE CLASSE ---
const Diario = ({ onBack }) => {
  const [dataDiario, setDataDiario] = useState(new Date().toISOString().slice(0, 10));
  const [conteudo, setConteudo] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    axios.get(`${API}/gestao/turmas`, authHeader()).then(r => {
      setTurmas(r.data);
      if (r.data.length > 0) setTurmaId(r.data[0].id);
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Conteúdo do Diário de Classe salvo!");
    setConteudo("");
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Diário de Classe Digital" icon={NotebookPen} onBack={onBack} />
      <form onSubmit={handleSave} className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-4 max-w-2xl">
        <h3 className="font-display font-bold text-lg text-ink">Registro de Conteúdo Programático</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink-2 block mb-1">Turma</label>
            <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} - {t.turno}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ink-2 block mb-1">Data da Aula</label>
            <Input type="date" value={dataDiario} onChange={(e) => setDataDiario(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-ink-2 block mb-1">Conteúdo Ministrado e Tarefas</label>
          <textarea 
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Descreva o conteúdo pedagógico trabalhado nesta aula..."
            className="w-full h-28 rounded-md border border-input bg-background p-3 text-sm font-body focus:outline-none"
            required
          />
        </div>
        <button type="submit" className="bg-dark text-cream font-body font-semibold px-6 py-3 rounded-full hover:bg-amber hover:text-dark transition-colors">
          Salvar Registro no Diário
        </button>
      </form>
    </div>
  );
};

// --- 3. CHAMADA / FREQUÊNCIA ---
const Chamada = ({ onBack }) => {
  const [turmas, setTurmas] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});

  useEffect(() => {
    axios.get(`${API}/gestao/turmas`, authHeader()).then(r => {
      setTurmas(r.data);
      if (r.data.length > 0) setSelectedClass(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    axios.get(`${API}/teachers/alunos?turmaId=${selectedClass}`, authHeader()).then(r => {
      setAlunos(r.data);
      const init = {};
      r.data.forEach(a => { init[a.id] = true; });
      setPresencas(init);
    });
  }, [selectedClass]);

  const handleSaveChamada = async () => {
    try {
      const list = Object.keys(presencas).map(id => ({ alunoId: id, presente: presencas[id] }));
      await axios.post(`${API}/teachers/chamada`, {
        data: new Date().toISOString(),
        turmaId: selectedClass,
        presencas: list
      }, authHeader());
      toast.success("Pauta de presença salva com sucesso!");
    } catch {
      toast.error("Erro ao registrar presença.");
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Chamada & Frequência Diária" icon={ClipboardCheck} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-6 max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Registro de Presença</h3>
            <p className="text-xs text-ink-2">Marque os alunos presentes na aula de hoje.</p>
          </div>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
            {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>)}
          </select>
        </div>

        <div className="space-y-2">
          {alunos.map(a => (
            <label key={a.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-ink/5 cursor-pointer hover:bg-cream-2/50 transition-colors select-none">
              <span className="text-sm font-semibold text-ink">{a.user?.name || a.name}</span>
              <input 
                type="checkbox" 
                checked={!!presencas[a.id]}
                onChange={(e) => setPresencas({ ...presencas, [a.id]: e.target.checked })}
                className="w-5 h-5 accent-amber rounded cursor-pointer"
              />
            </label>
          ))}
          {alunos.length === 0 && <p className="text-xs text-ink-2 py-4 text-center">Nenhum aluno nesta turma.</p>}
        </div>

        {alunos.length > 0 && (
          <button onClick={handleSaveChamada} className="w-full bg-dark text-cream font-body font-bold py-3 rounded-full hover:bg-amber hover:text-dark transition-colors">
            Confirmar e Salvar Chamada
          </button>
        )}
      </div>
    </div>
  );
};

// --- 4. NOTAS & AVALIAÇÕES ---
const Notas = ({ onBack }) => {
  const [turmas, setTurmas] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [segmento, setSegmento] = useState("fundamental_ii"); // infantil, fundamental_i_conceitual, fundamental_ii
  const [alunos, setAlunos] = useState([]);
  const [notasValores, setNotasValores] = useState({});

  useEffect(() => {
    axios.get(`${API}/gestao/turmas`, authHeader()).then(r => {
      setTurmas(r.data);
      if (r.data.length > 0) setSelectedClass(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    axios.get(`${API}/teachers/alunos?turmaId=${selectedClass}`, authHeader()).then(r => {
      setAlunos(r.data);
      const init = {};
      r.data.forEach(a => {
        const noteEval = a.notas?.find(n => n.p1 !== null)?.p1 || "";
        const noteWork = a.notas?.find(n => n.trabalho !== null)?.trabalho || "";
        init[a.id] = { avaliacao: noteEval.toString(), trabalho: noteWork.toString(), conceito: "MB", parecer: "" };
      });
      setNotasValores(init);
    });
  }, [selectedClass]);

  const handleSaveNotas = async () => {
    try {
      await Promise.all(
        Object.keys(notasValores).map(async (alunoId) => {
          const obj = notasValores[alunoId];
          const promises = [];
          if (segmento === "fundamental_ii") {
            if (obj.avaliacao !== "") {
              promises.push(axios.post(`${API}/teachers/notas`, { alunoId, disciplina: "Geral", valor: parseFloat(obj.avaliacao), tipo: "avaliacao" }, authHeader()));
            }
            if (obj.trabalho !== "") {
              promises.push(axios.post(`${API}/teachers/notas`, { alunoId, disciplina: "Geral", valor: parseFloat(obj.trabalho), tipo: "trabalho" }, authHeader()));
            }
          } else {
            // Conceito / Parecer Infantil ou Fund 1
            promises.push(axios.post(`${API}/teachers/notas`, { alunoId, disciplina: "Geral", valor: obj.conceito === "MB" ? 10 : obj.conceito === "B" ? 8 : obj.conceito === "R" ? 6 : 4, tipo: "conceito" }, authHeader()));
          }
          return Promise.all(promises);
        })
      );
      toast.success("Avaliações e Boletins atualizados com sucesso!");
    } catch {
      toast.error("Erro ao salvar avaliações.");
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Lançamento de Notas & Avaliações BNCC" icon={BookMarked} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 p-6 space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/5 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Matriz de Avaliação Escolar</h3>
            <p className="text-xs text-ink-2">Suporte pedagógico do Berçário ao 9º Ano do Ensino Fundamental.</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)} 
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-body focus:outline-none"
            >
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>)}
            </select>
            <select 
              value={segmento} 
              onChange={(e) => setSegmento(e.target.value)} 
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-body font-bold text-amber focus:outline-none"
            >
              <option value="infantil">Educação Infantil (Berçário - Pré II) · Parecer</option>
              <option value="fundamental_i_conceitual">Fundamental I (1º/2º Ano) · Conceitos</option>
              <option value="fundamental_ii">Fundamental (3º ao 9º Ano) · Notas 0-10</option>
            </select>
          </div>
        </div>

        {/* Tabela de Alunos */}
        <div className="space-y-3">
          {alunos.map((a) => {
            const val = notasValores[a.id] || { avaliacao: "", trabalho: "", conceito: "MB", parecer: "" };
            const media = (parseFloat(val.avaliacao || 0) + parseFloat(val.trabalho || 0)) / 2;
            const necessitaRecuperacao = segmento === "fundamental_ii" && media > 0 && media < 6.0;

            return (
              <div key={a.id} className="p-4 bg-white rounded-xl border border-ink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-sm text-ink">{a.user?.name}</h4>
                  <p className="text-[11px] text-ink-2">Matrícula: {a.matricula || "—"}</p>
                  {necessitaRecuperacao && (
                    <Badge className="bg-red-500/10 text-red-600 mt-1 font-body text-[10px]">
                      ⚠️ Necessita Recuperação Paralela (Média: {media.toFixed(1)})
                    </Badge>
                  )}
                </div>

                {segmento === "fundamental_ii" ? (
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-ink-3 block">Prova (0-10)</label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={val.avaliacao}
                        onChange={(e) => setNotasValores({ ...notasValores, [a.id]: { ...val, avaliacao: e.target.value } })}
                        className="w-20 h-9 text-xs font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-3 block">Trabalho (0-10)</label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={val.trabalho}
                        onChange={(e) => setNotasValores({ ...notasValores, [a.id]: { ...val, trabalho: e.target.value } })}
                        className="w-20 h-9 text-xs font-bold text-center"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-48">
                      <label className="text-[10px] font-bold text-ink-3 block">Conceito BNCC</label>
                      <select
                        value={val.conceito}
                        onChange={(e) => setNotasValores({ ...notasValores, [a.id]: { ...val, conceito: e.target.value } })}
                        className="w-full h-9 rounded-md border border-input bg-background px-2 text-xs font-bold"
                      >
                        {segmento === "infantil" ? (
                          <>
                            <option value="MB">Conquistado (Avançado)</option>
                            <option value="B">Em Desenvolvimento</option>
                            <option value="R">Aprimorando</option>
                          </>
                        ) : (
                          <>
                            <option value="MB">MB - Muito Bom</option>
                            <option value="B">B - Bom</option>
                            <option value="R">R - Regular</option>
                            <option value="I">I - Insuficiente</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {alunos.length === 0 && <p className="text-xs text-ink-2 py-4 text-center">Nenhum aluno cadastrado nesta turma.</p>}
        </div>

        {alunos.length > 0 && (
          <button onClick={handleSaveNotas} className="w-full bg-dark text-cream font-body font-bold py-3 rounded-full hover:bg-amber hover:text-dark transition-colors shadow-sm">
            Salvar e Atualizar Boletins
          </button>
        )}
      </div>
    </div>
  );
};

// --- 5. ATIVIDADES ---
const Atividades = ({ onBack }) => {
  const [atividades, setAtividades] = useState([
    { id: "1", titulo: "Pesquisa sobre Animais Vertebrados", turma: "4º Ano A", entrega: "28/07/2026", status: "Ativo" },
    { id: "2", titulo: "Exercícios de Frações", turma: "5º Ano B", entrega: "30/07/2026", status: "Ativo" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: "", turma: "4º Ano A", entrega: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.entrega) return;
    setAtividades(prev => [{ id: Date.now().toString(), ...form, status: "Ativo" }, ...prev]);
    toast.success("Atividade criada com sucesso!");
    setOpen(false);
    setForm({ titulo: "", turma: "4º Ano A", entrega: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Atividades & Tarefas" icon={ClipboardList} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors">
          + Criar Atividade
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Nova Tarefa Escolar</h4>
          <Input placeholder="Título da Atividade *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          <Input type="date" value={form.entrega} onChange={(e) => setForm({ ...form, entrega: e.target.value })} required />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Salvar</button>
          </div>
        </form>
      )}

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Atividade</th>
              <th className="p-4 font-semibold">Turma</th>
              <th className="p-4 font-semibold">Data Limite</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((a) => (
              <tr key={a.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{a.titulo}</td>
                <td className="p-4 text-ink-2">{a.turma}</td>
                <td className="p-4 text-ink-2">{a.entrega}</td>
                <td className="p-4">
                  <Badge className="bg-moss/10 text-moss">{a.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
