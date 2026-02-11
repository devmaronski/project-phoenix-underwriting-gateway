import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { RequestIdInterceptor } from '../src/common/interceptors/request-id.interceptor';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import {
  MockRiskClient,
  MockRiskClientOptions,
} from '../src/risk/mock-risk-client';
import { Server } from 'http';

describe('App E2E', () => {
  let app: INestApplication;

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const expectMetaRequestId = (body: Record<string, unknown>) => {
    expect(body).toHaveProperty('meta');
    const meta = body.meta as Record<string, unknown>;
    expect(meta.requestId).toMatch(UUID_REGEX);
  };

  const createApp = async (
    riskOptions?: MockRiskClientOptions,
  ): Promise<INestApplication> => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    if (riskOptions) {
      moduleBuilder
        .overrideProvider(MockRiskClient)
        .useValue(new MockRiskClient(riskOptions));
    }

    const moduleFixture = await moduleBuilder.compile();

    const nestApp = moduleFixture.createNestApplication();

    // Apply global interceptors for request ID tracking and response shaping
    nestApp.useGlobalInterceptors(
      new RequestIdInterceptor(),
      new ResponseInterceptor(),
    );

    // Apply global exception filter
    nestApp.useGlobalFilters(new GlobalExceptionFilter());

    await nestApp.init();
    return nestApp;
  };

  beforeAll(async () => {
    app = await createApp();
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
          expectMetaRequestId(body);
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
          expect(requestId).toMatch(UUID_REGEX);
        });
    });
  });

  describe('GET /loans/:id (E2E)', () => {
    it('should return loan, risk, and meta.requestId for valid loan', () => {
      return request(app.getHttpServer() as Server)
        .get('/loans/LOAN-VALID-001')
        .expect(200)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          expect(body).toHaveProperty('loan');
          expect(body).toHaveProperty('risk');

          const loan = body.loan as Record<string, unknown>;
          expect(loan.id).toBe('LOAN-VALID-001');
          expect(loan.borrower_name).toBe('Jane Smith');
          expect(loan.loan_amount_dollars).toBe(1000);
          expect(loan.issued_date).toBe('2024-01-15T00:00:00.000Z');
          expect(loan.interest_rate_percent).toBe(5.75);
          expect(loan.term_months).toBe(60);

          const risk = body.risk as Record<string, unknown>;
          expect(typeof risk.score).toBe('number');
          expect(Array.isArray(risk.topReasons)).toBe(true);

          expectMetaRequestId(body);
        });
    });

    it('should return LEGACY_DATA_CORRUPT with meta.requestId for corrupt loan', () => {
      return request(app.getHttpServer() as Server)
        .get('/loans/LOAN-CORRUPT-DATE-001')
        .expect(422)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          expect(body).toHaveProperty('error');
          const error = body.error as Record<string, unknown>;
          expect(error.code).toBe('LEGACY_DATA_CORRUPT');
          expectMetaRequestId(body);
        });
    });
  });

  describe('GET /loans/:id (AI failure)', () => {
    let failureApp: INestApplication;

    beforeAll(async () => {
      failureApp = await createApp({ failureMode: 'failure' });
    });

    afterAll(async () => {
      await failureApp.close();
    });

    it('should return AI_UNAVAILABLE with meta.requestId', () => {
      return request(failureApp.getHttpServer() as Server)
        .get('/loans/LOAN-VALID-001')
        .expect(503)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          expect(body).toHaveProperty('error');
          const error = body.error as Record<string, unknown>;
          expect(error.code).toBe('AI_UNAVAILABLE');
          expectMetaRequestId(body);
        });
    });
  });
});
