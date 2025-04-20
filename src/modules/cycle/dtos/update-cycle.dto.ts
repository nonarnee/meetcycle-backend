import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class UpdateCycleDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsEnum(['pending', 'ongoing', 'completed'])
  status?: string;

  @IsOptional()
  allRoundsCompleted?: boolean;
}
