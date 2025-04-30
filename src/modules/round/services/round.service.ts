import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Round, RoundDocument } from '../schemas/round.schema';
import { Gender } from 'src/common/types/gender.type';
import { MeetingDocument } from 'src/modules/meeting/schemas/meeting.schema';
import { CycleDocument } from 'src/modules/cycle/schemas/cycle.schema';

@Injectable()
export class RoundService {
  constructor(
    @InjectModel(Round.name) private roundModel: Model<RoundDocument>,
  ) {}

  async findAll(): Promise<Round[]> {
    return this.roundModel
      .find()
      .populate('meeting')
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }

  async findOne(id: string): Promise<Round | null> {
    return this.roundModel
      .findById(id)
      .populate('meeting')
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }

  async findByCycle(cycle: CycleDocument) {
    return this.roundModel
      .find({ cycle: cycle._id })
      .populate({
        path: 'maleParticipant',
        select: '-phone',
      })
      .populate({
        path: 'femaleParticipant',
        select: '-phone',
      })
      .lean()
      .exec();
  }

  async create(meeting: MeetingDocument, cycle: CycleDocument) {
    const maleParticipants = meeting.maleParticipants;
    const femaleParticipants = meeting.femaleParticipants;

    const matches = this.computeOptimalMatching(
      maleParticipants,
      femaleParticipants,
      cycle.order,
      meeting.totalCycles,
    );

    const roomPromises = matches.map((match, index) => {
      return this.roundModel.create({
        cycle: cycle._id,
        roomNumber: index + 1,
        maleParticipant: match.male,
        femaleParticipant: match.female,
        status: 'ongoing',
      });
    });

    return await Promise.all(roomPromises);
  }

  async update(id: string, round: Partial<Round>): Promise<Round | null> {
    return this.roundModel.findByIdAndUpdate(id, round, { new: true }).exec();
  }

  async updateAllStatus(cycleId: Types.ObjectId, status: string) {
    return this.roundModel.updateMany({ cycle: cycleId }, { status }).exec();
  }

  async remove(id: string): Promise<Round | null> {
    return this.roundModel.findByIdAndDelete(id).exec();
  }

  async findByMeeting(meetingId: string): Promise<Round[]> {
    return this.roundModel
      .find({ meeting: meetingId })
      .populate('meeting')
      .populate({
        path: 'maleParticipant',
        select: '-phone',
      })
      .populate({
        path: 'femaleParticipant',
        select: '-phone',
      })
      .exec();
  }

  async findByParticipant(userId: string): Promise<Round[]> {
    return this.roundModel
      .find({
        $or: [{ maleParticipant: userId }, { femaleParticipant: userId }],
      })
      .populate('meeting')
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }

  async updateLiked(
    id: string,
    gender: Gender,
    liked: boolean,
  ): Promise<Round | null> {
    const field = gender === 'male' ? 'maleLiked' : 'femaleLiked';
    const round = await this.roundModel
      .findByIdAndUpdate(id, { [field]: liked }, { new: true })
      .exec();

    if (round) {
      round[field] = liked;

      // 양쪽 모두 liked가 true일 경우 매치 성공
      if (round.maleLiked && round.femaleLiked) {
        round.isMatched = true;
        await round.save();
      }
    }

    return round;
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
