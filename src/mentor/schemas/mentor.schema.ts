import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
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
    default: '1',
  })
  status: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/4128/4128405.png',
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' })
  @Type(() => Classroom)
  classroom: Classroom[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student' })
  @Type(() => Student)
  students: Student[];
}

const MentorSchema = SchemaFactory.createForClass(Mentor);

MentorSchema.index({ email: 'text', name: 'text' });

/** STATIC FUNCTIONS */
MentorSchema.statics.countStudent = async function (id) {
  const stats = await this.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $addFields: {
        totalMentors: { $size: '$students' },
      },
    },
  ]);

  return stats;
};

/** Prehook */
MentorSchema.post(/^findOneAnd/, async function (doc, next) {
  // const result = await doc.constructor.countStudent(doc._id);
  // if (result && result.length > 0) {
  //   doc = result[0];
  // }
  // console.log(doc);
  // console.log(doc);
  next();
});

export { MentorSchema };
