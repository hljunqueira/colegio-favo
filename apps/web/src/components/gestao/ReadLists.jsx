import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Wallet, Users, ShieldCheck, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const Financeiro = () => {
  const [rows, setRows] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFin, setSelectedFin] = useState(null);
  const [f, setF] = useState({ aluno: "", ref: "", vencimento: "", valor: 0, status: "aberto" });

  const load = () => axios.get(`${API}/gestao/financeiro`, authHeader()).then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const handleEditClick = (row) => {
    setSelectedFin(row);
    setF({
      aluno: row.aluno,
      ref: row.ref,
      vencimento: row.vencimento,
      valor: row.valor,
      status: row.status
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/gestao/financeiro/${selectedFin.id}`, f, authHeader());
      toast.success("Lançamento atualizado!");
      setEditOpen(false);
      load();
    } catch {
      toast.error("Erro ao atualizar lançamento.");
    }
  };

  const deleteFin = async (id) => {
    if (!confirm("Deseja realmente remover esta mensalidade?")) return;
    try {
      await axios.delete(`${API}/gestao/financeiro/${id}`, authHeader());
      toast.success("Mensalidade removida!");
      load();
    } catch {
      toast.error("Erro ao remover.");
    }
  };

  const total = rows.reduce((a, c) => a + (c.valor || 0), 0);
  const aberto = rows.filter((r) => r.status === "aberto").reduce((a, c) => a + c.valor, 0);

  return (
    <div data-testid="gestao-financeiro">
      <div className="flex items-center gap-3 mb-6"><Wallet className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Mensalidades</h1></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-cream border border-ink/10 p-5"><p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--ink-2)" }}>Total lançado</p><p className="font-display font-extrabold text-2xl text-ink">{brl(total)}</p></div>
        <div className="rounded-2xl bg-dark p-5"><p className="font-body text-xs uppercase tracking-widest text-honey">Em aberto</p><p className="font-display font-extrabold text-2xl text-cream">{brl(aberto)}</p></div>
        <div className="rounded-2xl bg-cream border border-ink/10 p-5"><p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--ink-2)" }}>Lançamentos</p><p className="font-display font-extrabold text-2xl text-ink">{rows.length}</p></div>
      </div>

      {/* Dialog Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Editar mensalidade</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <Input placeholder="Aluno" value={f.aluno} disabled className="font-body bg-cream-2" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Referência" value={f.ref} onChange={(e) => setF({ ...f, ref: e.target.value })} className="font-body" required />
              <Input placeholder="Vencimento" value={f.vencimento} onChange={(e) => setF({ ...f, vencimento: e.target.value })} className="font-body" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Valor" type="number" step="0.01" value={f.valor} onChange={(e) => setF({ ...f, valor: parseFloat(e.target.value) })} className="font-body" required />
              <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
                <option value="aberto">Em aberto</option>
                <option value="pago">Pago</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
            <th className="p-4 font-semibold">Aluno</th><th className="p-4 font-semibold">Referência</th><th className="p-4 font-semibold">Vencimento</th><th className="p-4 font-semibold text-right">Valor</th><th className="p-4 font-semibold">Status</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i} data-testid="financeiro-row" className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.aluno}</td>
                <td className="p-4">{r.ref}</td>
                <td className="p-4">{r.vencimento}</td>
                <td className="p-4 text-right font-semibold">{brl(r.valor)}</td>
                <td className="p-4">
                  <Badge className={r.status === "pago" ? "bg-emerald-600 text-white font-body" : "bg-amber text-cream font-body"}>{r.status === "pago" ? "Pago" : "Em aberto"}</Badge>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEditClick(r)} className="text-ink-2 hover:text-dark transition-colors" title="Editar">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteFin(r.id)} className="text-ink-2 hover:text-red-500 transition-colors" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Responsaveis = () => {
  const [rows, setRows] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedResp, setSelectedResp] = useState(null);
  const [f, setF] = useState({ name: "", email: "", cpf: "", telefone: "", enderecoCep: "", enderecoLogradouro: "", enderecoNumero: "", enderecoBairro: "", enderecoCidade: "", enderecoEstado: "" });

  const load = () => axios.get(`${API}/gestao/responsaveis`, authHeader()).then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const handleCepChange = async (cep) => {
    setF(prev => ({ ...prev, enderecoCep: cep }));
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!res.data.erro) {
          setF(prev => ({
            ...prev,
            enderecoLogradouro: res.data.logradouro,
            enderecoBairro: res.data.bairro,
            enderecoCidade: res.data.localidade,
            enderecoEstado: res.data.uf
          }));
          toast.success("Endereço preenchido!");
        }
      } catch {
        toast.error("Erro ao carregar CEP.");
      }
    }
  };

  const handleEditClick = (row) => {
    setSelectedResp(row);
    setF({
      name: row.name,
      email: row.email,
      cpf: row.cpf,
      telefone: row.telefone,
      enderecoCep: row.enderecoCep || "",
      enderecoLogradouro: row.enderecoLogradouro || "",
      enderecoNumero: row.enderecoNumero || "",
      enderecoBairro: row.enderecoBairro || "",
      enderecoCidade: row.enderecoCidade || "",
      enderecoEstado: row.enderecoEstado || ""
    });
    setEditOpen(editOpen => true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/gestao/responsaveis/${selectedResp.id}`, f, authHeader());
      toast.success("Responsável atualizado!");
      setEditOpen(false);
      load();
    } catch (err) {
      toast.error("Erro ao atualizar responsável.");
    }
  };

  const deleteResp = async (id) => {
    if (!confirm("Deseja realmente remover este responsável? Isso removerá o acesso dele.")) return;
    try {
      await axios.delete(`${API}/gestao/responsaveis/${id}`, authHeader());
      toast.success("Responsável removido!");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao remover responsável.");
    }
  };

  return (
    <div data-testid="gestao-responsaveis">
      <div className="flex items-center gap-3 mb-6"><Users className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Responsáveis</h1><Badge className="bg-honey text-dark font-body">{rows.length}</Badge></div>
      
      {/* Dialog Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-md">
          <DialogHeader><DialogTitle className="font-display">Editar responsável</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <Input placeholder="Nome completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="font-body" required />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="CPF *" value={f.cpf} onChange={(e) => setF({ ...f, cpf: e.target.value })} className="font-body" required />
              <Input placeholder="Telefone *" value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} className="font-body" required />
            </div>
            <Input placeholder="E-mail *" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="font-body" required />
            
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="CEP" value={f.enderecoCep} onChange={(e) => handleCepChange(e.target.value)} className="font-body" />
              <Input placeholder="Logradouro" value={f.enderecoLogradouro} onChange={(e) => setF({ ...f, enderecoLogradouro: e.target.value })} className="font-body col-span-2" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Número" value={f.enderecoNumero} onChange={(e) => setF({ ...f, enderecoNumero: e.target.value })} className="font-body" />
              <Input placeholder="Bairro" value={f.enderecoBairro} onChange={(e) => setF({ ...f, enderecoBairro: e.target.value })} className="font-body col-span-2" />
            </div>
            <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
            <th className="p-4 font-semibold">Nome</th><th className="p-4 font-semibold">CPF</th><th className="p-4 font-semibold">Contato</th><th className="p-4 font-semibold">Alunos Associados</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.name}</td>
                <td className="p-4">{r.cpf || "—"}</td>
                <td className="p-4">
                  <span>{r.email}</span>
                  <br />
                  <span className="text-xs text-ink-2">{r.telefone}</span>
                </td>
                <td className="p-4 text-amber font-semibold">{r.alunos || "Nenhum"}</td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEditClick(r)} className="text-ink-2 hover:text-dark transition-colors" title="Editar">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteResp(r.id)} className="text-ink-2 hover:text-red-500 transition-colors" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Usuarios = () => {
  const [rows, setRows] = useState([]);
  const load = () => axios.get(`${API}/gestao/usuarios`, authHeader()).then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const roleTranslations = {
    admin: "Administrador",
    diretoria: "Diretoria",
    coordinator: "Coordenador(a)",
    staff: "Funcionário(a)",
    teacher: "Professor(a)",
    student: "Aluno(a)",
    parent: "Responsável",
  };

  const translateRole = (role) => {
    if (!role) return "—";
    const cleanRole = role.toLowerCase();
    return roleTranslations[cleanRole] || role;
  };

  return (
    <div data-testid="gestao-usuarios">
      <div className="flex items-center gap-3 mb-6"><ShieldCheck className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Usuários do sistema</h1><Badge className="bg-honey text-dark font-body">{rows.length}</Badge></div>
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
            <th className="p-4 font-semibold">Nome</th><th className="p-4 font-semibold">Identificador (E-mail / Matrícula)</th><th className="p-4 font-semibold">Perfil</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-ink/5">
                <td className="p-4 text-ink font-semibold">{r.name}</td>
                <td className="p-4">{r.email || "—"}</td>
                <td className="p-4">
                  <Badge className={r.role === "ADMIN" || r.role === "DIRETORIA" ? "bg-moss text-cream font-body" : "bg-honey text-dark font-body"}>
                    {translateRole(r.role)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
