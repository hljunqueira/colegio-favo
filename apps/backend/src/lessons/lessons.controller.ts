import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // 1. Atividades (Homework)
  @Get('atividades/turma/:turmaId')
  async getAtividadesTurma(@Param('turmaId') turmaId: string) {
    return this.lessonsService.getAtividadesTurma(turmaId);
  }

  @Post('atividades')
  async criarAtividade(@Body() body: any) {
    return this.lessonsService.criarAtividade(body);
  }

  // 2. Entregas de Atividades
  @Get('atividades/entregas/:atividadeId')
  async getEntregasAtividade(@Param('atividadeId') atividadeId: string) {
    return this.lessonsService.getEntregasAtividade(atividadeId);
  }

  @Get('atividades/aluno/:alunoId')
  async getEntregasAluno(@Param('alunoId') alunoId: string) {
    return this.lessonsService.getEntregasAluno(alunoId);
  }

  @Post('atividades/entregar')
  async entregarAtividade(@Body() body: any) {
    return this.lessonsService.entregarAtividade(body);
  }

  @Patch('atividades/corrigir/:id')
  async corrigirEntrega(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.corrigirEntrega(id, body);
  }

  // 3. Planos de Aula
  @Get('planos/turma/:turmaId')
  async getPlanosAulaTurma(@Param('turmaId') turmaId: string) {
    return this.lessonsService.getPlanosAulaTurma(turmaId);
  }

  @Get('planos/professor/:professorId')
  async getPlanosAulaProfessor(@Param('professorId') professorId: string) {
    return this.lessonsService.getPlanosAulaProfessor(professorId);
  }

  @Get('planos')
  async getAllPlanosAula() {
    return this.lessonsService.getAllPlanosAula();
  }

  @Post('planos')
  async criarPlanoAula(@Body() body: any) {
    return this.lessonsService.criarPlanoAula(body);
  }

  @Patch('planos/analisar/:id')
  async analisarPlanoAula(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.analisarPlanoAula(id, body);
  }
}
