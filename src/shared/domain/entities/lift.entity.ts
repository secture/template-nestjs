import {
  DateTimeType,
  Entity,
  Enum,
  IntegerType,
  ManyToOne,
  PrimaryKey,
  Property,
  StringType,
  UuidType,
} from '@mikro-orm/core';
import { GeoPathType } from '../../infrastructure/types/geo-path.type';
import { LiftStatus, LiftType } from '../enum/lift.enum';
import { GeoPath } from '../value-objects/geo-path.value-object';
import { Resort } from './resort.entity';

@Entity()
export class Lift {
  @PrimaryKey({ type: UuidType, fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: DateTimeType, fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt: Date;

  @Property({ type: StringType, fieldName: 'name' })
  private readonly _name!: string;

  @Enum({
    items: () => LiftType,
    fieldName: 'type',
    nativeEnumName: 'lift_type',
  })
  private readonly _type!: LiftType;

  @Property({ type: IntegerType, fieldName: 'capacity' })
  private readonly _capacity!: number;

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Enum({
    items: () => LiftStatus,
    fieldName: 'status',
    nativeEnumName: 'lift_status',
  })
  private readonly _status!: LiftStatus;

  @Property({ type: GeoPathType, fieldName: 'path' })
  private readonly _path: GeoPath;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    type: LiftType,
    capacity: number,
    resort: Resort,
    status: LiftStatus,
    path: GeoPath,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._type = type;
    this._capacity = capacity;
    this._resort = resort;
    this._status = status;
    this._path = path;
  }

  static create(
    id: string,
    name: string,
    type: LiftType,
    capacity: number,
    resort: Resort,
    status: LiftStatus,
    path: GeoPath,
  ): Lift {
    const createAt = new Date();

    return new Lift(
      id,
      createAt,
      createAt,
      name,
      type,
      capacity,
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

  get type(): LiftType {
    return this._type;
  }

  get capacity(): number {
    return this._capacity;
  }

  get resort(): Resort {
    return this._resort;
  }

  get status(): LiftStatus {
    return this._status;
  }

  get path(): GeoPath {
    return this._path;
  }
}
