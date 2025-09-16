// // import { Injectable } from '@nestjs/common';

// // @Injectable()
// // export class InventarioService {}

// // inventario.service.ts
// import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Inventario } from './inventario.entity';
// import { CreateInventarioDto } from './dto/create-inventario.dto';
// import { UpdateInventarioDto } from './dto/update-inventario.dto';
// import { TipoElemento } from '../tipo-elemento/tipo-elemento.entity';
// import { EstadoElemento } from '../estado-elemento/estado-elemento.entity';
// import { Ambiente } from '../ambiente/ambiente.entity';

// @Injectable()
// export class InventarioService {
//   constructor(
//     @InjectRepository(Inventario)
//     private inventarioRepository: Repository<Inventario>,
//     @InjectRepository(TipoElemento)
//     private tipoElementoRepository: Repository<TipoElemento>,
//     @InjectRepository(EstadoElemento)
//     private estadoElementoRepository: Repository<EstadoElemento>,
//     @InjectRepository(Ambiente)
//     private ambienteRepository: Repository<Ambiente>,
//   ) {}

//   async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
//     // Verificar que el número serial sea único
//     const existingSerial = await this.inventarioRepository.findOne({
//       where: { numero_serial: createInventarioDto.numero_serial },
//     });

//     if (existingSerial) {
//       throw new ConflictException(`Ya existe un elemento con el número serial: ${createInventarioDto.numero_serial}`);
//     }

//     // Verificar que existan las entidades relacionadas
//     await this.validateRelatedEntities(
//       createInventarioDto.id_tipo_elemento,
//       createInventarioDto.id_estado_elemento,
//       createInventarioDto.id_ambiente
//     );

//     const inventario = this.inventarioRepository.create({
//       nombre: createInventarioDto.nombre,
//       descripcion: createInventarioDto.descripcion || '',
//       numero_serial: createInventarioDto.numero_serial,
//       modelo: createInventarioDto.modelo,
//       marca: createInventarioDto.marca,
//       ubicacion_actual: createInventarioDto.ubicacion_actual || '',
//       fecha_registro: createInventarioDto.fecha_registro ? new Date(createInventarioDto.fecha_registro) : new Date(),
//       id_tipo_elemento: createInventarioDto.id_tipo_elemento,
//       id_estado_elemento: createInventarioDto.id_estado_elemento,
//       id_ambiente: createInventarioDto.id_ambiente,
//     });

//     return await this.inventarioRepository.save(inventario);
//   }

//   async findAll(): Promise<Inventario[]> {
//     return await this.inventarioRepository.find({
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//       order: { fecha_registro: 'DESC' },
//     });
//   }

//   async findOne(id: number): Promise<Inventario> {
//     const inventario = await this.inventarioRepository.findOne({
//       where: { id_inventario: id },
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//     });

//     if (!inventario) {
//       throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
//     }

//     return inventario;
//   }

//   async findBySerial(numero_serial: string): Promise<Inventario> {
//     const inventario = await this.inventarioRepository.findOne({
//       where: { numero_serial },
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//     });

//     if (!inventario) {
//       throw new NotFoundException(`Inventario con número serial ${numero_serial} no encontrado`);
//     }

//     return inventario;
//   }

//   async findByTipo(id_tipo_elemento: number): Promise<Inventario[]> {
//     return await this.inventarioRepository.find({
//       where: { id_tipo_elemento },
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//       order: { nombre: 'ASC' },
//     });
//   }

//   async findByEstado(id_estado_elemento: number): Promise<Inventario[]> {
//     return await this.inventarioRepository.find({
//       where: { id_estado_elemento },
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//       order: { nombre: 'ASC' },
//     });
//   }

//   async findByAmbiente(id_ambiente: number): Promise<Inventario[]> {
//     return await this.inventarioRepository.find({
//       where: { id_ambiente },
//       relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
//       order: { nombre: 'ASC' },
//     });
//   }

