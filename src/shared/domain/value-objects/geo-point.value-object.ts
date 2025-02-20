export class GeoPoint {
  private readonly _latitude: number;
  private readonly _longitude: number;

  constructor(latitude: number, longitude: number) {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees.');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees.');
    }

    this._latitude = latitude;
    this._longitude = longitude;
  }

  static create(latitude: number, longitude: number): GeoPoint {
    return new GeoPoint(latitude, longitude);
  }

  static from(data: { latitude: number; longitude: number }): GeoPoint {
    return new GeoPoint(data.latitude, data.longitude);
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  toJSON(): { latitude: number; longitude: number } {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  equals(other: GeoPoint): boolean {
    return (
      this._latitude === other.latitude && this._longitude === other.longitude
    );
  }
}
