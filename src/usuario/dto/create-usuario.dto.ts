//ejemplo para create.usuario.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { rolUsuario, estadoUsuario } from '../usuario.entity';
export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsOptional()
  @IsEnum(rolUsuario)
  rol?: rolUsuario;

  @IsOptional()
  @IsEnum(estadoUsuario)
  estado?: estadoUsuario;
}
