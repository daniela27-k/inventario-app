import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule} from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AmbienteModule } from './ambiente/ambiente.module';
import { InventarioModule } from './inventario/inventario.module';
import { TipoElementoModule } from './tipo-elemento/tipo-elemento.module';
import { EstadoElementoModule } from './estado-elemento/estado-elemento.module';
import { AsignacionElementoModule } from './asignacion-elemento/asignacion-elemento.module';
import { AuthModule } from './auth/auth.module';

// entities
import { Ambiente } from './ambiente/ambiente.entity';
import { Usuario } from './usuario/usuario.entity';
import { Inventario } from './inventario/inventario.entity';
import { TipoElemento } from './tipo-elemento/tipo-elemento.entity';
import { EstadoElemento } from './estado-elemento/estado-elemento.entity';
import { AsignacionElemento } from './asignacion-elemento/asignacion-elemento.entity';

//funcion de ayuda para obtener variables de entorno
function getEnv(key: string): string {
  const value= process.env[key];
  if (value===undefined){
    throw new Error(`La variable de entorno ${key} no está definida`);
  }
  return value; 
}


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), //hace que.env este disponible en toda la app
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: getEnv('DB_HOST'),
      port: parseInt(getEnv('DB_PORT') || '3306', 10),
      username:getEnv('DB_USERNAME'),
      password:getEnv('DB_PASSWORD'),
      database:getEnv('DB_NAME'),
      entities:[
        Ambiente,
        Usuario,
        Inventario,
        TipoElemento,
        EstadoElemento,
        AsignacionElemento
      ],
      // synchronize: process.env.NODE_ENV !== 'production', //sincroniza la bd solo en desarrollo
      logging: process.env.NODE_ENV !== 'production', //habilita el log de queries en desarrollo
      //softdelete: true, //habilita el borrado logico
    }),

    AsignacionElementoModule,
    UsuarioModule,
    InventarioModule,
    AmbienteModule,
    TipoElementoModule,
    EstadoElementoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
