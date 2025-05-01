import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RoomDocument = Room & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Room {
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
}

export const RoomSchema = SchemaFactory.createForClass(Room);
