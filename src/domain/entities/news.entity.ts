import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Resort } from './resort.entity';

@Entity()
export class News {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    nullable: true,
    fieldName: 'updated_at',
  })
  private _updatedAt?: Date;

  @ManyToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Property({ type: 'string', fieldName: 'title' })
  private readonly _title!: string;

  @Property({ type: 'string', fieldName: 'description' })
  private readonly _description!: string;

  @Property({ type: 'string', fieldName: 'url' })
  private readonly _url!: string;

  @Property({ type: 'Date', fieldName: 'date' })
  private readonly _date!: Date;

  @Property({ type: 'string', fieldName: 'image' })
  private readonly _image!: string;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    resort: Resort,
    title: string,
    description: string,
    url: string,
    date: Date,
    image: string,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._resort = resort;
    this._title = title;
    this._description = description;
    this._url = url;
    this._date = date;
    this._image = image;
  }

  static create(
    id: string,
    title: string,
    description: string,
    url: string,
    date: Date,
    resort: Resort,
    image: string,
  ): News {
    const createdAt = new Date();
    return new News(
      id,
      createdAt,
      createdAt,
      resort,
      title,
      description,
      url,
      date,
      image,
    );
  }

  get id(): string {
    return this._id;
  }

  get resort(): Resort {
    return this._resort;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get url(): string {
    return this._url;
  }

  get date(): Date {
    return this._date;
  }

  get image(): string {
    return this._image;
  }
}
