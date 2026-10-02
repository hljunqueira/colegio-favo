import React from "react";
import { Calendar } from "lucide-react";

export const PeriodFilter = ({ activePeriod, onSelectPeriod }) => {
  const periods = [
    { id: "hoje", label: "Hoje" },
    { id: "semana", label: "Esta Semana" },
    { id: "mes", label: "Mês Atual" },
    { id: "ano", label: "Ano Letivo 2026" },
  ];

  const todayStr = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const formattedDate = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-ink/10">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ano Letivo 2026 Ativo
          </span>
          <span className="text-xs text-ink-3 hidden sm:inline">•</span>
          <span className="text-xs text-ink-3 font-medium hidden sm:inline-flex items-center gap-1">
            <Calendar size={13} className="text-amber" />
            {formattedDate}
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-ink tracking-tight mt-1">
          Painel de Gestão Integrada
        </h1>
      </div>

      {/* Seletor de Período */}
      <div className="flex items-center p-1 bg-ink/5 rounded-xl border border-ink/10 self-start md:self-auto overflow-x-auto max-w-full">
        {periods.map((p) => {
          const isActive = activePeriod === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-body transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-ink font-semibold shadow-sm border border-ink/5"
                  : "text-ink-2 hover:text-ink hover:bg-white/50"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
