import { Type } from '@mikro-orm/core';
import { GeoPath } from '../../domain/value-objects/geo-path.value-object';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';

export class GeoPathType extends Type<GeoPath | undefined, string | undefined> {
  convertToDatabaseValue(value: GeoPath | undefined): string | undefined {
    if (!value) {
      return value;
    }

    const pointsString = value.points
      .map((point) => `${point.longitude} ${point.latitude}`)
      .join(',');

    return `LINESTRING(${pointsString})`;
  }

  convertToJSValue(value: string | undefined): GeoPath | undefined {
    const m = value?.match(/LINESTRING\((.*?)\)/);

    if (!m) {
      return undefined;
    }

    const points = m[1].split(', ').map((coord) => {
      const [longitude, latitude] = coord.split(' ').map(Number);
      return new GeoPoint(latitude, longitude);
    });

    return new GeoPath(points);
  }

  convertToJSValueSQL(key: string) {
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string) {
    return `ST_GeomFromText(${key}, 4326)`;
  }

  getColumnType(): string {
    return 'geography(LineString, 4326)';
  }
}
