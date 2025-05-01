import { Schema } from '@nestjs/mongoose';

import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Evaluation {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Participant' })
  from: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Participant' })
  to: string;

  @Prop()
  result: boolean;
}
