import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignClassroomMentorDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  classroomName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  classroomDesc: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  classroomLanguages: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor Id',
  })
  classroomCover: string;

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
    description: 'Classroom Id',
  })
  classroom: Types.ObjectId;
}

export class CreateAssignClassroomMentorDto extends BaseAssignClassroomMentorDto {}

export class UpdateAssignClassroomMentorDto extends PartialType(
  BaseAssignClassroomMentorDto,
) {}
