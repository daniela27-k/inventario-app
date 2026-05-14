import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // ✅ AÑADIDO
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ ValidationPipe global — sin esto el DTO nunca valida nada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // elimina campos no declarados en el DTO
      forbidNonWhitelisted: false,
      transform: true,       // transforma tipos automáticamente
    }),
  );

  // ✅ CORS: soporta múltiples orígenes separados por coma en producción
  const rawOrigin = process.env.CORS_ORIGIN || '';
  const allowedOrigins = rawOrigin
    ? rawOrigin.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? allowedOrigins.length > 0
          ? allowedOrigins
          : true  // ← permite cualquier origen si no se configura CORS_ORIGIN
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
          ],
    credentials: true,
  });

  app.use(cookieParser());

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});