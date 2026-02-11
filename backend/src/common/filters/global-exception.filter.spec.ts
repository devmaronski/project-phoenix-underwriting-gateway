import { ArgumentsHost, HttpException } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { AppError } from '../errors/app-error';

const TEST_REQUEST_ID = 'test-uuid-1234' as const;

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
};

type MockRequest = {
  requestId: string;
};

const createMockHost = (
  mockRequest: MockRequest,
  mockResponse: MockResponse,
): ArgumentsHost =>
  ({
    switchToHttp: () => ({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    }),
  }) as ArgumentsHost;

const createMockResponse = (): MockResponse => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

const createMockRequest = (requestId = TEST_REQUEST_ID): MockRequest => ({
  requestId,
});

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: MockResponse;
  let mockRequest: MockRequest;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
  });

  it('should catch AppError and format response correctly', () => {
    const errorDetails = { loanId: '123' } as const;
    const appError = new AppError('NOT_FOUND', 'Loan not found', errorDetails);
    const mockHost = createMockHost(mockRequest, mockResponse);

    filter.catch(appError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'Loan not found',
        details: errorDetails,
      },
      meta: { requestId: TEST_REQUEST_ID },
    });
  });

  it('should handle generic Error exceptions', () => {
    const error = new Error('Internal server error');
    const mockHost = createMockHost(mockRequest, mockResponse);

    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
      meta: { requestId: TEST_REQUEST_ID },
    });
  });

  it('should handle HttpException from NestJS', () => {
    const httpException = new HttpException('Bad request', 400);
    const mockHost = createMockHost(mockRequest, mockResponse);

    filter.catch(httpException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it('should always include requestId in meta', () => {
    const appError = new AppError('VALIDATION_FAILED', 'Invalid input');
    const mockHost = createMockHost(mockRequest, mockResponse);

    filter.catch(appError, mockHost);

    const callArgs = mockResponse.json.mock.calls[0] as Array<
      Record<string, unknown>
    >;
    const errorResponse = callArgs[0];
    const meta = errorResponse.meta as Record<string, unknown>;
    expect(meta.requestId).toBe(TEST_REQUEST_ID);
  });
});
