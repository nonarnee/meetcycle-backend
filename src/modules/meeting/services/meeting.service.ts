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
import { MeetingMapper } from '../mappers/meeting.mapper';
import { saveAndLean } from 'src/common/helper/lean.helper';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { CycleService } from 'src/modules/cycle/services/cycle.service';
import { RoomService } from 'src/modules/room/services/room.service';
import { LeanDocument } from 'src/common/types/lean.type';
import { EvaluationService } from 'src/modules/evaluation/evaluation.service';

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

    // 다음 사이클 번호 계산
    const nextCycleOrder = meeting.currentCycleOrder + 1;

    // 마지막 사이클인지 확인
    if (nextCycleOrder > totalCycles) {
      meeting.status = 'completed';
      return meeting.save();
    }

    const participants = await this.participantService.findByMeeting(meetingId);
    const maleParticipants = participants.filter(
      (participant) => participant.gender === 'male',
    );
    const femaleParticipants = participants.filter(
      (participant) => participant.gender === 'female',
    );

    const pairs = this.computeOptimalMatching(
      maleParticipants.map((participant) => participant._id),
      femaleParticipants.map((participant) => participant._id),
      nextCycleOrder,
      totalCycles,
    );

    // 다음 사이클 생성
    const createdCycle = await this.cycleService.create(
      meeting,
      nextCycleOrder,
    );

    await Promise.all(
      pairs.map(async ({ male, female }) => {
        const createdRoom = await this.roomService.create({
          cycle: createdCycle._id,
          maleParticipant: male._id,
          femaleParticipant: female._id,
        });

        await Promise.all([
          this.participantService.update(male._id.toString(), {
            room: createdRoom._id,
          }),
          this.participantService.update(female._id.toString(), {
            room: createdRoom._id,
          }),
        ]);

        return;
      }),
    );

    // 미팅 정보 업데이트
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

  private computeOptimalMatching(
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
}
