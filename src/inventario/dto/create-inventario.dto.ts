// import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

// export class CreateInventarioDto {
//   @IsNotEmpty()
//   nombre: string;

//   @IsOptional()
//   descripcion?: string;

//   @IsNotEmpty()
//   numero_serial: string;

//   @IsNotEmpty()
//   modelo: string;

//   @IsNotEmpty()
//   marca: string;

//   @IsOptional()
//   ubicacion_actual?: string;

//   @IsDateString()
//   fecha_registro: Date;

//   @IsNumber()
//   id_tipo_elemento: number;

//   @IsNumber()
//   id_estado_elemento: number;

//   @IsNumber()
//   id_ambiente: number;
// }

// dto/create-inventario.dto.ts (mejorado)
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInventarioDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El número serial es requerido' })
  @IsString({ message: 'El número serial debe ser texto' })
  @MaxLength(255, { message: 'El número serial no puede exceder 255 caracteres' })
  @MinLength(3, { message: 'El número serial debe tener al menos 3 caracteres' })
  numero_serial: string;

  @IsNotEmpty({ message: 'El modelo es requerido' })
  @IsString({ message: 'El modelo debe ser texto' })
  @MaxLength(255, { message: 'El modelo no puede exceder 255 caracteres' })
  modelo: string;

  @IsNotEmpty({ message: 'La marca es requerida' })
  @IsString({ message: 'La marca debe ser texto' })
  @MaxLength(255, { message: 'La marca no puede exceder 255 caracteres' })
  marca: string;

  @IsOptional()
  @IsString({ message: 'La ubicación actual debe ser texto' })
  @MaxLength(255, { message: 'La ubicación actual no puede exceder 255 caracteres' })
  ubicacion_actual?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de registro debe ser una fecha válida' })
  fecha_registro?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de baja debe ser una fecha válida' })
  fecha_baja?: string;

  @IsOptional()
  @IsString({ message: 'El motivo de baja debe ser texto' })
  motivo_baja?: string;

  @IsNumber({}, { message: 'El ID del tipo de elemento debe ser un número' })
  id_tipo_elemento: number;

  @IsNumber({}, { message: 'El ID del estado de elemento debe ser un número' })
  id_estado_elemento: number;

  @IsNumber({}, { message: 'El ID del ambiente debe ser un número' })
  id_ambiente: number;
}
