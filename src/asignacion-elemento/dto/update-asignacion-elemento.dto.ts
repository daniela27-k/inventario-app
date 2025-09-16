// dto/update-asignacion-elemento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignacionElementoDto } from './create-asignacion-elemento.dto';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAsignacionElementoDto extends PartialType(CreateAsignacionElementoDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del elemento es requerido' })
  @IsString({ message: 'El nombre del elemento debe ser texto' })
  nombreElemento?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de asignación debe ser una fecha válida' })
  fecha_asignacion?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de devolución estimada debe ser una fecha válida' })
  fecha_devolucion_estimada?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de devolución real debe ser una fecha válida' })
  fecha_devolucion_real?: string;

  @IsOptional()
  @IsEnum(['activa', 'devuelta', 'perdida', 'dañada'], {
    message: 'El estado debe ser: activa, devuelta, perdida o dañada'
  })
  estado_asignacion?: 'activa' | 'devuelta' | 'perdida' | 'dañada';

  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  notas?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del instructor debe ser un número' })
  id_instructor?: number;
}
