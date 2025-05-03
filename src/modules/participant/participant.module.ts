import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantController } from './controllers/participant.controller';
import { ParticipantService } from './services/participant.service';
import { Participant, ParticipantSchema } from './schemas/participant.schema';
import { EvaluationModule } from 'src/modules/evaluation/evaluation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
    forwardRef(() => EvaluationModule),
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
