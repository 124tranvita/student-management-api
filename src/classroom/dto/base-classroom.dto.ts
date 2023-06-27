import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseClassroomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({
    description: 'Classroom name',
    type: String,
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    description: 'Classroom description',
    type: String,
  })
  description?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Classroom programming languages',
    type: Array,
  })
  languages: string[];

  @ApiProperty({
    description: 'Classroom created date',
    type: Date,
  })
  createdAt: Date;
}
