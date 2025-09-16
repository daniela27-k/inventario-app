// import { Controller } from '@nestjs/common';

// @Controller('inventario')
// export class InventarioController {}

// inventario.controller.ts
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
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  findAll() {
    return this.inventarioService.findAll();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.inventarioService.search(searchTerm);
  }

  @Get('estadisticas')
  getInventarioStats() {
    return this.inventarioService.getInventarioStats();
  }

  @Get('tipo/:id_tipo_elemento')
  findByTipo(@Param('id_tipo_elemento', ParseIntPipe) id_tipo_elemento: number) {
    return this.inventarioService.findByTipo(id_tipo_elemento);
  }

  @Get('estado/:id_estado_elemento')
  findByEstado(@Param('id_estado_elemento', ParseIntPipe) id_estado_elemento: number) {
    return this.inventarioService.findByEstado(id_estado_elemento);
  }

  @Get('ambiente/:id_ambiente')
  findByAmbiente(@Param('id_ambiente', ParseIntPipe) id_ambiente: number) {
    return this.inventarioService.findByAmbiente(id_ambiente);
  }

  @Get('serial/:numero_serial')
  findBySerial(@Param('numero_serial') numero_serial: string) {
    return this.inventarioService.findBySerial(numero_serial);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventarioDto: UpdateInventarioDto,
  ) {
    return this.inventarioService.update(id, updateInventarioDto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { id_estado_elemento: number },
  ) {
    return this.inventarioService.cambiarEstado(id, body.id_estado_elemento);
  }

  @Patch(':id/ubicacion')
  cambiarUbicacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { id_ambiente: number },
  ) {
    return this.inventarioService.cambiarUbicacion(id, body.id_ambiente);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.remove(id);
  }
}