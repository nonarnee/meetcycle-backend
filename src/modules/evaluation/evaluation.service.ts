import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Evaluation } from './evaluation.schema';

import { EvaluationDocument } from './evaluation.schema';
import { Model } from 'mongoose';
import { LeanDocument } from 'src/common/types/lean.type';
import { getMutualMatches } from './utils/match';
import { ParticipantService } from '../participant/services/participant.service';
import { RoomService } from '../room/services/room.service';
import { Participant } from 'src/modules/participant/schemas/participant.schema';

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
    const matches = this._getMutualMatches(evaluations);
    const allIds = this._flattenAndDedup(matches);
    const participants = await this._findParticipantsByIds(allIds);
    const participantMap = this._toParticipantMap(participants);
    return this._remapMatches(matches, participantMap);
  }

  private _getMutualMatches(evaluations: Evaluation[]) {
    return getMutualMatches(evaluations);
  }

  private _flattenAndDedup(matches: string[][]) {
    return [...new Set(matches.flat())];
  }

  private async _findParticipantsByIds(ids: string[]) {
    return this.participantService.findByIds(ids);
  }

  private _toParticipantMap(participants: LeanDocument<Participant>[]) {
    return new Map(participants.map((p) => [p._id.toString(), p]));
  }

  private _remapMatches(
    matches: string[][],
    participantMap: Map<string, LeanDocument<Participant>>,
  ) {
    return matches.map(([idA, idB]) => [
      participantMap.get(idA)!,
      participantMap.get(idB)!,
    ]);
  }
}
