import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { RequestIdInterceptor } from '../src/common/interceptors/request-id.interceptor';
import { Server } from 'http';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global interceptor for request ID tracking
    app.useGlobalInterceptors(new RequestIdInterceptor());

    // Apply global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health (E2E)', () => {
    it('should return 200 with status ok', () => {
      return request(app.getHttpServer() as Server)
        .get('/health')
        .expect(200)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          expect(body).toHaveProperty('status', 'ok');
          expect(body).toHaveProperty('meta');
          expect(body).toHaveProperty('meta.requestId');
          const meta = body.meta as Record<string, unknown>;
          expect(meta.requestId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          );
        });
    });

    it('should include valid UUID in meta.requestId', () => {
      return request(app.getHttpServer() as Server)
        .get('/health')
        .expect(200)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          const meta = body.meta as Record<string, unknown>;
          const requestId = meta.requestId as string;
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          expect(requestId).toMatch(uuidRegex);
        });
    });
  });
});
