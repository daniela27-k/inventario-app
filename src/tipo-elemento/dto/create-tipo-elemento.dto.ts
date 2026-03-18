import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTipoElementoDto {
  @IsNotEmpty()
  nombre_tipo: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsEnum(['activo', 'inactivo'])
  estado: string;

  @IsOptional()
  @IsString()
  numero_serial?: string;

  @IsOptional()
  @IsString()
  modelo?: string;
}