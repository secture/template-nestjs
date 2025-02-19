import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Lift } from '../../domain/entities/lift.entity';
import { Resort } from '../../domain/entities/resort.entity';
import { LiftStatus, LiftType } from '../../domain/enum/lift.enum';
import { GeoPath } from '../../domain/value-objects/geo-path.value-object';
import { Id } from '../../domain/value-objects/id.value-object';

export class LiftSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.resolve(__dirname, 'data', 'lift.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const liftsData = JSON.parse(fileData);

    for (const liftData of liftsData) {
      const existingLift = await em.findOne(Lift, { id: liftData.id });
      if (existingLift) {
        continue;
      }

      const resort = await em.findOne(Resort, { id: liftData.resort });
      if (!resort) {
        continue;
      }

      const lifts = Lift.create(
        Id.generate().toString(),
        liftData.name,
        LiftType[liftData.type as keyof typeof LiftType],
        liftData.capacity,
        resort,
        LiftStatus[liftData.status as keyof typeof LiftStatus],
        GeoPath.from(liftData.path.points),
      );

      em.persist(lifts);
    }

    await em.flush();
  }
}
