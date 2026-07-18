import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, Menu, X, ExternalLink } from "lucide-react";
import { NAV_GROUPS, ALL_ITEMS } from "@/lib/gestaoNav";
import { getToken, getUser, clearSession, authHeader } from "@/lib/auth";
import { Scaffold } from "@/components/gestao/Scaffold";
import { Inicio } from "@/components/gestao/Inicio";
import { Alunos } from "@/components/gestao/Alunos";
import { Turmas, Professores } from "@/components/gestao/CrudLists";
import { Comunicados, Contatos } from "@/components/gestao/Comms";
import { Financeiro, Responsaveis, Usuarios } from "@/components/gestao/ReadLists";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Gestao() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("inicio");
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    axios.get(`${API}/auth/me`, authHeader())
      .then((r) => {
        if (r.data?.role !== "admin") { navigate("/portal/app"); return; }
        setReady(true);
      })
      .catch(() => { clearSession(); navigate("/portal"); });
  }, [navigate]);

  const go = (key) => { setView(key); setOpenNav(false); };
  const logout = () => { clearSession(); navigate("/portal"); };
  const active = ALL_ITEMS.find((i) => i.key === view);

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
      default: return <Scaffold item={active} />;
    }
  };

  if (!ready) {
    return <div className="min-h-screen bg-cream-2 flex items-center justify-center"><Loader2 className="animate-spin text-amber" /></div>;
  }

  return (
    <div className="min-h-screen bg-cream-2 flex" data-testid="gestao-page">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-72 bg-dark flex flex-col transition-transform duration-300 ${openNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-5 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <p className="font-display font-extrabold tracking-tight text-cream text-sm leading-none">Gestão Favo</p>
              <p className="font-body text-[10px] text-cream/50 mt-1">Sistema escolar</p>
            </div>
          </div>
          <button className="lg:hidden text-cream" onClick={() => setOpenNav(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-5 space-y-5">
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="px-3 mb-1.5 font-body text-[10px] tracking-[0.2em] uppercase text-cream/40">{g.label}</p>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <button
                    key={it.key}
                    onClick={() => go(it.key)}
                    data-testid={`gnav-${it.key}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-[13px] transition-colors ${
                      view === it.key ? "bg-honey text-dark font-semibold" : "text-cream/70 hover:bg-white/5 hover:text-cream"
                    }`}
                  >
                    <it.icon size={16} className="shrink-0" />
                    <span className="truncate">{it.label}</span>
                    {!it.done && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${view === it.key ? "bg-dark/40" : "bg-honey/50"}`} title="Em breve" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {openNav && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpenNav(false)} />}

      <div className="flex-1 min-w-0">
        <header className="bg-cream border-b border-ink/10 sticky top-0 z-20">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-ink" onClick={() => setOpenNav(true)} data-testid="gestao-menu-toggle"><Menu /></button>
              <p className="font-body text-sm text-ink-2 hidden sm:block">Painel · <span className="text-ink font-semibold">{active?.label}</span></p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs text-ink-2 hover:text-amber transition-colors"><ExternalLink size={13} /> Ver site</a>
              <span className="font-body text-sm text-ink hidden sm:block">{user?.name}</span>
              <button onClick={logout} data-testid="gestao-logout" className="inline-flex items-center gap-2 bg-dark text-cream px-4 py-2 rounded-full font-body text-xs font-semibold hover:bg-amber hover:text-dark transition-colors"><LogOut size={14} /> Sair</button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-6xl">{renderView()}</main>
      </div>
    </div>
  );
}
