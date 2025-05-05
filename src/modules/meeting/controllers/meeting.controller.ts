import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MeetingService } from '../services/meeting.service';
import { Meeting } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { CreateMeetingResponse } from '../dtos/response/create-meeting.response';
import { CreateParticipantDto } from 'src/modules/participant/dtos/request/create-participant.request';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/types/user-role.type';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthResponse } from 'src/modules/auth/types/auth-response.type';
import { LeanDocument } from 'src/common/types/lean.type';
import { ParticipantService } from 'src/modules/participant/services/participant.service';

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly authService: AuthService,
    private readonly participantService: ParticipantService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findAll(): Promise<Meeting[]> {
    return this.meetingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LeanDocument<Meeting> | null> {
    return this.meetingService.findOne(id);
  }

  @Get(':id/current-cycle')
  findCurrentCycle(@Param('id') id: string) {
    return this.meetingService.findCurrentCycle(id);
  }

  @Get(':id/current-evaluations')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findCurrentEvaluations(@Param('id') id: string) {
    return this.meetingService.findCurrentEvaluations(id);
  }

  @Get(':id/evaluations')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findEvaluations(@Param('id') id: string) {
    return this.meetingService.findEvaluations(id);
  }

  @Get(':id/participants')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findParticipants(@Param('id') id: string) {
    return this.participantService.findByMeeting(id);
  }

  @Get(':id/results')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findResults(@Param('id') id: string) {
    return this.meetingService.findResults(id);
  }

  @Get('host/:hostId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findByHostId(@Param('hostId') hostId: string) {
    return this.meetingService.findByHostId(hostId);
  }

  @Get('participant/:participantId')
  @Public()
  findByParticipantId(@Param('participantId') participantId: string) {
    return this.meetingService.findByParticipantId(participantId);
  }

  @Get(':id/rooms/current')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findCurrentRooms(@Param('id') id: string) {
    return this.meetingService.findCurrentRooms(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.HOST)
  create(
    @Body() createMeetingDto: CreateMeetingDto,
  ): Promise<CreateMeetingResponse> {
    return this.meetingService.create(createMeetingDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  update(
    @Param('id') id: string,
    @Body() meeting: Partial<Meeting>,
  ): Promise<Meeting | null> {
    return this.meetingService.update(id, meeting);
  }

  @Put(':id/start')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  start(@Param('id') id: string): Promise<Meeting | null> {
    return this.meetingService.start(id);
  }

  @Put(':id/next-cycle')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  advanceToNextCycle(@Param('id') id: string) {
    return this.meetingService.advanceToNextCycle(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  remove(@Param('id') id: string): Promise<Meeting | null> {
    return this.meetingService.remove(id);
  }

  @Post(':id/participant')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async addParticipant(
    @Param('id') id: string,
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<AuthResponse> {
    const createdParticipant = await this.participantService.create(
      createParticipantDto,
      id,
    );

    const accessToken = await this.authService.signParticipant(
      createdParticipant._id.toString(),
    );

    return {
      access_token: accessToken,
      id: createdParticipant._id.toString(),
      nickname: createdParticipant.nickname,
      role: UserRole.PARTICIPANT,
    };
  }

  @Get('host/:hostId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
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
