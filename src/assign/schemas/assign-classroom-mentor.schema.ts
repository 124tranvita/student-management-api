import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Classroom,
  ClassroomDocument,
} from 'src/classroom/schemas/classroom.schema';
import { Mentor, MentorDocument } from 'src/mentor/schemas/mentor.schema';

export type AssignClassroomMentorDocument =
  HydratedDocument<AssignClassroomMentor>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class AssignClassroomMentor {
  @Prop({
    required: true,
  })
  assignedAt: Date;

  @Prop({
    required: true,
  })
  classroomName: string;

  @Prop()
  classroomDesc: string;

  @Prop({
    required: true,
  })
  classroomLanguages: string[];

  @Prop({
    required: true,
    default:
      'https://sonomalibrary.org/sites/default/files/styles/large/public/images/youthcoding.png',
  })
  classroomCover: string;

  @Prop({
    required: true,
  })
  mentorName: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  })
  @Type(() => Mentor)
  mentor: MentorDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  })
  @Type(() => Classroom)
  classroom: ClassroomDocument;
}

const AssignClassroomMentorSchema = SchemaFactory.createForClass(
  AssignClassroomMentor,
);

export { AssignClassroomMentorSchema };
