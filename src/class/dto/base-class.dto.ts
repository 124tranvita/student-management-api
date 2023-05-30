import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseClassDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({
    description: 'Classroom name',
    type: String,
  })
  className: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  @ApiProperty({
    description: 'Classroom description',
    type: String,
  })
  classDescription?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Classroom programming languages',
    type: Array,
  })
  classLanguage: string[];

  @ApiProperty({
    description: 'Classroom created date',
    type: Date,
  })
  createdAt: Date;
}
