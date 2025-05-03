import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Evaluation } from './evaluation.schema';

import { EvaluationDocument } from './evaluation.schema';
import { Model } from 'mongoose';
import { LeanDocument } from 'src/common/types/lean.type';
import { getMutualMatches } from './utils/match';
import { ParticipantService } from '../participant/services/participant.service';
import { RoomService } from '../room/services/room.service';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<EvaluationDocument>,
    private roomService: RoomService,

    @Inject(forwardRef(() => ParticipantService))
    private participantService: ParticipantService,
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

  async findByMeeting(meetingId: string): Promise<LeanDocument<Evaluation>[]> {
    const rooms = await this.roomService.findByMeeting(meetingId);
    console.log('rooms', rooms);

    return this.evaluationModel
      .find({ roomId: { $in: rooms.map((room) => room._id.toString()) } })
      .populate('from')
      .populate('to')
      .lean()
      .exec();
  }

  async findByParticipant(
    participantId: string,
  ): Promise<LeanDocument<Evaluation>[]> {
    return this.evaluationModel
      .find({ $or: [{ from: participantId }, { to: participantId }] })
      .lean()
      .exec();
  }

  async findByParticipants(
    participants: string[],
  ): Promise<LeanDocument<Evaluation>[]> {
    return this.evaluationModel
      .find({
        $or: [
          ...participants.map((participant) => ({
            from: participant,
          })),
          ...participants.map((participant) => ({
            to: participant,
          })),
        ],
      })
      .lean()
      .exec();
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

  async getMatchResult(evaluations: Evaluation[]) {
    const matches = getMutualMatches(evaluations);

    // 1. 모든 ID 평탄화 후 중복 제거
    const allIds = [...new Set(matches.flat())];

    // 2. ID 기준으로 참가자 조회
    const participants = await this.participantService.findByIds(allIds);

    // 3. Map으로 매핑
    const participantMap = new Map(
      participants.map((p) => [p._id.toString(), p]),
    );

    // 4. 원래 쌍 형태로 재조합
    return matches.map(([idA, idB]) => [
      participantMap.get(idA)!,
      participantMap.get(idB)!,
    ]);
  }
}
