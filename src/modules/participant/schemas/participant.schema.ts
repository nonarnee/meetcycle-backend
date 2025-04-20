import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ timestamps: true })
export class Participant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  job: string;

  @Prop({ required: true })
  comment: string;

  @Prop()
  userId: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
