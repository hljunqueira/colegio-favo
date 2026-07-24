import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post('gerar-link')
  async gerarLink(@Body() body: any) {
    return this.matriculasService.gerarLink(body);
  }

  @Get('pendentes')
  async getPendentes() {
    return this.matriculasService.getPendentes();
  }

  @Get('validar-token/:token')
  async validarToken(@Param('token') token: string) {
    return this.matriculasService.validarToken(token);
  }

  @Post('enviar-dados/:token')
  async enviarDados(@Param('token') token: string, @Body() body: any) {
    return this.matriculasService.enviarDados(token, body);
  }

  @Patch('analisar/:id')
  async analisar(@Param('id') id: string, @Body() body: any) {
    return this.matriculasService.analisar(id, body);
  }

  @Post('efetivar/:id')
  async efetivar(@Param('id') id: string) {
    return this.matriculasService.efetivar(id);
  }
}
