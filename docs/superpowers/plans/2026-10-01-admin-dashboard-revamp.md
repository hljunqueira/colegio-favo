# Reformulação do Dashboard Administrativo (Visão Geral - Colégio Favo)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o Dashboard de Gestão Administrativa (`/gestao`) do Colégio Favo, removendo o banner escuro de mensalidades em aberto e implementando uma interface moderna, executiva e rica em dados visuais, com KPIs consolidados, 4 gráficos dinâmicos Recharts em português (Frequência Escolar, Alunos por Segmento, Radar de Competências BNCC e Fluxo de Recebimento) e feed de atividades recentes.

**Architecture:** Modularizar o componente monolítico `Inicio.jsx` em widgets reutilizáveis e tipados em `apps/web/src/components/gestao/dashboard/` (KPIs, Charts e Timeline). Expandir o serviço NestJS `GestaoService` para fornecer agregados em tempo real do banco de dados (Prisma/PostgreSQL) e séries históricas com fallbacks inteligentes. Preservar o controle de acessos (RBAC) e as funções de navegação `go(key)` já estabelecidas no sistema.

**Tech Stack:** React 19, Recharts 3.6.0, Lucide React 0.516, Framer Motion 11, Tailwind CSS, NestJS 10, Prisma ORM, PostgreSQL 16.

**Spec:** Solicitação de remoção do banner de mensalidades em aberto e criação de dashboard administrativo com gráficos dinâmicos em PT-BR e radar de habilidades pedagógicas/BNCC.

---

## Global Constraints

