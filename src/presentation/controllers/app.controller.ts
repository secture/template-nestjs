import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAppVersionsHandler } from '../../application/get-app-versions/get-app-versions.handler';
import { AppVersionsHttpDto } from '../dto/app-versions-http.dto';

@ApiTags('Élevé')
@Controller()
export class AppController {
  constructor(private readonly getAppVersionsHandler: GetAppVersionsHandler) {}
  @Get()
  @ApiResponse({ status: 200, description: 'Says "Hello World!".' })
  getHello(): string {
    return 'Hello World!';
  }

  @ApiResponse({
    status: 200,
    description: 'Returns the supported and recommended app versions',
    type: AppVersionsHttpDto,
  })
  @Get('app-versions')
  getAppVersions(): AppVersionsHttpDto {
    return AppVersionsHttpDto.fromApplicationDto(
      this.getAppVersionsHandler.handle(),
    );
  }
}
