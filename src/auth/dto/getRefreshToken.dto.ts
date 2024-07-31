import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'User Id',
    type: String,
  })
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User refresh token',
    type: String,
  })
  refreshToken: string;
}
