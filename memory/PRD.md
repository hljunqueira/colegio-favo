# PRD — Centro Educacional Favo de Mel

## Problem Statement
Plataforma (PT-BR) para o "Centro Educacional Favo de Mel" (Colégio Favo), escola em Balneário
Arroio do Silva - SC que oferece Educação Infantil e Ensino Fundamental (Berçário ao 9º ano).
Slogan: "A educação em que nós acreditamos". Google 4,4 / 47 avaliações. Tel (48) 99627-5127.
Endereço: Av. Florianópolis - Centro, Balneário Arroio do Silva - SC, 88914-000.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui, framer-motion + lenis, sonner. Fonts: Cabinet Grotesk / Cormorant Garamond / Manrope.
- Backend: FastAPI + Motor (MongoDB). JWT Bearer auth (bcrypt). Rotas sob /api.
- Art direction "Golden Hive": amber/honey + moss/dark + cream. Logo real (abelha/favo).

## Personas
- Pais/responsáveis pesquisando a escola (site) e acompanhando o filho (portal).
- Administração/secretaria gerindo alunos, turmas, financeiro, comunicados (ERP).

## Implemented — Phase 1 (2026-07-18)
- Site institucional animado (Hero cinético, Marquee, Manifesto, Segmentos Berçário→9º ano, Galeria, Contato, Footer).
- Formulário de contato/matrícula persistido; /admin login + dashboard (leads + comunicados). Backend 14/14.

## Implemented — Phase 2 (2026-07-18)
- Logo real aplicada em site/portal/ERP + favicon/título.
- CTA flutuante de WhatsApp "Fale conosco agora" (wa.me) na home.
- Portal do Responsável (estilo SATC): /portal + /portal/app (Mural/Comunicados, Agenda c/ calendário, Boletim, Financeiro, Cardápio).
- ERP "Gestão Favo" em /gestao (role admin) com sidebar por módulos.
  Funcionais: Dashboard, Alunos (CRUD+busca+arquivar), Turmas, Professores, Responsáveis, Comunicados (→ portal),
  Contatos/leads, Mensalidades/Financeiro, Usuários.
  Scaffolds "Em desenvolvimento" (design pronto): funcionários, séries, disciplinas, matrículas, rematrículas,
  transferências, calendário, relatórios, plano de aula, diário, chamada, notas, atividades, materiais, agenda,
  ocorrências, mensagens, eventos, receitas, despesas, PIX/boletos, inadimplência, fluxo de caixa, biblioteca
  (acervo/empréstimos/reservas), portaria, controle de acesso, enfermaria, medicamentos/alergias, perfis, logs,
  integrações, configurações.
- Dados demo semeados. Tested: backend 26/26, todos os fluxos front (testing_agent iteration_3), incl. guards + cross-feature.

## Credenciais
- Admin/ERP: admin@favodemel.com.br / Favo@2025 -> /gestao
- Responsável/Portal: responsavel@favodemel.com.br / Favo@2025 -> /portal/app

## Backlog / Próximas fases (P0→P2)
- P0 (ativar scaffolds de maior valor): Matrículas (wizard + documentos), Financeiro completo (PIX/boletos,
  inadimplência, fluxo de caixa), Notas/Boletim editável por professor, Chamada/Frequência.
- P1: Diário de classe, Plano de aula (BNCC), Mensagens escola↔família, Calendário letivo, Relatórios/exportações.
- P1 técnicos: rate-limit/lockout no login; migrar on_event → lifespan; split server.py em routers;
  PATCH com Pydantic + enum + 404; rollback de updates otimistas; CORS explícito.
- P2: Biblioteca, Portaria/visitantes, Saúde/medicamentos, Perfis & Permissões, Logs/Auditoria, Integrações.
- P2 negócio: notificação por e-mail em novos leads/comunicados (Resend); PWA/push; multi-perfil (professor/coordenação).
