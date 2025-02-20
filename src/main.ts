import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './shared/infrastructure/config/logging.config';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Élevé')
    .setDescription('The Élevé API description')
    .setVersion('1.0')
    .addTag('Élevé')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'x-correlation-id',
      description: 'Correlation identifier for related requests',
      required: false,
      in: 'header',
    })
    .addGlobalParameters({
      name: 'x-client-version',
      description: 'Client version',
      required: false,
      in: 'header',
    })
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: 'api/docs.json',
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
