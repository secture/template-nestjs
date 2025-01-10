import { EntityRepository } from '@mikro-orm/core';
import { Webcam } from '../../domain/entities/webcam.entity';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';
import { Id } from '../../domain/value-objects/id.value-object';

export class WebcamMikroOrmRepository implements WebcamRepository {
  constructor(private readonly ormRepo: EntityRepository<Webcam>) {}

  findById(id: Id): Promise<Webcam | null> {
    return this.ormRepo.findOne({ id });
  }

  findByResort(resortId: Id): Promise<Webcam[]> {
    return this.ormRepo.find({ resort: { id: resortId } });
  }

  async save(webcam: Webcam): Promise<void> {
    await this.ormRepo.getEntityManager().persistAndFlush(webcam);
  }

  async delete(webcam: Webcam): Promise<void> {
    await this.ormRepo.getEntityManager().removeAndFlush(webcam);
  }
}
