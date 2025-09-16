// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class EstadoElementoService {}

// estado-elemento.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoElemento } from './estado-elemento.entity';
import { CreateEstadoElementoDto } from './dto/create-estado-elemento.dto';
import { UpdateEstadoElementoDto } from './dto/update-estado-elemento.dto';

@Injectable()
export class EstadoElementoService {
  constructor(
    @InjectRepository(EstadoElemento)
    private estadoElementoRepository: Repository<EstadoElemento>,
  ) {}

  async create(createEstadoElementoDto: CreateEstadoElementoDto): Promise<EstadoElemento> {
    // Verificar si ya existe un estado con el mismo nombre
    const existingEstado = await this.estadoElementoRepository.findOne({
      where: { nombre_estado: createEstadoElementoDto.nombre_estado },
    });

    if (existingEstado) {
      throw new ConflictException(`Ya existe un estado con el nombre: ${createEstadoElementoDto.nombre_estado}`);
    }

    // Verificar si ya existe un estado con el mismo color
    const existingColor = await this.estadoElementoRepository.findOne({
      where: { color_codigo: createEstadoElementoDto.color_codigo },
    });

    if (existingColor) {
      throw new ConflictException(`Ya existe un estado con el color: ${createEstadoElementoDto.color_codigo}`);
    }

    const estadoElemento = this.estadoElementoRepository.create({
      nombre_estado: createEstadoElementoDto.nombre_estado,
      descripcion: createEstadoElementoDto.descripcion || '',
      color_codigo: createEstadoElementoDto.color_codigo.toUpperCase(),
    });

    return await this.estadoElementoRepository.save(estadoElemento);
  }

  async findAll(): Promise<EstadoElemento[]> {
    return await this.estadoElementoRepository.find({
      relations: ['inventarios'],
      order: { nombre_estado: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EstadoElemento> {
    const estadoElemento = await this.estadoElementoRepository.findOne({
      where: { id_estado_elemento: id },
      relations: ['inventarios'],
    });

    if (!estadoElemento) {
      throw new NotFoundException(`Estado de elemento con ID ${id} no encontrado`);
    }

    return estadoElemento;
  }

  async findByNombre(nombre: string): Promise<EstadoElemento[]> {
    return await this.estadoElementoRepository
      .createQueryBuilder('estado')
      .where('LOWER(estado.nombre_estado) LIKE LOWER(:nombre)', { nombre: `%${nombre}%` })
      .leftJoinAndSelect('estado.inventarios', 'inventarios')
      .orderBy('estado.nombre_estado', 'ASC')
      .getMany();
  }

  async getEstadosConConteo(): Promise<any[]> {
    return await this.estadoElementoRepository
      .createQueryBuilder('estado')
      .leftJoin('estado.inventarios', 'inventario')
      .select([
        'estado.id_estado_elemento',
        'estado.nombre_estado',
        'estado.descripcion',
        'estado.color_codigo',
        'COUNT(inventario.id_inventario) as total_elementos'
      ])
      .groupBy('estado.id_estado_elemento')
      .orderBy('estado.nombre_estado', 'ASC')
      .getRawMany();
  }

  async update(id: number, updateEstadoElementoDto: UpdateEstadoElementoDto): Promise<EstadoElemento> {
    const estadoElemento = await this.findOne(id);

    // Verificar conflictos de nombre (si se está actualizando)
    if (updateEstadoElementoDto.nombre_estado && 
        updateEstadoElementoDto.nombre_estado !== estadoElemento.nombre_estado) {
      const existingNombre = await this.estadoElementoRepository.findOne({
        where: { nombre_estado: updateEstadoElementoDto.nombre_estado },
      });

      if (existingNombre && existingNombre.id_estado_elemento !== id) {
        throw new ConflictException(`Ya existe un estado con el nombre: ${updateEstadoElementoDto.nombre_estado}`);
      }
    }

    // Verificar conflictos de color (si se está actualizando)
    if (updateEstadoElementoDto.color_codigo && 
        updateEstadoElementoDto.color_codigo.toUpperCase() !== estadoElemento.color_codigo) {
      const existingColor = await this.estadoElementoRepository.findOne({
        where: { color_codigo: updateEstadoElementoDto.color_codigo.toUpperCase() },
      });

      if (existingColor && existingColor.id_estado_elemento !== id) {
        throw new ConflictException(`Ya existe un estado con el color: ${updateEstadoElementoDto.color_codigo}`);
      }
    }

    // Aplicar actualizaciones
    if (updateEstadoElementoDto.nombre_estado !== undefined) {
      estadoElemento.nombre_estado = updateEstadoElementoDto.nombre_estado;
    }
    if (updateEstadoElementoDto.descripcion !== undefined) {
      estadoElemento.descripcion = updateEstadoElementoDto.descripcion;
    }
    if (updateEstadoElementoDto.color_codigo !== undefined) {
      estadoElemento.color_codigo = updateEstadoElementoDto.color_codigo.toUpperCase();
    }

    return await this.estadoElementoRepository.save(estadoElemento);
  }

  async remove(id: number): Promise<void> {
    const estadoElemento = await this.findOne(id);

    // Verificar si el estado tiene elementos asociados
    if (estadoElemento.inventarios && estadoElemento.inventarios.length > 0) {
      throw new ConflictException(
        `No se puede eliminar el estado "${estadoElemento.nombre_estado}" porque tiene ${estadoElemento.inventarios.length} elemento(s) asociado(s)`
      );
    }

    await this.estadoElementoRepository.remove(estadoElemento);
  }

  async getColoresDisponibles(): Promise<string[]> {
    const estadosExistentes = await this.estadoElementoRepository.find({
      select: ['color_codigo'],
    });
    
    const coloresUsados = estadosExistentes.map(estado => estado.color_codigo);
    
    // Colores predefinidos comunes para estados
    const coloresSugeridos = [
      '#28A745', // Verde - Disponible
      '#FFC107', // Amarillo - En uso
      '#DC3545', // Rojo - Dañado
      '#6C757D', // Gris - Fuera de servicio
      '#17A2B8', // Azul - En mantenimiento
      '#FD7E14', // Naranja - En reparación
      '#6F42C1', // Púrpura - Reservado
      '#20C997', // Verde azulado - Nuevo
      '#E83E8C', // Rosa - Perdido
      '#343A40', // Negro - Desechado
    ];

    return coloresSugeridos.filter(color => !coloresUsados.includes(color));
  }
}
