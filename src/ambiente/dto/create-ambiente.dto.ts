import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAmbienteDto {
  @IsNotEmpty()
  nombre_ambiente: string;

  @IsNumber()
  capacidad: number;

  @IsNotEmpty()
  ubicacion: string;

  @IsEnum(['activo', 'inactivo', 'mantenimiento'])
  estado: string;
}
