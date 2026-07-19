import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Acervo Físico (Local DB)
  async buscarLivrosFisicos(query: string = '') {
    return this.prisma.livro.findMany({
      where: {
        OR: query
          ? [
              { titulo: { contains: query, mode: 'insensitive' } },
              { autor: { contains: query, mode: 'insensitive' } },
              { isbn: { contains: query, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { titulo: 'asc' },
    });
  }

  async cadastrarLivro(body: any) {
    return this.prisma.livro.create({
      data: {
        titulo: body.titulo,
        autor: body.autor,
        isbn: body.isbn || null,
        localizacao: body.localizacao || null,
        quantidade: body.quantidade || 1,
        capaUrl: body.capaUrl || null
      }
    });
  }

  // 2. Reservas de Livros Físicos
  async getReservasAluno(alunoId: string) {
    return this.prisma.reservaLivro.findMany({
      where: { alunoId },
      include: {
        livro: true
      },
      orderBy: { dataReserva: 'desc' }
    });
  }

  async getAllReservas() {
    return this.prisma.reservaLivro.findMany({
      include: {
        livro: true,
        aluno: { include: { user: true } }
      },
      orderBy: { dataReserva: 'desc' }
    });
  }

  async criarReserva(body: any) {
    const livro = await this.prisma.livro.findUnique({ where: { id: body.livroId } });
    if (!livro) throw new NotFoundException('Livro não encontrado.');

    if (livro.quantidade < 1) {
      throw new Error('Não há exemplares físicos disponíveis no momento para empréstimo.');
    }

    // Decrementa quantidade
    await this.prisma.livro.update({
      where: { id: body.livroId },
      data: { quantidade: livro.quantidade - 1 }
    });

    return this.prisma.reservaLivro.create({
      data: {
        livroId: body.livroId,
        alunoId: body.alunoId,
        status: 'reservado'
      }
    });
  }

  async analisarReserva(id: string, body: any) {
    const reserva = await this.prisma.reservaLivro.findUnique({ where: { id } });
    if (!reserva) throw new NotFoundException('Reserva não encontrada.');

    // Se devolvido, incrementa quantidade de volta
    if (body.status === 'devolvido' && reserva.status !== 'devolvido') {
      const livro = await this.prisma.livro.findUnique({ where: { id: reserva.livroId } });
      if (livro) {
        await this.prisma.livro.update({
          where: { id: reserva.livroId },
          data: { quantidade: livro.quantidade + 1 }
        });
      }
    }

    return this.prisma.reservaLivro.update({
      where: { id },
      data: {
        status: body.status // "reservado", "retirado", "devolvido"
      }
    });
  }

  // 3. Integração com APIs Públicas Gratuitas de Livros
  // Open Library API
  async buscarOpenLibrary(isbn: string) {
    try {
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await fetch(url);
      const data = await response.json();
      const key = `ISBN:${isbn}`;

      if (data && data[key]) {
        const bookInfo = data[key];
        return {
          source: 'Open Library',
          titulo: bookInfo.title,
          autor: bookInfo.authors ? bookInfo.authors.map((a: any) => a.name).join(', ') : 'Desconhecido',
          url: bookInfo.url,
          capaUrl: bookInfo.cover ? bookInfo.cover.large || bookInfo.cover.medium : null,
          paginas: bookInfo.number_of_pages || '—'
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Gutendex API (Obras Clássicas Domínio Público)
  async buscarGutendex(searchQuery: string) {
    try {
      const url = `https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
      const results = data.results || [];

      return results.map((book: any) => ({
        id: book.id,
        source: 'Projeto Gutenberg',
        titulo: book.title,
        autor: book.authors && book.authors.length > 0 ? book.authors[0].name : 'Desconhecido',
        idiomas: book.languages,
        downloads: book.download_count,
        ePubUrl: book.formats['application/epub+zip'] || null,
        htmlUrl: book.formats['text/html'] || null
      }));
    } catch (e) {
      return [];
    }
  }
}
