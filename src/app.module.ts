import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { winstonConfig } from './infrastructure/config/logging.config';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { LoggingService } from './infrastructure/logging/logging.service';
import { RequestContextMiddleware } from './infrastructure/middleware/request-context.middleware';
import { AppController } from './presentation/controllers/app.controller';
import { HealthController } from './presentation/controllers/health.controller';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env.local', '.env'],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().port().default(3000),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
  }),
});

const clsModule = ClsModule.forRoot({
  global: true,
  middleware: { mount: true },
});

const mikroORM = MikroOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    autoLoadEntities: false,
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: configService.get<string>('DATABASE_NAME'),
    driver: PostgreSqlDriver,
    user: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    debug: configService.get<string>('NODE_ENV') !== 'production',
  }),
});

@Module({
  imports: [
    configModule,
    clsModule,
    mikroORM,
    TerminusModule,
    HttpModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    LoggingService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
