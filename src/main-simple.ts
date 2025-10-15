import { NestFactory } from '@nestjs/core';
import { AppSimpleModule } from './app-simple.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppSimpleModule);
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'http://localhost:3000'
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3001);
  console.log('Servidor simple corriendo en http://localhost:3001');
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});