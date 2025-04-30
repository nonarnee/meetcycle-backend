import { Types } from 'mongoose';
import { Room } from '../schemas/room.schema';
import { CreateRoomDto } from '../dtos';

export class RoomMapper {
  static toSchema(createRoomDto: CreateRoomDto): Room {
    return {
      cycle: new Types.ObjectId(createRoomDto.cycle),
      maleParticipant: new Types.ObjectId(createRoomDto.maleParticipant),
      femaleParticipant: new Types.ObjectId(createRoomDto.femaleParticipant),
      status: createRoomDto.status ?? 'pending',
      isMatched: createRoomDto.isMatched ?? false,
      maleLiked: createRoomDto.maleLiked ?? null,
      femaleLiked: createRoomDto.femaleLiked ?? null,
    };
  }
}
