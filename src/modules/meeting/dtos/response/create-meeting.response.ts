import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMeetingResponse {
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
  roundDurationMinutes: number;
}
