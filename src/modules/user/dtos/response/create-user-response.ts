import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserResponse {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
