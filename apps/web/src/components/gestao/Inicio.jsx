import React, { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "@/lib/auth";
import { API } from "@/lib/api";

import { PeriodFilter } from "./dashboard/PeriodFilter";
import { DashboardKpis } from "./dashboard/DashboardKpis";
import { FrequenciaChart } from "./dashboard/FrequenciaChart";
import { SegmentosDonutChart } from "./dashboard/SegmentosDonutChart";
import { BnccSkillsRadar } from "./dashboard/BnccSkillsRadar";
import { FinanceiroFlowChart } from "./dashboard/FinanceiroFlowChart";
import { RecentActivities } from "./dashboard/RecentActivities";

export const Inicio = ({ go }) => {
  const [s, setS] = useState(null);
  const [period, setPeriod] = useState("mes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/gestao/stats`, authHeader())
      .then((r) => setS(r.data))
      .catch((err) => console.error("Erro ao carregar estatísticas:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="gestao-inicio" className="space-y-6 pb-8">
      {/* 1. Cabeçalho de Boas-vindas e Seletor de Período */}
      <PeriodFilter activePeriod={period} onSelectPeriod={setPeriod} />

      {/* 2. KPIs Consolidados (4 Primários + 4 Acessos Rápidos) */}
      <DashboardKpis stats={s} go={go} />

      {/* 3. Grid de Gráficos Impecáveis (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Gráfico 1: Frequência Semanal (AreaChart) */}
        <FrequenciaChart data={s?.frequenciaSemanal} />

        {/* Gráfico 2: Distribuição por Segmento (Donut PieChart) */}
        <SegmentosDonutChart
          data={s?.distribuicaoSegmentos}
          totalAlunos={s?.alunos}
        />

        {/* Gráfico 3: Radar de Competências BNCC (RadarChart) */}
        <BnccSkillsRadar data={s?.competenciasBNCC} />

        {/* Gráfico 4: Fluxo Financeiro Semestral (BarChart) */}
        <FinanceiroFlowChart data={s?.fluxoFinanceiro} />
      </div>

      {/* 4. Linha do Tempo de Atividades Recentes e Atalhos Rápidos */}
      <RecentActivities activities={s?.atividadesRecentes} go={go} />
    </div>
  );
};
