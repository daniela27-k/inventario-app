import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../inventario/inventario.entity';

@Entity('estado_elemento')
export class EstadoElemento {
  @PrimaryGeneratedColumn()
  id_estado_elemento: number;

  @Column({ length: 255 })
  nombre_estado: string;

  @Column('text')
  descripcion: string;

  @Column({ length: 7 })
  color_codigo: string;

  @OneToMany(() => Inventario, (inventario) => inventario.estadoElemento)
  inventarios: Inventario[];
}
