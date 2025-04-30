import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParticipantService } from '../services/participant.service';
import { CreateParticipantDto } from '../dtos/request/create-participant.request';
import { UpdateParticipantDto } from '../dtos/request/update-participant.request';
import { Participant } from '../schemas/participant.schema';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ParticipantPrivateResponse } from '../dtos/response/participant-private.response';

@Controller('participants')
export class ParticipantController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<ParticipantPrivateResponse> {
    const createdParticipant =
      await this.participantService.create(createParticipantDto);

    return {
      id: createdParticipant._id.toString(),
      nickname: createdParticipant.nickname,
      gender: createdParticipant.gender,
      age: createdParticipant.age,
      job: createdParticipant.job,
      comment: createdParticipant.comment,
      phone: createdParticipant.phone,
      userId: null,
    };
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
