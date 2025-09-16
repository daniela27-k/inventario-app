// import { Controller } from '@nestjs/common';

// @Controller('estado-elemento')
// export class EstadoElementoController {}


// estado-elemento.controller.ts
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
import { EstadoElementoService } from './estado-elemento.service';
import { CreateEstadoElementoDto } from './dto/create-estado-elemento.dto';
import { UpdateEstadoElementoDto } from './dto/update-estado-elemento.dto';

@Controller('estado-elemento')
export class EstadoElementoController {
  constructor(private readonly estadoElementoService: EstadoElementoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEstadoElementoDto: CreateEstadoElementoDto) {
    return this.estadoElementoService.create(createEstadoElementoDto);
  }

  @Get()
  findAll(@Query('nombre') nombre?: string) {
    if (nombre) {
      return this.estadoElementoService.findByNombre(nombre);
    }
    return this.estadoElementoService.findAll();
  }

  @Get('estadisticas')
  getEstadosConConteo() {
    return this.estadoElementoService.getEstadosConConteo();
  }

  @Get('colores-disponibles')
  getColoresDisponibles() {
    return this.estadoElementoService.getColoresDisponibles();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadoElementoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoElementoDto: UpdateEstadoElementoDto,
  ) {
    return this.estadoElementoService.update(id, updateEstadoElementoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estadoElementoService.remove(id);
  }
}