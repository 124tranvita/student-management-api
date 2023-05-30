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
  mentorName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor email',
    type: String,
    format: 'email',
  })
  mentorEmail: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Mentor programming languages',
    type: Array,
  })
  mentorLanguage: string[];

  @ApiProperty({
    description: 'Mentor created date',
    type: Date,
  })
  createdAt: Date;
}
