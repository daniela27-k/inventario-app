// src/novedad/novedad.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Inventario } from '../inventario/inventario.entity';

export enum TipoNovedad {
    DAÑO = 'daño',
    PERDIDA = 'perdida',
    MANTENIMIENTO = 'mantenimiento',
    ROBO = 'robo',
    OTRO = 'otro',
}

export enum EstadoNovedad {
    PENDIENTE = 'pendiente',
    EN_REVISION = 'en_revision',
    RESUELTA = 'resuelta',
    CERRADA = 'cerrada',
}

@Entity('novedad')
export class Novedad {
    @PrimaryGeneratedColumn()
    id_novedad: number;

    @Column({ type: 'simple-enum', enum: TipoNovedad, default: TipoNovedad.OTRO })
    tipo_novedad: TipoNovedad;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'simple-enum', enum: EstadoNovedad, default: EstadoNovedad.PENDIENTE })
    estado_novedad: EstadoNovedad;

    @Column({ type: 'date' })
    fecha_novedad: Date;

    @Column({ type: 'text', nullable: true })
    observaciones_admin: string | null;

    // FK explícita al inventario afectado
    @Column()
    id_inventario: number;

    @ManyToOne(() => Inventario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_inventario' })
    inventario: Inventario;

    // FK explícita al usuario que reporta
    @Column()
    id_usuario_reporta: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario_reporta' })
    usuarioReporta: Usuario;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
