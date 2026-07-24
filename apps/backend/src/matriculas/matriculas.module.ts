import { Module } from '@nestjs/common';
import { MatriculasController } from './matriculas.controller';
import { MatriculasService } from './matriculas.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MatriculasController],
  providers: [MatriculasService],
  exports: [MatriculasService],
})
export class MatriculasModule {}
