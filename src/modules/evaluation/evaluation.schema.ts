import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type EvaluationDocument = Evaluation & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Evaluation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Participant' })
  from: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Participant' })
  to: string;

  @Prop()
  result: boolean;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
