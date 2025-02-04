import { Inject, Injectable } from '@nestjs/common';
import { ResortEntityExporter } from '../../domain/exporters/resort-entity.exporter';
import { ExportResortQuery } from './export-resort.query';

@Injectable()
export class ExportResortHandler {
  constructor(
    @Inject('ResortExporter')
    private readonly exporter: ResortEntityExporter,
  ) {}
  async handle(query: ExportResortQuery) {
    return this.exporter.export(query.resortId);
  }
}
