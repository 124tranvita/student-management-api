import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseStudentDto } from './base-student.dto';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateStudentDto extends PartialType(BaseStudentDto) {
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Student known programming languages',
    type: Array,
  })
  languages?: string[];
}
