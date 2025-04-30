import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCycleDto {
  @IsNotEmpty()
  @IsString()
  meeting: string; // Meeting ID (ObjectId)

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  order: number;

  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed'])
  status?: string = 'pending';

  @IsString()
  @Transform(({ value }: { value: string }) => new Date(value))
  endTime: Date;
}