//   async search(searchTerm: string): Promise<Inventario[]> {
//     return await this.inventarioRepository
//       .createQueryBuilder('inventario')
//       .leftJoinAndSelect('inventario.tipoElemento', 'tipo')
//       .leftJoinAndSelect('inventario.estadoElemento', 'estado')
//       .leftJoinAndSelect('inventario.ambiente', 'ambiente')
//       .where(
//         'LOWER(inventario.nombre) LIKE LOWER(:search) OR ' +
//         'LOWER(inventario.numero_serial) LIKE LOWER(:search) OR ' +
//         'LOWER(inventario.modelo) LIKE LOWER(:search) OR ' +
//         'LOWER(inventario.marca) LIKE LOWER(:search)',
//         { search: `%${searchTerm}%` }
//       )
//       .orderBy('inventario.nombre', 'ASC')
//       .getMany();
//   }

//   async getInventarioStats(): Promise<any> {
//     const total = await this.inventarioRepository.count();
    
//     const porTipo = await this.inventarioRepository
//       .createQueryBuilder('inventario')
//       .leftJoin('inventario.tipoElemento', 'tipo')
//       .select(['tipo.nombre_tipo', 'COUNT(inventario.id_inventario) as cantidad'])
//       .groupBy('tipo.id_tipo_elemento')
//       .getRawMany();

//     const porEstado = await this.inventarioRepository
//       .createQueryBuilder('inventario')
//       .leftJoin('inventario.estadoElemento', 'estado')
//       .select(['estado.nombre_estado', 'estado.color_codigo', 'COUNT(inventario.id_inventario) as cantidad'])
//       .groupBy('estado.id_estado_elemento')
//       .getRawMany();

//     const porAmbiente = await this.inventarioRepository
//       .createQueryBuilder('inventario')
//       .leftJoin('inventario.ambiente', 'ambiente')
//       .select(['ambiente.nombre_ambiente', 'COUNT(inventario.id_inventario) as cantidad'])
//       .groupBy('ambiente.id_ambiente')
//       .getRawMany();

//     return {
//       total,
//       por_tipo: porTipo,
//       por_estado: porEstado,
//       por_ambiente: porAmbiente,
//     };
//   }

//   async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
//     const inventario = await this.findOne(id);

//     // Verificar número serial único (si se está actualizando)
//     if (updateInventarioDto.numero_serial && 
//         updateInventarioDto.numero_serial !== inventario.numero_serial) {
//       const existingSerial = await this.inventarioRepository.findOne({
//         where: { numero_serial: updateInventarioDto.numero_serial },
//       });

//       if (existingSerial && existingSerial.id_inventario !== id) {
//         throw new ConflictException(`Ya existe un elemento con el número serial: ${updateInventarioDto.numero_serial}`);
//       }
//     }

//     // Verificar entidades relacionadas si se están actualizando
//     if (updateInventarioDto.id_tipo_elemento || 
//         updateInventarioDto.id_estado_elemento || 
//         updateInventarioDto.id_ambiente) {
//       await this.validateRelatedEntities(
//         updateInventarioDto.id_tipo_elemento || inventario.id_tipo_elemento,
//         updateInventarioDto.id_estado_elemento || inventario.id_estado_elemento,
//         updateInventarioDto.id_ambiente || inventario.id_ambiente
//       );
//     }

//     // Aplicar actualizaciones
//     if (updateInventarioDto.nombre !== undefined) {
//       inventario.nombre = updateInventarioDto.nombre;
//     }
//     if (updateInventarioDto.descripcion !== undefined) {
//       inventario.descripcion = updateInventarioDto.descripcion;
//     }
//     if (updateInventarioDto.numero_serial !== undefined) {
//       inventario.numero_serial = updateInventarioDto.numero_serial;
//     }
//     if (updateInventarioDto.modelo !== undefined) {
//       inventario.modelo = updateInventarioDto.modelo;
//     }
//     if (updateInventarioDto.marca !== undefined) {
//       inventario.marca = updateInventarioDto.marca;
//     }
//     if (updateInventarioDto.ubicacion_actual !== undefined) {
//       inventario.ubicacion_actual = updateInventarioDto.ubicacion_actual;
//     }
//     if (updateInventarioDto.fecha_registro !== undefined) {
//       inventario.fecha_registro = new Date(updateInventarioDto.fecha_registro);
//     }
//     if (updateInventarioDto.id_tipo_elemento !== undefined) {
//       inventario.id_tipo_elemento = updateInventarioDto.id_tipo_elemento;
//     }
//     if (updateInventarioDto.id_estado_elemento !== undefined) {
//       inventario.id_estado_elemento = updateInventarioDto.id_estado_elemento;
//     }
//     if (updateInventarioDto.id_ambiente !== undefined) {
//       inventario.id_ambiente = updateInventarioDto.id_ambiente;
//     }

