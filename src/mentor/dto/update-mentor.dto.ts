import { PartialType, ApiProperty } from '@nestjs/swagger';
import { BaseMentorDto } from './base-mentor.dto';

export class UpdateMentorDto extends PartialType(BaseMentorDto) {
  @ApiProperty()
  refreshToken: string;
}
