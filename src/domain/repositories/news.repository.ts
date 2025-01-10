import { News } from '../entities/news.entity';
import { Id } from '../value-objects/id.value-object';

export interface NewsRepository {
  findById(id: Id): Promise<News | null>;
  findByResort(resortId: Id): Promise<News[]>;
  save(news: News): Promise<void>;
  delete(news: News): Promise<void>;
}
