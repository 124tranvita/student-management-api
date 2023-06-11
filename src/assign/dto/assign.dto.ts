import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AssignDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student _id.',
    type: Types.ObjectId,
    format: 'ObjectId',
  })
  studentId: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Class _id.',
    type: Types.ObjectId,
    format: 'ObjectId',
  })
  classId: Types.ObjectId;
}
