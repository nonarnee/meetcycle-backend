import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLikeDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  maleLiked: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  femaleLiked: boolean;
}
