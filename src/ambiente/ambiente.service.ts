 //import { Injectable } from '@nestjs/common';
//@Injectable()
//export class AmbienteService {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ambiente } from './ambiente.entity';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';

@Injectable()
export class AmbienteService {
  constructor(
    @InjectRepository(Ambiente)
    private ambienteRepository: Repository<Ambiente>,
  ) {}

  async create(createAmbienteDto: CreateAmbienteDto): Promise<Ambiente> {
    const ambiente = this.ambienteRepository.create(createAmbienteDto);
    return await this.ambienteRepository.save(ambiente);
  }

  async findAll(): Promise<Ambiente[]> {
    return await this.ambienteRepository.find({
      relations: ['elementos'], // Incluye los elementos del inventario
    });
  }

  async findOne(id: number): Promise<Ambiente> {
    const ambiente = await this.ambienteRepository.findOne({
      where: { id_ambiente: id },
      relations: ['elementos'],
    });

    if (!ambiente) {
      throw new NotFoundException(`Ambiente with ID ${id} not found`);
    }

    return ambiente;
  }

  async update(id: number, updateAmbienteDto: UpdateAmbienteDto): Promise<Ambiente> {
    const ambiente = await this.findOne(id);
    Object.assign(ambiente, updateAmbienteDto);
    return await this.ambienteRepository.save(ambiente);
  }

  async remove(id: number): Promise<void> {
    const ambiente = await this.findOne(id);
    await this.ambienteRepository.remove(ambiente);
  }
}

