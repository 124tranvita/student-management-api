import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddStudentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Mentor ID',
    type: String,
  })
  mentorId: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Student IDs',
    type: String,
  })
  studentIds: string[];
}
