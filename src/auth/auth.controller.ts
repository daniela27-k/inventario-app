import {
  Controller,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../usuario/dto/update-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsuarioService } from '../usuario/usuario.service';

const isProduction = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } =
      await this.authService.registerAndLogin(createUsuarioDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 3600000,
    });

    return { usuario, access_token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUsuarioDto: LoginUsuarioDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } = await this.authService.login(loginUsuarioDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 3600000,
    });

    return { usuario, access_token };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request & { user?: any }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request & { user?: any },
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const userId = req.user?.id;
    delete updateUsuarioDto.rol_usuario;
    delete updateUsuarioDto.estado_usuario;
    const updated = await this.usuarioService.update(userId, updateUsuarioDto);
    const { password: _, ...result } = updated as any;
    return result;
  }
}