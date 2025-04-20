import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Meeting } from 'src/modules/meeting/schemas/meeting.schema';

export type CycleDocument = Cycle & Document;

@Schema({ timestamps: true })
export class Cycle {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meeting', required: true })
  meeting: Meeting;

  @Prop({ required: true })
  order: number;

  @Prop({ default: 'pending', enum: ['pending', 'ongoing', 'completed'] })
  status: string;

  @Prop({ default: false })
  allRoundsCompleted: boolean;
}

export const CycleSchema = SchemaFactory.createForClass(Cycle);
