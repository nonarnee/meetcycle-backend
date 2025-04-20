import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  host: string; // 사용자 ID (ObjectId)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  maleParticipants?: string[]; // Participant ID 배열

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  femaleParticipants?: string[]; // Participant ID 배열

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateTime: Date;

  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed', 'cancelled'])
  status?: string = 'pending';

  @IsOptional()
  @IsNumber()
  @Min(1)
  roundDurationMinutes?: number = 10;
}
