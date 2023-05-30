import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEqual } from '../../decorators/isEqual.decorator';
import { BaseMentorDto } from './base-mentor.dto';

export class CreateMentorDto extends BaseMentorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'User password',
    type: 'string',
    minLength: 8,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEqual('password', { message: 'Confirm password does not match!' })
  @ApiProperty({
    description: 'User password confirm',
    type: 'string',
    minLength: 8,
  })
  passwordConfirm: string;
}
