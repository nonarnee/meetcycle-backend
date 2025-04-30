import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ParticipantPublicResponse } from 'src/modules/participant/dtos/response/participant-public.response';

export class MeetingResponse {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  hostId: string;

  @IsNotEmpty()
  @IsNumber()
  maleCount: number;

  @IsNotEmpty()
  @IsNumber()
  femaleCount: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  dateTime: string;

  @IsNotEmpty()
  @IsNumber()
  roomDurationMinutes: number;

  @IsNotEmpty()
  @IsNumber()
  totalCycles: number;

  @IsNotEmpty()
  @IsNumber()
  currentCycleOrder: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantPublicResponse)
  maleParticipants: ParticipantPublicResponse[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantPublicResponse)
  femaleParticipants: ParticipantPublicResponse[];
}
