import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  hostId: string; // 호스트 ID (ObjectId)

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
  roundDurationMinutes: number;
}
