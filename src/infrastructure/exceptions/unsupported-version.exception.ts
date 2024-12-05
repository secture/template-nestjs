import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsupportedVersionException extends HttpException {
  constructor(recommendedVersion: string) {
    super(
      `Your client version is no longer supported. Please update to at least version ${recommendedVersion}.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
