import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseClassroomDto } from './base-classroom.dto';

export class CreateClassroomDto extends BaseClassroomDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'defaut-profile.jpg' })
  image?: string;
}
