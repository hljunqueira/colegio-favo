import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const responsavel = await this.prisma.responsavel.findUnique({
      where: { userId },
      include: {
        user: true,
        alunos: {
          include: {
            user: true,
            turma: true,
            anamnese: true,
            notas: true,
            frequencias: true,
            atestados: true
          }
        }
      }
    });

    if (!responsavel) {
      throw new NotFoundException('Perfil de responsável não encontrado.');
    }

    // Mapeia financeiro de cada aluno baseado no nome dele
    const alunosComFinanceiro = await Promise.all(
      responsavel.alunos.map(async (aluno) => {
        const financeiro = await this.prisma.financeiro.findMany({
          where: { aluno: aluno.user.name },
          orderBy: { vencimento: 'asc' }
        });

        return {
          id: aluno.id,
          name: aluno.user.name,
          matricula: aluno.matricula,
          turma: aluno.turma.nome,
          status: aluno.status,
          boletim: aluno.notas.map(n => ({
            id: n.id,
            disciplina: n.disciplina,
            p1: n.p1,
            p2: n.p2,
            trabalho: n.trabalho,
            mediaFinal: n.mediaFinal,
            trimestre: n.trimestre
          })),
          frequencia: aluno.frequencias.map(f => ({
            id: f.id,
            data: f.data.toISOString().split('T')[0],
            presente: f.presente
          })),
          atestados: aluno.atestados,
          financeiro: financeiro,
          anamnese: aluno.anamnese
        };
      })
    );

    return {
      responsavel: {
        id: responsavel.id,
        name: responsavel.user.name,
        email: responsavel.user.email,
        phone: responsavel.telefone,
        cpf: responsavel.cpf
      },
      filhos: alunosComFinanceiro
    };
  }
}
