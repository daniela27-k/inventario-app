import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../inventario/inventario.entity';

@Entity('tipo_elemento')
export class TipoElemento {
  @PrimaryGeneratedColumn()
  id_tipo_elemento: number;

  @Column({ length: 255 })
  nombre_tipo: string;

  @Column('text')
  descripcion: string;

  @Column({ length: 255, nullable: true })
  marca: string;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'] })
  estado: string;

  @Column({ length: 255, nullable: true })
  numero_serial: string;

  @OneToMany(() => Inventario, (inventario) => inventario.tipoElemento)
  inventarios: Inventario[];
}