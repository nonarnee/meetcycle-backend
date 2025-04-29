import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CycleService } from '../services/cycle.service';
import { UpdateCycleDto } from '../dtos/update-cycle.dto';
import { Cycle } from '../schemas/cycle.schema';

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get()
  findAll(@Query('meetingId') meetingId?: string): Promise<Cycle[]> {
    if (meetingId) {
      return this.cycleService.findByMeeting(meetingId);
    }
    return this.cycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
  ): Promise<Cycle | null> {
    return this.cycleService.update(id, updateCycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.remove(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Cycle | null> {
    return this.cycleService.updateStatus(id, status);
  }

  @Put(':id/complete')
  setAllRoundsCompleted(
    @Param('id') id: string,
    @Body('completed') completed: boolean,
  ): Promise<Cycle | null> {
    return this.cycleService.setAllRoundsCompleted(id, completed);
  }
}
