import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLikeDto {
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  participantType: string; // 'male' 또는 'female'

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  liked: boolean;
}
