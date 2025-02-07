import { GetWebcamsHandler } from '../../application/get-webcams/get-webcambs.handler';
import { GetWebcamsController } from './webcam.controller';
import { Resort } from '../../domain/entities/resort.entity';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { Webcam } from '../../domain/entities/webcam.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GetWebcamsQuery } from '../../application/get-webcams/get-webcam.query';
import { WebcamResponse } from '../dto/response/webcam.response';

describe('GetWebcamsController', () => {
  let controller: GetWebcamsController;
  let getWebcamsHandler: GetWebcamsHandler;

  const mockResort = Resort.create(
    '1',
    'Alpine Resort',
    'alpine.jpg',
    50,
    20,
    30,
    'Beautiful Alpine Resort',
    new GeoPoint(40.7128, -74.006),
    'España',
  );

  const mockWebcams = [
    Webcam.create(
      'webcam-1',
      'Webcam 1',
      'https://example.com/webcam1.jpg',
      mockResort,
      new Date(),
    ),
    Webcam.create(
      'webcam-2',
      'Webcam 2',
      'https://example.com/webcam2.jpg',
      mockResort,
      new Date(),
    ),
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetWebcamsController],
      providers: [
        {
          provide: GetWebcamsHandler,
          useValue: {
            handler: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<GetWebcamsController>(GetWebcamsController);
    getWebcamsHandler = app.get<GetWebcamsHandler>(GetWebcamsHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GetWebcams', () => {
    it('should return webcams for a given resort', async () => {
      jest.spyOn(getWebcamsHandler, 'handler').mockResolvedValue(mockWebcams);
      const query: GetWebcamsQuery = new GetWebcamsQuery(mockResort.id);
      const result = await controller.getWebcams(mockResort.id);

      expect(getWebcamsHandler.handler).toHaveBeenCalledWith(query);
      expect(result).toEqual(
        mockWebcams.map((webcam) => WebcamResponse.createFromWebcam(webcam)),
      );
    });
  });
});
