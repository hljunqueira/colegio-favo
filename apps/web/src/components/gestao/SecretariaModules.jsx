import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Plus, UserCog, Layers, BookOpen, UserPlus, CalendarDays, Edit, Trash2, 
  Search, MapPin, ArrowLeft, FileBarChart, RefreshCw, ArrowLeftRight, Settings,
  CheckCircle2, AlertTriangle, FileText, Download, GraduationCap, Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";

// Importações dos componentes existentes na mesma pasta
import { Alunos } from "./Alunos";
import { Turmas, Professores } from "./CrudLists";
import { Responsaveis } from "./ReadLists";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// --- MAIN UNIFIED SECRETARIA COMPONENT ---
export const Secretaria = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "alunos", label: "Alunos", desc: "Listagem, busca e ficha cadastral de alunos", icon: GraduationCap, color: "bg-amber/10 text-amber" },
    { key: "responsaveis", label: "Responsáveis", desc: "Listagem de responsáveis e contatos", icon: Users, color: "bg-moss/10 text-moss" },
    { key: "turmas", label: "Turmas", desc: "Gerenciamento de turmas, turnos e regentes", icon: Users, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "professores", label: "Professores", icon: UserCog, desc: "Cadastro de docentes e disciplinas", color: "bg-rose-500/10 text-rose-500" },
    { key: "matriculas", label: "Matrícula Digital", desc: "Novas matrículas integradas ao ViaCEP", icon: UserPlus, color: "bg-sky-500/10 text-sky-500" },
    { key: "series", label: "Séries & Segmentos", desc: "Estrutura de anos e grade curricular", icon: Layers, color: "bg-emerald-500/10 text-emerald-500" },
    { key: "disciplinas", label: "Disciplinas", desc: "Carga horária e grade de matérias", icon: BookOpen, color: "bg-rose-500/10 text-rose-500" },
    { key: "rematriculas", label: "Rematrículas", desc: "Fluxo de rematrícula e reajustes", icon: RefreshCw, color: "bg-blue-500/10 text-blue-500" },
    { key: "transferencias", label: "Transferências", desc: "Transferências internas e declarações", icon: ArrowLeftRight, color: "bg-teal-500/10 text-teal-500" },
    { key: "calendario", label: "Calendário Acadêmico", desc: "Agenda institucional e dias letivos", icon: CalendarDays, color: "bg-orange-500/10 text-orange-500" },
    { key: "rel-sec", label: "Relatórios", desc: "Atas, históricos e declarações", icon: FileBarChart, color: "bg-dark/10 text-dark" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "alunos":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para a Secretaria</button>
            <Alunos />
          </div>
        );
      case "responsaveis":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para a Secretaria</button>
            <Responsaveis />
          </div>
        );
      case "turmas":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para a Secretaria</button>
            <Turmas />
          </div>
        );
      case "professores":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para a Secretaria</button>
            <Professores />
          </div>
        );
      case "funcionarios":
        return <Funcionarios onBack={() => setTab("hub")} />;
      case "series":
        return <Series onBack={() => setTab("hub")} />;
      case "disciplinas":
        return <Disciplinas onBack={() => setTab("hub")} />;
      case "matriculas":
        return <Matriculas onBack={() => setTab("hub")} />;
      case "rematriculas":
        return <Rematriculas onBack={() => setTab("hub")} />;
      case "transferencias":
        return <Transferencias onBack={() => setTab("hub")} />;
      case "calendario":
        return <Calendario onBack={() => setTab("hub")} />;
      case "rel-sec":
        return <RelSec onBack={() => setTab("hub")} />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
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
          </div>
        );
    }
  };

  return renderContent();
};

