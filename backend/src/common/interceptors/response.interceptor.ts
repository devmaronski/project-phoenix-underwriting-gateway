import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

interface ResponseWithMeta {
  meta?: { requestId?: string };
  [key: string]: unknown;
}

/**
 * ResponseInterceptor - Wraps all responses with meta.requestId
 * Ensures consistency across success and error responses
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWithMeta> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.requestId;

    return next.handle().pipe(
      map((data: ResponseWithMeta) => ({
        ...data,
        meta: {
          ...data?.meta,
          requestId,
        },
      })),
    );
  }
}
