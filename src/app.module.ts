import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import mikroOrmConfig from '../mikro-orm.config';
import handles from './handles';
import { AppleStrategy } from './infrastructure/auth/apple.strategy';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { winstonConfig } from './infrastructure/config/logging.config';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { LoggingService } from './infrastructure/logging/logging.service';
import { RequestContextMiddleware } from './infrastructure/middleware/request-context.middleware';
import { VersionCheckMiddleware } from './infrastructure/middleware/version-check.middleware';
import { AppController } from './presentation/controllers/app.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { GetMeController } from './presentation/controllers/me.controller';
import { ResortController } from './presentation/controllers/resort.controller';
import repositories from './repositories';
import services from './services';

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

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_TTL },
});

@Module({
  imports: [
    configModule,
    clsModule,
    mikroORM,
    TerminusModule,
    HttpModule,
    WinstonModule.forRoot(winstonConfig),
    PassportModule,
    jwtModule,
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    ResortController,
    GetMeController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    LoggingService,
    AppleStrategy,
    JwtStrategy,
    ...repositories,
    ...services,
    ...handles,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
    consumer.apply(VersionCheckMiddleware).forRoutes('*');
  }
}
