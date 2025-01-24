import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(
    user: User,
    deviceInfo: string,
  ): Promise<RefreshToken> {
    const refreshToken = RefreshToken.create(
      user!,
      this.jwtService.sign(
        { sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_TTL,
        },
      ),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo,
    );

    await this.refreshTokenRepository.save(refreshToken);

    return refreshToken;
  }
}
