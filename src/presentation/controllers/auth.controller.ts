import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserCommand } from '../../application/auth-user/auth-user.command';
import { AuthUserHandler } from '../../application/auth-user/auth-user.handler';
import { RefreshAccessTokenCommand } from '../../application/refresh-access-token/refresh-access-token.command';
import { RefreshAccessTokenHandler } from '../../application/refresh-access-token/refresh-access-token.handler';
import { RevokeRefreshTokenCommand } from '../../application/revoke-refresh-token/revoke-refresh-token.command';
import { RevokeRefreshTokenHandler } from '../../application/revoke-refresh-token/revoke-refresh-token.handler';
import { AuthHttpResponse } from '../dto/response/auth.http-response';
import { RefreshTokenRequest } from '../dto/resuest/refresh-token.request';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUserHandler: AuthUserHandler,
    private readonly refreshAccessTokenHandler: RefreshAccessTokenHandler,
    private readonly revokeRefreshTokenHandler: RevokeRefreshTokenHandler,
  ) {}

  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh tokens after successful login',
    type: AuthHttpResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async loginWithApple(@Req() req: any) {
    const user = req.user;

    if (!req.user) {
      throw new UnauthorizedException();
    }

    const auth = await this.authUserHandler.handle(
      new AuthUserCommand(user.id),
    );

    return new AuthHttpResponse(auth.accessToken, auth.refreshToken.token);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: RefreshTokenRequest })
  @ApiResponse({
    status: 201,
    description:
      'Returns a new access token if the refresh token is valid and refresh token',
    type: AuthHttpResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshAccessToken(@Body() body: RefreshTokenRequest, @Req() req: any) {
    const user = req.user;
    const refreshToken = body.refreshToken;

    const response = await this.refreshAccessTokenHandler.handle(
      new RefreshAccessTokenCommand(user.userId, refreshToken),
    );

    return new AuthHttpResponse(
      response.accessToken,
      response.refreshToken.token,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiBody({ type: RefreshTokenRequest })
  async logout(@Body() body: RefreshTokenRequest, @Req() req: any) {
    const user = req.user;
    const refreshToken = body.refreshToken;

    await this.revokeRefreshTokenHandler.handle(
      new RevokeRefreshTokenCommand(user.userId, refreshToken),
    );
  }
}
