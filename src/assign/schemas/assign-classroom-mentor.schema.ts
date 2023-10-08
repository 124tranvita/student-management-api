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
  name: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
  })
  languages: string[];

  @Prop({
    required: true,
    default:
      'https://sonomalibrary.org/sites/default/files/styles/large/public/images/youthcoding.png',
  })
  cover: string;

  @Prop({
    required: true,
    default: 'https://cdn-icons-png.flaticon.com/512/4128/4128405.png',
  })
  avatar?: string;

  @Prop({
    required: true,
  })
  assignee: string;

  @Prop()
  email?: string;

  @Prop()
  status?: string;

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

AssignClassroomMentorSchema.index({
  name: 'text',
  description: 'text',
  languages: 'text',
});

export { AssignClassroomMentorSchema };
