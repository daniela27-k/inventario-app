import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateInventarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  descripcion?: string;

  @IsNotEmpty()
  numero_serial: string;

  @IsNotEmpty()
  modelo: string;

  @IsNotEmpty()
  marca: string;

  @IsOptional()
  ubicacion_actual?: string;

  @IsDateString()
  fecha_registro: Date;

  @IsNumber()
  id_tipo_elemento: number;

  @IsNumber()
  id_estado_elemento: number;

  @IsNumber()
  id_ambiente: number;
}
