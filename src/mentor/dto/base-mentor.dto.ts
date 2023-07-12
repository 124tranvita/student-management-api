import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { IsEqual } from 'src/decorators/isEqual.decorator';

export class BaseMentorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @ApiProperty({
    description: 'Mentor name',
    type: String,
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mentor email',
    type: String,
    format: 'email',
  })
  email: string;

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    enum: ['admin', 'mentor'],
    default: 'mentor',
  })
  roles: Role;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Mentor programming languages',
    type: Array,
  })
  languages: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['1', '2', '0'],
    default: '1',
  })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    default:
      'https://www.iconarchive.com/download/i106655/diversity-avatars/avatars/native-man.512.png',
  })
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    enum: ['0', '1'],
    default: '1',
  })
  education: Role;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Mentor specialized',
    type: String,
  })
  specialized: string;

  @ApiProperty({
    description: 'Mentor created date',
    type: Date,
  })
  createdAt: Date;
}
