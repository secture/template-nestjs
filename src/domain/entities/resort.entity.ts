import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Collection } from '../value-objects/collection.value-object';
import { Id } from '../value-objects/id.value-object';
import { ResortContact } from '../value-objects/resort-contact.value-object';
import { ResortService } from '../value-objects/resort-service.value-object';
import { ResortTechnicalData } from '../value-objects/resort-technical-data.value-object';

@Entity()
export class Resort {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: Id;

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

  @Property({ type: 'string', fieldName: 'logo' })
  private readonly _logo!: string;

  @Property({ type: 'json', fieldName: 'images' })
  private readonly _images!: string[];

  @Property({ type: 'json', fieldName: 'technical_data' })
  private readonly _technicalData!: ResortTechnicalData;

  @Property({ type: 'string', fieldName: 'description' })
  private readonly _description!: string;

  @Property({ type: 'json', fieldName: 'contacts' })
  private readonly _contacts!: Collection<ResortContact>;

  @Property({ type: 'json', fieldName: 'services' })
  private readonly _services!: Collection<ResortService>;

  constructor(
    id: Id,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    logo: string,
    images: string[],
    technicalData: ResortTechnicalData,
    description: string,
    contacts: Collection<ResortContact>,
    services: Collection<ResortService>,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._logo = logo;
    this._images = images;
    this._technicalData = technicalData;
    this._description = description;
    this._contacts = contacts;
    this._services = services;
  }

  static create(
    id: Id,
    name: string,
    logo: string,
    kilometersOfTracks: number,
    numberOfLifts: number,
    numberOfTracks: number,
    description: string,
    images: string[] = [],
    contacts: Collection<ResortContact> = Collection.create<ResortContact>([]),
    services: Collection<ResortService> = Collection.create<ResortService>([]),
  ): Resort {
    const createdAt = new Date();

    return new Resort(
      id,
      createdAt,
      createdAt,
      name,
      logo,
      images,
      ResortTechnicalData.create(
        kilometersOfTracks,
        numberOfLifts,
        numberOfTracks,
      ),
      description,
      contacts,
      services,
    );
  }

  get id(): Id {
    return this._id;
  }
}
