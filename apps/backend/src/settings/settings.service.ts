import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Obter perfil completo com preferências e logs de acesso
  async getPerfil(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        preferenciasNotificacao: true,
        logsAcesso: {
          orderBy: { dataHora: 'desc' },
          take: 5
        }
      }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return {
      id: user.id,
      name: user.name,
      email: user.email || '—',
      phone: user.phone || '—',
      matricula: user.matricula || '—',
      role: user.role.name,
      preferencias: user.preferenciasNotificacao || { receberEmail: true, receberWhatsapp: true },
      logsAcesso: user.logsAcesso
    };
  }

  // Atualizar dados de perfil
  async updatePerfil(userId: string, body: any) {
    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.email) dataToUpdate.email = body.email;
    if (body.phone) dataToUpdate.phone = body.phone;
    if (body.password) dataToUpdate.password = body.password; // Em produção usar hash bcrypt

    return this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });
  }

  // Atualizar preferências de notificações
  async updatePreferencias(userId: string, body: any) {
    return this.prisma.preferenciasNotificacao.upsert({
      where: { userId },
      update: {
        receberEmail: body.receberEmail !== undefined ? body.receberEmail : true,
        receberWhatsapp: body.receberWhatsapp !== undefined ? body.receberWhatsapp : true
      },
      create: {
        userId,
        receberEmail: body.receberEmail !== undefined ? body.receberEmail : true,
        receberWhatsapp: body.receberWhatsapp !== undefined ? body.receberWhatsapp : true
      }
    });
  }

  // Registrar logs de acesso
  async registrarLogAcesso(userId: string, body: any) {
    return this.prisma.logAcesso.create({
      data: {
        userId,
        dispositivo: body.dispositivo || 'Navegador Web',
        ipAddress: body.ipAddress || '127.0.0.1'
      }
    });
  }
}
