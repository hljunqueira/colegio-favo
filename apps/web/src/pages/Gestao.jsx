import { useEffect, useState } from "react";
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
  
  // Encontra o grupo inicial ativo
  const initialGroup = NAV_GROUPS.find(g => g.items.some(i => i.key === view))?.label || "Visão geral";
  const [expandedGroup, setExpandedGroup] = useState(initialGroup);

  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    axios.get(`${API}/auth/me`, authHeader())
      .then((r) => {
        if (r.data?.role !== "admin" && r.data?.role !== "diretoria") { navigate("/portal/app"); return; }
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
    // Atualiza o grupo expandido automaticamente ao mudar de view
    const groupOfKey = NAV_GROUPS.find(g => g.items.some(i => i.key === key))?.label;
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

  const active = ALL_ITEMS.find((i) => i.key === view);
  const activeGroup = NAV_GROUPS.find((g) => g.items.some((i) => i.key === view));

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
            <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover shrink-0" />
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
              {ALL_ITEMS.map((it) => {
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
                    {/* Tooltip on hover */}
                    <span className="absolute left-full ml-3 px-2 py-1 bg-dark text-cream text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-cream/10 shadow-lg">
                      {it.label} {!it.done && "⏳"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Accordion view grouping categories */
            NAV_GROUPS.map((g) => {
              const isExpanded = expandedGroup === g.label;
              const hasActiveChild = g.items.some(i => i.key === view);

              return (
                <div key={g.label} className="border-b border-white/5 pb-2">
                  <button
                    onClick={() => toggleGroup(g.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      hasActiveChild ? "text-honey font-semibold" : "text-cream/40 hover:text-cream/80"
                    }`}
                  >
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase truncate">{g.label}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-0.5 mt-1 pl-1"
                      >
                        {g.items.map((it) => {
                          const isSelected = view === it.key;
                          return (
                            <button
                              key={it.key}
                              onClick={() => go(it.key)}
                              data-testid={`gnav-${it.key}`}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-[13px] transition-colors ${
                                isSelected ? "bg-honey text-dark font-semibold" : "text-cream/70 hover:bg-white/5 hover:text-cream"
                              }`}
                            >
                              <it.icon size={16} className="shrink-0" />
                              <span className="truncate">{it.label}</span>
                              {!it.done && (
                                <span
                                  className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isSelected ? "bg-dark/40" : "bg-honey/50"
                                  }`}
                                  title="Em breve"
                                />
                              )}
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

        {/* User profile footer */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-black/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-honey text-dark font-display font-bold flex items-center justify-center shrink-0 shadow-inner">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-0 flex-1"
            >
              <p className="font-body text-xs font-bold text-cream truncate leading-none mb-1">{user?.name || "Diretora Favo"}</p>
              <p className="font-body text-[9px] text-cream/40 truncate leading-none">{user?.email || "admin@escolafavodemel.com.br"}</p>
            </motion.div>
          )}
        </div>
      </aside>

      {openNav && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpenNav(false)} />}

      {/* Main Content Area */}
      <div className="flex-grow min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-cream border-b border-ink/10 sticky top-0 z-20">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-ink"
                onClick={() => setOpenNav(true)}
                data-testid="gestao-menu-toggle"
              >
                <Menu />
              </button>
              {/* Dynamic Breadcrumbs */}
              <div className="font-body text-sm text-ink-2 hidden sm:flex items-center gap-1.5 select-none">
                <span>Painel</span>
                {activeGroup && (
                  <>
                    <ChevronRight size={12} className="opacity-40" />
                    <span className="opacity-60">{activeGroup.label}</span>
                  </>
                )}
                {active && (
                  <>
                    <ChevronRight size={12} className="opacity-40" />
                    <span className="text-ink font-semibold">{active.label}</span>
                  </>
                )}
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-cream-2 border border-ink/10 rounded-full px-3 py-1.5 w-64 focus-within:border-amber transition-colors">
              <Search size={14} className="text-ink-2/60" />
              <input
                type="text"
                placeholder="Buscar no sistema..."
                className="bg-transparent border-0 outline-none text-xs w-full font-body text-ink placeholder:text-ink-2/50"
              />
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs text-ink-2 hover:text-amber transition-colors"
              >
                <ExternalLink size={13} /> Ver site
              </a>
              <button
                onClick={logout}
                data-testid="gestao-logout"
                className="inline-flex items-center gap-2 bg-dark text-cream px-4 py-2 rounded-full font-body text-xs font-semibold hover:bg-amber hover:text-dark transition-colors"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </header>

        {/* View Content with Page Transition Animation */}
        <main className="p-4 sm:p-8 max-w-6xl flex-grow overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
