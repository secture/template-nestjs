import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UserMikroOrmRepository implements UserRepository {
  private readonly ormRepo: EntityRepository<User>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(User);
  }

  async save(user: User): Promise<void> {
    await this.ormRepo.upsert(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepo.findOne({ email: email });
  }
  async findById(userId: string): Promise<User | null> {
    return this.ormRepo.findOne({ id: userId });
  }
}
