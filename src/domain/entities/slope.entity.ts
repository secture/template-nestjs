import {
  DateTimeType,
  DecimalType,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  StringType,
  UuidType,
} from '@mikro-orm/core';
import { GeoPathType } from '../../infrastructure/types/geo-path.type';
import { SlopeDifficulty, SlopeStatus } from '../enum/slope.enum';
import { GeoPath } from '../value-objects/geo-path.value-object';
import { Resort } from './resort.entity';

@Entity()
export class Slope {
  @PrimaryKey({ type: UuidType, fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: DateTimeType, fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt!: Date;

  @Property({ type: StringType, fieldName: 'name' })
  private readonly _name!: string;

  @Enum({
    items: () => SlopeDifficulty,
    fieldName: 'difficulty',
    nativeEnumName: 'slope_difficulty',
  })
  private readonly _difficulty!: SlopeDifficulty;

  @Property({ type: DecimalType, fieldName: 'length' })
  private readonly _length!: number;

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Enum({
    items: () => SlopeStatus,
    fieldName: 'status',
    nativeEnumName: 'slope_status',
  })
  private readonly _status!: SlopeStatus;

  @Property({ type: GeoPathType, fieldName: 'path' })
  private readonly _path!: GeoPath;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    difficulty: SlopeDifficulty,
    length: number,
    resort: Resort,
    status: SlopeStatus,
    path: GeoPath,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._difficulty = difficulty;
    this._length = length;
    this._resort = resort;
    this._status = status;
    this._path = path;
  }

  static create(
    id: string,
    name: string,
    difficulty: SlopeDifficulty,
    length: number,
    resort: Resort,
    status: SlopeStatus,
    path: GeoPath,
  ): Slope {
    const createdAt = new Date();

    return new Slope(
      id,
      createdAt,
      createdAt,
      name,
      difficulty,
      length,
      resort,
      status,
      path,
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

  get length(): number {
    return this._length;
  }

  get resort(): Resort {
    return this._resort;
  }

  get status(): SlopeStatus {
    return this._status;
  }

  get path(): GeoPath {
    return this._path;
  }
}
