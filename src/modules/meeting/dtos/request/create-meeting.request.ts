import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMeetingDto {
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  maleParticipants?: string[] = []; // Participant ID 배열

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  femaleParticipants?: string[] = []; // Participant ID 배열

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
