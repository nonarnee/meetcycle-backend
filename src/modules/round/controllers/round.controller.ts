import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { RoundService } from '../services/round.service';
import { Round } from '../schemas/round.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/types/user-role.type';

@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findAll(): Promise<Round[]> {
    return this.roundService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Round | null> {
    return this.roundService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  update(
    @Param('id') id: string,
    @Body() round: Partial<Round>,
  ): Promise<Round | null> {
    return this.roundService.update(id, round);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  remove(@Param('id') id: string): Promise<Round | null> {
    return this.roundService.remove(id);
  }

  @Get('meeting/:meetingId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findByMeeting(@Param('meetingId') meetingId: string): Promise<Round[]> {
    return this.roundService.findByMeeting(meetingId);
  }

  @Get('participant/:userId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findByParticipant(@Param('userId') userId: string): Promise<Round[]> {
    return this.roundService.findByParticipant(userId);
  }

  @Put(':id/like')
  updateLiked(
    @Param('id') id: string,
    @Body('gender') gender: 'male' | 'female',
    @Body('liked') liked: boolean,
  ): Promise<Round | null> {
    return this.roundService.updateLiked(id, gender, liked);
  }
}
