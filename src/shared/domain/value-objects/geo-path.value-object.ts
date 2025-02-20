import { error } from 'console';
import { GeoPoint } from './geo-point.value-object';

export class GeoPath {
  private readonly _points: GeoPoint[];

  constructor(points: GeoPoint[]) {
    if (points.length < 2) {
      throw error('A path must have at least two point.');
    }

    this._points = points;
  }

  static create(points: GeoPoint[]): GeoPath {
    return new GeoPath(points);
  }

  static from(points: { latitude: number; longitude: number }[]): GeoPath {
    const geoPoints = points.map((p) => new GeoPoint(p.latitude, p.longitude));
    return new GeoPath(geoPoints);
  }

  get points(): GeoPoint[] {
    return this._points;
  }

  toJSON(): { points: { latitude: number; longitude: number }[] } {
    return {
      points: this.points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    };
  }

  equals(other: GeoPath): boolean {
    if (this._points.length !== other.points.length) {
      return false;
    }
    return this._points.every((point, index) =>
      point.equals(other.points[index]),
    );
  }
}
