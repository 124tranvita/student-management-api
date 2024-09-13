import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Mentor } from 'src/mentor/schemas/mentor.schema';

export class AssignInfo {
  @Prop({ type: Types.ObjectId, ref: 'Mentor', required: true })
  @Type(() => Mentor)
  mentorId: Mentor;

  @Prop({ type: Types.ObjectId, ref: 'Classroom', required: true })
  @Type(() => Classroom)
  classroomId: Classroom;

  @Prop({ type: String, required: true })
  classroomName: string;

  @Prop({ type: Date, required: true, default: Date.now })
  addedAt: Date;
}
