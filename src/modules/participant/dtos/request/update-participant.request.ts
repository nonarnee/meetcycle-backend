import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from 'src/common/types/gender.type';

export class UpdateParticipantDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  name?: string;

  @IsOptional()
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  @Min(18)
  age?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  job?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  comment?: string;
}
