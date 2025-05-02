import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cycle, CycleSchema } from './schemas/cycle.schema';
import { CycleController } from './controllers/cycle.controller';
import { CycleService } from './services/cycle.service';
import { RoomModule } from '../room/room.module';
import { ParticipantModule } from '../participant/participant.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { MeetingModule } from '../meeting/meeting.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cycle.name, schema: CycleSchema }]),
    forwardRef(() => MeetingModule),
    RoomModule,
    ParticipantModule,
    EvaluationModule,
  ],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
