import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Round, RoundDocument } from '../schemas/round.schema';

@Injectable()
export class RoundService {
  constructor(
    @InjectModel(Round.name) private roundModel: Model<RoundDocument>,
  ) {}

  async findAll(): Promise<Round[]> {
    return this.roundModel
      .find()
      .populate('meeting')
      .populate('participant1')
      .populate('participant2')
      .exec();
  }

  async findOne(id: string): Promise<Round | null> {
    return this.roundModel
      .findById(id)
      .populate('meeting')
      .populate('participant1')
      .populate('participant2')
      .exec();
  }

  async create(round: Round): Promise<Round> {
    const newRound = new this.roundModel(round);
    return newRound.save();
  }

  async update(id: string, round: Partial<Round>): Promise<Round | null> {
    return this.roundModel.findByIdAndUpdate(id, round, { new: true }).exec();
  }

  async remove(id: string): Promise<Round | null> {
    return this.roundModel.findByIdAndDelete(id).exec();
  }

  async findByMeeting(meetingId: string): Promise<Round[]> {
    return this.roundModel
      .find({ meeting: meetingId })
      .populate('meeting')
      .populate('participant1')
      .populate('participant2')
      .exec();
  }

  async findByParticipant(userId: string): Promise<Round[]> {
    return this.roundModel
      .find({
        $or: [{ participant1: userId }, { participant2: userId }],
      })
      .populate('meeting')
      .populate('participant1')
      .populate('participant2')
      .exec();
  }

  async updateLiked(
    id: string,
    gender: 'male' | 'female',
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
}
