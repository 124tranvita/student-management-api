import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';

export class ClassroomInfo {
  @Prop({ type: Types.ObjectId, ref: 'Classroom', required: true })
  @Type(() => Classroom)
  classroomId: Classroom;

  @Prop({ type: String, required: true })
  classroomName: string;

  @Prop({ type: Date, required: true })
  addedAt: Date;
}
