import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Loader2, Menu, X, ExternalLink, PanelLeftClose, PanelLeftOpen,
  ChevronDown, ChevronUp, Search, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { NAV_GROUPS, ALL_ITEMS } from "@/lib/gestaoNav";
import { getToken, getUser, clearSession, authHeader } from "@/lib/auth";
import { Scaffold } from "@/components/gestao/Scaffold";
import { Inicio } from "@/components/gestao/Inicio";
import { Secretaria } from "@/components/gestao/SecretariaModules";
import { Pedagogico } from "@/components/gestao/PedagogicoModules";
import { Comunicacao } from "@/components/gestao/Comms";
import { FinanceiroGeral } from "@/components/gestao/FinanceiroModules";
import { Biblioteca } from "@/components/gestao/BibliotecaModules";
import { PortariaSaude } from "@/components/gestao/PortariaSaudeModules";
import { Administracao } from "@/components/gestao/AdminModules";

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
  const fileInputRef = useRef(null);
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem(`avatar_${user?.id}`) || "");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API}/site-config/upload`, formData, {
        headers: {
          ...authHeader().headers,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data?.url) {
        const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url.replace('/favo-api', '')}`;
        localStorage.setItem(`avatar_${user?.id}`, fullUrl);
        setUserAvatar(fullUrl);
        toast.success("Foto de perfil atualizada!");
      }
    } catch {
      toast.error("Erro ao fazer upload da foto.");
    }
  };

  // Filtragem dinâmica do menu lateral baseado na Role do Usuário (RBAC)
  const filteredNavGroups = useMemo(() => {
    const role = (user?.role || "").toUpperCase();
    if (!role) return [];
    if (["ADMIN", "DIRETORIA"].includes(role)) return NAV_GROUPS;

    const userPerms = user?.permissions || [];

    return NAV_GROUPS.map(group => {
      const items = group.items.filter(item => {
        if (item.key === "inicio") return true;
        return userPerms.includes(`view:${item.key}`);
      });
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
        // Atualiza os dados do usuário com as permissões mais recentes
        localStorage.setItem("user", JSON.stringify(r.data));
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
      case "secretaria": return <Secretaria />;
      case "pedagogico": return <Pedagogico />;
      case "comunicacao": return <Comunicacao />;
      case "financeiro": return <FinanceiroGeral />;
      case "biblioteca": return <Biblioteca />;
      case "portaria_saude": return <PortariaSaude />;
      case "administracao": return <Administracao />;
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
            <img src="/logo-favo.jpg" alt="Colégio Favo" className="w-10 h-10 rounded-lg object-cover shrink-0" />
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
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Sair da conta"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="font-body font-semibold">Sair</span>}
          </button>
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
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-display font-extrabold text-xl text-ink tracking-tight">{active?.label}</span>
              <span className="text-[10px] font-body uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-honey/20 text-amber font-semibold">
                {activeGroup?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="font-body text-sm font-bold text-ink leading-tight">{user?.name}</p>
                <p className="font-body text-[10px] text-ink-3 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div 
                onClick={handleAvatarClick}
                className="w-10 h-10 rounded-full bg-honey text-dark flex items-center justify-center font-display font-bold shrink-0 shadow-sm border border-ink/5 cursor-pointer relative overflow-hidden group hover:opacity-90 transition-opacity"
                title="Alterar foto de perfil"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-cream">📷</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
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
