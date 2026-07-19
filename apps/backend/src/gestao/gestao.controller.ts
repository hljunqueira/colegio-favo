import { Controller, Get, Post, Patch, Delete, Body, Query, Param } from '@nestjs/common';
import { GestaoService } from './gestao.service';

@Controller()
export class GestaoController {
  constructor(private readonly gestaoService: GestaoService) {}

  // 1. Stats
  @Get('gestao/stats')
  async getStats() {
    return this.gestaoService.getStats();
  }

  // 2. Alunos
  @Get('gestao/alunos')
  async getAlunos(@Query('q') q?: string) {
    return this.gestaoService.getAlunos(q);
  }

  @Post('gestao/alunos')
  async createAluno(@Body() body: any) {
    return this.gestaoService.createAluno(body);
  }

  @Patch('gestao/alunos/:id')
  async updateAluno(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateAluno(id, body);
  }

  // 3. Turmas
  @Get('gestao/turmas')
  async getTurmas() {
    return this.gestaoService.getTurmas();
  }

  @Post('gestao/turmas')
  async createTurma(@Body() body: any) {
    return this.gestaoService.createTurma(body);
  }

  // 4. Professores
  @Get('gestao/professores')
  async getProfessores() {
    return this.gestaoService.getProfessores();
  }

  @Post('gestao/professores')
  async createProfessor(@Body() body: any) {
    return this.gestaoService.createProfessor(body);
  }

  // 5. Financeiro
  @Get('gestao/financeiro')
  async getFinanceiro() {
    return this.gestaoService.getFinanceiro();
  }

  // 6. Responsáveis
  @Get('gestao/responsaveis')
  async getResponsaveis() {
    return this.gestaoService.getResponsaveis();
  }

  // 7. Usuários
  @Get('gestao/usuarios')
  async getUsuarios() {
    return this.gestaoService.getUsuarios();
  }

  // 8. Avisos
  @Get('avisos')
  async getAvisos() {
    return this.gestaoService.getAvisos();
  }

  @Post('avisos')
  async createAviso(@Body() body: any) {
    return this.gestaoService.createAviso(body);
  }

  @Delete('avisos/:id')
  async deleteAviso(@Param('id') id: string) {
    return this.gestaoService.deleteAviso(id);
  }

  // 9. Leads
  @Get('admin/leads')
  async getLeads() {
    return this.gestaoService.getLeads();
  }

  @Post('leads')
  async createLead(@Body() body: any) {
    return this.gestaoService.createLead(body);
  }

  @Patch('admin/leads/:id')
  async updateLead(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateLead(id, body);
  }
}
