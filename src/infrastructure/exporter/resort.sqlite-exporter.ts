import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { NotFoundError } from '../../domain/error/not-found.error';
import { ResortDataFiller } from '../../domain/exporters/resort.data-filler';
import { ResortExporter } from '../../domain/exporters/resort.exporter';
import { ResortRepository } from '../../domain/repositories/resort.repository';
import { createSQLiteConnection } from '../config/SQLite.config';

@Injectable()
export class ResortSQLiteExporter implements ResortExporter {
  constructor(
    @Inject('ResortRepository')
    private readonly resortRepository: ResortRepository,
    @Inject('RESORT_FILLERS')
    private readonly exporters: ResortDataFiller<Knex>[],
  ) {}
  async export(resortId: string): Promise<string> {
    const resort = await this.resortRepository.findById(resortId);
    if (!resort) {
      throw new NotFoundError('Resort not found');
    }

    const filePath = `build/resort_${resortId}.db`;
    const db = createSQLiteConnection(filePath);
    db.initialize();

    if (!(await db.schema.hasTable('resort'))) {
      await db.schema.createTable('resort', (table) => {
        table.string('id').primary();
        table.string('name');
        table.string('logo');
        table.string('country');
        table.string('location');
        table.string('contacts');
        table.string('description');
      });
    }

    await db('resort')
      .insert({
        id: resort.id,
        name: resort.name,
        logo: resort.logo,
        country: resort.country,
        location: resort.location.toJSON(),
        contacts: resort.contacts.toJSON(),
        description: resort.description,
      })
      .onConflict('id')
      .merge();

    for (const exporter of this.exporters) {
      await exporter.fill(resortId, db);
    }

    await db.destroy();

    return filePath;
  }
}
