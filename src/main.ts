import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors();

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`API del Clima de Marte ejecutándose en: http://localhost:${port}/api`);
  console.log(`Endpoints disponibles:`);
  console.log(`  POST http://localhost:${port}/api/weather-data/fetch-and-save`);
  console.log(`  GET  http://localhost:${port}/api/weather-data`);
  console.log(`  GET  http://localhost:${port}/api/weather-data/:sol`);
  console.log(`  POST http://localhost:${port}/api/nasa-api/fetch`);
  console.log(`  POST http://localhost:${port}/api/ai-assistant/ask`);
}

bootstrap();
