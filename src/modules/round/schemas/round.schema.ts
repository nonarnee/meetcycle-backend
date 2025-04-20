import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Meeting } from '../../meeting/schemas/meeting.schema';
import { Cycle } from '../../cycle/schemas/cycle.schema';
import { Participant } from '../../participant/schemas/participant.schema';

export type RoundDocument = Round & Document;

@Schema({ timestamps: true })
export class Round {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meeting', required: true })
  meeting: Meeting;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cycle', required: true })
  cycle: Cycle;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  })
  maleParticipant: Participant;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  })
  femaleParticipant: Participant;

  @Prop({ default: 'pending', enum: ['pending', 'ongoing', 'completed'] })
  status: string;

  @Prop({ type: Boolean, default: null })
  maleLiked: boolean | null;

  @Prop({ type: Boolean, default: null })
  femaleLiked: boolean | null;

  @Prop({ default: false })
  isMatched: boolean;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;
}

export const RoundSchema = SchemaFactory.createForClass(Round);
