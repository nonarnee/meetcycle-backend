import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type MeetingDocument = Meeting & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  host: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  maleCount: number;

  @Prop({ required: true })
  femaleCount: number;

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
  roomDurationMinutes: number;

  @Prop({ default: 0 })
  currentCycleOrder: number;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
