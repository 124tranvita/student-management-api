import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Mentor } from 'src/mentor/schemas/mentor.schema';
import { Student } from 'src/student/schemas/student.schema';

export type ClassDocument = HydratedDocument<Class>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Class {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  name: string;

  @Prop()
  description: string;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  })
  @Type(() => Mentor)
  mentor: Mentor;

  // Classroom can have more than one students
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
  })
  @Type(() => Student)
  students: Student[];
}

const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.virtual('members', {
  ref: 'Student',
  foreignField: 'classes',
  localField: '_id',
});

export { ClassSchema };
