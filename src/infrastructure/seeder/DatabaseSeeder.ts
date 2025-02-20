import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { LiftSeeder } from './lift.seeder';
import { POISeeder } from './POI.seeder';
import { ResortSeeder } from './resort.seeder';
import { SlopeSeeder } from './slope.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [ResortSeeder, SlopeSeeder, POISeeder, LiftSeeder]);
  }
}
