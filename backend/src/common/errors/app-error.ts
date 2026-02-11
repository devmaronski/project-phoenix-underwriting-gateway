const ERROR_CODE_TO_STATUS = {
  NOT_FOUND: 404,
  LEGACY_DATA_CORRUPT: 422,
  VALIDATION_FAILED: 400,
  AI_TIMEOUT: 503,
  AI_UNAVAILABLE: 503,
} as const;

type ErrorCode = keyof typeof ERROR_CODE_TO_STATUS;

/**
 * AppError - Domain-level error class for structured error handling
 * Maps error codes to HTTP status codes and includes optional details
 */
export class AppError extends Error {
  readonly statusCode: number;

  constructor(
    readonly code: string,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = this.mapCodeToStatus(code);
  }

  private mapCodeToStatus(code: string): number {
    return ERROR_CODE_TO_STATUS[code as ErrorCode] ?? 500;
  }
}
