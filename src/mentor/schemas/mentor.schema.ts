import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Class } from 'src/class/schemas/class.schema';
import { Student } from 'src/student/schemas/student.schema';

export type MentorDocument = HydratedDocument<Mentor>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Mentor {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    type: [String],
  })
  languages: string[];

  @Prop({
    required: true,
  })
  createdAt: Date;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    default: 'Active',
  })
  status: string;

  @Prop({
    default:
      'https://www.iconarchive.com/download/i106655/diversity-avatars/avatars/native-man.512.png',
  })
  avatar: string;

  @Prop({
    required: true,
    default: '0',
  })
  education: string;

  @Prop({
    required: true,
  })
  specialized: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, default: 'mentor' })
  roles: Role;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  @Type(() => Class)
  classes: Class[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student' })
  @Type(() => Student)
  students: Student[];
}

const MentorSchema = SchemaFactory.createForClass(Mentor);

MentorSchema.virtual('classrooms', {
  ref: 'Class',
  foreignField: 'mentor',
  localField: '_id',
});

MentorSchema.virtual('events', {
  ref: 'Event',
  foreignField: 'mentor',
  localField: '_id',
});

export { MentorSchema };
