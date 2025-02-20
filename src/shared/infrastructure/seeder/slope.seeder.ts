import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Resort } from '../../domain/entities/resort.entity';
import { Slope } from '../../domain/entities/slope.entity';
import { SlopeDifficulty, SlopeStatus } from '../../domain/enum/slope.enum';
import { GeoPath } from '../../domain/value-objects/geo-path.value-object';
import { Id } from '../../domain/value-objects/id.value-object';

export class SlopeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.resolve(__dirname, 'data', 'slope.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const slopesData = JSON.parse(fileData);

    for (const slopeData of slopesData) {
      const existingSlope = await em.findOne(Slope, { id: slopeData.id });
      if (existingSlope) {
        continue;
      }

      const resort = await em.findOne(Resort, { id: slopeData.resortId });
      if (!resort) {
        continue;
      }

      const slope = Slope.create(
        Id.generate().toString(),
        slopeData.name,
        SlopeDifficulty[
          slopeData.difficulty.toUpperCase() as keyof typeof SlopeDifficulty
        ],
        slopeData.length,
        resort,
        SlopeStatus[slopeData.status.toUpperCase() as keyof typeof SlopeStatus],
        GeoPath.from(slopeData.path.points),
      );

      em.persist(slope);
    }

    await em.flush();
  }
}
