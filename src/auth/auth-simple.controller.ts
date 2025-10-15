import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthSimpleController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Login request received:', loginDto);
    
    // Simulación de validación básica
    if (loginDto.email && loginDto.password) {
      // Simular respuesta exitosa
      const mockUser = {
        id: 1,
        nombre_completo: 'Usuario de Prueba',
        email: loginDto.email,
        telefono: '1234567890',
        rol_usuario: 'USUARIO',
        estado_usuario: 'ACTIVO'
      };
      
      // Simular cookie de token
      res.cookie('access_token', 'mock-jwt-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        maxAge: 3600000,
      });
      
      return { usuario: mockUser };
    } else {
      throw new Error('Credenciales inválidas');
    }
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

  @Get('profile')
  profile() {
    const mockUser = {
      id: 1,
      nombre_completo: 'Usuario de Prueba',
      email: 'test@example.com',
      telefono: '1234567890',
      rol_usuario: 'USUARIO',
      estado_usuario: 'ACTIVO'
    };
    return mockUser;
  }
}