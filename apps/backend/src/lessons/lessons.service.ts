import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Atividades (Homework)
  async getAtividadesTurma(turmaId: string) {
    return this.prisma.atividade.findMany({
      where: { turmaId },
      include: {
        professor: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async criarAtividade(body: any) {
    return this.prisma.atividade.create({
      data: {
        turmaId: body.turmaId,
        professorId: body.professorId,
        titulo: body.titulo,
        descricao: body.descricao,
        fileUrl: body.fileUrl || null,
        dataEntrega: new Date(body.dataEntrega),
      }
    });
  }

  // 2. Entregas de Atividades (Homework Submissions)
  async getEntregasAtividade(atividadeId: string) {
    return this.prisma.entregaAtividade.findMany({
      where: { atividadeId },
      include: {
        aluno: {
          include: { user: true }
        }
      }
    });
  }

  async getEntregasAluno(alunoId: string) {
    return this.prisma.entregaAtividade.findMany({
      where: { alunoId },
      include: {
        atividade: true
      }
    });
  }

  async entregarAtividade(body: any) {
    return this.prisma.entregaAtividade.create({
      data: {
        atividadeId: body.atividadeId,
        alunoId: body.alunoId,
        fileUrl: body.fileUrl,
        dataEnvio: new Date(),
      }
    });
  }

  async corrigirEntrega(id: string, body: any) {
    const entrega = await this.prisma.entregaAtividade.findUnique({ where: { id } });
    if (!entrega) throw new NotFoundException('Entrega de atividade não encontrada.');

    return this.prisma.entregaAtividade.update({
      where: { id },
      data: {
        nota: body.nota,
        feedback: body.feedback || null
      }
    });
  }

  // 3. Planos de Aula (Lesson Plans)
  async getPlanosAulaTurma(turmaId: string) {
    return this.prisma.planoAula.findMany({
      where: { turmaId },
      include: {
        professor: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPlanosAulaProfessor(professorId: string) {
    return this.prisma.planoAula.findMany({
      where: { professorId },
      include: {
        turma: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllPlanosAula() {
    return this.prisma.planoAula.findMany({
      include: {
        professor: { include: { user: true } },
        turma: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async criarPlanoAula(body: any) {
    return this.prisma.planoAula.create({
      data: {
        professorId: body.professorId,
        turmaId: body.turmaId,
        titulo: body.titulo,
        conteudo: body.conteudo,
        objetivos: body.objetivos,
        status: 'pendente'
      }
    });
  }

  async analisarPlanoAula(id: string, body: any) {
    const plano = await this.prisma.planoAula.findUnique({ where: { id } });
    if (!plano) throw new NotFoundException('Plano de aula não encontrado.');

    return this.prisma.planoAula.update({
      where: { id },
      data: {
        status: body.status // "aprovado", "ajustar"
      }
    });
  }
}
