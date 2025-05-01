import { ParticipantPublicResponse } from 'src/modules/participant/dtos/response/participant-public.response';

export class CurrentRoomResponse {
  cycleId: string;
  roomId: string;
  order: number;
  endTime: Date;
  partner: ParticipantPublicResponse;
  me: ParticipantPublicResponse;
  result: boolean | null;
}
