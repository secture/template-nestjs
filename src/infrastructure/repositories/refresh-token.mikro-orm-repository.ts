import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class RefreshTokenMikroOrmRepository implements RefreshTokenRepository {
  private readonly ormRepo: EntityRepository<RefreshToken>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(RefreshToken);
  }

  findByToken(token: string): Promise<RefreshToken | null> {
    return this.ormRepo.findOne({ token });
  }
  async save(refreshToken: RefreshToken): Promise<void> {
    await this.ormRepo.upsert(refreshToken);
  }
}
