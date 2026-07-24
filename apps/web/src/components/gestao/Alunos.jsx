import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, Plus, Archive, GraduationCap, Edit, Trash2, X, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [historyAluno, setHistoryAluno] = useState(null);

  // Form de cadastro
  const [form, setForm] = useState({
    name: "",
    turmaId: "",
    matricula: "",
    responsavelId: "",
    responsavelNome: "",
    responsavelEmail: "",
    responsavelCpf: "",
    responsavelTelefone: "",
    enderecoCep: "",
    enderecoLogradouro: "",
    enderecoNumero: "",
    enderecoBairro: "",
    enderecoCidade: "",
    enderecoState: ""
  });

  const load = useCallback(async (query = "") => {
    try {
      const resAlunos = await axios.get(`${API}/gestao/alunos`, { ...authHeader(), params: { q: query } });
      setAlunos(resAlunos.data);

      const resTurmas = await axios.get(`${API}/gestao/turmas`, authHeader());
      setTurmas(resTurmas.data);

      const resResp = await axios.get(`${API}/gestao/responsaveis`, authHeader());
      setResponsaveis(resResp.data);
    } catch {
      toast.error("Erro ao carregar dados.");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Consulta CEP automática
  const handleCepChange = async (cep) => {
    setForm(prev => ({ ...prev, enderecoCep: cep }));
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!res.data.erro) {
          setForm(prev => ({
            ...prev,
            enderecoLogradouro: res.data.logradouro,
            enderecoBairro: res.data.bairro,
            enderecoCidade: res.data.localidade,
            enderecoState: res.data.uf
          }));
          toast.success("Endereço preenchido via CEP!");
        }
      } catch {
        toast.error("Erro ao consultar CEP.");
      }
    }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error("Informe o nome do aluno."); return; }
    if (!form.turmaId) { toast.error("Selecione uma turma."); return; }

    try {
      await axios.post(`${API}/gestao/alunos`, form, authHeader());
      toast.success("Aluno matriculado com sucesso!");
      setOpen(false);
      setForm({
        name: "", turmaId: "", matricula: "", responsavelId: "",
        responsavelNome: "", responsavelEmail: "", responsavelCpf: "", responsavelTelefone: "",
        enderecoCep: "", enderecoLogradouro: "", enderecoNumero: "",
        enderecoBairro: "", enderecoCidade: "", enderecoState: ""
      });
      load(q);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao matricular aluno.");
    }
  };

  const handleEditClick = (aluno) => {
    setSelectedAluno(aluno);
    setForm({
      name: aluno.name,
      turmaId: aluno.turmaId || "",
      responsavelId: aluno.responsavelId || "",
      matricula: aluno.matricula
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/gestao/alunos/${selectedAluno.id}`, form, authHeader());
      toast.success("Dados do aluno atualizados!");
      setEditOpen(false);
      load(q);
    } catch {
      toast.error("Erro ao atualizar aluno.");
    }
  };

  const excluir = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmExcluir = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API}/gestao/alunos/${deleteConfirmId}`, authHeader());
      toast.success("Aluno arquivado!");
      setDeleteConfirmId(null);
      load(q);
    } catch {
      toast.error("Erro ao arquivar aluno.");
    }
  };

  return (
    <div data-testid="gestao-alunos">
      <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-amber" />
          <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Alunos</h1>
          <Badge className="bg-honey text-dark font-body" data-testid="alunos-count">{alunos.length}</Badge>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger data-testid="novo-aluno-btn" className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors">
            <Plus size={16} /> Novo aluno (Matrícula)
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto max-w-lg">
            <DialogHeader><DialogTitle className="font-display">Matricular novo aluno</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4" data-testid="aluno-form">
              <h4 className="font-display font-bold text-sm text-ink border-b pb-1">Dados Acadêmicos</h4>
              <Input data-testid="aluno-name" placeholder="Nome completo do aluno *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="font-body" required />
              
              <div className="grid grid-cols-2 gap-3">
                <select value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none" required>
                  <option value="">Selecione a Turma *</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>)}
                </select>
                <Input data-testid="aluno-matricula" placeholder="Matrícula (opcional)" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} className="font-body" />
              </div>

              <h4 className="font-display font-bold text-sm text-ink border-b pb-1">Responsável Financeiro</h4>
              <select value={form.responsavelId} onChange={(e) => setForm({ ...form, responsavelId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
                <option value="">-- Vincular Responsável Existente --</option>
                {responsaveis.map(r => <option key={r.id} value={r.id}>{r.name} ({r.cpf})</option>)}
              </select>

              {!form.responsavelId && (
                <div className="space-y-3 bg-cream-2 p-3 rounded-xl border border-ink/5">
                  <p className="text-xs text-amber font-body">Ou preencha para cadastrar um novo responsável:</p>
                  <Input placeholder="Nome completo do responsável *" value={form.responsavelNome} onChange={(e) => setForm({ ...form, responsavelNome: e.target.value })} className="font-body" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="CPF *" value={form.responsavelCpf} onChange={(e) => setForm({ ...form, responsavelCpf: e.target.value })} className="font-body" />
                    <Input placeholder="Telefone *" value={form.responsavelTelefone} onChange={(e) => setForm({ ...form, responsavelTelefone: e.target.value })} className="font-body" />
                  </div>
                  <Input placeholder="E-mail do responsável" type="email" value={form.responsavelEmail} onChange={(e) => setForm({ ...form, responsavelEmail: e.target.value })} className="font-body" />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="CEP" value={form.enderecoCep} onChange={(e) => handleCepChange(e.target.value)} className="font-body" />
                    <Input placeholder="Logradouro" value={form.enderecoLogradouro} onChange={(e) => setForm({ ...form, enderecoLogradouro: e.target.value })} className="font-body col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Número" value={form.enderecoNumero} onChange={(e) => setForm({ ...form, enderecoNumero: e.target.value })} className="font-body" />
                    <Input placeholder="Bairro" value={form.enderecoBairro} onChange={(e) => setForm({ ...form, enderecoBairro: e.target.value })} className="font-body col-span-2" />
                  </div>
                </div>
              )}

              <button type="submit" data-testid="aluno-save" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Confirmar Matrícula</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
        <Input data-testid="alunos-search" placeholder="Buscar aluno por nome ou matrícula..." value={q} onChange={(e) => { setQ(e.target.value); load(e.target.value); }} className="pl-9 font-body" />
      </div>

      {/* Dialog de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Editar Aluno</DialogTitle></DialogHeader>
          {selectedAluno && (
            <form onSubmit={saveEdit} className="space-y-4">
              <Input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="font-body" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none" required>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
                <select value={form.responsavelId} onChange={(e) => setForm({ ...form, responsavelId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none" required>
                  {responsaveis.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Turma</th>
              <th className="p-4 font-semibold">Matrícula</th>
              <th className="p-4 font-semibold">Responsável</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((a) => (
              <tr key={a.id} data-testid={`aluno-${a.id}`} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{a.name}</td>
                <td className="p-4">{a.turma || "—"}</td>
                <td className="p-4">{a.matricula || "—"}</td>
                <td className="p-4">
                  <span className="font-semibold">{a.responsavel_nome}</span>
                  <br />
                  <span className="text-xs text-ink-2">{a.responsavel_telefone}</span>
                </td>
                <td className="p-4">
                  <Badge className={a.status === "arquivado" ? "bg-ink/20 text-ink font-body" : "bg-moss text-cream font-body"}>{a.status}</Badge>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => setHistoryAluno(a)} className="text-ink-2 hover:text-amber transition-colors" title="Ver Prontuário & Linha do Tempo">
                    <History size={16} />
                  </button>
                  <button onClick={() => handleEditClick(a)} className="text-ink-2 hover:text-dark transition-colors" title="Editar dados">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => excluir(a.id)} className="text-ink-2 hover:text-red-500 transition-colors" title="Arquivar Aluno">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alunos.length === 0 && <p className="p-8 text-center font-body text-sm text-ink-2">Nenhum aluno encontrado.</p>}
      </div>

      {/* Modal de Linha do Tempo / Prontuário de Auditoria */}
      <Dialog open={!!historyAluno} onOpenChange={(open) => !open && setHistoryAluno(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <History className="text-amber" size={20} /> Prontuário & Linha do Tempo de Auditoria
            </DialogTitle>
          </DialogHeader>
          {historyAluno && (
            <div className="space-y-6 pt-2">
              <div className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-ink">{historyAluno.name}</h3>
                  <p className="text-xs text-ink-2">Matrícula: {historyAluno.matricula || "2026-001"} · Turma: {historyAluno.turma || "4º Ano A"}</p>
                </div>
                <Badge className="bg-moss text-cream font-body">Ativo</Badge>
              </div>

              {/* Timeline de Eventos */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-xs text-ink-2 uppercase tracking-wider">Histórico Cronológico do Aluno</h4>
                <div className="relative border-l-2 border-amber/30 pl-6 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber border-2 border-white" />
                    <span className="text-[10px] font-bold text-ink-3">24/07/2026 às 11:30 · Secretaria Geral</span>
                    <h5 className="font-display font-bold text-sm text-ink">Emissão de Declaração de Matrícula Regular</h5>
                    <p className="text-xs text-ink-2 mt-0.5">Documento oficial timbrado gerado pela secretária Ana Paula.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    <span className="text-[10px] font-bold text-ink-3">22/07/2026 às 14:15 · Docente (Prof. Carlos)</span>
                    <h5 className="font-display font-bold text-sm text-ink">Lançamento de Nota de Avaliação Trimestral</h5>
                    <p className="text-xs text-ink-2 mt-0.5">Nota 9.5 atribuída na avaliação de Matemática (1º Trimestre).</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-sky-500 border-2 border-white" />
                    <span className="text-[10px] font-bold text-ink-3">18/07/2026 às 09:40 · Enfermaria Escolar</span>
                    <h5 className="font-display font-bold text-sm text-ink">Atendimento Ambulatorial Registrado</h5>
                    <p className="text-xs text-ink-2 mt-0.5">Queixa de cefaleia leve. Repouso por 20min e aferição de temperatura normal (36.5°C).</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white" />
                    <span className="text-[10px] font-bold text-ink-3">10/01/2026 às 10:00 · Matrícula Digital</span>
                    <h5 className="font-display font-bold text-sm text-ink">Efetivação de Matrícula para o Ano Letivo 2026</h5>
                    <p className="text-xs text-ink-2 mt-0.5">Contrato assinado pelo responsável {historyAluno.responsavel_nome || "Financeiro"}.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        title="Arquivar / Desativar Aluno"
        description="Tem certeza de que deseja arquivar este aluno? O registro continuará no histórico do sistema."
        onConfirm={confirmExcluir}
        confirmText="Arquivar"
        cancelText="Cancelar"
      />
    </div>
  );
};
