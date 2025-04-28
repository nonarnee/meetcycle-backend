import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ParticipantResponse {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  userId: string | null;
}
