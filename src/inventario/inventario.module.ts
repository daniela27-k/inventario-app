// import { Module } from '@nestjs/common';
// import { InventarioService } from './inventario.service';
// import { InventarioController } from './inventario.controller';

// @Module({
//   providers: [InventarioService],
//   controllers: [InventarioController],
// })
// export class InventarioModule {}


// inventario.module.ts (corregido)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Inventario } from './inventario.entity';
import { TipoElemento } from '../tipo-elemento/tipo-elemento.entity';
import { EstadoElemento } from '../estado-elemento/estado-elemento.entity';
import { Ambiente } from '../ambiente/ambiente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventario,
      TipoElemento,
      EstadoElemento,
      Ambiente,
    ]),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}