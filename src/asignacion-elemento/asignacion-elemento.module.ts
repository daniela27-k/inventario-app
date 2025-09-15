import { Module } from '@nestjs/common';
import { AsignacionElementoService } from './asignacion-elemento.service';
import { AsignacionElementoController } from './asignacion-elemento.controller';

@Module({
  providers: [AsignacionElementoService],
  controllers: [AsignacionElementoController],
})
export class AsignacionElementoModule {}
