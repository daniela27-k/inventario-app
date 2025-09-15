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

  @Column({ type: 'enum', enum: ['activo', 'inactivo'] })
  estado: string;

  @OneToMany(() => Inventario, (inventario) => inventario.tipoElemento)
  inventarios: Inventario[];
}
