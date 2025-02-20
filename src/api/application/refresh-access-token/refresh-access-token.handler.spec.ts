import { AuthService } from '../../domain/auth.service';
import { RefreshToken } from '../../../shared/domain/entities/refresh-token.entity';
import { User } from '../../../shared/domain/entities/user.entity';
import { ConflictError } from '../../domain/error/conflict.error';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RefreshAccessTokenCommand } from './refresh-access-token.command';
import { RefreshAccessTokenDto } from './refresh-access-token.dto';
import { RefreshAccessTokenHandler } from './refresh-access-token.handler';

describe('RefreshAccessTokenHandler', () => {
  let handler: RefreshAccessTokenHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    refreshTokenRepository = {
      findByToken: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    authService = {
      generateJwt: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    handler = new RefreshAccessTokenHandler(
      userRepository,
      refreshTokenRepository,
      authService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a new access token if the refresh token is valid', async () => {
    const command = new RefreshAccessTokenCommand(
      'user-id',
      'valid-refresh-token',
    );
    const user = User.create('John', 'Doe', 'john.doe@example.com');
    const refreshToken = RefreshToken.create(
      user,
      'valid-refresh-token',
      new Date(Date.now() + 10000),
      'device',
    );
    const newAccessToken = 'new-access-token';

    userRepository.findById.mockResolvedValue(user);
    refreshTokenRepository.findByToken.mockResolvedValue(refreshToken);
    authService.generateJwt.mockResolvedValue(newAccessToken);

    const result = await handler.handle(command);

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'valid-refresh-token',
    );
    expect(authService.generateJwt).toHaveBeenCalledWith(user);
    expect(result).toEqual(
      new RefreshAccessTokenDto(newAccessToken, refreshToken),
    );
  });

  it('should throw UserNotFoundError if the user does not exist', async () => {
    const command = new RefreshAccessTokenCommand(
      'non-existent-user',
      'valid-refresh-token',
    );

    userRepository.findById.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-user');
    expect(refreshTokenRepository.findByToken).not.toHaveBeenCalled();
    expect(authService.generateJwt).not.toHaveBeenCalled();
  });

  it('should throw ConflictError if the refresh token is expired', async () => {
    const command = new RefreshAccessTokenCommand(
      'user-id',
      'invalid-refresh-token',
    );
    const user = User.create('Jane', 'Doe', 'jane.doe@example.com');
    const refreshToken = RefreshToken.create(
      user,
      'valid-refresh-token',
      new Date(Date.now() - 10000),
      'device',
    );

    userRepository.findById.mockResolvedValue(user);
    refreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

    await expect(handler.handle(command)).rejects.toThrow(ConflictError);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'invalid-refresh-token',
    );
    expect(authService.generateJwt).not.toHaveBeenCalled();
  });

  it('should throw ConflictError if the refresh token is revoked', async () => {
    const command = new RefreshAccessTokenCommand(
      'user-id',
      'invalid-refresh-token',
    );
    const user = User.create('Jane', 'Doe', 'jane.doe@example.com');
    const refreshToken = RefreshToken.create(
      user,
      'valid-refresh-token',
      new Date(Date.now() + 10000),
      'device',
    );
    refreshToken.revoke();

    userRepository.findById.mockResolvedValue(user);
    refreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

    await expect(handler.handle(command)).rejects.toThrow(ConflictError);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      'invalid-refresh-token',
    );
    expect(authService.generateJwt).not.toHaveBeenCalled();
  });
});
