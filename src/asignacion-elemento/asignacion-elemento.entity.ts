// // asignacion-elemento.entity.ts (corregida)
// import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
// import { Usuario } from '../usuario/usuario.entity';

// @Entity('asignacion_elemento')
// export class AsignacionElemento {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 255 })
//   nombreElemento: string;

//   @Column({ type: 'date' })
//   fecha_asignacion: Date;

//   @Column({ type: 'date' })
//   fecha_devolucion_estimada: Date;

//   @Column({ type: 'date', nullable: true })
//   fecha_devolucion_real?: Date;

//   @Column({ 
//     type: 'enum', 
//     enum: ['activa', 'devuelta', 'perdida', 'dañada'],
//     default: 'activa'
//   })
//   estado_asignacion: 'activa' | 'devuelta' | 'perdida' | 'dañada';

//   @Column({ type: 'text', nullable: true })
//   notas?: string;

//   @Column()
//   id_instructor: number;

//   // Relación con usuario
//   @ManyToOne(() => Usuario, (usuario) => usuario.asignaciones, {
//     onDelete: 'CASCADE'
//   })
//   @JoinColumn({ name: 'id_instructor' })
//   usuario: Usuario;
// }


// asignacion-elemento.entity.ts (corregida)
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('asignacion_elemento')
export class AsignacionElemento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombreElemento: string;

  @Column({ type: 'date' })
  fecha_asignacion: Date;

  @Column({ type: 'date' })
  fecha_devolucion_estimada: Date;

  @Column({ type: 'date', nullable: true })
  fecha_devolucion_real?: Date;

  @Column({ 
    type: 'enum', 
    enum: ['activa', 'devuelta', 'perdida', 'dañada'],
    default: 'activa'
  })
  estado_asignacion: 'activa' | 'devuelta' | 'perdida' | 'dañada';

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column()
  id_instructor: number;

  // Relación con usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.asignaciones, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'id_instructor' })
  usuario: Usuario;
}
