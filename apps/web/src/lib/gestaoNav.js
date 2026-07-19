import {
  LayoutDashboard, Users, GraduationCap, BookOpen, UserCog, Layers, BookMarked,
  ClipboardList, CalendarDays, FileBarChart, ClipboardCheck, PencilRuler,
  NotebookPen, FolderOpen, AlertTriangle, Megaphone, Inbox, MessagesSquare,
  PartyPopper, Wallet, TrendingUp, TrendingDown, QrCode, AlertCircle, LineChart,
  Library, BookCopy, CalendarCheck, DoorOpen, ShieldCheck, HeartPulse, Pill,
  UserPlus, Fingerprint, ScrollText, Plug, Settings, RefreshCw, ArrowLeftRight,
} from "lucide-react";

// done: true => functional module. done:false => design-consistent scaffold.
import { Globe } from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Visão geral",
    items: [{ key: "inicio", label: "Dashboard", icon: LayoutDashboard, done: true }],
  },
  {
    label: "Secretaria",
    items: [
      { key: "alunos", label: "Alunos", icon: GraduationCap, done: true },
      { key: "turmas", label: "Turmas", icon: Users, done: true },
      { key: "professores", label: "Professores", icon: UserCog, done: true },
      { key: "responsaveis", label: "Responsáveis", icon: Users, done: true },
      { key: "funcionarios", label: "Funcionários", icon: UserCog, done: false },
      { key: "series", label: "Séries", icon: Layers, done: false },
      { key: "disciplinas", label: "Disciplinas", icon: BookOpen, done: false },
      { key: "matriculas", label: "Matrículas", icon: UserPlus, done: false },
      { key: "rematriculas", label: "Rematrículas", icon: RefreshCw, done: false },
      { key: "transferencias", label: "Transferências", icon: ArrowLeftRight, done: false },
      { key: "calendario", label: "Calendário", icon: CalendarDays, done: false },
      { key: "rel-sec", label: "Relatórios", icon: FileBarChart, done: false },
    ],
  },
  {
    label: "Pedagógico",
    items: [
      { key: "planoaula", label: "Plano de Aula", icon: PencilRuler, done: false },
      { key: "diario", label: "Diário de Classe", icon: NotebookPen, done: false },
      { key: "chamada", label: "Chamada / Frequência", icon: ClipboardCheck, done: false },
      { key: "notas", label: "Notas & Avaliações", icon: BookMarked, done: false },
      { key: "atividades", label: "Atividades", icon: ClipboardList, done: false },
      { key: "materiais", label: "Materiais", icon: FolderOpen, done: false },
      { key: "agenda-ped", label: "Agenda Escolar", icon: CalendarDays, done: false },
      { key: "ocorrencias", label: "Ocorrências", icon: AlertTriangle, done: false },
    ],
  },
  {
    label: "Comunicação",
    items: [
      { key: "comunicados", label: "Comunicados", icon: Megaphone, done: true },
      { key: "contatos", label: "Contatos & Matrículas", icon: Inbox, done: true },
      { key: "mensagens", label: "Mensagens / Chat", icon: MessagesSquare, done: false },
      { key: "eventos", label: "Eventos", icon: PartyPopper, done: false },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { key: "financeiro", label: "Mensalidades", icon: Wallet, done: true },
      { key: "receitas", label: "Receitas", icon: TrendingUp, done: false },
      { key: "despesas", label: "Despesas", icon: TrendingDown, done: false },
      { key: "pix", label: "PIX & Boletos", icon: QrCode, done: false },
      { key: "inadimplencia", label: "Inadimplência", icon: AlertCircle, done: false },
      { key: "fluxo", label: "Fluxo de Caixa", icon: LineChart, done: false },
      { key: "rel-fin", label: "Relatórios", icon: FileBarChart, done: false },
    ],
  },
  {
    label: "Biblioteca",
    items: [
      { key: "livros", label: "Acervo", icon: Library, done: false },
      { key: "emprestimos", label: "Empréstimos", icon: BookCopy, done: false },
      { key: "reservas", label: "Reservas", icon: CalendarCheck, done: false },
    ],
  },
  {
    label: "Portaria & Saúde",
    items: [
      { key: "portaria", label: "Portaria / Visitantes", icon: DoorOpen, done: false },
      { key: "acesso", label: "Controle de Acesso", icon: Fingerprint, done: false },
      { key: "saude", label: "Enfermaria", icon: HeartPulse, done: false },
      { key: "medicamentos", label: "Medicamentos & Alergias", icon: Pill, done: false },
    ],
  },
  {
    label: "Administração",
    items: [
      { key: "site", label: "Site", icon: Globe, done: true },
      { key: "usuarios", label: "Usuários", icon: Users, done: true },
      { key: "perfis", label: "Perfis & Permissões", icon: ShieldCheck, done: false },
      { key: "logs", label: "Logs & Auditoria", icon: ScrollText, done: false },
      { key: "integracoes", label: "Integrações", icon: Plug, done: false },
      { key: "config", label: "Configurações", icon: Settings, done: false },
    ],
  },
];

export const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
