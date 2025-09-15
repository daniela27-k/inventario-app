// src/auth/decorators/roles.decorator.ts
import { SetMetadata }  from "@nestjs/common";
import { rolUsuario } from "../../usuario/usuario.entity";

export const ROLES_KEY= 'roles';

/** 
*Decorador para definir roles requeridos en rutas/controladores
*@param roles - array de roles que pueden acceder a la ruta
*/
export const Roles= ( ...roles:rolUsuario[]) => SetMetadata(ROLES_KEY, roles);

//decoradores especificos para mayor comodidad
export const AdminOnly = ()=> Roles(rolUsuario.ADMIN);
export const InstructorOnly = ()=> Roles(rolUsuario.INSTRUCTOR);
export const UsuarioOnly=()=> Roles(rolUsuario.USUARIO);

//combinaciones comunes
export const AdminOrinstructor = () => Roles (rolUsuario.ADMIN, rolUsuario.INSTRUCTOR);
export const AllRoles = () => Roles (...Object.values(rolUsuario));
