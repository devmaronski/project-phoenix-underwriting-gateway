import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * RequestIdInterceptor - Generates and tracks UUID per request
 * Attaches requestId to request object
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = uuidv4();

    request.requestId = requestId;

    return next.handle();
  }
}
