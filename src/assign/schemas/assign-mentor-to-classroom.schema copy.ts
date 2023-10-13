import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Classroom,
  ClassroomDocument,
} from 'src/classroom/schemas/classroom.schema';
import { Mentor, MentorDocument } from 'src/mentor/schemas/mentor.schema';

export type AssignMentorToClassroomDocument =
  HydratedDocument<AssignMentorToClassroom>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class AssignMentorToClassroom {
  @Prop({
    required: true,
  })
  assignedAt: Date;

  @Prop({
    required: true,
    default: 'https://cdn-icons-png.flaticon.com/512/4128/4128405.png',
  })
  avatar: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  email: string;

  @Prop()
  status: string;

  @Prop({
    required: true,
  })
  languages: string[];

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

const AssignMentorToClassroomSchema = SchemaFactory.createForClass(
  AssignMentorToClassroom,
);

AssignMentorToClassroomSchema.index({
  name: 'text',
  email: 'text',
  languages: 'text',
});

export { AssignMentorToClassroomSchema };
