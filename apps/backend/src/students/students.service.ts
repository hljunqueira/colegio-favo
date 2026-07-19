import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const userObj = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });
    const isAdmin = userObj && (userObj.role?.name === 'ADMIN' || userObj.role?.name === 'DIRETORIA');

    let student = await this.prisma.aluno.findUnique({
      where: { userId },
      include: {
        user: true,
        turma: true,
        anamnese: true,
        notas: true,
        frequencias: true,
        atestados: true,
        entregas: true
      }
    });

    if (!student && isAdmin) {
      student = await this.prisma.aluno.findFirst({
        include: {
          user: true,
          turma: true,
          anamnese: true,
          notas: true,
          frequencias: true,
          atestados: true,
          entregas: true
        }
      });
    }

    if (!student) {
      throw new NotFoundException('Perfil de aluno não encontrado.');
    }

    const agenda = await this.prisma.agendaEvento.findMany({
      where: {
        OR: [
          { turmaId: student.turmaId },
          { turmaId: null }
        ]
      },
      orderBy: { dataHora: 'asc' }
    });

    const cardapio = await this.prisma.cardapio.findMany({
      orderBy: { data: 'asc' },
      take: 7
    });

    const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    return {
      student: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        matricula: student.matricula,
        turma: student.turma.nome,
        turno: student.turma.turno,
        status: student.status,
        boletim: student.notas.map(n => ({
          id: n.id,
          disciplina: n.disciplina,
          b1: n.p1,
          b2: n.p2,
          b3: n.trabalho,
          b4: n.mediaFinal,
          mediaFinal: n.mediaFinal,
          faltas: student.frequencias.filter(f => !f.presente).length
        })),
        frequencia: student.frequencias.map(f => ({
          id: f.id,
          data: f.data.toISOString().split('T')[0],
          presente: f.presente
        })),
        agenda: agenda.map(e => ({
          id: e.id,
          title: e.titulo,
          disciplina: e.descricao,
          date: e.dataHora.toISOString().split('T')[0],
          type: e.tipo
        })),
        cardapio: cardapio.map(c => ({
          dia: weekdayNames[new Date(c.data).getDay()],
          refeicao: c.refeicao
        }))
      }
    };
  }
}
