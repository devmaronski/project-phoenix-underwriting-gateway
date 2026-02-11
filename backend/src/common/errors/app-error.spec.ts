import { AppError } from './app-error';

const ERROR_CASES = {
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  LEGACY_DATA_CORRUPT: { code: 'LEGACY_DATA_CORRUPT', status: 422 },
  VALIDATION_FAILED: { code: 'VALIDATION_FAILED', status: 400 },
  AI_TIMEOUT: { code: 'AI_TIMEOUT', status: 503 },
  AI_UNAVAILABLE: { code: 'AI_UNAVAILABLE', status: 503 },
} as const;

type ErrorCase = (typeof ERROR_CASES)[keyof typeof ERROR_CASES];

describe('AppError', () => {
  it('should create an error with code, message, and optional details', () => {
    const details = { loanId: '123' } as const;
    const error = new AppError('NOT_FOUND', 'Loan not found', details);

    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Loan not found');
    expect(error.details).toEqual(details);
    expect(error.statusCode).toBe(404);
  });

  it('should map error code to correct HTTP status', () => {
    const testCases: Array<ErrorCase> = [
      ERROR_CASES.NOT_FOUND,
      ERROR_CASES.LEGACY_DATA_CORRUPT,
      ERROR_CASES.VALIDATION_FAILED,
      ERROR_CASES.AI_TIMEOUT,
      ERROR_CASES.AI_UNAVAILABLE,
    ];

    testCases.forEach((errorCase) => {
      const error = new AppError(errorCase.code, errorCase.code);
      expect(error.statusCode).toBe(errorCase.status);
    });
  });

  it('should have optional details field', () => {
    const detailsValue = { field: 'value' } as const;
    const errorWithDetails = new AppError('TEST_ERROR', 'Test', detailsValue);
    const errorWithoutDetails = new AppError('TEST_ERROR', 'Test');

    expect(errorWithDetails.details).toEqual(detailsValue);
    expect(errorWithoutDetails.details).toBeUndefined();
  });
});
