// import { Module } from '@nestjs/common';
// import { TipoElementoService } from './tipo-elemento.service';

// @Module({
//   providers: [TipoElementoService],
// })
// export class TipoElementoModule {}

// tipo-elemento.module.ts (corregido)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoElementoService } from './tipo-elemento.service';
import { TipoElementoController } from './tipo-elemento.controller';
import { TipoElemento } from './tipo-elemento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoElemento])],
  controllers: [TipoElementoController],
  providers: [TipoElementoService],
  exports: [TipoElementoService],
})
export class TipoElementoModule {}