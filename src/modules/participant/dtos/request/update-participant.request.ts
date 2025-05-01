import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';

import { Gender } from 'src/common/types/gender.type';
import { Types } from 'mongoose';

export class UpdateParticipantDto {
  @IsOptional()
  @IsMongoId()
  meeting?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  room?: Types.ObjectId;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  @Min(18)
  age?: number;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
