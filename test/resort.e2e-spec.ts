import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/domain/auth.service';
import { User } from '../src/domain/entities/user.entity';
import { HttpExceptionFilter } from '../src/infrastructure/filters/http-exception.filter';

describe('ResortsController (e2e)', () => {
  let app: INestApplication;
  let validAccessToken: string;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useGlobalFilters(new HttpExceptionFilter(logger));
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    authService = app.get(AuthService);
  });

  beforeEach(async () => {
    const user = User.create('test', 'user', 'test@example.org');

    validAccessToken = await authService.generateJwt(user);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /resorts', () => {
    it('should return 401 if no access token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/resorts');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 400 if only latitude is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/resorts')
        .query({ latitude: 42.5 })
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'Both latitude and longitude must be provided together.',
      );
    });

    it('should return 400 if only longitude is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/resorts')
        .query({ longitude: -8.3 })
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'Both latitude and longitude must be provided together.',
      );
    });

    it('should return 200 and resorts ordered alphabetically when no coordinates or search are provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/resorts')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const resortNames = response.body.map((resort: any) => resort.name);
      expect(resortNames).toEqual([...resortNames].sort());
      expect(response.body[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        country: expect.any(String),
        distance: null,
        logo: expect.any(String),
      });
    });

    it('should return 200 and resorts ordered by proximity when coordinates are provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/resorts')
        .query({ latitude: 42.5, longitude: -8.3 })
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const distances = response.body.map((resort: any) => resort.distance);
      expect(distances).toEqual([...distances].sort((a, b) => a - b));
      expect(response.body[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        country: expect.any(String),
        distance: expect.any(Number),
        logo: expect.any(String),
      });
    });

    it('should return 200 and resorts filtered by search term', async () => {
      const searchTerm = 'Baqueira';
      const response = await request(app.getHttpServer())
        .get('/resorts')
        .query({ search: searchTerm })
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((resort: any) => {
        expect(resort.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
      expect(response.body[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        country: expect.any(String),
        distance: null,
        logo: expect.any(String),
      });
    });
  });

  describe('GET /resorts/:id/export', () => {
    it('should return 401 if no access token is provided', async () => {
      const response = await request(app.getHttpServer()).get(
        '/resorts/1/export',
      );

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 404 if resort not exists', async () => {
      const resortId = '944c9595-d881-436e-b89e-b14960c31e7a'; // unknown id;
      const response = await request(app.getHttpServer())
        .get(`/resorts/${resortId}/export`)
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Resort not found/i);
    });

    it('should return 200 and resort database', async () => {
      const resortId = '5f905dac-b03e-4932-a53e-f20f55661c3c'; // seeder resort id;
      const response = await request(app.getHttpServer())
        .get(`/resorts/${resortId}/export`)
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);

      expect(response.header['content-type']).toContain(
        'application/octet-stream',
      );
      expect(response.header['content-disposition']).toContain(
        `resort_${resortId}.db`,
      );

      expect(response.body).toBeInstanceOf(Buffer);
    });
  });
});
