import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/domain/auth.service';
import { User } from '../src/domain/entities/user.entity';
import { EntityManager } from '@mikro-orm/core';

describe('GetMeController (e2e)', () => {
  let app: INestApplication;
  let validAccessToken: string;
  let authService: AuthService;
  let em: EntityManager;
  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    authService = app.get(AuthService);
    em = app.get(EntityManager).fork();
  });

  beforeEach(async () => {
    user = User.create('test', 'user', 'test@example.org');
    user.phone = '+123456789';
    await em.persistAndFlush(user);
    validAccessToken = await authService.generateJwt(user);
  });

  afterEach(async () => {
    await em.removeAndFlush(user);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET/me', () => {
    it('should return 401 if no access token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 200 and authenticated user data', async () => {
      const response = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        surname: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        phoneVerified: expect.any(Boolean),
      });
    });
  });
});
