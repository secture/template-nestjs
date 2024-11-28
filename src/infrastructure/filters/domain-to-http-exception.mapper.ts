import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainToHttpExceptionMapper {
  static map(exception: any): HttpException {
    if (exception.name === 'NotFoundException') {
      return new HttpException(exception.message, HttpStatus.NOT_FOUND);
    }
    if (exception.name === 'ValidationException') {
      return new HttpException(exception.message, HttpStatus.BAD_REQUEST);
    }

    return new HttpException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
