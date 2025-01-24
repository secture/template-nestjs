import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { User } from '../../domain/entities/user.entity';
import { ConflictError } from '../../domain/error/conflict.error';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RevokeRefreshTokenCommand } from './revoke-refresh-token.command';
import { RevokeRefreshTokenHandler } from './revoke-refresh-token.handler';

describe('RevokeRefreshTokenHandler', () => {
  let handler: RevokeRefreshTokenHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    refreshTokenRepository = {
      findByToken: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    handler = new RevokeRefreshTokenHandler(
      userRepository,
      refreshTokenRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should revoke a valid refresh token', async () => {
    const command = new RevokeRefreshTokenCommand('user-id', 'valid-token');
    const user = User.create('Jane', 'Doe', 'jane.doe@example.com');
    const refreshToken = RefreshToken.create(
      user,
      'valid-refresh-token',
      new Date(Date.now() + 10000),
      'device',
    );

    userRepository.findById.mockResolvedValue(user);
    refreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

    await handler.handle(command);

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'valid-token',
    );
    expect(refreshToken.revoke).toBeTruthy();
    expect(refreshTokenRepository.save).toHaveBeenCalledWith(refreshToken);
  });

  it('should throw UserNotFoundError if the user does not exist', async () => {
    const command = new RevokeRefreshTokenCommand(
      'non-existent-user',
      'valid-token',
    );
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-user');
    expect(refreshTokenRepository.findByToken).not.toHaveBeenCalled();
  });

  it('should throw ConflictError if the refresh token is invalid or does not belong to the user', async () => {
    const command = new RevokeRefreshTokenCommand('user-id', 'invalid-token');
    const user = User.create('Jane', 'Doe', 'jane.doe@example.com');
    const otherUser = User.create('Jane', 'Doe', 'jane.doe@example.com');
    const invalidRefreshToken = RefreshToken.create(
      otherUser,
      'invalid-refresh-token',
      new Date(Date.now() + 10000),
      'device',
    );

    userRepository.findById.mockResolvedValue(user);
    refreshTokenRepository.findByToken.mockResolvedValue(invalidRefreshToken);

    await expect(handler.handle(command)).rejects.toThrow(ConflictError);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'invalid-token',
    );
    expect(refreshTokenRepository.save).not.toHaveBeenCalled();
  });
});
