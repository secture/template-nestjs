import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import mikroOrmConfig from '../mikro-orm.config';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { LoggingInterceptor } from './api/infrastructure/interceptors/logging.interceptor';
import { RequestContextMiddleware } from './api/infrastructure/middleware/request-context.middleware';
import { VersionCheckMiddleware } from './api/infrastructure/middleware/version-check.middleware';
import { winstonConfig } from './shared/infrastructure/config/logging.config';
import { SharedModule } from './shared/shared.module';

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
    MIN_SUPPORTED_VERSION: Joi.string()
      .regex(
        new RegExp(
          '^(0|[1-9]d*).(0|[1-9]d*).(0|[1-9]d*)(?:-((?:0|[1-9]d*|d*[a-zA-Z-][0-9a-zA-Z-]*)(?:.(?:0|[1-9]d*|d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:.[0-9a-zA-Z-]+)*))?$',
        ),
      )
      .required(),
    RECOMMENDED_VERSION: Joi.string()
      .regex(
        new RegExp(
          '^(0|[1-9]d*).(0|[1-9]d*).(0|[1-9]d*)(?:-((?:0|[1-9]d*|d*[a-zA-Z-][0-9a-zA-Z-]*)(?:.(?:0|[1-9]d*|d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:.[0-9a-zA-Z-]+)*))?$',
        ),
      )
      .required(),
    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),
    APPLE_PRIVATE_KEY: Joi.string().required(),
    APPLE_CALLBACK_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_TTL: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_TTL: Joi.string().required(),
  }),
});

const clsModule = ClsModule.forRoot({
  global: true,
  middleware: { mount: true },
});

const mikroORM = MikroOrmModule.forRoot(mikroOrmConfig);

@Module({
  imports: [
    configModule,
    clsModule,
    mikroORM,
    WinstonModule.forRoot(winstonConfig),
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
    consumer.apply(VersionCheckMiddleware).forRoutes('*');
  }
}
