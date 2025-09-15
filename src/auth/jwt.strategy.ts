// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { rolUsuario, Usuario } from '../usuario/usuario.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// export interface JwtPayload {
//   sub: number;
//   email: string;
//   rol: rolUsuario;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(Usuario)
//     private readonly usuarioRepository: Repository<Usuario>,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET || 'superSecretKey123',
//     });
//   }

//   async validate(payload: JwtPayload): Promise<Partial<Usuario> & { rol: string }> {
//     const usuario = await this.usuarioRepository.findOne({
//       where: { id: payload.sub },
//     });

//     if (!usuario) {
//       throw new UnauthorizedException('Token inválido: usuario no encontrado');
//     }

//     return {
//       id: Number(usuario.id),
//       email: usuario.email,
//       rol: payload.rol,
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { rolUsuario } from '../usuario/usuario.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  rol: rolUsuario;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      email: usuario.email,
      rol: usuario.rol_usuario,
    };
  }
}