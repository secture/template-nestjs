import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ResortDataFiller } from '../../domain/exporters/resort.data-filler';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';

@Injectable()
export class WebcamSqliteDataFiller implements ResortDataFiller<Knex> {
  constructor(
    @Inject('WebcamRepository')
    private readonly webcamRepository: WebcamRepository,
  ) {}
  async fill(resortId: string, context: Knex): Promise<void> {
    const webcams = await this.webcamRepository.findByResort(resortId);
    if (!(await context.schema.hasTable('webcam'))) {
      await context.schema.createTable('webcam', (table) => {
        table.string('id').primary();
        table.string('name');
        table.string('url');
        table.string('lastUpdated');
      });
    }

    await context('webcam')
      .insert(
        webcams.map((webcam) => ({
          id: webcam.id,
          name: webcam.name,
          url: webcam.url,
          lastUpdated: webcam.lastUpdated,
        })),
      )
      .onConflict('id')
      .merge();
  }
}
