import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './infrastructure/config/logging.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
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
