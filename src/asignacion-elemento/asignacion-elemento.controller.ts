// import { Controller } from '@nestjs/common';

// @Controller('asignacion-elemento')
// export class AsignacionElementoController {}

// asignacion-elemento.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { AsignacionElementoService } from './asignacion-elemento.service';
import { CreateAsignacionElementoDto } from './dto/create-asignacion-elemento.dto';
import { UpdateAsignacionElementoDto } from './dto/update-asignacion-elemento.dto';

@Controller('asignacion-elemento')
export class AsignacionElementoController {
  constructor(private readonly asignacionService: AsignacionElementoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAsignacionDto: CreateAsignacionElementoDto) {
    return this.asignacionService.create(createAsignacionDto);
  }

  @Get()
  findAll(@Query('estado') estado?: 'activa' | 'devuelta' | 'perdida' | 'dañada') {
    if (estado) {
      return this.asignacionService.findByEstado(estado);
    }
    return this.asignacionService.findAll();
  }

  @Get('usuario/:id_instructor')
  findByUsuario(@Param('id_instructor', ParseIntPipe) id_instructor: number) {
    return this.asignacionService.findByUsuario(id_instructor);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsignacionDto: UpdateAsignacionElementoDto,
  ) {
    return this.asignacionService.update(id, updateAsignacionDto);
  }

  @Patch(':id/devolver')
  marcarComoDevuelta(
    @Param('id', ParseIntPipe) id: number,
    @Body() body?: { fecha_devolucion_real?: string },
  ) {
    return this.asignacionService.marcarComoDevuelta(id, body?.fecha_devolucion_real);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionService.remove(id);
  }
}

// ============================================
