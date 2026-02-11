import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '../errors/app-error';

const DEFAULT_ERROR = {
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Internal server error',
  statusCode: 500,
} as const;

type ErrorState = {
  code: string;
  message: string;
  statusCode: number;
};
type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: { requestId: string };
};

/**
 * GlobalExceptionFilter - Catches all exceptions and formats consistent error responses
 * Maps AppError, HttpException, and generic Error to structured response format
 * Always includes requestId in meta for request tracking
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const requestId = request.requestId ?? 'unknown';

    let errorState: ErrorState = { ...DEFAULT_ERROR };
    let details: Record<string, unknown> | undefined;

    if (exception instanceof AppError) {
      errorState = {
        code: exception.code,
        message: exception.message,
        statusCode: exception.statusCode,
      };
      details = exception.details;
    } else if (exception instanceof HttpException) {
      errorState = {
        code: `HTTP_${exception.getStatus()}`,
        message: exception.message,
        statusCode: exception.getStatus(),
      };
    } else if (exception instanceof Error) {
      errorState = {
        ...DEFAULT_ERROR,
        message: exception.message,
      };
    }

    this.logger.error(
      `[${errorState.code}] ${errorState.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ErrorResponse = {
      error: {
        code: errorState.code,
        message: errorState.message,
        ...(details && { details }),
      },
      meta: { requestId },
    };

    response.status(errorState.statusCode).json(errorResponse);
  }
}
