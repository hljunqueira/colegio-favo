import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ShieldCheck, ScrollText, Plug, Settings, Plus, UserCog, Edit, Trash2, Globe, Users, ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

// Importações dos componentes existentes na mesma pasta
import { SiteManagement } from "./SiteManagement";

import { API } from "@/lib/api";

// Helper de tradução para cargos/roles
const translateRole = (role) => {
  const r = (role || "").toLowerCase();
  if (r === "admin") return "Administrador";
  if (r === "diretoria") return "Diretoria";
  if (r === "teacher" || r === "professor") return "Professor";
  if (r === "coordinator" || r === "coordenador") return "Coordenador";
  if (r === "staff" || r === "funcionario") return "Funcionário";
  if (r === "student" || r === "aluno") return "Aluno";
  if (r === "parent" || r === "responsavel") return "Responsável";
  return role;
};

// --- MAIN UNIFIED ADMIN COMPONENT ---
export const Administracao = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "funcionarios", label: "Funcionários", desc: "Equipe escolar e escala de trabalho", icon: UserCog, color: "bg-amber/10 text-amber" },
    { key: "usuarios", label: "Usuários do Sistema", desc: "Listagem de usuários logáveis no sistema", icon: Users, color: "bg-moss/10 text-moss" },
    { key: "site", label: "Site Público", desc: "Gerenciamento de conteúdos e notícias do site", icon: Globe, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "perfis", label: "Perfis & Permissões", desc: "Configurações de papéis de acesso e RLS", icon: ShieldCheck, color: "bg-rose-500/10 text-rose-500" },
    { key: "logs", label: "Logs & Auditoria", desc: "Histórico de ações e trilha de auditoria", icon: ScrollText, color: "bg-sky-500/10 text-sky-500" },
    { key: "integracoes", label: "Integrações", desc: "Evolution API, Supabase, n8n e webhooks", icon: Plug, color: "bg-purple-500/10 text-purple-500" },
    { key: "config", label: "Configurações Gerais", desc: "Dados institucionais e preferências do sistema", icon: Settings, color: "bg-emerald-500/10 text-emerald-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "funcionarios":
        return <Funcionarios onBack={() => setTab("hub")} />;
      case "usuarios":
        return <UsuariosComponent onBack={() => setTab("hub")} />;
      case "site":
        return (
          <div className="space-y-4">
            <button onClick={() => setTab("hub")} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink font-body mb-2"><ArrowLeft size={16} /> Voltar para Administração</button>
            <SiteManagement />
          </div>
        );
      case "perfis":
        return <Perfis onBack={() => setTab("hub")} />;
      case "logs":
        return <Logs onBack={() => setTab("hub")} />;
      case "integracoes":
        return <Integracoes onBack={() => setTab("hub")} />;
      case "config":
        return <Config onBack={() => setTab("hub")} />;
      default:
        return (
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
      title="Voltar para Administração"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 0. FUNCIONÁRIOS (CRUD COMPLETO COM MODAL CUSTOMIZADO) ---
const Funcionarios = ({ onBack }) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
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
      await axios.post(`${API}/gestao/usuarios`, {
        name: f.name,
        email: f.email,
        phone: f.phone,
        role: "STAFF"
      }, authHeader());
      toast.success("Funcionário cadastrado com sucesso!");
      setOpen(false);
      setF({ name: "", email: "", phone: "", setor: "secretaria" });
      load();
    } catch {
      toast.error("Erro ao salvar funcionário.");
    }
  };

  const handleEditClick = (item) => {
    setSelected(item);
    setF({
      name: item.name,
      email: item.email,
      phone: item.phone,
      setor: "secretaria"
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/gestao/usuarios/${selected.id}`, f, authHeader());
      toast.success("Funcionário atualizado com sucesso!");
      setEditOpen(false);
      load();
    } catch {
      toast.error("Erro ao atualizar funcionário.");
    }
  };

  const handleDeleteClick = (item) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/gestao/usuarios/${selected.id}`, authHeader());
      toast.success("Funcionário removido com sucesso!");
      load();
    } catch {
      toast.error("Erro ao remover funcionário.");
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
              <Input placeholder="E-mail *" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
              <Input placeholder="Telefone / WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Editar Funcionário</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <Input placeholder="Nome Completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
            <Input placeholder="E-mail *" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
            <Input placeholder="Telefone / WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reusable Custom Modal para deletar */}
      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deseja realmente remover este funcionário?"
        description="Esta ação removerá a credencial de funcionário do sistema e não poderá ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Confirmar Remoção"
        cancelText="Voltar"
      />

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Identificador</th>
              <th className="p-4 font-semibold">Função</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.name}</td>
                <td className="p-4 text-ink-2">{r.email || r.phone}</td>
                <td className="p-4">
                  <Badge className="bg-moss/10 text-moss capitalize font-body">{translateRole(r.role)}</Badge>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(r)}
                    className="p-2 hover:bg-cream-2 rounded-lg text-ink-2 hover:text-ink transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(r)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/70 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-2">Nenhum funcionário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 1. USUÁRIOS DO SISTEMA (CRUD COMPLETO COM PERMISSÕES CUSTOMIZADAS) ---
