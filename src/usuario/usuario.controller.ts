// src/usuario/usuario.controller.ts
console.log('--- USUARIO CONTROLLER FILE LOADED ---');
import { Controller, Get, Post, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Body } from '@nestjs/common';
import { rolUsuario } from './usuario.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UltraSafeRolesGuard } from '../auth/guards/roles.guard';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  // Endpoint publico para el registro de ususarios   
  //este es el unico endpoint que no necesita un guard de autenticacion
  // y se encargara de llamar al metodo 'create' del servicio
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() CreateUsuarioDto: CreateUsuarioDto) {
    //llama al metodo 'create' que no tiene la logica de forzar el rol
    return this.usuarioService.create(CreateUsuarioDto);
  }

  // ✅ [ADMIN] Listar todos los usuarios
  @Get()
  @UseGuards(JwtAuthGuard, UltraSafeRolesGuard)
  @Roles(rolUsuario.ADMIN)
  findAll() {
    return this.usuarioService.findAll();
  }

  // ✅ [AUTENTICADO] Lista de instructores/admins activos para el selector de asignaciones
  @Get('instructores')
  @UseGuards(JwtAuthGuard)
  findInstructores() {
    return this.usuarioService.findInstructores();
  }

  @Post()
  @UseGuards(JwtAuthGuard, UltraSafeRolesGuard)
  @Roles(rolUsuario.ADMIN)
  async createByAdmin(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.createOrUpdataByAdmin(createUsuarioDto);
  }

  //endpoint para obtener usuario por id (protegido)
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Puede ser accedido por cualquier usuario autenticado
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  // ✅ Endpoint para que los administradores actualicen usuarios
  @Patch(':id')
  @Roles(rolUsuario.ADMIN)
  @UseGuards(JwtAuthGuard,)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }



  // ✅ Endpoint para que los administradores eliminen usuarios
  @Delete(':id')
  @Roles(rolUsuario.ADMIN)
  @UseGuards(JwtAuthGuard,)
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}

