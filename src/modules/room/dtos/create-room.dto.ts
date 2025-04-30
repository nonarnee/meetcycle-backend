import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  cycle: string; // Cycle ID (ObjectId)

  @IsNotEmpty()
  @IsString()
  maleParticipant: string; // Participant ID (ObjectId)

  @IsNotEmpty()
  @IsString()
  femaleParticipant: string; // Participant ID (ObjectId)

  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed'])
  status?: string = 'pending';

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  maleLiked?: boolean | null = null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  femaleLiked?: boolean | null = null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMatched?: boolean = false;
}
