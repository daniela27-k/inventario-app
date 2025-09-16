// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TipoElementoService {}



// tipo-elemento.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoElemento } from './tipo-elemento.entity';
import { CreateTipoElementoDto } from './dto/create-tipo-elemento.dto';
import { UpdateTipoElementoDto } from './dto/update-tipo-elemento.dto';

@Injectable()
export class TipoElementoService {
  constructor(
    @InjectRepository(TipoElemento)
    private tipoElementoRepository: Repository<TipoElemento>,
  ) {}

  async create(createTipoElementoDto: CreateTipoElementoDto): Promise<TipoElemento> {
    // Verificar si ya existe un tipo con el mismo nombre
    const existingTipo = await this.tipoElementoRepository.findOne({
      where: { nombre_tipo: createTipoElementoDto.nombre_tipo },
    });

    if (existingTipo) {
      throw new ConflictException(`Ya existe un tipo de elemento con el nombre: ${createTipoElementoDto.nombre_tipo}`);
    }

    const tipoElemento = this.tipoElementoRepository.create({
      nombre_tipo: createTipoElementoDto.nombre_tipo,
      descripcion: createTipoElementoDto.descripcion || '',
      estado: createTipoElementoDto.estado,
    });

    return await this.tipoElementoRepository.save(tipoElemento);
  }

  async findAll(): Promise<TipoElemento[]> {
    return await this.tipoElementoRepository.find({
      relations: ['inventarios'],
      order: { nombre_tipo: 'ASC' },
    });
  }

  async findActive(): Promise<TipoElemento[]> {
    return await this.tipoElementoRepository.find({
      where: { estado: 'activo' },
      relations: ['inventarios'],
      order: { nombre_tipo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TipoElemento> {
    const tipoElemento = await this.tipoElementoRepository.findOne({
      where: { id_tipo_elemento: id },
      relations: ['inventarios'],
    });

    if (!tipoElemento) {
      throw new NotFoundException(`Tipo de elemento con ID ${id} no encontrado`);
    }

    return tipoElemento;
  }

  async findByNombre(nombre: string): Promise<TipoElemento[]> {
    return await this.tipoElementoRepository
      .createQueryBuilder('tipo')
      .where('LOWER(tipo.nombre_tipo) LIKE LOWER(:nombre)', { nombre: `%${nombre}%` })
      .leftJoinAndSelect('tipo.inventarios', 'inventarios')
      .orderBy('tipo.nombre_tipo', 'ASC')
      .getMany();
  }

  async getTiposConConteo(): Promise<any[]> {
    return await this.tipoElementoRepository
      .createQueryBuilder('tipo')
      .leftJoin('tipo.inventarios', 'inventario')
      .select([
        'tipo.id_tipo_elemento',
        'tipo.nombre_tipo',
        'tipo.descripcion',
        'tipo.estado',
        'COUNT(inventario.id_inventario) as total_elementos'
      ])
      .groupBy('tipo.id_tipo_elemento')
      .orderBy('tipo.nombre_tipo', 'ASC')
      .getRawMany();
  }

  async update(id: number, updateTipoElementoDto: UpdateTipoElementoDto): Promise<TipoElemento> {
    const tipoElemento = await this.findOne(id);

    // Verificar conflictos de nombre (si se está actualizando)
    if (updateTipoElementoDto.nombre_tipo && 
        updateTipoElementoDto.nombre_tipo !== tipoElemento.nombre_tipo) {
      const existingNombre = await this.tipoElementoRepository.findOne({
        where: { nombre_tipo: updateTipoElementoDto.nombre_tipo },
      });

      if (existingNombre && existingNombre.id_tipo_elemento !== id) {
        throw new ConflictException(`Ya existe un tipo de elemento con el nombre: ${updateTipoElementoDto.nombre_tipo}`);
      }
    }

    // Aplicar actualizaciones
    if (updateTipoElementoDto.nombre_tipo !== undefined) {
      tipoElemento.nombre_tipo = updateTipoElementoDto.nombre_tipo;
    }
    if (updateTipoElementoDto.descripcion !== undefined) {
      tipoElemento.descripcion = updateTipoElementoDto.descripcion;
    }
    if (updateTipoElementoDto.estado !== undefined) {
      tipoElemento.estado = updateTipoElementoDto.estado;
    }

    return await this.tipoElementoRepository.save(tipoElemento);
  }

  async activate(id: number): Promise<TipoElemento> {
    const tipoElemento = await this.findOne(id);
    tipoElemento.estado = 'activo';
    return await this.tipoElementoRepository.save(tipoElemento);
  }

  async deactivate(id: number): Promise<TipoElemento> {
    const tipoElemento = await this.findOne(id);
    tipoElemento.estado = 'inactivo';
    return await this.tipoElementoRepository.save(tipoElemento);
  }

  async remove(id: number): Promise<void> {
    const tipoElemento = await this.findOne(id);

    // Verificar si el tipo tiene elementos asociados
    if (tipoElemento.inventarios && tipoElemento.inventarios.length > 0) {
      throw new ConflictException(
        `No se puede eliminar el tipo "${tipoElemento.nombre_tipo}" porque tiene ${tipoElemento.inventarios.length} elemento(s) asociado(s)`
      );
    }

    await this.tipoElementoRepository.remove(tipoElemento);
  }

  async getEstadisticasUso(): Promise<any> {
    const totalTipos = await this.tipoElementoRepository.count();
    const tiposActivos = await this.tipoElementoRepository.count({
      where: { estado: 'activo' }
    });
    const tiposInactivos = await this.tipoElementoRepository.count({
      where: { estado: 'inactivo' }
    });

    const tiposConElementos = await this.tipoElementoRepository
      .createQueryBuilder('tipo')
      .leftJoin('tipo.inventarios', 'inventario')
      .select([
        'tipo.nombre_tipo',
        'tipo.estado',
        'COUNT(inventario.id_inventario) as elementos_count'
      ])
      .groupBy('tipo.id_tipo_elemento')
      .having('COUNT(inventario.id_inventario) > 0')
      .orderBy('elementos_count', 'DESC')
      .getRawMany();

    return {
      total_tipos: totalTipos,
      tipos_activos: tiposActivos,
      tipos_inactivos: tiposInactivos,
      tipos_con_elementos: tiposConElementos,
    };
  }
}