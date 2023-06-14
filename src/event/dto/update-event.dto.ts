import { PartialType } from '@nestjs/swagger';
import { BaseEventDto } from './base-event.dto';

export class UpdateEventDto extends PartialType(BaseEventDto) {}
