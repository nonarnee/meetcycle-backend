import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { UserService } from 'src/modules/user/services/user.service';
import { MeetingMapper } from '../mappers/meeting.mapper';
import { CreateParticipantDto } from 'src/modules/participant/dtos/request/create-participant.request';
import { saveAndLean } from 'src/common/helper/lean.helper';
import { MeetingPopulated } from 'src/common/types/populated/meeting-populated.type';
import { MeetingResponse } from '../dtos/response/meeting.response';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { CycleService } from 'src/modules/cycle/services/cycle.service';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    private userService: UserService,
    private participantService: ParticipantService,
    private cycleService: CycleService,
  ) {}

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel
      .find()
      .populate('host')
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .exec();
  }

  async findOne(id: string): Promise<MeetingResponse> {
    const meeting = await this.meetingModel
      .findById(id)
      .populate({ path: 'maleParticipants', options: { lean: true } })
      .populate({ path: 'femaleParticipants', options: { lean: true } })
      .lean<MeetingPopulated>()
      .exec();

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return MeetingMapper.toDetailResponse(meeting);
  }

  async create(createMeetingDto: CreateMeetingDto) {
    const hostUser = await this.userService.findOne(createMeetingDto.hostId);

    if (!hostUser) {
      throw new BadRequestException('Host user not found');
    }

    const meetingSchema = MeetingMapper.toSchema(createMeetingDto);
    const createdMeeting = await saveAndLean<MeetingDocument>(
      new this.meetingModel(meetingSchema),
    );

    return MeetingMapper.toCreateResponse(createdMeeting);
  }

  async update(id: string, meeting: Partial<Meeting>): Promise<Meeting | null> {
    return this.meetingModel
      .findByIdAndUpdate(id, meeting, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Meeting | null> {
    return this.meetingModel.findByIdAndDelete(id).exec();
  }

  async addParticipant(
    meetingId: string,
    createParticipantDto: CreateParticipantDto,
  ): Promise<Meeting> {
    const targetMeeting = await this.meetingModel.findById(meetingId).exec();

    if (!targetMeeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (targetMeeting.status !== 'pending') {
      throw new BadRequestException('Meeting is not pending');
    }

    this.validateParticipantLimit(targetMeeting, createParticipantDto);

    const createdParticipant =
      await this.participantService.create(createParticipantDto);

    const field =
      createParticipantDto.gender === 'male'
        ? 'maleParticipants'
        : 'femaleParticipants';

    targetMeeting[field].push(createdParticipant._id);

    return await targetMeeting.save();
  }

  async removeParticipant(
    meetingId: string,
    userId: string,
  ): Promise<Meeting | null> {
    const targetMeeting = await this.meetingModel.findById(meetingId).exec();

    if (!targetMeeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (targetMeeting.status !== 'pending') {
      throw new BadRequestException('Meeting is not pending');
    }

    const targetParticipant = await this.participantService.findOne(userId);

    if (!targetParticipant) {
      throw new NotFoundException('Participant not found');
    }

    const field =
      targetParticipant.gender === 'male'
        ? 'maleParticipants'
        : 'femaleParticipants';

    return this.meetingModel
      .findByIdAndUpdate(
        meetingId,
        { $pull: { [field]: targetParticipant._id } },
        { new: true },
      )
      .exec();
  }

  async start(id: string): Promise<Meeting | null> {
    const targetMeeting = await this.meetingModel.findById(id).exec();

    if (!targetMeeting) {
      throw new NotFoundException('Meeting not found');
    }
    if (targetMeeting.status !== 'pending') {
      throw new BadRequestException('Meeting is not pending');
    }

    await this.cycleService.create(targetMeeting, 0);

    targetMeeting.status = 'ongoing';
    targetMeeting.currentCycleOrder = 0;
    const updatedMeeting = await targetMeeting.save();

    return updatedMeeting;
  }

  async cancel(meetingId: string): Promise<MeetingDocument> {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('미팅을 찾을 수 없습니다');

    // 진행 중인 미팅이면 현재 사이클 종료
    if (meeting.status === 'ongoing') {
      await this.cycleService.completeCycle(
        meetingId,
        meeting.currentCycleOrder,
      );
    }

    // 미팅 상태 변경
    meeting.status = 'cancelled';
    return meeting.save();
  }

  async getMeetingsByHost(hostId: string): Promise<Meeting[]> {
    return this.meetingModel
      .find({ host: hostId })
      .populate('host')
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .exec();
  }

  async getMeetingsByParticipant(userId: string): Promise<Meeting[]> {
    return this.meetingModel
      .find({
        $or: [{ maleParticipants: userId }, { femaleParticipants: userId }],
      })
      .populate('host')
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .exec();
  }

  private validateParticipantLimit(
    meeting: Meeting,
    createParticipantDto: CreateParticipantDto,
  ) {
    const gender = createParticipantDto.gender;
    const field = gender === 'male' ? 'maleParticipants' : 'femaleParticipants';
    const limit = gender === 'male' ? meeting.maleCount : meeting.femaleCount;
    const participants = meeting[field];

    if (meeting.status !== 'pending') {
      throw new BadRequestException('Meeting is already started');
    }

    if (participants.length >= limit) {
      throw new BadRequestException(`${gender} participant is full`);
    }
  }
}
