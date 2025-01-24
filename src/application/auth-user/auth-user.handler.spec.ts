import { AuthService } from '../../domain/auth.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthUserCommand } from './auth-user.command';
import { AuthUserDto } from './auth-user.dto';
import { AuthUserHandler } from './auth-user.handler';

describe('AuthUserHandler (without NestJS)', () => {
  let handler: AuthUserHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    authService = {
      generateJwt: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    handler = new AuthUserHandler(userRepository, authService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return AuthUserDto with accessToken and refreshToken', async () => {
    const command = new AuthUserCommand('test-user-id');
    const user = User.create('test', 'user', 'test@example.org');
    const refreshToken = RefreshToken.create(
      user,
      'refresh-token',
      new Date(),
      'test-device',
    );
    const accessToken = 'test-access-token';

    userRepository.findById.mockResolvedValue(user);
    authService.generateJwt.mockResolvedValue(accessToken);
    authService.generateRefreshToken.mockResolvedValue(refreshToken);

    const result = await handler.handle(command);

    expect(userRepository.findById).toHaveBeenCalledWith('test-user-id');
    expect(authService.generateJwt).toHaveBeenCalledWith(user);
    expect(authService.generateRefreshToken).toHaveBeenCalledWith(
      user,
      'default_device',
    );
    expect(result).toEqual(new AuthUserDto(accessToken, refreshToken));
  });

  it('should throw UserNotFoundError if user is not found', async () => {
    const command = new AuthUserCommand('non-existent-user-id');
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.findById).toHaveBeenCalledWith(
      'non-existent-user-id',
    );
    expect(authService.generateJwt).not.toHaveBeenCalled();
    expect(authService.generateRefreshToken).not.toHaveBeenCalled();
  });
});
