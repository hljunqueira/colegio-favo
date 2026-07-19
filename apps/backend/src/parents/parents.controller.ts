import { Controller, Get, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('dashboard')
  async getDashboardData(@Query('userId') userId: string) {
    return this.parentsService.getDashboardData(userId);
  }
}
