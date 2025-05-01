import { Types } from 'mongoose';
import { CreateCycleDto } from '../dtos/create-cycle.dto';
import { Cycle } from '../schemas/cycle.schema';

export class CycleMapper {
  static toSchema(createCycleDto: CreateCycleDto): Cycle {
    return {
      meeting: new Types.ObjectId(createCycleDto.meeting),
      order: createCycleDto.order,
      endTime: createCycleDto.endTime,
    };
  }
}
