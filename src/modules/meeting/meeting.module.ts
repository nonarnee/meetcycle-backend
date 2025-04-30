import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from './controllers/meeting.controller';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import { MeetingService } from './services/meeting.service';
import { CycleModule } from 'src/modules/cycle/cycle.module';
import { UserModule } from 'src/modules/user/user.module';
import { ParticipantModule } from 'src/modules/participant/participant.module';
import { RoundModule } from 'src/modules/round/round.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    AuthModule,
    CycleModule,
    UserModule,
    ParticipantModule,
    RoundModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
