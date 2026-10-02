import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Megaphone,
  Wallet,
  CheckSquare,
  ArrowUpRight,
  Clock,
  PlusCircle,
  FileText,
  CalendarCheck,
  UserPlus,
} from "lucide-react";

export const RecentActivities = ({ activities, go }) => {
  const getIconAndStyle = (tipo) => {
    switch (tipo) {
      case "matricula":
        return {
          icon: GraduationCap,
          color: "text-emerald-600",
          bg: "bg-emerald-500/10",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "Matrícula",
        };
      case "aviso":
        return {
          icon: Megaphone,
          color: "text-amber",
          bg: "bg-amber/10",
          badge: "bg-amber/10 text-amber border-amber/20",
          label: "Comunicado",
        };
      case "financeiro":
        return {
          icon: Wallet,
          color: "text-blue-600",
          bg: "bg-blue-500/10",
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          label: "Financeiro",
        };
      case "solicitacao":
      default:
        return {
          icon: CheckSquare,
          color: "text-purple-600",
          bg: "bg-purple-500/10",
          badge: "bg-purple-50 text-purple-700 border-purple-200",
          label: "Solicitação",
        };
    }
  };

  const quickActions = [
    {
      title: "Nova Matrícula",
      desc: "Cadastrar aluno na secretaria",
      icon: UserPlus,
      to: "secretaria",
      color: "hover:border-amber hover:text-amber",
    },
    {
      title: "Publicar Comunicado",
      desc: "Disparar aviso aos pais e alunos",
      icon: Megaphone,
      to: "comunicacao",
      color: "hover:border-blue-500 hover:text-blue-600",
    },
    {
      title: "Controle Financeiro",
      desc: "Visualizar boletos e liquidações",
      icon: Wallet,
      to: "financeiro",
      color: "hover:border-emerald-500 hover:text-emerald-600",
    },
    {
      title: "Planejamento Pedagógico",
      desc: "Turmas, grades e planos de aula",
      icon: CalendarCheck,
      to: "pedagogico",
      color: "hover:border-purple-500 hover:text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Feed de Atividades Recentes (2 colunas) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-ink/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-ink/5 text-ink">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  Atividades & Ocorrências Recentes
                </h3>
                <p className="text-xs text-ink-3">
                  Registro cronológico das últimas ações no sistema escolar
                </p>
              </div>
            </div>
            <span className="text-xs text-ink-3 font-medium">Tempo real</span>
          </div>

          <div className="divide-y divide-ink/5 mt-2">
            {(activities || []).map((item, idx) => {
              const meta = getIconAndStyle(item.tipo);
              const ItemIcon = meta.icon;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => go && go(item.to)}
                  className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-ink/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}
                    >
                      <ItemIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink truncate">
                          {item.titulo}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badge} shrink-0`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-3 truncate mt-0.5">
                        {item.subtitulo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-ink-3 font-medium hidden sm:inline">
                      {item.tempo}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-ink/5 flex items-center justify-center text-ink-2 group-hover:bg-amber group-hover:text-dark transition-colors">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ações Rápidas (1 coluna) */}
      <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-ink/5">
            <div className="p-1.5 rounded-lg bg-amber/10 text-amber">
              <PlusCircle size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ink">
                Ações Rápidas de Gestão
              </h3>
              <p className="text-xs text-ink-3">
                Atalhos diretos para operações frequentes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 mt-3">
            {quickActions.map((act, i) => (
              <button
                key={i}
                onClick={() => go && go(act.to)}
                className={`flex items-center justify-between p-3 rounded-xl border border-ink/10 bg-cream/50 text-left transition-all group ${act.color} hover:shadow-xs`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-ink-2 group-hover:text-current border border-ink/5 shadow-2xs">
                    <act.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink group-hover:text-current">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-ink-3">
                      {act.desc}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-ink-3 group-hover:text-current group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
