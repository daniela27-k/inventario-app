// src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// PartialType convierte todos los campos de CreateUsuarioDto en opcionales automáticamente.
// No es necesario redefinir los mismos campos aquí.
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) { }
