import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { News } from '../../domain/entities/news.entity';
import { NewsRepository } from '../../domain/repositories/news.repository';

@Injectable()
export class NewsMikroOrmRepository implements NewsRepository {
  private readonly ormRepo: EntityRepository<News>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(News);
  }
  findById(id: string): Promise<News | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: string): Promise<News[]> {
    // @ts-expect-error "_resort" is used here for specific database compatibility.
    return this.ormRepo.find({ _resort: { _id: resortId } });
  }

  async save(news: News): Promise<void> {
    await this.ormRepo.upsert(news);
  }

  async delete(news: News): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(news);
  }
}
