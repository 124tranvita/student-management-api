import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor email.',
    type: String,
    format: 'email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Mentor passowrd.',
    type: String,
    format: 'password',
  })
  password: string;
}
