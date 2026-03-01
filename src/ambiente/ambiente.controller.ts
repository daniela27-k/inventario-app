// import { Controller } from '@nestjs/common';

// @Controller('ambiente')
// export class AmbienteController {}


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
  UseGuards,
} from '@nestjs/common';
import { AmbienteService } from './ambiente.service';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ambiente')
export class AmbienteController {
  constructor(private readonly ambienteService: AmbienteService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAmbienteDto: CreateAmbienteDto) {
    return this.ambienteService.create(createAmbienteDto);
  }

  @Get()
  findAll() {
    return this.ambienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ambienteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAmbienteDto: UpdateAmbienteDto,
  ) {
    return this.ambienteService.update(id, updateAmbienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ambienteService.remove(id);
  }
}