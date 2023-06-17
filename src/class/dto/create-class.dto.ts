import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseClassDto } from './base-class.dto';

export class CreateClassDto extends BaseClassDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'defaut-profile.jpg' })
  image?: string;
}
