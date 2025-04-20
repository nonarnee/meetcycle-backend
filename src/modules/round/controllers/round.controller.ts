import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoundService } from '../services/round.service';
import { Round } from '../schemas/round.schema';

@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get()
  findAll(): Promise<Round[]> {
    return this.roundService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Round | null> {
    return this.roundService.findOne(id);
  }

  @Post()
  create(@Body() round: Round): Promise<Round> {
    return this.roundService.create(round);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() round: Partial<Round>,
  ): Promise<Round | null> {
    return this.roundService.update(id, round);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Round | null> {
    return this.roundService.remove(id);
  }

  @Get('meeting/:meetingId')
  findByMeeting(@Param('meetingId') meetingId: string): Promise<Round[]> {
    return this.roundService.findByMeeting(meetingId);
  }

  @Get('participant/:userId')
  findByParticipant(@Param('userId') userId: string): Promise<Round[]> {
    return this.roundService.findByParticipant(userId);
  }

  @Put(':id/like')
  updateLiked(
    @Param('id') id: string,
    @Body('participantNumber') participantNumber: 1 | 2,
    @Body('liked') liked: boolean,
  ): Promise<Round | null> {
    return this.roundService.updateLiked(id, participantNumber, liked);
  }
}
