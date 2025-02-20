import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from '../../../shared/infrastructure/logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService,
    private readonly loggingService: LoggingService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const requestId = this.clsService.get<string>('requestId');
        const correlationId = this.clsService.get<string>('correlationId');
        const timing = Date.now() - now;

        this.loggingService.log(`Request completed in ${timing}ms`, {
          requestId,
          correlationId,
        });
      }),
      catchError((error) => {
        const requestId = this.clsService.get<string>('requestId');
        const correlationId = this.clsService.get<string>('correlationId');

        this.loggingService.error('Request failed', {
          requestId,
          correlationId,
          error,
        });
        throw error;
      }),
    );
  }
}
