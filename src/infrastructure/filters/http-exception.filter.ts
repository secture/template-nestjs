import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'winston';
import { DomainToHttpExceptionMapper } from './domain-to-http-exception.mapper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let httpException: HttpException;

    if (!(exception instanceof HttpException)) {
      httpException = DomainToHttpExceptionMapper.map(exception);
    } else {
      httpException = exception;
    }

    const status = httpException.getStatus();
    const errorResponse = httpException.getResponse();

    this.logger.error('Exception occurred', {
      status,
      error: errorResponse,
      stack: exception.stack,
    });

    response.status(status).json({
      statusCode: status,
      message: errorResponse,
    });
  }
}
