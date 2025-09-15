// // src/auth/auth.service.ts
// import {
//   Injectable,
//   UnauthorizedException,
//   BadRequestException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { UsuarioService } from '../usuario/usuario.service';
// import {CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
// import { JwtPayload } from './jwt.strategy';
// import { LoginUsuarioDto } from 'src/usuario/dto/login-usuario.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly usuarioService: UsuarioService,
//     private readonly jwtService: JwtService,
//   ) {}

//   // ✅ Login
//   async login(loginDto: LoginDto) {
//     const usuario = await this.usuarioService.findOne(payload.sub);

//     if (!usuario) {
//       throw new UnauthorizedException('Credenciales inválidas.');
//     }

//     const isMatch = await bcrypt.compare(
//       loginDto.password,
//       usuario.password,
//     );
//     if (!isMatch) {
//       throw new UnauthorizedException('Credenciales inválidas');
//     }

//     // Payload JWT tipado con JwtPayload
//     const payload: JwtPayload = {
//       sub: usuario.id,
//       email: usuario.email,
//       rol: usuario.rol_usuario,
//     };

//     const access_token = await this.jwtService.signAsync(payload);

//     return {
//       access_token,
//       usuario: {
//         id: usuario.id,
//         nombre_completo: usuario.nombre_completo,
//         email: usuario.email,
//         rol: usuario.rol_usuario,
//         estado: usuario.estado_usuario,
//       },
//     };
//   }

//   // ✅ Validar usuario desde el JWT
//   // async validateUser(payload: JwtPayload): Promise<Omit<Usuario, 'password_hash'>> {
//   //   const usuario = await this.usuarioService.findOne(payload.sub);
//   //   if (!usuario) {
//   //     throw new UnauthorizedException();
//   //   }

//   //   // remover el password antes de devolver
//   //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   //   const { password: _, ...result } = usuario;
//   //   return result;
//   // }
//   async validateUser(payload: any){
//     const usuario = await this.usuarioService.findByEmail(payload.sub);
//     if(!usuario){
//       throw new UnauthorizedException();
//     }
//     const {password: _, ...result} = usuario;
//     return result;
//   }
//   // ✅ Registrar y loguear automáticamente
//   async registerAndLogin(createUsuarioDto: CreateUsuarioDto) {
//     try {
//       const newUser = await this.usuarioService.create(createUsuarioDto);

//       // 2. Generar un DTO de login con los mismos datos
//       const loginDtoForNewUser: LoginUsuarioDto = {
//         email: createUsuarioDto.email,
//         password: createUsuarioDto.password,
//       };

//       // 3. Reusar login para devolver token + usuario
//       return await this.login(loginDtoForNewUser);
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw new BadRequestException('El email ya está registrado.');
//       }
//       throw error;
//     }
//   }
// }

// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { JwtPayload } from './jwt.strategy';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Login
  async login(loginUsuarioDto: LoginUsuarioDto) {
    const usuario = await this.usuarioService.findByEmail(loginUsuarioDto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isMatch = await bcrypt.compare(
      loginUsuarioDto.password,
      usuario.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload JWT tipado con JwtPayload
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol_usuario,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol_usuario,
        estado: usuario.estado_usuario,
      },
    };
  }

  // ✅ Validar usuario desde el JWT
  async validateUser(payload: JwtPayload): Promise<Partial<Usuario>> {
    const usuario = await this.usuarioService.findOne(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException();
    }

    // remover propiedades sensibles/innecesarias
    const { password: _, hashPassword: __, comparePassword: ___, ...result } = usuario;
    return result;
  }

  // ✅ Registrar y loguear automáticamente
  async registerAndLogin(createUsuarioDto: CreateUsuarioDto) {
    try {
      // 1. Registrar el usuario (se guarda en DB)
      await this.usuarioService.create(createUsuarioDto);

      // 2. Generar un DTO de login con los mismos datos
      const loginDtoForNewUser: LoginUsuarioDto = {
        email: createUsuarioDto.email,
        password: createUsuarioDto.password,
      };

      // 3. Reusar login para devolver token + usuario
      return await this.login(loginDtoForNewUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException('El email ya está registrado.');
      }
      throw error;
    }
  }
}