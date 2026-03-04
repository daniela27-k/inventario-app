// src/usuario/dto/create-usuario.dto.ts
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
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsOptional()
  @IsEnum(rolUsuario, { message: `El rol debe ser uno de: ${Object.values(rolUsuario).join(', ')}` })
  rol_usuario?: rolUsuario;

  @IsOptional()
  @IsEnum(estadoUsuario, { message: `El estado debe ser uno de: ${Object.values(estadoUsuario).join(', ')}` })
  estado_usuario?: estadoUsuario;
}
