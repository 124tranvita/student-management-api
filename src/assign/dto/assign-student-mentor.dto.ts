import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignStudentMentorDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  studentId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  studentName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  studentStatus: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  mentorName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  mentor: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Student Id',
  })
  student: Types.ObjectId;
}

export class CreateAssignStudentMentorDto extends BaseAssignStudentMentorDto {}

export class UpdateAssignStudentMentorDto extends PartialType(
  BaseAssignStudentMentorDto,
) {}
