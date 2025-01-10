import { EntityRepository } from '@mikro-orm/core';
import { Resort } from '../../domain/entities/resort.entity';
import { ResortRepository } from '../../domain/repositories/resort.repository';
import { Id } from '../../domain/value-objects/id.value-object';

export class ResortMikroOrmRepository implements ResortRepository {
  constructor(private readonly ormRepo: EntityRepository<Resort>) {}

  findById(id: Id): Promise<Resort | null> {
    return this.ormRepo.findOne({ id });
  }

  findAll(): Promise<Resort[]> {
    return this.ormRepo.findAll();
  }

  async save(resort: Resort): Promise<void> {
    await this.ormRepo.getEntityManager().persistAndFlush(resort);
  }

  async delete(resort: Resort): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(resort);
  }
}
