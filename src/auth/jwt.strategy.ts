import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsuarioService } from '../usuario/usuario.service';
import { rolUsuario } from '../usuario/usuario.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  rol: rolUsuario;
}

const cookieOrHeaderExtractor = (req: Request): string | null => {
  if (req && req.cookies && req.cookies['access_token']) {
    return req.cookies['access_token'];
  }
  const authHeader = req?.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'superSecretKey123',
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioService.findOne(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Token inválido: usuario no encontrado');
    }
    return {
      id: usuario.id,
      username: usuario.email,
      rolUsuario: usuario.rol_usuario,
    };
  }
}