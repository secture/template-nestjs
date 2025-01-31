import { EntityManager, EntityRepository, raw } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ResortWithDistance } from '../../domain/aggregate/resort-with-distance.aggregate';
import { Resort } from '../../domain/entities/resort.entity';
import { ResortRepository } from '../../domain/repositories/resort.repository';

@Injectable()
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

  findAllOrderedAlphabetically(): Promise<Resort[]> {
    // @ts-expect-error "_name" is used here for specific database compatibility for ordering.
    return this.ormRepo.findAll({ orderBy: { _name: 'asc' } });
  }
  async findAllByProximity(
    latitude: number,
    longitude: number,
  ): Promise<ResortWithDistance[]> {
    const queryBuilder = this.ormRepo.createQueryBuilder('r');

    queryBuilder
      .select(['r.*'])
      .addSelect(
        raw(
          `ST_Distance(r.location, ST_SetSRID(ST_Point(?, ?), 4326)) AS distance`,
          [latitude, longitude],
        ),
      );

    const result = await queryBuilder.getKnexQuery().orderBy('distance', 'asc');

    return result.map((item: any) => {
      return new ResortWithDistance(
        item.id,
        item.createdAt,
        item.updatedAt,
        item.name,
        item.logo,
        item.images,
        item.technicalData,
        item.description,
        item.contacts,
        item.services,
        item.location,
        item.country,
        item.distance,
      );
    });
  }
  findBySearchTerm(search: string): Promise<Resort[]> {
    return this.ormRepo.find(
      { name: { $ilike: `%${search}%` } },
      // @ts-expect-error "_name" is used here for specific database compatibility for ordering.
      { orderBy: { _name: 'asc' } },
    );
  }
  async findByProximityAndSearchTerm(
    latitude: number,
    longitude: number,
    search: string,
  ): Promise<ResortWithDistance[]> {
    const queryBuilder = this.ormRepo.createQueryBuilder('r');

    queryBuilder
      .select(['r.*'])
      .addSelect(
        raw(
          `ST_Distance(r.location, ST_SetSRID(ST_Point(?, ?), 4326)) AS distance`,
          [latitude, longitude],
        ),
      )
      .andWhere({ name: { $ilike: `%${search}%` } });

    const result = await queryBuilder.getKnexQuery().orderBy('distance', 'asc');

    return result.map((item: any) => {
      return new ResortWithDistance(
        item.id,
        item.createdAt,
        item.updatedAt,
        item.name,
        item.logo,
        item.images,
        item.technicalData,
        item.description,
        item.contacts,
        item.services,
        item.location,
        item.country,
        item.distance,
      );
    });
  }
}
