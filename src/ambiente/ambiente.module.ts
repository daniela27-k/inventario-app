import { Module } from '@nestjs/common';
import { AmbienteService } from './ambiente.service';

@Module({
  providers: [AmbienteService],
})
export class AmbienteModule {}
