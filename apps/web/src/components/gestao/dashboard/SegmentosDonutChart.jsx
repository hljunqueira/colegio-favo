import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-ink/10 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-bold text-ink">{data.segmento}</p>
        </div>
        <p className="text-ink-2 font-medium">
          Matriculados: <span className="font-bold text-ink">{data.alunos} alunos</span>
        </p>
        <p className="text-ink-2 font-medium">
          Participação: <span className="font-bold text-amber">{data.percentual}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const SegmentosDonutChart = ({ data, totalAlunos }) => {
  const chartData = data && data.length > 0 ? data : [
    { segmento: 'Ed. Infantil', alunos: 35, percentual: 35, color: '#E5A93C' },
    { segmento: 'Fundamental I', alunos: 45, percentual: 45, color: '#2563EB' },
    { segmento: 'Fundamental II', alunos: 20, percentual: 20, color: '#2D5A27' },
  ];

  const total = totalAlunos || chartData.reduce((acc, curr) => acc + (curr.alunos || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between h-[360px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber/10 text-amber">
              <PieIcon size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">
              Distribuição por Segmento
            </h3>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Composição das etapas de ensino
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber/10 text-amber border border-amber/20">
          {total} Alunos
        </span>
      </div>

      <div className="relative flex-1 w-full min-h-[190px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="alunos"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Informação central do Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-black text-2xl text-ink leading-tight">
            {total}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-3">
            Alunos
          </span>
        </div>
      </div>

      {/* Legenda Customizada com Indicadores e Percentuais */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-ink/5">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-semibold text-ink truncate">
                {item.segmento}
              </span>
            </div>
            <span className="text-xs font-extrabold text-ink mt-0.5">
              {item.alunos} <span className="text-[10px] text-ink-3 font-normal">({item.percentual}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
