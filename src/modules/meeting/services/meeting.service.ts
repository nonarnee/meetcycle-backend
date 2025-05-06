import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { UserService } from 'src/modules/user/services/user.service';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { CycleService } from 'src/modules/cycle/services/cycle.service';
import { RoomService } from 'src/modules/room/services/room.service';
import { LeanDocument } from 'src/common/types/lean.type';
import { EvaluationService } from 'src/modules/evaluation/evaluation.service';
import { MeetingMapper } from '../mappers/meeting.mapper';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    private userService: UserService,
    private participantService: ParticipantService,
    private roomService: RoomService,
    private evaluationService: EvaluationService,

    @Inject(forwardRef(() => CycleService))
    private cycleService: CycleService,
  ) {}

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().populate('host').exec();
  }

  async findOne(id: string): Promise<LeanDocument<Meeting> | null> {
    return await this.meetingModel.findById(id).lean().exec();
  }

  async findResults(id: string) {
    const participants = await this.participantService.findByMeeting(id);
    const evaluations = await this.evaluationService.findByParticipants(
      participants.map((participant) => participant._id.toString()),
    );
    return (await this._getMatchResult(evaluations)) ?? [];
  }

  async findByHostId(hostId: string) {
    return await this.meetingModel
      .findOne({ host: hostId, status: 'ongoing' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findByParticipantId(participantId: string) {
    const participant = await this.participantService.findOne(participantId);

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const meeting = await this.meetingModel
      .findById(participant.meeting)
      .lean()
      .exec();

    if (!meeting) {
      throw new NotFoundException('미팅을 찾을 수 없습니다');
    }

    return meeting;
  }

  async findEvaluations(meetingId: string) {
    return await this.evaluationService.findByMeeting(meetingId);
  }

  async findCurrentCycle(meetingId: string) {
    const meeting = await this.meetingModel
      .findById(new Types.ObjectId(meetingId))
      .exec();

    if (!meeting) {
      throw new BadRequestException('Meeting not found');
    }

    return await this.cycleService.findByMeetingAndOrder(
      meeting._id.toString(),
      meeting.currentCycleOrder,
    );
  }

  async findCurrentEvaluations(meetingId: string) {
    const meeting = await this.meetingModel
      .findById(new Types.ObjectId(meetingId))
      .exec();

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const currentRooms = await this.findCurrentRooms(meetingId);

    return await this.evaluationService.findByRooms(
      currentRooms.map((room) => room._id.toString()),
    );
  }

  async findCurrentRooms(id: string) {
    const meeting = await this.meetingModel
      .findById(new Types.ObjectId(id))
      .exec();

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const currentCycle = await this.cycleService.findByMeetingAndOrder(
      meeting._id.toString(),
      meeting.currentCycleOrder,
    );

    if (!currentCycle) {
      throw new NotFoundException('Current cycle not found');
    }

    return await this.roomService.findByCycle(currentCycle);
  }

  async create(
    createMeetingDto: CreateMeetingDto,
  ): Promise<
    import('../dtos/response/create-meeting.response').CreateMeetingResponse
  > {
    const hostUser = await this.userService.findOne(createMeetingDto.hostId);
    if (!hostUser) {
      throw new BadRequestException('Host user not found');
    }
    const meetingSchema = MeetingMapper.toSchema(createMeetingDto);
    const createdMeeting = await this.meetingModel.create(meetingSchema);
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

  async start(id: string): Promise<Meeting | null> {
    const targetMeeting = await this.meetingModel.findById(id).exec();
    if (!targetMeeting) {
      throw new NotFoundException('Meeting not found');
    }
    if (targetMeeting.status !== 'pending') {
      throw new BadRequestException('Meeting is not pending');
    }
    targetMeeting.status = 'ongoing';
    await targetMeeting.save();
    await this.cycleService.create(targetMeeting, 0);
    return await this.advanceToNextCycle(id);
  }

  async cancel(meetingId: string): Promise<MeetingDocument> {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('미팅을 찾을 수 없습니다');

    meeting.status = 'cancelled';
    return meeting.save();
  }

  async advanceToNextCycle(meetingId: string): Promise<MeetingDocument> {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('미팅을 찾을 수 없습니다');
    if (meeting.status !== 'ongoing') {
      throw new BadRequestException('진행 중인 미팅이 아닙니다');
    }
    const totalCycles = Math.max(meeting.maleCount, meeting.femaleCount);
    const nextCycleOrder = meeting.currentCycleOrder + 1;
    if (nextCycleOrder > totalCycles) {
      meeting.status = 'completed';
      return meeting.save();
    }
    const participants = await this.participantService.findByMeeting(meetingId);
    const maleParticipants = participants.filter((p) => p.gender === 'male');
    const femaleParticipants = participants.filter(
      (p) => p.gender === 'female',
    );
    const pairs = this._computeOptimalMatching(
      maleParticipants.map((p) => p._id),
      femaleParticipants.map((p) => p._id),
      nextCycleOrder,
      totalCycles,
    );
    const createdCycle = await this.cycleService.create(
      meeting,
      nextCycleOrder,
    );
    await this._createRoomsAndUpdateParticipants(pairs, createdCycle._id);
    meeting.currentCycleOrder = nextCycleOrder;
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

  private _computeOptimalMatching(
    males: Types.ObjectId[],
    females: Types.ObjectId[],
    cycleOrder: number,
    totalCycles: number,
  ): Array<{ male: Types.ObjectId; female: Types.ObjectId }> {
    const matches: { male: Types.ObjectId; female: Types.ObjectId }[] = [];
    for (let maleIndex = 0; maleIndex < totalCycles; maleIndex++) {
      const femaleIndex = (maleIndex + cycleOrder) % totalCycles;
      matches.push({
        male: males[maleIndex],
        female: females[femaleIndex],
      });
    }
    return matches;
  }

  private async _createRoomsAndUpdateParticipants(
    pairs: Array<{ male: Types.ObjectId; female: Types.ObjectId }>,
    cycleId: Types.ObjectId,
  ) {
    await Promise.all(
      pairs.map(async ({ male, female }) => {
        const createdRoom = await this.roomService.create({
          cycle: cycleId,
          maleParticipant: male,
          femaleParticipant: female,
        });
        await Promise.all([
          this.participantService.update(male.toString(), {
            room: createdRoom._id,
          }),
          this.participantService.update(female.toString(), {
            room: createdRoom._id,
          }),
        ]);
      }),
    );
  }

  private async _getMatchResult(evaluations: any[]) {
    if (!this.evaluationService.getMatchResult) return [];
    return this.evaluationService.getMatchResult(evaluations);
  }
}
