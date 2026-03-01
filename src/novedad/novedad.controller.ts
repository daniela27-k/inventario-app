// src/novedad/novedad.controller.ts
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Request,
    UseGuards,
} from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Todas las rutas de este módulo requieren autenticación JWT
@UseGuards(JwtAuthGuard)
@Controller('novedad')
export class NovedadController {
    constructor(private readonly novedadService: NovedadService) { }

    // POST /novedad — Registrar novedad (cualquier usuario autenticado)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createNovedadDto: CreateNovedadDto, @Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const idUsuario: number = req.user.id;
        return this.novedadService.create(createNovedadDto, idUsuario);
    }

    // GET /novedad — Listar todas (ADMIN e INSTRUCTOR)
    @Get()
    findAll() {
        return this.novedadService.findAll();
    }

    // GET /novedad/mis-novedades — Novedades del usuario en sesión
    @Get('mis-novedades')
    findMias(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const idUsuario: number = req.user.id;
        return this.novedadService.findByUsuario(idUsuario);
    }

    // GET /novedad/inventario/:id — Novedades de un elemento del inventario
    @Get('inventario/:id')
    findByInventario(@Param('id', ParseIntPipe) id: number) {
        return this.novedadService.findByInventario(id);
    }

    // GET /novedad/:id — Obtener una novedad
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.novedadService.findOne(id);
    }

    // PATCH /novedad/:id — Actualizar novedad
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNovedadDto: UpdateNovedadDto,
        @Request() req,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const idUsuario: number = req.user.id;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const rolActual = req.user.rolUsuario;
        return this.novedadService.update(id, updateNovedadDto, idUsuario, rolActual);
    }

    // DELETE /novedad/:id — Eliminar novedad
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const idUsuario: number = req.user.id;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const rolActual = req.user.rolUsuario;
        return this.novedadService.remove(id, idUsuario, rolActual);
    }
}
