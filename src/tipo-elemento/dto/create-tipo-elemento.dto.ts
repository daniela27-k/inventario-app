import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTipoElementoDto {
  @IsNotEmpty()
  nombre_tipo: string;

  @IsOptional()
  descripcion?: string;

  @IsEnum(['activo', 'inactivo'])
  estado: string;
}
