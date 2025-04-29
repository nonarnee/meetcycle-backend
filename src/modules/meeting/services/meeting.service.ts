import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { UserService } from 'src/modules/user/services/user.service';
import { MeetingMapper } from '../mappers/meeting.mapper';
import { saveAndLean } from 'src/common/helper/lean.helper';
import { MeetingPopulated } from 'src/common/types/populated/meeting-populated.type';
import { MeetingResponse } from '../dtos/response/meeting.response';
import { Gender } from 'src/common/types/gender.type';
import { CreateParticipantDto } from 'src/modules/participant/dtos/request/create-participant.request';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { ParticipantMapper } from 'src/modules/participant/mapper/participant.mapper';
import { ParticipantResponse } from 'src/modules/participant/dtos/response/participant.response';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    private userService: UserService,
    private participantService: ParticipantService,
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
      throw new BadRequestException('Meeting not found');
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
  ): Promise<ParticipantResponse> {
    const field =
      createParticipantDto.gender === 'male'
        ? 'maleParticipants'
        : 'femaleParticipants';

    const createdParticipant =
      await this.participantService.create(createParticipantDto);

    if (!createdParticipant) {
      throw new BadRequestException('Participant not created');
    }

    const updatedMeeting = await this.meetingModel
      .findByIdAndUpdate(
        meetingId,
        { $addToSet: { [field]: createdParticipant._id } },
        { new: true },
      )
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .lean<MeetingPopulated>()
      .exec();

    if (!updatedMeeting) {
      throw new BadRequestException('Meeting not found');
    }

    console.log(createdParticipant);

    return ParticipantMapper.toResponse(createdParticipant);
  }

  async removeParticipant(
    meetingId: string,
    userId: string,
    gender: Gender,
  ): Promise<Meeting | null> {
    const field = gender === 'male' ? 'maleParticipants' : 'femaleParticipants';
    return this.meetingModel
      .findByIdAndUpdate(
        meetingId,
        { $pull: { [field]: userId } },
        { new: true },
      )
      .exec();
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
}
