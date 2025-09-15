// src/auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from '../../usuario/usuario.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = Usuario>(err: any, user: any, ) {
    // Puedes lanzar una excepción personalizada basada en el error
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // Casting the return value to the generic TUser type
    return user as TUser;
  }
}