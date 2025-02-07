import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetWebcamsHandler } from '../../application/get-webcams/get-webcambs.handler';
import { WebcamResponse } from '../dto/response/webcam.response';
import { Webcam } from '../../domain/entities/webcam.entity';
import { GetWebcamsQuery } from '../../application/get-webcams/get-webcam.query';

@ApiTags('Webcams')
@Controller('resorts')
@UseGuards(AuthGuard('jwt'))
export class GetWebcamsController {
  constructor(private readonly getWebcamsHandler: GetWebcamsHandler) {}

  @Get(':resortId/webcams')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns the registered webcams of a specific resort',
    type: [WebcamResponse],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWebcams(
    @Param('resortId') resortId: string,
  ): Promise<WebcamResponse[]> {
    const getWebcamsQuery = new GetWebcamsQuery(resortId);

    const webcams: Webcam[] =
      await this.getWebcamsHandler.handler(getWebcamsQuery);
    return webcams.map((webcam) => WebcamResponse.createFromWebcam(webcam));
  }
}
