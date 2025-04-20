import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema()
export class Participant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  job: string;

  @Prop({ required: true })
  comment: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
