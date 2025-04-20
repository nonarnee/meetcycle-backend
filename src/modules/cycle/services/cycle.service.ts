import { Injectable } from '@nestjs/common';
import { Cycle } from '../schemas/cycle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CycleDocument } from '../schemas/cycle.schema';
import { Model } from 'mongoose';
import { Round, RoundDocument } from 'src/modules/round/schemas/round.schema';
import {
  Meeting,
  MeetingDocument,
} from 'src/modules/meeting/schemas/meeting.schema';
import { CreateCycleDto } from '../dtos/create-cycle.dto';
import { UpdateCycleDto } from '../dtos/update-cycle.dto';

@Injectable()
export class CycleService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<CycleDocument>,
    @InjectModel(Round.name) private roundModel: Model<RoundDocument>,
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
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

  async create(createCycleDto: CreateCycleDto): Promise<Cycle> {
    const newCycle = new this.cycleModel(createCycleDto);
    return newCycle.save();
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

  async setAllRoundsCompleted(
    id: string,
    completed: boolean,
  ): Promise<Cycle | null> {
    return this.cycleModel
      .findByIdAndUpdate(id, { allRoundsCompleted: completed }, { new: true })
      .exec();
  }

  // 사이클의 모든 라운드가 완료되었는지 확인하는 메서드
  async checkAllRoundsCompleted(cycleId: string): Promise<boolean> {
    const rounds = await this.roundModel.find({ cycle: cycleId }).exec();

    // 모든 라운드에서 양쪽 참가자가 liked 여부를 선택했는지 확인
    const allCompleted = rounds.every(
      (round) =>
        round.maleParticipantLiked !== null &&
        round.femaleParticipantLiked !== null,
    );

    if (allCompleted) {
      // 사이클 상태 업데이트
      await this.cycleModel
        .findByIdAndUpdate(
          cycleId,
          {
            allRoundsCompleted: true,
            status: 'completed',
            endTime: new Date(),
          },
          { new: true },
        )
        .exec();
    }

    return allCompleted;
  }

  // 호스트가 수동으로 다음 사이클로 진행
  async progressToNextCycle(
    meetingId: string,
    hostId: string,
  ): Promise<Cycle | null> {
    // 호스트 권한 확인
    const meeting = await this.meetingModel
      .findOne({
        _id: meetingId,
        host: hostId,
      })
      .exec();

    if (!meeting) {
      throw new Error('Meeting not found or you are not the host');
    }

    // 현재 사이클 완료 처리
    if (meeting.currentCycleOrder > 0) {
      const currentCycle = await this.cycleModel
        .findOne({
          meeting: meetingId,
          cycleOrder: meeting.currentCycleOrder,
        })
        .exec();

      if (currentCycle && currentCycle.status !== 'completed') {
        await this.cycleModel
          .findByIdAndUpdate(currentCycle._id, {
            status: 'completed',
            manualProgress: true,
            endTime: new Date(),
          })
          .exec();
      }
    }

    // 다음 사이클 번호
    const nextCycleOrder = meeting.currentCycleOrder + 1;

    // 총 사이클 수 확인
    if (nextCycleOrder > meeting.totalCycles) {
      // 모든 사이클 완료, 미팅 완료 처리
      await this.meetingModel
        .findByIdAndUpdate(meetingId, { status: 'completed' })
        .exec();

      return null;
    }

    // 다음 사이클 시작
    const nextCycle = await this.cycleModel
      .findOneAndUpdate(
        { meeting: meetingId, cycleOrder: nextCycleOrder },
        {
          status: 'ongoing',
          startTime: new Date(),
        },
        { new: true },
      )
      .exec();

    // 미팅의 현재 사이클 번호 업데이트
    await this.meetingModel
      .findByIdAndUpdate(meetingId, { currentCycleOrder: nextCycleOrder })
      .exec();

    // 해당 사이클의 모든 라운드를 'ongoing'으로 변경
    await this.roundModel
      .updateMany({ cycle: nextCycle?._id }, { status: 'ongoing' })
      .exec();

    return nextCycle;
  }
}
