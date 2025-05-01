import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ParticipantPublicResponse {
  @IsNotEmpty()
  @IsString()
  _id: string;

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
}
