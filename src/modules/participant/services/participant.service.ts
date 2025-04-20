import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Participant,
  ParticipantDocument,
} from '../schemas/participant.schema';
import { CreateParticipantDto } from '../dtos/create-participant.dto';
import { UpdateParticipantDto } from '../dtos/update-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
  ) {}

  async findAll(): Promise<Participant[]> {
    return this.participantModel.find().exec();
  }

  async findOne(id: string): Promise<Participant | null> {
    return this.participantModel.findById(id).exec();
  }

  async findByGender(gender: string): Promise<Participant[]> {
    return this.participantModel.find({ gender }).exec();
  }

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    const newParticipant = new this.participantModel(createParticipantDto);
    return newParticipant.save();
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
