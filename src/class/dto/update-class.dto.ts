import { PartialType } from '@nestjs/swagger';
import { BaseClassDto } from './base-class.dto';

export class UpdateClassDto extends PartialType(BaseClassDto) {}
