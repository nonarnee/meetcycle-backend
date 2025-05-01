import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  hostId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

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

  @IsNumber()
  @Min(1)
  roomDurationMinutes: number;
}
