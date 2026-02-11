import { ResponseInterceptor } from './response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { Request } from 'express';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          requestId: 'test-request-id-123',
        } as Request),
      }),
    } as unknown as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn(),
    } as CallHandler;
  });

  it('should add requestId to response meta', (done) => {
    const mockResponse = {
      data: 'test data',
    };

    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockResponse));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: 'test data',
          meta: {
            requestId: 'test-request-id-123',
          },
        });
        done();
      },
    });
  });

  it('should preserve existing meta and add requestId', (done) => {
    const mockResponse = {
      data: 'test data',
      meta: {
        existingField: 'existing value',
      },
    };

    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockResponse));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: 'test data',
          meta: {
            existingField: 'existing value',
            requestId: 'test-request-id-123',
          },
        });
        done();
      },
    });
  });

  it('should handle response without existing meta', (done) => {
    const mockResponse = {
      items: ['item1', 'item2'],
      count: 2,
    };

    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockResponse));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          items: ['item1', 'item2'],
          count: 2,
          meta: {
            requestId: 'test-request-id-123',
          },
        });
        done();
      },
    });
  });
});
