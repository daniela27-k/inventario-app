// src/auth/guards/roles.guard.ultra-safe.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { rolUsuario } from '../../usuario/usuario.entity';

// Definir la interfaz del usuario autenticado
export interface AuthenticatedUser {
  id: number;
  username: string;
  rolUsuario: rolUsuario;
}

// Extender la interfaz Request de Express para incluir el usuario tipado
declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

// Tipo guard personalizado para validar el usuario
function isAuthenticatedUser(obj: unknown): obj is AuthenticatedUser {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const candidate = obj as Record<string, unknown>;
  
  return (
    typeof candidate.id === 'number' &&
    candidate.id > 0 &&
    typeof candidate.username === 'string' &&
    candidate.username.length > 0 &&
    typeof candidate.rolUsuario === 'string' &&
    Object.values(rolUsuario).includes(candidate.rolUsuario as rolUsuario)
  );
}

@Injectable()
export class UltraSafeRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<rolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles definidos en la ruta, se permite el acceso
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // 2. Obtener el usuario autenticado de la petición
    const request = context.switchToHttp().getRequest<Request>();
    const userCandidate = request.user;

    // 3. Validar que el usuario existe y tiene la estructura correcta
    if (!isAuthenticatedUser(userCandidate)) {
      throw new UnauthorizedException('Usuario no autenticado o inválido');
    }

    // En este punto userCandidate ya es de tipo AuthenticatedUser
    const user: AuthenticatedUser = userCandidate;

    // 4. Verificar si el rol del usuario está incluido en los roles requeridos
    const hasRequiredRole = this.checkUserRole(user.rolUsuario, requiredRoles);
    
    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        `Acceso denegado. Rol actual: ${user.rolUsuario}, Roles requeridos: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }

  private checkUserRole(userRole: rolUsuario, requiredRoles: rolUsuario[]): boolean {
    return requiredRoles.includes(userRole);
  }
}

// Versión con logging para auditoría
@Injectable()
export class AuditableRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<rolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userCandidate = request.user;

    if (!isAuthenticatedUser(userCandidate)) {
      this.logAccessAttempt(null, requiredRoles, false, 'Usuario no autenticado');
      throw new UnauthorizedException('Usuario no autenticado o inválido');
    }

    const user: AuthenticatedUser = userCandidate;
    const hasRequiredRole = this.checkUserRole(user.rolUsuario, requiredRoles);
    
    this.logAccessAttempt(user, requiredRoles, hasRequiredRole, 
      hasRequiredRole ? 'Acceso permitido' : 'Rol insuficiente');

    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        `Acceso denegado. Rol actual: ${user.rolUsuario}, Roles requeridos: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }

  private checkUserRole(userRole: rolUsuario, requiredRoles: rolUsuario[]): boolean {
    return requiredRoles.includes(userRole);
  }

  private logAccessAttempt(
    user: AuthenticatedUser | null, 
    requiredRoles: rolUsuario[], 
    granted: boolean,
    reason: string
  ): void {
    const timestamp = new Date().toISOString();
    const userInfo = user ? `${user.username} (${user.rolUsuario})` : 'Unknown';
    
    console.log(JSON.stringify({
      timestamp,
      user: userInfo,
      requiredRoles,
      accessGranted: granted,
      reason,
    }));
  }
}

// Helper para crear guards personalizados con roles específicos
export function createRoleGuard(...allowedRoles: rolUsuario[]) {
  @Injectable()
  class CustomRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const userCandidate = request.user;

      if (!isAuthenticatedUser(userCandidate)) {
        throw new UnauthorizedException('Usuario no autenticado');
      }

      const user: AuthenticatedUser = userCandidate;
      
      if (!allowedRoles.includes(user.rolUsuario)) {
        throw new UnauthorizedException(
          `Acceso denegado. Rol requerido: ${allowedRoles.join(' o ')}`
        );
      }

      return true;
    }
  }

  return CustomRoleGuard;
}

// Ejemplos de guards específicos
export const AdminOnlyGuard = createRoleGuard(rolUsuario.ADMIN);
export const instructorOrAdminGuard = createRoleGuard(rolUsuario.ADMIN, rolUsuario.INSTRUCTOR);