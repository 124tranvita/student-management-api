import { IsNotEmpty, IsString } from 'class-validator';
import { BaseStudentDto } from './base-student.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateStudentDto extends BaseStudentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Student classroom',
    type: Array,
  })
  classrooms: Types.ObjectId[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Student mentor',
    type: String,
  })
  mentor: string;
}
