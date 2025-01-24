import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainToHttpExceptionMapper {
  static map(exception: any): HttpException {
    if (exception.name === 'NotFoundError') {
      return new HttpException(exception.message, HttpStatus.NOT_FOUND);
    }
    if (exception.name === 'ValidationError') {
      return new HttpException(exception.message, HttpStatus.BAD_REQUEST);
    }
    if (exception.name === 'ConflictError') {
      return new HttpException(exception.message, HttpStatus.CONFLICT);
    }
    if (exception.name === 'UnauthorizedError') {
      return new HttpException(exception.message, HttpStatus.UNAUTHORIZED);
    }

    return new HttpException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
