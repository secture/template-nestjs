import type { EntityManager } from '@mikro-orm/core';
import { Resort } from '../../domain/entities/resort.entity';
import { Slope } from '../../domain/entities/slope.entity';
import { SlopeDifficulty, SlopeStatus } from '../../domain/enum/slope.enum';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { Id } from '../../domain/value-objects/id.value-object';
import { Seeder } from '@mikro-orm/seeder';

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
        GeoPoint.from(slopeData.location),
        slopeData.length,
        resort,
        SlopeStatus[slopeData.status.toUpperCase() as keyof typeof SlopeStatus],
      );

      em.persist(slope);
    }

    await em.flush();
  }
}