const UsuariosComponent = ({ onBack }) => {
  const [rows, setRows] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", role: "STAFF", password: "" });
  const [activeTab, setActiveTab] = useState("secretaria");

  const TABS = [
    { key: "modules", label: "Módulos", icon: "📂" },
    { key: "secretaria", label: "Secretaria", icon: "🏫" },
    { key: "pedagogico", label: "Pedagógico", icon: "📝" },
    { key: "comunicacao", label: "Comunicação", icon: "📣" },
    { key: "financeiro", label: "Financeiro", icon: "💰" },
    { key: "biblioteca", label: "Biblioteca", icon: "📚" },
    { key: "portaria", label: "Portaria & Saúde", icon: "🏥" },
    { key: "admin", label: "Administração", icon: "⚙️" }
  ];

  const load = async () => {
    try {
      const res = await axios.get(`${API}/gestao/usuarios`, authHeader());
      setRows(res.data);
      const permRes = await axios.get(`${API}/gestao/permissions`, authHeader());
      setPermissions(permRes.data);
    } catch {
      toast.error("Erro ao carregar dados.");
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email) { toast.error("Preencha nome e e-mail."); return; }
    try {
      await axios.post(`${API}/gestao/usuarios`, f, authHeader());
      toast.success("Usuário de credencial criado!");
      setOpen(false);
      setF({ name: "", email: "", phone: "", role: "STAFF", password: "" });
      load();
    } catch {
      toast.error("Erro ao cadastrar usuário.");
    }
  };

  const handleEditClick = (item) => {
    setSelected(item);
    setF({
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role.toUpperCase(),
      password: ""
    });
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/gestao/usuarios/${selected.id}`, f, authHeader());
      toast.success("Usuário atualizado!");
      setEditOpen(false);
      load();
    } catch {
      toast.error("Erro ao atualizar.");
    }
  };

  const handleDeleteClick = (item) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/gestao/usuarios/${selected.id}`, authHeader());
      toast.success("Usuário removido!");
      load();
    } catch {
      toast.error("Erro ao remover usuário.");
    }
  };

  const openUserPerms = (userItem) => {
    setSelected(userItem);
    setSelectedPerms(userItem.permissions?.map(p => p.id) || []);
    setActiveTab("secretaria");
    setPermOpen(true);
  };

  const togglePerm = (permId) => {
    setSelectedPerms(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const saveUserPermissions = async () => {
    try {
      await axios.post(`${API}/gestao/usuarios/${selected.id}/permissions`, {
        permissionIds: selectedPerms
      }, authHeader());
      toast.success("Permissões individuais atualizadas!");
      setPermOpen(false);
      load();
    } catch {
      toast.error("Erro ao salvar permissões do usuário.");
    }
  };

  const renderTabContent = () => {
    let viewFilter = () => false;
    let actionFilter = () => false;

    if (activeTab === "modules") {
      viewFilter = p => p.action.startsWith("view:") && !p.description.includes(">");
    } else if (activeTab === "secretaria") {
      viewFilter = p => p.description.startsWith("Secretaria >");
      actionFilter = p => !p.action.startsWith("view:") && (p.action.includes("alunos") || p.action.includes("professores") || p.action.includes("turmas") || p.action.includes("responsaveis") || p.action.includes("matriculas") || p.action.includes("series") || p.action.includes("disciplinas"));
    } else if (activeTab === "pedagogico") {
      viewFilter = p => p.description.startsWith("Pedagógico >");
      actionFilter = p => !p.action.startsWith("view:") && (p.action.includes("planoaula") || p.action.includes("diario") || p.action.includes("chamada") || p.action.includes("notas") || p.action.includes("atividades"));
    } else if (activeTab === "comunicacao") {
      viewFilter = p => p.description.startsWith("Comunicação >");
      actionFilter = p => !p.action.startsWith("view:") && p.action.includes("comunicados");
    } else if (activeTab === "financeiro") {
      viewFilter = p => p.description.startsWith("Financeiro >");
      actionFilter = p => !p.action.startsWith("view:") && p.action.includes("financeiro");
    } else if (activeTab === "biblioteca") {
      viewFilter = p => p.description.startsWith("Biblioteca >");
      actionFilter = p => !p.action.startsWith("view:") && (p.action.includes("livros") || p.action.includes("emprestimos") || p.action.includes("reservas"));
    } else if (activeTab === "portaria") {
      viewFilter = p => p.description.startsWith("Portaria & Saúde >");
      actionFilter = p => !p.action.startsWith("view:") && (p.action.includes("portaria") || p.action.includes("saude"));
    } else if (activeTab === "admin") {
      viewFilter = p => p.description.startsWith("Administração >");
      actionFilter = p => !p.action.startsWith("view:") && (p.action.includes("funcionarios") || p.action.includes("usuarios") || p.action.includes("site") || p.action.includes("perfis") || p.action.includes("config"));
    }

    const views = permissions.filter(viewFilter);
    const actions = permissions.filter(actionFilter);

    return (
      <div className="space-y-6">
        {views.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-ink/75 tracking-wider uppercase pb-1 border-b border-ink/5">
              📂 Acesso de Visualização (Menus)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {views.map(p => {
                const displayName = p.description.includes(">") ? p.description.split(">")[1].trim() : p.description;
                return (
                  <label key={p.id} className="flex items-center gap-3 p-3 bg-cream-2/45 hover:bg-cream-2/80 rounded-xl cursor-pointer transition-all border border-ink/5 select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedPerms.includes(p.id)}
                      onChange={() => togglePerm(p.id)}
                      className="rounded border-ink/20 text-amber focus:ring-amber shrink-0"
                    />
                    <span className="font-body text-sm font-semibold text-ink leading-tight">{displayName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-ink/75 tracking-wider uppercase pb-1 border-b border-ink/5">
              ⚡ Permissões de Ação (Criar, Editar, Excluir)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {actions.map(p => {
                const displayName = p.description.includes(">") ? p.description.split(">")[1].trim() : p.description;
                return (
                  <label key={p.id} className="flex items-center gap-3 p-3 bg-cream-2/45 hover:bg-cream-2/80 rounded-xl cursor-pointer transition-all border border-ink/5 select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedPerms.includes(p.id)}
                      onChange={() => togglePerm(p.id)}
                      className="rounded border-ink/20 text-amber focus:ring-amber shrink-0"
                    />
                    <span className="font-body text-sm font-semibold text-ink leading-tight">{displayName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Usuários de Credenciais" icon={Users} onBack={onBack} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors">
            <Plus size={16} /> Novo Usuário
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Novo Usuário do Sistema</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4">
              <Input placeholder="Nome Completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              <Input placeholder="E-mail de Login *" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
              <Input placeholder="Senha de Acesso" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
              <Input placeholder="Telefone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
                <option value="STAFF">Funcionário (Staff)</option>
                <option value="ADMIN">Administrador</option>
                <option value="DIRETORIA">Diretoria</option>
                <option value="COORDINATOR">Coordenador</option>
                <option value="TEACHER">Professor</option>
              </select>
              <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Editar Usuário</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <Input placeholder="Nome Completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
            <Input placeholder="E-mail *" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
            <Input placeholder="Telefone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none">
              <option value="STAFF">Funcionário (Staff)</option>
              <option value="ADMIN">Administrador</option>
              <option value="DIRETORIA">Diretoria</option>
              <option value="COORDINATOR">Coordenador</option>
              <option value="TEACHER">Professor</option>
            </select>
            <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">Salvar Alterações</button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal 
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deseja realmente remover este usuário?"
        description="Esta ação removerá a conta de login permanentemente do sistema."
        onConfirm={confirmDelete}
        confirmText="Confirmar Exclusão"
        cancelText="Voltar"
      />

      {/* Modal de Exceções de Permissões Individuais */}
      <Dialog open={permOpen} onOpenChange={setPermOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink">
              Configurar Permissões de Acesso
            </DialogTitle>
            <div className="mt-3 flex items-center gap-3 p-3 bg-cream-2/60 rounded-xl border border-ink/5">
              <div className="bg-amber/10 p-2 rounded-lg text-amber"><Users size={20} /></div>
              <div>
                <p className="font-display font-bold text-sm text-ink leading-tight">{selected && selected.name}</p>
                <p className="font-body text-xs text-ink-2 mt-0.5">{selected && (selected.email || selected.phone)}</p>
              </div>
              <Badge className="ml-auto bg-dark text-cream font-body text-[10px] uppercase tracking-wider">{selected && translateRole(selected.role)}</Badge>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-5 min-h-[50vh] py-4 border-t border-b border-ink/5 my-2">
            {/* Sidebar das Abas */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1 md:w-52 shrink-0 pb-2 md:pb-0 md:border-r border-ink/5 pr-0 md:pr-4">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-display text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "bg-dark text-cream"
                      : "bg-cream-2/40 text-ink-2 hover:bg-cream-2/80"
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[55vh] pr-1">
              {renderTabContent()}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setPermOpen(false)} className="px-4 py-2 bg-cream-2 hover:bg-cream-3 text-ink-2 hover:text-ink rounded-full font-body text-xs font-semibold transition-colors">Cancelar</button>
            <button type="button" onClick={saveUserPermissions} className="px-5 py-2 bg-dark text-cream hover:bg-amber hover:text-dark rounded-full font-body text-xs font-semibold transition-colors">Salvar Alterações</button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Login / Credencial</th>
              <th className="p-4 font-semibold">Cargo</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{r.name}</td>
                <td className="p-4 text-ink-2">{r.email || r.phone}</td>
                <td className="p-4">
                  <Badge className="bg-moss/10 text-moss capitalize font-body">{translateRole(r.role)}</Badge>
                  {r.permissions?.length > 0 && (
                    <Badge variant="outline" className="ml-2 border-amber text-amber text-[10px] font-body">+{r.permissions.length} Custom</Badge>
                  )}
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => openUserPerms(r)} className="p-2 hover:bg-cream-2 rounded-lg text-ink-2 hover:text-ink transition-colors" title="Customizar Permissões"><ShieldCheck size={16} /></button>
                  <button onClick={() => handleEditClick(r)} className="p-2 hover:bg-cream-2 rounded-lg text-ink-2 hover:text-ink transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDeleteClick(r)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/70 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 2. PERFIS & PERMISSÕES (LISTAGEM DE ROLES DO BANCO COM CONFIGURAÇÃO DE PERMISSÕES) ---
const Perfis = ({ onBack }) => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [targetUser, setTargetUser] = useState(null); // null = Role padrão, caso contrário o objeto User
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState([]);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/gestao/roles`, authHeader());
      setRoles(res.data);
      const permRes = await axios.get(`${API}/gestao/permissions`, authHeader());
      setPermissions(permRes.data);
      const usersRes = await axios.get(`${API}/gestao/usuarios`, authHeader());
      setUsers(usersRes.data);
    } catch {
      toast.error("Erro ao carregar perfis, usuários e permissões.");
    }
  };

  useEffect(() => { load(); }, []);

  const openConfig = (role) => {
    setSelectedRole(role);
    setTargetUser(null);
    setSelectedPerms(role.permissions?.map(p => p.id) || []);
    setModalOpen(true);
  };

  const handleTargetChange = (userId) => {
    if (!userId) {
      setTargetUser(null);
      setSelectedPerms(selectedRole.permissions?.map(p => p.id) || []);
    } else {
      const foundUser = users.find(u => u.id === userId);
      setTargetUser(foundUser);
      setSelectedPerms(foundUser.permissions?.map(p => p.id) || []);
    }
  };

  const togglePerm = (permId) => {
    setSelectedPerms(prev =>
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const savePermissions = async () => {
    try {
      if (targetUser) {
        // Salva permissão customizada para o usuário selecionado
        await axios.post(`${API}/gestao/usuarios/${targetUser.id}/permissions`, {
          permissionIds: selectedPerms
        }, authHeader());
        toast.success(`Permissões individuais de ${targetUser.name} atualizadas!`);
      } else {
        // Salva permissão geral do Cargo
        await axios.post(`${API}/gestao/roles/${selectedRole.id}/permissions`, {
          permissionIds: selectedPerms
        }, authHeader());
        toast.success("Permissões padrão do cargo atualizadas!");
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error("Erro ao salvar permissões.");
    }
  };

  // Separa as permissões por tipo
  const menuPerms = permissions.filter(p => p.action.startsWith("view:"));
  const actionPerms = permissions.filter(p => !p.action.startsWith("view:"));

  // Filtra os usuários que pertencem ao cargo selecionado
  const usersInRole = selectedRole ? users.filter(u => u.role?.toUpperCase() === selectedRole.name?.toUpperCase()) : [];

  return (
    <div className="space-y-6">
      <ModuleHeader title="Perfis & Cargos de Acesso" icon={ShieldCheck} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
              <th className="p-4 font-semibold">Perfil</th>
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold text-center">Usuários Ativos</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink"><Badge className="bg-honey text-dark font-body">{translateRole(r.name)}</Badge></td>
                <td className="p-4 text-ink-2 font-body text-xs">{r.description || "Sem descrição"}</td>
                <td className="p-4 text-center font-semibold text-ink">{r._count?.users || 0}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openConfig(r)}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1.5 rounded-full transition-colors font-body"
                  >
                    <UserCog size={13} /> Permissões
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Configuração de Permissões */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink">
              Permissões de Acesso do Perfil
            </DialogTitle>
            
            <div className="mt-3 space-y-3">
              {/* Informações básicas do Perfil */}
              <div className="flex items-center gap-3 p-3 bg-cream-2/60 rounded-xl border border-ink/5">
                <div className="bg-amber/10 p-2 rounded-lg text-amber"><ShieldCheck size={20} /></div>
                <div>
                  <p className="font-display font-bold text-sm text-ink leading-tight">Cargo: {selectedRole && translateRole(selectedRole.name)}</p>
                  <p className="font-body text-xs text-ink-2 mt-0.5">{selectedRole?.description || "Sem descrição registrada"}</p>
                </div>
              </div>

              {/* Seletor para personalizar para um usuário específico */}
              <div className="p-4 bg-cream-3/40 rounded-xl border border-ink/5 space-y-2">
                <label className="block font-display font-bold text-xs text-ink-2 uppercase tracking-wide">
                  🎯 Personalizar Acesso para um Usuário Específico:
                </label>
                <select
                  value={targetUser?.id || ""}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none"
                >
                  <option value="">Permissões Padrão do Cargo (Afeta todos do cargo)</option>
                  {usersInRole.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email || u.phone})
                    </option>
                  ))}
                </select>
                <p className="font-body text-[11px] text-ink-3">
                  {targetUser 
                    ? `⚠️ Editando as permissões exclusivas de ${targetUser.name}. Isso criará uma exceção à regra geral.` 
                    : "ℹ️ Editando as permissões padrão. Quaisquer alterações se aplicarão a todos os usuários deste cargo."
                  }
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Seções de Permissões Agrupadas */}
            {(() => {
              const renderSection = (title, icon, filterFn) => {
                const filtered = permissions.filter(filterFn);
                if (filtered.length === 0) return null;
                return (
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xs text-ink/75 tracking-wider uppercase flex items-center gap-1.5 pt-2 border-b border-ink/5 pb-1">
                      {icon} {title}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filtered.map(p => {
                        const displayName = p.description.includes(">") ? p.description.split(">")[1].trim() : p.description;
                        return (
                          <label key={p.id} className="flex items-center gap-3 p-3 bg-cream-2/40 hover:bg-cream-2/70 rounded-xl cursor-pointer transition-all border border-ink/5 select-none">
                            <input 
                              type="checkbox" 
                              checked={selectedPerms.includes(p.id)}
                              onChange={() => togglePerm(p.id)}
                              className="rounded border-ink/20 text-amber focus:ring-amber shrink-0"
                            />
                            <span className="font-body text-sm font-semibold text-ink leading-tight">{displayName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-5">
                  {renderSection("Menus Principais / Módulos", "📂", p => p.action.startsWith("view:") && !p.description.includes(">"))}
                  {renderSection("Secretaria Geral", "🏫", p => p.description.startsWith("Secretaria >"))}
                  {renderSection("Pedagógico Geral", "📝", p => p.description.startsWith("Pedagógico >"))}
                  {renderSection("Comunicação Geral", "📣", p => p.description.startsWith("Comunicação >"))}
                  {renderSection("Financeiro Geral", "💰", p => p.description.startsWith("Financeiro >"))}
                  {renderSection("Biblioteca Geral", "📚", p => p.description.startsWith("Biblioteca >"))}
                  {renderSection("Portaria & Saúde", "🏥", p => p.description.startsWith("Portaria & Saúde >"))}
                  {renderSection("Administração Geral", "⚙️", p => p.description.startsWith("Administração >"))}
                  {renderSection("Ações (Escrita & Exclusão)", "⚡", p => !p.action.startsWith("view:"))}
                </div>
              );
            })()}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-ink/5">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-cream-2 hover:bg-cream-3 text-ink-2 hover:text-ink rounded-full font-body text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={savePermissions}
              className="px-5 py-2 bg-dark text-cream hover:bg-amber hover:text-dark rounded-full font-body text-xs font-semibold transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- 3. LOGS & AUDITORIA ---
const Logs = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Logs & Auditoria" icon={ScrollText} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Histórico de ações críticas e auditoria de modificações de dados.</p>
      </div>
    </div>
  );
};

// --- 4. INTEGRAÇÕES ---
const Integracoes = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Integrações" icon={Plug} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Integração de serviços externos (Evolution API, Supabase, n8n).</p>
      </div>
    </div>
  );
};

// --- 5. CONFIGURAÇÕES ---
const Config = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Configurações Gerais" icon={Settings} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Configurações do sistema, dados institucionais e preferências globais.</p>
      </div>
    </div>
  );
};
