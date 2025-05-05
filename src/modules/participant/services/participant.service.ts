import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Participant,
  ParticipantDocument,
} from '../schemas/participant.schema';
import { CreateParticipantDto } from '../dtos/request/create-participant.request';
import { UpdateParticipantDto } from '../dtos/request/update-participant.request';
import { LeanDocument } from 'src/common/types/lean.type';
import { EvaluationService } from 'src/modules/evaluation/evaluation.service';
import { Evaluation } from 'src/modules/evaluation/evaluation.schema';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,

    @Inject(forwardRef(() => EvaluationService))
    private evaluationService: EvaluationService,
  ) {}

  async findAll(): Promise<Participant[]> {
    return this.participantModel.find().exec();
  }

  async findOne(id: string): Promise<LeanDocument<Participant> | null> {
    return this.participantModel.findById(id).lean().exec();
  }

  async findByIds(ids: string[]): Promise<LeanDocument<Participant>[]> {
    return this.participantModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
  }

  async findByGender(gender: string): Promise<Participant[]> {
    return this.participantModel.find({ gender }).exec();
  }

  async findByMeeting(meetingId: string): Promise<LeanDocument<Participant>[]> {
    return this.participantModel.find({ meeting: meetingId }).lean().exec();
  }

  async getResult(id: string) {
    const participant = await this._findParticipantOrThrow(id);
    const evaluations = await this._findEvaluationsByParticipant(
      participant._id.toString(),
    );
    const myLikes = this._getMyLikes(evaluations, participant._id.toString());
    const likesMe = this._getLikesMe(evaluations, participant._id.toString());
    const matched = this._getMatched(myLikes, likesMe);
    return this._findParticipantsByIds(matched);
  }

  private async _findParticipantOrThrow(id: string) {
    const participant = await this.findOne(id);
    if (!participant) throw new NotFoundException('Participant not found');
    return participant;
  }

  private async _findEvaluationsByParticipant(participantId: string) {
    return this.evaluationService.findByParticipant(participantId);
  }

  private _getMyLikes(evaluations: Evaluation[], participantId: string) {
    return evaluations
      .filter((evaluation) => evaluation.from.toString() === participantId)
      .map((evaluation) => evaluation.to.toString());
  }

  private _getLikesMe(evaluations: Evaluation[], participantId: string) {
    return evaluations
      .filter((evaluation) => evaluation.to.toString() === participantId)
      .map((evaluation) => evaluation.from.toString());
  }

  private _getMatched(myLikes: string[], likesMe: string[]) {
    return myLikes.filter((like) => likesMe.includes(like));
  }

  private _findParticipantsByIds(ids: string[]) {
    return this.participantModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
  }

  async create(
    createParticipantDto: CreateParticipantDto,
    meetingId: string,
  ): Promise<ParticipantDocument> {
    const participant = new this.participantModel({
      ...createParticipantDto,
      meeting: meetingId,
    });

    return await participant.save();
  }

  async update(
    id: string,
    updateParticipantDto: Partial<UpdateParticipantDto>,
  ): Promise<Participant | null> {
    return await this.participantModel
      .findByIdAndUpdate(id, updateParticipantDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Participant | null> {
    return this.participantModel.findByIdAndDelete(id).exec();
  }
}
