import { Inject } from '@nestjs/common';
import { NotFoundError } from '../../domain/error/not-found.error';
import { ResortEntityExporter } from '../../domain/exporters/resort-entity.exporter';
import { ResortRepository } from '../../domain/repositories/resort.repository';
import { createSQLiteConnection } from '../config/SQLite.config';

export class ResortSQLiteExporter implements ResortEntityExporter {
  constructor(
    @Inject('ResortRepository')
    private readonly resortRepository: ResortRepository,
  ) {}
  async export(resortId: string): Promise<string> {
    const resort = await this.resortRepository.findById(resortId);
    if (!resort) {
      throw new NotFoundError('Resort not found');
    }

    const filePath = `build/resort_${resortId}.db`;
    const db = createSQLiteConnection(filePath);

    if (!(await db.schema.hasTable('resort'))) {
      await db.schema.createTableIfNotExists('resort', (table) => {
        table.string('id').primary();
        table.string('name');
        table.string('logo');
        table.string('country');
        table.decimal('latitude');
        table.decimal('longitude');
      });
    }

    await db('resort')
      .insert({
        id: resort.id,
        name: resort.name,
        logo: resort.logo,
        country: resort.country,
        latitude: resort.location.latitude,
        longitude: resort.location.longitude,
      })
      .onConflict('id')
      .merge();

    await db.destroy();

    return filePath;
  }
}
