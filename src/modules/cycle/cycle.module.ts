import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cycle, CycleSchema } from './schemas/cycle.schema';
import { CycleController } from './controllers/cycle.controller';
import { CycleService } from './services/cycle.service';
import { Round, RoundSchema } from '../round/schemas/round.schema';
import { Meeting, MeetingSchema } from '../meeting/schemas/meeting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cycle.name, schema: CycleSchema },
      { name: Round.name, schema: RoundSchema },
      { name: Meeting.name, schema: MeetingSchema },
    ]),
  ],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
