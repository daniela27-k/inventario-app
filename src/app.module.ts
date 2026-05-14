// last updated: 2026-02-26T13:10
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AmbienteModule } from './ambiente/ambiente.module';
import { InventarioModule } from './inventario/inventario.module';
import { TipoElementoModule } from './tipo-elemento/tipo-elemento.module';
import { EstadoElementoModule } from './estado-elemento/estado-elemento.module';
import { AsignacionElementoModule } from './asignacion-elemento/asignacion-elemento.module';
import { AuthModule } from './auth/auth.module';
import { NovedadModule } from './novedad/novedad.module';
import { AsistenteModule } from './asistente/asistente.module';

// entities
import { Ambiente } from './ambiente/ambiente.entity';
import { Usuario } from './usuario/usuario.entity';
import { Inventario } from './inventario/inventario.entity';
import { TipoElemento } from './tipo-elemento/tipo-elemento.entity';
import { EstadoElemento } from './estado-elemento/estado-elemento.entity';
import { AsignacionElemento } from './asignacion-elemento/asignacion-elemento.entity';
import { Novedad } from './novedad/novedad.entity';

//funcion de ayuda para obtener variables de entorno
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`La variable de entorno ${key} no está definida`);
  }
  return value || defaultValue || '';
}

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql', // ✅ Siempre MySQL: tanto local (XAMPP) como producción (Aiven)
      host: getEnv('DB_HOST'),
      port: parseInt(getEnv('DB_PORT') || '3306', 10),
      username: getEnv('DB_USERNAME'),
      password: getEnv('DB_PASSWORD'),
      database: getEnv('DB_NAME'),
      // ✅ SSL requerido por Aiven en producción
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      entities: [
        Ambiente,
        Usuario,
        Inventario,
        TipoElemento,
        EstadoElemento,
        AsignacionElemento,
        Novedad,
      ],
      synchronize: true,          // ✅ Crea tablas automáticamente (BD de Aiven está vacía)
      logging: !isProduction,     // ✅ Logs SQL solo en desarrollo, no en producción
      dropSchema: false,
    } as any),

    AsignacionElementoModule,
    UsuarioModule,
    InventarioModule,
    AmbienteModule,
    TipoElementoModule,
    EstadoElementoModule,
    AuthModule,
    NovedadModule,
    AsistenteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }