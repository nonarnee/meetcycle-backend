import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cycle } from '../schemas/cycle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CycleDocument } from '../schemas/cycle.schema';
import { Model } from 'mongoose';
import { UpdateCycleDto } from '../dtos/update-cycle.dto';
import { RoundService } from 'src/modules/round/services/round.service';
import { MeetingDocument } from 'src/modules/meeting/schemas/meeting.schema';

@Injectable()
export class CycleService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<CycleDocument>,
    private roundService: RoundService,
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
        status: 'pending',
        allRoundsCompleted: false,
      });
      cycle = await cycle.save();
    }

    const createdRounds = await this.roundService.create(targetMeeting, cycle);

    if (!createdRounds) {
      throw new BadRequestException('Failed to create rounds');
    }

    cycle.status = 'ongoing';
    const updatedCycle = await cycle.save();

    return updatedCycle;
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
    const rounds = await this.roundService.findByCycle(cycleId);

    // 모든 라운드에서 양쪽 참가자가 liked 여부를 선택했는지 확인
    const allCompleted = rounds.every(
      (round) => round.maleLiked !== null && round.femaleLiked !== null,
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

  async completeCycle(
    meetingId: string,
    cycleOrder: number,
  ): Promise<CycleDocument> {
    const cycle = await this.cycleModel.findOne({
      meeting: meetingId,
      cycleOrder: cycleOrder,
    });

    if (!cycle) throw new NotFoundException('Cycle not found');

    // 모든 방 완료 처리
    await this.roundService.updateAllStatus(cycle._id, 'completed');

    // 사이클 완료 처리
    cycle.status = 'completed';

    return cycle.save();
  }
}
