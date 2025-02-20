import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function BothCoordinates(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'BothCoordinates',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const hasLatitude = obj.latitude !== undefined;
          const hasLongitude = obj.longitude !== undefined;

          return (
            (hasLatitude && hasLongitude) || (!hasLatitude && !hasLongitude)
          );
        },
        defaultMessage() {
          return `Both latitude and longitude must be provided together.`;
        },
      },
    });
  };
}

export class GetResortsRequest {
  @ApiPropertyOptional({
    example: 40.7128,
    description: 'Latitude',
  })
  @IsOptional()
  //@IsNumber()
  @BothCoordinates()
  latitude?: number;

  @ApiPropertyOptional({
    example: 40.7128,
    description: 'Longitude',
  })
  @IsOptional()
  //@IsNumber()
  @BothCoordinates()
  longitude?: number;

  @ApiPropertyOptional({
    example: 'baq',
    description: 'Search term',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  search?: string;
}
