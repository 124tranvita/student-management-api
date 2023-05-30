import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseMentorDto } from './base-mentor.dto';

export class UpdateMentorDto extends PartialType(BaseMentorDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['Active', 'Busy', 'Inactive'],
    default: 'Active',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'defaut-profile.jpg' })
  avatar?: string;

  @ApiProperty()
  refreshToken: string;
}
