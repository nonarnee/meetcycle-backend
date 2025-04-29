import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CycleDocument = Cycle & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Cycle {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meeting', required: true })
  meeting: Types.ObjectId;

  @Prop({ required: true })
  order: number;

  @Prop({ default: 'pending', enum: ['pending', 'ongoing', 'completed'] })
  status: string;

  @Prop({ default: false })
  allRoundsCompleted: boolean;
}

export const CycleSchema = SchemaFactory.createForClass(Cycle);
