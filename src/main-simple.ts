import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN || '*'
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true,
  });

  app.use(cookieParser());

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});