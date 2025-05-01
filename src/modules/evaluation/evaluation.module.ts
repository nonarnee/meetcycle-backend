import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation } from './evaluation.schema';
import { EvaluationSchema } from './evaluation.schema';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
