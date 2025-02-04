import { EntityManager } from '@mikro-orm/core';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/domain/auth.service';
import { User } from '../src/domain/entities/user.entity';
import { HttpExceptionFilter } from '../src/infrastructure/filters/http-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let em: EntityManager;
  let authService: AuthService;
  let validJwt: string;
  let user: User;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('apple'))
      .useValue({ canActivate: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useGlobalFilters(new HttpExceptionFilter(logger));
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    authService = app.get(AuthService);
    em = app.get(EntityManager).fork();
    user = User.create('test', 'user', 'test@example.org');
  });

  beforeEach(async () => {
    validJwt = await authService.generateJwt(user);
    await em.persistAndFlush(user);
  });

  afterEach(async () => {
    await em.nativeDelete('RefreshToken', { _user: user });
    await em.removeAndFlush(user);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/apple/callback (POST)', () => {
    it('should return access and refresh tokens on successful login', async () => {
      jest
        .spyOn(app.get(AuthGuard('apple')), 'canActivate')
        .mockImplementationOnce((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: user.id.toString(), email: 'test@example.org' };

          return true;
        });

      const response = await request(app.getHttpServer())
        .post('/auth/apple/callback')
        .send();

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should return 401 if user is not provided', async () => {
      jest
        .spyOn(app.get(AuthGuard('apple')), 'canActivate')
        .mockImplementationOnce((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = null;

          return true;
        });

      const response = await request(app.getHttpServer())
        .post('/auth/apple/callback')
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should return new access and refresh tokens', async () => {
      const refreshToken = await authService.generateRefreshToken(
        user,
        'default_device',
      );

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ refreshToken: refreshToken.token });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should return 401 if JWT is missing or invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'mockRefreshToken' });

      expect(response.status).toBe(401);
    });

    it('should return 409 if refresh token is invalid', async () => {
      validJwt = await authService.generateJwt(user);

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ refreshToken: 'invalidToken' });

      expect(response.status).toBe(409);
    });

    it('should return 400 if refresh token is missing', async () => {
      validJwt = await authService.generateJwt(user);

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('/aut/logout (POST)', () => {
    it('should log out successfully and return 204', async () => {
      const refreshToken = await authService.generateRefreshToken(
        user,
        'default_device',
      );

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ refreshToken: refreshToken.token });

      expect(response.status).toBe(204);
    });

    it('should return 401 if JWT is missing or invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refreshToken: 'mockRefreshToken' });

      expect(response.status).toBe(401);
    });

    it('should return 409 if refresh token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ refreshToken: 'invalidToken' });

      expect(response.status).toBe(409);
    });

    it('should return 400 if refresh token is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${validJwt}`)
        .send();

      expect(response.status).toBe(400);
    });
  });
});