// --- Back Button Wrapper Component ---
const ModuleHeader = ({ title, icon: Icon, onBack }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/5">
    <button 
      onClick={onBack}
      className="p-2 hover:bg-cream-2 rounded-full text-ink-2 hover:text-ink transition-colors flex items-center justify-center"
      title="Voltar para a Secretaria"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. FUNCIONÁRIOS ---
const Funcionarios = ({ onBack }) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", setor: "secretaria" });

  const load = async () => {
    try {
      const res = await axios.get(`${API}/gestao/usuarios`, authHeader());
      setRows(res.data.filter(u => u.role.toLowerCase() === "staff" || u.role.toLowerCase() === "funcionario"));
    } catch {
      toast.error("Erro ao carregar funcionários.");
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email) { toast.error("Preencha os campos obrigatórios."); return; }
    try {
      await axios.post(`${API}/gestao/alunos`, {
        name: f.name,
        email: f.email,
        phone: f.phone,
        role: "STAFF"
      }, authHeader());
      toast.success("Funcionário cadastrado!");
      setOpen(false);
      setF({ name: "", email: "", phone: "", setor: "secretaria" });
      load();
    } catch {
      toast.error("Erro ao salvar funcionário.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Funcionários" icon={UserCog} onBack={onBack} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors">
            <Plus size={16} /> Novo Funcionário
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Novo Funcionário</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4">
              <Input placeholder="Nome Completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              <Input placeholder="E-mail Corporativo *" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
              <Input placeholder="Telefone / WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <select value={f.setor} onChange={(e) => setF({ ...f, setor: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
                <option value="secretaria">Secretaria</option>
                <option value="portaria">Portaria</option>
                <option value="enfermaria">Enfermaria / Saúde</option>
                <option value="ti">Tecnologia da Informação</option>
              </select>
              <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Identificador</th>
              <th className="p-4 font-semibold">Função</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.name}</td>
                <td className="p-4 text-ink-2">{r.email}</td>
                <td className="p-4">
                  <Badge className="bg-moss/10 text-moss capitalize font-body">{r.role.toLowerCase()}</Badge>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-ink-2">Nenhum funcionário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 2. SÉRIES ---
const Series = ({ onBack }) => {
  const [series, setSeries] = useState([
    { id: "1", nome: "Berçário", segmento: "Educação Infantil", turmas: "2" },
    { id: "2", nome: "Maternal I", segmento: "Educação Infantil", turmas: "1" },
    { id: "3", nome: "1º Ano", segmento: "Ensino Fundamental I", turmas: "2" },
    { id: "4", nome: "4º Ano", segmento: "Ensino Fundamental I", turmas: "1" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", segmento: "Ensino Fundamental I" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.nome) return;
    setSeries(prev => [{ id: Date.now().toString(), ...form, turmas: "0" }, ...prev]);
    toast.success("Série cadastrada com sucesso!");
    setOpen(false);
    setForm({ nome: "", segmento: "Ensino Fundamental I" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Séries & Segmentos" icon={Layers} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Nova Série
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Cadastrar Série / Ano Letivo</h4>
          <Input placeholder="Nome da Série (Ex: 5º Ano B) *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <select value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
            <option value="Educação Infantil">Educação Infantil</option>
            <option value="Ensino Fundamental I">Ensino Fundamental I</option>
            <option value="Ensino Fundamental II">Ensino Fundamental II</option>
            <option value="Ensino Médio">Ensino Médio</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Salvar Série</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {series.map(s => (
          <div key={s.id} className="bg-cream border border-ink/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-extrabold text-lg text-ink mb-1">{s.nome}</h3>
            <p className="font-body text-xs text-ink-2 mb-4">{s.segmento}</p>
            <div className="flex items-center justify-between text-xs font-body pt-3 border-t border-ink/5">
              <span className="text-ink-2">Turmas ativas:</span>
              <strong className="text-ink">{s.turmas}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. DISCIPLINAS ---
const Disciplinas = ({ onBack }) => {
  const [rows, setRows] = useState([
    { id: "1", nome: "Língua Portuguesa", area: "Linguagens", carga: "120h" },
    { id: "2", nome: "Matemática", area: "Ciências Exatas", carga: "120h" },
    { id: "3", nome: "Ciências", area: "Ciências Naturais", carga: "80h" },
    { id: "4", nome: "História", area: "Ciências Humanas", carga: "60h" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", area: "Linguagens", carga: "80h" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.nome) return;
    setRows(prev => [{ id: Date.now().toString(), ...form }, ...prev]);
    toast.success("Disciplina cadastrada!");
    setOpen(false);
    setForm({ nome: "", area: "Linguagens", carga: "80h" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Disciplinas & Matrizes Curriculares" icon={BookOpen} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Nova Disciplina
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Cadastrar Disciplina</h4>
          <Input placeholder="Nome da Disciplina (Ex: Robótica) *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Input placeholder="Área de Conhecimento" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          <Input placeholder="Carga Horária Anual (Ex: 80h)" value={form.carga} onChange={(e) => setForm({ ...form, carga: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Salvar Disciplina</button>
          </div>
        </form>
      )}

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Área de Conhecimento</th>
              <th className="p-4 font-semibold">Carga Horária Anual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.nome}</td>
                <td className="p-4 text-ink-2">{r.area}</td>
                <td className="p-4 text-ink-2">{r.carga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 4. MATRÍCULAS WIZARD (Com ViaCEP) ---
const Matriculas = ({ onBack }) => {
  const [f, setF] = useState({
    nome: "", email: "", phone: "", matricula: "", cpf: "",
    cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "",
    turmaId: ""
  });
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    axios.get(`${API}/gestao/turmas`, authHeader()).then(r => setTurmas(r.data));
  }, []);

  const handleCepBlur = async () => {
    const cleanCep = f.cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      toast.loading("Buscando endereço...");
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        toast.dismiss();
        if (res.data.erro) {
          toast.error("CEP não encontrado.");
        } else {
          setF(prev => ({
            ...prev,
            logradouro: res.data.logradouro,
            bairro: res.data.bairro,
            cidade: res.data.localidade,
            estado: res.data.uf
          }));
          toast.success("Endereço preenchido!");
        }
      } catch {
        toast.dismiss();
        toast.error("Erro ao buscar CEP.");
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.nome || !f.cpf || !f.turmaId) { toast.error("Preencha todos os campos obrigatórios."); return; }
    try {
      await axios.post(`${API}/gestao/alunos`, {
        name: f.nome,
        email: f.email,
        phone: f.phone,
        matricula: f.matricula || `MAT${Math.floor(1000 + Math.random() * 9000)}`,
        turmaId: f.turmaId,
        responsavel: {
          cpf: f.cpf,
          telefone: f.phone,
          enderecoLogradouro: f.logradouro,
          enderecoNumero: f.numero,
          enderecoBairro: f.bairro,
          enderecoCidade: f.cidade,
          enderecoEstado: f.estado,
          enderecoCep: f.cep
        }
      }, authHeader());
      toast.success("Matrícula automatizada concluída! Conta do Aluno e Responsável criadas.");
      setF({
        nome: "", email: "", phone: "", matricula: "", cpf: "",
        cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "",
        turmaId: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao efetuar matrícula.");
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Matrícula Digital" icon={UserPlus} onBack={onBack} />
      <form onSubmit={submit} className="bg-cream rounded-2xl border border-ink/10 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-ink mb-4 pb-2 border-b border-ink/5">1. Dados do Aluno</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input placeholder="Nome Completo *" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} required />
            <Input placeholder="E-mail" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <select value={f.turmaId} onChange={(e) => setF({ ...f, turmaId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none" required>
              <option value="">Selecione a Turma *</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome} - {t.turno}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-ink mb-4 pb-2 border-b border-ink/5">2. Dados do Responsável & Endereço</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input placeholder="CPF do Responsável *" value={f.cpf} onChange={(e) => setF({ ...f, cpf: e.target.value })} required />
            <Input placeholder="Telefone do Responsável *" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required />
            <div className="relative">
              <Input placeholder="CEP *" value={f.cep} onChange={(e) => setF({ ...f, cep: e.target.value })} onBlur={handleCepBlur} required />
              <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input placeholder="Rua / Logradouro *" value={f.logradouro} onChange={(e) => setF({ ...f, logradouro: e.target.value })} className="sm:col-span-2" required />
            <Input placeholder="Número *" value={f.numero} onChange={(e) => setF({ ...f, numero: e.target.value })} required />
            <Input placeholder="Bairro *" value={f.bairro} onChange={(e) => setF({ ...f, bairro: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input placeholder="Cidade *" value={f.cidade} onChange={(e) => setF({ ...f, cidade: e.target.value })} required />
            <Input placeholder="Estado (UF) *" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })} required />
          </div>
        </div>

        <button type="submit" className="w-full bg-dark text-cream py-3.5 rounded-full font-body font-bold hover:bg-amber hover:text-dark transition-colors shadow-sm">
          Confirmar e Efetivar Matrícula
        </button>
      </form>
    </div>
  );
};

// --- 5. REMATRÍCULAS ---
const Rematriculas = ({ onBack }) => {
  const [rematriculas, setRematriculas] = useState([
    { id: 1, aluno: "Pedro Aluno Teste", turma: "3º Ano", status: "Confirmado" },
    { id: 2, aluno: "Mariana Aluno Teste", turma: "4º Ano", status: "Pendente" },
    { id: 3, aluno: "Lucas Silva", turma: "2º Ano", status: "Pendente" }
  ]);

  const confirmRematricula = (id) => {
    setRematriculas(prev => prev.map(r => r.id === id ? { ...r, status: "Confirmado" } : r));
    toast.success("Rematrícula confirmada!");
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Rematrículas 2026" icon={RefreshCw} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Turma Atual</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rematriculas.map(r => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.aluno}</td>
                <td className="p-4 text-ink-2">{r.turma}</td>
                <td className="p-4">
                  <Badge className={r.status === "Confirmado" ? "bg-moss/10 text-moss" : "bg-honey/15 text-amber"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {r.status === "Pendente" && (
                    <button 
                      onClick={() => confirmRematricula(r.id)} 
                      className="bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                    >
                      Confirmar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 6. TRANSFERÊNCIAS ---
const Transferencias = ({ onBack }) => {
  const [requests, setRequests] = useState([
    { id: 1, aluno: "Juliana Santos", de: "4º Ano A (Matutino)", para: "4º Ano B (Vespertino)", status: "Pendente" },
    { id: 2, aluno: "Thiago Souza", de: "2º Ano B (Vespertino)", para: "2º Ano A (Matutino)", status: "Aprovado" }
  ]);

  const approve = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Aprovado" } : r));
    toast.success("Transferência aprovada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Solicitações de Transferência" icon={ArrowLeftRight} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Turma Origem</th>
              <th className="p-4 font-semibold">Turma Destino</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.aluno}</td>
                <td className="p-4 text-ink-2">{r.de}</td>
                <td className="p-4 text-ink-2">{r.para}</td>
                <td className="p-4">
                  <Badge className={r.status === "Aprovado" ? "bg-moss/10 text-moss" : "bg-honey/15 text-amber"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {r.status === "Pendente" && (
                    <button 
                      onClick={() => approve(r.id)} 
                      className="bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                    >
                      Aprovar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 7. CALENDÁRIO ---
const Calendario = ({ onBack }) => {
  const [events] = useState([
    { id: 1, date: "26/01/2026", title: "Volta às Aulas 2026", type: "Academico" },
    { id: 2, date: "12/02/2026", title: "Primeira Reunião de Pais & Mestres", type: "Reunião" },
    { id: 3, date: "02/03/2026", title: "Conselho de Classe Escolar", type: "Pedagógico" }
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader title="Calendário Escolar 2026" icon={CalendarDays} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Evento / Atividade</th>
              <th className="p-4 font-semibold">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{e.date}</td>
                <td className="p-4 text-ink-2 font-semibold">{e.title}</td>
                <td className="p-4">
                  <Badge className="bg-indigo-500/10 text-indigo-600 font-body">{e.type}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 8. RELATÓRIOS ---
const RelSec = ({ onBack }) => {
  const reports = [
    { name: "Alunos Matriculados - Consolidado", format: "PDF", size: "1.2 MB" },
    { name: "Listagem de Contatos & Leads Pendentes", format: "XLSX", size: "244 KB" },
    { name: "Boletins Consolidados do 1º Trimestre", format: "PDF", size: "4.5 MB" }
  ];

  const handleDownload = (name) => {
    toast.success(`Baixando relatório: ${name}`);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader title="Relatórios da Secretaria" icon={FileBarChart} onBack={onBack} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-cream border border-ink/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[140px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={18} className="text-amber" />
                <Badge className="bg-dark/10 text-dark font-body">{r.format}</Badge>
              </div>
              <h4 className="font-display font-bold text-sm text-ink leading-tight">{r.name}</h4>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-ink/5 mt-4">
              <span className="text-[10px] text-ink-3">{r.size}</span>
              <button 
                onClick={() => handleDownload(r.name)} 
                className="text-ink hover:text-amber transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Series, Disciplinas, Matriculas, Transferencias, Funcionarios, Calendario, RelSec as Relatorios };
