import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
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

/********************************
 *
 *  STUDENT -> MENTOR ASSIGNMENT
 *
 ********************************/

export class AssignStudentMentorDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Student _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  studentIds: [Types.ObjectId];
}

export class UnassignStudentMentorDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Assinged record _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  assignedIds: [Types.ObjectId];
}

/********************************
 *
 *  CLASSROOM -> MENTOR ASSIGNMENT
 *
 ********************************/

export class AssignClassroomMentorDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Classroom _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  classroomIds: [Types.ObjectId];
}

export class UnassignClassroomMentorDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Assinged record _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  assignedIds: [Types.ObjectId];
}
