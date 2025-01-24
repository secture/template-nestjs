import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  save(refreshToken: RefreshToken): Promise<void>;
}
