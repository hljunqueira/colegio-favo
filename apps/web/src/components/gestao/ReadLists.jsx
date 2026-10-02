import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Wallet, Users, ShieldCheck, Edit, Trash2, Plus, PlusCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { authHeader } from "@/lib/auth";

import { API } from "@/lib/api";
const brl = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const Financeiro = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal Edição
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFin, setSelectedFin] = useState(null);
  const [f, setF] = useState({ aluno: "", ref: "", vencimento: "", valor: 0, status: "aberto" });

  // Modal Criação
  const [createOpen, setCreateOpen] = useState(false);
  const [newFin, setNewFin] = useState({ aluno: "", ref: "", vencimento: "", valor: "", status: "aberto" });

  // Modal Exclusão
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [finToDelete, setFinToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    axios
      .get(`${API}/gestao/financeiro`, authHeader())
      .then((r) => setRows(r.data || []))
      .catch((err) => {
        console.error("Erro ao carregar financeiro:", err);
        toast.error("Erro ao carregar mensalidades.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditClick = (row) => {
    setSelectedFin(row);
    setF({
      aluno: row.aluno || "",
      ref: row.ref || "",
      vencimento: row.vencimento || "",
      valor: row.valor != null ? row.valor : 0,
      status: row.status || "aberto",
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedFin || !selectedFin.id) {
      toast.error("Nenhuma mensalidade selecionada.");
      return;
    }

    try {
      const payload = {
        aluno: f.aluno,
        ref: f.ref,
        vencimento: f.vencimento,
        valor: typeof f.valor === "number" ? f.valor : (parseFloat(f.valor) || 0),
        status: f.status,
      };

      await axios.patch(`${API}/gestao/financeiro/${selectedFin.id}`, payload, authHeader());
      toast.success("Lançamento atualizado com sucesso!");
      setEditOpen(false);
      setSelectedFin(null);
      load();
    } catch (err) {
      console.error("Erro ao atualizar lançamento:", err);
      toast.error(err.response?.data?.message || "Erro ao atualizar lançamento.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        aluno: newFin.aluno,
        ref: newFin.ref,
        vencimento: newFin.vencimento,
        valor: parseFloat(newFin.valor) || 0,
        status: newFin.status,
      };

      await axios.post(`${API}/gestao/financeiro`, payload, authHeader());
      toast.success("Nova mensalidade lançada com sucesso!");
      setCreateOpen(false);
      setNewFin({ aluno: "", ref: "", vencimento: "", valor: "", status: "aberto" });
      load();
    } catch (err) {
      console.error("Erro ao criar lançamento:", err);
      toast.error(err.response?.data?.message || "Erro ao lançar mensalidade.");
    }
  };

  const handleDeleteClick = (row) => {
    setFinToDelete(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!finToDelete || !finToDelete.id) return;
    try {
      await axios.delete(`${API}/gestao/financeiro/${finToDelete.id}`, authHeader());
      toast.success("Mensalidade removida com sucesso!");
      setDeleteOpen(false);
      setFinToDelete(null);
      load();
    } catch (err) {
      console.error("Erro ao remover mensalidade:", err);
      toast.error(err.response?.data?.message || "Erro ao remover mensalidade.");
    }
  };

  const total = rows.reduce((a, c) => a + (c.valor || 0), 0);
  const aberto = rows.filter((r) => r.status === "aberto").reduce((a, c) => a + (c.valor || 0), 0);

  return (
    <div data-testid="gestao-financeiro">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">
              Mensalidades
            </h1>
            <p className="text-xs text-ink-3">
              Gestão de cobranças, liquidações e histórico financeiro
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-amber hover:bg-honey text-dark px-4 py-2.5 rounded-full font-body text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={16} />
          Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-cream border border-ink/10 p-5">
          <p className="font-body text-xs uppercase tracking-widest text-ink-2 font-medium">
            Total lançado
          </p>
          <p className="font-display font-extrabold text-2xl text-ink mt-1">
            {brl(total)}
          </p>
        </div>
        <div className="rounded-2xl bg-dark p-5">
          <p className="font-body text-xs uppercase tracking-widest text-honey font-medium">
            Em aberto
          </p>
          <p className="font-display font-extrabold text-2xl text-cream mt-1">
            {brl(aberto)}
          </p>
        </div>
        <div className="rounded-2xl bg-cream border border-ink/10 p-5">
          <p className="font-body text-xs uppercase tracking-widest text-ink-2 font-medium">
            Lançamentos
          </p>
          <p className="font-display font-extrabold text-2xl text-ink mt-1">
            {rows.length}
          </p>
        </div>
      </div>

      {/* Dialog Criação */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink">
              Lançar Nova Mensalidade
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">Nome do Aluno *</label>
              <Input
                placeholder="Ex: Pedro Aluno Teste"
                value={newFin.aluno}
                onChange={(e) => setNewFin({ ...newFin, aluno: e.target.value })}
                className="font-body"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Mês de Referência *</label>
                <Input
                  placeholder="Ex: Outubro/2026"
                  value={newFin.ref}
                  onChange={(e) => setNewFin({ ...newFin, ref: e.target.value })}
                  className="font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Data de Vencimento *</label>
                <Input
                  placeholder="Ex: 10/10/2026"
                  value={newFin.vencimento}
                  onChange={(e) => setNewFin({ ...newFin, vencimento: e.target.value })}
                  className="font-body"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Valor (R$) *</label>
                <Input
                  placeholder="850.00"
                  type="number"
                  step="0.01"
                  value={newFin.valor}
                  onChange={(e) => setNewFin({ ...newFin, valor: e.target.value })}
                  className="font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Status</label>
                <select
                  value={newFin.status}
                  onChange={(e) => setNewFin({ ...newFin, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none"
                >
                  <option value="aberto">Em aberto</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 bg-cream-2 rounded-full font-body text-xs font-semibold text-ink-2 hover:bg-cream-3 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-dark text-cream rounded-full font-body text-xs font-semibold hover:bg-amber hover:text-dark transition-colors"
              >
                Efetivar Lançamento
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink">
              Editar Mensalidade
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">Aluno *</label>
              <Input
                placeholder="Aluno"
                value={f.aluno}
                onChange={(e) => setF({ ...f, aluno: e.target.value })}
                className="font-body"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Referência *</label>
                <Input
                  placeholder="Referência"
                  value={f.ref}
                  onChange={(e) => setF({ ...f, ref: e.target.value })}
                  className="font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Vencimento *</label>
                <Input
                  placeholder="Vencimento"
                  value={f.vencimento}
                  onChange={(e) => setF({ ...f, vencimento: e.target.value })}
                  className="font-body"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Valor (R$) *</label>
                <Input
                  placeholder="Valor"
                  type="number"
                  step="0.01"
                  value={f.valor}
                  onChange={(e) => setF({ ...f, valor: parseFloat(e.target.value) || 0 })}
                  className="font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Status</label>
                <select
                  value={f.status}
                  onChange={(e) => setF({ ...f, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none"
                >
                  <option value="aberto">Em aberto</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-cream-2 rounded-full font-body text-xs font-semibold text-ink-2 hover:bg-cream-3 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-dark text-cream rounded-full font-body text-xs font-semibold hover:bg-amber hover:text-dark transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmação de Exclusão */}
      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deseja realmente remover esta mensalidade?"
        description={
          finToDelete
            ? `Esta ação removerá permanentemente o lançamento de ${finToDelete.aluno} (Ref: ${finToDelete.ref} - ${brl(finToDelete.valor)}).`
            : "Esta ação removerá permanentemente este lançamento."
        }
        onConfirm={confirmDelete}
        confirmText="Confirmar Exclusão"
        cancelText="Voltar"
      />

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden shadow-2xs">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Referência</th>
              <th className="p-4 font-semibold">Vencimento</th>
              <th className="p-4 font-semibold text-right">Valor</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id || i}
                data-testid="financeiro-row"
                className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors"
              >
                <td className="p-4 font-semibold text-ink">{r.aluno}</td>
                <td className="p-4 text-ink-2">{r.ref}</td>
                <td className="p-4 text-ink-2">{r.vencimento}</td>
                <td className="p-4 text-right font-semibold text-ink">{brl(r.valor)}</td>
                <td className="p-4">
                  <Badge
                    className={
                      r.status === "pago"
                        ? "bg-emerald-600 text-white font-body px-2.5 py-0.5"
                        : "bg-amber text-cream font-body px-2.5 py-0.5"
                    }
                  >
                    {r.status === "pago" ? "Pago" : "Em aberto"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(r);
                      }}
                      className="p-1.5 rounded-lg text-ink-2 hover:text-ink hover:bg-black/5 transition-all"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(r);
                      }}
                      className="p-1.5 rounded-lg text-ink-2 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-3">
                  Nenhum lançamento financeiro encontrado.
                </td>
              </tr>
            )}
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [respToDelete, setRespToDelete] = useState(null);
  const [f, setF] = useState({ name: "", email: "", cpf: "", telefone: "", enderecoCep: "", enderecoLogradouro: "", enderecoNumero: "", enderecoBairro: "", enderecoCidade: "", enderecoEstado: "" });

  const load = () => axios.get(`${API}/gestao/responsaveis`, authHeader()).then((r) => setRows(r.data || []));
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
      name: row.name || "",
      email: row.email || "",
      cpf: row.cpf || "",
      telefone: row.telefone || "",
      enderecoCep: row.enderecoCep || "",
      enderecoLogradouro: row.enderecoLogradouro || "",
      enderecoNumero: row.enderecoNumero || "",
      enderecoBairro: row.enderecoBairro || "",
      enderecoCidade: row.enderecoCidade || "",
      enderecoEstado: row.enderecoEstado || ""
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedResp || !selectedResp.id) return;
    try {
      await axios.patch(`${API}/gestao/responsaveis/${selectedResp.id}`, f, authHeader());
      toast.success("Responsável atualizado com sucesso!");
      setEditOpen(false);
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao atualizar responsável.");
    }
  };

  const handleDeleteClick = (row) => {
    setRespToDelete(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!respToDelete || !respToDelete.id) return;
    try {
      await axios.delete(`${API}/gestao/responsaveis/${respToDelete.id}`, authHeader());
      toast.success("Responsável removido com sucesso!");
      setDeleteOpen(false);
      setRespToDelete(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao remover responsável.");
    }
  };

  return (
    <div data-testid="gestao-responsaveis">
      <div className="flex items-center gap-3 mb-6"><Users className="text-amber" /><h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">Responsáveis</h1><Badge className="bg-honey text-dark font-body">{rows.length}</Badge></div>
      
      {/* Dialog Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg font-bold text-ink">Editar responsável</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4 mt-2">
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
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 bg-cream-2 rounded-full font-body text-xs font-semibold text-ink-2 hover:bg-cream-3 transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2 bg-dark text-cream rounded-full font-body text-xs font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deseja realmente remover este responsável?"
        description={respToDelete ? `Esta ação removerá o acesso de ${respToDelete.name} ao portal escolar.` : "Esta ação removerá o acesso do responsável."}
        onConfirm={confirmDelete}
        confirmText="Confirmar Remoção"
        cancelText="Voltar"
      />

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden shadow-2xs">
        <table className="w-full font-body text-sm">
          <thead><tr className="bg-cream-2 text-left text-ink-2">
            <th className="p-4 font-semibold">Nome</th><th className="p-4 font-semibold">CPF</th><th className="p-4 font-semibold">Contato</th><th className="p-4 font-semibold">Alunos Associados</th><th className="p-4 text-right font-semibold">Ações</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.name}</td>
                <td className="p-4 text-ink-2">{r.cpf || "—"}</td>
                <td className="p-4">
                  <span className="text-ink">{r.email}</span>
                  <br />
                  <span className="text-xs text-ink-2">{r.telefone}</span>
                </td>
                <td className="p-4 text-amber font-semibold">{r.alunos || "Nenhum"}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(r);
                      }}
                      className="p-1.5 rounded-lg text-ink-2 hover:text-ink hover:bg-black/5 transition-all"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(r);
                      }}
                      className="p-1.5 rounded-lg text-ink-2 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
