import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Evaluation } from './evaluation.schema';

import { EvaluationDocument } from './evaluation.schema';
import { Model } from 'mongoose';
import { LeanDocument } from 'src/common/types/lean.type';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<EvaluationDocument>,
  ) {}

  async findOneByParticipantAndRoom(
    participantId: string,
    roomId: string,
  ): Promise<LeanDocument<Evaluation> | null> {
    return this.evaluationModel.findOne({
      $or: [{ from: participantId }],
      roomId,
    });
  }

  async findByRooms(roomIds: string[]): Promise<LeanDocument<Evaluation>[]> {
    return this.evaluationModel
      .find({ roomId: { $in: roomIds } })
      .lean()
      .exec();
  }

  async create(evaluation: Evaluation): Promise<EvaluationDocument> {
    return await new this.evaluationModel(evaluation).save();
  }
}
