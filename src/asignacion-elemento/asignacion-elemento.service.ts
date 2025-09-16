// asignacion-elemento.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionElemento } from './asignacion-elemento.entity';
import { CreateAsignacionElementoDto } from './dto/create-asignacion-elemento.dto';
import { UpdateAsignacionElementoDto } from './dto/update-asignacion-elemento.dto';

@Injectable()
export class AsignacionElementoService {
  constructor(
    @InjectRepository(AsignacionElemento)
    private asignacionRepository: Repository<AsignacionElemento>,
  ) {}

  async create(createAsignacionDto: CreateAsignacionElementoDto): Promise<AsignacionElemento> {
    // Validar que la fecha de devolución estimada sea posterior a la fecha de asignación
    const fechaAsignacion = new Date(createAsignacionDto.fecha_asignacion);
    const fechaDevolucionEstimada = new Date(createAsignacionDto.fecha_devolucion_estimada);

    if (fechaDevolucionEstimada <= fechaAsignacion) {
      throw new BadRequestException('La fecha de devolución estimada debe ser posterior a la fecha de asignación');
    }

    const asignacion = this.asignacionRepository.create({
      nombreElemento: createAsignacionDto.nombreElemento,
      fecha_asignacion: fechaAsignacion,
      fecha_devolucion_estimada: fechaDevolucionEstimada,
      fecha_devolucion_real: createAsignacionDto.fecha_devolucion_real 
        ? new Date(createAsignacionDto.fecha_devolucion_real) 
        : undefined,
      estado_asignacion: createAsignacionDto.estado_asignacion,
      notas: createAsignacionDto.notas,
      id_instructor: createAsignacionDto.id_instructor,
    });

    return await this.asignacionRepository.save(asignacion);
  }

  async findAll(): Promise<AsignacionElemento[]> {
    return await this.asignacionRepository.find({
      relations: ['usuario'],
      order: { fecha_asignacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AsignacionElemento> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  async findByUsuario(id_instructor: number): Promise<AsignacionElemento[]> {
    return await this.asignacionRepository.find({
      where: { id_instructor },
      relations: ['usuario'],
      order: { fecha_asignacion: 'DESC' },
    });
  }

  async findByEstado(estado: 'activa' | 'devuelta' | 'perdida' | 'dañada'): Promise<AsignacionElemento[]> {
    return await this.asignacionRepository.find({
      where: { estado_asignacion: estado },
      relations: ['usuario'],
      order: { fecha_asignacion: 'DESC' },
    });
  }

  async update(id: number, updateAsignacionDto: UpdateAsignacionElementoDto): Promise<AsignacionElemento> {
    const asignacion = await this.findOne(id);

    // Validaciones si se actualizan las fechas
    if (updateAsignacionDto.fecha_asignacion || updateAsignacionDto.fecha_devolucion_estimada) {
      const fechaAsignacion = updateAsignacionDto.fecha_asignacion 
        ? new Date(updateAsignacionDto.fecha_asignacion)
        : asignacion.fecha_asignacion;
      
      const fechaDevolucionEstimada = updateAsignacionDto.fecha_devolucion_estimada
        ? new Date(updateAsignacionDto.fecha_devolucion_estimada)
        : asignacion.fecha_devolucion_estimada;

      if (fechaDevolucionEstimada <= fechaAsignacion) {
        throw new BadRequestException('La fecha de devolución estimada debe ser posterior a la fecha de asignación');
      }
    }

    // Aplicar actualizaciones
    if (updateAsignacionDto.nombreElemento !== undefined) {
      asignacion.nombreElemento = updateAsignacionDto.nombreElemento;
    }
    if (updateAsignacionDto.fecha_asignacion !== undefined) {
      asignacion.fecha_asignacion = new Date(updateAsignacionDto.fecha_asignacion);
    }
    if (updateAsignacionDto.fecha_devolucion_estimada !== undefined) {
      asignacion.fecha_devolucion_estimada = new Date(updateAsignacionDto.fecha_devolucion_estimada);
    }
    if (updateAsignacionDto.fecha_devolucion_real !== undefined) {
      asignacion.fecha_devolucion_real = new Date(updateAsignacionDto.fecha_devolucion_real);
    }
    if (updateAsignacionDto.estado_asignacion !== undefined) {
      asignacion.estado_asignacion = updateAsignacionDto.estado_asignacion;
    }
    if (updateAsignacionDto.notas !== undefined) {
      asignacion.notas = updateAsignacionDto.notas;
    }
    if (updateAsignacionDto.id_instructor !== undefined) {
      asignacion.id_instructor = updateAsignacionDto.id_instructor;
    }

    return await this.asignacionRepository.save(asignacion);
  }

  async marcarComoDevuelta(id: number, fechaDevolucionReal?: string): Promise<AsignacionElemento> {
    const asignacion = await this.findOne(id);
    
    asignacion.estado_asignacion = 'devuelta';
    asignacion.fecha_devolucion_real = fechaDevolucionReal 
      ? new Date(fechaDevolucionReal) 
      : new Date();

    return await this.asignacionRepository.save(asignacion);
  }

  async remove(id: number): Promise<void> {
    const asignacion = await this.findOne(id);
    await this.asignacionRepository.remove(asignacion);
  }
}