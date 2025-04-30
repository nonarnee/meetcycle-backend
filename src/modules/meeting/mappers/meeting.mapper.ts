import { CreateMeetingDto } from '../dtos/request/create-meeting.request';
import { Meeting } from '../schemas/meeting.schema';
import { CreateMeetingResponse } from '../dtos/response/create-meeting.response';
import { LeanSchema } from 'src/common/types/lean.type';
import { Types } from 'mongoose';
import { MeetingResponse } from '../dtos/response/meeting.response';
import { MeetingPopulated } from 'src/common/types/populated/meeting-populated.type';

export class MeetingMapper {
  private static calculateTotalCycles(
    maleCount: number,
    femaleCount: number,
  ): number {
    return Math.ceil((maleCount + femaleCount) / 2);
  }

  static toSchema(createMeetingDto: CreateMeetingDto): Meeting {
    const totalCycles = this.calculateTotalCycles(
      createMeetingDto.maleCount,
      createMeetingDto.femaleCount,
    );

    return {
      title: createMeetingDto.title,
      host: new Types.ObjectId(createMeetingDto.hostId),
      maleCount: createMeetingDto.maleCount,
      femaleCount: createMeetingDto.femaleCount,
      maleParticipants: [],
      femaleParticipants: [],
      location: createMeetingDto.location,
      dateTime: createMeetingDto.dateTime,
      status: 'pending',
      totalCycles,
      currentCycleOrder: 0,
      roomDurationMinutes: createMeetingDto.roomDurationMinutes,
    };
  }

  static toCreateResponse(meeting: LeanSchema<Meeting>): CreateMeetingResponse {
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

  static toDetailResponse(meeting: MeetingPopulated): MeetingResponse {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      hostId: meeting.host.toString(),
      maleCount: meeting.maleCount,
      femaleCount: meeting.femaleCount,
      location: meeting.location,
      dateTime: meeting.dateTime,
      roomDurationMinutes: meeting.roomDurationMinutes,
      totalCycles: meeting.totalCycles,
      currentCycleOrder: meeting.currentCycleOrder,
      status: meeting.status,
      maleParticipants: meeting.maleParticipants.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        userId: rest.user?.toString() || null,
        ...rest,
      })),
      femaleParticipants: meeting.femaleParticipants.map(
        ({ _id, ...rest }) => ({
          id: _id.toString(),
          userId: rest.user?.toString() || null,
          ...rest,
        }),
      ),
    };
  }
}
