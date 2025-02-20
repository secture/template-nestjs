import { EntityManager } from '@mikro-orm/postgresql';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/api/domain/auth.service';
import { User } from '../src/shared/domain/entities/user.entity';

describe('GetWebcamsController (e2e)', () => {
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

    user = User.create('test', 'user', 'test@example.org');
    user.phone = '+123456789';
    await em.persistAndFlush(user);
    validAccessToken = await authService.generateJwt(user);
  });

  afterAll(async () => {
    await app.close();
  });
  describe('GET/resorts/:resortId/webcams', () => {
    it('Should return 401 if no access token is provided', async () => {
      const response = await request(app.getHttpServer()).get(
        `/resorts/5f905dac-b03e-4932-a53e-f20f55661c3c/webcams`,
      );

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 200 and webcams for a given resort', async () => {
      const response = await request(app.getHttpServer())
        .get(`/resorts/5f905dac-b03e-4932-a53e-f20f55661c3c/webcams`)
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        url: expect.any(String),
        lastUpdated: expect.any(String),
        resortId: expect.any(String),
      });
    });
  });
});
