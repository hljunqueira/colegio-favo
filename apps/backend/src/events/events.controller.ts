import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEventos(@Query('userId') userId?: string) {
    return this.eventsService.getEventos(userId);
  }

  @Post()
  async criarEvento(@Body() body: any) {
    return this.eventsService.criarEvento(body);
  }

  @Patch(':id')
  async editarEvento(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.editarEvento(id, body);
  }

  @Delete(':id')
  async removerEvento(@Param('id') id: string) {
    return this.eventsService.removerEvento(id);
  }

  @Get('reunioes')
  async getReunioes(@Query('userId') userId: string) {
    return this.eventsService.getReunioes(userId);
  }

  @Post('reunioes')
  async criarReuniao(@Body() body: any) {
    return this.eventsService.criarReuniao(body);
  }

  @Patch('reunioes/:id')
  async analisarReuniao(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.analisarReuniao(id, body);
  }
}
