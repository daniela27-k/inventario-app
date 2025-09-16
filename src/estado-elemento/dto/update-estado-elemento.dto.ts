// dto/update-estado-elemento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoElementoDto } from './create-estado-elemento.dto';
import { IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEstadoElementoDto extends PartialType(CreateEstadoElementoDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del estado es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre_estado?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El código de color es requerido' })
  @IsHexColor({ message: 'Debe ser un código de color hexadecimal válido (ej: #FF0000)' })
  @MinLength(7, { message: 'El código de color debe tener 7 caracteres (#RRGGBB)' })
  @MaxLength(7, { message: 'El código de color debe tener 7 caracteres (#RRGGBB)' })
  color_codigo?: string;
}