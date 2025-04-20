import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CycleService } from '../services/cycle.service';
import { Cycle } from '../schemas/cycle.schema';

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get()
  findAll(): Promise<Cycle[]> {
    return this.cycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.findOne(id);
  }

  @Post()
  create(@Body() cycle: Cycle): Promise<Cycle> {
    return this.cycleService.create(cycle);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() cycle: Cycle): Promise<Cycle | null> {
    return this.cycleService.update(id, cycle);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Cycle | null> {
    return this.cycleService.remove(id);
  }
}
