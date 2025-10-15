import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthSimpleController } from './auth/auth-simple.controller';

// Controlador simple para pruebas
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthSimpleController],
  providers: [],
})
export class AppSimpleModule {}