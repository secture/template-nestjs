import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Resort } from '../../domain/entities/resort.entity';
import { ResortRepository } from '../../domain/repositories/resort.repository';

export class ResortMikroOrmRepository implements ResortRepository {
  private readonly ormRepo: EntityRepository<Resort>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(Resort);
  }

  findById(id: string): Promise<Resort | null> {
    return this.ormRepo.findOne({ id });
  }

  findAll(): Promise<Resort[]> {
    return this.ormRepo.findAll();
  }

  async save(resort: Resort): Promise<void> {
    await this.ormRepo.upsert(resort);
  }

  async delete(resort: Resort): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(resort);
  }
}
