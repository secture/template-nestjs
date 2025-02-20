import { Resort } from '../../../shared/domain/entities/resort.entity';

export interface ResortRepository {
  findById(id: string): Promise<Resort | null>;
  findAll(): Promise<Resort[]>;
  save(resort: Resort): Promise<void>;
  delete(resort: Resort): Promise<void>;
  findAllOrderedAlphabetically(): Promise<Resort[]>;
  findAllByProximity(latitude: number, longitude: number): Promise<Resort[]>;
  findBySearchTerm(search: string): Promise<Resort[]>;
  findByProximityAndSearchTerm(
    latitude: number,
    longitude: number,
    search: string,
  ): Promise<Resort[]>;
}
