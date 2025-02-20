import { ApiProperty } from '@nestjs/swagger';
import { Webcam } from '../../../../shared/domain/entities/webcam.entity';

export class WebcamResponse {
  @ApiProperty({
    example: 'uuid',
    description: 'Unique identifier for the webcam',
  })
  id: string;

  @ApiProperty({
    example: 'Webcam Teso',
    description: 'webcam name',
  })
  name: string;

  @ApiProperty({
    example: 'example.com/image.jpg',
    description: 'URL of the last captured frame',
  })
  url: string;

  @ApiProperty({
    example: '2025-01-15T10:00:00Z',
    description: 'Timestamp of the last update',
  })
  lastUpdated: string;

  @ApiProperty({
    example: 'uuid',
    description: 'Resort ID associated with this webcam',
  })
  resortId: string;

  constructor(
    id: string,
    name: string,
    url: string,
    lastUpdated: string,
    resortId: string,
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.lastUpdated = lastUpdated;
    this.resortId = resortId;
  }

  static createFromWebcam(webcam: Webcam): WebcamResponse {
    return new WebcamResponse(
      webcam.id,
      webcam.name,
      webcam.url,
      webcam.lastUpdated.toISOString(),
      webcam.resort.id,
    );
  }
}
