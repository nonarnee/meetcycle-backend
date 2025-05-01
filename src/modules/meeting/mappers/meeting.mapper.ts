import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { Meeting } from '../schemas/meeting.schema';
import { CreateMeetingResponse } from '../dtos/response/create-meeting.response';
import { LeanDocument } from 'src/common/types/lean.type';
import { Types } from 'mongoose';

export class MeetingMapper {
  static toSchema(createMeetingDto: CreateMeetingDto): Meeting {
    return {
      title: createMeetingDto.title,
      host: new Types.ObjectId(createMeetingDto.hostId),
      maleCount: createMeetingDto.maleCount,
      femaleCount: createMeetingDto.femaleCount,
      location: createMeetingDto.location,
      dateTime: createMeetingDto.dateTime,
      status: 'pending',
      currentCycleOrder: 0,
      roomDurationMinutes: createMeetingDto.roomDurationMinutes,
    };
  }

  static toCreateResponse(
    meeting: LeanDocument<Meeting>,
  ): CreateMeetingResponse {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      hostId: meeting.host.toString(),
      maleCount: meeting.maleCount,
      femaleCount: meeting.femaleCount,
      location: meeting.location,
      dateTime: meeting.dateTime,
      roomDurationMinutes: meeting.roomDurationMinutes,
    };
  }
}
