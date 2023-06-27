import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Student } from 'src/student/schemas/student.schema';

export type AssignDocument = HydratedDocument<Assign>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Assign {
  @Prop({
    required: true,
  })
  assignedAt: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Classroom',
    required: true,
  })
  @Type(() => Classroom)
  classroom: Classroom;

  // Classroom have student
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  @Type(() => Student)
  student: Student;
}

const AssingSchema = SchemaFactory.createForClass(Assign);

export { AssingSchema };
