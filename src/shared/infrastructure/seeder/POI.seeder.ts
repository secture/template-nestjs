import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { POI } from '../../domain/entities/POI.entity';
import { Resort } from '../../domain/entities/resort.entity';
import { POIType } from '../../domain/enum/poi-type.enum';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { Id } from '../../domain/value-objects/id.value-object';

export class POISeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.resolve(__dirname, 'data', 'POIs.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const POIsData = JSON.parse(fileData);

    for (const POIData of POIsData) {
      const existingPOI = await em.findOne(POI, { id: POIData.id });
      if (existingPOI) {
        continue;
      }

      const resort = await em.findOne(Resort, { id: POIData.resortId });
      if (!resort) {
        continue;
      }

      const POIs = POI.create(
        Id.generate().toString(),
        POIData.name,
        POIType[POIData.type as keyof typeof POIType],
        GeoPoint.from(POIData.location),
        POIData.description,
        resort,
      );

      em.persist(POIs);
    }

    await em.flush();
  }
}
