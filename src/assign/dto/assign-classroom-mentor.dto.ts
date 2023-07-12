import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignClassroomMentorDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'Description',
  })
  description?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Languages',
  })
  languages: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Cover',
  })
  cover: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Assignee',
  })
  assignee: string;

  @IsOptional()
  @ApiProperty({
    description: 'Mentor email',
  })
  email?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Mentor status',
  })
  status?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Mentor avatar',
  })
  avatar?: string;

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
