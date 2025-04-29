import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type MeetingDocument = Meeting & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  host: Types.ObjectId;

  @Prop({ required: true })
  maleCount: number;

  @Prop({ required: true })
  femaleCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Participant' }] })
  maleParticipants: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Participant' }] })
  femaleParticipants: Types.ObjectId[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  dateTime: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'ongoing', 'completed', 'cancelled'],
  })
  status: string;

  @Prop({ default: 10 })
  roundDurationMinutes: number;

  @Prop({ default: 0 })
  totalCycles: number;

  @Prop({ default: 0 })
  currentCycleOrder: number;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
