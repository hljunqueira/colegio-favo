import { Module } from '@nestjs/common';
import { GestaoController } from './gestao.controller';
import { GestaoService } from './gestao.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GestaoController],
  providers: [GestaoService],
  exports: [GestaoService],
})
export class GestaoModule {}
