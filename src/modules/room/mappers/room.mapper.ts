import { Types } from 'mongoose';
import { Room } from '../schemas/room.schema';
import { CreateRoomDto } from '../dtos';

export class RoomMapper {
  static toSchema(createRoomDto: CreateRoomDto): Room {
    return {
      cycle: new Types.ObjectId(createRoomDto.cycle),
      maleParticipant: new Types.ObjectId(createRoomDto.maleParticipant),
      femaleParticipant: new Types.ObjectId(createRoomDto.femaleParticipant),
    };
  }
}
