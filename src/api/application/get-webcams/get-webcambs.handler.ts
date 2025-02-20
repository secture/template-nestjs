import { Inject, Injectable } from '@nestjs/common';
import { WebcamRepository } from '../../domain/repositories/webcam.repository';
import { Webcam } from '../../../shared/domain/entities/webcam.entity';
import { GetWebcamsQuery } from './get-webcam.query';

@Injectable()
export class GetWebcamsHandler {
  constructor(
    @Inject('WebcamRepository')
    private readonly webcamRepository: WebcamRepository,
  ) {}

  async handler(query: GetWebcamsQuery): Promise<Webcam[]> {
    const { resortId } = query;
    const webcams = await this.webcamRepository.findByResort(resortId);

    return webcams;
  }
}
