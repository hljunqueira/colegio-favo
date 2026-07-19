import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Eventos de Agenda (Calendário Integrado)
  async getEventos(userId?: string) {
    // Retorna todos os eventos de agenda para exibição no calendário
    return this.prisma.agendaEvento.findMany({
      include: {
        turma: true
      },
      orderBy: { dataHora: 'asc' }
    });
  }

  async criarEvento(body: any) {
    return this.prisma.agendaEvento.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        dataHora: new Date(body.dataHora),
        tipo: body.tipo, // "prova", "trabalho", "evento_escolar", "escala_trabalho"
        turmaId: body.turmaId || null,
        userId: body.userId || null
      }
    });
  }

  // 2. Reuniões Pedagógicas (Booking)
  async getReunioes(userId: string) {
    // Busca reuniões filtrando por usuário responsavel ou professor
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { responsavel: true, professor: true, role: true }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (user.role.name === 'PARENT') {
      return this.prisma.reuniao.findMany({
        where: { responsavelId: user.responsavel.id },
        include: {
          professor: { include: { user: true } },
          responsavel: { include: { user: true } }
        },
        orderBy: { dataHora: 'desc' }
      });
    }

    if (user.role.name === 'TEACHER') {
      return this.prisma.reuniao.findMany({
        where: { professorId: user.professor.id },
        include: {
          professor: { include: { user: true } },
          responsavel: { include: { user: true } }
        },
        orderBy: { dataHora: 'desc' }
      });
    }

    // Coordenação / Admin vê todas
    return this.prisma.reuniao.findMany({
      include: {
        professor: { include: { user: true } },
        responsavel: { include: { user: true } }
      },
      orderBy: { dataHora: 'desc' }
    });
  }

  async criarReuniao(body: any) {
    return this.prisma.reuniao.create({
      data: {
        professorId: body.professorId,
        responsavelId: body.responsavelId,
        dataHora: new Date(body.dataHora),
        status: 'pendente',
        notes: body.notes || ''
      }
    });
  }

  async analisarReuniao(id: string, body: any) {
    const reuniao = await this.prisma.reuniao.findUnique({ where: { id } });
    if (!reuniao) throw new NotFoundException('Reunião não encontrada.');

    return this.prisma.reuniao.update({
      where: { id },
      data: {
        status: body.status // "confirmada", "cancelada"
      }
    });
  }
}
