// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { TipoElemento } from '../tipo-elemento/tipo-elemento.entity';
// import { EstadoElemento } from '../estado-elemento/estado-elemento.entity';
// import { Ambiente } from '../ambiente/ambiente.entity';

// @Entity('inventario')
// export class Inventario {
//   @PrimaryGeneratedColumn()
//   id_inventario: number;

//   @Column({ length: 255 })
//   nombre: string;

//   @Column('text')
//   descripcion: string;

//   @Column({ length: 255 })
//   numero_serial: string;

//   @Column({ length: 255 })
//   modelo: string;

//   @Column({ length: 255 })
//   marca: string;

//   @Column({ length: 255 })
//   ubicacion_actual: string;

//   @Column()
//   fecha_registro: Date;

//   @ManyToOne(() => TipoElemento, (tipo) => tipo.inventarios)
//   @JoinColumn({ name: 'id_tipo_elemento' })
//   tipoElemento: TipoElemento;

//   @ManyToOne(() => EstadoElemento, (estado) => estado.inventarios)
//   @JoinColumn({ name: 'id_estado_elemento' })
//   estadoElemento: EstadoElemento;

//   @ManyToOne(() => Ambiente, (ambiente) => ambiente.elementos)
//   @JoinColumn({ name: 'id_ambiente' })
//   ambiente: Ambiente;
// }



// inventario.entity.ts (corregida con columnas de FK)
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoElemento } from '../tipo-elemento/tipo-elemento.entity';
import { EstadoElemento } from '../estado-elemento/estado-elemento.entity';
import { Ambiente } from '../ambiente/ambiente.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id_inventario: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 255, unique: true })
  numero_serial: string;

  @Column({ length: 255 })
  modelo: string;

  @Column({ length: 255 })
  marca: string;

  @Column({ length: 255, nullable: true })
  ubicacion_actual: string;

  @Column({ type: 'date' })
  fecha_registro: Date;

  // Columnas FK explícitas
  @Column()
  id_tipo_elemento: number;

  @Column()
  id_estado_elemento: number;

  @Column()
  id_ambiente: number;

  // Relaciones
  @ManyToOne(() => TipoElemento, (tipo) => tipo.inventarios, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'id_tipo_elemento' })
  tipoElemento: TipoElemento;

  @ManyToOne(() => EstadoElemento, (estado) => estado.inventarios, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'id_estado_elemento' })
  estadoElemento: EstadoElemento;

  @ManyToOne(() => Ambiente, (ambiente) => ambiente.elementos, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'id_ambiente' })
  ambiente: Ambiente;
}
