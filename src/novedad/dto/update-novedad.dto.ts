// src/novedad/dto/update-novedad.dto.ts
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoNovedad, TipoNovedad } from '../novedad.entity';

export class UpdateNovedadDto {
    @IsOptional()
    @IsEnum(TipoNovedad)
    tipo_novedad?: TipoNovedad;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    descripcion?: string;

    @IsOptional()
    @IsEnum(EstadoNovedad, {
        message: `El estado debe ser: ${Object.values(EstadoNovedad).join(', ')}`,
    })
    estado_novedad?: EstadoNovedad;

    // Solo el administrador puede agregar observaciones y cambiar estado
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    observaciones_admin?: string;
}
