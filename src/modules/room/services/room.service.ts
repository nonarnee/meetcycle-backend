import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';
import { Cycle, CycleDocument } from 'src/modules/cycle/schemas/cycle.schema';
import { LeanDocument } from 'src/common/types/lean.type';
import { Participant } from 'src/modules/participant/schemas/participant.schema';
import { PopulatedRoom } from '../interfaces/populated-room.interface';
import { CycleService } from 'src/modules/cycle/services/cycle.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,

    @Inject(forwardRef(() => CycleService))
    private cycleService: CycleService,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomModel
      .find()
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }

  async findOne(id: string): Promise<Room | null> {
    return this.roomModel
      .findById(id)
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }

  async findByCycle(cycle: CycleDocument) {
    return this.roomModel
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

  async findOneByParticipant(
    participantId: string,
  ): Promise<PopulatedRoom | null> {
    return this.roomModel
      .findOne({
        $or: [
          { maleParticipant: participantId },
          { femaleParticipant: participantId },
        ],
      })
      .sort({ createdAt: -1 })
      .populate<LeanDocument<Cycle>>('cycle')
      .populate<LeanDocument<Participant>>('maleParticipant')
      .populate<LeanDocument<Participant>>('femaleParticipant')
      .lean<PopulatedRoom>()
      .exec();
  }

  async create(room: Room) {
    return await this.roomModel.create(room);
  }

  async update(id: string, room: Partial<Room>): Promise<Room | null> {
    return this.roomModel.findByIdAndUpdate(id, room, { new: true }).exec();
  }

  async updateAllStatus(cycleId: Types.ObjectId, status: string) {
    return this.roomModel.updateMany({ cycle: cycleId }, { status }).exec();
  }

  async remove(id: string): Promise<Room | null> {
    return this.roomModel.findByIdAndDelete(id).exec();
  }

  async findByMeeting(meetingId: string): Promise<LeanDocument<Room>[]> {
    const cycles = await this._findCyclesByMeeting(meetingId);
    return this._findRoomsByCycles(cycles);
  }

  private async _findCyclesByMeeting(meetingId: string) {
    return this.cycleService.findByMeeting(meetingId);
  }

  private async _findRoomsByCycles(cycles: LeanDocument<Cycle>[]) {
    return this.roomModel
      .find({
        cycle: { $in: cycles.map((cycle) => cycle._id) },
      })
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

  async findByParticipant(userId: string): Promise<Room[]> {
    return this.roomModel
      .find({
        $or: [{ maleParticipant: userId }, { femaleParticipant: userId }],
      })
      .populate('maleParticipant')
      .populate('femaleParticipant')
      .exec();
  }
}
