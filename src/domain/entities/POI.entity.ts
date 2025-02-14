import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { GeoPointType } from '../../infrastructure/types/geo-point.type';
import { GeoPoint } from '../value-objects/geo-point.value-object';
import { Resort } from './resort.entity';
import { POIType } from '../enum/poi-type.enum';

@Entity()
export class POI {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt: Date;

  @Property({ type: 'string', fieldName: 'name' })
  private readonly _name!: string;

  @Enum({ items: () => POIType, fieldName: 'type' })
  private readonly _type!: POIType;

  @Property({ type: GeoPointType, fieldName: 'location' })
  private readonly _location: GeoPoint;

  @Property({ type: 'string', fieldName: 'description' })
  private readonly _description!: string;

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    type: POIType,
    location: GeoPoint,
    description: string,
    resort: Resort,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._type = type;
    this._location = location;
    this._description = description;
    this._resort = resort;
  }

  static create(
    id: string,
    name: string,
    type: POIType,
    location: GeoPoint,
    description: string,
    resort: Resort,
  ): POI {
    const createdAt = new Date();

    return new POI(
      id,
      createdAt,
      createdAt,
      name,
      type,
      location,
      description,
      resort,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get type(): POIType {
    return this._type;
  }

  get location(): GeoPoint {
    return this._location;
  }

  get description(): string {
    return this._description;
  }

  get resort(): Resort {
    return this._resort;
  }
}
