import { IsOptional, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoundDto {
  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  maleParticipantLiked?: boolean | null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  femaleParticipantLiked?: boolean | null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMatched?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date | null;
}
