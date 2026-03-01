import { Controller, Post, Body, Req } from '@nestjs/common';
import { AsistenteService } from './asistente.service';

@Controller('asistente')
export class AsistenteController {
    constructor(private readonly asistenteService: AsistenteService) { }

    @Post('preguntar')
    async preguntar(@Body('pregunta') pregunta: string, @Req() req: any) {
        const contexto = {
            nombre: req.user?.nombre_completo || 'Visitante',
            rol: req.user?.rol_usuario || 'Visitante',
        };

        const respuesta = await this.asistenteService.generarRespuesta(pregunta, contexto);
        return { respuesta };
    }
}