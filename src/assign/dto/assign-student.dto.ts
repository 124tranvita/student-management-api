import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AssignStudentDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student _id.',
    type: Types.ObjectId,
    format: 'ObjectId',
  })
  assignStudentId: Types.ObjectId;
}
