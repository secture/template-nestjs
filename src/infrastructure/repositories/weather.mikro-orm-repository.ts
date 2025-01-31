import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Weather } from '../../domain/entities/weather.entity';
import { WeatherRepository } from '../../domain/repositories/weather.repository';

export class WeatherMikroOrmRepository implements WeatherRepository {
  private readonly ormRepo: EntityRepository<Weather>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(Weather);
  }

  findById(id: string): Promise<Weather | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: string): Promise<Weather[]> {
    return this.ormRepo.find({ resort: { id: resortId } });
  }

  async save(weather: Weather): Promise<void> {
    await this.ormRepo.upsert(weather);
  }

  async delete(weather: Weather): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(weather);
  }
}
