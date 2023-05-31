import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { BaseClassDto } from './base-class.dto';

export class UpdateClassDto extends PartialType(BaseClassDto) {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Student classroom',
    type: Array,
  })
  students: Types.ObjectId[];
}
