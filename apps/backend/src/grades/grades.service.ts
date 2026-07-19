import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todas as notas de um aluno específico (para boletim ou listagem do portal)
  async getNotasAluno(alunoId: string) {
    return this.prisma.nota.findMany({
      where: { alunoId },
      orderBy: { disciplina: 'asc' },
    });
  }

  // Lançar ou atualizar nota
  async updateNota(id: string, body: any) {
    const nota = await this.prisma.nota.findUnique({ where: { id } });
    if (!nota) throw new NotFoundException('Registro de nota não encontrado.');

    const p1 = body.p1 !== undefined ? body.p1 : nota.p1;
    const p2 = body.p2 !== undefined ? body.p2 : nota.p2;
    const trabalho = body.trabalho !== undefined ? body.trabalho : nota.trabalho;

    // Cálculo automático da média final
    let mediaFinal = null;
    if (p1 !== null && p2 !== null && trabalho !== null) {
      mediaFinal = Number(((p1 + p2 + trabalho) / 3).toFixed(2));
    }

    return this.prisma.nota.update({
      where: { id },
      data: {
        p1,
        p2,
        trabalho,
        mediaFinal
      }
    });
  }

  // Criar novo registro de nota (para novas matérias)
  async createNota(body: any) {
    const p1 = body.p1 || null;
    const p2 = body.p2 || null;
    const trabalho = body.trabalho || null;
    let mediaFinal = null;

    if (p1 !== null && p2 !== null && trabalho !== null) {
      mediaFinal = Number(((p1 + p2 + trabalho) / 3).toFixed(2));
    }

    return this.prisma.nota.create({
      data: {
        alunoId: body.alunoId,
        disciplina: body.disciplina,
        p1,
        p2,
        trabalho,
        mediaFinal,
        trimestre: body.trimestre || 1,
        anoLetivo: body.anoLetivo || '2026'
      }
    });
  }
}
