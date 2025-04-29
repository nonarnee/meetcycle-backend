import { IsNotEmpty, IsString } from 'class-validator';
import { ParticipantPublicResponse } from './participant-public.response';

export class ParticipantPrivateResponse extends ParticipantPublicResponse {
  @IsNotEmpty()
  @IsString()
  phone: string;
}
