import { ApiProperty } from '@nestjs/swagger';
import { ResortWithDistance } from '../../../domain/aggregate/resort-with-distance.aggregate';
import { Resort } from '../../../../shared/domain/entities/resort.entity';

export class ResortResponse {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the resort',
  })
  id: string;

  @ApiProperty({ example: 'Resort A', description: 'Name of the resort' })
  name: string;

  @ApiProperty({
    example: 'logoA.jpg',
    description: 'Logo image URL of the resort',
  })
  logo: string;

  @ApiProperty({
    example: 42.5,
    description: 'Distance of the resort',
  })
  distance: number | null;

  @ApiProperty({
    example: 'España',
    description: 'Resort country',
  })
  country: string;

  constructor(
    id: string,
    name: string,
    logo: string,
    country: string,
    distance: number | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.logo = logo;
    this.country = country;
    this.distance = distance || null;
  }

  static createFromResort(resort: Resort | ResortWithDistance): ResortResponse {
    return new ResortResponse(
      resort.id,
      resort.name,
      resort.logo,
      resort.country,
      resort instanceof ResortWithDistance ? resort.distance : null,
    );
  }
}
