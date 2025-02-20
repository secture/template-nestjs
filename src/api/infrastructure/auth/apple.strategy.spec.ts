import { AppleStrategy } from './apple.strategy';

describe('AppleStrategy', () => {
  let appleStrategy: AppleStrategy;
  const mockJwtService = {
    decode: jest.fn(),
  };
  const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };
  const mockLogService = {
    debug: jest.fn(),
    error: jest.fn(),
  };
  const configService = {
    get: jest.fn().mockReturnValue('test'),
  };

  const decodedIdToken = {
    email: 'johndoe@example.org',
    sub: 'apple-id',
  };

  const mockUser = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.org',
    appleId: 'apple-id',
  };

  beforeEach(() => {
    appleStrategy = new AppleStrategy(
      mockJwtService as any,
      mockLogService as any,
      mockUserRepository as any,
      configService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate and return a user when token is valid', async () => {
    const req = {
      body: {
        id_token: 'valid-id-token',
        user: JSON.stringify({
          name: {
            firstName: 'John',
            lastName: 'Doe',
          },
        }),
      },
    };

    mockJwtService.decode.mockReturnValue(decodedIdToken);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const done = jest.fn();

    await appleStrategy.validate(
      req,
      'access-token',
      'refresh-token',
      {},
      done,
    );

    expect(mockJwtService.decode).toHaveBeenCalledWith('valid-id-token');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'johndoe@example.org',
    );
    expect(done).toHaveBeenCalledWith(null, mockUser);
  });

  it('should call done with an error when token decoding fails', async () => {
    const req = {
      body: {
        id_token: 'invalid-id-token',
        user: JSON.stringify({
          name: {
            firstName: 'Jane',
            lastName: 'Smith',
          },
        }),
      },
    };

    mockJwtService.decode.mockReturnValue(null);

    const done = jest.fn();

    await appleStrategy.validate(
      req,
      'access-token',
      'refresh-token',
      {},
      done,
    );

    expect(mockJwtService.decode).toHaveBeenCalledWith('invalid-id-token');
    expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
  });

  it('should handle a case where user is missing', async () => {
    const req = {
      body: {
        id_token: 'valid-id-token',
      },
    };

    const decodedIdToken = {
      email: 'unknown@example.org',
      sub: 'user-sub-id',
    };

    mockJwtService.decode.mockReturnValue(decodedIdToken);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const done = jest.fn();

    await appleStrategy.validate(
      req,
      'access-token',
      'refresh-token',
      {},
      done,
    );

    expect(mockJwtService.decode).toHaveBeenCalledWith('valid-id-token');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'unknown@example.org',
    );
    expect(done).toHaveBeenCalledWith(null, mockUser);
  });
});
