import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignMentorToClassroomDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'avatar',
  })
  avatar: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Languages',
  })
  languages: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'status',
  })
  status: string;

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

export class CreateAssignMentorToClassroomDto extends BaseAssignMentorToClassroomDto {}

export class UpdateAssignMentorToClassroomDto extends PartialType(
  BaseAssignMentorToClassroomDto,
) {}
