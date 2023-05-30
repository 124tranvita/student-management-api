import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
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
  studentName: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Student birthday',
    type: Date,
  })
  studentDoB: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Student name',
    type: String,
  })
  studentAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student gender',
    required: false,
    enum: ['0', '1'],
    default: '0',
  })
  studentGender: string;
}
