import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor escolar. Tente novamente mais tarde.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();
      message = typeof resContent === 'object' && (resContent as any).message 
        ? (resContent as any).message 
        : exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Tratamento de Erros Comuns do Prisma
      status = HttpStatus.BAD_REQUEST;
      switch (exception.code) {
        case 'P2002': {
          const target = exception.meta?.target as string[];
          const field = target ? target.join(', ') : '';
          message = `Cadastro duplicado encontrado. O campo (${field}) já está cadastrado no sistema.`;
          break;
        }
        case 'P2025': {
          message = 'O registro solicitado não foi encontrado ou já foi excluído.';
          break;
        }
        case 'P2003': {
          message = 'Não é possível remover ou alterar este registro pois existem dados vinculados a ele.';
          break;
        }
        default: {
          message = `Erro no banco de dados (Código: ${exception.code}).`;
          break;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Retorna resposta limpa e amigável ao frontend
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: Array.isArray(message) ? message[0] : message,
      error: exception.constructor?.name || 'Error',
    });
  }
}
