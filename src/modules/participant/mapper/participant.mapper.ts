import { Participant } from '../schemas/participant.schema';
import { ParticipantResponse } from '../dtos/response/participant.response';
import { LeanSchema } from 'src/common/types/lean.type';

export class ParticipantMapper {
  static toResponse(participant: LeanSchema<Participant>): ParticipantResponse {
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
}
