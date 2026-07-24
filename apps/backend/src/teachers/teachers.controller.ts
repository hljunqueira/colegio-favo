import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('profile')
  async getProfile(@Query('userId') userId: string) {
    return this.teachersService.getProfessorByUserId(userId);
  }

  @Get('turmas')
  async getTurmas() {
    return this.teachersService.getTurmas();
  }

  @Get('alunos')
  async getAlunosDaTurma(@Query('turmaId') turmaId: string) {
    return this.teachersService.getAlunosDaTurma(turmaId);
  }

  @Post('chamada')
  async registrarChamada(@Body() body: any) {
    return this.teachersService.registrarChamada(body);
  }

  @Post('notas')
  async registrarNota(@Body() body: any) {
    return this.teachersService.registrarNota(body);
  }

  @Get('contatos')
  async getContatos() {
    return this.teachersService.getContatos();
  }

  @Get('funcionario/profile')
  async getFuncionarioProfile(@Query('userId') userId: string) {
    return this.teachersService.getFuncionarioByUserId(userId);
  }

  @Get('funcionario/escalas')
  async getEscalas(@Query('funcionarioId') funcionarioId: string) {
    return this.teachersService.getEscalasByFuncionarioId(funcionarioId);
  }

  @Get('funcionario/solicitacoes')
  async getSolicitacoes(@Query('funcionarioId') funcionarioId: string) {
    return this.teachersService.getSolicitacoesByFuncionarioId(funcionarioId);
  }

  @Post('funcionario/solicitacoes')
  async criarSolicitacao(@Body() body: any) {
    return this.teachersService.criarSolicitacao(body);
  }
}
