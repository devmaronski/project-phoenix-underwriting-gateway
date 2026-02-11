import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs/operators';

type ResponseData = Record<string, unknown>;

/**
 * RequestIdInterceptor - Generates and tracks UUID per request
 * Attaches requestId to request object and enriches response with meta.requestId
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const requestId = uuidv4();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.requestId = requestId;

    return next.handle().pipe(
      map((data: ResponseData) => {
        if (data && typeof data === 'object') {
          const response = data;
          if (!('meta' in response)) {
            response.meta = {};
          }
          const meta = response.meta as ResponseData;
          meta.requestId = requestId;
        }
        return data;
      }),
    );
  }
}
