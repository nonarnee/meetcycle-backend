import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cycle } from '../schemas/cycle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CycleDocument } from '../schemas/cycle.schema';
import { Model } from 'mongoose';
import { UpdateCycleDto } from '../dtos/update-cycle.dto';
import { RoomService } from 'src/modules/room/services/room.service';
import { MeetingDocument } from 'src/modules/meeting/schemas/meeting.schema';
import { add } from 'date-fns';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { EvaluationService } from 'src/modules/evaluation/evaluation.service';
import { LeanDocument } from 'src/common/types/lean.type';
import { MeetingService } from 'src/modules/meeting/services/meeting.service';
import { Participant } from 'src/modules/participant/schemas/participant.schema';
import { PopulatedRoom } from 'src/modules/room/interfaces/populated-room.interface';

@Injectable()
export class CycleService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<CycleDocument>,

    @Inject(forwardRef(() => MeetingService))
    private meetingService: MeetingService,

    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,

    @Inject(forwardRef(() => ParticipantService))
    private participantService: ParticipantService,

    @Inject(forwardRef(() => EvaluationService))
    private evaluationService: EvaluationService,
  ) {}

  async findAll(): Promise<Cycle[]> {
    return this.cycleModel
      .find()
      .populate('meeting', { lean: true })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<LeanDocument<Cycle> | null> {
    return this.cycleModel.findById(id).populate('meeting').lean().exec();
  }

  async findByMeeting(meetingId: string): Promise<LeanDocument<Cycle>[]> {
    return this.cycleModel.find({ meeting: meetingId }).lean().exec();
  }

  async findByMeetingAndOrder(
    meetingId: string,
    order: number,
  ): Promise<CycleDocument | null> {
    return this.cycleModel.findOne({ meeting: meetingId, order }).lean().exec();
  }

  async findCurrentByParticipantId(participantId: string) {
    const participant = await this._findParticipantOrThrow(participantId);
    const room = await this._findRoomOrThrow(participantId);
    const cycle = await this._findCycleOrThrow(room.cycle._id.toString());
    const meeting = await this._findMeetingOrThrow(
      cycle.meeting._id.toString(),
    );
    const evaluation = await this._findEvaluation(
      participantId,
      room._id.toString(),
    );
    const { partner, partnerId, me, myId } = this._extractPartnerAndMe(
      participant,
      room,
    );
    return {
      status: meeting.status,
      cycleId: cycle._id.toString(),
      roomId: room._id.toString(),
      order: cycle.order,
      endTime: cycle.endTime,
      partner: {
        ...partner,
        _id: partnerId.toString(),
      },
      me: {
        ...me,
        _id: myId.toString(),
      },
      result: evaluation ? evaluation.result : null,
    };
  }

  private async _findParticipantOrThrow(participantId: string) {
    const participant = await this.participantService.findOne(participantId);
    if (!participant) throw new NotFoundException('Participant not found');
    return participant;
  }

  private async _findRoomOrThrow(participantId: string) {
    const room = await this.roomService.findOneByParticipant(participantId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  private async _findCycleOrThrow(cycleId: string) {
    const cycle = await this.findOne(cycleId);
    if (!cycle) throw new NotFoundException('Cycle not found');
    return cycle;
  }

  private async _findMeetingOrThrow(meetingId: string) {
    const meeting = await this.meetingService.findOne(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');
    return meeting;
  }

  private async _findEvaluation(participantId: string, roomId: string) {
    return this.evaluationService.findOneByParticipantAndRoom(
      participantId,
      roomId,
    );
  }

  private _extractPartnerAndMe(
    participant: LeanDocument<Participant>,
    room: PopulatedRoom,
  ) {
    const isMale = participant.gender === 'male';
    const partnerParticipant = isMale
      ? room.femaleParticipant
      : room.maleParticipant;
    const { _id: partnerId, ...partner } = partnerParticipant;
    const { _id: myId, ...me } = participant;
    return { partner, partnerId, me, myId };
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
