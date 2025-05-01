import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Participant,
  ParticipantDocument,
} from '../schemas/participant.schema';
import { CreateParticipantDto } from '../dtos/request/create-participant.request';
import { UpdateParticipantDto } from '../dtos/request/update-participant.request';
import { LeanDocument } from 'src/common/types/lean.type';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
  ) {}

  async findAll(): Promise<Participant[]> {
    return this.participantModel.find().exec();
  }

  async findOne(id: string): Promise<LeanDocument<Participant> | null> {
    return this.participantModel.findById(id).lean().exec();
  }

  async findByGender(gender: string): Promise<Participant[]> {
    return this.participantModel.find({ gender }).exec();
  }

  async findByMeeting(meetingId: string): Promise<LeanDocument<Participant>[]> {
    return this.participantModel.find({ meeting: meetingId }).lean().exec();
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
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant | null> {
    return this.participantModel
      .findByIdAndUpdate(id, updateParticipantDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Participant | null> {
    return this.participantModel.findByIdAndDelete(id).exec();
  }
}
