import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignStudentToMentorDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Student Id',
  })
  studentId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Student name',
  })
  studentName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Student status',
  })
  studentStatus: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Student avatar',
  })
  studentAvatar: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor name',
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

export class CreateAssignStudentToMentorDto extends BaseAssignStudentToMentorDto {}

export class UpdateAssignStudentToMentorDto extends PartialType(
  BaseAssignStudentToMentorDto,
) {}
