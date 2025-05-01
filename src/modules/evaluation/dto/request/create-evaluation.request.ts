import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateEvaluationRequest {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsBoolean()
  result: boolean;
}