//     return await this.inventarioRepository.save(inventario);
//   }

//   async cambiarEstado(id: number, id_estado_elemento: number): Promise<Inventario> {
//     const inventario = await this.findOne(id);
    
//     // Verificar que el estado exista
//     const estado = await this.estadoElementoRepository.findOne({
//       where: { id_estado_elemento },
//     });

//     if (!estado) {
//       throw new NotFoundException(`Estado con ID ${id_estado_elemento} no encontrado`);
//     }

//     inventario.id_estado_elemento = id_estado_elemento;
//     return await this.inventarioRepository.save(inventario);
//   }

//   async cambiarUbicacion(id: number, id_ambiente: number): Promise<Inventario> {
//     const inventario = await this.findOne(id);
    
//     // Verificar que el ambiente exista
//     const ambiente = await this.ambienteRepository.findOne({
//       where: { id_ambiente },
//     });

//     if (!ambiente) {
//       throw new NotFoundException(`Ambiente con ID ${id_ambiente} no encontrado`);
//     }

//     inventario.id_ambiente = id_ambiente;
//     inventario.ubicacion_actual = ambiente.ubicacion;
//     return await this.inventarioRepository.save(inventario);
//   }

//   async remove(id: number): Promise<void> {
//     const inventario = await this.findOne(id);
//     await this.inventarioRepository.remove(inventario);
//   }

//   private async validateRelatedEntities(
//     id_tipo_elemento: number,
//     id_estado_elemento: number,
//     id_ambiente: number
//   ): Promise<void> {
//     // Verificar que el tipo de elemento exista
//     const tipoElemento = await this.tipoElementoRepository.findOne({
//       where: { id_tipo_elemento },
//     });
//     if (!tipoElemento) {
//       throw new BadRequestException(`Tipo de elemento con ID ${id_tipo_elemento} no encontrado`);
//     }

//     // Verificar que el estado de elemento exista
//     const estadoElemento = await this.estadoElementoRepository.findOne({
//       where: { id_estado_elemento },
//     });
//     if (!estadoElemento) {
//       throw new BadRequestException(`Estado de elemento con ID ${id_estado_elemento} no encontrado`);
//     }

//     // Verificar que el ambiente exista
//     const ambiente = await this.ambienteRepository.findOne({
//       where: { id_ambiente },
//     });
//     if (!ambiente) {
//       throw new BadRequestException(`Ambiente con ID ${id_ambiente} no encontrado`);
//     }
//   }
// }

