import { Resort } from '../../domain/entities/resort.entity';
import { InvalidError } from '../../domain/error/invalid.error';
import { ResortRepository } from '../../domain/repositories/resort.repository';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { GetResortsHandler } from './get-resorts.handler';
import { GetResortsQuery } from './get-resorts.query';

const mockResorts = [
  Resort.create(
    '1',
    'Alpine Resort',
    'alpine.jpg',
    50,
    20,
    30,
    'Beautiful Alpine Resort',
    new GeoPoint(40.7128, -74.006),
    'España',
  ),
  Resort.create(
    '2',
    'Boreal Resort',
    'boreal.jpg',
    80,
    40,
    50,
    'Boreal skiing fun',
    new GeoPoint(34.0522, -118.2437),
    'España',
  ),
  Resort.create(
    '3',
    'Cascade Resort',
    'cascade.jpg',
    90,
    60,
    70,
    'Cascade mountains resort',
    new GeoPoint(37.7749, -122.4194),
    'España',
  ),
];

describe('GetResortsHandler', () => {
  let handler: GetResortsHandler;
  let resortRepository: jest.Mocked<ResortRepository>;

  beforeEach(() => {
    resortRepository = {
      findAllOrderedAlphabetically: jest.fn(),
      findAllByProximity: jest.fn(),
      findBySearchTerm: jest.fn(),
      findByProximityAndSearchTerm: jest.fn(),
    } as unknown as jest.Mocked<ResortRepository>;

    handler = new GetResortsHandler(resortRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return resorts when no parameters are provided', async () => {
    resortRepository.findAllOrderedAlphabetically.mockResolvedValue(
      mockResorts,
    );
    const query = new GetResortsQuery();

    const result = await handler.handle(query);

    expect(result).toEqual(mockResorts);
    expect(resortRepository.findAllOrderedAlphabetically).toHaveBeenCalled();
  });

  it('should return resorts ordered by proximity when coordinates are provided', async () => {
    resortRepository.findAllByProximity.mockResolvedValue(mockResorts);
    const query = new GetResortsQuery(40.0, -75.0);

    const result = await handler.handle(query);

    expect(result).toEqual(mockResorts);
    expect(resortRepository.findAllByProximity).toHaveBeenCalledWith(
      40.0,
      -75.0,
    );
  });

  it('should return resorts filtered by search term', async () => {
    resortRepository.findBySearchTerm.mockResolvedValue([mockResorts[1]]);
    const query = new GetResortsQuery(undefined, undefined, 'Boreal');

    const result = await handler.handle(query);

    expect(result).toEqual([mockResorts[1]]);
    expect(resortRepository.findBySearchTerm).toHaveBeenCalledWith('Boreal');
  });

  it('should return resorts filtered by search term and ordered by proximity when both are provided', async () => {
    resortRepository.findByProximityAndSearchTerm.mockResolvedValue(
      mockResorts,
    );
    const query = new GetResortsQuery(40.0, -75.0, 'Resort');

    const result = await handler.handle(query);

    expect(result).toEqual(mockResorts);
    expect(resortRepository.findByProximityAndSearchTerm).toHaveBeenCalledWith(
      40.0,
      -75.0,
      'Resort',
    );
  });

  it('should throw an error if only latitude is provided', async () => {
    const query = new GetResortsQuery(40.0);

    await expect(handler.handle(query)).rejects.toThrow(InvalidError);
    expect(
      resortRepository.findAllOrderedAlphabetically,
    ).not.toHaveBeenCalled();
    expect(resortRepository.findAllByProximity).not.toHaveBeenCalled();
    expect(resortRepository.findBySearchTerm).not.toHaveBeenCalled();
    expect(
      resortRepository.findByProximityAndSearchTerm,
    ).not.toHaveBeenCalled();
  });

  it('should throw an error if only longitude is provided', async () => {
    const query = new GetResortsQuery(undefined, -75.0);

    await expect(handler.handle(query)).rejects.toThrow(InvalidError);
    expect(
      resortRepository.findAllOrderedAlphabetically,
    ).not.toHaveBeenCalled();
    expect(resortRepository.findAllByProximity).not.toHaveBeenCalled();
    expect(resortRepository.findBySearchTerm).not.toHaveBeenCalled();
    expect(
      resortRepository.findByProximityAndSearchTerm,
    ).not.toHaveBeenCalled();
  });
});
