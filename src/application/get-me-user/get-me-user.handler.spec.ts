import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { GetMeHandler } from './get-me-user.handler';
import { GetMeQuery } from './get-me-user.query';

describe('GetMeHandler', () => {
  let handler: GetMeHandler;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = new User(
    '123',
    new Date(),
    new Date(),
    'Test',
    'User',
    'test@example.com',
  );

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    handler = new GetMeHandler(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user authenticated with ID', async () => {
    userRepository.findById.mockResolvedValue(mockUser);

    const query = new GetMeQuery(mockUser.id);

    const result = await handler.handler(query);

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalled();
  });
});
