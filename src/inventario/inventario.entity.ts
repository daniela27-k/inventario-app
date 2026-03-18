// inventario.entity.ts
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

  @Column({ length: 255, nullable: true })
  modelo: string;

  @Column({ length: 255 })
  marca: string;

  @Column({ length: 255, nullable: true })
  ubicacion_actual: string;

  @Column({ type: 'date' })
  fecha_registro: Date;

  @Column({ type: 'date', nullable: true })
  fecha_baja: Date | null;

  @Column({ type: 'text', nullable: true })
  motivo_baja: string | null;

  @Column()
  id_tipo_elemento: number;

  @Column()
  id_estado_elemento: number;

  @Column()
  id_ambiente: number;

  @ManyToOne(() => TipoElemento, (tipo) => tipo.inventarios, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_tipo_elemento' })
  tipoElemento: TipoElemento;

  @ManyToOne(() => EstadoElemento, (estado) => estado.inventarios, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_estado_elemento' })
  estadoElemento: EstadoElemento;

  @ManyToOne(() => Ambiente, (ambiente) => ambiente.elementos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_ambiente' })
  ambiente: Ambiente;
}