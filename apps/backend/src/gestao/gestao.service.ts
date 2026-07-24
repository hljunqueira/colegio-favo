import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GestaoService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // 1. Seed Roles com descrições amigáveis
    const defaultRoles = [
      { name: 'ADMIN', description: 'Administrador do Sistema' },
      { name: 'DIRETORIA', description: 'Diretoria Escolar' },
      { name: 'COORDINATOR', description: 'Coordenador Pedagógico' },
      { name: 'TEACHER', description: 'Professor Regente' },
      { name: 'STAFF', description: 'Funcionário Administrativo' },
      { name: 'STUDENT', description: 'Aluno' },
      { name: 'PARENT', description: 'Responsável' }
    ];

    for (const r of defaultRoles) {
      await this.prisma.role.upsert({
        where: { name: r.name },
        update: { description: r.description },
        create: { name: r.name, description: r.description }
      });
    }

    // 2. Seed Permissions
    const defaultPermissions = [
      // Top Level Hubs
      { action: 'view:secretaria', description: 'Secretaria Geral' },
      { action: 'view:pedagogico', description: 'Pedagógico Geral' },
      { action: 'view:comunicacao', description: 'Comunicação Geral' },
      { action: 'view:financeiro', description: 'Financeiro Geral' },
      { action: 'view:biblioteca', description: 'Biblioteca Geral' },
      { action: 'view:portaria_saude', description: 'Portaria & Saúde' },
      { action: 'view:administracao', description: 'Administração Geral' },

      // Secretaria
      { action: 'view:alunos', description: 'Secretaria > Alunos' },
      { action: 'view:responsaveis', description: 'Secretaria > Responsáveis' },
      { action: 'view:turmas', description: 'Secretaria > Turmas' },
      { action: 'view:professores', description: 'Secretaria > Professores' },
      { action: 'view:matriculas', description: 'Secretaria > Matrícula Digital' },
      { action: 'view:series', description: 'Secretaria > Séries & Segmentos' },
      { action: 'view:disciplinas', description: 'Secretaria > Disciplinas' },
      { action: 'view:rematriculas', description: 'Secretaria > Rematrículas' },
      { action: 'view:transferencias', description: 'Secretaria > Transferências' },
      { action: 'view:calendario', description: 'Secretaria > Calendário Acadêmico' },
      { action: 'view:relatorios', description: 'Secretaria > Relatórios' },

      // Pedagógico
      { action: 'view:planoaula', description: 'Pedagógico > Plano de Aula' },
      { action: 'view:diario', description: 'Pedagógico > Diário de Classe' },
      { action: 'view:chamada', description: 'Pedagógico > Chamada / Frequência' },
      { action: 'view:notas', description: 'Pedagógico > Notas & Avaliações' },
      { action: 'view:atividades', description: 'Pedagógico > Atividades' },

      // Comunicação
      { action: 'view:comunicados', description: 'Comunicação > Comunicados' },
      { action: 'view:contatos', description: 'Comunicação > Contatos & Leads' },
      { action: 'view:mensagens', description: 'Comunicação > Mensagens' },
      { action: 'view:eventos', description: 'Comunicação > Eventos' },

      // Financeiro
      { action: 'view:mensalidades', description: 'Financeiro > Mensalidades' },
      { action: 'view:receitas', description: 'Financeiro > Receitas' },
      { action: 'view:despesas', description: 'Financeiro > Despesas' },
      { action: 'view:pix', description: 'Financeiro > PIX & Boletos' },
      { action: 'view:inadimplencia', description: 'Financeiro > Inadimplência' },
      { action: 'view:fluxo', description: 'Financeiro > Fluxo de Caixa' },

      // Biblioteca
      { action: 'view:livros', description: 'Biblioteca > Livros' },
      { action: 'view:emprestimos', description: 'Biblioteca > Empréstimos' },
      { action: 'view:reservas', description: 'Biblioteca > Reservas' },

      // Portaria & Saúde
      { action: 'view:portaria', description: 'Portaria & Saúde > Portaria / Visitantes' },
      { action: 'view:acesso', description: 'Portaria & Saúde > Controle de Acesso' },
      { action: 'view:saude', description: 'Portaria & Saúde > Saúde & Enfermaria' },
      { action: 'view:medicamentos', description: 'Portaria & Saúde > Medicamentos' },

      // Administração
      { action: 'view:funcionarios', description: 'Administração > Funcionários' },
      { action: 'view:usuarios', description: 'Administração > Usuários' },
      { action: 'view:site', description: 'Administração > Site Público' },
      { action: 'view:perfis', description: 'Administração > Perfis & Permissões' },
      { action: 'view:logs', description: 'Administração > Logs & Auditoria' },
      { action: 'view:integracoes', description: 'Administração > Integrações' },
      { action: 'view:config', description: 'Administração > Configurações Gerais' },

      // CRUD Actions
      { action: 'write:alunos', description: 'Criar e editar Alunos' },
      { action: 'delete:alunos', description: 'Remover Alunos' },
      { action: 'write:professores', description: 'Criar e editar Professores' },
      { action: 'delete:professores', description: 'Remover Professores' },
      { action: 'write:turmas', description: 'Criar e editar Turmas' },
      { action: 'delete:turmas', description: 'Remover Turmas' },
      { action: 'write:financeiro', description: 'Lançar e editar Mensalidades' },
      { action: 'delete:financeiro', description: 'Remover Mensalidades' },
      { action: 'write:responsaveis', description: 'Criar e editar Responsáveis' },
      { action: 'delete:responsaveis', description: 'Remover Responsáveis' },
      { action: 'write:matriculas', description: 'Gerenciar Matrículas' },
      { action: 'delete:matriculas', description: 'Remover Matrículas' },
      { action: 'write:series', description: 'Criar e editar Séries' },
      { action: 'delete:series', description: 'Remover Séries' },
      { action: 'write:disciplinas', description: 'Criar e editar Disciplinas' },
      { action: 'delete:disciplinas', description: 'Remover Disciplinas' },
      { action: 'write:planoaula', description: 'Criar e editar Planos de Aula' },
      { action: 'delete:planoaula', description: 'Remover Planos de Aula' },
      { action: 'write:diario', description: 'Lançar Diário de Classe' },
      { action: 'delete:diario', description: 'Remover Diário de Classe' },
      { action: 'write:chamada', description: 'Lançar Chamadas' },
      { action: 'delete:chamada', description: 'Remover Chamadas' },
      { action: 'write:notas', description: 'Lançar Notas' },
      { action: 'delete:notas', description: 'Remover Notas' },
      { action: 'write:atividades', description: 'Criar e editar Atividades' },
      { action: 'delete:atividades', description: 'Remover Atividades' },
      { action: 'write:comunicados', description: 'Criar e editar Comunicados' },
      { action: 'delete:comunicados', description: 'Remover Comunicados' },
      { action: 'write:livros', description: 'Gerenciar Acervo de Livros' },
      { action: 'delete:livros', description: 'Remover Livros' },
      { action: 'write:emprestimos', description: 'Gerenciar Empréstimos' },
      { action: 'delete:emprestimos', description: 'Remover Empréstimos' },
      { action: 'write:reservas', description: 'Gerenciar Reservas de Livros' },
      { action: 'delete:reservas', description: 'Remover Reservas de Livros' },
      { action: 'write:portaria', description: 'Registrar Entrada/Saída Portaria' },
      { action: 'delete:portaria', description: 'Remover Registros da Portaria' },
      { action: 'write:saude', description: 'Registrar Atendimentos de Saúde' },
      { action: 'delete:saude', description: 'Remover Registros de Saúde' },
      { action: 'write:funcionarios', description: 'Criar e editar Funcionários' },
      { action: 'delete:funcionarios', description: 'Remover Funcionários' },
      { action: 'write:usuarios', description: 'Criar e editar Usuários do Sistema' },
      { action: 'delete:usuarios', description: 'Remover Usuários do Sistema' },
      { action: 'write:site', description: 'Editar Configurações do Site' },
      { action: 'delete:site', description: 'Remover Dados do Site' },
      { action: 'write:perfis', description: 'Gerenciar Perfis & Cargos' },
      { action: 'delete:perfis', description: 'Remover Perfis & Cargos' },
      { action: 'write:config', description: 'Alterar Configurações Gerais' }
    ];

    for (const p of defaultPermissions) {
      await this.prisma.permission.upsert({
        where: { action: p.action },
        update: { description: p.description },
        create: { action: p.action, description: p.description }
      });
    }
  }

  // 1. Stats Geral do Dashboard
  async getStats() {
    const totalAlunos = await this.prisma.aluno.count({
      where: { status: 'ativo' }
    });

    const totalProfessores = await this.prisma.professor.count();
    const totalTurmas = await this.prisma.turma.count();
    const contatosNovos = await this.prisma.lead.count({
      where: { status: 'novo' },
    });
    const totalLeads = await this.prisma.lead.count();
    const comunicados = await this.prisma.aviso.count();
    const totalFuncionarios = await this.prisma.user.count({
      where: {
        OR: [
          { role: { name: { equals: 'STAFF', mode: 'insensitive' } } },
          { role: { name: { equals: 'FUNCIONARIO', mode: 'insensitive' } } }
        ]
      }
    });
    const totalLivros = await this.prisma.livro.count();
    const totalUsuarios = await this.prisma.user.count();
    const solicitacoesPendentes = await this.prisma.solicitacao.count({
      where: { status: 'pendente' }
    });

    const financeiroAberto = await this.prisma.financeiro.findMany({
      where: { status: 'aberto' },
    });
    const mensalidadesAbertas = financeiroAberto.reduce((acc, curr) => acc + curr.valor, 0);

    return {
      mensalidades_abertas: mensalidadesAbertas,
      alunos: totalAlunos,
      turmas: totalTurmas,
      professores: totalProfessores,
      contatos_novos: contatosNovos,
      comunicados,
      funcionarios: totalFuncionarios,
      livros: totalLivros,
      usuarios: totalUsuarios,
      leads: totalLeads,
      solicitacoes: solicitacoesPendentes
    };
  }

  // 2. Alunos (CRUD Completo)
  async getAlunos(search: string = '', status?: string) {
    const whereClause: any = {
      OR: search
        ? [
            { user: { name: { contains: search, mode: 'insensitive' } } },
            { matricula: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    } else if (!status && !search) {
      whereClause.status = 'ativo';
    }

    const alunos = await this.prisma.aluno.findMany({
      where: whereClause,
      include: {
        user: true,
        responsavel: {
          include: { user: true }
        },
        turma: true,
        anamnese: true
      },
      orderBy: { user: { name: 'asc' } },
    });

    return alunos.map((a) => ({
      id: a.id,
      name: a.user?.name || 'Sem Nome',
      matricula: a.matricula,
      status: a.status,
      responsavel_nome: a.responsavel?.user?.name || '—',
      responsavel_email: a.responsavel?.user?.email || '—',
      responsavel_telefone: a.responsavel?.telefone || '—',
      turma: a.turma?.nome || 'Sem Turma',
      turmaId: a.turmaId,
      responsavelId: a.responsavelId,
      fichaAnamnese: a.anamnese || null
    }));
  }

  async createAluno(data: any) {
    const studentRole = await this.prisma.role.findUnique({
      where: { name: 'STUDENT' },
    });
    if (!studentRole) throw new BadRequestException('Role STUDENT não configurada no sistema.');

    // 1. Criar ou validar Responsável
    let responsavelId = data.responsavelId;
    if (!responsavelId) {
      if (!data.responsavelCpf) throw new BadRequestException('CPF do responsável é obrigatório para novos cadastros.');
      
      // Cria usuário do responsável
      const parentRole = await this.prisma.role.findUnique({ where: { name: 'PARENT' } });
      if (!parentRole) throw new BadRequestException('Role PARENT não configurada.');

      const parentUser = await this.prisma.user.create({
        data: {
          name: data.responsavelNome,
          email: data.responsavelEmail || `${data.responsavelCpf.replace(/\D/g, '')}@favo.com.br`,
          phone: data.responsavelTelefone || undefined,
          password: 'Favo@' + data.responsavelCpf.replace(/\D/g, '').substring(0, 4), // Favo@+4digitos cpf
          roleId: parentRole.id,
        }
      });

      const responsavel = await this.prisma.responsavel.create({
        data: {
          userId: parentUser.id,
          cpf: data.responsavelCpf,
          telefone: data.responsavelTelefone || '',
          enderecoLogradouro: data.enderecoLogradouro || '',
          enderecoNumero: data.enderecoNumero || '',
          enderecoBairro: data.enderecoBairro || '',
          enderecoCidade: data.enderecoCidade || '',
          enderecoEstado: data.enderecoEstado || '',
          enderecoCep: data.enderecoCep || '',
        }
      });
      responsavelId = responsavel.id;
    }

    // 2. Criar Usuário do Aluno
    const matricula = data.matricula || String(Math.floor(100000 + Math.random() * 900000));
    const studentUser = await this.prisma.user.create({
      data: {
        name: data.name,
        matricula: matricula,
        password: 'Favo@' + matricula.substring(0, 4), // Favo@ + 4 digitos da matricula
        roleId: studentRole.id,
      }
    });

    // 3. Criar Aluno perfil
    const aluno = await this.prisma.aluno.create({
      data: {
        userId: studentUser.id,
        matricula: matricula,
        responsavelId: responsavelId,
        turmaId: data.turmaId,
        status: 'ativo'
      }
    });

    // 4. Criar Ficha Anamnese Vazia
    await this.prisma.fichaAnamnese.create({
      data: {
        alunoId: aluno.id,
        restricoesAlimentares: data.restricoesAlimentares || '',
        alergias: data.alergias || '',
        medicamentosContinuos: data.medicamentosContinuos || '',
        tipoSanguineo: data.tipoSanguineo || '',
        contatoEmergencia: data.contatoEmergencia || data.responsavelTelefone || '',
        observacoesMedicas: data.observacoesMedicas || '',
      }
    });

    // 5. Automação Financeira: 12 parcelas automáticas
    const anoCorrente = new Date().getFullYear();
    const parcelas = [];
    for (let mes = 1; mes <= 12; mes++) {
      const vencimento = new Date(anoCorrente, mes - 1, 10);
      parcelas.push({
        aluno: data.name,
        ref: `${mes.toString().padStart(2, '0')}/${anoCorrente}`,
        vencimento: vencimento.toLocaleDateString('pt-BR'),
        valor: data.valorMensalidade || 850.0,
        status: 'aberto'
      });
    }
    await this.prisma.financeiro.createMany({ data: parcelas });

    return aluno;
  }

  async updateAluno(id: string, data: any) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');

    // Atualizar User do Aluno
    await this.prisma.user.update({
      where: { id: aluno.userId },
      data: { name: data.name }
    });

    // Atualizar perfil Aluno
    await this.prisma.aluno.update({
      where: { id },
      data: {
        turmaId: data.turmaId,
        responsavelId: data.responsavelId
      }
    });

    // Atualizar Ficha Anamnese
    if (data.fichaAnamnese) {
      await this.prisma.fichaAnamnese.upsert({
        where: { alunoId: id },
        update: {
          restricoesAlimentares: data.fichaAnamnese.restricoesAlimentares || '',
          alergias: data.fichaAnamnese.alergias || '',
          medicamentosContinuos: data.fichaAnamnese.medicamentosContinuos || '',
          tipoSanguineo: data.fichaAnamnese.tipoSanguineo || '',
          contatoEmergencia: data.fichaAnamnese.contatoEmergencia || '',
          observacoesMedicas: data.fichaAnamnese.observacoesMedicas || '',
        },
        create: {
          alunoId: id,
          restricoesAlimentares: data.fichaAnamnese.restricoesAlimentares || '',
          alergias: data.fichaAnamnese.alergias || '',
          medicamentosContinuos: data.fichaAnamnese.medicamentosContinuos || '',
          tipoSanguineo: data.fichaAnamnese.tipoSanguineo || '',
          contatoEmergencia: data.fichaAnamnese.contatoEmergencia || '',
          observacoesMedicas: data.fichaAnamnese.observacoesMedicas || '',
        }
      });
    }

    return { id, success: true };
  }

  async deleteAluno(id: string) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');

    // Soft Delete (Arquivar)
    await this.prisma.aluno.update({
      where: { id },
      data: { status: 'arquivado' }
    });

    return { success: true };
  }

  // 3. Professores (CRUD Completo)
  async getProfessores() {
    const professores = await this.prisma.professor.findMany({
      include: {
        user: true
      },
      orderBy: { user: { name: 'asc' } }
    });

    return professores.map((p) => ({
      id: p.id,
      name: p.user.name,
      email: p.user.email || '—',
      disciplina: p.disciplina,
      telefone: p.telefone,
      userId: p.userId
    }));
  }

  async createProfessor(data: any) {
    const teacherRole = await this.prisma.role.findUnique({ where: { name: 'TEACHER' } });
    if (!teacherRole) throw new BadRequestException('Role TEACHER não configurada.');

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.telefone,
        password: 'Favo@' + (data.telefone ? data.telefone.slice(-4) : '2025'),
        roleId: teacherRole.id,
      }
    });

    return this.prisma.professor.create({
      data: {
        userId: user.id,
        telefone: data.telefone || '',
        disciplina: data.disciplina || 'Geral',
      }
    });
  }

  async updateProfessor(id: string, data: any) {
    const prof = await this.prisma.professor.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!prof) throw new NotFoundException('Professor não encontrado.');

    await this.prisma.user.update({
      where: { id: prof.userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.telefone
      }
    });

    await this.prisma.professor.update({
      where: { id },
      data: {
        telefone: data.telefone || '',
        disciplina: data.disciplina || 'Geral'
      }
    });

    return { id, success: true };
  }

  async deleteProfessor(id: string) {
    const prof = await this.prisma.professor.findUnique({ where: { id } });
    if (!prof) throw new NotFoundException('Professor não encontrado.');

    // Exclusão completa em cascata via cascade do banco
    await this.prisma.user.delete({ where: { id: prof.userId } });
    return { success: true };
  }

  // 4. Turmas (CRUD Completo)
  async getTurmas() {
    return this.prisma.turma.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async createTurma(body: any) {
    return this.prisma.turma.create({
      data: {
        nome: body.nome,
        serie: body.serie || '',
        turno: body.turno || 'Matutino',
        ano: body.ano || '2026',
        professor: body.professor || 'Não atribuído',
      },
    });
  }

  async updateTurma(id: string, body: any) {
    return this.prisma.turma.update({
      where: { id },
      data: {
        nome: body.nome,
        serie: body.serie,
        turno: body.turno,
        ano: body.ano,
        professor: body.professor,
      }
    });
  }

  async deleteTurma(id: string) {
    // Verificar se há alunos ATIVOS matriculados nesta turma
    const activeAlunosCount = await this.prisma.aluno.count({ 
      where: { turmaId: id, status: 'ativo' } 
    });
    if (activeAlunosCount > 0) {
      throw new BadRequestException(`Não é possível excluir uma turma que possui ${activeAlunosCount} aluno(s) ativo(s) vinculado(s). Remova ou transfira os alunos antes.`);
    }

    // Desvincular alunos arquivados/inativos para permitir exclusão limpa da turma
    await this.prisma.aluno.updateMany({
      where: { turmaId: id },
      data: { turmaId: null }
    });

    await this.prisma.turma.delete({ where: { id } });
    return { success: true };
  }

  // 5. Financeiro (CRUD)
  async getFinanceiro() {
    return this.prisma.financeiro.findMany({
      orderBy: { vencimento: 'asc' },
    });
  }

  async updateFinanceiro(id: string, body: any) {
    return this.prisma.financeiro.update({
      where: { id },
      data: {
        status: body.status,
        valor: body.valor,
        vencimento: body.vencimento
      }
    });
  }

  async deleteFinanceiro(id: string) {
    await this.prisma.financeiro.delete({ where: { id } });
    return { success: true };
  }

  // 6. Responsáveis (CRUD Completo)
  async getResponsaveis() {
    const responsaveis = await this.prisma.responsavel.findMany({
      include: {
        user: true,
        alunos: {
          include: { user: true }
        }
      },
      orderBy: { user: { name: 'asc' } }
    });

    return responsaveis.map((r) => ({
      id: r.id,
      name: r.user.name,
      cpf: r.cpf,
      email: r.user.email || '—',
      telefone: r.telefone,
      enderecoLogradouro: r.enderecoLogradouro,
      enderecoNumero: r.enderecoNumero,
      enderecoBairro: r.enderecoBairro,
      enderecoCidade: r.enderecoCidade,
      enderecoEstado: r.enderecoEstado,
      enderecoCep: r.enderecoCep,
      alunos: r.alunos.map(a => a.user.name).join(', ')
    }));
  }

  async createResponsavel(data: any) {
    const parentRole = await this.prisma.role.findUnique({ where: { name: 'PARENT' } });
    if (!parentRole) throw new BadRequestException('Role PARENT não configurada.');

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.telefone,
        password: 'Favo@' + (data.cpf ? data.cpf.replace(/\D/g, '').substring(0, 4) : '2025'),
        roleId: parentRole.id,
      }
    });

    return this.prisma.responsavel.create({
      data: {
        userId: user.id,
        cpf: data.cpf,
        telefone: data.telefone || '',
        enderecoLogradouro: data.enderecoLogradouro || '',
        enderecoNumero: data.enderecoNumero || '',
        enderecoBairro: data.enderecoBairro || '',
        enderecoCidade: data.enderecoCidade || '',
        enderecoEstado: data.enderecoEstado || '',
        enderecoCep: data.enderecoCep || '',
        financeiroPrincipal: true
      }
    });
  }

  async updateResponsavel(id: string, data: any) {
    const r = await this.prisma.responsavel.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!r) throw new NotFoundException('Responsável não encontrado.');

    await this.prisma.user.update({
      where: { id: r.userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.telefone
      }
    });

    await this.prisma.responsavel.update({
      where: { id },
      data: {
        cpf: data.cpf,
        telefone: data.telefone,
        enderecoLogradouro: data.enderecoLogradouro,
        enderecoNumero: data.enderecoNumero,
        enderecoBairro: data.enderecoBairro,
        enderecoCidade: data.enderecoCidade,
        enderecoEstado: data.enderecoEstado,
        enderecoCep: data.enderecoCep
      }
    });

    return { id, success: true };
  }

  async deleteResponsavel(id: string) {
    const r = await this.prisma.responsavel.findUnique({
      where: { id },
      include: { alunos: true }
    });
    if (!r) throw new NotFoundException('Responsável não encontrado.');

    if (r.alunos.length > 0) {
      throw new BadRequestException('Não é possível remover este responsável pois ele possui alunos associados. Remova ou reatribua os alunos primeiro.');
    }

    await this.prisma.user.delete({ where: { id: r.userId } });
    return { success: true };
  }

  // 7. Usuários do sistema (Todos os Users)
  async getUsuarios() {
    const users = await this.prisma.user.findMany({
      include: { role: true, permissions: true },
      orderBy: { name: 'asc' }
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || '',
      phone: u.phone || '',
      role: u.role?.name || 'USER',
      permissions: u.permissions || []
    }));
  }

  async updateUsuario(id: string, data: any) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    if (data.role) {
      const roleObj = await this.prisma.role.findFirst({ where: { name: { equals: data.role, mode: 'insensitive' } } });
      if (roleObj) {
        updateData.roleId = roleObj.id;
      }
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUsuario(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateUsuarioPermissions(userId: string, permissionIds: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          set: permissionIds.map(id => ({ id }))
        }
      }
    });
  }

  async createUsuario(data: any) {
    const roleName = data.role || 'STAFF';
    let roleObj = await this.prisma.role.findFirst({ where: { name: { equals: roleName, mode: 'insensitive' } } });
    if (!roleObj) {
      roleObj = await this.prisma.role.findFirst({ where: { name: 'STAFF' } });
    }
    if (!roleObj) {
      throw new BadRequestException('Role padrão STAFF não encontrada.');
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password || 'Favo@2025',
        roleId: roleObj.id,
      }
    });
  }

  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async updateRole(id: string, data: any) {
    return this.prisma.role.update({
      where: { id },
      data: {
        description: data.description
      }
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { action: 'asc' }
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissionIds.map(id => ({ id }))
        }
      }
    });
  }

  // 8. Avisos (Comunicados)
  async getAvisos() {
    return this.prisma.aviso.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAviso(body: any) {
    return this.prisma.aviso.create({
      data: {
        titulo: body.titulo,
        texto: body.texto,
        categoria: body.categoria || 'Geral',
        destinatario: body.destinatario || 'GERAL',
      },
    });
  }

  async deleteAviso(id: string) {
    await this.prisma.aviso.delete({
      where: { id },
    });
    return { success: true };
  }

  // 9. Leads (Contatos & Matrículas)
  async getLeads() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLead(data: any) {
    return this.prisma.lead.create({
      data: {
        parent_name: data.parent_name,
        email: data.email,
        phone: data.phone,
        child_name: data.child_name || null,
        program: data.program || null,
        message: data.message || null,
      },
    });
  }

  async updateLead(id: string, body: any) {
    await this.prisma.lead.update({
      where: { id },
      data: {
        status: body.status,
      },
    });
    return { success: true };
  }

  // 10. Navbar Global Search
  async searchGlobal(q: string) {
    if (!q) return [];
    
    const alunos = await this.prisma.aluno.findMany({
      where: {
        status: 'ativo',
        OR: [
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { matricula: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: { user: true },
      take: 5
    });

    const professores = await this.prisma.professor.findMany({
      where: {
        user: { name: { contains: q, mode: 'insensitive' } }
      },
      include: { user: true },
      take: 5
    });

    const turmas = await this.prisma.turma.findMany({
      where: {
        nome: { contains: q, mode: 'insensitive' }
      },
      take: 5
    });

    const results = [];
    alunos.forEach(a => results.push({ type: 'aluno', label: `Aluno: ${a.user.name} (${a.matricula})`, link: `/gestao?tab=alunos&q=${a.matricula}` }));
    professores.forEach(p => results.push({ type: 'professor', label: `Professor: ${p.user.name} (${p.disciplina})`, link: `/gestao?tab=professores` }));
    turmas.forEach(t => results.push({ type: 'turma', label: `Turma: ${t.nome} (${t.serie})`, link: `/gestao?tab=turmas` }));

    return results;
  }
}
