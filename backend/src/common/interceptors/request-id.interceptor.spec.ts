import { CallHandler, ExecutionContext } from '@nestjs/common';
import { RequestIdInterceptor } from './request-id.interceptor';
import { of } from 'rxjs';

describe('RequestIdInterceptor', () => {
  let interceptor: RequestIdInterceptor;

  beforeEach(() => {
    interceptor = new RequestIdInterceptor();
  });

  it('should generate a UUID and attach to request', () => {
    const mockRequest = {} as Record<string, unknown>;
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockHandler = {
      handle: () => of({}),
    } as CallHandler;

    interceptor.intercept(mockContext, mockHandler);

    expect(mockRequest).toHaveProperty('requestId');
    expect(mockRequest.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should not mutate response body', (done) => {
    const mockRequest = {} as Record<string, unknown>;
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const responseData = { status: 'ok' } as Record<string, unknown>;
    const mockHandler = {
      handle: () => of(responseData),
    } as CallHandler;

    interceptor.intercept(mockContext, mockHandler).subscribe((result) => {
      expect(result).toBe(responseData);
      expect(result).not.toHaveProperty('meta');
      done();
    });
  });
});
