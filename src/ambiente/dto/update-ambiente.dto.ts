import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbienteDto } from './create-ambiente.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class UpdateAmbienteDto extends PartialType(CreateAmbienteDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del ambiente es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre_ambiente?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La capacidad debe ser un número' })
  @Min(1, { message: 'La capacidad debe ser mayor a 0' })
  capacidad?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  ubicacion?: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo', 'mantenimiento'], {
    message: 'El estado debe ser: activo, inactivo o mantenimiento'
  })
  estado?: 'activo' | 'inactivo' | 'mantenimiento';
}