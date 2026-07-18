import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Users, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Turmas = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ nome: "", serie: "", turno: "Matutino", ano: "2025", professor: "" });

  const load = async () => setRows((await axios.get(`${API}/gestao/turmas`, authHeader())).data);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!f.nome) { toast.error("Informe o nome da turma."); return; }
    try { await axios.post(`${API}/gestao/turmas`, f, authHeader()); toast.success("Turma criada!"); setOpen(false); setF({ nome: "", serie: "", turno: "Matutino", ano: "2025", professor: "" }); load(); }
    catch { toast.error("Erro ao criar."); }
  };

  return (
    <div data-testid="gestao-turmas">
      <div className="flex items-center gap-3 justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-amber" />
          <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Turmas</h1>
          <Badge className="bg-honey text-dark font-body">{rows.length}</Badge>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger data-testid="nova-turma-btn" className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors"><Plus size={16} /> Nova turma</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Nova turma</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4" data-testid="turma-form">
              <Input data-testid="turma-nome" placeholder="Nome (ex: 4º ano) *" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} className="font-body" />
              <Input placeholder="Série / segmento" value={f.serie} onChange={(e) => setF({ ...f, serie: e.target.value })} className="font-body" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Turno" value={f.turno} onChange={(e) => setF({ ...f, turno: e.target.value })} className="font-body" />
                <Input placeholder="Ano" value={f.ano} onChange={(e) => setF({ ...f, ano: e.target.value })} className="font-body" />
              </div>
              <Input placeholder="Professor(a) regente" value={f.professor} onChange={(e) => setF({ ...f, professor: e.target.value })} className="font-body" />
              <button type="submit" data-testid="turma-save" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((t) => (
          <div key={t.id} data-testid={`turma-${t.id}`} className="bg-cream rounded-2xl border border-ink/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-lg text-ink">{t.nome}</h3>
              <Badge className="bg-honey text-dark font-body">{t.turno}</Badge>
            </div>
            <p className="font-body text-sm" style={{ color: "var(--ink-2)" }}>{t.serie} · {t.ano}</p>
            <p className="font-body text-sm text-amber mt-2">{t.professor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Professores = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", disciplina: "", telefone: "" });

  const load = async () => setRows((await axios.get(`${API}/gestao/professores`, authHeader())).data);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!f.name) { toast.error("Informe o nome."); return; }
    try { await axios.post(`${API}/gestao/professores`, f, authHeader()); toast.success("Professor cadastrado!"); setOpen(false); setF({ name: "", email: "", disciplina: "", telefone: "" }); load(); }
    catch { toast.error("Erro ao cadastrar."); }
  };

  return (
    <div data-testid="gestao-professores">
      <div className="flex items-center gap-3 justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserCog className="text-amber" />
          <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Professores</h1>
          <Badge className="bg-honey text-dark font-body">{rows.length}</Badge>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger data-testid="novo-professor-btn" className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors"><Plus size={16} /> Novo professor</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Novo professor</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4" data-testid="professor-form">
              <Input data-testid="professor-name" placeholder="Nome *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="font-body" />
              <Input placeholder="E-mail" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="font-body" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Disciplina" value={f.disciplina} onChange={(e) => setF({ ...f, disciplina: e.target.value })} className="font-body" />
                <Input placeholder="Telefone" value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} className="font-body" />
              </div>
              <button type="submit" data-testid="professor-save" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
            <th className="p-4 font-semibold">Nome</th><th className="p-4 font-semibold">Disciplina</th><th className="p-4 font-semibold">E-mail</th><th className="p-4 font-semibold">Telefone</th>
          </tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} data-testid={`professor-${p.id}`} className="border-t border-ink/5">
                <td className="p-4 font-semibold text-ink">{p.name}</td>
                <td className="p-4">{p.disciplina || "—"}</td>
                <td className="p-4">{p.email || "—"}</td>
                <td className="p-4">{p.telefone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
