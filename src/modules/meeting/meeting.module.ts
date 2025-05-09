import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from './controllers/meeting.controller';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import { MeetingService } from './services/meeting.service';
import { CycleModule } from 'src/modules/cycle/cycle.module';
import { UserModule } from 'src/modules/user/user.module';
import { ParticipantModule } from 'src/modules/participant/participant.module';
import { RoomModule } from 'src/modules/room/room.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EvaluationModule } from 'src/modules/evaluation/evaluation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    AuthModule,
    forwardRef(() => CycleModule),
    UserModule,
    ParticipantModule,
    RoomModule,
    EvaluationModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