// inventario.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { TipoElemento } from '../tipo-elemento/tipo-elemento.entity';
import { EstadoElemento } from '../estado-elemento/estado-elemento.entity';
import { Ambiente } from '../ambiente/ambiente.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(TipoElemento)
    private tipoElementoRepository: Repository<TipoElemento>,
    @InjectRepository(EstadoElemento)
    private estadoElementoRepository: Repository<EstadoElemento>,
    @InjectRepository(Ambiente)
    private ambienteRepository: Repository<Ambiente>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    // Verificar que el número serial sea único
    const existingSerial = await this.inventarioRepository.findOne({
      where: { numero_serial: createInventarioDto.numero_serial },
    });

    if (existingSerial) {
      throw new ConflictException(`Ya existe un elemento con el número serial: ${createInventarioDto.numero_serial}`);
    }

    // Verificar que existan las entidades relacionadas
    await this.validateRelatedEntities(
      createInventarioDto.id_tipo_elemento,
      createInventarioDto.id_estado_elemento,
      createInventarioDto.id_ambiente
    );

    const inventario = this.inventarioRepository.create({
      nombre: createInventarioDto.nombre,
      descripcion: createInventarioDto.descripcion || '',
      numero_serial: createInventarioDto.numero_serial,
      modelo: createInventarioDto.modelo,
      marca: createInventarioDto.marca,
      ubicacion_actual: createInventarioDto.ubicacion_actual || '',
      fecha_registro: createInventarioDto.fecha_registro ? new Date(createInventarioDto.fecha_registro) : new Date(),
      id_tipo_elemento: createInventarioDto.id_tipo_elemento,
      id_estado_elemento: createInventarioDto.id_estado_elemento,
      id_ambiente: createInventarioDto.id_ambiente,
    });

    return await this.inventarioRepository.save(inventario);
  }

  async findAll(): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
      order: { fecha_registro: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id_inventario: id },
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findBySerial(numero_serial: string): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { numero_serial },
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con número serial ${numero_serial} no encontrado`);
    }

    return inventario;
  }

  async findByTipo(id_tipo_elemento: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { id_tipo_elemento },
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
      order: { nombre: 'ASC' },
    });
  }

  async findByEstado(id_estado_elemento: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { id_estado_elemento },
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
      order: { nombre: 'ASC' },
    });
  }

  async findByAmbiente(id_ambiente: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { id_ambiente },
      relations: ['tipoElemento', 'estadoElemento', 'ambiente'],
      order: { nombre: 'ASC' },
    });
  }

  async search(searchTerm: string): Promise<Inventario[]> {
    return await this.inventarioRepository
      .createQueryBuilder('inventario')
      .leftJoinAndSelect('inventario.tipoElemento', 'tipo')
      .leftJoinAndSelect('inventario.estadoElemento', 'estado')
      .leftJoinAndSelect('inventario.ambiente', 'ambiente')
      .where(
        'LOWER(inventario.nombre) LIKE LOWER(:search) OR ' +
        'LOWER(inventario.numero_serial) LIKE LOWER(:search) OR ' +
        'LOWER(inventario.modelo) LIKE LOWER(:search) OR ' +
        'LOWER(inventario.marca) LIKE LOWER(:search)',
        { search: `%${searchTerm}%` }
      )
      .orderBy('inventario.nombre', 'ASC')
      .getMany();
  }

  async getInventarioStats(): Promise<any> {
    const total = await this.inventarioRepository.count();
    
    const porTipo = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .leftJoin('inventario.tipoElemento', 'tipo')
      .select(['tipo.nombre_tipo', 'COUNT(inventario.id_inventario) as cantidad'])
      .groupBy('tipo.id_tipo_elemento')
      .getRawMany();

    const porEstado = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .leftJoin('inventario.estadoElemento', 'estado')
      .select(['estado.nombre_estado', 'estado.color_codigo', 'COUNT(inventario.id_inventario) as cantidad'])
      .groupBy('estado.id_estado_elemento')
      .getRawMany();

    const porAmbiente = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .leftJoin('inventario.ambiente', 'ambiente')
      .select(['ambiente.nombre_ambiente', 'COUNT(inventario.id_inventario) as cantidad'])
      .groupBy('ambiente.id_ambiente')
      .getRawMany();

    return {
      total,
      por_tipo: porTipo,
      por_estado: porEstado,
      por_ambiente: porAmbiente,
    };
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);

    // Verificar número serial único (si se está actualizando)
    if (updateInventarioDto.numero_serial && 
        updateInventarioDto.numero_serial !== inventario.numero_serial) {
      const existingSerial = await this.inventarioRepository.findOne({
        where: { numero_serial: updateInventarioDto.numero_serial },
      });

      if (existingSerial && existingSerial.id_inventario !== id) {
        throw new ConflictException(`Ya existe un elemento con el número serial: ${updateInventarioDto.numero_serial}`);
      }
    }

    // Verificar entidades relacionadas si se están actualizando
    if (updateInventarioDto.id_tipo_elemento || 
        updateInventarioDto.id_estado_elemento || 
        updateInventarioDto.id_ambiente) {
      await this.validateRelatedEntities(
        updateInventarioDto.id_tipo_elemento || inventario.id_tipo_elemento,
        updateInventarioDto.id_estado_elemento || inventario.id_estado_elemento,
        updateInventarioDto.id_ambiente || inventario.id_ambiente
      );
    }

    // Aplicar actualizaciones
    if (updateInventarioDto.nombre !== undefined) {
      inventario.nombre = updateInventarioDto.nombre;
    }
    if (updateInventarioDto.descripcion !== undefined) {
      inventario.descripcion = updateInventarioDto.descripcion;
    }
    if (updateInventarioDto.numero_serial !== undefined) {
      inventario.numero_serial = updateInventarioDto.numero_serial;
    }
    if (updateInventarioDto.modelo !== undefined) {
      inventario.modelo = updateInventarioDto.modelo;
    }
    if (updateInventarioDto.marca !== undefined) {
      inventario.marca = updateInventarioDto.marca;
    }
    if (updateInventarioDto.ubicacion_actual !== undefined) {
      inventario.ubicacion_actual = updateInventarioDto.ubicacion_actual;
    }
    if (updateInventarioDto.fecha_registro !== undefined) {
      inventario.fecha_registro = new Date(updateInventarioDto.fecha_registro);
    }
    if (updateInventarioDto.id_tipo_elemento !== undefined) {
      inventario.id_tipo_elemento = updateInventarioDto.id_tipo_elemento;
    }
    if (updateInventarioDto.id_estado_elemento !== undefined) {
      inventario.id_estado_elemento = updateInventarioDto.id_estado_elemento;
    }
    if (updateInventarioDto.id_ambiente !== undefined) {
      inventario.id_ambiente = updateInventarioDto.id_ambiente;
    }

    return await this.inventarioRepository.save(inventario);
  }

  async cambiarEstado(id: number, id_estado_elemento: number): Promise<Inventario> {
    const inventario = await this.findOne(id);
    
    // Verificar que el estado exista
    const estado = await this.estadoElementoRepository.findOne({
      where: { id_estado_elemento },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id_estado_elemento} no encontrado`);
    }

    inventario.id_estado_elemento = id_estado_elemento;
    return await this.inventarioRepository.save(inventario);
  }

  async cambiarUbicacion(id: number, id_ambiente: number): Promise<Inventario> {
    const inventario = await this.findOne(id);
    
    // Verificar que el ambiente exista
    const ambiente = await this.ambienteRepository.findOne({
      where: { id_ambiente },
    });

    if (!ambiente) {
      throw new NotFoundException(`Ambiente con ID ${id_ambiente} no encontrado`);
    }

    inventario.id_ambiente = id_ambiente;
    inventario.ubicacion_actual = ambiente.ubicacion;
    return await this.inventarioRepository.save(inventario);
  }

  async remove(id: number): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.remove(inventario);
  }

  private async validateRelatedEntities(
    id_tipo_elemento: number,
    id_estado_elemento: number,
    id_ambiente: number
  ): Promise<void> {
    // Verificar que el tipo de elemento exista
    const tipoElemento = await this.tipoElementoRepository.findOne({
      where: { id_tipo_elemento },
    });
    if (!tipoElemento) {
      throw new BadRequestException(`Tipo de elemento con ID ${id_tipo_elemento} no encontrado`);
    }

    // Verificar que el estado de elemento exista
    const estadoElemento = await this.estadoElementoRepository.findOne({
      where: { id_estado_elemento },
    });
    if (!estadoElemento) {
      throw new BadRequestException(`Estado de elemento con ID ${id_estado_elemento} no encontrado`);
    }

    // Verificar que el ambiente exista
    const ambiente = await this.ambienteRepository.findOne({
      where: { id_ambiente },
    });
    if (!ambiente) {
      throw new BadRequestException(`Ambiente con ID ${id_ambiente} no encontrado`);
    }
  }
}