import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('perfil/:userId')
  async getPerfil(@Param('userId') userId: string) {
    return this.settingsService.getPerfil(userId);
  }

  @Patch('perfil/:userId')
  async updatePerfil(@Param('userId') userId: string, @Body() body: any) {
    return this.settingsService.updatePerfil(userId, body);
  }

  @Patch('preferencias/:userId')
  async updatePreferencias(@Param('userId') userId: string, @Body() body: any) {
    return this.settingsService.updatePreferencias(userId, body);
  }

  @Post('logs/:userId')
  async registrarLogAcesso(@Param('userId') userId: string, @Body() body: any) {
    return this.settingsService.registrarLogAcesso(userId, body);
  }
}
