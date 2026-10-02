import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Award } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-ink/10 text-xs">
        <p className="font-bold text-ink mb-1">{data.area}</p>
        <p className="text-ink-2">
          Média Geral: <span className="font-extrabold text-amber">{data.nota}</span> / 10.0
        </p>
      </div>
    );
  }
  return null;
};

export const BnccSkillsRadar = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { area: 'Linguagens & Com.', nota: 9.3, fullMark: 10 },
    { area: 'Raciocínio Lógico', nota: 8.9, fullMark: 10 },
    { area: 'Ciências Natureza', nota: 8.6, fullMark: 10 },
    { area: 'Ciências Humanas', nota: 9.1, fullMark: 10 },
    { area: 'Socioemocional', nota: 9.7, fullMark: 10 },
    { area: 'Cultura & Artes', nota: 9.5, fullMark: 10 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between h-[360px]">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber/10 text-amber">
              <Award size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">
              Radar de Competências BNCC
            </h3>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Desempenho pedagógico nas 6 dimensões de aprendizagem
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Nota Geral 9.2
        </span>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#00000010" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: '#4B5563', fontSize: 10.5, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: '#9CA3AF', fontSize: 9 }}
              tickCount={4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Desempenho Favo"
              dataKey="nota"
              stroke="#E5A93C"
              strokeWidth={2}
              fill="#E5A93C"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-ink/5 flex items-center justify-between text-[11px] text-ink-3">
        <span>Avaliações formativas do 1º Trimestre</span>
        <span className="text-amber font-semibold">Alinhado à BNCC</span>
      </div>
    </div>
  );
};
