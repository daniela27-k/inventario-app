import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../inventario/inventario.entity';

@Entity('ambiente')
export class Ambiente {
  @PrimaryGeneratedColumn()
  id_ambiente: number;

  @Column({ length: 255 })
  nombre_ambiente: string;

  @Column()
  capacidad: number;

  @Column({ length: 255 })
  ubicacion: string;

  @Column({ type: 'simple-enum', enum: ['activo', 'inactivo', 'mantenimiento'] })
  estado: string;

  @OneToMany(() => Inventario, (inventario) => inventario.ambiente)
  elementos: Inventario[];
}
