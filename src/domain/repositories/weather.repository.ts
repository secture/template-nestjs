import { Weather } from '../entities/weather.entity';
import { Id } from '../value-objects/id.value-object';

export interface WeatherRepository {
  findById(id: Id): Promise<Weather | null>;
  findByResort(resortId: Id): Promise<Weather[]>;
  save(weather: Weather): Promise<void>;
  delete(weather: Weather): Promise<void>;
}
