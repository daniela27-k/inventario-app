import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAsignacionElementoDto {
  @IsDateString()
  fecha_asignacion: Date;

  @IsDateString()
  fecha_devolucion_estimada: Date;

  @IsOptional()
  @IsDateString()
  fecha_devolucion_real?: Date;

  @IsEnum(['activa', 'devuelta', 'perdida', 'dañada'])
  estado_asignacion: string;

  @IsOptional()
  notas?: string;

  @IsNumber()
  id_instructor: number;
}
