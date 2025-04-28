import { User } from 'src/modules/user/schemas/user.schema';
import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { Meeting } from '../schemas/meeting.schema';
import { CreateMeetingResponse } from '../dtos/response/create-meeting.response';
import { LeanSchema } from 'src/common/types/lean.type';

export class MeetingMapper {
  static toSchema(createMeetingDto: CreateMeetingDto, hostUser: User): Meeting {
    return {
      title: createMeetingDto.title,
      host: hostUser,
      maleCount: createMeetingDto.maleCount,
      femaleCount: createMeetingDto.femaleCount,
      maleParticipants: [],
      femaleParticipants: [],
      location: createMeetingDto.location,
      dateTime: createMeetingDto.dateTime,
      status: 'pending',
      totalCycles: 0,
      currentCycleOrder: 0,
      roundDurationMinutes: createMeetingDto.roundDurationMinutes,
    };
  }

  static toResponse(
    meeting: LeanSchema<Meeting>,
    hostId: string,
  ): CreateMeetingResponse {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      hostId: hostId,
      maleCount: meeting.maleCount,
      femaleCount: meeting.femaleCount,
      location: meeting.location,
      dateTime: meeting.dateTime,
      roundDurationMinutes: meeting.roundDurationMinutes,
    };
  }
}
