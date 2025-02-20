import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportResortHandler } from '../../application/export-resort/export-resort.handler';
import { ExportResortQuery } from '../../application/export-resort/export-resort.query';
import { GetResortsHandler } from '../../application/get-resorts/get-resorts.handler';
import { GetResortsQuery } from '../../application/get-resorts/get-resorts.query';
import { GetResortsRequest } from '../dto/request/get-resorts.request';
import { ResortResponse } from '../dto/response/resort.response';

@ApiTags('Resorts')
@Controller('resorts')
@UseGuards(AuthGuard('jwt'))
export class ResortController {
  constructor(
    private readonly getResortsHandler: GetResortsHandler,
    private readonly exportResortHandler: ExportResortHandler,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    example: 40.7128,
    description: 'User latitude',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    example: -0.7128,
    description: 'User longitude',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'baq',
    description: 'Search term',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns resorts near the given coordinates',
    type: ResortResponse,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getResorts(
    @Query() query: GetResortsRequest,
  ): Promise<ResortResponse[]> {
    const getResortsQuery = new GetResortsQuery(
      query.latitude,
      query.longitude,
      query.search,
    );

    const result = await this.getResortsHandler.handle(getResortsQuery);

    return result.map((resort) => ResortResponse.createFromResort(resort));
  }

  @Get(':resortId/export')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Exports the resort information as a downloadable file',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resort not found' })
  async exportResort(@Param('resortId') id: string, @Res() response: Response) {
    const query = new ExportResortQuery(id);

    const filepath = await this.exportResortHandler.handle(query);

    response.download(filepath);
  }
}
