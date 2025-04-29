import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cycle, CycleSchema } from './schemas/cycle.schema';
import { CycleController } from './controllers/cycle.controller';
import { CycleService } from './services/cycle.service';
import { RoundModule } from '../round/round.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cycle.name, schema: CycleSchema }]),
    RoundModule,
  ],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
