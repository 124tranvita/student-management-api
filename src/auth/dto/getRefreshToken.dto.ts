import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class GetRefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'User Id',
    type: String,
  })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User refresh token',
    type: String,
  })
  refreshToken: string;
}
