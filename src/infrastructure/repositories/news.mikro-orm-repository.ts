import { EntityRepository } from '@mikro-orm/core';
import { News } from '../../domain/entities/news.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';
import { Id } from '../../domain/value-objects/id.value-object';

export class NewsMikroOrmRepository implements NewsRepository {
  constructor(private readonly ormRepo: EntityRepository<News>) {}

  findById(id: Id): Promise<News | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: Id): Promise<News[]> {
    return this.ormRepo.find({ resort: { id: resortId } });
  }

  async save(news: News): Promise<void> {
    await this.ormRepo.getEntityManager().persistAndFlush(news);
  }

  async delete(news: News): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(news);
  }
}
