import { Inject, Injectable } from '@nestjs/common';
import { ResortWithDistance } from '../../domain/aggregate/resort-with-distance.aggregate';
import { Resort } from '../../domain/entities/resort.entity';
import { InvalidError } from '../../domain/error/Invalid.error';
import { ResortRepository } from '../../domain/repositories/resort.repository';
import { GetResortsQuery } from './get-resorts.query';

@Injectable()
export class GetResortsHandler {
  constructor(
    @Inject('ResortRepository')
    private readonly resortRepository: ResortRepository,
  ) {}
  async handle(
    query: GetResortsQuery,
  ): Promise<Resort[] | ResortWithDistance[]> {
    const { latitude, longitude, search } = query;

    if ((latitude && !longitude) || (!latitude && longitude)) {
      throw new InvalidError(
        'Both latitude and longitude must be provided together.',
      );
    }

    if (!latitude && !longitude && search) {
      return this.resortRepository.findBySearchTerm(search);
    }

    if (latitude && longitude && !search) {
      return this.resortRepository.findAllByProximity(latitude, longitude);
    }

    if (latitude && longitude && search) {
      return this.resortRepository.findByProximityAndSearchTerm(
        latitude,
        longitude,
        search,
      );
    }

    return this.resortRepository.findAllOrderedAlphabetically();
  }
}
