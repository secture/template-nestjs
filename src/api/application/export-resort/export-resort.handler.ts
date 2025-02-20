import { Inject, Injectable } from '@nestjs/common';
import { ResortExporter } from '../../domain/exporters/resort.exporter';
import { ExportResortQuery } from './export-resort.query';

@Injectable()
export class ExportResortHandler {
  constructor(
    @Inject('ResortExporter')
    private readonly exporter: ResortExporter,
  ) {}
  async handle(query: ExportResortQuery) {
    return this.exporter.export(query.resortId);
  }
}
