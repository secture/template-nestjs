import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class ResortTechnicalData {
  @Property()
  private readonly _kilometersOfTracks: number;

  @Property()
  private readonly _numberOfLifts: number;

  @Property()
  private readonly _numberOfTracks: number;

  private constructor(
    kilometersOfTracks: number,
    numberOfLifts: number,
    numberOfTracks: number,
  ) {
    if (0 >= kilometersOfTracks) {
      throw new Error('Kilometers of tracks must be a non-negative number.');
    }
    if (0 >= numberOfLifts) {
      throw new Error('Number of lifts must be a non-negative number.');
    }
    if (0 >= numberOfTracks) {
      throw new Error('Number of tracks must be a non-negative number.');
    }

    this._kilometersOfTracks = kilometersOfTracks;
    this._numberOfLifts = numberOfLifts;
    this._numberOfTracks = numberOfTracks;
  }

  static create(
    kilometersOfTracks: number,
    numberOfLifts: number,
    numberOfTracks: number,
  ): ResortTechnicalData {
    return new ResortTechnicalData(
      kilometersOfTracks,
      numberOfLifts,
      numberOfTracks,
    );
  }

  static from(data: {
    kilometersOfTracks: number;
    numberOfLifts: number;
    numberOfTracks: number;
  }): ResortTechnicalData {
    return new ResortTechnicalData(
      data.kilometersOfTracks,
      data.numberOfLifts,
      data.numberOfTracks,
    );
  }

  get kilometersOfTracks(): number {
    return this._kilometersOfTracks;
  }

  get numberOfLifts(): number {
    return this._numberOfLifts;
  }

  get numberOfTracks(): number {
    return this._numberOfTracks;
  }

  toString(): string {
    return `Kilometers of Tracks: ${this._kilometersOfTracks}, Number of Lifts: ${this._numberOfLifts}, Number of Tracks: ${this._numberOfTracks}`;
  }

  toJSON() {
    return {
      kilometersOfTracks: this._kilometersOfTracks,
      numberOfLifts: this._numberOfLifts,
      numberOfTracks: this._numberOfTracks,
    };
  }

  equals(other: ResortTechnicalData): boolean {
    return (
      this._kilometersOfTracks === other.kilometersOfTracks &&
      this._numberOfLifts === other.numberOfLifts &&
      this._numberOfTracks === other.numberOfTracks
    );
  }
}
