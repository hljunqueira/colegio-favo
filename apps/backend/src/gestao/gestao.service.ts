import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GestaoService {
  constructor(private readonly prisma: PrismaService) {}

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
    const comunicados = await this.prisma.aviso.count();

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
    };
  }

  // 2. Alunos (CRUD Completo)
  async getAlunos(search: string = '') {
    const alunos = await this.prisma.aluno.findMany({
      where: {
        status: 'ativo',
        OR: search
          ? [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { matricula: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
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
      name: a.user.name,
      matricula: a.matricula,
      status: a.status,
      responsavel_nome: a.responsavel.user.name,
      responsavel_email: a.responsavel.user.email || '—',
      responsavel_telefone: a.responsavel.telefone,
      turma: a.turma.nome,
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
    // Verificar se há alunos matriculados
    const alunosCount = await this.prisma.aluno.count({ where: { turmaId: id } });
    if (alunosCount > 0) {
      throw new BadRequestException('Não é possível excluir uma turma que possui alunos vinculados. Remova ou transfira os alunos antes.');
    }

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
      include: { role: true },
      orderBy: { name: 'asc' }
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || u.matricula || u.phone || '—',
      role: u.role?.name || 'USER',
    }));
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
