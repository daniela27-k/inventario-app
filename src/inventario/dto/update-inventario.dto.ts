// dto/update-inventario.dto.ts
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateInventarioDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El número serial es requerido' })
  @IsString({ message: 'El número serial debe ser texto' })
  @MaxLength(255, { message: 'El número serial no puede exceder 255 caracteres' })
  @MinLength(3, { message: 'El número serial debe tener al menos 3 caracteres' })
  numero_serial?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El modelo es requerido' })
  @IsString({ message: 'El modelo debe ser texto' })
  @MaxLength(255, { message: 'El modelo no puede exceder 255 caracteres' })
  modelo?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La marca es requerida' })
  @IsString({ message: 'La marca debe ser texto' })
  @MaxLength(255, { message: 'La marca no puede exceder 255 caracteres' })
  marca?: string;

  @IsOptional()
  @IsString({ message: 'La ubicación actual debe ser texto' })
  @MaxLength(255, { message: 'La ubicación actual no puede exceder 255 caracteres' })
  ubicacion_actual?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de registro debe ser una fecha válida' })
  fecha_registro?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del tipo de elemento debe ser un número' })
  id_tipo_elemento?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del estado de elemento debe ser un número' })
  id_estado_elemento?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del ambiente debe ser un número' })
  id_ambiente?: number;
}