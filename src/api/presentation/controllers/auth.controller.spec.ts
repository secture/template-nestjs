import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshToken } from '../../../shared/domain/entities/refresh-token.entity';
import { User } from '../../../shared/domain/entities/user.entity';
import { AuthUserDto } from '../../application/auth-user/auth-user.dto';
import { AuthUserHandler } from '../../application/auth-user/auth-user.handler';
import { RefreshAccessTokenCommand } from '../../application/refresh-access-token/refresh-access-token.command';
import { RefreshAccessTokenDto } from '../../application/refresh-access-token/refresh-access-token.dto';
import { RefreshAccessTokenHandler } from '../../application/refresh-access-token/refresh-access-token.handler';
import { RevokeRefreshTokenCommand } from '../../application/revoke-refresh-token/revoke-refresh-token.command';
import { RevokeRefreshTokenHandler } from '../../application/revoke-refresh-token/revoke-refresh-token.handler';
import { RefreshTokenRequest } from '../dto/request/refresh-token.request';
import { AuthHttpResponse } from '../dto/response/auth.http-response';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authUserHandler: AuthUserHandler;
  let refreshAccessTokenHandler: RefreshAccessTokenHandler;
  let revokeRefreshTokenHandler: RevokeRefreshTokenHandler;
  let user: User;
  let refreshToken: RefreshToken;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthUserHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: RefreshAccessTokenHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: RevokeRefreshTokenHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    authUserHandler = app.get<AuthUserHandler>(AuthUserHandler);
    refreshAccessTokenHandler = app.get<RefreshAccessTokenHandler>(
      RefreshAccessTokenHandler,
    );
    revokeRefreshTokenHandler = app.get<RevokeRefreshTokenHandler>(
      RevokeRefreshTokenHandler,
    );

    user = User.create('test', 'user', 'test@example.org');
    refreshToken = RefreshToken.create(
      user,
      'refresh-token',
      new Date(),
      'test-device',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithApple', () => {
    it('should return access and refresh tokens on successful login', async () => {
      const mockRequest = {
        user: {
          id: '123',
          email: 'test@example.org',
        },
      };
      jest
        .spyOn(authUserHandler, 'handle')
        .mockResolvedValue(new AuthUserDto('access-token', refreshToken));

      const result = await controller.loginWithApple(mockRequest);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw an error if user is not provided in the request', async () => {
      const mockRequest = {
        user: null,
      };

      await expect(controller.loginWithApple(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authUserHandler.handle).not.toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access and refresh tokens on valid refresh token', async () => {
      const body: RefreshTokenRequest = { refreshToken: 'refresh-token' };
      const req = { user: { userId: user.id } };
      jest
        .spyOn(refreshAccessTokenHandler, 'handle')
        .mockResolvedValue(
          new RefreshAccessTokenDto('new-access-token', refreshToken),
        );

      const result = await controller.refreshAccessToken(body, req);

      expect(refreshAccessTokenHandler.handle).toHaveBeenCalledWith(
        new RefreshAccessTokenCommand(req.user.userId, 'refresh-token'),
      );
      expect(result).toEqual(
        new AuthHttpResponse('new-access-token', 'refresh-token'),
      );
    });
  });

  describe('logout', () => {
    it('should revoke refresh token and return no content', async () => {
      const body: RefreshTokenRequest = { refreshToken: 'refresh-token' };
      const req = { user: { userId: user.id } };

      await controller.logout(body, req);

      expect(revokeRefreshTokenHandler.handle).toHaveBeenCalledWith(
        new RevokeRefreshTokenCommand(req.user.userId, 'refresh-token'),
      );
    });
  });
});
