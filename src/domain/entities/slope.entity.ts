import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SlopeDifficulty, SlopeStatus } from '../enum/slope.enum';
import { GeoPointType } from '../../infrastructure/types/geo-point.type';
import { GeoPoint } from '../value-objects/geo-point.value-object';
import { Resort } from './resort.entity';

@Entity()
export class Slope {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt!: Date;

  @Property({ type: 'string', fieldName: 'name' })
  private readonly _name!: string;

  @Enum({ items: () => SlopeDifficulty, fieldName: 'difficulty' })
  private readonly _difficulty!: SlopeDifficulty;

  @Property({ type: GeoPointType, fieldName: 'location' })
  private readonly _location!: GeoPoint;

  @Property({ type: 'decimal', fieldName: 'length' })
  private readonly _length!: number;

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Enum({ items: () => SlopeStatus, fieldName: 'status' })
  private readonly _status!: SlopeStatus;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    difficulty: SlopeDifficulty,
    location: GeoPoint,
    length: number,
    resort: Resort,
    status: SlopeStatus,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._difficulty = difficulty;
    this._location = location;
    this._length = length;
    this._resort = resort;
    this._status = status;
  }

  static create(
    id: string,
    name: string,
    difficulty: SlopeDifficulty,
    location: GeoPoint,
    length: number,
    resort: Resort,
    status: SlopeStatus,
  ): Slope {
    const createdAt = new Date();

    return new Slope(
      id,
      createdAt,
      createdAt,
      name,
      difficulty,
      location,
      length,
      resort,
      status,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get difficulty(): SlopeDifficulty {
    return this._difficulty;
  }

  get location(): GeoPoint {
    return this._location;
  }

  get length(): number {
    return this._length;
  }

  get resort(): Resort {
    return this._resort;
  }

  get status(): SlopeStatus {
    return this._status;
  }
}
