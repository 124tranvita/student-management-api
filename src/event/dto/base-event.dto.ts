import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class BaseEventDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Event of student',
    type: Types.ObjectId,
  })
  student: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Event of student',
    type: Types.ObjectId,
  })
  mentor: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Event title',
    type: String,
  })
  title: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Event start date',
    type: Date,
  })
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Event end date',
    type: Date,
  })
  end: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'All date event',
    required: false,
    type: Boolean,
    default: false,
  })
  allDate: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Event status',
    enum: ['0', '1'],
    default: '0',
  })
  status: string;
}
