import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from 'src/common/types/gender.type';

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  nickname: string;

  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  age: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  job: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  comment: string;

  @IsOptional()
  @IsString()
  userId?: string; // User ID와 연결 (필요한 경우)
}
