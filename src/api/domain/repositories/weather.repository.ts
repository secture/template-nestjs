import { Weather } from '../../../shared/domain/entities/weather.entity';

export interface WeatherRepository {
  findById(id: string): Promise<Weather | null>;
  findByResort(resortId: string): Promise<Weather[]>;
  save(weather: Weather): Promise<void>;
  delete(weather: Weather): Promise<void>;
}
