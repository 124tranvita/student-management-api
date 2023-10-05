import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Mentor, MentorDocument } from 'src/mentor/schemas/mentor.schema';
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
    ref: 'Student',
    required: true,
  })
  @Type(() => Student)
  student: StudentDocument;
}

const AssignStudentMentorSchema =
  SchemaFactory.createForClass(AssignStudentMentor);

AssignStudentMentorSchema.index({ studentId: 'text', studentName: 'text' });

export { AssignStudentMentorSchema };
