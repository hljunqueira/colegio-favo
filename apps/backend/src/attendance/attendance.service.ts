import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // Obter registros de presença de um aluno específico
  async getFrequenciaAluno(alunoId: string) {
    return this.prisma.frequencia.findMany({
      where: { alunoId },
      orderBy: { data: 'desc' },
    });
  }

  // Obter frequências de uma turma em uma data
  async getFrequenciaTurmaData(turmaId: string, dataStr: string) {
    const dataBusca = new Date(dataStr);
    return this.prisma.frequencia.findMany({
      where: {
        turmaId,
        data: {
          gte: new Date(dataBusca.setHours(0, 0, 0, 0)),
          lte: new Date(dataBusca.setHours(23, 59, 59, 999))
        }
      },
      include: {
        aluno: {
          include: { user: true }
        }
      }
    });
  }

  // Registro de chamada em lote pela turma/data
  async registrarFrequenciaLote(body: any) {
    const { turmaId, data, chamadas } = body; // chamadas: [{ alunoId: string, presente: boolean }]
    const dataFrequencia = new Date(data);

    // Limpa registros anteriores da mesma data para evitar duplicidade
    await this.prisma.frequencia.deleteMany({
      where: {
        turmaId,
        data: {
          gte: new Date(new Date(dataFrequencia).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(dataFrequencia).setHours(23, 59, 59, 999))
        }
      }
    });

    const listToCreate = chamadas.map((c: any) => ({
      alunoId: c.alunoId,
      turmaId,
      data: dataFrequencia,
      presente: c.presente
    }));

    return this.prisma.frequencia.createMany({
      data: listToCreate
    });
  }

  // Obter atestados de um aluno
  async getAtestados(alunoId: string) {
    return this.prisma.atestado.findMany({
      where: { alunoId },
      orderBy: { dataInicio: 'desc' },
    });
  }

  // Obter todos os atestados para aprovação da secretaria/coordenação
  async getAllAtestados() {
    return this.prisma.atestado.findMany({
      include: {
        aluno: {
          include: { user: true }
        }
      },
      orderBy: { dataEmissao: 'desc' }
    });
  }

  // Enviar atestado médico
  async enviarAtestado(body: any) {
    return this.prisma.atestado.create({
      data: {
        alunoId: body.alunoId,
        dataEmissao: new Date(body.dataEmissao || Date.now()),
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        motivo: body.motivo,
        fileUrl: body.fileUrl,
        status: 'aguardando'
      }
    });
  }

  // Analisar atestado médico (Aprovar/Rejeitar)
  async analisarAtestado(id: string, body: any) {
    const atestado = await this.prisma.atestado.findUnique({ where: { id } });
    if (!atestado) throw new NotFoundException('Atestado não encontrado.');

    return this.prisma.atestado.update({
      where: { id },
      data: {
        status: body.status // "aprovado", "rejeitado"
      }
    });
  }
}
