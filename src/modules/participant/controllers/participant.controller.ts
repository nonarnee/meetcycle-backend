import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ParticipantService } from '../services/participant.service';
import { CreateParticipantDto } from '../dtos/create-participant.dto';
import { UpdateParticipantDto } from '../dtos/update-participant.dto';
import { Participant } from '../schemas/participant.schema';

@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  create(
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  findAll(@Query('gender') gender?: string): Promise<Participant[]> {
    if (gender) {
      return this.participantService.findByGender(gender);
    }
    return this.participantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Participant | null> {
    return this.participantService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant | null> {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Participant | null> {
    return this.participantService.remove(id);
  }
}
