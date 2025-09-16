// import { Controller } from '@nestjs/common';

// @Controller('tipo-elemento')
// export class TipoElementoController {}

// tipo-elemento.controller.ts
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
import { TipoElementoService } from './tipo-elemento.service';
import { CreateTipoElementoDto } from './dto/create-tipo-elemento.dto';
import { UpdateTipoElementoDto } from './dto/update-tipo-elemento.dto';

@Controller('tipo-elemento')
export class TipoElementoController {
  constructor(private readonly tipoElementoService: TipoElementoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTipoElementoDto: CreateTipoElementoDto) {
    return this.tipoElementoService.create(createTipoElementoDto);
  }

  @Get()
  findAll(@Query('nombre') nombre?: string, @Query('solo_activos') soloActivos?: string) {
    if (soloActivos === 'true') {
      return this.tipoElementoService.findActive();
    }
    if (nombre) {
      return this.tipoElementoService.findByNombre(nombre);
    }
    return this.tipoElementoService.findAll();
  }

  @Get('activos')
  findActive() {
    return this.tipoElementoService.findActive();
  }

  @Get('estadisticas')
  getTiposConConteo() {
    return this.tipoElementoService.getTiposConConteo();
  }

  @Get('estadisticas-uso')
  getEstadisticasUso() {
    return this.tipoElementoService.getEstadisticasUso();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoElementoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoElementoDto: UpdateTipoElementoDto,
  ) {
    return this.tipoElementoService.update(id, updateTipoElementoDto);
  }

  @Patch(':id/activar')
  @HttpCode(HttpStatus.OK)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.tipoElementoService.activate(id);
  }

  @Patch(':id/desactivar')
  @HttpCode(HttpStatus.OK)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.tipoElementoService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoElementoService.remove(id);
  }
}