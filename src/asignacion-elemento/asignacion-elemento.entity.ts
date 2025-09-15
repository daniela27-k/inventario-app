import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class AsignacionElemento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreElemento: string;

  @Column()
  fechaAsignacion: Date;

  // ✅ Relación con usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.asignaciones)
  usuario: Usuario;
}
