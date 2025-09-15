import { Module } from '@nestjs/common';
import { EstadoElementoService } from './estado-elemento.service';

@Module({
  providers: [EstadoElementoService],
})
export class EstadoElementoModule {}
