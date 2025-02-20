import { Resort } from '../../../shared/domain/entities/resort.entity';
import { Webcam } from '../../../shared/domain/entities/webcam.entity';
import { GeoPoint } from '../../../shared/domain/value-objects/geo-point.value-object';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';
import { GetWebcamsQuery } from './get-webcam.query';
import { GetWebcamsHandler } from './get-webcambs.handler';

describe('GetWebcamsHandler', () => {
  let handler: GetWebcamsHandler;
  let webcamRepository: jest.Mocked<WebcamRepository>;

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

  beforeEach(() => {
    webcamRepository = {
      findByResort: jest.fn(),
    } as unknown as jest.Mocked<WebcamRepository>;

    handler = new GetWebcamsHandler(webcamRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return webcams for a given resort', async () => {
    webcamRepository.findByResort.mockResolvedValue(mockWebcams);

    const query = new GetWebcamsQuery(mockResort.id);

    const result = await handler.handler(query);

    expect(result).toEqual(mockWebcams);
    expect(webcamRepository.findByResort).toHaveBeenCalled();
  });
});
