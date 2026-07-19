import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GestaoService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Stats
  async getStats() {
    const totalAlunos = await this.prisma.user.count({
      where: { role: { name: 'STUDENT' } },
    });

    const totalProfessores = await this.prisma.user.count({
      where: { role: { name: 'TEACHER' } },
    });

    const financeiroAberto = await this.prisma.financeiro.findMany({
      where: { status: 'aberto' },
    });

    const mensalidadesAbertas = financeiroAberto.reduce((acc, curr) => acc + curr.valor, 0);

    const totalTurmas = await this.prisma.turma.count();
    const contatosNovos = await this.prisma.lead.count({
      where: { status: 'novo' },
    });
    const comunicados = await this.prisma.aviso.count();

    return {
      mensalidades_abertas: mensalidadesAbertas,
      alunos: totalAlunos,
      turmas: totalTurmas,
      professores: totalProfessores,
      contatos_novos: contatosNovos,
      comunicados,
    };
  }

  // 2. Alunos (Prisma Users com role STUDENT)
  async getAlunos(search: string = '') {
    const users = await this.prisma.user.findMany({
      where: {
        role: { name: 'STUDENT' },
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { matricula: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mapeamento para o formato esperado pelo frontend
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      matricula: u.matricula,
      status: 'ativa', // Padrão
      responsavel_nome: 'Responsável ' + (u.name || ''),
      responsavel_email: 'responsavel@colegiofavo.com.br',
      turma: '3º Ano - C',
    }));
  }

  async createAluno(data: any) {
    const studentRole = await this.prisma.role.findUnique({
      where: { name: 'STUDENT' },
    });

    if (!studentRole) throw new Error('Role STUDENT não encontrada');

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        matricula: data.matricula || String(Math.floor(100000 + Math.random() * 900000)),
        password: 'Favo@2025',
        roleId: studentRole.id,
      },
    });

    return user;
  }

  async updateAluno(id: string, body: any) {
    return { id, success: true };
  }

  // 3. Turmas
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

  // 4. Professores (Prisma Users com role TEACHER)
  async getProfessores() {
    const users = await this.prisma.user.findMany({
      where: { role: { name: 'TEACHER' } },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || '—',
      disciplina: 'Geral',
      telefone: u.phone || '—',
    }));
  }

  async createProfessor(data: any) {
    const teacherRole = await this.prisma.role.findUnique({
      where: { name: 'TEACHER' },
    });

    if (!teacherRole) throw new Error('Role TEACHER não encontrada');

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email || undefined,
        phone: data.telefone || undefined,
        password: 'Favo@2025',
        roleId: teacherRole.id,
      },
    });
  }

  // 5. Financeiro
  async getFinanceiro() {
    return this.prisma.financeiro.findMany({
      orderBy: { vencimento: 'asc' },
    });
  }

  // 6. Responsáveis (Prisma Users com role PARENT)
  async getResponsaveis() {
    const users = await this.prisma.user.findMany({
      where: { role: { name: 'PARENT' } },
      include: { role: true },
    });

    return users.map((u) => ({
      name: u.name,
      email: u.email || u.phone || '—',
      role: u.role?.name || 'PARENT',
    }));
  }

  // 7. Usuários do sistema (Todos os Users)
  async getUsuarios() {
    const users = await this.prisma.user.findMany({
      include: { role: true },
    });

    return users.map((u) => ({
      name: u.name,
      email: u.email || u.matricula || u.phone || '—',
      role: u.role?.name.toLowerCase() || 'user',
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
}
