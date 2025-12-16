import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAppVersionsHandler } from '../../application/get-app-versions/get-app-versions.handler';
import { AppVersionsHttpResponse } from '../dto/response/app-versions.http-response';

@ApiTags('Project')
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
    type: AppVersionsHttpResponse,
  })
  @Get('app-versions')
  getAppVersions(): AppVersionsHttpResponse {
    return AppVersionsHttpResponse.fromApplicationDto(
      this.getAppVersionsHandler.handle(),
    );
  }
}
