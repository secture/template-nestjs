import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Webcam } from '../../domain/entities/webcam.entity';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';

export class WebcamMikroOrmRepository implements WebcamRepository {
  private readonly ormRepo: EntityRepository<Webcam>;
  constructor(em: EntityManager) {
    this.ormRepo = em.getRepository(Webcam);
  }

  findById(id: string): Promise<Webcam | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: string): Promise<Webcam[]> {
    return this.ormRepo.find({ resort: { id: resortId } });
  }

  async save(webcam: Webcam): Promise<void> {
    await this.ormRepo.upsert(webcam);
  }

  async delete(webcam: Webcam): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(webcam);
  }
}
