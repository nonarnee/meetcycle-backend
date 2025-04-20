import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

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
