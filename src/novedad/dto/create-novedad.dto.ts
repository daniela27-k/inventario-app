// src/novedad/dto/create-novedad.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString, MaxLength } from 'class-validator';
import { TipoNovedad } from '../novedad.entity';

export class CreateNovedadDto {
    @IsEnum(TipoNovedad, {
        message: `El tipo debe ser: ${Object.values(TipoNovedad).join(', ')}`,
    })
    tipo_novedad: TipoNovedad;

    @IsNotEmpty({ message: 'La descripción es requerida' })
    @IsString()
    @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres' })
    descripcion: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha debe ser una fecha válida (YYYY-MM-DD)' })
    fecha_novedad?: string;

    @IsNumber({}, { message: 'El ID del inventario debe ser un número' })
    id_inventario: number;

    // id_usuario_reporta lo asigna el backend desde el JWT, no el cliente
}
