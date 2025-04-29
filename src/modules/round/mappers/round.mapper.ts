import { Types } from 'mongoose';
import { Round } from '../schemas/round.schema';
import { CreateRoundDto } from '../dtos/create-round.dto';

export class RoundMapper {
  static toSchema(createRoundDto: CreateRoundDto): Round {
    return {
      cycle: new Types.ObjectId(createRoundDto.cycle),
      maleParticipant: new Types.ObjectId(createRoundDto.maleParticipant),
      femaleParticipant: new Types.ObjectId(createRoundDto.femaleParticipant),
      status: createRoundDto.status ?? 'pending',
      isMatched: createRoundDto.isMatched ?? false,
      maleLiked: createRoundDto.maleLiked ?? null,
      femaleLiked: createRoundDto.femaleLiked ?? null,
    };
  }
}
