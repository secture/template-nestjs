import { RefreshToken } from '../../domain/entities/refresh-token.entity';

export class RefreshAccessTokenDto {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: RefreshToken,
  ) {}
}
