import { Module } from '@nestjs/common';
import { TipoElementoService } from './tipo-elemento.service';

@Module({
  providers: [TipoElementoService],
})
export class TipoElementoModule {}
