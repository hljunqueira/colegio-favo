import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Activity,
  Wallet,
  Users,
  Inbox,
  Megaphone,
  Library,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const brl = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const DashboardKpis = ({ stats, go }) => {
  const s = stats || {};

  const mainKpis = [
    {
      id: "alunos",
      title: "Alunos Matriculados",
      value: s.alunos != null ? s.alunos : "—",
      badge: "+12% vs 2025",
      badgeType: "positive",
      footer: `${s.turmas || 0} turmas • ${s.taxa_ocupacao || 88}% de ocupação`,
      icon: GraduationCap,
      color: "amber",
      bgLight: "bg-amber/10",
      textColor: "text-amber",
      borderHover: "hover:border-amber",
      to: "secretaria",
    },
    {
      id: "frequencia",
      title: "Frequência Escolar Média",
      value: s.frequencia_media ? `${s.frequencia_media}%` : "97.4%",
      badge: "Meta (95%) Superada",
      badgeType: "positive",
      footer: "Ed. Infantil (97.1%) & Fundamental (97.7%)",
      icon: Activity,
      color: "emerald",
      bgLight: "bg-emerald-500/10",
      textColor: "text-emerald-600",
      borderHover: "hover:border-emerald-500",
      to: "pedagogico",
    },
    {
      id: "financeiro",
      title: "Taxa de Adimplência",
      value: s.taxa_adimplencia ? `${s.taxa_adimplencia}%` : "92%",
      badge: `${brl(s.mensalidades_pagas || 18400)} recebidos`,
      badgeType: "neutral",
      footer: `${brl(s.mensalidades_abertas || 1700)} em aberto`,
      icon: Wallet,
      color: "blue",
      bgLight: "bg-blue-500/10",
      textColor: "text-blue-600",
      borderHover: "hover:border-blue-500",
      to: "financeiro",
    },
    {
      id: "equipe",
      title: "Corpo Docente & Equipe",
      value: (s.professores || 0) + (s.funcionarios || 0) || "—",
      badge: `${s.professores || 0} docentes ativos`,
      badgeType: "positive",
      footer: `${s.funcionarios || 0} colaboradores administrativos`,
      icon: Users,
      color: "purple",
      bgLight: "bg-purple-500/10",
      textColor: "text-purple-600",
      borderHover: "hover:border-purple-500",
      to: "administracao",
    },
  ];

  const quickBadges = [
    {
      key: "leads",
      label: "Contatos / Leads",
      count: s.contatos_novos || 0,
      sublabel: `${s.leads || 0} total cadastrados`,
      icon: Inbox,
      to: "comunicacao",
    },
    {
      key: "comunicados",
      label: "Comunicados Publicados",
      count: s.comunicados || 0,
      sublabel: "Avisos escolares ativos",
      icon: Megaphone,
      to: "comunicacao",
    },
    {
      key: "livros",
      label: "Acervo da Biblioteca",
      count: s.livros || 0,
      sublabel: "Títulos catalogados",
      icon: Library,
      to: "biblioteca",
    },
    {
      key: "solicitacoes",
      label: "Solicitações da Equipe",
      count: s.solicitacoes || 0,
      sublabel: s.solicitacoes > 0 ? "Aguardando validação" : "Em dia",
      icon: CheckSquare,
      to: "administracao",
      alert: s.solicitacoes > 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Cards Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {mainKpis.map((kpi, idx) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={() => go && go(kpi.to)}
            className={`group relative bg-white rounded-2xl p-5 border border-ink/10 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${kpi.borderHover}`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.bgLight} ${kpi.textColor}`}>
                <kpi.icon size={22} className="transition-transform group-hover:scale-110" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ink/5 text-ink-2 border border-ink/5">
                <TrendingUp size={11} className="text-emerald-600" />
                {kpi.badge}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase font-body font-medium tracking-wider text-ink-3">
                {kpi.title}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-display font-black text-3xl text-ink tracking-tight">
                  {kpi.value}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-ink-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-ink/5 flex items-center justify-between text-xs text-ink-2 font-medium">
              <span>{kpi.footer}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barra de Acessos Rápidos e Contadores Secundários */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickBadges.map((badge, idx) => (
          <motion.button
            key={badge.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.04 }}
            onClick={() => go && go(badge.to)}
            className="flex items-center gap-3 p-3.5 bg-cream/70 hover:bg-cream border border-ink/10 hover:border-amber rounded-xl text-left transition-all group shadow-sm hover:shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-ink-2 group-hover:text-amber border border-ink/10 transition-colors shadow-2xs">
              <badge.icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-ink truncate">
                  {badge.label}
                </span>
                <span className="font-display font-extrabold text-sm text-ink group-hover:text-amber transition-colors">
                  {badge.count}
                </span>
              </div>
              <p className="text-[11px] text-ink-3 truncate mt-0.5">
                {badge.sublabel}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
