import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaService) { }

  async gerarLink(body: {
    nomeAluno: string;
    dataNascimento: string;
    seriePretendida: string;
    nomeResponsavel: string;
    emailResponsavel: string;
    telefoneResponsavel: string;
    cpfResponsavel: string;
  }) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7); // 7 dias de validade

    // Verificar se já existe pré-matrícula pendente com este CPF
    const existente = await this.prisma.preMatricula.findFirst({
      where: { cpfResponsavel: body.cpfResponsavel, NOT: { status: 'efetivada' } }
    });
    if (existente) {
      throw new BadRequestException('Já existe uma pré-matrícula em andamento para este CPF.');
    }

    return this.prisma.preMatricula.create({
      data: {
        token,
        nomeAluno: body.nomeAluno,
        dataNascimento: body.dataNascimento,
        seriePretendida: body.seriePretendida,
        nomeResponsavel: body.nomeResponsavel,
        emailResponsavel: body.emailResponsavel,
        telefoneResponsavel: body.telefoneResponsavel,
        cpfResponsavel: body.cpfResponsavel,
        expiraEm
      }
    });
  }

  async getPendentes() {
    return this.prisma.preMatricula.findMany({
      include: { documentos: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async validarToken(token: string) {
    const pre = await this.prisma.preMatricula.findUnique({
      where: { token },
      include: { documentos: true }
    });
    if (!pre) throw new NotFoundException('Token de pré-matrícula não encontrado.');
    if (new Date() > pre.expiraEm) throw new BadRequestException('Este link de matrícula já expirou.');
    return pre;
  }

  async enviarDados(token: string, body: { documentos: { tipo: string; fileUrl: string }[] }) {
    const pre = await this.validarToken(token);

    // Salvar os documentos anexados
    await this.prisma.documentoMatricula.deleteMany({ where: { preMatriculaId: pre.id } });
    if (body.documentos && body.documentos.length > 0) {
      await this.prisma.documentoMatricula.createMany({
        data: body.documentos.map(d => ({
          preMatriculaId: pre.id,
          tipo: d.tipo,
          fileUrl: d.fileUrl,
          status: 'pendente'
        }))
      });
    }

    return this.prisma.preMatricula.update({
      where: { id: pre.id },
      data: { status: 'em_analise' },
      include: { documentos: true }
    });
  }

  async analisar(id: string, body: { status: string; observacoes?: string }) {
    const pre = await this.prisma.preMatricula.findUnique({ where: { id } });
    if (!pre) throw new NotFoundException('Pré-matrícula não encontrada.');

    return this.prisma.preMatricula.update({
      where: { id },
      data: {
        status: body.status, // "em_analise", "aprovado", "rejeitado"
        observacoes: body.observacoes || null
      }
    });
  }

  async efetivar(id: string) {
    const preMatricula = await this.prisma.preMatricula.findUnique({
      where: { id },
      include: { documentos: true }
    });
    if (!preMatricula) throw new NotFoundException('Pré-matrícula não encontrada.');
    if (preMatricula.status === 'efetivada') throw new BadRequestException('Esta matrícula já foi efetivada.');

    // 1. Procurar ou criar Responsável
    let responsavel = await this.prisma.responsavel.findFirst({
      where: { cpf: preMatricula.cpfResponsavel },
      include: { user: true }
    });

    if (!responsavel) {
      const parentUser = await this.prisma.user.create({
        data: {
          name: preMatricula.nomeResponsavel,
          email: preMatricula.emailResponsavel,
          phone: preMatricula.telefoneResponsavel,
          password: 'Favo@2025',
          role: {
            connect: { name: 'PARENT' }
          }
        }
      });
      responsavel = await this.prisma.responsavel.create({
        data: {
          user: { connect: { id: parentUser.id } },
          cpf: preMatricula.cpfResponsavel,
          telefone: preMatricula.telefoneResponsavel,
          enderecoLogradouro: "",
          enderecoNumero: "",
          enderecoBairro: "",
          enderecoCidade: "",
          enderecoEstado: "",
          enderecoCep: "",
          financeiroPrincipal: true
        },
        include: { user: true }
      });
    }

    // 2. Gerar matrícula sequencial atômica
    const nextMatricula = await this.prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear().toString();
      const count = await tx.aluno.count();
      const seq = String(count + 1).padStart(3, '0');
      return `${year}${seq}`;
    });

    // 3. Criar usuário Aluno
    const studentUser = await this.prisma.user.create({
      data: {
        name: preMatricula.nomeAluno,
        matricula: nextMatricula,
        password: 'Favo@2025',
        role: {
          connect: { name: 'STUDENT' }
        }
      }
    });

    // 4. Criar registro de Aluno
    const firstTurma = await this.prisma.turma.findFirst();
    const aluno = await this.prisma.aluno.create({
      data: {
        user: { connect: { id: studentUser.id } },
        matricula: nextMatricula,
        responsavel: { connect: { id: responsavel.id } },
        turma: firstTurma ? { connect: { id: firstTurma.id } } : undefined,
        status: 'ativo'
      }
    });

    // 5. Atualizar Pré-Matrícula
    await this.prisma.preMatricula.update({
      where: { id },
      data: { status: 'efetivada' }
    });

    return { success: true, matricula: nextMatricula, alunoId: aluno.id };
  }
}
