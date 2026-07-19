import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, Plus, Archive, GraduationCap, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", turma: "", matricula: "", responsavel_nome: "", responsavel_email: "" });

  const load = useCallback(async (query = "") => {
    const { data } = await axios.get(`${API}/gestao/alunos`, { ...authHeader(), params: { q: query } });
    setAlunos(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error("Informe o nome do aluno."); return; }
    try {
      await axios.post(`${API}/gestao/alunos`, form, authHeader());
      toast.success("Aluno cadastrado!");
      setOpen(false);
      setForm({ name: "", turma: "", matricula: "", responsavel_nome: "", responsavel_email: "" });
      load(q);
    } catch { toast.error("Erro ao cadastrar."); }
  };

  const arquivar = async (a) => {
    const status = a.status === "arquivada" ? "ativa" : "arquivada";
    setAlunos((ls) => ls.map((x) => (x.id === a.id ? { ...x, status } : x)));
    try { await axios.patch(`${API}/gestao/alunos/${a.id}`, { status }, authHeader()); toast.success(status === "arquivada" ? "Aluno arquivado" : "Aluno reativado"); }
    catch { toast.error("Erro ao atualizar."); }
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
            <Plus size={16} /> Novo aluno
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Cadastrar aluno</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4" data-testid="aluno-form">
              <Input data-testid="aluno-name" placeholder="Nome do aluno *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="font-body" />
              <div className="grid grid-cols-2 gap-3">
                <Input data-testid="aluno-turma" placeholder="Turma" value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} className="font-body" />
                <Input data-testid="aluno-matricula" placeholder="Matrícula" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} className="font-body" />
              </div>
              <Input placeholder="Responsável" value={form.responsavel_nome} onChange={(e) => setForm({ ...form, responsavel_nome: e.target.value })} className="font-body" />
              <Input placeholder="E-mail do responsável" value={form.responsavel_email} onChange={(e) => setForm({ ...form, responsavel_email: e.target.value })} className="font-body" />
              <button type="submit" data-testid="aluno-save" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
        <Input data-testid="alunos-search" placeholder="Buscar aluno..." value={q} onChange={(e) => { setQ(e.target.value); load(e.target.value); }} className="pl-9 font-body" />
      </div>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Turma</th>
              <th className="p-4 font-semibold">Matrícula</th>
              <th className="p-4 font-semibold">Responsável</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((a) => (
              <tr key={a.id} data-testid={`aluno-${a.id}`} className="border-t border-ink/5">
                <td className="p-4 font-semibold text-ink">{a.name}</td>
                <td className="p-4">{a.turma || "—"}</td>
                <td className="p-4">{a.matricula || "—"}</td>
                <td className="p-4">{a.responsavel_nome || "—"}</td>
                <td className="p-4">
                  <Badge className={a.status === "arquivada" ? "bg-ink/20 text-ink font-body" : "bg-moss text-cream font-body"}>{a.status}</Badge>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => arquivar(a)} data-testid={`arquivar-${a.id}`} className="text-ink-2 hover:text-amber transition-colors" title="Arquivar / reativar">
                    {a.status === "arquivada" ? <X size={16} /> : <Archive size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alunos.length === 0 && <p className="p-8 text-center font-body text-sm text-ink-2">Nenhum aluno encontrado.</p>}
      </div>
    </div>
  );
};
