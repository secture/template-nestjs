import { Resort } from '../entities/resort.entity';
import { Id } from '../value-objects/id.value-object';

export interface ResortRepository {
  findById(id: Id): Promise<Resort | null>;
  findAll(): Promise<Resort[]>;
  save(resort: Resort): Promise<void>;
  delete(resort: Resort): Promise<void>;
}
