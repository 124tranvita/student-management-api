import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Classroom,
  ClassroomDocument,
} from 'src/classroom/schemas/classroom.schema';
import { Mentor, MentorDocument } from 'src/mentor/schemas/mentor.schema';

export type AssignClassroomToMentorDocument =
  HydratedDocument<AssignClassroomToMentor>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class AssignClassroomToMentor {
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

const AssignClassroomToMentorSchema = SchemaFactory.createForClass(
  AssignClassroomToMentor,
);

AssignClassroomToMentorSchema.index({
  name: 'text',
  languages: 'text',
});

export { AssignClassroomToMentorSchema };
