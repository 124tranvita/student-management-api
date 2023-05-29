import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  className: string;

  @Prop()
  classDescription: string;

  @Prop({
    required: true,
  })
  classMembers: number;

  @Prop({
    required: true,
  })
  classLanguage: string[];

  @Prop({
    required: true,
  })
  createdAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
