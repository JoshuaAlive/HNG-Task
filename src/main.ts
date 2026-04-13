import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  const corsMethods = configService
    .get<string>('CORS_METHODS', 'GET,OPTIONS')
    .split(',')
    .map((method) => method.trim())
    .filter(Boolean);

  app.enableCors({ origin: corsOrigin, methods: corsMethods });

  const port = configService.get<number>('PORT', 8900);
  await app.listen(port);
  console.log(`🚀 Server listening on port ${port}`);
}
bootstrap();
