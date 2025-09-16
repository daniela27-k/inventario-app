// import { Module } from '@nestjs/common';
// import { AmbienteService } from './ambiente.service';

// @Module({
//   providers: [AmbienteService],
// })
// export class AmbienteModule {}

// ambiente.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbienteService } from './ambiente.service';
import { AmbienteController } from './ambiente.controller';
import { Ambiente } from './ambiente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ambiente])],
  controllers: [AmbienteController],
  providers: [AmbienteService],
  exports: [AmbienteService], // Para usar en otros módulos
})
export class AmbienteModule {}