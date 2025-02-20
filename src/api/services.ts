import { ClassProvider } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Knex } from 'knex';
import { AuthService } from './domain/auth.service';
import { ResortDataFiller } from './domain/exporters/resort.data-filler';
import { ResortExporter } from './domain/exporters/resort.exporter';
import { MetadataSqliteDataFiller } from './infrastructure/exporter/metadata.sqlite-data-filler';
import { NewsSqliteDataFiller } from './infrastructure/exporter/news.sqlite-data-filler';
import { ResortSQLiteExporter } from './infrastructure/exporter/resort.sqlite-exporter';
import { WebcamSqliteDataFiller } from './infrastructure/exporter/webcam.sqlite-data-filler';

const resortSQLiteFillers: FactoryProvider<ResortDataFiller<Knex>[]> = {
  provide: 'RESORT_FILLERS',
  useFactory: (
    webcam: WebcamSqliteDataFiller,
    news: NewsSqliteDataFiller,
    metadata: MetadataSqliteDataFiller,
  ) => {
    return [webcam, metadata, news];
  },
  inject: [
    WebcamSqliteDataFiller,
    MetadataSqliteDataFiller,
    NewsSqliteDataFiller,
  ],
};

const resortSQLiteExporter: ClassProvider<ResortExporter> = {
  provide: 'ResortExporter',
  useClass: ResortSQLiteExporter,
};

export default [
  AuthService,
  MetadataSqliteDataFiller,
  WebcamSqliteDataFiller,
  NewsSqliteDataFiller,
  resortSQLiteFillers,
  resortSQLiteExporter,
];
