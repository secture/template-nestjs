import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Webcam } from '../../../shared/domain/entities/webcam.entity';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';

@Injectable()
export class WebcamMikroOrmRepository implements WebcamRepository {
  private readonly ormRepo: EntityRepository<Webcam>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(Webcam);
  }

  findById(id: string): Promise<Webcam | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: string): Promise<Webcam[]> {
    // @ts-expect-error "_resort" is used here for specific database compatibility for ordering.
    return this.ormRepo.find({ _resort: { id: resortId } });
  }

  async save(webcam: Webcam): Promise<void> {
    await this.ormRepo.upsert(webcam);
  }

  async delete(webcam: Webcam): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(webcam);
  }
}
