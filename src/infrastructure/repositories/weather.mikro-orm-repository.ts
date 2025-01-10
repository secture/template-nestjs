import { EntityRepository } from '@mikro-orm/core';
import { Weather } from '../../domain/entities/weather.entity';
import { WeatherRepository } from '../../domain/repositories/weather.repository';
import { Id } from '../../domain/value-objects/id.value-object';

export class WeatherMikroOrmRepository implements WeatherRepository {
  constructor(private readonly ormRepo: EntityRepository<Weather>) {}

  findById(id: Id): Promise<Weather | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: Id): Promise<Weather[]> {
    return this.ormRepo.find({ resort: { id: resortId } });
  }

  async save(weather: Weather): Promise<void> {
    await this.ormRepo.getEntityManager().persistAndFlush(weather);
  }

  async delete(weather: Weather): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(weather);
  }
}
