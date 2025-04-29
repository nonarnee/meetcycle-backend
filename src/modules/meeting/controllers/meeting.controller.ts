import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MeetingService } from '../services/meeting.service';
import { Meeting } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { CreateMeetingResponse } from '../dtos/response/create-meeting.response';
import { MeetingResponse } from '../dtos/response/meeting.response';
import { CreateParticipantDto } from 'src/modules/participant/dtos/request/create-participant.request';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  findAll(): Promise<Meeting[]> {
    return this.meetingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MeetingResponse> {
    return this.meetingService.findOne(id);
  }

  @Post()
  create(
    @Body() createMeetingDto: CreateMeetingDto,
  ): Promise<CreateMeetingResponse> {
    return this.meetingService.create(createMeetingDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() meeting: Partial<Meeting>,
  ): Promise<Meeting | null> {
    return this.meetingService.update(id, meeting);
  }

  @Put(':id/start')
  start(@Param('id') id: string): Promise<Meeting | null> {
    return this.meetingService.start(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Meeting | null> {
    return this.meetingService.remove(id);
  }

  @Post(':id/participants')
  addParticipant(
    @Param('id') id: string,
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<Meeting> {
    return this.meetingService.addParticipant(id, createParticipantDto);
  }

  @Delete(':id/participants/:userId')
  removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Meeting | null> {
    return this.meetingService.removeParticipant(id, userId);
  }

  @Get('host/:hostId')
  getMeetingsByHost(@Param('hostId') hostId: string): Promise<Meeting[]> {
    return this.meetingService.getMeetingsByHost(hostId);
  }

  @Get('participant/:userId')
  getMeetingsByParticipant(
    @Param('userId') userId: string,
  ): Promise<Meeting[]> {
    return this.meetingService.getMeetingsByParticipant(userId);
  }
}
