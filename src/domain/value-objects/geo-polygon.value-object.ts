import { GeoPoint } from './geo-point.value-object';

export class GeoPolygon {
  private readonly _vertices: GeoPoint[];

  constructor(vertices: GeoPoint[]) {
    if (vertices.length < 3) {
      throw new Error('A polygon must have at least three vertices.');
    }

    this._vertices = vertices;
  }

  static create(vertices: GeoPoint[]): GeoPolygon {
    return new GeoPolygon(vertices);
  }

  static from(data: {
    vertices: { latitude: number; longitude: number }[];
  }): GeoPolygon {
    const points = data.vertices.map(
      (v) => new GeoPoint(v.latitude, v.longitude),
    );
    return new GeoPolygon(points);
  }
  get vertices(): GeoPoint[] {
    return this._vertices;
  }

  toJSON(): {
    vertices: { latitude: number; longitude: number }[];
  } {
    return {
      vertices: this.vertices.map((v) => ({
        latitude: v.latitude,
        longitude: v.longitude,
      })),
    };
  }

  equals(other: GeoPolygon): boolean {
    if (this._vertices.length !== other.vertices.length) {
      return false;
    }

    return this._vertices.every((vertex, index) =>
      vertex.equals(other.vertices[index]),
    );
  }
}
