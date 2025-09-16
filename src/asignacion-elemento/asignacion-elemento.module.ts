// import { Module } from '@nestjs/common';
// import { AsignacionElementoService } from './asignacion-elemento.service';
// import { AsignacionElementoController } from './asignacion-elemento.controller';

// @Module({
//   providers: [AsignacionElementoService],
//   controllers: [AsignacionElementoController],
// })
// export class AsignacionElementoModule {}

// asignacion-elemento.module.ts (corregido)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionElementoService } from './asignacion-elemento.service';
import { AsignacionElementoController } from './asignacion-elemento.controller';
import { AsignacionElemento } from './asignacion-elemento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionElemento])],
  controllers: [AsignacionElementoController],
  providers: [AsignacionElementoService],
  exports: [AsignacionElementoService],
})
export class AsignacionElementoModule {}