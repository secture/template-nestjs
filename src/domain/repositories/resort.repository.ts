import { Resort } from '../entities/resort.entity';

export interface ResortRepository {
  findById(id: string): Promise<Resort | null>;
  findAll(): Promise<Resort[]>;
  save(resort: Resort): Promise<void>;
  delete(resort: Resort): Promise<void>;
}
