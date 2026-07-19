import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('aluno/:alunoId')
  async getNotasAluno(@Param('alunoId') alunoId: string) {
    return this.gradesService.getNotasAluno(alunoId);
  }

  @Post()
  async createNota(@Body() body: any) {
    return this.gradesService.createNota(body);
  }

  @Patch(':id')
  async updateNota(@Param('id') id: string, @Body() body: any) {
    return this.gradesService.updateNota(id, body);
  }
}
