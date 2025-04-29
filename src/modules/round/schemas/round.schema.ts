import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RoundDocument = Round & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Round {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cycle', required: true })
  cycle: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  })
  maleParticipant: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  })
  femaleParticipant: Types.ObjectId;

  @Prop({ default: 'pending', enum: ['pending', 'ongoing', 'completed'] })
  status: string;

  @Prop({ type: Boolean, default: null })
  maleLiked: boolean | null;

  @Prop({ type: Boolean, default: null })
  femaleLiked: boolean | null;

  @Prop({ default: false })
  isMatched: boolean;
}

export const RoundSchema = SchemaFactory.createForClass(Round);
