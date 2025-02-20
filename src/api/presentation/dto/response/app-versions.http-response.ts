import { ApiProperty } from '@nestjs/swagger';
import { AppVersionsDto } from '../../../application/get-app-versions/app-versions.dto';

export class AppVersionsHttpResponse {
  @ApiProperty({
    description: 'Supported app version',
    example: '1.0.0',
  })
  readonly supportedVersion: string;

  @ApiProperty({
    description: 'Recommended app version',
    example: '1.2.3',
  })
  readonly recommendedVersion: string;

  private constructor(supportedVersion: string, recommendedVersion: string) {
    this.supportedVersion = supportedVersion;
    this.recommendedVersion = recommendedVersion;
  }

  static fromApplicationDto(
    appVersionPort: AppVersionsDto,
  ): AppVersionsHttpResponse {
    return new AppVersionsHttpResponse(
      appVersionPort.supportedVersion,
      appVersionPort.recommendedVersion,
    );
  }
}
