import { Participant } from '../schemas/participant.schema';
import { ParticipantPublicResponse } from '../dtos/response/participant-public.response';
import { LeanDocument } from 'src/common/types/lean.type';
import { ParticipantPrivateResponse } from '../dtos/response/participant-private.response';

export class ParticipantMapper {
  static toPublicResponse(
    participant: LeanDocument<Participant>,
  ): ParticipantPublicResponse {
    return {
      _id: participant._id.toString(),
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      job: participant.job,
      comment: participant.comment,
    };
  }

  static toPrivateResponse(
    participant: LeanDocument<Participant>,
  ): ParticipantPrivateResponse {
    return {
      ...this.toPublicResponse(participant),
      phone: participant.phone,
    };
  }
}
