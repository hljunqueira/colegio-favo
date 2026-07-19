import { Controller, Get, Query } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('dashboard')
  async getDashboardData(@Query('userId') userId: string) {
    return this.studentsService.getDashboardData(userId);
  }
}
