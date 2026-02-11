import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): Record<string, unknown> {
    return {
      status: 'ok',
    };
  }
}
