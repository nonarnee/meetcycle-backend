import { IsOptional, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomDto {
  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  maleLiked?: boolean | null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  femaleLiked?: boolean | null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMatched?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date | null;
}
