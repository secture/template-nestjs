import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/shared/domain/entities/user.entity';

export class UserResponse {
  @ApiProperty({
    example: '1',
    description: 'Unique idetifier for the user',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  surname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: '+123456789',
    description: 'User phone number',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: 'true',
    description: 'User phone number is verified',
    required: false,
  })
  phoneVerified?: boolean;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    phone?: string,
    phoneVerified?: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.phoneVerified = phoneVerified;
  }

  static createFromUser(user: User): UserResponse {
    return new UserResponse(
      user.id,
      user.name,
      user.surname,
      user.email,
      user.phone,
      user.phoneVerified,
    );
  }
}
