import { RefreshToken } from '../../../shared/domain/entities/refresh-token.entity';

export class AuthUserDto {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: RefreshToken,
  ) {}
}
