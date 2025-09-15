//src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength, IsEnum, IsEmail } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
import { rolUsuario, estadoUsuario} from '../usuario.entity'; // Importa los enum rolusuario y estadoUsuario

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    // las propiedades aqui son opcionales porque partialtype ya las hace opcionales.
    // sin embargo, podemos añadir validadores especificos o anular los existentes.

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

    @IsOptional()
    @IsEnum(rolUsuario, {message: `El rol debe ser uno de los siguientes: ${Object.values(rolUsuario).join(', ')}`})
    rol?: rolUsuario;

    @IsOptional()
    @IsEnum(estadoUsuario, {message: `El estado debe ser uno de los siguientes: ${Object.values(estadoUsuario).join(', ')}`})
    estado?: estadoUsuario;
    
}
 