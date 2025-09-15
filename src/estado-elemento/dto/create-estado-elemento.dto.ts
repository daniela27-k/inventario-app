import { IsHexColor, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEstadoElementoDto {
  @IsNotEmpty()
  nombre_estado: string;

  @IsOptional()
  descripcion?: string;

  @IsHexColor()
  color_codigo: string; // Ej: "#FF0000"
}
