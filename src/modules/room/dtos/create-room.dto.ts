import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  cycle: string; // Cycle ID (ObjectId)

  @IsNotEmpty()
  @IsString()
  maleParticipant: string; // Participant ID (ObjectId)

  @IsNotEmpty()
  @IsString()
  femaleParticipant: string; // Participant ID (ObjectId)
}
