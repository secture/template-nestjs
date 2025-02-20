import { RefreshToken } from '../../../shared/domain/entities/refresh-token.entity';

export class RefreshAccessTokenDto {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: RefreshToken,
  ) {}
}
