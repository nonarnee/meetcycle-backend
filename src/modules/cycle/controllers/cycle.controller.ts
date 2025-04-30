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
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/types/user-role.type';

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findAll(@Query('meetingId') meetingId?: string): Promise<Cycle[]> {
    if (meetingId) {
      return this.cycleService.findByMeeting(meetingId);
    }
    return this.cycleService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findOne(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  update(
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
  ): Promise<Cycle | null> {
    return this.cycleService.update(id, updateCycleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  remove(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.remove(id);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Cycle | null> {
    return this.cycleService.updateStatus(id, status);
  }
}
