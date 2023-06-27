import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Mentor } from 'src/mentor/schemas/mentor.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
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
  name: string;

  @Prop()
  doB: Date;

  @Prop()
  address: string;

  @Prop({
    required: true,
    default: '0',
  })
  gender: string;

  @Prop()
  languages: string[];

  @Prop({
    required: true,
    default: '1',
  })
  status: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/4128/4128349.png',
  })
  avatar?: string;

  @Prop({
    default:
      'https://img.freepik.com/free-vector/flat-geometric-background_23-2148957201.jpg',
  })
  cover?: string;

  @Prop({
    required: true,
  })
  createdAt: Date;

  // Student belong more than one classroom
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Class',
  })
  @Type(() => Class)
  classes: Class[];

  // Student belong only one mentor
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' })
  @Type(() => Mentor)
  mentor: Mentor;
}

const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('classroom', {
  ref: 'Class',
  foreignField: 'students',
  localField: '_id',
});

export { StudentSchema };
