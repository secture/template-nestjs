import {
  ArrayType,
  DateTimeType,
  Embedded,
  Entity,
  Enum,
  PrimaryKey,
  Property,
  StringType,
  UuidType,
} from '@mikro-orm/core';
import { GeoPointType } from '../../infrastructure/types/geo-point.type';
import { ResortServices } from '../enum/resort-services.enum';
import { Collection } from '../value-objects/collection.value-object';
import { GeoPoint } from '../value-objects/geo-point.value-object';
import { ResortContact } from '../value-objects/resort-contact.value-object';
import { ResortTechnicalData } from '../value-objects/resort-technical-data.value-object';

@Entity()
export class Resort {
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

  @Property({ type: StringType, fieldName: 'logo' })
  private readonly _logo!: string;

  @Property({ type: ArrayType, fieldName: 'images' })
  private readonly _images!: string[];

  @Embedded(() => ResortTechnicalData, { prefix: 'technical_data' })
  private readonly _technicalData!: ResortTechnicalData;

  @Property({ type: StringType, fieldName: 'description' })
  private readonly _description!: string;

  @Embedded(() => ResortContact, { prefix: 'resort_contact', array: true })
  private readonly _contacts!: ResortContact[];

  @Enum({
    items: () => ResortServices,
    fieldName: 'services',
    nativeEnumName: 'resort_services',
    array: true,
  })
  private readonly _services!: ResortServices[];

  @Property({ type: GeoPointType, fieldName: 'location' })
  private readonly _location: GeoPoint;

  @Property({ type: StringType, fieldName: 'country' })
  private readonly _country!: string;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    logo: string,
    images: Collection<string>,
    technicalData: ResortTechnicalData,
    description: string,
    contacts: Collection<ResortContact>,
    services: Collection<ResortServices>,
    location: GeoPoint,
    country: string,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._logo = logo;
    this._images = [...images.items];
    this._technicalData = technicalData;
    this._description = description;
    this._contacts = [...contacts.items];
    this._services = [...services.items];
    this._location = location;
    this._country = country;
  }

  static create(
    id: string,
    name: string,
    logo: string,
    kilometersOfTracks: number,
    numberOfLifts: number,
    numberOfTracks: number,
    description: string,
    location: GeoPoint,
    country: string,
    images: Collection<string> = Collection.create<string>([]),
    contacts: Collection<ResortContact> = Collection.create<ResortContact>([]),
    services: Collection<ResortServices> = Collection.create<ResortServices>(
      [],
    ),
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
      location,
      country,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get logo(): string {
    return this._logo;
  }

  get location(): GeoPoint {
    return this._location;
  }

  get country(): string {
    return this._country;
  }

  get contacts(): Collection<ResortContact> {
    return Collection.from(this._contacts);
  }

  get description(): string {
    return this._description;
  }

  get technicalData(): ResortTechnicalData {
    return this._technicalData;
  }

  get services(): Collection<ResortServices> {
    return Collection.from(this._services);
  }
}
