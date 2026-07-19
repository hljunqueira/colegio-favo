import { Controller, Get, Post, Patch, Delete, Body, Query, Param } from '@nestjs/common';
import { GestaoService } from './gestao.service';

@Controller()
export class GestaoController {
  constructor(private readonly gestaoService: GestaoService) {}

  // 1. Stats Geral
  @Get('gestao/stats')
  async getStats() {
    return this.gestaoService.getStats();
  }

  // 2. Alunos CRUD
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

  @Delete('gestao/alunos/:id')
  async deleteAluno(@Param('id') id: string) {
    return this.gestaoService.deleteAluno(id);
  }

  // 3. Turmas CRUD
  @Get('gestao/turmas')
  async getTurmas() {
    return this.gestaoService.getTurmas();
  }

  @Post('gestao/turmas')
  async createTurma(@Body() body: any) {
    return this.gestaoService.createTurma(body);
  }

  @Patch('gestao/turmas/:id')
  async updateTurma(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateTurma(id, body);
  }

  @Delete('gestao/turmas/:id')
  async deleteTurma(@Param('id') id: string) {
    return this.gestaoService.deleteTurma(id);
  }

  // 4. Professores CRUD
  @Get('gestao/professores')
  async getProfessores() {
    return this.gestaoService.getProfessores();
  }

  @Post('gestao/professores')
  async createProfessor(@Body() body: any) {
    return this.gestaoService.createProfessor(body);
  }

  @Patch('gestao/professores/:id')
  async updateProfessor(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateProfessor(id, body);
  }

  @Delete('gestao/professores/:id')
  async deleteProfessor(@Param('id') id: string) {
    return this.gestaoService.deleteProfessor(id);
  }

  // 5. Financeiro CRUD
  @Get('gestao/financeiro')
  async getFinanceiro() {
    return this.gestaoService.getFinanceiro();
  }

  @Patch('gestao/financeiro/:id')
  async updateFinanceiro(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateFinanceiro(id, body);
  }

  @Delete('gestao/financeiro/:id')
  async deleteFinanceiro(@Param('id') id: string) {
    return this.gestaoService.deleteFinanceiro(id);
  }

  // 6. Responsáveis CRUD
  @Get('gestao/responsaveis')
  async getResponsaveis() {
    return this.gestaoService.getResponsaveis();
  }

  @Post('gestao/responsaveis')
  async createResponsavel(@Body() body: any) {
    return this.gestaoService.createResponsavel(body);
  }

  @Patch('gestao/responsaveis/:id')
  async updateResponsavel(@Param('id') id: string, @Body() body: any) {
    return this.gestaoService.updateResponsavel(id, body);
  }

  @Delete('gestao/responsaveis/:id')
  async deleteResponsavel(@Param('id') id: string) {
    return this.gestaoService.deleteResponsavel(id);
  }

  // 7. Usuários do Sistema
  @Get('gestao/usuarios')
  async getUsuarios() {
    return this.gestaoService.getUsuarios();
  }

  // 8. Avisos / Comunicados CRUD
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

  // 9. Leads / Contatos
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

  // 10. Buscador Global da Barra de Navegação
  @Get('gestao/search')
  async searchGlobal(@Query('q') q: string) {
    return this.gestaoService.searchGlobal(q);
  }
}
