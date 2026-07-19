import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutGrid, CalendarDays, GraduationCap, Wallet, UtensilsCrossed,
  LogOut, Loader2, Megaphone, ArrowUpRight, CheckCircle2, Clock,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getUser, authHeader, clearSession, getToken } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NAV = [
  { key: "mural", label: "Mural", icon: LayoutGrid },
  { key: "agenda", label: "Agenda", icon: CalendarDays },
  { key: "boletim", label: "Boletim", icon: GraduationCap },
  { key: "financeiro", label: "Financeiro", icon: Wallet },
  { key: "cardapio", label: "Cardápio", icon: UtensilsCrossed },
];

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const parseD = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtD = (dt) => dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const TYPE_COLOR = {
  avaliacao: "bg-amber text-cream",
  tarefa: "bg-honey text-dark",
  evento: "bg-moss text-cream",
};

export default function PortalDashboard() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("mural");
  const [selected, setSelected] = useState(new Date(2025, 10, 12));
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!getToken()) { navigate("/portal"); return; }
    axios.get(`${API}/portal/dashboard`, authHeader())
      .then((r) => setData(r.data))
      .catch(() => { clearSession(); navigate("/portal"); });
  }, [navigate]);

  const student = data?.student;
  const eventDates = useMemo(() => (student?.agenda || []).map((e) => parseD(e.date)), [student]);
  const dayEvents = useMemo(
    () => (student?.agenda || []).filter((e) => sameDay(parseD(e.date), selected)),
    [student, selected]
  );

  const media = useMemo(() => {
    if (!student) return "—";
    const all = student.boletim.flatMap((b) => [b.b1, b.b2, b.b3, b.b4].filter((x) => x != null));
    return all.length ? (all.reduce((a, c) => a + c, 0) / all.length).toFixed(1) : "—";
  }, [student]);

  const emAberto = useMemo(
    () => (student?.financeiro || []).filter((f) => f.status === "aberto").reduce((a, c) => a + c.valor, 0),
    [student]
  );
  const proxima = (student?.agenda || []).find((e) => e.type === "avaliacao");

  const logout = () => { clearSession(); navigate("/portal"); };

  if (!data) {
    return (
      <div className="min-h-screen bg-cream-2 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-2 flex" data-testid="portal-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark min-h-screen sticky top-0 p-5">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo-favo-oficial.png" alt="Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Portal Favo</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              data-testid={`nav-${n.key}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${
                view === n.key ? "bg-honey text-dark font-semibold" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} data-testid="portal-logout" className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-cream/70 hover:bg-white/5 hover:text-cream transition-colors">
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="bg-cream border-b border-ink/10 sticky top-0 z-30">
          <div className="px-5 sm:px-8 h-20 flex items-center justify-between">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-amber">{student.turma}</p>
              <h1 className="font-display font-extrabold tracking-tight text-xl text-ink">{student.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* mobile nav */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger data-testid="mobile-portal-nav" className="px-3 py-2 rounded-full bg-dark text-cream font-body text-sm">Menu</DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {NAV.map((n) => (
                      <DropdownMenuItem key={n.key} onClick={() => setView(n.key)}>{n.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger data-testid="user-menu" className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-amber text-cream font-display font-bold flex items-center justify-center">
                    {(user?.name || "R")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8 max-w-5xl">
          {view === "mural" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8" data-testid="view-mural">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={GraduationCap} label="Média geral" value={media} accent />
                <StatCard icon={Wallet} label="Em aberto" value={brl(emAberto)} />
                <StatCard icon={CalendarDays} label="Próxima avaliação" value={proxima ? proxima.disciplina : "—"} sub={proxima ? fmtD(parseD(proxima.date)) : ""} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="text-amber" size={20} />
                  <h2 className="font-display font-extrabold tracking-tight text-2xl text-ink">Comunicados</h2>
                </div>
                <div className="space-y-3">
                  {data.avisos.map((a) => (
                    <div key={a.id} data-testid="aviso-item" className="bg-cream rounded-2xl border border-ink/10 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-honey text-dark font-body">{a.categoria}</Badge>
                        <span className="font-body text-xs" style={{ color: "var(--ink-2)" }}>
                          {new Date(a.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-ink">{a.titulo}</h3>
                      <p className="font-body text-sm mt-1" style={{ color: "var(--ink-2)" }}>{a.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === "agenda" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="view-agenda">
              <div className="bg-cream rounded-2xl border border-ink/10 p-5 w-fit">
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={(d) => d && setSelected(d)}
                  defaultMonth={new Date(2025, 10)}
                  modifiers={{ hasEvent: eventDates }}
                  modifiersClassNames={{ hasEvent: "bg-honey/40 rounded-full font-bold" }}
                />
              </div>
              <div>
                <h2 className="font-display font-extrabold tracking-tight text-2xl text-ink mb-4 capitalize">{fmtD(selected)}</h2>
                <div className="space-y-3">
                  {dayEvents.length === 0 ? (
                    <p className="font-body text-sm" style={{ color: "var(--ink-2)" }}>Nenhum compromisso neste dia.</p>
                  ) : dayEvents.map((e, i) => (
                    <div key={i} data-testid="agenda-event" className="bg-cream rounded-2xl border border-ink/10 p-4 flex items-center gap-3">
                      <Badge className={`${TYPE_COLOR[e.type]} font-body capitalize`}>{e.type}</Badge>
                      <div>
                        <p className="font-body font-semibold text-ink text-sm">{e.title}</p>
                        <p className="font-body text-xs" style={{ color: "var(--ink-2)" }}>{e.disciplina}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === "boletim" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} data-testid="view-boletim">
              <h2 className="font-display font-extrabold tracking-tight text-2xl text-ink mb-6">Boletim · média geral {media}</h2>
              <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="bg-cream-2 text-left" style={{ color: "var(--ink-2)" }}>
                      <th className="p-4 font-semibold">Disciplina</th>
                      <th className="p-4 font-semibold text-center">1º Bim</th>
                      <th className="p-4 font-semibold text-center">2º Bim</th>
                      <th className="p-4 font-semibold text-center">3º Bim</th>
                      <th className="p-4 font-semibold text-center">4º Bim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.boletim.map((b, i) => (
                      <tr key={i} data-testid="boletim-row" className="border-t border-ink/5">
                        <td className="p-4 font-semibold text-ink">{b.disciplina}</td>
                        {["b1", "b2", "b3", "b4"].map((k) => (
                          <td key={k} className="p-4 text-center">
                            {b[k] == null ? <span className="text-ink/30">—</span> :
                              <span className={b[k] < 6 ? "text-red-600 font-bold" : "text-moss font-semibold"}>{b[k].toFixed(1)}</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {view === "financeiro" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} data-testid="view-financeiro">
              <h2 className="font-display font-extrabold tracking-tight text-2xl text-ink mb-6">Financeiro</h2>
              <div className="space-y-3">
                {student.financeiro.map((f, i) => (
                  <div key={i} data-testid="financeiro-row" className="bg-cream rounded-2xl border border-ink/10 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {f.status === "pago"
                        ? <CheckCircle2 className="text-emerald-600" />
                        : <Clock className="text-amber" />}
                      <div>
                        <p className="font-body font-semibold text-ink">{f.ref}</p>
                        <p className="font-body text-xs" style={{ color: "var(--ink-2)" }}>Vencimento: {parseD(f.vencimento).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-ink">{brl(f.valor)}</p>
                      <Badge className={f.status === "pago" ? "bg-emerald-600 text-white font-body" : "bg-amber text-cream font-body"}>
                        {f.status === "pago" ? "Pago" : "Em aberto"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {emAberto > 0 && (
                  <button data-testid="pagar-btn" onClick={() => toast.success("Boleto gerado! (demonstração)")} className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-dark text-cream py-4 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">
                    Gerar boleto — {brl(emAberto)} <ArrowUpRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {view === "cardapio" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} data-testid="view-cardapio">
              <h2 className="font-display font-extrabold tracking-tight text-2xl text-ink mb-6">Cardápio da semana</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {student.cardapio.map((c, i) => (
                  <div key={i} data-testid="cardapio-row" className="bg-cream rounded-2xl border border-ink/10 p-5">
                    <p className="font-body text-xs tracking-widest uppercase text-amber mb-2">{c.dia}</p>
                    <p className="font-body text-ink">{c.refeicao}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className={`rounded-2xl p-5 border ${accent ? "bg-dark border-dark" : "bg-cream border-ink/10"}`}>
    <Icon className={accent ? "text-honey" : "text-amber"} size={22} />
    <p className={`font-body text-xs tracking-widest uppercase mt-4 ${accent ? "text-cream/60" : ""}`} style={accent ? {} : { color: "var(--ink-2)" }}>{label}</p>
    <p className={`font-display font-extrabold text-2xl ${accent ? "text-cream" : "text-ink"}`}>{value}</p>
    {sub && <p className={`font-body text-xs ${accent ? "text-cream/60" : ""}`} style={accent ? {} : { color: "var(--ink-2)" }}>{sub}</p>}
  </div>
);
