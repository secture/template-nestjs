import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectError } from '../../../api/domain/error/project.error';

export class DomainToHttpExceptionMapper {
  static map(exception: ProjectError): HttpException {
    if (exception.name === 'ConflictError') {
      return new ConflictException(exception.message);
    }
    if (exception.name === 'NotFoundError') {
      return new NotFoundException(exception.message);
    }
    if (exception.name === 'InvalidError') {
      return new BadRequestException(exception.message);
    }
    if (exception.name === 'UnauthorizedError') {
      return new UnauthorizedException(exception.message);
    }

    return new HttpException(
      exception.message ?? 'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
