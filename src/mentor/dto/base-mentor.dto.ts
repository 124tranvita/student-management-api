import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseMentorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @ApiProperty({
    description: 'Mentor name',
    type: String,
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor email',
    type: String,
    format: 'email',
  })
  email: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Mentor programming languages',
    type: Array,
  })
  languages: string[];

  @ApiProperty({
    description: 'Mentor created date',
    type: Date,
  })
  createdAt: Date;
}
