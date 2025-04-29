import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from './controllers/meeting.controller';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import { MeetingService } from './services/meeting.service';
import { UserModule } from 'src/modules/user/user.module';
import { ParticipantModule } from 'src/modules/participant/participant.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    UserModule,
    ParticipantModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
