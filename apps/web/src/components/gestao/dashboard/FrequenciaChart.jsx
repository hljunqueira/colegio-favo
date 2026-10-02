import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-ink/10 text-xs">
        <p className="font-bold text-ink mb-1.5">{label}-feira</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-ink-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-extrabold text-ink">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const FrequenciaChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { dia: 'Seg', infantil: 96.2, fundamental: 97.5, meta: 95 },
    { dia: 'Ter', infantil: 98.1, fundamental: 98.6, meta: 95 },
    { dia: 'Qua', infantil: 97.4, fundamental: 96.8, meta: 95 },
    { dia: 'Qui', infantil: 98.9, fundamental: 99.2, meta: 95 },
    { dia: 'Sex', infantil: 95.8, fundamental: 96.4, meta: 95 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between h-[360px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Activity size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">
              Frequência Semanal por Segmento
            </h3>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Acompanhamento diário das turmas vs meta escolar (95%)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Média 97.4%
        </span>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInfantil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E5A93C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E5A93C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorFundamental" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000a" />
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              domain={[90, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="infantil"
              name="Ed. Infantil"
              stroke="#E5A93C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorInfantil)"
            />
            <Area
              type="monotone"
              dataKey="fundamental"
              name="Ens. Fundamental"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorFundamental)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
