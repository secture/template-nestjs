import { Type } from '@mikro-orm/core';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { GeoPolygon } from '../../domain/value-objects/geo-polygon.value-object';

export class GeoPolygonType extends Type<
  GeoPolygon | undefined,
  string | undefined
> {
  convertToDataBaseValue(value: GeoPolygon | undefined): string | undefined {
    if (!value) {
      return value;
    }

    const pointsString = value.vertices.map(
      (point) => `${point.longitude} ${point.latitude}`,
    );
    return `POLYGON(${pointsString})`;
  }

  convertToJSValue(value: string | undefined): GeoPolygon | undefined {
    const m = value?.match(/POLYGON\(\((.*?)\)\)/);

    if (!m) {
      return undefined;
    }

    const points = m[1].split(', ').map((coord) => {
      const [longitude, latitude] = coord.split(' ').map(Number);
      return new GeoPoint(latitude, longitude);
    });
    return new GeoPolygon(points);
  }

  convertToJSValueSQL(key: string) {
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string) {
    return `ST_GeomFromText(${key}, 4326)`;
  }

  getColumnType(): string {
    return 'geography(Polygon, 4326)';
  }
}
