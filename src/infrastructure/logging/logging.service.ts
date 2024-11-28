import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggingService {
  private readonly logger: Logger = new Logger('LoggingService');

  constructor(private readonly clsService: ClsService) {}

  private getContext() {
    return {
      requestId: this.clsService.get<string>('requestId') || 'no-request-id',
      correlationId:
        this.clsService.get<string>('correlationId') || 'no-correlation-id',
    };
  }

  log(message: string, meta?: any) {
    const context = this.getContext();
    this.logger.log(
      `[RequestID: ${context.requestId}] [CorrelationID: ${context.correlationId}] ${message}`,
      meta,
    );
  }

  error(message: string, meta?: any) {
    const context = this.getContext();
    this.logger.error(
      `[RequestID: ${context.requestId}] [CorrelationID: ${context.correlationId}] ${message}`,
      meta,
    );
  }

  warn(message: string, meta?: any) {
    const context = this.getContext();
    this.logger.warn(
      `[RequestID: ${context.requestId}] [CorrelationID: ${context.correlationId}] ${message}`,
      meta,
    );
  }

  debug(message: string, meta?: any) {
    const context = this.getContext();
    this.logger.debug(
      `[RequestID: ${context.requestId}] [CorrelationID: ${context.correlationId}] ${message}`,
      meta,
    );
  }
}