- **Não quebrar rotas e permissões**: Preservar o chaveamento de views do `Gestao.jsx` (`go("secretaria")`, `go("financeiro")`, etc.) e o RBAC existente.
- **Identidade Visual**: Utilizar a paleta oficial do Colégio Favo:
  - Fundo principal: `bg-cream` (#FFFBF2) e `bg-cream-2` (#F7F2E7)
  - Tons escuros: `bg-dark` (#131E17) e `border-ink/10`
  - Acentos quentes: Amarelo Mel (`#E5A93C` / `text-honey`), Âmbar (`#D97706`), Verde Musgo (`#2D5A27` / `text-moss`)
- **Localização 100% PT-BR**:
  - Valores monetários formatados estritamente em Real Brasileiro (`R$ 1.250,00`).
  - Dias da semana abreviados (Seg, Ter, Qua, Qui, Sex).
  - Meses abreviados (Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez).
- **Responsividade**: Grid fluído adaptável para telas móveis (1 coluna), tablets (2 colunas) e desktops amplos (12 colunas com proporção 8/4 ou 2x2).
- **Gráficos com Recharts**: Utilizar `<ResponsiveContainer width="100%" height={...}>` com componentes desacoplados e tooltips estilizados.

---

## Review Focus

1. **Estado Inicial / Seed Limpo**: Se a base tiver apenas 1 aluno ou valores zerados, os gráficos e KPIs devem renderizar graciosamente com linhas de projeção ou estados ilustrativos sem quebras de layout.
2. **Posicionamento e Tooltips do Recharts**: Garantir que tooltips customizados não cortem nas bordas dos cards nem causem scrollbars indesejados.
3. **Performance e Re-renders**: Evitar chamadas redundantes à API ao alternar filtros rápidos de período ("Hoje", "Esta Semana", "Mês Atual", "Ano Letivo").
4. **Legibilidade e Contraste**: Assegurar tipografia legível (Manrope) e contrastes acessíveis contra o fundo creme e nos cards escuros.
5. **Navegação Rápida**: Cada card ou métrica com clique deve navegar diretamente para o hub correspondente (`secretaria`, `financeiro`, etc.).

---

## Estrutura de Arquivos Planejada

```
apps/backend/src/gestao/
├── gestao.service.ts          # Atualização do getStats() com séries de gráficos e métricas
└── gestao.controller.ts       # Endpoint GET /api/gestao/stats

apps/web/src/components/gestao/
├── Inicio.jsx                 # Ponto de entrada montado em Gestao.jsx (Layout principal)
└── dashboard/
    ├── PeriodFilter.jsx       # Seletor de período rápido (Hoje, Semana, Mês, Ano)
    ├── DashboardKpis.jsx       # 4 Cards principais com sparkline + contadores rápidos
    ├── FrequenciaChart.jsx    # AreaChart semanal de presença escolar
    ├── SegmentosDonutChart.jsx# Donut/PieChart de distribuição de alunos por segmento
    ├── BnccSkillsRadar.jsx    # RadarChart de avaliação das 6 competências BNCC
    ├── FinanceiroFlowChart.jsx# BarChart comparativo de fluxo financeiro (Recebido x Previsto)
    └── RecentActivities.jsx   # Feed cronológico de matrículas, avisos e solicitações
```

---

## Tarefas de Implementação

### Tarefa 1: Atualizar o Backend NestJS para Métricas e Séries de Gráficos

**Arquivos:**
- Modificar: `apps/backend/src/gestao/gestao.service.ts`
- Modificar: `apps/backend/src/gestao/gestao.controller.ts`

- [ ] **Passo 1.1:** Abrir `apps/backend/src/gestao/gestao.service.ts` e expandir o método `getStats()`.
  - Calcular:
    - Agregado real de alunos por segmento/série (`Infantil`, `Fundamental I`, `Fundamental II`).
    - Agregado de inadimplência vs adimplência das mensalidades cadastradas.
    - Estrutura de dados para frequência escolar semanal (`frequenciaSemanal`).
    - Avaliação média de competências BNCC pedagógicas (`competenciasBNCC`).
    - Histórico de faturamento dos últimos 6 meses (`fluxoFinanceiro`).
    - Lista de últimas 5 atividades escolares recentes (`atividadesRecentes`).
- [ ] **Passo 1.2:** Compilar o backend para validar tipagem TypeScript:
  ```powershell
  pnpm run --filter @colegio-favo/backend build
  ```
- [ ] **Passo 1.3:** Reiniciar o processo local do backend na porta 3001 e testar via PowerShell:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:3001/api/gestao/stats"
  ```
- [ ] **Passo 1.4:** Validar que a resposta JSON retorna tanto os contadores legados (`alunos`, `turmas`, etc.) quanto as novas séries de dados para os gráficos.

---

### Tarefa 2: Criar o Seletor de Período e o Grid de KPIs Executivos

**Arquivos:**
- Criar: `apps/web/src/components/gestao/dashboard/PeriodFilter.jsx`
- Criar: `apps/web/src/components/gestao/dashboard/DashboardKpis.jsx`

- [ ] **Passo 2.1:** Criar `PeriodFilter.jsx` com os botões:
  - "Hoje", "Esta Semana", "Mês Atual", "Ano Letivo 2026".
  - Estilização em pills arredondadas com destaque em Honey/Dark.
- [ ] **Passo 2.2:** Criar `DashboardKpis.jsx` contendo:
  - **KPI 1: Alunos Matriculados**: Total ativo, badge de crescimento (+12% vs ano anterior) e taxa de ocupação das salas. Ação `go('secretaria')`.
  - **KPI 2: Frequência Média Escolar**: Média ponderada de presença (ex: 97.2%), badge de status "Excelente". Ação `go('pedagogico')`.
  - **KPI 3: Saúde Financeira**: Valor recebido no mês + valor em aberto (substituindo o antigo banner preto por um card elegante com taxa de adimplência). Ação `go('financeiro')`.
  - **KPI 4: Corpo Docente & Turmas**: Quantidade de professores ativos, turmas ativas e média de alunos por turma. Ação `go('secretaria')`.
  - **Linha de Atalhos Rápidos**: 4 badges compactos (Novos Contatos, Comunicados Enviados, Acervo de Livros, Solicitações Pendentes).
- [ ] **Passo 2.3:** Aplicar micro-animações do Framer Motion com `staggerChildren` para entrada suave.

---

### Tarefa 3: Implementar os Gráficos Recharts em PT-BR

**Arquivos:**
- Criar: `apps/web/src/components/gestao/dashboard/FrequenciaChart.jsx`
- Criar: `apps/web/src/components/gestao/dashboard/SegmentosDonutChart.jsx`
- Criar: `apps/web/src/components/gestao/dashboard/BnccSkillsRadar.jsx`
- Criar: `apps/web/src/components/gestao/dashboard/FinanceiroFlowChart.jsx`

- [ ] **Passo 3.1: FrequenciaChart.jsx (AreaChart)**
  - Gráfico de área com gradiente suave nas cores Âmbar e Musgo.
  - Eixo X com dias da semana (Segunda, Terça, Quarta, Quinta, Sexta).
  - Eixo Y com porcentagem (80% a 100%).
  - Tooltip customizado em PT-BR exibindo presença da Educação Infantil e do Ensino Fundamental.
- [ ] **Passo 3.2: SegmentosDonutChart.jsx (PieChart / Donut)**
  - Gráfico Donut de distribuição dos alunos por segmento: Berçário/Infantil, Fundamental I e Fundamental II.
  - Centro do donut exibindo a contagem total de alunos com tipografia display.
  - Legenda interativa com tags coloridas e porcentagens calculadas.
- [ ] **Passo 3.3: BnccSkillsRadar.jsx (RadarChart de Habilidades Pedagógicas)**
  - Avaliação do desempenho pedagógico médio nas 6 competências essenciais da BNCC:
    1. Linguagens & Comunicação
    2. Raciocínio Lógico & Matemática
    3. Ciências da Natureza & Investigação
    4. Ciências Humanas & Sociedade
    5. Habilidades Socioemocionais
    6. Cultura Digital & Expressão Artística
  - Escala de 0 a 10 com preenchimento translúcido Honey/Amber.
- [ ] **Passo 3.4: FinanceiroFlowChart.jsx (BarChart)**
  - Comparativo dos últimos 6 meses com barras arredondadas:
    - Barra Verde Musgo: Valor Recebido
    - Barra Âmbar: Valor Previsto / Em Aberto
  - Tooltip com formatação BRL (`R$`).

---

### Tarefa 4: Criar o Feed de Atividades Recentes e Solicitações

**Arquivos:**
- Criar: `apps/web/src/components/gestao/dashboard/RecentActivities.jsx`

- [ ] **Passo 4.1:** Desenvolver timeline elegante com ícones contextuais:
  - Matrícula / Rematrícula (Ícone azul de graduação)
  - Comunicado enviado via WhatsApp/Painel (Ícone âmbar de megafone)
  - Mensalidade quitada (Ícone verde de carteira)
  - Solicitação pendente de declaração/histórico (Ícone vermelho de alerta)
- [ ] **Passo 4.2:** Incluir botão de atalho rápido em cada item (ex: "Ver Matrícula", "Analisar Solicitação").

---

### Tarefa 5: Integrar tudo no `Inicio.jsx` e Conectar com o Backend

**Arquivos:**
- Modificar: `apps/web/src/components/gestao/Inicio.jsx`

- [ ] **Passo 5.1:** Substituir o antigo banner preto de mensalidades e o grid simples de 9 caixas pela nova composição estruturada:
  - **Header do Dashboard**: Título, data atual por extenso em PT-BR (ex: *"Quinta-feira, 01 de Outubro de 2026"*) e o seletor `PeriodFilter`.
  - **Bloco Superior**: `DashboardKpis`.
  - **Grid de Gráficos (Desktop 2x2)**:
    - Coluna Esquerda: `FrequenciaChart` e `BnccSkillsRadar`.
    - Coluna Direita: `SegmentosDonutChart` e `FinanceiroFlowChart`.
  - **Bloco Inferior / Lateral**: `RecentActivities`.
- [ ] **Passo 5.2:** Conectar requisição `GET ${API}/gestao/stats` com tratamento de loading em skeleton pulsante e tratamento de erros.
- [ ] **Passo 5.3:** Validar que todos os botões de ação e cards disparam `go(key)` para navegar fluidamente aos módulos filhos.

---

### Tarefa 6: Verificação de Build, Responsividade e Polimento Visual

**Arquivos:**
- Teste e verificação geral: `apps/web/src/components/gestao/`

- [ ] **Passo 6.1:** Rodar o build de produção do frontend para garantir ausência de erros de compilação ou dependências:
  ```powershell
  pnpm run --filter @colegio-favo/web build
  ```
- [ ] **Passo 6.2:** Acessar [`http://localhost:3000/gestao`](http://localhost:3000/gestao) no navegador.
- [ ] **Passo 6.3:** Testar responsividade em resoluções de desktop (1920x1080, 1366x768) e mobile (375x667).
- [ ] **Passo 6.4:** Testar interatividade dos gráficos: hover nos tooltips, transições do radar, alternância de período e links de navegação.
