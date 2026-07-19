import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Loader2, Menu, X, ExternalLink, PanelLeftClose, PanelLeftOpen,
  ChevronDown, ChevronUp, Search, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_GROUPS, ALL_ITEMS } from "@/lib/gestaoNav";
import { getToken, getUser, clearSession, authHeader } from "@/lib/auth";
import { Scaffold } from "@/components/gestao/Scaffold";
import { Inicio } from "@/components/gestao/Inicio";
import { Alunos } from "@/components/gestao/Alunos";
import { Turmas, Professores } from "@/components/gestao/CrudLists";
import { Comunicados, Contatos } from "@/components/gestao/Comms";
import { Financeiro, Responsaveis, Usuarios } from "@/components/gestao/ReadLists";
import { SiteManagement } from "@/components/gestao/SiteManagement";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Gestao() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("inicio");
  const [openNav, setOpenNav] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("gestao_sidebar_collapsed") === "true";
  });
  
  const navigate = useNavigate();
  const user = getUser();

  // Filtragem dinâmica do menu lateral baseado na Role do Usuário (RBAC)
  const filteredNavGroups = useMemo(() => {
    const role = (user?.role || "").toUpperCase();
    if (!role) return [];
    if (["ADMIN", "DIRETORIA"].includes(role)) return NAV_GROUPS;

    return NAV_GROUPS.map(group => {
      let items = group.items;
      if (role === "COORDINATOR") {
        if (["Administração", "Financeiro"].includes(group.label)) return null;
        items = group.items.filter(i => !["usuarios", "site", "config"].includes(i.key));
      } else if (role === "TEACHER") {
        if (!["Visão geral", "Pedagógico", "Comunicação", "Biblioteca"].includes(group.label)) return null;
        items = group.items.filter(i => ["inicio", "planoaula", "diario", "chamada", "notas", "atividades", "comunicados", "livros", "reservas"].includes(i.key));
      } else if (role === "STAFF") {
        if (["Pedagógico", "Administração"].includes(group.label)) return null;
        items = group.items.filter(i => ["inicio", "alunos", "responsaveis", "funcionarios", "livros", "emprestimos", "reservas", "portaria", "saude", "financeiro"].includes(i.key));
      }
      return items.length > 0 ? { ...group, items } : null;
    }).filter(Boolean);
  }, [user]);

  const filteredAllItems = useMemo(() => filteredNavGroups.flatMap(g => g.items), [filteredNavGroups]);

  // Encontra o grupo inicial ativo
  const initialGroup = useMemo(() => {
    return filteredNavGroups.find(g => g.items.some(i => i.key === view))?.label || "Visão geral";
  }, [filteredNavGroups, view]);
  
  const [expandedGroup, setExpandedGroup] = useState(initialGroup);

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    axios.get(`${API}/auth/me`, authHeader())
      .then((r) => {
        const role = (r.data?.role || "").toUpperCase();
        if (!["ADMIN", "DIRETORIA", "COORDINATOR", "TEACHER", "STAFF"].includes(role)) {
          navigate("/portal/app");
          return;
        }
        setReady(true);
      })
      .catch(() => { clearSession(); navigate("/portal"); });
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("gestao_sidebar_collapsed", isCollapsed);
  }, [isCollapsed]);

  const go = (key) => {
    setView(key);
    setOpenNav(false);
    const groupOfKey = filteredNavGroups.find(g => g.items.some(i => i.key === key))?.label;
    if (groupOfKey) {
      setExpandedGroup(groupOfKey);
    }
  };

  const toggleGroup = (groupLabel) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedGroup(groupLabel);
    } else {
      setExpandedGroup(expandedGroup === groupLabel ? null : groupLabel);
    }
  };

  const logout = () => {
    clearSession();
    navigate("/portal");
  };

  const active = filteredAllItems.find((i) => i.key === view);
  const activeGroup = filteredNavGroups.find((g) => g.items.some((i) => i.key === view));

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const renderView = () => {
    switch (view) {
      case "inicio": return <Inicio go={go} />;
      case "alunos": return <Alunos />;
      case "turmas": return <Turmas />;
      case "professores": return <Professores />;
      case "responsaveis": return <Responsaveis />;
      case "comunicados": return <Comunicados />;
      case "contatos": return <Contatos />;
      case "financeiro": return <Financeiro />;
      case "usuarios": return <Usuarios />;
      case "site": return <SiteManagement />;
      default: return <Scaffold item={active} />;
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream-2 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-2 flex" data-testid="gestao-page">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen bg-dark flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        } ${openNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-5 shrink-0 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <img src="/logo-favo-oficial.png" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover shrink-0" />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                <p className="font-display font-extrabold tracking-tight text-cream text-sm leading-none">Gestão Favo</p>
                <p className="font-body text-[10px] text-cream/50 mt-1">Sistema escolar</p>
              </motion.div>
            )}
          </div>
          <button className="lg:hidden text-cream" onClick={() => setOpenNav(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Toggle for Desktop */}
        <div className="hidden lg:flex justify-end px-4 py-2 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-cream/50 hover:text-cream p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-5 space-y-3 no-scrollbar">
          {isCollapsed ? (
            /* Flat view showing only icons of all functional pages */
            <div className="space-y-1.5 flex flex-col items-center">
              {filteredAllItems.map((it) => {
                const isSelected = view === it.key;
                return (
                  <button
                    key={it.key}
                    onClick={() => go(it.key)}
                    title={`${it.label}${!it.done ? " (Em breve)" : ""}`}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group ${
                      isSelected ? "bg-honey text-dark font-semibold scale-105" : "text-cream/70 hover:bg-white/5 hover:text-cream"
                    }`}
                  >
                    <it.icon size={20} className="shrink-0" />
                    <span className="absolute left-full ml-3 px-2 py-1 bg-dark text-cream text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-cream/10 shadow-lg">
                      {it.label} {!it.done && "⏳"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Accordion view grouping categories */
            filteredNavGroups.map((g) => {
              const isExpanded = expandedGroup === g.label;
              const hasActiveChild = g.items.some(i => i.key === view);

              return (
                <div key={g.label} className="border-b border-white/5 pb-2">
                  <button
                    onClick={() => toggleGroup(g.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      hasActiveChild ? "text-honey" : "text-cream/40 hover:text-cream/70"
                    }`}
                  >
                    <span>{g.label}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-1.5 pl-1 space-y-1"
                      >
                        {g.items.map((it) => {
                          const isSelected = view === it.key;
                          return (
                            <button
                              key={it.key}
                              onClick={() => go(it.key)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-body text-sm transition-all ${
                                isSelected
                                  ? "bg-honey text-dark font-semibold shadow-md scale-[1.01]"
                                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <it.icon size={16} className="shrink-0" />
                                <span className="truncate">{it.label}</span>
                              </div>
                              {!it.done && <span className="text-[10px]">⏳</span>}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-honey text-dark flex items-center justify-center font-display font-bold shrink-0">
                {getInitials(user?.name)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-cream truncate">{user?.name}</p>
                  <p className="font-body text-[10px] text-cream/50 truncate uppercase tracking-widest">{user?.role}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={logout}
                className="text-cream/50 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                title="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-cream border-b border-ink/10 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-ink" onClick={() => setOpenNav(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 font-body text-xs text-ink-2">
              <span>Gestão</span>
              <ChevronRight size={12} />
              <span className="text-ink font-semibold">{activeGroup?.label || "Visão geral"}</span>
              <ChevronRight size={12} />
              <span className="text-amber font-semibold">{active?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 font-body text-xs text-ink-2 hover:text-dark transition-colors"
            >
              <span>Ver site público</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
