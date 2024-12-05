import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HealthCheck (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
          docs: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
          docs: {
            status: 'up',
          },
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
