// src/auth/auth.controller.ts
import {
  Controller,
  Post,
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
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
      maxAge: 3600000,
    });

    return { usuario };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUsuarioDto: LoginUsuarioDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(loginUsuarioDto)
    const { access_token, usuario } = await this.authService.login(loginUsuarioDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
      maxAge: 3600000,
    });

    return { usuario };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });
    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request & { user?: any }) {
    return req.user;
  }
}

interface User {
  id: number;
  email: string;
  nombre_completo: string;
  rol_usuario: string;
  estado_usuario: string;
}