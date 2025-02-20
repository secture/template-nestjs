import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as semver from 'semver';
import { UnsupportedVersionException } from '../exceptions/unsupported-version.exception';

@Injectable()
export class VersionCheckMiddleware implements NestMiddleware {
  private readonly minSupportedVersion: string;
  private readonly recommendedVersion: string;

  constructor(configService: ConfigService) {
    this.minSupportedVersion = configService.getOrThrow(
      'MIN_SUPPORTED_VERSION',
    );
    this.recommendedVersion = configService.getOrThrow('RECOMMENDED_VERSION');
  }
  use(req: any, res: any, next: () => void) {
    const clientVersion = req.headers['x-app-version'];

    if (clientVersion && !semver.gte(clientVersion, this.minSupportedVersion)) {
      throw new UnsupportedVersionException(this.recommendedVersion);
    }

    res.setHeader('x-recommend-version', this.recommendedVersion);
    next();
  }
}
