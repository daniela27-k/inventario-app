import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoElementoService } from './tipo-elemento.service';
import { TipoElementoController } from './tipo-elemento.controller';
import { TipoElemento } from './tipo-elemento.entity';
import { Inventario } from '../inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoElemento, Inventario])],
  controllers: [TipoElementoController],
  providers: [TipoElementoService],
  exports: [TipoElementoService],
})
export class TipoElementoModule { }