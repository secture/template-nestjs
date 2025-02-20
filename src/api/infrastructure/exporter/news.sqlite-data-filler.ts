import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ResortDataFiller } from 'src/api/domain/exporters/resort.data-filler';
import { NewsRepository } from 'src/api/domain/repositories/news.repository';

@Injectable()
export class NewsSqliteDataFiller implements ResortDataFiller<Knex> {
  constructor(
    @Inject('NewsRepository')
    private readonly newsRepository: NewsRepository,
  ) {}
  async fill(resortId: string, context: Knex): Promise<void> {
    const newsList = await this.newsRepository.findByResort(resortId);
    if (!(await context.schema.hasTable('news'))) {
      await context.schema.createTable('news', (table) => {
        table.string('id').primary();
        table.string('title');
        table.string('description');
        table.string('url');
        table.dateTime('date');
        table.string('image');
      });
    }

    await context('news')
      .insert(
        newsList.map((news) => ({
          id: news.id,
          title: news.title,
          description: news.description,
          url: news.url,
          image: news.image,
          date: news.date,
        })),
      )
      .onConflict('id')
      .merge();
  }
}
