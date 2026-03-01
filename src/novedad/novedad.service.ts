// src/novedad/novedad.service.ts
import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Novedad, EstadoNovedad } from './novedad.entity';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';
import { rolUsuario } from '../usuario/usuario.entity';

@Injectable()
export class NovedadService {
    constructor(
        @InjectRepository(Novedad)
        private readonly novedadRepository: Repository<Novedad>,
    ) { }

    // ── Crear novedad (cualquier usuario autenticado) ─────────────────────────
    async create(createNovedadDto: CreateNovedadDto, idUsuario: number): Promise<Novedad> {
        const novedad = this.novedadRepository.create({
            tipo_novedad: createNovedadDto.tipo_novedad,
            descripcion: createNovedadDto.descripcion,
            fecha_novedad: createNovedadDto.fecha_novedad
                ? new Date(createNovedadDto.fecha_novedad)
                : new Date(),
            id_inventario: createNovedadDto.id_inventario,
            id_usuario_reporta: idUsuario,
            estado_novedad: EstadoNovedad.PENDIENTE,
            observaciones_admin: null,
        });
        return this.novedadRepository.save(novedad);
    }

    // ── Listar todas (solo ADMIN/INSTRUCTOR) ─────────────────────────────────
    async findAll(): Promise<Novedad[]> {
        return this.novedadRepository.find({
            relations: ['inventario', 'usuarioReporta'],
            order: { created_at: 'DESC' },
        });
    }

    // ── Listar por usuario (mis novedades) ───────────────────────────────────
    async findByUsuario(idUsuario: number): Promise<Novedad[]> {
        return this.novedadRepository.find({
            where: { id_usuario_reporta: idUsuario },
            relations: ['inventario'],
            order: { created_at: 'DESC' },
        });
    }

    // ── Listar por inventario ────────────────────────────────────────────────
    async findByInventario(idInventario: number): Promise<Novedad[]> {
        return this.novedadRepository.find({
            where: { id_inventario: idInventario },
            relations: ['usuarioReporta'],
            order: { created_at: 'DESC' },
        });
    }

    // ── Obtener una novedad por ID ────────────────────────────────────────────
    async findOne(id: number): Promise<Novedad> {
        const novedad = await this.novedadRepository.findOne({
            where: { id_novedad: id },
            relations: ['inventario', 'usuarioReporta'],
        });
        if (!novedad) {
            throw new NotFoundException(`Novedad con ID ${id} no encontrada.`);
        }
        return novedad;
    }

    // ── Actualizar novedad (admin: cualquier campo; usuario: solo si PENDIENTE) ─
    async update(
        id: number,
        updateNovedadDto: UpdateNovedadDto,
        idUsuario: number,
        rolActual: rolUsuario,
    ): Promise<Novedad> {
        const novedad = await this.findOne(id);

        const esAdmin = rolActual === rolUsuario.ADMIN;
        const esPropia = novedad.id_usuario_reporta === idUsuario;

        if (!esAdmin && !esPropia) {
            throw new ForbiddenException('No puedes modificar novedades de otros usuarios.');
        }

        // Usuarios normales solo pueden editar si está pendiente
        if (!esAdmin && novedad.estado_novedad !== EstadoNovedad.PENDIENTE) {
            throw new ForbiddenException('Solo puedes editar novedades en estado "pendiente".');
        }

        // Solo admin puede cambiar estado y poner observaciones
        if (!esAdmin) {
            delete updateNovedadDto.estado_novedad;
            delete updateNovedadDto.observaciones_admin;
        }

        Object.assign(novedad, updateNovedadDto);
        return this.novedadRepository.save(novedad);
    }

    // ── Eliminar (solo ADMIN o propietario si está PENDIENTE) ─────────────────
    async remove(id: number, idUsuario: number, rolActual: rolUsuario): Promise<void> {
        const novedad = await this.findOne(id);

        const esAdmin = rolActual === rolUsuario.ADMIN;
        const esPropia = novedad.id_usuario_reporta === idUsuario;

        if (!esAdmin && (!esPropia || novedad.estado_novedad !== EstadoNovedad.PENDIENTE)) {
            throw new ForbiddenException('No puedes eliminar esta novedad.');
        }

        await this.novedadRepository.remove(novedad);
    }
}
