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
    default: 'Active',
  })
  status: string;

  @Prop({
    default:
      'https://www.les-soins-infirmiers.fr/wp-content/uploads/2018/04/default-avatar-woman.png',
  })
  avatar: string;

  // Student belong more than one classroom
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Class',
    required: true,
  })
  @Type(() => Class)
  classes: Class[];

  // Student belong only one mentor
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true })
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
