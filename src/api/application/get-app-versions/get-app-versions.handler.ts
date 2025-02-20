import { AppVersionsDto } from './app-versions.dto';

export class GetAppVersionsHandler {
  constructor(
    private readonly minSupportedVersion: string,
    private readonly recommendedVersion: string,
  ) {}

  handle(): AppVersionsDto {
    return {
      supportedVersion: this.minSupportedVersion,
      recommendedVersion: this.recommendedVersion,
    };
  }
}
