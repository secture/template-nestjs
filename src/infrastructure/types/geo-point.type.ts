import { Type } from '@mikro-orm/core';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';

export class GeoPointType extends Type<
  GeoPoint | undefined,
  string | undefined
> {
  convertToDatabaseValue(value: GeoPoint | undefined): string | undefined {
    if (!value) {
      return value;
    }

    return `POINT(${value.latitude} ${value.longitude})`;
  }

  convertToJSValue(value: string | undefined): GeoPoint | undefined {
    const m = value?.match(/POINT\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)/i);

    if (!m) {
      return undefined;
    }

    return new GeoPoint(+m[1], +m[3]);
  }

  convertToJSValueSQL(key: string) {
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string) {
    return `ST_GeomFromText(${key}, 4326)`;
  }

  getColumnType(): string {
    return 'geography(Point, 4326)';
  }
}
