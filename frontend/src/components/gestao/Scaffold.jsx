import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

const PLANNED = {
  funcionarios: ["Cadastro de colaboradores", "Cargos e departamentos", "Documentos e contratos"],
  series: ["Estrutura Berçário ao 9º ano", "Grade curricular por série", "Vínculo com turmas"],
  disciplinas: ["Cadastro de disciplinas", "Carga horária", "Professores responsáveis"],
  matriculas: ["Wizard de matrícula", "Upload de documentos", "Contrato digital"],
  rematriculas: ["Rematrícula em lote", "Reajuste de mensalidade", "Aceite do responsável"],
  transferencias: ["Transferência entre turmas", "Histórico escolar", "Declaração de transferência"],
  calendario: ["Calendário letivo", "Feriados e recessos", "Eventos institucionais"],
  "rel-sec": ["Relatórios de matrícula", "Ata de resultados", "Exportação PDF/Excel"],
  planoaula: ["Editor de plano de aula", "Alinhamento à BNCC", "Aprovação da coordenação"],
  diario: ["Diário de classe digital", "Conteúdo ministrado", "Assinatura eletrônica"],
  chamada: ["Chamada por turma", "Frequência diária", "Alertas de falta"],
  notas: ["Lançamento de notas", "Rubricas e conceitos", "Fechamento de bimestre"],
  atividades: ["Criação de atividades", "Entregas dos alunos", "Correção e feedback"],
  materiais: ["Materiais por disciplina", "Vídeos e arquivos", "Biblioteca digital"],
  "agenda-ped": ["Agenda por turma", "Avaliações e tarefas", "Sincronização com o portal"],
  ocorrencias: ["Registro de ocorrências", "Notificação ao responsável", "Acompanhamento"],
  mensagens: ["Chat escola ↔ família", "Mensagens por turma", "Notificações push"],
  eventos: ["Criação de eventos", "Confirmação de presença", "Galeria pós-evento"],
  receitas: ["Lançamento de receitas", "Categorias", "Conciliação bancária"],
  despesas: ["Contas a pagar", "Centro de custos", "Fornecedores"],
  pix: ["Cobrança via PIX", "Emissão de boletos", "Carnês e parcelamentos"],
  inadimplencia: ["Régua de cobrança", "Lembretes automáticos", "Negociação de dívidas"],
  fluxo: ["Fluxo de caixa", "Projeções", "Gráficos financeiros"],
  "rel-fin": ["DRE simplificado", "Relatórios por período", "Exportações"],
  livros: ["Catálogo do acervo", "ISBN e categorias", "Disponibilidade"],
  emprestimos: ["Empréstimo por aluno", "Devolução e multas", "Histórico"],
  reservas: ["Fila de reservas", "Notificação de disponibilidade", "Renovação"],
  portaria: ["Registro de visitantes", "Entrada e saída", "Crachá temporário"],
  acesso: ["Controle de acesso", "QR Code / biometria", "Liberação de retirada"],
  saude: ["Ficha de saúde", "Ocorrências médicas", "Autorizações"],
  medicamentos: ["Administração de medicamentos", "Mapa de alergias", "Alertas"],
  perfis: ["Perfis de acesso", "Permissões granulares", "Papéis por módulo"],
  logs: ["Logs de sistema", "Trilha de auditoria", "Filtros avançados"],
  integracoes: ["APIs e webhooks", "Integração contábil", "Single Sign-On"],
  config: ["Dados da instituição", "Anos letivos", "Preferências e notificações"],
};

export const Scaffold = ({ item }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} data-testid={`scaffold-${item.key}`}>
    <div className="flex items-center gap-3 mb-6">
      <item.icon className="text-amber" />
      <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">{item.label}</h1>
      <span className="text-xs font-body px-3 py-1 rounded-full bg-honey/30 text-amber font-semibold">Em desenvolvimento</span>
    </div>

    <div className="bg-cream rounded-2xl border border-ink/10 p-8 max-w-2xl">
      <div className="w-12 h-12 hex-clip bg-honey flex items-center justify-center mb-5">
        <Sparkles size={20} className="text-dark" />
      </div>
      <h2 className="font-display font-bold text-xl text-ink mb-2">Módulo {item.label}</h2>
      <p className="font-body text-sm mb-6" style={{ color: "var(--ink-2)" }}>
        Este módulo faz parte do roadmap do sistema de gestão Favo de Mel. A estrutura e o design já estão prontos —
        as funcionalidades serão ativadas nas próximas fases.
      </p>
      <p className="font-body text-xs tracking-widest uppercase text-amber mb-3">Funcionalidades planejadas</p>
      <ul className="space-y-2">
        {(PLANNED[item.key] || ["Planejamento em andamento"]).map((f) => (
          <li key={f} className="flex items-center gap-2 font-body text-sm text-ink">
            <CheckCircle2 size={15} className="text-moss" /> {f}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);
