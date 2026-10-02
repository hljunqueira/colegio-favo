import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DollarSign } from "lucide-react";

const brl = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-ink/10 text-xs">
        <p className="font-bold text-ink mb-1.5">{label} / 2026</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-ink-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-extrabold text-ink">{brl(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const FinanceiroFlowChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { mes: 'Mai', recebido: 14500, pendente: 1200 },
    { mes: 'Jun', recebido: 15800, pendente: 950 },
    { mes: 'Jul', recebido: 13900, pendente: 1400 },
    { mes: 'Ago', recebido: 16500, pendente: 800 },
    { mes: 'Set', recebido: 17200, pendente: 1100 },
    { mes: 'Out', recebido: 18400, pendente: 1700 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between h-[360px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
              <DollarSign size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">
              Fluxo Financeiro Semestral
            </h3>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Recebimento de mensalidades vs valores em aberto
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Últimos 6 meses
        </span>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000a" />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
            />
            <Bar
              dataKey="recebido"
              name="Recebido"
              fill="#2563EB"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="pendente"
              name="Em Aberto"
              fill="#F59E0B"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
