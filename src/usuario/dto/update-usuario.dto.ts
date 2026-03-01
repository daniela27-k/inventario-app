//src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength, IsEnum, IsEmail } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
import { rolUsuario, estadoUsuario } from '../usuario.entity';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsOptional()
    @IsString()
    nombre_completo?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    // Campo correcto según la entidad
    @IsOptional()
    @IsEnum(rolUsuario, { message: `El rol debe ser uno de: ${Object.values(rolUsuario).join(', ')}` })
    rol_usuario?: rolUsuario;

    // Campo correcto según la entidad
    @IsOptional()
    @IsEnum(estadoUsuario, { message: `El estado debe ser uno de: ${Object.values(estadoUsuario).join(', ')}` })
    estado_usuario?: estadoUsuario;
}
