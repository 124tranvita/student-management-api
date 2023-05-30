import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseStudentDto } from './base-student.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateStudentDto extends PartialType(BaseStudentDto) {
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Student known programming languages',
    type: Array,
  })
  studentLanguage?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Student study status',
    required: false,
    enum: ['Active', 'Busy', 'Inactive'],
    default: 'Active',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'defaut-profile.jpg' })
  avatar?: string;
}
