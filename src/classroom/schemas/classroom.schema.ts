import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Mentor } from 'src/mentor/schemas/mentor.schema';
import { Student } from 'src/student/schemas/student.schema';

export type ClassroomDocument = HydratedDocument<Classroom>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Classroom {
  @Prop({
    required: true,
    unique: true,
    index: true,
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
  })
  createdAt: Date;

  @Prop()
  image: string;

  // Class belong one mentor
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Mentor',
  })
  @Type(() => Mentor)
  mentors?: Mentor[];

  // Classroom can have more than one students
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
  })
  @Type(() => Student)
  students?: Student[];
}

const ClassroomSchema = SchemaFactory.createForClass(Classroom);

ClassroomSchema.virtual('assignedMentors', {
  ref: 'Mentor',
  foreignField: 'classes',
  localField: '_id',
});

ClassroomSchema.virtual('mentorCnt', {
  ref: 'Mentor',
  foreignField: 'classes',
  localField: '_id',
  count: true,
});

ClassroomSchema.virtual('assignedStudents', {
  ref: 'Student',
  foreignField: 'classes',
  localField: '_id',
});

ClassroomSchema.virtual('studentCnt', {
  ref: 'Student',
  foreignField: 'classes',
  localField: '_id',
  count: true,
});

ClassroomSchema.virtual('assigned', {
  ref: 'Assign',
  foreignField: 'classroom',
  localField: '_id',
});

export { ClassroomSchema };
