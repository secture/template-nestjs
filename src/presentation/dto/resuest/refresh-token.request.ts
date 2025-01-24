import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({
    description: 'The refresh token to obtain a new access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX3ZhbHVlIjoiNWRlNDgwZDEtZDZiYS00YWY0LWE0OGYtZjdmOTkxOWNhMTY0In0sImlhdCI6MTczNzExMzgxMiwiZXhwIjoxNzM3NzE4NjEyfQ.a7CJzhC1JcNnaxGHiA9HfvVwLDm-O8Q80ubc5r0zAxY',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
