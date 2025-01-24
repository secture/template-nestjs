import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '../../domain/error/conflict.error';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RevokeRefreshTokenCommand } from './revoke-refresh-token.command';

@Injectable()
export class RevokeRefreshTokenHandler {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}
  async handle(command: RevokeRefreshTokenCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const refreshToken = await this.refreshTokenRepository.findByToken(
      command.refreshToken,
    );

    if (!refreshToken || refreshToken.userId !== user.id) {
      throw new ConflictError('Invalid or expired refresh token');
    }

    refreshToken.revoke();
    await this.refreshTokenRepository.save(refreshToken);
  }
}
