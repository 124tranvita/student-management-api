import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class BaseAssignClassroomToMentorDto {
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
    description: 'Mentor Id',
  })
  mentor: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Classroom Id',
  })
  classroom: Types.ObjectId;
}

export class CreateAssignClassroomToMentorDto extends BaseAssignClassroomToMentorDto {}

export class UpdateAssignClassroomToMentorDto extends PartialType(
  BaseAssignClassroomToMentorDto,
) {}
