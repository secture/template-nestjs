import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../domain/auth.service';
import { ConflictError } from '../../domain/error/conflict.error';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RefreshAccessTokenCommand } from './refresh-access-token.command';
import { RefreshAccessTokenDto } from './refresh-access-token.dto';

@Injectable()
export class RefreshAccessTokenHandler {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authService: AuthService,
  ) {}
  async handle(
    command: RefreshAccessTokenCommand,
  ): Promise<RefreshAccessTokenDto> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const refreshToken = await this.refreshTokenRepository.findByToken(
      command.refreshToken,
    );

    if (
      !refreshToken ||
      refreshToken.isRevoked ||
      refreshToken.expiresAt < new Date() ||
      refreshToken.userId !== user.id
    ) {
      throw new ConflictError('Invalid or expired refresh token');
    }

    const accessToken = await this.authService.generateJwt(user);

    return new RefreshAccessTokenDto(accessToken, refreshToken);
  }
}
