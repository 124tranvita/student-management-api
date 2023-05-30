import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Mentor } from 'src/mentor/schemas/mentor.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  studentId: string;

  @Prop({
    required: true,
  })
  studentName: string;

  @Prop()
  studentDoB: Date;

  @Prop()
  studentAddress: string;

  @Prop({
    required: true,
    default: '0',
  })
  studentGender: string;

  @Prop()
  studentLanguage: string[];

  @Prop({
    required: true,
    default: 'Active',
  })
  status: string;

  @Prop({
    default: 'defaut-profile.jpg',
  })
  avatar: string;

  // Student belong more than one classroom
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true })
  @Type(() => Class)
  classrooms: Class[];

  // Student belong only one mentor
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true })
  @Type(() => Mentor)
  mentor: Mentor;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
