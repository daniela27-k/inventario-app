// src/usuario/usuario.service.ts
import {  Injectable, ConflictException,  NotFoundException, UnauthorizedException }
 from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, rolUsuario, } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService{ 
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
   ) {}

   // Metodo para la creacion inicial desde el registro publico
   async create(createUsuarioDto: CreateUsuarioDto ): Promise<Usuario> {
   const existinUser= await this.usuarioRepository.findOne({ where: { email: createUsuarioDto.email } });
   if (existinUser) {
      throw new ConflictException('El email ya está registrado.');
      }
      // se asume que el DTO de registro publico no tiene un 'usuarioActual'
      // y el rol viene directamente del frontend
      const newUser = this.usuarioRepository.create(createUsuarioDto);
      return await this.usuarioRepository.save(newUser);
    }
  // nuevo metodo para que un administrador cree o actualice un usuario
  async createOrUpdataByAdmin(createUsuarioDto: CreateUsuarioDto, usuarioActual: Usuario): Promise<Usuario>{
    // si el usuario autenticado no es un administrador, lanza un error de autorizacion
    if (usuarioActual.rol_usuario !== rolUsuario.ADMIN){ 
      throw new UnauthorizedException('solo los administradores pueden crear o modificar usuarios de esta manera ');
  }  
  const existinUser= await this.usuarioRepository.findOne({ where: {email: createUsuarioDto.email}});
  if (existinUser){
    throw new ConflictException(' el email ya esta registrado.');
  }

  // El administrador puede especificar el rol, no se fuerza
    const newUser = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(newUser);
  }  
     async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    return usuario; // Retorna null si no encuentra el usuario, no lanza excepción
  }

 async findAll(): Promise<Usuario[]> { 
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> { 
    const usuario = await this.usuarioRepository.preload({ id, ...updateUsuarioDto });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    const updatedUser = await this.usuarioRepository.save(usuario);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
  }
}