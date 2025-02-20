import { Resort } from '../entities/resort.entity';
import { ResortServices } from '../enum/resort-services.enum';
import { Collection } from '../value-objects/collection.value-object';
import { GeoPoint } from '../value-objects/geo-point.value-object';
import { ResortContact } from '../value-objects/resort-contact.value-object';
import { ResortTechnicalData } from '../value-objects/resort-technical-data.value-object';

export class ResortWithDistance extends Resort {
  readonly distance: number;

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
    distance: number,
  ) {
    super(
      id,
      createdAt,
      updatedAt,
      name,
      logo,
      images,
      technicalData,
      description,
      contacts,
      services,
      location,
      country,
    );
    this.distance = distance;
  }

  static createWithDistance(
    id: string,
    name: string,
    logo: string,
    kilometersOfTracks: number,
    numberOfLifts: number,
    numberOfTracks: number,
    description: string,
    location: GeoPoint,
    country: string,
    distance: number,
    images: Collection<string> = Collection.create<string>([]),
    contacts: Collection<ResortContact> = Collection.create<ResortContact>([]),
    services: Collection<ResortServices> = Collection.create<ResortServices>(
      [],
    ),
  ): ResortWithDistance {
    const createdAt = new Date();

    return new ResortWithDistance(
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
      distance,
    );
  }
}
