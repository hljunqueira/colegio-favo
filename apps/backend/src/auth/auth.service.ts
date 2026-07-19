import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(payload: any) {
    const { email, phone, matricula, password } = payload;

    let user = null;

    if (matricula) {
      // Login de Aluno
      user = await this.prisma.user.findFirst({
        where: { matricula },
        include: { role: true },
      });
    } else if (phone) {
      // Login de Responsável
      // Limpa máscara do telefone antes de buscar
      const cleanPhone = phone.replace(/\D/g, '');
      user = await this.prisma.user.findFirst({
        where: {
          phone: {
            contains: cleanPhone,
          },
        },
        include: { role: true },
      });
    } else if (email) {
      // Login de Equipe Favo (Admin, Professor, Coordenador, Funcionario)
      let lookupEmail = email;
      if (email === 'admin@favodemel.com.br' || email === 'admin@colegiofavo.com.br') {
        lookupEmail = 'admin@escolafavodemel.com.br';
      }
      user = await this.prisma.user.findUnique({
        where: { email: lookupEmail },
        include: { role: true },
      });
    }

    console.log('Login request received for:', email || phone || matricula);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Validação de senha simplificada para demonstração/testes (aceita Favo@2025 ou senha cadastrada)
    const isPasswordValid = password === 'Favo@2025' || user.password === password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // Criação de token fake JWT padrão (Base64) para evitar dependência externa de assinatura
    const payloadToken = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      matricula: user.matricula,
      role: user.role?.name || 'user',
    };

    const token = Buffer.from(JSON.stringify(payloadToken)).toString('base64');
    console.log('Generated token:', token);

    return {
      user: {
        ...payloadToken,
        role: payloadToken.role.toLowerCase(),
      },
      token: token,
    };
  }

  async getMe(authHeader: string) {
    console.log('getMe called with authHeader:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    try {
      const decodedJson = Buffer.from(token, 'base64').toString('utf8');
      console.log('Decoded token JSON:', decodedJson);
      const payload = JSON.parse(decodedJson);
      console.log('Decoded payload:', payload);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        include: { role: true },
      });

      if (!user) {
        console.log('getMe user not found in database for ID:', payload.id);
        throw new UnauthorizedException('Usuário não encontrado');
      }

      console.log('getMe successful for user:', user.name);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        matricula: user.matricula,
        role: (user.role?.name || 'user').toLowerCase(),
      };
    } catch (e) {
      console.error('getMe parsing/database exception:', e);
      throw new UnauthorizedException('Sessão expirada ou token inválido');
    }
  }
}
