import { ClassProvider } from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { ResortEntityExporter } from './domain/exporters/resort-entity.exporter';
import { ResortSQLiteExporter } from './infrastructure/exporter/resort.sqlite-exporter';

const resortSQLiteExporter: ClassProvider<ResortEntityExporter> = {
  provide: 'ResortExporter',
  useClass: ResortSQLiteExporter,
};

export default [AuthService, resortSQLiteExporter];
