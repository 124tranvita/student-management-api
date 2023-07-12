import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Classroom,
  ClassroomDocument,
} from 'src/classroom/schemas/classroom.schema';
import { Student, StudentDocument } from 'src/student/schemas/student.schema';

export type AssignStudentMentorDocument = HydratedDocument<AssignStudentMentor>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class AssignStudentMentor {
  @Prop({
    required: true,
  })
  assignedAt: Date;

  @Prop({
    required: true,
  })
  studentId: string;

  @Prop({
    required: true,
  })
  studentName: string;

  @Prop({
    required: true,
  })
  studentStatus: string;

  @Prop({
    required: true,
  })
  studentAvatar: string;

  @Prop({
    required: true,
  })
  studentLanguages: string[];

  @Prop({
    required: true,
  })
  classroomName: string;

  @Prop()
  classroomDesc?: string;

  @Prop({
    required: true,
  })
  classroomLanguages: string[];

  @Prop({
    required: true,
  })
  classroomCover: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  })
  @Type(() => Classroom)
  mentor: ClassroomDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  @Type(() => Student)
  student: StudentDocument;
}

const AssignStudentMentorSchema =
  SchemaFactory.createForClass(AssignStudentMentor);

export { AssignStudentMentorSchema };
