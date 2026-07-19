import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('aluno/:alunoId')
  async getFrequenciaAluno(@Param('alunoId') alunoId: string) {
    return this.attendanceService.getFrequenciaAluno(alunoId);
  }

  @Get('turma/:turmaId')
  async getFrequenciaTurmaData(
    @Param('turmaId') turmaId: string,
    @Query('data') data: string
  ) {
    return this.attendanceService.getFrequenciaTurmaData(turmaId, data);
  }

  @Post('lote')
  async registrarFrequenciaLote(@Body() body: any) {
    return this.attendanceService.registrarFrequenciaLote(body);
  }

  @Get('atestados')
  async getAtestados(@Query('alunoId') alunoId?: string) {
    if (alunoId) {
      return this.attendanceService.getAtestados(alunoId);
    }
    return this.attendanceService.getAllAtestados();
  }

  @Post('atestados')
  async enviarAtestado(@Body() body: any) {
    return this.attendanceService.enviarAtestado(body);
  }

  @Patch('atestados/:id')
  async analisarAtestado(@Param('id') id: string, @Body() body: any) {
    return this.attendanceService.analisarAtestado(id, body);
  }
}
