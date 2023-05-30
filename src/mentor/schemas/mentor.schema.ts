import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';

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
  mentorEmail: string;

  @Prop({
    required: true,
  })
  mentorName: string;

  @Prop({
    required: true,
    type: [String],
  })
  mentorLanguage: string[];

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

  @Prop()
  refreshToken: string;

  // Mentor may have more than on classroom
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  @Type(() => Class)
  classes: Class[];
}

const MentorSchema = SchemaFactory.createForClass(Mentor);

MentorSchema.virtual('classrooms', {
  ref: 'Class',
  foreignField: 'mentor',
  localField: '_id',
});

export { MentorSchema };
