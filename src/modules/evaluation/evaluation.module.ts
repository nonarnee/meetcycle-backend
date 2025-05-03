import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation } from './evaluation.schema';
import { EvaluationSchema } from './evaluation.schema';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { ParticipantModule } from '../participant/participant.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
    RoomModule,
    forwardRef(() => ParticipantModule),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
