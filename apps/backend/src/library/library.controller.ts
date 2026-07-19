import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // 1. Acervo Local
  @Get('livros')
  async buscarLivrosFisicos(@Query('q') q?: string) {
    return this.libraryService.buscarLivrosFisicos(q);
  }

  @Post('livros')
  async cadastrarLivro(@Body() body: any) {
    return this.libraryService.cadastrarLivro(body);
  }

  // 2. Reservas
  @Get('reservas')
  async getReservas(@Query('alunoId') alunoId?: string) {
    if (alunoId) {
      return this.libraryService.getReservasAluno(alunoId);
    }
    return this.libraryService.getAllReservas();
  }

  @Post('reservas')
  async criarReserva(@Body() body: any) {
    return this.libraryService.criarReserva(body);
  }

  @Patch('reservas/:id')
  async analisarReserva(@Param('id') id: string, @Body() body: any) {
    return this.libraryService.analisarReserva(id, body);
  }

  // 3. Integração com APIs externas
  @Get('external/openlibrary')
  async buscarOpenLibrary(@Query('isbn') isbn: string) {
    return this.libraryService.buscarOpenLibrary(isbn);
  }

  @Get('external/gutendex')
  async buscarGutendex(@Query('q') q: string) {
    return this.libraryService.buscarGutendex(q);
  }
}
