import {
  IsString,
  IsDate,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  maleParticipants?: string[]; // 사용자 ID 배열

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  femaleParticipants?: string[]; // 사용자 ID 배열

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTime?: Date;

  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  roomDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCycles?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentCycleOrder?: number;
}
