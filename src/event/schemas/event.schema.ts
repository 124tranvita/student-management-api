import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from './student.schema';
import { Type } from 'class-transformer';
import { Mentor } from 'src/mentor/schemas/mentor.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Event {
  @Prop({
    reuqired: true,
  })
  title: string;

  @Prop({
    default: false,
  })
  allDay: boolean;

  @Prop({
    required: true,
  })
  start: Date;

  @Prop({
    required: true,
  })
  end: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  @Type(() => Student)
  student: Student;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  })
  @Type(() => Mentor)
  mentor: Mentor;
}

const EventSchema = SchemaFactory.createForClass(Event);

export { EventSchema };
