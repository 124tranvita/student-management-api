import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseStudentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @ApiProperty({
    description: 'Student id',
    type: String,
  })
  studentId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @ApiProperty({
    description: 'Student name',
    type: String,
  })
  name: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Student birthday',
    type: Date,
  })
  doB: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Student name',
    type: String,
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student gender',
    required: false,
    enum: ['0', '1'],
    default: '0',
  })
  gender: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Student study status',
    required: false,
    enum: ['1', '2', '0'],
    default: '1',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 'https://cdn-icons-png.flaticon.com/512/4128/4128349.png',
  })
  avatar?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    default:
      'https://img.freepik.com/free-vector/flat-geometric-background_23-2148957201.jpg',
  })
  cover?: string;
}
