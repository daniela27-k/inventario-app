// dto/update-tipo-elemento.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTipoElementoDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del tipo es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre_tipo?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'], {
    message: 'El estado debe ser: activo o inactivo'
  })
  estado?: 'activo' | 'inactivo';
}