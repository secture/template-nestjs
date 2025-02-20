import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { GeoPoint } from '../../../shared/domain/value-objects/geo-point.value-object';
import { ExportResortHandler } from '../../application/export-resort/export-resort.handler';
import { ExportResortQuery } from '../../application/export-resort/export-resort.query';
import { GetResortsHandler } from '../../application/get-resorts/get-resorts.handler';
import { GetResortsQuery } from '../../application/get-resorts/get-resorts.query';
import { ResortWithDistance } from '../../domain/aggregate/resort-with-distance.aggregate';
import { ResortResponse } from '../dto/response/resort.response';
import { ResortController } from './resort.controller';

const mockResorts = [
  ResortWithDistance.createWithDistance(
    '1',
    'Resort A',
    'logoA.jpg',
    100,
    30,
    40,
    'Resort A description',
    new GeoPoint(42.5, -1.2),
    'España',
    1000,
  ),
  ResortWithDistance.createWithDistance(
    '2',
    'Resort B',
    'logoB.jpg',
    200,
    60,
    80,
    'Resort B description',
    new GeoPoint(48.8, 2.3),
    'España',
    2000,
  ),
];

describe('ResortController', () => {
  let controller: ResortController;
  let getResortsHandler: GetResortsHandler;
  let exportResortHandler: ExportResortHandler;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResortController],
      providers: [
        {
          provide: GetResortsHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: ExportResortHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<ResortController>(ResortController);
    getResortsHandler = app.get<GetResortsHandler>(GetResortsHandler);
    exportResortHandler = app.get<ExportResortHandler>(ExportResortHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getResorts', () => {
    it('should return a list of resorts', async () => {
      jest.spyOn(getResortsHandler, 'handle').mockResolvedValue(mockResorts);
      const query: GetResortsQuery = new GetResortsQuery(42.5, -1.0, 'Resort');

      const result = await controller.getResorts({
        latitude: 42.5,
        longitude: -1,
        search: 'Resort',
      });

      expect(getResortsHandler.handle).toHaveBeenCalledWith(query);
      expect(result).toEqual([
        new ResortResponse('1', 'Resort A', 'logoA.jpg', 'España', 1000),
        new ResortResponse('2', 'Resort B', 'logoB.jpg', 'España', 2000),
      ]);
    });
  });

  describe('exportResort', () => {
    const mockResponse = (): Partial<Response> => {
      return {
        download: jest.fn(),
      };
    };

    it('should call exporter and respond with a file download', async () => {
      const resortId = '5f905dac-b03e-4932-a53e-f20f55661c3c';
      const filepath = 'path/to/database.sql';
      const mockRes = mockResponse() as Response;

      jest.spyOn(exportResortHandler, 'handle').mockResolvedValue(filepath);

      await controller.exportResort(resortId, mockRes);

      expect(exportResortHandler.handle).toHaveBeenCalledWith(
        new ExportResortQuery(resortId),
      );
      expect(exportResortHandler.handle).toHaveBeenCalledTimes(1);
      expect(mockRes.download).toHaveBeenCalledWith(filepath);
    });
  });
});
