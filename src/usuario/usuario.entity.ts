// src/usuario/usuario.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AsignacionElemento } from '../asignacion-elemento/asignacion-elemento.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

// ENUM DE ROLES DE USUIARIO
export enum rolUsuario {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
  INSTRUCTOR = 'INSTRUCTOR',
  //otros roles 
}

//ENUM PARA ESTADO
export enum estadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Exclude() // Excluir este campo al transformar la entidad a JSON
  @Column({ type: 'varchar', length: 255, nullable: false, select: false }) // select: false para no seleccionarlo por defecto en las consultas
  password: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  telefono: string;

  // USO DEL ENUM PARA EL ROL
  @Column({
    type: 'enum',
    enum: rolUsuario,
    default: rolUsuario.USUARIO,
    nullable: false,
  })
  rol_usuario: rolUsuario;

  // USO DEL ENUM PARA EL ESTADO
  @Column({
    type: 'varchar',
    length: 255,
    default: estadoUsuario.ACTIVO,
    nullable: false,
  })
  estado_usuario: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // ✅ Relación con asignaciones
  @OneToMany(() => AsignacionElemento, (asignacion) => asignacion.usuario)
  asignaciones: AsignacionElemento[];
  id_instructor: any;

  //LOGICA DE HASH DE CONTRASEÑA
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // solo hashea si la contraseña ha cambiado o si es una inserción y no ha sido hasheada.
    //la condicion this.password.length <60 es una hueristica para verificar si ya esta hasheada
    //(un hash bcrypt es tipicamente de longitud 60)
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10); //'10' es el factor de costo
    }
  }
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
