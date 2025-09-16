// import { Module } from '@nestjs/common';
// import { EstadoElementoService } from './estado-elemento.service';

// @Module({
//   providers: [EstadoElementoService],
// })
// export class EstadoElementoModule {}


// estado-elemento.module.ts (corregido)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoElementoService } from './estado-elemento.service';
import { EstadoElementoController } from './estado-elemento.controller';
import { EstadoElemento } from './estado-elemento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoElemento])],
  controllers: [EstadoElementoController],
  providers: [EstadoElementoService],
  exports: [EstadoElementoService],
})
export class EstadoElementoModule {}
