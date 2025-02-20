import { News } from '../../../shared/domain/entities/news.entity';

export interface NewsRepository {
  findById(id: string): Promise<News | null>;
  findByResort(resortId: string): Promise<News[]>;
  save(news: News): Promise<void>;
  delete(news: News): Promise<void>;
}
