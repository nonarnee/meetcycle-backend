import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateParticipantDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

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
