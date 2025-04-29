import { Participant } from '../schemas/participant.schema';
import { ParticipantPublicResponse } from '../dtos/response/participant-public.response';
import { LeanSchema } from 'src/common/types/lean.type';
import { ParticipantPrivateResponse } from '../dtos/response/participant-private.response';

export class ParticipantMapper {
  static toPublicResponse(
    participant: LeanSchema<Participant>,
  ): ParticipantPublicResponse {
    return {
      id: participant._id.toString(),
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      job: participant.job,
      comment: participant.comment,
      userId: participant.user?._id?.toString() ?? null,
    };
  }

  static toPrivateResponse(
    participant: LeanSchema<Participant>,
  ): ParticipantPrivateResponse {
    return {
      ...this.toPublicResponse(participant),
      phone: participant.phone,
    };
  }
}
