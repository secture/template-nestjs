import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Resort } from './resort.entity';

@Entity()
export class Webcam {
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

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Property({ type: 'string', fieldName: 'name' })
  private readonly _name!: string;

  @Property({ type: 'string', fieldName: 'url' })
  private readonly _url!: string;

  @Property({ type: 'Date', fieldName: 'last_updated' })
  private readonly _lastUpdated!: Date;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    resort: Resort,
    name: string,
    url: string,
    lastUpdated: Date,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._resort = resort;
    this._name = name;
    this._url = url;
    this._lastUpdated = lastUpdated;
  }

  static create(
    id: string,
    name: string,
    url: string,
    resort: Resort,
    lastUpdated: Date,
  ): Webcam {
    const createdAt = new Date();
    return new Webcam(id, createdAt, createdAt, resort, name, url, lastUpdated);
  }

  get id(): string {
    return this._id;
  }

  get resort(): Resort {
    return this._resort;
  }

  get name(): string {
    return this._name;
  }

  get url(): string {
    return this._url;
  }

  get lastUpdated(): Date {
    return this._lastUpdated;
  }
}
