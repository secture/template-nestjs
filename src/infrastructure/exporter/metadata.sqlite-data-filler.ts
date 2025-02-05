import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ResortDataFiller } from '../../domain/exporters/resort.data-filler';

@Injectable()
export class MetadataSqliteDataFiller implements ResortDataFiller<Knex> {
  async fill(resortId: string, db: Knex): Promise<void> {
    if (!(await db.schema.hasTable('metadata'))) {
      await db.schema.createTable('metadata', (table) => {
        table.string('key').primary();
        table.string('value');
      });
    }

    const now = new Date().toISOString();
    await db('metadata')
      .insert([
        { key: 'exportCreatedAt', value: now },
        { key: 'resortId', value: resortId },
        { key: 'appVersion', value: '1.0.0' },
      ])
      .onConflict('key')
      .merge();
  }
}
