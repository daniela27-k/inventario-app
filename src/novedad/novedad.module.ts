// src/novedad/novedad.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NovedadService } from './novedad.service';
import { NovedadController } from './novedad.controller';
import { Novedad } from './novedad.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Novedad])],
    controllers: [NovedadController],
    providers: [NovedadService],
    exports: [NovedadService],
})
export class NovedadModule { }
