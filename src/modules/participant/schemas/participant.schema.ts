import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ timestamps: true })
export class Participant {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  job: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
