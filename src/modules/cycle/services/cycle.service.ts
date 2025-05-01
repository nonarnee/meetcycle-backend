import { Injectable, NotFoundException } from '@nestjs/common';
import { Cycle } from '../schemas/cycle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CycleDocument } from '../schemas/cycle.schema';
import { Model } from 'mongoose';
import { UpdateCycleDto } from '../dtos/update-cycle.dto';
import { RoomService } from 'src/modules/room/services/room.service';
import { MeetingDocument } from 'src/modules/meeting/schemas/meeting.schema';
import { add } from 'date-fns';
import { ParticipantService } from 'src/modules/participant/services/participant.service';

@Injectable()
export class CycleService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<CycleDocument>,
    private roomService: RoomService,
    private participantService: ParticipantService,
  ) {}

  async findAll(): Promise<Cycle[]> {
    return this.cycleModel.find().populate('meeting').exec();
  }

  async findOne(id: string): Promise<Cycle | null> {
    return this.cycleModel.findById(id).populate('meeting').exec();
  }

  async findByMeeting(meetingId: string): Promise<Cycle[]> {
    return this.cycleModel.find({ meeting: meetingId }).exec();
  }

  async findByMeetingAndOrder(
    meetingId: string,
    order: number,
  ): Promise<CycleDocument | null> {
    return this.cycleModel.findOne({ meeting: meetingId, order }).exec();
  }

  async findCurrentByParticipantId(participantId: string) {
    const participant = await this.participantService.findOne(participantId);
    if (!participant) throw new NotFoundException('Participant not found');

    const room = await this.roomService.findOneByParticipant(participantId);

    if (!room) throw new NotFoundException('Room not found');

    const cycle = await this.cycleModel.findOne({
      $or: [{ room: room._id }],
    });

    if (!cycle) throw new NotFoundException('Cycle not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phone, _id, ...partner } =
      participant.gender === 'male'
        ? room.femaleParticipant
        : room.maleParticipant;

    return {
      cycleId: cycle._id.toString(),
      roomId: room._id.toString(),
      order: cycle.order,
      endTime: cycle.endTime,
      partner: {
        ...partner,
        id: _id.toString(),
      },
    };
  }

  async create(
    targetMeeting: MeetingDocument,
    order: number,
  ): Promise<CycleDocument> {
    let cycle = await this.cycleModel.findOne({
      meeting: targetMeeting._id,
      order,
    });

    if (!cycle) {
      cycle = new this.cycleModel({
        meeting: targetMeeting._id,
        order,
        endTime: add(new Date(), {
          minutes: targetMeeting.roomDurationMinutes,
        }),
      });
      cycle = await cycle.save();
    }

    return cycle;
  }

  async update(
    id: string,
    updateCycleDto: UpdateCycleDto,
  ): Promise<Cycle | null> {
    return this.cycleModel
      .findByIdAndUpdate(id, updateCycleDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Cycle | null> {
    return this.cycleModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(id: string, status: string): Promise<Cycle | null> {
    return this.cycleModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }
}
