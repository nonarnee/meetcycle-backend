import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Meeting } from '../../meeting/schemas/meeting.schema';
import { Cycle } from '../../cycle/schemas/cycle.schema';

export type RoundDocument = Round & Document;

@Schema({ timestamps: true })
export class Round {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meeting', required: true })
  meeting: Meeting;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cycle', required: true })
  cycle: Cycle;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  maleParticipant: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  femaleParticipant: User;

  @Prop({ default: 'pending', enum: ['pending', 'ongoing', 'completed'] })
  status: string;

  @Prop({ default: null })
  maleParticipantLiked: boolean | null;

  @Prop({ default: null })
  femaleParticipantLiked: boolean | null;

  @Prop({ default: false })
  isMatched: boolean;

  @Prop({ default: null })
  completedAt: Date | null;
}

export const RoundSchema = SchemaFactory.createForClass(Round);
