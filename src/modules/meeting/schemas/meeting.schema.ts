import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type MeetingDocument = Meeting & Document;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  host: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  maleParticipants: User[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  femaleParticipants: User[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  dateTime: Date;

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
