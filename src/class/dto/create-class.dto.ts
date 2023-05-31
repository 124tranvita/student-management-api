import { IsOptional, IsString } from 'class-validator';
import { BaseClassDto } from './base-class.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto extends BaseClassDto {
  @IsString()
  @ApiProperty({
    description: 'Classroom mentor',
    type: String,
  })
  mentor: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'defaut-profile.jpg' })
  image?: string;
}
