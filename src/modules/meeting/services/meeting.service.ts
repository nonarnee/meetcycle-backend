import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { UserService } from 'src/modules/user/services/user.service';
import { MeetingMapper } from '../mappers/meeting.mapper';
import { saveAndLean } from 'src/common/helper/lean.helper';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel
      .find()
      .populate('host')
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .exec();
  }

  async findOne(id: string): Promise<Meeting | null> {
    return this.meetingModel
      .findById(id)
      .populate('host')
      .populate('maleParticipants')
      .populate('femaleParticipants')
      .exec();
  }

  async create(createMeetingDto: CreateMeetingDto) {
    const hostUser = await this.userService.findOne(createMeetingDto.hostId);

    if (!hostUser) {
      throw new BadRequestException('Host user not found');
    }

    const meetingSchema = MeetingMapper.toSchema(createMeetingDto, hostUser);
    const createdMeeting = await saveAndLean<MeetingDocument>(
      new this.meetingModel(meetingSchema),
    );

    return MeetingMapper.toResponse(createdMeeting, hostUser._id.toString());
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
    userId: string,
    gender: 'male' | 'female',
  ): Promise<Meeting | null> {
    const field = gender === 'male' ? 'maleParticipants' : 'femaleParticipants';
    return this.meetingModel
      .findByIdAndUpdate(
        meetingId,
        { $addToSet: { [field]: userId } },
        { new: true },
      )
      .exec();
  }

  async removeParticipant(
    meetingId: string,
    userId: string,
    gender: 'male' | 'female',
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
