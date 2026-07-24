import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfessorByUserId(userId: string) {
    return this.prisma.professor.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  async getTurmas() {
    return this.prisma.turma.findMany({
      orderBy: { nome: 'asc' }
    });
  }

  async getAlunosDaTurma(turmaId: string) {
    return this.prisma.aluno.findMany({
      where: { turmaId },
      include: {
        user: true,
        notas: true,
        frequencias: true
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });
  }

  async registrarChamada(body: { data: string; turmaId: string; presencas: { alunoId: string; presente: boolean }[] }) {
    const dataObj = new Date(body.data);
    const results = [];
    for (const p of body.presencas) {
      const res = await this.prisma.frequencia.create({
        data: {
          alunoId: p.alunoId,
          turmaId: body.turmaId,
          data: dataObj,
          presente: p.presente
        }
      });
      results.push(res);
    }
    return { success: true, count: results.length };
  }

  async registrarNota(body: { alunoId: string; disciplina: string; valor: number; tipo: string }) {
    const data: any = {
      alunoId: body.alunoId,
      disciplina: body.disciplina,
      trimestre: 1,
      anoLetivo: new Date().getFullYear().toString()
    };
    if (body.tipo === "avaliacao" || body.tipo === "p1") {
      data.p1 = body.valor;
    } else if (body.tipo === "p2") {
      data.p2 = body.valor;
    } else {
      data.trabalho = body.valor;
    }
    return this.prisma.nota.create({
      data
    });
  }

  async getContatos() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getFuncionarioByUserId(userId: string) {
    return this.prisma.funcionario.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  async getEscalasByFuncionarioId(funcionarioId: string) {
    return this.prisma.escala.findMany({
      where: { funcionarioId }
    });
  }

  async getSolicitacoesByFuncionarioId(funcionarioId: string) {
    return this.prisma.solicitacao.findMany({
      where: { funcionarioId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async criarSolicitacao(body: { funcionarioId: string; titulo: string; descricao: string; setorDestino: string }) {
    return this.prisma.solicitacao.create({
      data: {
        funcionarioId: body.funcionarioId,
        titulo: body.titulo,
        descricao: body.descricao,
        setorDestino: body.setorDestino,
        status: 'pendente'
      }
    });
  }
}
