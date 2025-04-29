import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Gender } from 'src/common/types/gender.type';

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  userId?: string; // User ID와 연결 (필요한 경우)
}
